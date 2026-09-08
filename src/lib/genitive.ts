// Родовий відмінок для шапки витягу: «майора ІВАНЕНКА Івана Івановича».
// Звання відмінюються за правилом і збігаються з довідником; ПІБ — евристика,
// тому згенерований рядок у формі завжди можна виправити руками.

type Gender = "male" | "female";

// «старший» → «старшого», «рядовий» → «рядового»
function adjectiveGenitive(word: string): string {
  if (word.endsWith("ій")) return `${word.slice(0, -2)}ього`;
  if (word.endsWith("ий")) return `${word.slice(0, -2)}ого`;
  return word;
}

const isAdjective = (word: string) => /(ий|ій)$/.test(word);

// «капітан» → «капітана», «старшина» → «старшини»
function rankNounGenitive(word: string): string {
  return word.endsWith("а") ? `${word.slice(0, -1)}и` : `${word}а`;
}

// Відмінюються лише прикметники перед званням і саме звання.
// Хвіст лишається як є: «капітана 3 рангу», «старшини 2 статті».
export function rankGenitive(rank: string): string {
  const words = rank.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";

  const noun = words.findIndex((word) => !isAdjective(word));
  // «рядовий» — саме звання має форму прикметника
  if (noun === -1) return words.map(adjectiveGenitive).join(" ");

  return words
    .map((word, i) => {
      if (i < noun) return adjectiveGenitive(word);
      if (i === noun) return rankNounGenitive(word);
      return word;
    })
    .join(" ");
}

// По батькові — єдина надійна ознака статі в ПІБ
function guessGender(middleName: string): Gender {
  return /вна$/i.test(middleName.trim()) ? "female" : "male";
}

function lastNameGenitive(name: string, gender: Gender): string {
  if (!name) return "";
  if (gender === "female") {
    // прикметникові: Ковальська → Ковальської, Іванова → Іванової
    if (/(ська|цька|зька|ова|ева|єва|іна|їна)$/.test(name))
      return `${name.slice(0, -1)}ої`;
    if (/я$/.test(name)) return `${name.slice(0, -1)}і`;
    if (/а$/.test(name)) return `${name.slice(0, -1)}и`;
    // чоловіча за формою — у жінки не відмінюється: Коваль
    return name;
  }
  if (isAdjective(name)) return adjectiveGenitive(name);
  if (/о$/.test(name)) return `${name.slice(0, -1)}а`; // Іваненко → Іваненка
  if (/я$/.test(name)) return `${name.slice(0, -1)}і`;
  if (/а$/.test(name)) return `${name.slice(0, -1)}и`;
  if (/[ьй]$/.test(name)) return `${name.slice(0, -1)}я`; // Гоголь → Гоголя
  return `${name}а`; // Ткачук → Ткачука
}

function firstNameGenitive(name: string, gender: Gender): string {
  if (!name) return "";
  if (gender === "female") {
    if (/ія$/.test(name)) return `${name.slice(0, -1)}ї`; // Марія → Марії
    if (/я$/.test(name)) return `${name.slice(0, -1)}і`; // Наталя → Наталі
    if (/а$/.test(name)) return `${name.slice(0, -1)}и`; // Олена → Олени
    return `${name}і`; // Любов → Любові
  }
  if (/й$/.test(name)) return `${name.slice(0, -1)}я`; // Сергій → Сергія
  if (/о$/.test(name)) return `${name.slice(0, -1)}а`; // Петро → Петра
  if (/я$/.test(name)) return `${name.slice(0, -1)}і`; // Ілля → Іллі
  if (/а$/.test(name)) return `${name.slice(0, -1)}и`; // Микита → Микити
  if (/ь$/.test(name)) return `${name.slice(0, -1)}я`; // Василь → Василя
  return `${name}а`; // Іван → Івана
}

function middleNameGenitive(name: string, gender: Gender): string {
  if (!name) return "";
  if (gender === "female") return `${name.slice(0, -1)}и`; // Сергіївна → Сергіївни
  return `${name}а`; // Іванович → Івановича
}

// «ІВАНЕНКА Івана Івановича» — прізвище великими літерами, як у витягу
export function fullNameGenitive(person: {
  lastName: string;
  firstName: string;
  middleName: string;
}): string {
  const gender = guessGender(person.middleName);
  return [
    lastNameGenitive(person.lastName.trim(), gender).toLocaleUpperCase("uk"),
    firstNameGenitive(person.firstName.trim(), gender),
    middleNameGenitive(person.middleName.trim(), gender),
  ]
    .filter(Boolean)
    .join(" ");
}
