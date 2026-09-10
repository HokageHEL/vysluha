// Офіційні довідники та тарифні сітки калькулятора грошового забезпечення МОУ (social.mil.gov.ua)
// Постанова КМУ № 704 та Наказ МОУ № 260

export interface SalaryRank {
  index: number;
  label: string;
  ovz: number; // Оклад за військовим званням (грн)
}

export interface TariffGrade {
  index: number;
  grade: number; // 1-60
  label: string;
  baseSalary: number; // Посадовий оклад (грн)
  premiumOfficer: number; // % премії на посадах рядового/офіцерського складу
  premiumSSO: number;     // % премії ССО
  premiumDSHV: number;    // % премії ДШВ/ВМС/Морська піхота
  premiumA0952: number;   // % премії А0952
}

export interface SeniorityAllowance {
  index: number;
  label: string;
  percent: number; // 0%, 25%, 30%, 35%, 40%, 45%, 50%
}

export interface DutyCondition {
  index: number;
  label: string;
  raw: string; // "65", "68.3", "100;650", "100;780;;;pilot" тощо
}

export interface BranchOption {
  index: number;
  label: string;
  value: number;
}

export interface SsoPositionOption {
  index: number;
  label: string;
  percent: number;
}

export interface RawOption {
  index: number;
  label: string;
  raw: string;
}

export interface PercentOption {
  index: number;
  label: string;
  percent: number;
}

// 1. Оклади за військовим званням (22 звання)
export const SALARY_RANKS: SalaryRank[] = [
  {
    "index": 0,
    "label": "Рекрут",
    "ovz": 440
  },
  {
    "index": 1,
    "label": "Солдат, матрос",
    "ovz": 530
  },
  {
    "index": 2,
    "label": "Старший солдат, старший матрос",
    "ovz": 600
  },
  {
    "index": 3,
    "label": "Молодший сержант, старшина 2 статті",
    "ovz": 670
  },
  {
    "index": 4,
    "label": "Сержант, старшина 1 статті",
    "ovz": 740
  },
  {
    "index": 5,
    "label": "Старший сержант, головний старшина",
    "ovz": 810
  },
  {
    "index": 6,
    "label": "Головний сержант, головний корабельний старшина",
    "ovz": 880
  },
  {
    "index": 7,
    "label": "Штаб-сержант, штаб-старшина",
    "ovz": 950
  },
  {
    "index": 8,
    "label": "Майстер-сержант, майстер-старшина",
    "ovz": 1020
  },
  {
    "index": 9,
    "label": "Старший майстер-сержант, старший майстер-старшина",
    "ovz": 1040
  },
  {
    "index": 10,
    "label": "Головний майстер-сержант, головний майстер-старшина",
    "ovz": 1060
  },
  {
    "index": 11,
    "label": "Молодший лейтенант",
    "ovz": 1090
  },
  {
    "index": 12,
    "label": "Лейтенант",
    "ovz": 1130
  },
  {
    "index": 13,
    "label": "Старший лейтенант",
    "ovz": 1200
  },
  {
    "index": 14,
    "label": "Капітан, капітан-лейтенант",
    "ovz": 1270
  },
  {
    "index": 15,
    "label": "Майор, капітан 3 рангу",
    "ovz": 1340
  },
  {
    "index": 16,
    "label": "Підполковник, капітан 2 рангу",
    "ovz": 1410
  },
  {
    "index": 17,
    "label": "Полковник, капітан 1 рангу",
    "ovz": 1480
  },
  {
    "index": 18,
    "label": "Бригадний генерал, коммодор",
    "ovz": 1550
  },
  {
    "index": 19,
    "label": "Генерал-майор, контр-адмірал",
    "ovz": 1620
  },
  {
    "index": 20,
    "label": "Генерал-лейтенант, віце-адмірал",
    "ovz": 1690
  },
  {
    "index": 21,
    "label": "Генерал, адмірал",
    "ovz": 1760
  }
];

// 2. Тарифні розряди (1-60)
export const TARIFF_GRADES: TariffGrade[] = [
  {
    "index": 0,
    "grade": 1,
    "label": "1",
    "baseSalary": 2470,
    "premiumOfficer": 620,
    "premiumSSO": 650,
    "premiumDSHV": 633,
    "premiumA0952": 590
  },
  {
    "index": 1,
    "grade": 2,
    "label": "2",
    "baseSalary": 2550,
    "premiumOfficer": 590,
    "premiumSSO": 646,
    "premiumDSHV": 603,
    "premiumA0952": 567
  },
  {
    "index": 2,
    "grade": 3,
    "label": "3",
    "baseSalary": 2640,
    "premiumOfficer": 590,
    "premiumSSO": 641,
    "premiumDSHV": 578,
    "premiumA0952": 544
  },
  {
    "index": 3,
    "grade": 4,
    "label": "4",
    "baseSalary": 2730,
    "premiumOfficer": 590,
    "premiumSSO": 631,
    "premiumDSHV": 556,
    "premiumA0952": 535
  },
  {
    "index": 4,
    "grade": 5,
    "label": "5",
    "baseSalary": 2820,
    "premiumOfficer": 560,
    "premiumSSO": 624,
    "premiumDSHV": 534,
    "premiumA0952": 523
  },
  {
    "index": 5,
    "grade": 6,
    "label": "6",
    "baseSalary": 2910,
    "premiumOfficer": 560,
    "premiumSSO": 613,
    "premiumDSHV": 513,
    "premiumA0952": 513
  },
  {
    "index": 6,
    "grade": 7,
    "label": "7",
    "baseSalary": 3000,
    "premiumOfficer": 560,
    "premiumSSO": 600,
    "premiumDSHV": 505,
    "premiumA0952": 505
  },
  {
    "index": 7,
    "grade": 8,
    "label": "8",
    "baseSalary": 3080,
    "premiumOfficer": 560,
    "premiumSSO": 589,
    "premiumDSHV": 492,
    "premiumA0952": 492
  },
  {
    "index": 8,
    "grade": 9,
    "label": "9",
    "baseSalary": 3170,
    "premiumOfficer": 560,
    "premiumSSO": 580,
    "premiumDSHV": 489,
    "premiumA0952": 489
  },
  {
    "index": 9,
    "grade": 10,
    "label": "10",
    "baseSalary": 3260,
    "premiumOfficer": 530,
    "premiumSSO": 573,
    "premiumDSHV": 486,
    "premiumA0952": 486
  },
  {
    "index": 10,
    "grade": 11,
    "label": "11",
    "baseSalary": 3350,
    "premiumOfficer": 530,
    "premiumSSO": 563,
    "premiumDSHV": 483,
    "premiumA0952": 483
  },
  {
    "index": 11,
    "grade": 12,
    "label": "12",
    "baseSalary": 3440,
    "premiumOfficer": 530,
    "premiumSSO": 553,
    "premiumDSHV": 480,
    "premiumA0952": 480
  },
  {
    "index": 12,
    "grade": 13,
    "label": "13",
    "baseSalary": 3520,
    "premiumOfficer": 520,
    "premiumSSO": 541,
    "premiumDSHV": 467,
    "premiumA0952": 467
  },
  {
    "index": 13,
    "grade": 14,
    "label": "14",
    "baseSalary": 3660,
    "premiumOfficer": 520,
    "premiumSSO": 526,
    "premiumDSHV": 455,
    "premiumA0952": 455
  },
  {
    "index": 14,
    "grade": 15,
    "label": "15",
    "baseSalary": 3810,
    "premiumOfficer": 490,
    "premiumSSO": 518,
    "premiumDSHV": 443,
    "premiumA0952": 443
  },
  {
    "index": 15,
    "grade": 16,
    "label": "16",
    "baseSalary": 3950,
    "premiumOfficer": 490,
    "premiumSSO": 504,
    "premiumDSHV": 429,
    "premiumA0952": 429
  },
  {
    "index": 16,
    "grade": 17,
    "label": "17",
    "baseSalary": 4090,
    "premiumOfficer": 470,
    "premiumSSO": 496,
    "premiumDSHV": 420,
    "premiumA0952": 420
  },
  {
    "index": 17,
    "grade": 18,
    "label": "18",
    "baseSalary": 4230,
    "premiumOfficer": 470,
    "premiumSSO": 487,
    "premiumDSHV": 412,
    "premiumA0952": 412
  },
  {
    "index": 18,
    "grade": 19,
    "label": "19",
    "baseSalary": 4370,
    "premiumOfficer": 470,
    "premiumSSO": 481,
    "premiumDSHV": 405,
    "premiumA0952": 405
  },
  {
    "index": 19,
    "grade": 20,
    "label": "20",
    "baseSalary": 4510,
    "premiumOfficer": 470,
    "premiumSSO": 471,
    "premiumDSHV": 395,
    "premiumA0952": 395
  },
  {
    "index": 20,
    "grade": 21,
    "label": "21",
    "baseSalary": 4650,
    "premiumOfficer": 470,
    "premiumSSO": 464,
    "premiumDSHV": 390,
    "premiumA0952": 390
  },
  {
    "index": 21,
    "grade": 22,
    "label": "22",
    "baseSalary": 4790,
    "premiumOfficer": 450,
    "premiumSSO": 454,
    "premiumDSHV": 390,
    "premiumA0952": 390
  },
  {
    "index": 22,
    "grade": 23,
    "label": "23",
    "baseSalary": 4930,
    "premiumOfficer": 450,
    "premiumSSO": 445,
    "premiumDSHV": 390,
    "premiumA0952": 390
  },
  {
    "index": 23,
    "grade": 24,
    "label": "24",
    "baseSalary": 5070,
    "premiumOfficer": 450,
    "premiumSSO": 440,
    "premiumDSHV": 390,
    "premiumA0952": 390
  },
  {
    "index": 24,
    "grade": 25,
    "label": "25",
    "baseSalary": 5220,
    "premiumOfficer": 430,
    "premiumSSO": 428,
    "premiumDSHV": 390,
    "premiumA0952": 390
  },
  {
    "index": 25,
    "grade": 26,
    "label": "26",
    "baseSalary": 5360,
    "premiumOfficer": 430,
    "premiumSSO": 420,
    "premiumDSHV": 390,
    "premiumA0952": 390
  },
  {
    "index": 26,
    "grade": 27,
    "label": "27",
    "baseSalary": 5500,
    "premiumOfficer": 430,
    "premiumSSO": 410,
    "premiumDSHV": 390,
    "premiumA0952": 390
  },
  {
    "index": 27,
    "grade": 28,
    "label": "28",
    "baseSalary": 5640,
    "premiumOfficer": 430,
    "premiumSSO": 405,
    "premiumDSHV": 390,
    "premiumA0952": 390
  },
  {
    "index": 28,
    "grade": 29,
    "label": "29",
    "baseSalary": 5780,
    "premiumOfficer": 430,
    "premiumSSO": 395,
    "premiumDSHV": 390,
    "premiumA0952": 390
  },
  {
    "index": 29,
    "grade": 30,
    "label": "30",
    "baseSalary": 5920,
    "premiumOfficer": 420,
    "premiumSSO": 390,
    "premiumDSHV": 390,
    "premiumA0952": 390
  },
  {
    "index": 30,
    "grade": 31,
    "label": "31",
    "baseSalary": 6060,
    "premiumOfficer": 420,
    "premiumSSO": 390,
    "premiumDSHV": 390,
    "premiumA0952": 390
  },
  {
    "index": 31,
    "grade": 32,
    "label": "32",
    "baseSalary": 6200,
    "premiumOfficer": 420,
    "premiumSSO": 390,
    "premiumDSHV": 390,
    "premiumA0952": 390
  },
  {
    "index": 32,
    "grade": 33,
    "label": "33",
    "baseSalary": 6340,
    "premiumOfficer": 420,
    "premiumSSO": 390,
    "premiumDSHV": 390,
    "premiumA0952": 390
  },
  {
    "index": 33,
    "grade": 34,
    "label": "34",
    "baseSalary": 6480,
    "premiumOfficer": 420,
    "premiumSSO": 390,
    "premiumDSHV": 390,
    "premiumA0952": 390
  },
  {
    "index": 34,
    "grade": 35,
    "label": "35",
    "baseSalary": 6630,
    "premiumOfficer": 420,
    "premiumSSO": 390,
    "premiumDSHV": 390,
    "premiumA0952": 390
  },
  {
    "index": 35,
    "grade": 36,
    "label": "36",
    "baseSalary": 6770,
    "premiumOfficer": 400,
    "premiumSSO": 390,
    "premiumDSHV": 390,
    "premiumA0952": 390
  },
  {
    "index": 36,
    "grade": 37,
    "label": "37",
    "baseSalary": 6910,
    "premiumOfficer": 400,
    "premiumSSO": 390,
    "premiumDSHV": 390,
    "premiumA0952": 390
  },
  {
    "index": 37,
    "grade": 38,
    "label": "38",
    "baseSalary": 7050,
    "premiumOfficer": 400,
    "premiumSSO": 390,
    "premiumDSHV": 390,
    "premiumA0952": 390
  },
  {
    "index": 38,
    "grade": 39,
    "label": "39",
    "baseSalary": 7190,
    "premiumOfficer": 400,
    "premiumSSO": 390,
    "premiumDSHV": 390,
    "premiumA0952": 390
  },
  {
    "index": 39,
    "grade": 40,
    "label": "40",
    "baseSalary": 7330,
    "premiumOfficer": 400,
    "premiumSSO": 390,
    "premiumDSHV": 390,
    "premiumA0952": 390
  },
  {
    "index": 40,
    "grade": 41,
    "label": "41",
    "baseSalary": 7470,
    "premiumOfficer": 400,
    "premiumSSO": 390,
    "premiumDSHV": 390,
    "premiumA0952": 390
  },
  {
    "index": 41,
    "grade": 42,
    "label": "42",
    "baseSalary": 7610,
    "premiumOfficer": 400,
    "premiumSSO": 390,
    "premiumDSHV": 390,
    "premiumA0952": 390
  },
  {
    "index": 42,
    "grade": 43,
    "label": "43",
    "baseSalary": 7750,
    "premiumOfficer": 400,
    "premiumSSO": 390,
    "premiumDSHV": 390,
    "premiumA0952": 390
  },
  {
    "index": 43,
    "grade": 44,
    "label": "44",
    "baseSalary": 7890,
    "premiumOfficer": 390,
    "premiumSSO": 390,
    "premiumDSHV": 390,
    "premiumA0952": 390
  },
  {
    "index": 44,
    "grade": 45,
    "label": "45",
    "baseSalary": 8030,
    "premiumOfficer": 390,
    "premiumSSO": 390,
    "premiumDSHV": 390,
    "premiumA0952": 390
  },
  {
    "index": 45,
    "grade": 46,
    "label": "46",
    "baseSalary": 8180,
    "premiumOfficer": 390,
    "premiumSSO": 390,
    "premiumDSHV": 390,
    "premiumA0952": 390
  },
  {
    "index": 46,
    "grade": 47,
    "label": "47",
    "baseSalary": 8320,
    "premiumOfficer": 390,
    "premiumSSO": 390,
    "premiumDSHV": 390,
    "premiumA0952": 390
  },
  {
    "index": 47,
    "grade": 48,
    "label": "48",
    "baseSalary": 8460,
    "premiumOfficer": 390,
    "premiumSSO": 390,
    "premiumDSHV": 390,
    "premiumA0952": 390
  },
  {
    "index": 48,
    "grade": 49,
    "label": "49",
    "baseSalary": 8600,
    "premiumOfficer": 390,
    "premiumSSO": 390,
    "premiumDSHV": 390,
    "premiumA0952": 390
  },
  {
    "index": 49,
    "grade": 50,
    "label": "50",
    "baseSalary": 8740,
    "premiumOfficer": 390,
    "premiumSSO": 390,
    "premiumDSHV": 390,
    "premiumA0952": 390
  },
  {
    "index": 50,
    "grade": 51,
    "label": "51",
    "baseSalary": 8880,
    "premiumOfficer": 390,
    "premiumSSO": 390,
    "premiumDSHV": 390,
    "premiumA0952": 390
  },
  {
    "index": 51,
    "grade": 52,
    "label": "52",
    "baseSalary": 9020,
    "premiumOfficer": 390,
    "premiumSSO": 390,
    "premiumDSHV": 390,
    "premiumA0952": 390
  },
  {
    "index": 52,
    "grade": 53,
    "label": "53",
    "baseSalary": 9160,
    "premiumOfficer": 390,
    "premiumSSO": 390,
    "premiumDSHV": 390,
    "premiumA0952": 390
  },
  {
    "index": 53,
    "grade": 54,
    "label": "54",
    "baseSalary": 9300,
    "premiumOfficer": 390,
    "premiumSSO": 390,
    "premiumDSHV": 390,
    "premiumA0952": 390
  },
  {
    "index": 54,
    "grade": 55,
    "label": "55",
    "baseSalary": 9440,
    "premiumOfficer": 390,
    "premiumSSO": 390,
    "premiumDSHV": 390,
    "premiumA0952": 390
  },
  {
    "index": 55,
    "grade": 56,
    "label": "56",
    "baseSalary": 9590,
    "premiumOfficer": 390,
    "premiumSSO": 390,
    "premiumDSHV": 390,
    "premiumA0952": 390
  },
  {
    "index": 56,
    "grade": 57,
    "label": "57",
    "baseSalary": 9730,
    "premiumOfficer": 390,
    "premiumSSO": 390,
    "premiumDSHV": 390,
    "premiumA0952": 390
  },
  {
    "index": 57,
    "grade": 58,
    "label": "58",
    "baseSalary": 9870,
    "premiumOfficer": 390,
    "premiumSSO": 390,
    "premiumDSHV": 390,
    "premiumA0952": 390
  },
  {
    "index": 58,
    "grade": 59,
    "label": "59",
    "baseSalary": 10010,
    "premiumOfficer": 390,
    "premiumSSO": 390,
    "premiumDSHV": 390,
    "premiumA0952": 390
  },
  {
    "index": 59,
    "grade": 60,
    "label": "60",
    "baseSalary": 10150,
    "premiumOfficer": 390,
    "premiumSSO": 390,
    "premiumDSHV": 390,
    "premiumA0952": 390
  }
];

// 3. Надбавка за вислугу років (відсотки)
export const SENIORITY_ALLOWANCES: SeniorityAllowance[] = [
  {
    "index": 0,
    "label": "До 1 року",
    "percent": 0
  },
  {
    "index": 1,
    "label": "Від 1 до 5 років",
    "percent": 25
  },
  {
    "index": 2,
    "label": "Від 5 до 10 років",
    "percent": 30
  },
  {
    "index": 3,
    "label": "Від 10 до 15 років",
    "percent": 35
  },
  {
    "index": 4,
    "label": "Від 15 до 20 років",
    "percent": 40
  },
  {
    "index": 5,
    "label": "Від 20 до 25 років",
    "percent": 45
  },
  {
    "index": 6,
    "label": "25 та більше років",
    "percent": 50
  }
];

// 4. Особливості проходження служби
export const DUTY_CONDITIONS: DutyCondition[] = [
  {
    "index": 0,
    "label": "65% Інші військові посади",
    "raw": "65"
  },
  {
    "index": 1,
    "label": "68,3% Інфекційні клініки, відділення, палати та ізолятори - Медицина",
    "raw": "68.3"
  },
  {
    "index": 2,
    "label": "68,3% Підрозділи для гельмінтологічних хворих - Медицина",
    "raw": "68.3"
  },
  {
    "index": 3,
    "label": "68,3% Підрозділи для опікових і спінальних хворих - Медицина",
    "raw": "68.3"
  },
  {
    "index": 4,
    "label": "68,3% Неврологічні відділення порушень мозкового кровообігу - Медицина",
    "raw": "68.3"
  },
  {
    "index": 5,
    "label": "68,3% Відділення з апаратом «Штучна нирка» - Медицина",
    "raw": "68.3"
  },
  {
    "index": 6,
    "label": "68,3% Алергологічні кабінети - Медицина",
    "raw": "68.3"
  },
  {
    "index": 7,
    "label": "68,3% Епідеміологічні, лабораторні та санітарні підрозділи - Медицина",
    "raw": "68.3"
  },
  {
    "index": 8,
    "label": "68,3% Відділення гнійної хірургії - Медицина",
    "raw": "68.3"
  },
  {
    "index": 9,
    "label": "68,3% Шкірно-венерологічні підрозділи - Медицина",
    "raw": "68.3"
  },
  {
    "index": 10,
    "label": "68,3% Малоінвазивна хірургія та ендоскопія - Медицина",
    "raw": "68.3"
  },
  {
    "index": 11,
    "label": "68,3% Кабінети УЗД, КТ та МРТ - Медицина",
    "raw": "68.3"
  },
  {
    "index": 12,
    "label": "68,3% Центри крові, трансфузіологія та кріоконсервування - Медицина",
    "raw": "68.3"
  },
  {
    "index": 13,
    "label": "68,3% Керівники установ превентивної медицини - Медицина",
    "raw": "68.3"
  },
  {
    "index": 14,
    "label": "68,3% Бактеріологічні та вірусологічні дослідження в медпідрозділах - Медицина",
    "raw": "68.3"
  },
  {
    "index": 15,
    "label": "68,3% Медперсонал анестезіології, реанімації, інтенсивної терапії та оксигенації - Медицина",
    "raw": "68.3"
  },
  {
    "index": 16,
    "label": "68,3% Хірурги, ендоскопісти й анестезіологи в медпідрозділах - Медицина",
    "raw": "68.3"
  },
  {
    "index": 17,
    "label": "68,3% Лабораторний медперсонал: живі збудники або хворі тварини - Медицина",
    "raw": "68.3"
  },
  {
    "index": 18,
    "label": "68,3% Робота з патогенними вірусами - Медицина",
    "raw": "68.3"
  },
  {
    "index": 19,
    "label": "68,3% Робота з хімічними алергенами, визначеними МОЗ - Медицина",
    "raw": "68.3"
  },
  {
    "index": 20,
    "label": "68,3% Лікарі Євпаторійського санаторію, які лікують психоневрологічних хворих - Медицина",
    "raw": "68.3"
  },
  {
    "index": 21,
    "label": "68,3% Радіаційні роботи та обов’язки рентгенолога за наказом - Медицина",
    "raw": "68.3"
  },
  {
    "index": 22,
    "label": "68,3% Робота в осередках інфекцій за наказом (крім чуми й холери) - Медицина",
    "raw": "68.3"
  },
  {
    "index": 23,
    "label": "68,3% Немедичний склад патолого-анатомічних підрозділів - Медицина",
    "raw": "68.3"
  },
  {
    "index": 24,
    "label": "68,3% Посади у Військовій службі правопорядку - Військова служба правопорядку",
    "raw": "68.3"
  },
  {
    "index": 25,
    "label": "68,3% Служба глибше 20 м або в захищених пунктах управління - Спеціальні умови та військові частини",
    "raw": "68.3"
  },
  {
    "index": 26,
    "label": "71,5% Туберкульозні відділення та клініки - Медицина",
    "raw": "71.5"
  },
  {
    "index": 27,
    "label": "71,5% Палати та ізолятори для хворих на туберкульоз - Медицина",
    "raw": "71.5"
  },
  {
    "index": 28,
    "label": "71,5% Медичний склад патолого-анатомічних підрозділів - Медицина",
    "raw": "71.5"
  },
  {
    "index": 29,
    "label": "71,5% Лабораторні дослідження туберкульозних та інфекційних підрозділів - Медицина",
    "raw": "71.5"
  },
  {
    "index": 30,
    "label": "71,5% Психіатричні та психоневрологічні підрозділи - Медицина",
    "raw": "71.5"
  },
  {
    "index": 31,
    "label": "78% Хірурги, ендоскопісти й анестезіологи, які оперують у госпіталях - Медицина",
    "raw": "78"
  },
  {
    "index": 32,
    "label": "78% Бойові чергування ППО, морської оборони й прикриття об’єктів (від 4) - ППО та бойове чергування",
    "raw": "78"
  },
  {
    "index": 33,
    "label": "78% Командири й старші механіки-водії танків та гаубичних САУ - Бронетехніка",
    "raw": "78"
  },
  {
    "index": 34,
    "label": "78% Наземні авіафахівці з безпеки польотів (за переліком) - Авіація",
    "raw": "78"
  },
  {
    "index": 35,
    "label": "78% Наземний інженерно-технічний склад авіаційних випробувань (за переліком) - Авіація",
    "raw": "78"
  },
  {
    "index": 36,
    "label": "81,3% Інструктори й викладачі навчальних центрів та полігонів - Навчання та інструктори",
    "raw": "81.3"
  },
  {
    "index": 37,
    "label": "81,3% Посади у дисциплінарних військових частинах - Військова служба правопорядку",
    "raw": "81.3"
  },
  {
    "index": 38,
    "label": "81,3% Штатні інструктори бойової армійської системи - Навчання та інструктори",
    "raw": "81.3"
  },
  {
    "index": 39,
    "label": "81,3% Сертифіковані інструктори бойової армійської системи, які проводять заняття - Навчання та інструктори",
    "raw": "81.3"
  },
  {
    "index": 40,
    "label": "84,5% Екіпажі танків, САУ, ЗСУ, БМП, розвідувальних і десантних машин - Бронетехніка",
    "raw": "84.5"
  },
  {
    "index": 41,
    "label": "84,5% Інструктори водіння танків і САУ зі штату екіпажу - Бронетехніка",
    "raw": "84.5"
  },
  {
    "index": 42,
    "label": "84,5% Обслуги гусеничних пускових установок і станцій ЗРК - ППО та бойове чергування",
    "raw": "84.5"
  },
  {
    "index": 43,
    "label": "85% Батальйон та оркестр почесної варти А0222 - Почесна варта",
    "raw": "85"
  },
  {
    "index": 44,
    "label": "87,8% Водолази з допуском до водолазних робіт - ВМС",
    "raw": "87.8"
  },
  {
    "index": 45,
    "label": "87,8% Екіпажі надводних кораблів, суден і катерів - ВМС",
    "raw": "87.8"
  },
  {
    "index": 46,
    "label": "87,8% Управління корабельних з’єднань із постійним розміщенням на кораблях - ВМС",
    "raw": "87.8"
  },
  {
    "index": 47,
    "label": "87,8% Морська піхота та визначені частини ВМС - ВМС",
    "raw": "87.8"
  },
  {
    "index": 48,
    "label": "87,8% Спецпідрозділи Військової служби правопорядку - Військова служба правопорядку",
    "raw": "87.8"
  },
  {
    "index": 49,
    "label": "87,8% ДШВ, профільні заклади, парашутні служби, спорткоманди та випробувачі - ДШВ",
    "raw": "87.8"
  },
  {
    "index": 50,
    "label": "87,8% Військові частини Сил спеціальних операцій - ССО",
    "raw": "87.8"
  },
  {
    "index": 51,
    "label": "100% Льотний склад пасажирського та вантажного салону - Авіація",
    "raw": "100;650"
  },
  {
    "index": 52,
    "label": "100% Штатні пожежні розрахунки під час ліквідації пожеж - Пожежна служба",
    "raw": "100"
  },
  {
    "index": 53,
    "label": "100% Льотний склад льотного екіпажу - Авіація",
    "raw": "100;780;;;pilot"
  },
  {
    "index": 54,
    "label": "100% Льотно-випробний склад у складі екіпажу - Авіація",
    "raw": "100"
  },
  {
    "index": 55,
    "label": "100% Лабораторії інфекційної імунології - Медицина",
    "raw": "100"
  },
  {
    "index": 56,
    "label": "100% Сертифіковані снайпери груп спецпризначення центрів спеціальних операцій - Снайпери",
    "raw": "100;630"
  },
  {
    "index": 57,
    "label": "100% Сертифіковані снайпери групи підготовки А2772 (без змінного складу) - Снайпери",
    "raw": "100;630"
  },
  {
    "index": 58,
    "label": "100% Сертифіковані снайпери снайперських та розвідувальних підрозділів - Снайпери",
    "raw": "100;720;;880"
  },
  {
    "index": 59,
    "label": "100% Сертифіковані снайпери навчальних взводів А2900 (без змінного складу) - Снайпери",
    "raw": "100;880"
  },
  {
    "index": 60,
    "label": "100% Сертифіковані снайпери навчального відділення й груп А1414 (без змінного складу) - Снайпери",
    "raw": "100;720"
  },
  {
    "index": 61,
    "label": "100% Сертифіковані військовослужбовці підрозділів ПТРК «Стугна-П» або «Корсар» - ПТРК",
    "raw": "100;735;;900"
  },
  {
    "index": 62,
    "label": "100% Батарея протитанкових керованих комплексів А1499 - ПТРК",
    "raw": "100;510"
  },
  {
    "index": 63,
    "label": "100% Військовослужбовці частин А1556, А1778, А1927, А4267, А3715, А3892, А3029, А3620, А0952 - Спеціальні умови та військові частини",
    "raw": "100"
  },
  {
    "index": 64,
    "label": "100% Охорона та оборона острова Зміїний - Спеціальні умови та військові частини",
    "raw": "100"
  },
  {
    "index": 65,
    "label": "100% Сертифіковані зовнішні екіпажі БпАК із допуском і фактичними польотами - БпАК",
    "raw": "100;770;620;890"
  }
];

// 5. Місце проходження служби
export const BRANCH_OPTIONS: BranchOption[] = [
  {
    "index": 0,
    "label": "На посадах рядового, сержантського, старшинського та офіцерського складу",
    "value": 3
  },
  {
    "index": 1,
    "label": "Сили спеціальних операцій (ССО)",
    "value": 1
  },
  {
    "index": 2,
    "label": "ДШВ / ВМС / Морська піхота",
    "value": 2
  },
  {
    "index": 3,
    "label": "У військовій частині А0952",
    "value": 7
  }
];

// 6. Посада в ССО
export const SSO_POSITIONS: SsoPositionOption[] = [
  {
    "index": 0,
    "label": "--",
    "percent": 0
  },
  {
    "index": 1,
    "label": "Посади інструкторів і посади в основних підрозділах (згідно із штатом) центрів спеціального призначення (центрів спеціальних операцій) та навчально-тренувальних центрів",
    "percent": 100
  },
  {
    "index": 2,
    "label": "Посади в командуванні Сил спеціальних операцій Збройних Сил, в управліннях (згідно із штатом) центрів спеціального призначення (центрів спеціальних операцій) та навчально-тренувальних центрів",
    "percent": 80
  },
  {
    "index": 3,
    "label": "Посади в підрозділах забезпечення (згідно із штатом) центрів спеціального призначення (центрів спеціальних операцій) та навчально-тренувальних центрів; в управліннях і основних підрозділах (згідно із штатом) спеціальних центрів",
    "percent": 70
  },
  {
    "index": 4,
    "label": "Інші військовослужбовці Сил спеціальних операцій Збройних Сил",
    "percent": 50
  }
];

// 7. Секретність
export const SECRECY_OPTIONS: RawOption[] = [
  {
    "index": 0,
    "label": "Таємно",
    "raw": "0"
  },
  {
    "index": 1,
    "label": "Цілком таємно",
    "raw": "10;30"
  },
  {
    "index": 2,
    "label": "Особливої важливості",
    "raw": "15;50"
  }
];

// 8. Класна кваліфікація
export const QUALIFICATION_OPTIONS: RawOption[] = [
  {
    "index": 0,
    "label": "2 Клас",
    "raw": "0"
  },
  {
    "index": 1,
    "label": "1 Клас",
    "raw": "3;5"
  },
  {
    "index": 2,
    "label": "Клас майстра",
    "raw": "5;7"
  },
  {
    "index": 3,
    "label": "Клас снайпера (для льотного складу)",
    "raw": "7;0"
  },
  {
    "index": 4,
    "label": "Кваліфікації для медичного і фармацевтичного складу",
    "raw": "0;9"
  }
];

// 9. Медична кваліфікаційна категорія
export const MED_CATEGORY_OPTIONS: RawOption[] = [
  {
    "index": 0,
    "label": "Оберіть необхідну",
    "raw": "0"
  },
  {
    "index": 1,
    "label": "Друга кваліфікаційна категорія",
    "raw": "7;3;3"
  },
  {
    "index": 2,
    "label": "Перша кваліфікаційна категорія",
    "raw": "9;5;5"
  },
  {
    "index": 3,
    "label": "Вища кваліфікаційна категорія",
    "raw": "11;7;7"
  }
];

// 10. Медична посада
export const MED_POSITION_OPTIONS = [
  {
    "index": 0,
    "label": "Посади хірургів, травматологів, ортопедів-комбустіологів, урологів, нейрохірургів, серцево-судинних хірургів, торакальних хірургів, абдомінальних хірургів, проктологів, щелепно-лицьових хірургів, акушерів-гінекологів, офтальмологів, оториноларингологів, рентгенологів, які здійснюють хірургічні втручання із застосуванням рентгенівської апаратури в умовах стаціонару, ендоскопістів, що здійснюють лікувальні заходи, трансфузіологів, лікарів підводних човнів та надводних кораблів у міжпохідний період, які оперують у стаціонарі, хірургів, які оперують у поліклініці",
    "value": 1
  },
  {
    "index": 1,
    "label": "Посади (крім тих, які займають посади, зазначені у пункті першому) у закладах охорони здоров’я, медичних службах з’єднань і військових частин, навчальних військово-медичних закладах (підрозділах), науково-дослідних установах, підрозділах екологічної служби Збройних Сил України, Головній інспекції Міністерства оборони України, а також в органах управління медичної служби Міністерства оборони України та Збройних Сил України ",
    "value": 2
  },
  {
    "index": 2,
    "label": "Посади молодших спеціалістів з медичною або фармацевтичною освітою, займані особам рядового, сержантського і старшинського складу, які проходять військову службу за контрактом",
    "value": 3
  }
];

// 11. Стаж шифрувальної роботи
export const CRYPTO_OPTIONS: PercentOption[] = [
  {
    "index": 0,
    "label": "Від 1 до 3 років",
    "percent": 0
  },
  {
    "index": 1,
    "label": "Від 3 до 5 років",
    "percent": 10
  },
  {
    "index": 2,
    "label": "Понад 5 років",
    "percent": 15
  }
];

// 12. Почесні звання
export const HONORARY_OPTIONS: PercentOption[] = [
  {
    "index": 0,
    "label": "Почесне звання \"заслужений\"",
    "percent": 0
  },
  {
    "index": 1,
    "label": "Почесне звання \"народний\"",
    "percent": 10
  }
];

// 13. Спортивні звання
export const SPORTS_OPTIONS: PercentOption[] = [
  {
    "index": 0,
    "label": "Заслужений тренер",
    "percent": 0
  },
  {
    "index": 1,
    "label": "Заслужений майстер спорту",
    "percent": 10
  },
  {
    "index": 2,
    "label": "Майстер спорту міжнародного класу",
    "percent": 10
  },
  {
    "index": 3,
    "label": "Майстер спорту",
    "percent": 10
  }
];

// 14. Науковий ступінь
export const SCIENCE_DEGREE_OPTIONS: PercentOption[] = [
  {
    "index": 0,
    "label": "Науковий ступінь доктора філософії (кандидата наук)",
    "percent": 0
  },
  {
    "index": 1,
    "label": "Науковий ступінь доктора наук",
    "percent": 5
  }
];

// 15. Вчене звання
export const ACADEMIC_RANK_OPTIONS: PercentOption[] = [
  {
    "index": 0,
    "label": "Вчене звання доцента (старшого наукового співробітника)",
    "percent": 0
  },
  {
    "index": 1,
    "label": "Вчене звання професора",
    "percent": 5
  }
];

// Місяці року
export const CALC_MONTHS = [
  "Січень",
  "Лютий",
  "Березень",
  "Квітень",
  "Травень",
  "Червень",
  "Липень",
  "Серпень",
  "Вересень",
  "Жовтень",
  "Листопад",
  "Грудень"
];

// Базовий прожитковий мінімум для розрахунків
export const DEFAULT_SUBSISTENCE_MINIMUM = 3328;

// Максимальний розмір додаткових винагород (ліміт кап)
export const MAX_REWARD_LIMIT_CAP = 460000;

// Мапінг звання з послужного списку (ranks.ts) до індексу в калькуляторі
export function matchRankToSalaryRankIndex(rank: string): number {
  if (!rank) return 1; // default to Солдат
  const r = rank.toLowerCase().trim();
  if (r.includes("рекрут")) return 0;
  if (r.includes("старший солдат") || r.includes("старший матрос")) return 2;
  if (r.includes("молодший сержант") || r.includes("старшина 2")) return 3;
  if (r.includes("старший сержант") || r.includes("головний старшина")) return 5;
  if (r.includes("головний сержант") || r.includes("головний корабельний")) return 6;
  if (r.includes("штаб-сержант") || r.includes("штаб-старшина")) return 7;
  if (r.includes("старший майстер-сержант") || r.includes("старший майстер-старшина")) return 9;
  if (r.includes("головний майстер-сержант") || r.includes("головний майстер-старшина")) return 10;
  if (r.includes("майстер-сержант") || r.includes("майстер-старшина")) return 8;
  if (r.includes("сержант") || r.includes("старшина 1")) return 4;
  if (r.includes("солдат") || r.includes("матрос") || r.includes("рядовий")) return 1;
  if (r.includes("молодший лейтенант")) return 11;
  if (r.includes("старший лейтенант")) return 13;
  if (r.includes("капітан-лейтенант") || r.includes("капітан 1") || r.includes("капітан 2") || r.includes("капітан 3")) {
    if (r.includes("капітан 3")) return 15;
    if (r.includes("капітан 2")) return 16;
    if (r.includes("капітан 1")) return 17;
    return 14;
  }
  if (r.includes("капітан")) return 14;
  if (r.includes("лейтенант")) return 12;
  if (r.includes("підполковник")) return 16;
  if (r.includes("майор")) return 15;
  if (r.includes("полковник")) return 17;
  if (r.includes("бригадний") || r.includes("коммодор")) return 18;
  if (r.includes("генерал-майор") || r.includes("контрадмірал")) return 19;
  if (r.includes("генерал-лейтенант") || r.includes("віцеадмірал")) return 20;
  if (r.includes("генерал")) return 21;
  if (r.includes("прапорщик") || r.includes("мічман")) return 7;
  return 1;
}

// Мапінг загальних років вислуги до індексу надбавки за вислугу
export function matchSeniorityYearsToIndex(totalYears: number): number {
  if (totalYears < 1) return 0;  // До 1 року (0%)
  if (totalYears < 5) return 1;  // Від 1 до 5 років (25%)
  if (totalYears < 10) return 2; // Від 5 до 10 років (30%)
  if (totalYears < 15) return 3; // Від 10 до 15 років (35%)
  if (totalYears < 20) return 4; // Від 15 до 20 років (40%)
  if (totalYears < 25) return 5; // Від 20 до 25 років (45%)
  return 6;                      // 25 та більше років (50%)
}
