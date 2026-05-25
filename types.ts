export interface MemoryCard {
  id: string; // unique ID
  termId: string; // references DayOfNewWeek / NumberLesson IDs
  text: string; // The text to display (Spanish or Armenian)
  language: 'es' | 'hy'; // Spanish or Armenian
  isFlipped: boolean;
  isMatched: boolean;
  colorClass: string;
}

export interface GameScore {
  daysOfWeekHighScore: number;
  numbersHighScore: number;
  genderHighScore: number;
}

export type ActiveTab = 'welcome' | 'days-game' | 'numbers-game' | 'gender-game' | 'achievements';

export interface BackgroundInfo {
  id: string;
  nameHy: string;
  nameEn: string;
  url: string;
  credit: string;
}

export const APP_BACKGROUNDS: BackgroundInfo[] = [
  {
    id: 'barcelona',
    nameHy: 'Բարսելոնայի ժամանակակից ճարտարապետություն',
    nameEn: 'Modern Architecture, Barcelona',
    url: 'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?auto=format&fit=crop&w=1920&q=80',
    credit: 'Photo by Unsplash'
  },
  {
    id: 'andalusia',
    nameHy: 'Անդալուսիայի արևոտ փողոցներ',
    nameEn: 'Sunny Streets of Andalusia',
    url: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1920&q=80',
    credit: 'Photo by Unsplash'
  },
  {
    id: 'mallorca',
    nameHy: 'Միջերկրական տաք ծովափ, Մալյորկա',
    nameEn: 'Warm Mediterranean Coast, Mallorca',
    url: 'https://images.unsplash.com/photo-1512753360413-a5c9cca57550?auto=format&fit=crop&w=1920&q=80',
    credit: 'Photo by Unsplash'
  }
];
