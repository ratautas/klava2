export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameState {
    currentWord: string;
    difficulty: Difficulty;
    letterStates: LetterState[];
    currentIndex: number;
    isComplete: boolean;
}

export interface LetterState {
    letter: string;
    isCorrect: boolean | null;
    isFocused: boolean;
}

export const LEVEL_1_WORDS = [
    'MAMA', 'TETE', 'NORI', 'EINA', 'BEGA', 'SEKA', 'LOVA', 'KOJA', 'SALA', 'GERA',
    'KATE', 'SUO', 'PELE', 'DUONA', 'PIENAS', 'RYTA', 'NAMO', 'SOPA', 'DEDA', 'MYLI',
    'GULI', 'SEDI', 'MATO', 'TURI', 'DARO', 'MOKA', 'GALI', 'BUNA', 'META', 'NEŠA'
];

export const LEVEL_2_WORDS = [
    'KNYGA', 'STALAS', 'MEDUS', 'NAMAS', 'RANKA', 'PUODE', 'LAUKE', 'SAULE', 'MESKA', 'LAPAS',
    'GATVE', 'MEDIS', 'PIEVA', 'SODAS', 'KELIAS', 'PUKAS', 'LENTA', 'DURYS', 'LANGAS', 'SIENA',
    'KALNAS', 'UPELE', 'TILTAS', 'RATAS', 'KEPURE', 'BATAI', 'SRIUBA', 'PIENAS', 'DUONA', 'TORTAS'
];

export const LEVEL_3_WORDS = [
    'MASINA', 'MOKYKLA', 'BANANAS', 'MORKA', 'LEDAI', 'ANTIS', 'KIEMAS', 'STALAS', 'LANGAS', 'MEDIS',
    'VOVERĖ', 'GĖLYTĖ', 'PAUKŠTIS', 'DRUGELIS', 'SAULUTĖ', 'MĖNULIS', 'DEBESYS', 'LIETUS', 'SNIEGAS', 'VASARA',
    'PAVASARIS', 'RUDUO', 'ŽIEMA', 'DARŽOVĖ', 'GYVŪNAS', 'ŠEIMA', 'DRAUGAS', 'MOKYTOJA', 'DARŽELIS', 'ŽAIDIMAS'
];

export const getWordsByDifficulty = (difficulty: Difficulty): string[] => {
    switch (difficulty) {
        case 'easy':
            return LEVEL_1_WORDS;
        case 'medium':
            return LEVEL_2_WORDS;
        case 'hard':
            return LEVEL_3_WORDS;
    }
}; 