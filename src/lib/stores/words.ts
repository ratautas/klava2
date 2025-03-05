// Level-specific word lists
export const LEVEL_1_WORDS = [
  // 3-4 letter words
  'BUS',
  'DVI',
  'GAL',
  'IKI',
  'JAU',
  'JIS',
  'KAS',
  'KUR',
  'KAD',
  'KAI',
  'MES',
  'MAN',
  'NUO',
  'NES',
  'ORA',
  'PER',
  'PAS',
  'SU',
  'SAU',
  'TIK',
  'TEN',
  'TU',
  'VIS',
  'AKIS',
  'BALA',
  'DAMA',
  'GERA',
  'GALI',
  'GANA',
  'JURA',
  'JUMS',
  'KAVA',
  'KOJA',
  'LOVA',
  'MAMA',
  'MANO',
  'NORI',
  'NAMO',
  'SALA',
  'SAVO',
  'TAVO',
  'TAIP',
  'UGNI',
  'VISI',
];

export const LEVEL_2_WORDS = [
  // 5-6 letter words
  'AKMUO',
  'BATAS',
  'BURNA',
  'DAINA',
  'DIENA',
  'DUONA',
  'DALIS',
  'DARBAS',
  'EGLUTE',
  'GATVE',
  'GERAS',
  'GALAS',
  'GERAI',
  'GRAZUS',
  'ILGAI',
  'JAUNAS',
  'JUOSTA',
  'KAINA',
  'KALBA',
  'KELIAS',
  'KNYGA',
  'LANGAS',
  'LAPAS',
  'LAUKAS',
  'LIETUS',
  'MEDIS',
  'MIEGAS',
  'MIESTAS',
  'MOLIS',
  'NAMAS',
  'NAKTIS',
  'NAUJAS',
  'ORAS',
  'PIENAS',
  'PUODE',
  'RANKA',
  'RATAS',
  'RYTAS',
  'RUDUO',
  'SIENA',
  'STALAS',
  'SAPNAS',
  'SNIEGAS',
  'SUOLAS',
  'TILTAS',
  'UGNIS',
  'UPELE',
  'VANDUO',
  'VAIKAS',
  'VASARA',
  'VEIDAS',
  'ZODIS',
  'ZIEDAS',
  'ZIEMA'
];

export const LEVEL_3_WORDS = [
  // 6-7 letter words
  'AUKSTAS',
  'AUSINE',
  'BALKONAS',
  'BASEINAS',
  'DANGUS',
  'DARBAS',
  'DRAUGAS',
  'DURYS',
  'GYVENTI',
  'ISTORIJA',
  'JAUNAS',
  'JUOSTA',
  'KALNAS',
  'KAMBARYS',
  'KELIAS',
  'KNYGA',
  'LAIPTAI',
  'LAIKAS',
  'LANGAS',
  'LAUKAS',
  'LIETUVA',
  'MAISTAS',
  'MEDINIS',
  'MIESTAS',
  'MOKYKLA',
  'MUZIKA',
  'NAMUOSE',
  'NAKTIS',
  'NAUJAS',
  'PASAULIS',
  'PIENAS',
  'PLAUKAI',
  'PUODELIS',
  'RAUDONA',
  'RUDUO',
  'SAULUTE',
  'STALAS',
  'SNIEGAS',
  'SODAS',
  'SVEIKAS',
  'TILTAS',
  'UGNIS',
  'UPELE',
  'VANDUO',
  'VAIKAS',
  'VASARA',
  'VEIDAS',
  'ZODIS',
  'ZIEDAS',
  'ZIEMA'
];

export const LEVEL_4_WORDS = [
  // 7-8 letter words
  'AUKSINIS',
  'AUTOMOBILIS',
  'BALKONAS',
  'BASEINAS',
  'DANGUJE',
  'DARBINIS',
  'DRAUGAS',
  'DURELES',
  'EGLUTES',
  'GATVELE',
  'GRAZUMAS',
  'GYVENTI',
  'ISTORIJA',
  'JAUNIMAS',
  'JUOSTELE',
  'KALNELIS',
  'KAMBARYS',
  'KELIAUTI',
  'KNYGYNE',
  'LAIPTAIS',
  'LAIKRODIS',
  'LANGELIS',
  'LAUKELIS',
  'LIETUVOJE',
  'MAISTINIS',
  'MEDINIS',
  'MIESTELIS',
  'MOKYKLA',
  'MUZIKINIS',
  'NAMUOSE',
  'NAKTINIS',
  'NAUJAUSIAS',
  'ORANZINIU',
  'PASAULIS',
  'PIENINIS',
  'PLAUKIKAS',
  'PUODELIS',
  'RAUDONAS',
  'RUDENINIS',
  'SAULUTE',
  'STALINIS',
  'SNIEGINIS',
  'SODINUKAS',
  'SVEIKATOS',
  'TILTINIS',
  'UGNINIS',
  'UPELINIS',
  'VANDENINIS',
  'VAIKISKAS',
  'VASARINIS',
  'VEIDRODIS',
  'ZODYNAI',
  'ZIEDINIS',
  'ZIEMINIS'
];

// Combined word list for backward compatibility
export const WORD_LIST = [
  ...LEVEL_1_WORDS,
  ...LEVEL_2_WORDS,
  ...LEVEL_3_WORDS,
  ...LEVEL_4_WORDS
];

/**
 * Gets a random word from the word list based on the selected level
 */
export function getRandomWord(level = 1): string {
  let wordList;
  
  switch (level) {
    case 1:
      wordList = LEVEL_1_WORDS;
      break;
    case 2:
      wordList = LEVEL_2_WORDS;
      break;
    case 3:
      wordList = LEVEL_3_WORDS;
      break;
    case 4:
      wordList = LEVEL_4_WORDS;
      break;
    default:
      wordList = WORD_LIST;
  }
  
  const randomIndex = Math.floor(Math.random() * wordList.length);
  return wordList[randomIndex].toLowerCase();
}

/**
 * Gets the next word in the list after the current word, respecting the level
 */
export function getNextWord(currentWord: string, level = 1): string {
  let wordList;
  
  switch (level) {
    case 1:
      wordList = LEVEL_1_WORDS;
      break;
    case 2:
      wordList = LEVEL_2_WORDS;
      break;
    case 3:
      wordList = LEVEL_3_WORDS;
      break;
    case 4:
      wordList = LEVEL_4_WORDS;
      break;
    default:
      wordList = WORD_LIST;
  }
  
  const upperCurrentWord = currentWord.toUpperCase();
  const currentIndex = wordList.findIndex(w => w.toUpperCase() === upperCurrentWord);
  
  if (currentIndex === -1) {
    return getRandomWord(level);
  }
  
  const nextIndex = (currentIndex + 1) % wordList.length;
  return wordList[nextIndex].toLowerCase();
} 