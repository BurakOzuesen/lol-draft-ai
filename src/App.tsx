import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { type Champion, FALLBACK_VERSION, fallbackChampions, loadChampions } from './data/champions';
import {
  type Draft, type Role, type Side, type TeamSlots,
  ROLES, ROLE_LABELS, ROLE_SIGNS, demoDraft, draftNotes,
  emptyDraft, isRoleCandidate, recommend, selectedIds,
} from './lib/draft';

type SlotTarget = { kind: 'picks' | 'bans'; side: Side; index: number };
type RoleFilter = Role | 'ALL';
const STORAGE_KEY = 'lol-draft-lab-v1';

function readDraft(): Draft {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return demoDraft();
    const parsed = JSON.parse(raw) as Draft;
    if (['blue', 'red'].every(side =>
      Array.isArray(parsed?.picks?.[side as Side]) && parsed.picks[side as Side].length === 5 &&
      Array.isArray(parsed?.bans?.[side as Side]) && parsed.bans[side as Side].length === 5
    )) return parsed;
  } catch { /* Bozuk yerel kayıt varsa örnek draft'a dön. */ }
  return demoDraft();
}

function Avatar({ champion, version, size = 'md' }: {
  champion?: Champion;
  version: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const src = champion
    ? `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champion.image.full}`
    : undefined;
  return (
    <span className={`avatar avatar-${size} ${champion ? '' : 'avatar-empty'}`}>
      <span className="avatar-initial">{champion?.name.slice(0, 2).toLocaleUpperCase('tr') || '+'}</span>
      {champion && src !== failedSrc && <img key={src} src={src} alt="" loading="lazy" onError={() => setFailedSrc(src ?? null)} />}
    </span>
  );
}

function Icon({ name, size = 18 }: { name: 'sparkles' | 'refresh' | 'search' | 'close' | 'check' | 'arrow' | 'info' | 'ban'; size?: number }) {
  const paths: Record<typeof name, ReactNode> = {
    sparkles: <><path d="m12 3 1.9 5.9L20 11l-6.1 2.1L12 19l-1.9-5.9L4 11l6.1-2.1L12 3Z"/><path d="m19 19 1 2 1-2 2-1-2-1-1-2-1 2-2 1 2 1ZM4 3l.8 1.7L6.5 5.5l-1.7.8L4 8l-.8-1.7-1.7-.8 1.7-.8L4 3Z"/></>,
    refresh: <><path d="M3 11a9 9 0 0 1 15.4-6.4L21 7"/><path d="M21 3v4h-4"/><path d="M21 13a9 9 0 0 1-15.4 6.4L3 17"/><path d="M3 21v-4h4"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/></>,
    close: <><path d="M18 6 6 18M6 6l12 12"/></>,
    check: <><path d="m5 12 4 4L19 6"/></>,
    arrow: <><path d="M5 12h14m-7-7 7 7-7 7"/></>,
    info: <><circle cx="12" cy="12" r="10"/><path d="M12 11v6M12 7h.01"/></>,
    ban: <><circle cx="12" cy="12" r="9"/><path d="M6 6l12 12"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function App() {
  const [draft, setDraft] = useState<Draft>(readDraft);
  const [champions, setChampions] = useState<Champion[]>(fallbackChampions);
  const [version, setVersion] = useState(FALLBACK_VERSION);
  const [source, setSource] = useState<'loading' | 'riot' | 'demo'>('loading');
  const [side, setSide] = useState<Side>('blue');
  const [role, setRole] = useState<Role>('ADC');
  const [target, setTarget] = useState<SlotTarget | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<RoleFilter>('ALL');

  useEffect(() => {
    const controller = new AbortController();
    loadChampions(controller.signal).then(({ champions: list, version: patch, source: origin }) => {
      setChampions(list);
      setVersion(patch);
      setSource(origin);
    }).catch(() => {});
    return () => controller.abort();
  }, []);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(draft)); }, [draft]);
  useEffect(() => {
    if (!target) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setTarget(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [target]);

  const championMap = useMemo(() => new Map(champions.map(c => [c.id, c])), [champions]);
  const alreadyUsed = useMemo(() => selectedIds(draft), [draft]);
  const recommendations = useMemo(() => recommend(champions, draft, side, role).slice(0, 5), [champions, draft, side, role]);
  const selectedCount = draft.picks.blue.filter(Boolean).length + draft.picks.red.filter(Boolean).length;
  const banCount = draft.bans.blue.filter(Boolean).length + draft.bans.red.filter(Boolean).length;
  const pickerChampions = useMemo(() => {
    const keyword = search.trim().toLocaleLowerCase('tr');
    return champions.filter(c =>
      (filter === 'ALL' || isRoleCandidate(c.id, filter)) &&
      (!keyword || c.name.toLocaleLowerCase('tr').includes(keyword) || c.id.toLocaleLowerCase('tr').includes(keyword))
    );
  }, [champions, filter, search]);

  function openPicker(kind: SlotTarget['kind'], pickedSide: Side, index: number) {
    setTarget({ kind, side: pickedSide, index });
    setFilter(kind === 'picks' ? ROLES[index] : 'ALL');
    setSearch('');
  }

  function updateSlot(kind: SlotTarget['kind'], updatedSide: Side, index: number, id: string | null) {
    setDraft(previous => {
      if (id && selectedIds(previous).has(id) && previous[kind][updatedSide][index] !== id) return previous;
      const slots = [...previous[kind][updatedSide]] as TeamSlots;
      slots[index] = id;
      return { ...previous, [kind]: { ...previous[kind], [updatedSide]: slots } };
    });
  }

  function selectChampion(id: string) {
    if (!target) return;
    updateSlot(target.kind, target.side, target.index, id);
    setTarget(null);
  }

  function applyRecommendation(id: string) {
    updateSlot('picks', side, ROLES.indexOf(role), id);
  }

  function TeamPanel({ teamSide }: { teamSide: Side }) {
    const isBlue = teamSide === 'blue';
    const filled = draft.picks[teamSide].filter(Boolean).length;
    return (
      <section className={`team-panel panel ${isBlue ? 'team-blue' : 'team-red'}`}>
        <div className="team-header">
          <div className="team-icon">{isBlue ? 'Ⅰ' : 'Ⅱ'}</div>
          <div>
            <div className="eyebrow">{isBlue ? 'BLUE SIDE' : 'RED SIDE'}</div>
            <h2>{isBlue ? 'Mavi Takım' : 'Kırmızı Takım'}</h2>
          </div>
          <div className="team-count">{filled}<span>/5</span></div>
        </div>
        <div className="team-slots">
          {ROLES.map((slotRole, index) => {
            const id = draft.picks[teamSide][index];
            const champion = id ? championMap.get(id) : undefined;
            return (
              <div className={`pick-row ${id ? 'filled' : ''}`} key={slotRole}>
                <div className="role-marker" title={ROLE_LABELS[slotRole]}>{ROLE_SIGNS[slotRole]}</div>
                <button className="pick-button" onClick={() => openPicker('picks', teamSide, index)} aria-label={`${isBlue ? 'Mavi' : 'Kırmızı'} takım ${slotRole} şampiyonu seç`}>
                  <Avatar champion={champion} version={version} />
                  <span className="pick-copy">
                    <span className="pick-role">{slotRole}</span>
                    <strong>{champion?.name || (id ?? 'Şampiyon seç')}</strong>
                  </span>
                  <span className="pick-action">{id ? 'Değiştir' : 'Seç +'}</span>
                </button>
                {id && <button className="clear-slot" aria-label={`${champion?.name || id} seçimini kaldır`} title="Seçimi kaldır" onClick={() => updateSlot('picks', teamSide, index, null)}><Icon name="close" size={15} /></button>}
              </div>
            );
          })}
        </div>
        <div className="ban-heading"><span>YASAKLAMALAR</span><small>{draft.bans[teamSide].filter(Boolean).length}/5</small></div>
        <div className="ban-grid">
          {draft.bans[teamSide].map((id, index) => {
            const champion = id ? championMap.get(id) : undefined;
            return (
              <div className="ban-item" key={index}>
                <button className="ban-button" title={champion?.name || `${index + 1}. ban seç`} aria-label={`${index + 1}. ban seç`} onClick={() => openPicker('bans', teamSide, index)}>
                  {id ? <Avatar champion={champion} version={version} size="sm" /> : <span className="empty-ban"><Icon name="ban" size={17}/></span>}
                </button>
                {id && <button className="ban-remove" onClick={() => updateSlot('bans', teamSide, index, null)} title="Banı kaldır" aria-label="Banı kaldır">×</button>}
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  return (
    <div className="site-shell">
      <div className="ambient ambient-one"/><div className="ambient ambient-two"/>
      <header className="topbar">
        <div className="brand"><span className="brand-mark">◇</span><span>DRAFT<span className="brand-highlight">LAB</span></span><span className="brand-label">BETA</span></div>
        <div className="header-actions">
          <span className={`data-status ${source === 'riot' ? 'status-live' : ''}`}><i />{source === 'loading' ? 'Şampiyon verisi yükleniyor' : source === 'riot' ? `Riot Data Dragon · ${version}` : 'Çevrimdışı demo veri seti'}</span>
          <button className="header-button" onClick={() => setDraft(demoDraft())}><Icon name="refresh" size={16}/> Örnek draft</button>
          <button className="header-button button-muted" onClick={() => setDraft(emptyDraft())}>Sıfırla</button>
        </div>
      </header>

      <main className="content">
        <div className="intro">
          <div><div className="section-kicker"><span className="kicker-dash"/> DRAFT ANALİZ MERKEZİ <span className="kicker-dash"/></div>
            <h1>Akıllı draft, <em>daha bilinçli seçim.</em></h1>
            <p>Takımlarını oluştur, kompozisyonunu incele ve alternatif seçimleri karşılaştır.</p>
          </div>
          <div className="intro-stats"><div><strong>{selectedCount}<small>/10</small></strong><span>PICK</span></div><div className="stat-divider"/><div><strong>{banCount}<small>/10</small></strong><span>BAN</span></div></div>
        </div>

        <div className="board">
          <TeamPanel teamSide="blue" />
          <section className="assistant-panel panel">
            <div className="assistant-top"><span className="assistant-icon"><Icon name="sparkles" size={19}/></span><div><div className="eyebrow gold-text">DRAFT ASİSTANI</div><h2>Pick önerileri</h2></div><span className="rule-tag">V0.1</span></div>
            <p className="assistant-sub">Takımını ve eksik rolü belirle; öneriler anında güncellensin.</p>
            <div className="control-label">HANGİ TAKIM İÇİN?</div>
            <div className="side-switch"><button className={side === 'blue' ? 'selected blue-active' : ''} onClick={() => setSide('blue')}><span className="blue-dot"/> Mavi takım</button><button className={side === 'red' ? 'selected red-active' : ''} onClick={() => setSide('red')}><span className="red-dot"/> Kırmızı takım</button></div>
            <div className="control-label role-heading">ÖNERİ İSTENEN ROL</div>
            <div className="role-grid">{ROLES.map(r => <button key={r} className={role === r ? 'role-selected' : ''} onClick={() => setRole(r)} title={ROLE_LABELS[r]}><span>{ROLE_SIGNS[r]}</span>{r === 'JUNGLE' ? 'JUNG' : r === 'SUPPORT' ? 'SUP' : r}</button>)}</div>
            <div className="recommendation-heading"><span><Icon name="sparkles" size={17}/> ÖNERİLEN ŞAMPİYONLAR</span><small>Uyum puanı</small></div>
            <div className="recommendation-list">
              {recommendations.length === 0 && <p className="empty-recs">Uygun aday kalmadı. Yasakları veya seçimleri kontrol et.</p>}
              {recommendations.map(({ champion, score, reasons }, index) => (
                <article className="recommendation" key={champion.id}>
                  <div className="recommend-main"><span className="rec-rank">{String(index + 1).padStart(2, '0')}</span><Avatar champion={champion} version={version} size="lg"/><div className="rec-content"><strong>{champion.name}</strong><span>{reasons.slice(1, 2)[0] || 'Rol uyumuna göre seçenek'}</span></div><div className="score-wrap"><strong>{score}</strong><small>/100</small></div></div>
                  <div className="rec-bottom"><span className="mini-score"><i style={{ width: `${score}%` }}/></span><button onClick={() => applyRecommendation(champion.id)}>Seç <Icon name="arrow" size={13}/></button></div>
                </article>
              ))}
            </div>
            <p className="score-info"><Icon name="info" size={15}/> Puanlar kural tabanlı uyum tahminidir; kazanma olasılığı veya canlı winrate değildir.</p>
          </section>
          <TeamPanel teamSide="red" />
        </div>

        <section className="insights-panel panel">
          <div className="insights-title"><span className="insight-symbol">✧</span><div><div className="eyebrow">KOMPOZİSYON KONTROLÜ</div><h2>Draft notları</h2></div></div>
          <div className="insights-columns">{(['blue','red'] as Side[]).map(teamSide => <div className="insight-column" key={teamSide}><strong className={teamSide === 'blue' ? 'blue-text' : 'red-text'}>{teamSide === 'blue' ? 'Mavi takım' : 'Kırmızı takım'}</strong>{draftNotes(draft, teamSide).map(note => <div className="insight-note" key={note}><span>◇</span> {note}</div>)}</div>)}</div>
        </section>
        <footer className="footer"><span>Draft Lab · Eğitim / prototip sürümü</span><p>Draft Lab is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games and all associated properties are trademarks or registered trademarks of Riot Games, Inc.</p></footer>
      </main>

      {target && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setTarget(null); }}>
        <section className="picker-modal" role="dialog" aria-modal="true" aria-labelledby="picker-heading">
          <div className="picker-top"><div><span className="eyebrow">ŞAMPİYON HAVUZU</span><h2 id="picker-heading">{target.kind === 'bans' ? 'Yasaklanacak şampiyonu seç' : `${ROLES[target.index]} şampiyonu seç`}</h2></div><button className="close-picker" onClick={() => setTarget(null)} aria-label="Pencereyi kapat"><Icon name="close" size={22}/></button></div>
          <label className="search-box"><Icon name="search" size={19}/><input autoFocus placeholder="Şampiyon ara... (örn. Ahri, Jinx)" value={search} onChange={(e) => setSearch(e.target.value)}/></label>
          <div className="picker-filters">{(['ALL', ...ROLES] as RoleFilter[]).map(f => <button key={f} onClick={() => setFilter(f)} className={filter === f ? 'filter-active' : ''}>{f === 'ALL' ? 'Tümü' : f === 'JUNGLE' ? 'Jungle' : f === 'SUPPORT' ? 'Support' : f}</button>)}</div>
          <div className="picker-meta"><span>{pickerChampions.length} şampiyon listeleniyor</span><span>Seçili / banlı şampiyonlar tekrar seçilemez</span></div>
          <div className="champion-grid">{pickerChampions.map(champion => {
            const currentId = draft[target.kind][target.side][target.index];
            const locked = alreadyUsed.has(champion.id) && currentId !== champion.id;
            return <button key={champion.id} className={`champion-tile ${locked ? 'champion-locked' : ''}`} onClick={() => selectChampion(champion.id)} disabled={locked}><Avatar champion={champion} version={version} size="lg"/><span>{champion.name}</span>{currentId === champion.id && <span className="current-check"><Icon name="check" size={14}/></span>}</button>;
          })}</div>
          {pickerChampions.length === 0 && <p className="picker-empty">Bu aramada şampiyon bulunamadı.</p>}
          <div className="picker-footer"><button onClick={() => { updateSlot(target.kind, target.side, target.index, null); setTarget(null); }}>Bu slotu boşalt</button><span>ESC ile kapatabilirsin</span></div>
        </section>
      </div>}
    </div>
  );
}
