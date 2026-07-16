import type { Graha } from './hora-detector';
import { t, type AppLanguage, type TranslationKey } from '@/locales/translations';

export const grahaSymbols: Record<Graha, string> = {
  Ravi: '☉',
  Shukra: '♀',
  Budh: '☿',
  Chandra: '☽',
  Shani: '♄',
  Guru: '♃',
  Mangal: '♂',
};

export const grahaColors: Record<Graha, { background: string; foreground: string; soft: string }> = {
  Ravi: { background: '#F0A51A', foreground: '#2B1700', soft: '#FFF2CC' },
  Shukra: { background: '#41A678', foreground: '#031F14', soft: '#DDF7EA' },
  Budh: { background: '#C5B52C', foreground: '#262205', soft: '#F8F0B7' },
  Chandra: { background: '#78A8D8', foreground: '#081827', soft: '#E1F0FF' },
  Shani: { background: '#5C6370', foreground: '#F7F2E8', soft: '#E4E6EA' },
  Guru: { background: '#D28719', foreground: '#291800', soft: '#FFE5B5' },
  Mangal: { background: '#D84B35', foreground: '#FFF7EF', soft: '#FFE0D8' },
};

const grahaTranslationKeys: Record<Graha, TranslationKey> = {
  Ravi: 'grahaRavi',
  Shukra: 'grahaShukra',
  Budh: 'grahaBudh',
  Chandra: 'grahaChandra',
  Shani: 'grahaShani',
  Guru: 'grahaGuru',
  Mangal: 'grahaMangal',
};

export function getGrahaName(graha: Graha, language: AppLanguage) {
  return t(language, grahaTranslationKeys[graha]);
}
