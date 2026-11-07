import type { Champion } from '../data/champions';

export const ROLES = ['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT'] as const;
export type Role = (typeof ROLES)[number];
export type Side = 'blue' | 'red';
export type TeamSlots = [string | null, string | null, string | null, string | null, string | null];
export type Draft = {
  picks: Record<Side, TeamSlots>;
  bans: Record<Side, TeamSlots>;
};

export const ROLE_LABELS: Record<Role, string> = {
  TOP: 'Üst koridor', JUNGLE: 'Orman', MID: 'Orta koridor', ADC: 'Nişancı', SUPPORT: 'Destek',
};
export const ROLE_SIGNS: Record<Role, string> = {
  TOP: '◆', JUNGLE: '❋', MID: '◇', ADC: '⌖', SUPPORT: '✦',
};

const POOL: Record<Role, string[]> = {
  TOP: 'Aatrox Aurora Camille Chogath Darius DrMundo Fiora Gangplank Garen Gragas Gwen Illaoi Irelia Jax Jayce Kennen KSante Malphite Maokai Mordekaiser Nasus Olaf Ornn Poppy Renekton Riven Rumble Sett Shen Singed Sion TahmKench Teemo Tryndamere Urgot Vladimir Volibear Warwick Yone Yorick Zac'.split(' '),
  JUNGLE: 'Amumu Belveth Briar Diana Ekko Elise Evelynn Fiddlesticks Graves Hecarim Ivern JarvanIV Karthus Kayn Khazix Kindred LeeSin Lillia Maokai MasterYi Nidalee Nocturne Nunu Poppy Rammus RekSai Rengar Sejuani Shaco Shyvana Skarner Taliyah Trundle Udyr Vi Viego Volibear Warwick MonkeyKing XinZhao Zac Zyra'.split(' '),
  MID: 'Ahri Akali Anivia Annie AurelionSol Aurora Azir Cassiopeia Corki Diana Ekko Fizz Galio Hwei Irelia Jayce Kassadin Katarina LeBlanc Lissandra Lux Malzahar Naafiri Neeko Orianna Qiyana Ryze Sylas Syndra Taliyah Talon TwistedFate Veigar Velkoz Vex Viktor Vladimir Xerath Yasuo Yone Zed Zoe'.split(' '),
  ADC: 'Aphelios Ashe Caitlyn Corki Draven Ezreal Jhin Jinx Kaisa Kalista KogMaw Lucian MissFortune Nilah Samira Seraphine Sivir Smolder Tristana Twitch Varus Vayne Xayah Zeri Ziggs'.split(' '),
  SUPPORT: 'Alistar Bard Blitzcrank Brand Braum Janna Karma Leona Lulu Lux Milio Morgana Nami Nautilus Neeko Poppy Pyke Rakan Rell Renata Senna Seraphine Sona Soraka Swain TahmKench Taric Thresh Velkoz Xerath Yuumi Zilean Zyra'.split(' '),
};

const makeSet = (ids: string) => new Set(ids.split(' '));
const FRONTLINE = makeSet('Alistar Amumu Braum Chogath DrMundo Galio Garen Gragas JarvanIV KSante Leona Malphite Maokai Mordekaiser Nautilus Ornn Poppy Rammus Rell Renekton Sejuani Sett Shen Sion Skarner TahmKench Thresh Udyr Volibear Zac');
const ENGAGE = makeSet('Alistar Amumu Ashe Blitzcrank Galio Hecarim JarvanIV Leona Malphite Maokai Nautilus Neeko Nocturne Ornn Rakan Rell Sejuani Sion Thresh Vi Volibear Zac');
const PEEL = makeSet('Alistar Ashe Braum Janna Karma Lulu Milio Morgana Nami Orianna Poppy Rakan Renata Senna Seraphine Shen Sivir Soraka TahmKench Taric Thresh Xayah Yuumi Zilean');
const MAGIC = makeSet('Ahri Akali Amumu Anivia Annie AurelionSol Aurora Azir Brand Cassiopeia Diana Ekko Elise Evelynn Fiddlesticks Fizz Galio Gragas Gwen Hwei Karthus Katarina Kennen LeBlanc Lillia Lissandra Lux Malzahar Maokai Mordekaiser Morgana Nami Neeko Nidalee Orianna Rumble Ryze Seraphine Singed Sona Swain Syndra Sylas Taliyah Veigar Velkoz Vex Viktor Vladimir Xerath Ziggs Zilean Zoe Zyra');
const MIXED = makeSet('Corki Ezreal Jax Kaisa Kayle KogMaw Shyvana Smolder Teemo Varus Volibear Yone');
const ANTI_TANK = makeSet('Brand Cassiopeia Fiora Gwen Kaisa KogMaw Lillia MasterYi Mordekaiser Trundle Varus Vayne');
const SAFE = makeSet('Ahri Akali Braum Ezreal Galio Janna Kaisa Lulu Milio Morgana Orianna Poppy Rakan Sivir TahmKench Tristana Xayah Zeri Zilean');
const FOLLOW_UP = makeSet('Aphelios Brand Diana Jinx Kaisa Katarina MissFortune Orianna Rumble Samira Seraphine Syndra Viego Xayah Yasuo Yone');
const ASSASSINS = makeSet('Akali Evelynn Fizz Katarina Kayn Khazix LeBlanc Naafiri Nocturne Qiyana Rengar Shaco Talon Zed');

export const emptyDraft = (): Draft => ({
  picks: { blue: [null, null, null, null, null], red: [null, null, null, null, null] },
  bans: { blue: [null, null, null, null, null], red: [null, null, null, null, null] },
});

export const demoDraft = (): Draft => ({
  picks: { blue: ['Ornn', 'Viego', 'Ahri', null, null], red: ['Darius', 'LeeSin', 'Syndra', null, null] },
  bans: { blue: [null, null, null, null, null], red: [null, null, null, null, null] },
});

export function selectedIds(draft: Draft): Set<string> {
  return new Set([...draft.picks.blue, ...draft.picks.red, ...draft.bans.blue, ...draft.bans.red].filter((id): id is string => Boolean(id)));
}

export function isRoleCandidate(id: string, role: Role): boolean {
  return POOL[role].includes(id);
}

export type Recommendation = { champion: Champion; score: number; reasons: string[] };

export function recommend(champions: Champion[], draft: Draft, side: Side, role: Role): Recommendation[] {
  const allyIds = draft.picks[side].filter((id, index): id is string => Boolean(id) && index !== ROLES.indexOf(role));
  const enemyIds = draft.picks[side === 'blue' ? 'red' : 'blue'].filter((id): id is string => Boolean(id));
  const unavailable = selectedIds(draft);

  const frontLineCount = allyIds.filter(id => FRONTLINE.has(id)).length;
  const magicCount = allyIds.filter(id => MAGIC.has(id)).length;
  const physicalCount = allyIds.filter(id => !MAGIC.has(id) && !MIXED.has(id)).length;
  const engageCount = allyIds.filter(id => ENGAGE.has(id)).length;
  const enemyEngage = enemyIds.filter(id => ENGAGE.has(id)).length;
  const enemyFrontline = enemyIds.filter(id => FRONTLINE.has(id)).length;
  const enemyAssassins = enemyIds.filter(id => ASSASSINS.has(id)).length;

  return champions
    .filter(champion => isRoleCandidate(champion.id, role) && !unavailable.has(champion.id))
    .map(champion => {
      const id = champion.id;
      let score = 55;
      const reasons: string[] = ['Seçtiğin rolün şampiyon havuzunda yer alıyor.'];
      if (frontLineCount === 0 && FRONTLINE.has(id)) {
        score += 14;
        reasons.push('Takımına ön saf kazandırıyor.');
      }
      if (magicCount === 0 && MAGIC.has(id)) {
        score += 12;
        reasons.push('Eksik büyü hasarını tamamlamaya yardımcı oluyor.');
      }
      if (physicalCount === 0 && !MAGIC.has(id) && !MIXED.has(id)) {
        score += 10;
        reasons.push('Takımın fiziksel hasar çeşitliliğini artırıyor.');
      }
      if (engageCount === 0 && ENGAGE.has(id)) {
        score += 10;
        reasons.push('Takıma savaş başlatma seçeneği katıyor.');
      }
      if (enemyEngage > 0 && PEEL.has(id)) {
        score += Math.min(12, enemyEngage * 6);
        reasons.push('Rakibin başlatacağı savaşlara karşı koruma sunabiliyor.');
      }
      if (enemyFrontline >= 1 && ANTI_TANK.has(id)) {
        score += Math.min(13, enemyFrontline * 7);
        reasons.push('Rakibin dayanıklı şampiyonlarına karşı araçları var.');
      }
      if (enemyAssassins > 0 && SAFE.has(id)) {
        score += Math.min(12, enemyAssassins * 8);
        reasons.push('Rakibin ani hasarına karşı savunma veya kaçış imkânı sunuyor.');
      }
      if (engageCount > 0 && FOLLOW_UP.has(id)) {
        score += 8;
        reasons.push('Takım arkadaşlarının başlattığı savaşları takip edebiliyor.');
      }
      if (magicCount > physicalCount + 1 && !MAGIC.has(id) && !MIXED.has(id)) {
        score += 8;
        reasons.push('AP ağırlıklı kompozisyonu dengeliyor.');
      }
      return { champion, score: Math.min(96, score), reasons: reasons.slice(0, 4) };
    })
    .sort((a, b) => b.score - a.score || a.champion.name.localeCompare(b.champion.name, 'tr'));
}

export function draftNotes(draft: Draft, side: Side): string[] {
  const ids = draft.picks[side].filter((id): id is string => Boolean(id));
  if (ids.length === 0) return ['Takımına şampiyon eklediğinde analiz burada görünecek.'];
  const notes: string[] = [];
  if (!ids.some(id => FRONTLINE.has(id))) notes.push('Ön saf eksik: dayanıklı bir şampiyon düşün.');
  else notes.push('Ön saf için en az bir seçenek mevcut.');
  if (!ids.some(id => ENGAGE.has(id))) notes.push('Savaş başlatma imkânı sınırlı olabilir.');
  if (!ids.some(id => MAGIC.has(id))) notes.push('Büyü hasarı eklemek kompozisyonu dengeleyebilir.');
  if (ids.filter(id => MAGIC.has(id)).length >= 3) notes.push('Takım oldukça AP ağırlıklı; fiziksel hasarı değerlendir.');
  if (notes.length === 0) notes.push('Kompozisyonun farklı ihtiyaçları karşılayan seçenekler içeriyor.');
  return notes;
}
