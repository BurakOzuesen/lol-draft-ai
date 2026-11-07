export type Champion = {
  id: string;
  key: string;
  name: string;
  title: string;
  tags: string[];
  image: { full: string };
};

// Data Dragon'a ulaşılamazsa uygulama bu küçük demo havuzuyla çalışmaya devam eder.
const fallbackRows: Array<[string, string, string[]]> = [
  ['Aatrox', 'Aatrox', ['Fighter']],
  ['Ahri', 'Ahri', ['Mage', 'Assassin']],
  ['Akali', 'Akali', ['Assassin']],
  ['Alistar', 'Alistar', ['Tank', 'Support']],
  ['Amumu', 'Amumu', ['Tank', 'Mage']],
  ['Annie', 'Annie', ['Mage']],
  ['Aphelios', 'Aphelios', ['Marksman']],
  ['Ashe', 'Ashe', ['Marksman', 'Support']],
  ['Bard', 'Bard', ['Support', 'Mage']],
  ['Blitzcrank', 'Blitzcrank', ['Tank', 'Fighter']],
  ['Brand', 'Brand', ['Mage']],
  ['Braum', 'Braum', ['Support', 'Tank']],
  ['Caitlyn', 'Caitlyn', ['Marksman']],
  ['Camille', 'Camille', ['Fighter']],
  ['Darius', 'Darius', ['Fighter', 'Tank']],
  ['Diana', 'Diana', ['Fighter', 'Mage']],
  ['Draven', 'Draven', ['Marksman']],
  ['Ekko', 'Ekko', ['Assassin', 'Fighter']],
  ['Ezreal', 'Ezreal', ['Marksman', 'Mage']],
  ['Fiora', 'Fiora', ['Fighter', 'Assassin']],
  ['Galio', 'Galio', ['Tank', 'Mage']],
  ['Garen', 'Garen', ['Fighter', 'Tank']],
  ['Gwen', 'Gwen', ['Fighter', 'Mage']],
  ['Hecarim', 'Hecarim', ['Fighter', 'Tank']],
  ['Irelia', 'Irelia', ['Fighter', 'Assassin']],
  ['Janna', 'Janna', ['Support', 'Mage']],
  ['JarvanIV', 'Jarvan IV', ['Tank', 'Fighter']],
  ['Jax', 'Jax', ['Fighter', 'Assassin']],
  ['Jhin', 'Jhin', ['Marksman', 'Mage']],
  ['Jinx', 'Jinx', ['Marksman']],
  ['Kaisa', "Kai'Sa", ['Marksman']],
  ['Karma', 'Karma', ['Mage', 'Support']],
  ['Katarina', 'Katarina', ['Assassin', 'Mage']],
  ['Khazix', "Kha'Zix", ['Assassin']],
  ['KogMaw', "Kog'Maw", ['Marksman', 'Mage']],
  ['LeBlanc', 'LeBlanc', ['Assassin', 'Mage']],
  ['LeeSin', 'Lee Sin', ['Fighter', 'Assassin']],
  ['Leona', 'Leona', ['Tank', 'Support']],
  ['Lulu', 'Lulu', ['Support', 'Mage']],
  ['Lux', 'Lux', ['Mage', 'Support']],
  ['Malphite', 'Malphite', ['Tank', 'Fighter']],
  ['Maokai', 'Maokai', ['Tank', 'Mage']],
  ['MissFortune', 'Miss Fortune', ['Marksman']],
  ['Mordekaiser', 'Mordekaiser', ['Fighter', 'Mage']],
  ['Morgana', 'Morgana', ['Mage', 'Support']],
  ['Nami', 'Nami', ['Support', 'Mage']],
  ['Nautilus', 'Nautilus', ['Tank', 'Support']],
  ['Orianna', 'Orianna', ['Mage', 'Support']],
  ['Ornn', 'Ornn', ['Tank', 'Fighter']],
  ['Poppy', 'Poppy', ['Tank', 'Fighter']],
  ['Rakan', 'Rakan', ['Support']],
  ['Rell', 'Rell', ['Tank', 'Support']],
  ['Renekton', 'Renekton', ['Fighter', 'Tank']],
  ['Riven', 'Riven', ['Fighter']],
  ['Samira', 'Samira', ['Marksman']],
  ['Sejuani', 'Sejuani', ['Tank', 'Fighter']],
  ['Senna', 'Senna', ['Marksman', 'Support']],
  ['Seraphine', 'Seraphine', ['Mage', 'Support']],
  ['Sett', 'Sett', ['Fighter', 'Tank']],
  ['Shen', 'Shen', ['Tank']],
  ['Sivir', 'Sivir', ['Marksman']],
  ['Sona', 'Sona', ['Support', 'Mage']],
  ['Soraka', 'Soraka', ['Support', 'Mage']],
  ['Syndra', 'Syndra', ['Mage']],
  ['TahmKench', 'Tahm Kench', ['Support', 'Tank']],
  ['Thresh', 'Thresh', ['Support', 'Tank']],
  ['Tristana', 'Tristana', ['Marksman', 'Assassin']],
  ['Twitch', 'Twitch', ['Marksman', 'Assassin']],
  ['Varus', 'Varus', ['Marksman', 'Mage']],
  ['Vayne', 'Vayne', ['Marksman', 'Assassin']],
  ['Veigar', 'Veigar', ['Mage']],
  ['Viego', 'Viego', ['Assassin', 'Fighter']],
  ['Vi', 'Vi', ['Fighter', 'Assassin']],
  ['Viktor', 'Viktor', ['Mage']],
  ['Volibear', 'Volibear', ['Fighter', 'Tank']],
  ['Xayah', 'Xayah', ['Marksman']],
  ['XinZhao', 'Xin Zhao', ['Fighter', 'Tank']],
  ['Yasuo', 'Yasuo', ['Fighter', 'Assassin']],
  ['Yone', 'Yone', ['Fighter', 'Assassin']],
  ['Yuumi', 'Yuumi', ['Support', 'Mage']],
  ['Zac', 'Zac', ['Tank', 'Fighter']],
  ['Zed', 'Zed', ['Assassin']],
  ['Zeri', 'Zeri', ['Marksman']],
  ['Ziggs', 'Ziggs', ['Mage']],
  ['Zyra', 'Zyra', ['Mage', 'Support']],
];

export const fallbackChampions: Champion[] = fallbackRows.map(([id, name, tags], i) => ({
  id,
  key: String(i + 1),
  name,
  tags,
  title: '',
  image: { full: `${id}.png` },
}));

export const FALLBACK_VERSION = '16.22.1';

export async function loadChampions(signal?: AbortSignal): Promise<{
  champions: Champion[];
  version: string;
  source: 'riot' | 'demo';
}> {
  try {
    const versionsResponse = await fetch('https://ddragon.leagueoflegends.com/api/versions.json', { signal });
    if (!versionsResponse.ok) throw new Error('Sürüm listesi alınamadı');
    const versions: string[] = await versionsResponse.json();
    const version = versions[0];
    if (!version) throw new Error('Sürüm bulunamadı');

    // Resmî Türkçe içerik; lokalizasyon bulunamazsa İngilizceye düşer.
    for (const locale of ['tr_TR', 'en_US']) {
      try {
        const response = await fetch(
          `https://ddragon.leagueoflegends.com/cdn/${version}/data/${locale}/champion.json`,
          { signal },
        );
        if (!response.ok) continue;
        const payload: { data: Record<string, Champion> } = await response.json();
        const champions = Object.values(payload.data).sort((a, b) => a.name.localeCompare(b.name, 'tr'));
        if (champions.length) return { champions, version, source: 'riot' };
      } catch (error) {
        if (signal?.aborted) throw error;
      }
    }
    throw new Error('Şampiyon listesi alınamadı');
  } catch (error) {
    if (signal?.aborted) throw error;
    return {
      champions: fallbackChampions,
      version: FALLBACK_VERSION,
      source: 'demo',
    };
  }
}
