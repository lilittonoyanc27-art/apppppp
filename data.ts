export interface DayOfNewWeek {
  id: string;
  spanish: string;
  armenian: string;
  phonetic: string;
}

export interface NumberLesson {
  id: string;
  value: number;
  spanish: string;
  armenian: string;
  phonetic: string;
}

export interface NounGender {
  id: string;
  word: string; // e.g. "casa"
  gender: 'el' | 'la';
  armenian: string; // e.g. "Տուն"
  phonetic: string; // e.g. "Tun"
  hint: string; // Gender rules hint in Armenian
}

export const DAYS_OF_WEEK: DayOfNewWeek[] = [
  { id: 'd1', spanish: 'Lunes', armenian: 'Երկուշաբթի', phonetic: 'Yerkushabt\'i' },
  { id: 'd2', spanish: 'Martes', armenian: 'Երեքշաբթի', phonetic: 'Yerek\'shabt\'i' },
  { id: 'd3', spanish: 'Miércoles', armenian: 'Չորեքշաբթի', phonetic: 'Chorek\'shabt\'i' },
  { id: 'd4', spanish: 'Jueves', armenian: 'Հինգշաբթի', phonetic: 'Hing-shabt\'i' },
  { id: 'd5', spanish: 'Viernes', armenian: 'Ուրբաթ', phonetic: 'Urbat\'' },
  { id: 'd6', spanish: 'Sábado', armenian: 'Շաբաթ', phonetic: 'Shabat\'' },
  { id: 'd7', spanish: 'Domingo', armenian: 'Կիրակի', phonetic: 'Kiraki' },
  { id: 'd8', spanish: 'Hoy', armenian: 'Այսօր', phonetic: 'Oy' },
  { id: 'd9', spanish: 'Mañana', armenian: 'Վաղը', phonetic: 'Manyana' },
  { id: 'd10', spanish: 'Ayer', armenian: 'Երեկ', phonetic: 'Ayer' },
  { id: 'd11', spanish: 'Semana', armenian: 'Շաբաթ (վեց օր)', phonetic: 'Semana' },
  { id: 'd12', spanish: 'Mes', armenian: 'Ամիս', phonetic: 'Mes' },
  { id: 'd13', spanish: 'Año', armenian: 'Տարի', phonetic: 'Anyo' },
  { id: 'd14', spanish: 'Tarde', armenian: 'Կեսօր / Երեկո', phonetic: 'Tarde' },
  { id: 'd15', spanish: 'Noche', armenian: 'Գիշեր', phonetic: 'Noche' }
];

export const NUMBERS_LESSON: NumberLesson[] = [
  { id: 'n1', value: 1, spanish: 'Uno', armenian: 'Մեկ', phonetic: 'Uno' },
  { id: 'n2', value: 2, spanish: 'Dos', armenian: 'Երկու', phonetic: 'Dos' },
  { id: 'n3', value: 3, spanish: 'Tres', armenian: 'Երեք', phonetic: 'Tres' },
  { id: 'n4', value: 4, spanish: 'Cuatro', armenian: 'Չորս', phonetic: 'Kuatro' },
  { id: 'n5', value: 5, spanish: 'Cinco', armenian: 'Հինգ', phonetic: 'Sinko' },
  { id: 'n6', value: 6, spanish: 'Seis', armenian: 'Վեց', phonetic: 'Seys' },
  { id: 'n7', value: 7, spanish: 'Siete', armenian: 'Յոթ', phonetic: 'Siete' },
  { id: 'n8', value: 8, spanish: 'Ocho', armenian: 'Ութ', phonetic: 'Ocho' },
  { id: 'n9', value: 9, spanish: 'Iny', phonetic: 'Nueve', armenian: 'Ինը' }, // Let's keep existing fields
  { id: 'n10', value: 10, spanish: 'Diez', armenian: 'Տասը', phonetic: 'Dies' },
  { id: 'n11', value: 11, spanish: 'Once', armenian: 'Տասնմեկ', phonetic: 'Onse' },
  { id: 'n12', value: 12, spanish: 'Doce', armenian: 'Տասներկու', phonetic: 'Dose' },
  { id: 'n13', value: 13, spanish: 'Trece', armenian: 'Տասներեք', phonetic: 'Trese' },
  { id: 'n14', value: 14, spanish: 'Catorce', armenian: 'Տասնչորս', phonetic: 'Katorse' },
  { id: 'n15', value: 15, spanish: 'Quince', armenian: 'Տասնհինգ', phonetic: 'Kinse' },
  { id: 'n16', value: 16, spanish: 'Dieciséis', armenian: 'Տասնվեց', phonetic: 'Diesiseys' },
  { id: 'n17', value: 17, spanish: 'Diecisiete', armenian: 'Տասնյոթ', phonetic: 'Diesisiete' },
  { id: 'n18', value: 18, spanish: 'Dieciocho', armenian: 'Տասնութ', phonetic: 'Diesiocho' },
  { id: 'n19', value: 19, spanish: 'Diecinueve', armenian: 'Տասնինը', phonetic: 'Diesinueve' },
  { id: 'n20', value: 20, spanish: 'Veinte', armenian: 'Քսան', phonetic: 'Veynte' }
];

export const NOUNS_GENDER: NounGender[] = [
  // Masculine ending in -o (usually)
  { id: 'g1', word: 'libro', gender: 'el', armenian: 'Գիրք', phonetic: 'Libro', hint: 'Իսպաներենում -o-ով վերջացող գոյականների մեծ մասը արական սեռի են (el):' },
  { id: 'g2', word: 'sol', gender: 'el', armenian: 'Արև', phonetic: 'Sol', hint: 'Բնության երևույթների մի մասը, ինչպիսին է el sol-ը, արական սեռի են:' },
  { id: 'g3', word: 'viento', gender: 'el', armenian: 'Քամի', phonetic: 'Viento', hint: 'Ավարտվում է -o-ով, ուստի սովորաբար արական սեռի է:' },
  { id: 'g4', word: 'gato', gender: 'el', armenian: 'Կատու (արու)', phonetic: 'Gato', hint: 'Կենդանու արու տեսակը վերջանում է -o-ով (el gato):' },
  { id: 'g5', word: 'perro', gender: 'el', armenian: 'Շուն', phonetic: 'Perro', hint: 'Ավարտվում է -o-ով ՝ արական սեռ (el perro):' },
  { id: 'g6', word: 'sombrero', gender: 'el', armenian: 'Գլխարկ', phonetic: 'Sombrero', hint: 'Ավարտվում է -o-ով ՝ արական սեռ:' },
  { id: 'g7', word: 'árbol', gender: 'el', armenian: 'Ծառ', phonetic: 'Arbol', hint: 'Ավարտվում է բաղաձայնով ՝ սովորաբար արական սեռ:' },
  { id: 'g15', word: 'queso', gender: 'el', armenian: 'Պանիր', phonetic: 'Keso', hint: 'Ավարտվում է -o-ով ՝ արական սեռ (el queso):' },
  { id: 'g16', word: 'papel', gender: 'el', armenian: 'Թուղթ', phonetic: 'Papel', hint: 'Ավարտվում է բաղաձայնով, որոշիչ հոդն է el (el papel):' },
  { id: 'g17', word: 'coche', gender: 'el', armenian: 'Մեքենա', phonetic: 'Koche', hint: 'Իսպաներենում -e-ով վերջացող որոշ բառեր արական են, օրինակ ՝ el coche:' },
  
  // Feminine ending in -a (usually)
  { id: 'g8', word: 'mesa', gender: 'la', armenian: 'Սեղան', phonetic: 'Mesa', hint: 'Իսպաներենում -a-ով վերջացող գոյականների մեծ մասը իգական սեռի են (la):' },
  { id: 'g9', word: 'luna', gender: 'la', armenian: 'Լուսին', phonetic: 'Luna', hint: 'Ավարտվում է -a-ով, իգական սեռ (la luna):' },
  { id: 'g10', word: 'casa', gender: 'la', armenian: 'Տուն', phonetic: 'Kasa', hint: 'Բնակարան (casa) ՝ ավարտվում է -a-ով, ուստի իգական սեռ է:' },
  { id: 'g11', word: 'flor', gender: 'la', armenian: 'Ծաղիկ', phonetic: 'Flor', hint: 'Չնայած չի վերջանում -a-ով, ծաղիկը (la flor) իգական սեռի է:' },
  { id: 'g12', word: 'manzana', gender: 'la', armenian: 'Խնձոր', phonetic: 'Mansana', hint: 'Մրգերի մեծ մասը իգական սեռի են, հատկապես -a-ով վերջացողները:' },
  { id: 'g13', word: 'estrella', gender: 'la', armenian: 'Աստղ', phonetic: 'Estreya', hint: 'Ավարտվում է -a-ով, իգական սեռ (la estrella):' },
  { id: 'g14', word: 'lluvia', gender: 'la', armenian: 'Անձրև', phonetic: 'Lluvia', hint: 'Ավարտվում է -a-ով, իգական սեռ (la lluvia):' },
  { id: 'g18', word: 'puerta', gender: 'la', armenian: 'Դուռ', phonetic: 'Puerta', hint: 'Ավարտվում է -a-ով, ուստի իգական սեռ է (la puerta):' },
  { id: 'g19', word: 'escuela', gender: 'la', armenian: 'Դպրոց', phonetic: 'Eskuela', hint: 'Ավարտվում է -a-ով, իգական սեռ (la escuela):' },
  { id: 'g20', word: 'playa', gender: 'la', armenian: 'Լողափ', phonetic: 'Playa', hint: 'Ավարտվում է -a-ով, իգական սեռ (la playa) ՝ հոդը la:' }
];
