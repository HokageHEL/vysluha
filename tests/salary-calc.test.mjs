import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';

const folder = await mkdtemp(join(tmpdir(), 'salary-tests-'));
after(() => rm(folder, { recursive: true, force: true }));

for (const name of ['salary-data', 'salary-calc']) {
  const source = await readFile(new URL(`../src/lib/${name}.ts`, import.meta.url), 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext }
  }).outputText;
  await writeFile(join(folder, `${name}.mjs`), output.replace(/from "\.\/(.*?)"/g, 'from "./$1.mjs"'));
}

const {
  calculateSalary,
  buildSalaryResultRows,
  DEFAULT_SALARY_FORM_DATA,
} = await import(pathToFileURL(join(folder, 'salary-calc.mjs')));

const {
  matchRankToSalaryRankIndex,
  matchSeniorityYearsToIndex,
  SALARY_RANKS,
  TARIFF_GRADES,
} = await import(pathToFileURL(join(folder, 'salary-data.mjs')));

test('Базовий розрахунок: солдат, 1 тарифний розряд, вислуга до 1 року', () => {
  const res = calculateSalary({
    ...DEFAULT_SALARY_FORM_DATA,
    rankIndex: 1, // Солдат, матрос
    tariffIndex: 0, // 1 розряд
    seniorityIndex: 0, // до 1 року
    month: 9, // вересень (30 днів)
    year: 2026,
  });

  assert.equal(res.ovz, 530);
  assert.equal(res.baseSalary, 2470);
  assert.equal(res.seniorityBonus, 0);
  assert.equal(res.nopsBonus, 1950);
  assert.equal(res.premiumAmount, 15635.1);
  assert.equal(res.monthlySalaryTotal, 20585.1);
  // За повний місяць без бойових нараховується тилова надбавка 10 000 грн
  assert.equal(res.tilovaNadavkaAmount, 10000);
  assert.equal(res.grossTotal, 30585.1);
  assert.equal(res.militaryTaxActual, 458.78);
  assert.equal(res.netPay, 30126.32);

  const rows = buildSalaryResultRows(res);
  const finalRow = rows.find(r => r.rowType === 'final');
  assert.equal(finalRow?.value, 30126.32);
});

test('Офіцерська посада: майор (15 розряд, 30 тариф, вислуга 15-20 років)', () => {
  const res = calculateSalary({
    ...DEFAULT_SALARY_FORM_DATA,
    rankIndex: 15, // Майор
    tariffIndex: 29, // 30 розряд (5920 грн)
    seniorityIndex: 4, // 40%
    hasSecrecy: true,
    secrecyIndex: 1, // Таємно
    secrecyDirectWork: true, // 30%
    dv100combatEnabled: true,
    dv100combatDays: 20,
    month: 9, // 30 днів
    year: 2026,
  });

  assert.equal(res.ovz, 1340);
  assert.equal(res.baseSalary, 5920);
  assert.equal(res.seniorityPercent, 40);
  assert.equal(res.seniorityBonus, 2904);
  assert.equal(res.nopsBonus, 6606.6);
  assert.equal(res.secrecyBonus, 1776);
  assert.equal(res.premiumAmount, 23088);
  assert.equal(res.monthlySalaryTotal, 41634.6);

  // Бойові: 100 000 / 30 * 20 = 66666.67
  assert.equal(res.dv100combatAmount, 66666.67);
  // Тилова: 10 000 / 30 * 10 = 3333.33
  assert.equal(res.tilovaNadavkaAmount, 3333.33);
  assert.equal(res.additionalRewardsTotal, 70000);

  // Пільга з ВЗ для бойових днів
  assert.ok(res.militaryTaxExemption > 0);
  assert.ok(res.netPay > 110000);
});

test('Обмеження ліміту 460 000 грн для максимальних бойових виплат', () => {
  const res = calculateSalary({
    ...DEFAULT_SALARY_FORM_DATA,
    rankIndex: 14, // Капітан
    tariffIndex: 20,
    month: 1, // січень (31 день)
    year: 2026,
    cat170Enabled: true,
    cat170Days: 31, // 170 000
    dv100combatEnabled: true,
    dv100combatDays: 31, // 100 000
    stormCaptureEnabled: true,
    stormCaptureDays: 6, // 6 * 40 000 = 240 000
  });

  // 170k + 100k + 240k = 510 000 > 460 000
  assert.equal(res.limitAmount, 510000);
  assert.equal(res.limitCap, 460000);
  assert.equal(res.limitCapped, 460000);
  assert.equal(res.limitApplied, true);

  const rows = buildSalaryResultRows(res);
  const limitRow = rows.find(r => r.name.includes('Перевищено ліміт'));
  assert.ok(limitRow);
  assert.equal(limitRow?.value, 50000);
});

test('Винагороди за взяття в полон та знищену живу силу', () => {
  const res = calculateSalary({
    ...DEFAULT_SALARY_FORM_DATA,
    prisonerCount: 2,
    prisonerParticipants: 4, // 100k * 2 / 4 = 50 000
    destroyedCount: 3,
    destroyedParticipants: 2, // 15k * 3 / 2 = 22 500
    month: 9,
    year: 2026,
  });

  assert.equal(res.prisonerAmount, 50000);
  assert.equal(res.prisonerRewardShare, 25);
  assert.equal(res.destroyedAmount, 22500);
  assert.equal(res.destroyedRewardShare, 50);
});

test('Мапінг військових звань та стажу вислуги', () => {
  assert.equal(matchRankToSalaryRankIndex('солдат'), 1);
  assert.equal(matchRankToSalaryRankIndex('старший сержант'), 5);
  assert.equal(matchRankToSalaryRankIndex('капітан'), 14);
  assert.equal(matchRankToSalaryRankIndex('майор'), 15);
  assert.equal(matchRankToSalaryRankIndex('полковник'), 17);
  assert.equal(matchRankToSalaryRankIndex('генерал'), 21);
  assert.equal(matchRankToSalaryRankIndex('матрос'), 1);
  assert.equal(matchRankToSalaryRankIndex('капітан 2 рангу'), 16);

  assert.equal(matchSeniorityYearsToIndex(0.5), 0);
  assert.equal(matchSeniorityYearsToIndex(3), 1);
  assert.equal(matchSeniorityYearsToIndex(7), 2);
  assert.equal(matchSeniorityYearsToIndex(12), 3);
  assert.equal(matchSeniorityYearsToIndex(17), 4);
  assert.equal(matchSeniorityYearsToIndex(22), 5);
  assert.equal(matchSeniorityYearsToIndex(27), 6);
});
