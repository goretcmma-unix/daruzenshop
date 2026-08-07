import React, { useState, useEffect, useLayoutEffect, useRef, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { parseCompositionLine } from '../data';
import { useLang } from '../i18n';

export interface CompTableBlock {
  headers: string[];
  rows: string[][];
  notes: string[];
}

interface SectionGroup {
  title: string | null;
  blocks: CompTableBlock[];
}

export const buildSections = (specs: string[]): SectionGroup[] => {
  const parts = specs.map(s => parseCompositionLine(s));
  const groups: SectionGroup[] = [];
  let cur: SectionGroup = { title: null, blocks: [] };
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (p.type === 'section') {
      if (cur.blocks.length) groups.push(cur);
      cur = { title: p.text, blocks: [] };
    } else if (p.type === 'note') {
      if (!cur.blocks.length) cur.blocks.push({ headers: [], rows: [], notes: [] });
      cur.blocks[cur.blocks.length - 1].notes.push(p.text);
    } else if (p.type === 'colheader' || (p.type === 'row' && parts[i + 1]?.type === 'sep')) {
      cur.blocks.push({ headers: p.cells, rows: [], notes: [] });
    } else if (p.type === 'row') {
      if (!cur.blocks.length) cur.blocks.push({ headers: [], rows: [], notes: [] });
      cur.blocks[cur.blocks.length - 1].rows.push(p.cells);
    }
  }
  if (cur.blocks.length) groups.push(cur);
  return groups;
};

const CompRows: React.FC<{ block: CompTableBlock; t: ReturnType<typeof useLang>['t'] }> = ({ block, t }) => {
  const nonEmptyHeaders = block.headers.filter(h => h);
  const nameLabel = nonEmptyHeaders[0] || t.modal.substance;
  const valueLabels = nonEmptyHeaders.slice(1);
  const [openCol, setOpenCol] = useState<number | null>(0);
  useEffect(() => { setOpenCol(0); }, [block]);

  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const align = () => {
      root.querySelectorAll<HTMLElement>('.comp-rows__hint').forEach(hint => {
        const container = hint.parentElement;
        if (!container) return;
        const pills = [...container.querySelectorAll('.comp-card__row .comp-card__dosage')];
        const w = pills.reduce((m, p) => Math.max(m, p.getBoundingClientRect().width), 0);
        if (!w) return;
        const hdr = hint.querySelector<HTMLElement>('.comp-col, .comp-rows__hint-val:not(.comp-rows__hint-val--brd)');
        if (hdr) hdr.style.minWidth = `${w}px`;
      });
    };
    align();
    window.addEventListener('resize', align);
    if (document.fonts?.ready) document.fonts.ready.then(align).catch(() => {});
    return () => window.removeEventListener('resize', align);
  }, [block, openCol]);

  if (valueLabels.length > 0) {
    const pctIdx = valueLabels.findIndex(h => /%/.test(h));
    const doseLabels = pctIdx !== -1 ? valueLabels.filter((_, i) => i !== pctIdx) : valueLabels;
    return (
      <div ref={rootRef}>
      {pctIdx !== -1 && valueLabels[pctIdx] && (
        <div className="comp-card__pct-caption">{valueLabels[pctIdx]}</div>
      )}
      <div className="comp-dose">
        {doseLabels.map((label, ci) => {
          const open = ci === openCol;
          return (
            <div key={ci} className="comp-acc">
              <button type="button" className={`comp-acc__head${open ? ' is-open' : ''}`} onClick={() => setOpenCol(open ? null : ci)}>
                <span>{label}</span>
                <ChevronDown size={16} className="comp-acc__chev" />
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    key="acc-body"
                    className="comp-acc__body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="comp-acc__body-inner">
                      <div className="comp-rows__hint">
                        <span className="comp-rows__hint-name">{t.modal.substance}</span>
                        <span className="comp-card__values">
                          <span className="comp-col">
                            <span className="comp-rows__hint-val">{t.modal.dosage}</span>
                          </span>
                          {pctIdx !== -1 && <span className="comp-col comp-col--brd">
                            <span className="comp-rows__hint-val comp-rows__hint-val--brd">BRD</span>
                          </span>}
                        </span>
                      </div>
                      {block.rows.map((cells, ri) => {
                        const name = cells[0];
                        if (!name) return null;
                        const sub = name.startsWith('└');
                        const val = cells[ci + 1];
                        if (!val || val === '-') return null;
                        const pct = pctIdx !== -1 ? cells[pctIdx + 1] : null;
                        const showPct = !!pct;
                        return (
                          <div key={ri} className={'comp-card__row' + (sub ? ' is-sub' : '')}>
                            <span className="comp-card__name">{sub ? name.replace(/^└\s*/, '') : name}</span>
                            <span className="comp-card__values">
                              <span className="comp-card__dosage">{val}</span>
                              {showPct && <span className="comp-card__pct">{pct}</span>}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
      {block.notes.length > 0 && (
        <div className="comp-table__notes">
          {block.notes.map((n, i) => (
            <div key={i} className="comp-table__note">{n}</div>
          ))}
        </div>
      )}
      </div>
    );
  }

  const valueCount = block.rows.reduce((m, r) => Math.max(m, r.length - 1), 0);
  let pctCol = -1;
  if (valueCount > 0) {
    for (let vi = 0; vi < valueCount; vi++) {
      const vals = block.rows.map(r => r[vi + 1]).filter((c): c is string => !!c && c !== '-' && c !== '—');
      if (vals.length && vals.filter(c => /%/.test(c)).length >= vals.length / 2) { pctCol = vi; break; }
    }
  }

  return (
    <div ref={rootRef}>
      {valueCount > 0 && (
        <div className="comp-rows__hint">
          <span className="comp-rows__hint-name">{nameLabel || t.modal.substance}</span>
          <span className="comp-card__values">
            <span className="comp-rows__hint-val">{t.modal.dosage}</span>
            {pctCol !== -1 && <span className="comp-rows__hint-val comp-rows__hint-val--brd">BRD</span>}
          </span>
        </div>
      )}
      {block.rows.map((cells, ri) => {
        const name = cells[0];
        if (!name) return null;
        const sub = name.startsWith('└');
        return (
          <div key={ri} className={'comp-card__row' + (sub ? ' is-sub' : '')}>
            <span className="comp-card__name">{sub ? name.replace(/^└\s*/, '') : name}</span>
            <span className="comp-card__values">
              {cells.slice(1).map((v, vi) => {
                if (!v) return null;
                return <span key={vi} className={vi === pctCol ? 'comp-card__pct' : 'comp-card__dosage'}>{v}</span>;
              })}
            </span>
          </div>
        );
      })}
      {block.notes.length > 0 && (
        <div className="comp-table__notes">
          {block.notes.map((n, i) => (
            <div key={i} className="comp-table__note">{n}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export const CompositionPanel: React.FC<{ specs?: string[]; t: ReturnType<typeof useLang>['t'] }> = ({ specs, t }) => {
  const specLines = specs ?? [];
  const groups = useMemo(() => buildSections(specLines), [specLines]);
  const sectioned = groups.filter(g => g.title).length > 1;
  const [openSection, setOpenSection] = useState(0);
  const [simpleOpen, setSimpleOpen] = useState(true);
  useEffect(() => { setOpenSection(0); setSimpleOpen(true); }, [specLines]);

  if (sectioned) {
    return (
      <div className="comp-card">
        {groups.map((g, i) => (
          <div key={i} className="comp-acc">
            <button type="button" className={`comp-acc__head${i === openSection ? ' is-open' : ''}`} onClick={() => setOpenSection(i)}>
              <span>{g.title}</span>
              <ChevronDown size={16} className="comp-acc__chev" />
            </button>
            <AnimatePresence initial={false}>
              {i === openSection && (
                <motion.div
                  key="acc-body"
                  className="comp-acc__body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="comp-acc__body-inner">
                    {g.blocks.map((b, bi) => (
                      <CompRows key={bi} block={b} t={t} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    );
  }

  const hasValueCols = groups.some(g => g.blocks.some(b => b.headers.filter(h => h).length > 1));

  if (hasValueCols) {
    return (
      <div className="comp-card">
        {groups.map((g, gi) => (
          <div key={gi}>
            {g.title && <div className="comp-card__section"><span>{g.title}</span></div>}
            {g.blocks.map((b, bi) => (
              <CompRows key={bi} block={b} t={t} />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="comp-card">
      <div className="comp-acc">
        <button type="button" className={`comp-acc__head${simpleOpen ? ' is-open' : ''}`} onClick={() => setSimpleOpen(o => !o)}>
          <span>{t.modal.composition}</span>
          <ChevronDown size={16} className="comp-acc__chev" />
        </button>
        <AnimatePresence initial={false}>
          {simpleOpen && (
            <motion.div
              key="acc-body"
              className="comp-acc__body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="comp-acc__body-inner">
                {groups.map((g, gi) => (
                  <div key={gi}>
                    {g.title && <div className="comp-card__section"><span>{g.title}</span></div>}
                    {g.blocks.map((b, bi) => (
                      <CompRows key={bi} block={b} t={t} />
                    ))}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
