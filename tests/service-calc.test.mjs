import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';

const folder = await mkdtemp(join(tmpdir(), 'vysluha-tests-'));
after(() => rm(folder, { recursive: true, force: true }));
for (const name of ['types', 'service-rules', 'service-calc', 'storage']) {
  const source = await readFile(new URL(`../src/lib/${name}.ts`, import.meta.url), 'utf8');
  const output = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext } }).outputText;
  await writeFile(join(folder, `${name}.mjs`), output.replace(/from "\.\/(.*?)"/g, 'from "./$1.mjs"'));
}
const { computeServiceTotals: compute, periodDuration360: duration, formatDays360 } = await import(pathToFileURL(join(folder, 'service-calc.mjs')));
const { parseImported } = await import(pathToFileURL(join(folder, 'storage.mjs')));
const record = (startDate, endDate) => ({ startDate, endDate, position: '', place: '' });
const extra = (coefficient, startDate = '2024-01-01', endDate = '2024-01-31') => ({ startDate, endDate, coefficient, studyEligible: true });
const calc = (records = [], extras = []) => compute(records, extras, '2024-12-31');

for (const [start, end, expected] of [
  ['2024-01-01', '2024-01-31', 30], ['2024-02-01', '2024-02-29', 30],
  ['2023-02-01', '2023-02-28', 30], ['2024-01-01', '2024-12-31', 360],
  ['2024-01-31', '2024-01-31', 1], ['2024-02-29', '2024-02-29', 1],
  ['2024-01-30', '2024-01-31', 2], ['2024-02-27', '2024-02-29', 3],
  ['2024-12-31', '2025-01-01', 2],
]) test(`Тривалість ${start}–${end}: ${expected}`, () => assert.equal(duration(start, end), expected));

test('Некоректні й обернені дати не нормалізуються мовчки', () => {
  for (const [a, b] of [['2023-02-29', '2023-03-01'], ['2024-04-31', '2024-05-01'], ['', '2024-01-01'], ['2024-02-01', '2024-01-01']]) assert.equal(duration(a, b), null);
  assert.equal(calc([record('2024-04-31', '2024-05-01')]).warnings.length, 1);
});
for (const [coefficient, expected] of [['calendar', 30], ['fortyDays', 40], ['oneHalf', 45], ['double', 60], ['preferential', 90], ['study', 15], ['none', 0]]) {
  test(`Коефіцієнт ${coefficient}: місяць → ${expected}`, () => assert.equal(calc([], [extra(coefficient)]).grandTotal, expected));
}
test('Найбільша пільга, календарна частина лише один раз', () => {
  const result = calc([record('2024-01-01', '2024-01-31')], ['preferential', 'double', 'oneHalf', 'fortyDays'].map(c => extra(c)));
  assert.equal(result.calendarTotal, 30); assert.equal(result.preferentialBonus, 60); assert.equal(result.grandTotal, 90);
});
test('Суміжні й дубльовані періоди не змінюють повний місяць', () => {
  const result = calc([record('2024-01-01', '2024-01-15'), record('2024-01-15', '2024-01-30'), record('2024-01-31', '2024-01-31')], [extra('calendar', '2024-01-05', '2024-01-09')]);
  assert.equal(result.calendarTotal, 30);
});
test('Зайві межі слабшої пільги не змінюють результат', () => {
  assert.equal(calc([], [extra('preferential'), extra('double', '2024-01-31', '2024-01-31')]).grandTotal, 90);
});
test('Часткові перетини застосовують максимум', () => {
  const result = calc([record('2024-01-01', '2024-01-10')], [extra('double', '2024-01-01', '2024-01-05'), extra('preferential', '2024-01-04', '2024-01-07')]);
  assert.equal(result.calendarTotal, 10); assert.equal(result.preferentialBonus, 11); assert.equal(result.grandTotal, 21);
});
test('Виключення має пріоритет і поза службою нічого не віднімає', () => {
  const result = calc([record('2024-01-01', '2024-01-10')], [extra('preferential', '2024-01-01', '2024-01-10'), extra('none', '2024-01-05', '2024-01-05'), extra('none', '2024-03-01', '2024-03-31')]);
  assert.equal(result.calendarTotal, 9); assert.equal(result.excluded, 1); assert.equal(result.grandTotal, 27);
});
test('Ліміт навчання спільний; перетини не дублюються', () => {
  const result = calc([], [extra('study', '2010-01-01', '2013-12-31'), extra('study', '2012-01-01', '2015-12-31')]);
  assert.equal(result.studyCounted, 900); assert.equal(result.studyCapped, true); assert.equal(result.appointmentTotal, 900);
});
test('Навчання потребує підтвердження, не додається поверх служби', () => {
  assert.equal(calc([], [{ ...extra('study'), studyEligible: false }]).studyCounted, 0);
  assert.equal(calc([record('2024-01-01', '2024-01-31')], [extra('study')]).studyCounted, 0);
});
test('Дробові дні не округлюються вгору до цілих', () => {
  assert.equal(calc([], [extra('study', '2024-01-31', '2024-01-31')]).grandTotal, 0.5);
  assert.equal(formatDays360(0.5), '0,5 дн.');
  assert.equal(calc([], [extra('fortyDays', '2024-01-01', '2024-01-03')]).grandTotal, 4);
});
test('Дата розрахунку обмежує закриті й відкриті періоди', () => {
  assert.equal(compute([record('2024-01-01', '')], [], '2024-01-31').grandTotal, 30);
  assert.equal(compute([record('2024-01-01', '2025-01-01')], [], '2024-01-31').grandTotal, 30);
  assert.equal(compute([record('2024-02-01', '2024-03-01')], [], '2024-01-31').grandTotal, 0);
});
test('Імпорт зберігає всі коефіцієнти та підтвердження', () => {
  const extras = ['calendar', 'fortyDays', 'oneHalf', 'double', 'preferential', 'study', 'none'].map(c => ({ ...extra(c), note: 'Наказ №1' }));
  assert.deepEqual(parseImported(JSON.stringify({ extras })).extras, extras);
  assert.equal(parseImported(JSON.stringify({ extras: [{ ...extra('preferential'), studyEligible: undefined }] })).extras[0].coefficient, 'preferential');
  assert.equal(parseImported(JSON.stringify({ extras: [{ ...extra('study'), studyEligible: undefined }] })).extras[0].studyEligible, false);
  assert.throws(() => parseImported(JSON.stringify({ extras: [extra('unknown')] })), /Невідомий коефіцієнт/);
});

for (const [start, end] of [['2024-01-01', '2024-01-31'], ['2024-02-01', '2024-02-29']]) {
  test(`Підвищення ×2 до ×3 на останній день ${end} додає рівно день`, () => {
    const result = calc([], [extra('double', start, end), extra('preferential', end, end)]);
    assert.equal(result.calendarTotal, 30);
    assert.equal(result.preferentialBonus, 31);
    assert.equal(result.grandTotal, 61);
  });
}

test('Вкладені коефіцієнти зберігають спільну пільгову частину місяця', () => {
  const result = calc([], [extra('fortyDays'), extra('oneHalf', '2024-01-31', '2024-01-31')]);
  assert.ok(Math.abs(result.preferentialBonus - (10 + 1 / 6)) < 1e-10);
});

test('Усі пари пільг: підвищення на один день, кожний місяць звичайного і високосного року', () => {
  const rates = [['fortyDays', 4 / 3], ['oneHalf', 1.5], ['double', 2], ['preferential', 3]];
  for (const year of [2023, 2024]) for (let month = 1; month <= 12; month++) {
    const start = `${year}-${String(month).padStart(2, '0')}-01`;
    const end = `${year}-${String(month).padStart(2, '0')}-${new Date(Date.UTC(year, month, 0)).getUTCDate()}`;
    for (let lower = 0; lower < rates.length; lower++) for (let higher = lower + 1; higher < rates.length; higher++) {
      const periods = [extra(rates[lower][0], start, end), extra(rates[higher][0], end, end)];
      const expected = 30 * rates[lower][1] + rates[higher][1] - rates[lower][1];
      const result = calc([], periods);
      assert.ok(Math.abs(result.grandTotal - expected) < 1e-9, `${start}: ${rates[lower][0]} → ${rates[higher][0]}`);
      assert.deepEqual(calc([], periods.toReversed()), result);
      assert.deepEqual(calc([], [...periods, ...periods]), result);
    }
  }
});
