"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ACTORS, type RoleKey as Role, type ActorData, type ActorItem } from "@/lib/mock-data";
import { WOUNDS, CATEGORY_META } from "@/lib/mock-data";
import { useRole } from "../components/RoleContext";
import Link from "next/link";
import s from "./profile.module.css";

/* ─── SVG icons ─── */
const MetaIcon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" width={15} height={15} fill="none" stroke="var(--text-2)" strokeWidth={1.8}><path d={d} /></svg>
);
const CheckIcon = ({ c = "var(--st-healed-mark)", w = 15 }: { c?: string; w?: number }) => (
  <svg viewBox="0 0 24 24" width={w} height={w} fill="none" stroke={c} strokeWidth={2.6}><path d="M20 6L9 17l-5-5" /></svg>
);
const ShapeIcon = ({ shape }: { shape: string }) => {
  const paths: Record<string, string> = {
    healed: "M3 7h10v2H3z M7 3h2v10H7z",
    "in-progress": "M8 2l7 12H1z",
    "not-achieved": "M3 7h10v2H3z",
    assessing: "M5 2h6v6H5z",
    routed: "M6 2h4v12H6z",
  };
  return <svg viewBox="0 0 16 16" width={11} height={11} fill="currentColor"><path d={paths[shape] || paths.healed} /></svg>;
};
const EditIcon = ({ c = "var(--c-white)", w = 16 }: { c?: string; w?: number }) => (
  <svg viewBox="0 0 24 24" width={w} height={w} fill="none" stroke={c} strokeWidth={2}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
);
const ShareIcon = () => (
  <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" /></svg>
);
const CloseIcon = () => (
  <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 6L6 18M6 6l12 12" /></svg>
);
const SettingsIcon = ({ c = "var(--c-white)", w = 16 }: { c?: string; w?: number }) => (
  <svg viewBox="0 0 24 24" width={w} height={w} fill="none" stroke={c} strokeWidth={2}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);
const InfoSvg = () => (
  <svg viewBox="0 0 24 24" width={17} height={17} fill="none" stroke="var(--report)" strokeWidth={2.2}><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16h.01" /></svg>
);
const ChevSvg = () => (
  <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="var(--text-2)" strokeWidth={2}><path d="M6 9l6 6 6-6" /></svg>
);
const ArrowSvg = () => (
  <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="var(--text-2)" strokeWidth={2}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
const CheckStroke = "M20 6L9 17l-5-5";

const STATUS_LABEL: Record<string, string> = {
  healed: "Healed", "in-progress": "In Progress", "not-achieved": "Not Achieved", assessing: "Overdue", routed: "Routed · Gov",
};
const STATUS_CLASS: Record<string, string> = {
  healed: s.sHealed, "in-progress": s.sActive, "not-achieved": s.sFailed, assessing: s.sAssess, routed: s.sGov,
};

/* ─── editable fields config per role ─── */
const EDITABLE_INFO: Record<Role, number[]> = {
  citizen: [3],
  ngo: [0, 1, 2, 3],
  corporate: [0, 1, 2, 3],
  government: [1],
};

/* ─── trust row ─── */
function TrustRow({ a }: { a: ActorData }) {
  return (
    <div className={s.trust}>
      {a.trust.map((c, i) => {
        if (c.type === "score") {
          const off = 157 - (157 * parseInt(c.v) / 100);
          return (
            <div className={s.trustCell} key={i}>
              <div className={s.scoreCell}>
                <svg className={s.ring} viewBox="0 0 60 60">
                  <circle className={s.ringBg} cx="30" cy="30" r="25" />
                  <circle className={s.ringArc} cx="30" cy="30" r="25" strokeDasharray="157" strokeDashoffset={off} transform="rotate(-90 30 30)" />
                </svg>
                <div>
                  <div className={s.scoreValue}>{c.v}</div>
                  <div className={s.scoreLabel}>{c.l}</div>
                </div>
              </div>
            </div>
          );
        }
        return (
          <div className={s.trustCell} key={i}>
            <div className={s.trustValue}>
              {c.v}{c.sm ? <span className={s.trustValueSm}>{c.sm}</span> : null}
            </div>
            <div className={s.trustLabel}>{c.l}</div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── project card ─── */
function ProjectCard({ item, open, onToggle }: { item: ActorItem; open: boolean; onToggle: () => void }) {
  const wound = WOUNDS.find(w => w.id === item.woundId);
  return (
    <div className={open ? s.projOpen : s.proj}>
      <div className={s.projHead} onClick={onToggle}>
        <div className={s.projTitleArea}>
          <span className={`${s.pill} ${STATUS_CLASS[item.s]}`}>
            <ShapeIcon shape={item.s} />{STATUS_LABEL[item.s]}
          </span>
          <h4 className={s.projTitle}>{wound?.title ?? item.woundId}</h4>
          <div className={s.projMeta}>
            <span>{wound ? CATEGORY_META[wound.category]?.label : ""}</span>
            <span className={s.projMetaDot} />
            <span>{wound?.date ?? ""}</span>
          </div>
        </div>
        <div className={s.projAmt}>
          <div className={s.projAmtValue}>{item.right}</div>
          <div className={s.projAmtLabel}>{item.rl}</div>
        </div>
        <ChevSvg />
      </div>
      <div className={s.projBody}>
        <div className={s.projBodyInner}>
          <p>{wound?.body ?? ""}</p>
          <div className={s.outcome}>
            {(wound?.outcome ?? []).map((o, j) => (
              <div className={`${s.outcomeItem}${item.s === "not-achieved" && j > 0 ? ` ${s.outcomeFail}` : ""}`} key={j}>
                <div className={s.outcomeVal}>{o[0]}</div>
                <div className={s.outcomeLabel}>{o[1]}</div>
              </div>
            ))}
          </div>
          {item.linked.actorId ? (
            <Link href={item.linked.actorId === "citizen" ? "/profile" : `/${item.linked.actorId}`} className={s.linked} style={{ textDecoration: "none" }}>
              <span className={s.linkedFl} style={{ background: item.linked.bg }}>{item.linked.mono}</span>
              <span>{item.linked.pre} <b>{item.linked.name}</b></span>
              <ArrowSvg />
            </Link>
          ) : (
            <button className={s.linked}>
              <span className={s.linkedFl} style={{ background: item.linked.bg }}>{item.linked.mono}</span>
              <span>{item.linked.pre} <b>{item.linked.name}</b></span>
              <ArrowSvg />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── edit modal ─── */
type Edits = { name: string; tag: string; about: string; location: string; infoEdits: Record<number, string> };

function EditModal({ role, onClose, onSave }: { role: Role; onClose: () => void; onSave: (e: Edits) => void }) {
  const a = ACTORS[role];
  const [name, setName] = useState(a.name);
  const [tag, setTag] = useState(a.tag);
  const [about, setAbout] = useState(a.about.join("\n\n"));
  const [location, setLocation] = useState(a.meta[0]?.[1] || "");
  const [infoEdits, setInfoEdits] = useState<Record<number, string>>({});

  const editableInfoIdxs = EDITABLE_INFO[role] || [];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  const handleSave = () => {
    onSave({ name, tag, about, location, infoEdits });
    onClose();
  };

  return (
    <div className={s.modalOverlay} onClick={onClose}>
      <div className={s.modalCard} onClick={e => e.stopPropagation()}>
        <div className={s.modalHeader}>
          <h2 className={s.modalTitle}>Edit profile</h2>
          <button className={s.modalClose} onClick={onClose} aria-label="Close"><CloseIcon /></button>
        </div>
        <div className={s.modalBody}>
          <div className={s.modalProfileRow}>
            <div className={s.logo} style={{ background: a.logoBg }}>{a.mono}</div>
            <div>
              <div className={s.modalRoleLabel}>{a.roleLabel}</div>
              <div className={s.modalHint}>Changes are saved to this preview only.</div>
            </div>
          </div>

          <div className={s.formField}>
            <label className={s.formLabel}>{role === "citizen" ? "Display name" : "Organisation name"}</label>
            <input className={s.formInput} value={name} onChange={e => setName(e.target.value)} />
          </div>

          <div className={s.formField}>
            <label className={s.formLabel}>Tagline</label>
            <input className={s.formInput} value={tag} onChange={e => setTag(e.target.value)} />
          </div>

          <div className={s.formField}>
            <label className={s.formLabel}>Location</label>
            <input className={s.formInput} value={location} onChange={e => setLocation(e.target.value)} />
          </div>

          {editableInfoIdxs.length > 0 && (
            <div className={s.formField}>
              <label className={s.formLabel}>Details</label>
              <div className={s.formInfoList}>
                {editableInfoIdxs.map(idx => (
                  <div className={s.formInfoRow} key={idx}>
                    <span className={s.formInfoKey}>{a.info[idx]?.[0]}</span>
                    <input
                      className={s.formInput}
                      value={infoEdits[idx] ?? a.info[idx]?.[1] ?? ""}
                      onChange={e => setInfoEdits(prev => ({ ...prev, [idx]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={s.formField}>
            <label className={s.formLabel}>About</label>
            <textarea className={s.formTextarea} value={about} onChange={e => setAbout(e.target.value)} rows={6} />
            <span className={s.formHint}>Separate paragraphs with a blank line.</span>
          </div>
        </div>
        <div className={s.modalFooter}>
          <button className={s.btnCancel} onClick={onClose}>Cancel</button>
          <button className={s.btnSave} onClick={handleSave}>Save changes</button>
        </div>
      </div>
    </div>
  );
}

/* ─── main profile content ─── */
function ProfileContent({ role, overrides, onOpenEdit }: {
  role: Role;
  overrides: Partial<Edits> | null;
  onOpenEdit: () => void;
}) {
  const a = ACTORS[role];
  const [tab, setTab] = useState(0);
  const [openIndex, setOpenIndex] = useState(0);
  const [filterIdx, setFilterIdx] = useState(0);
  const [shared, setShared] = useState(false);

  const name = overrides?.name ?? a.name;
  const tag = overrides?.tag ?? a.tag;
  const about = overrides?.about ? overrides.about.split(/\n\n+/) : a.about;
  const location = overrides?.location ?? a.meta[0]?.[1];
  const infoEdits = overrides?.infoEdits || {};

  const meta = [...a.meta];
  if (overrides?.location && meta[0]) meta[0] = [meta[0][0], overrides.location];

  const info = a.info.map((row, i) => infoEdits[i] ? [row[0], infoEdits[i]] as [string, string] : row);

  const handleShare = () => {
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <div className={s.fade}>
      <header className={s.header}>
        <div className={s.headerRow}>
          <div className={s.logo} style={{ background: a.logoBg }}>{a.mono}</div>
          <div className={s.hm}>
            <div className={s.eyebrow}>
              <span className={s.roleChip}>{a.roleLabel}</span>
              <span className={s.dotsep} />
              {a.verified && (
                <span className={s.verified}><CheckIcon /> Verified by Setu</span>
              )}
            </div>
            <h1 className={s.orgName}>{name}</h1>
            <p className={s.orgTag}>{tag}</p>
            <div className={s.orgMeta}>
              {meta.map((m, i) => (
                <span className={s.metaItem} key={i}><MetaIcon d={m[0]} />{m[1]}</span>
              ))}
            </div>
            <div className={s.actions}>
              <button className={s.btnMsg} onClick={onOpenEdit}>
                <EditIcon c="var(--c-white)" w={17} /> Edit profile
              </button>
              <Link href="/settings" className={s.btnEdit}>
                <SettingsIcon w={17} /> Settings
              </Link>
              <button className={s.btnFollow} onClick={handleShare}>
                <ShareIcon />{shared ? "Link copied" : "Share"}
              </button>
            </div>
          </div>
        </div>
        <TrustRow a={a} />
        {a.creds && (
          <div className={s.creds}>
            <span className={s.credsLead}>
              <CheckIcon />{role === "government" ? "Verified public body" : role === "corporate" ? "Verified filings" : "Credentials, continuously re-verified"}
            </span>
            <div className={s.credsItems}>
              {a.creds.map((c, i) => (
                <span className={s.cred} key={i}>{c[0]} <span className={s.credSuffix}>{c[1]}</span></span>
              ))}
            </div>
          </div>
        )}
      </header>

      <div className={s.tabs}>
        {a.tabs.map((t, i) => (
          <button key={i} className={tab === i ? s.tabOn : s.tab} onClick={() => setTab(i)}>
            {t}{i === 1 ? <span className={s.tabCount}>{a.items.length}</span> : null}
          </button>
        ))}
      </div>

      {tab === 0 && (
        <div className={s.panel}>
          <h2 className={s.secH} dangerouslySetInnerHTML={{ __html: a.impact.h }} />
          <p className={s.secP} dangerouslySetInnerHTML={{ __html: a.impact.p }} />
          <div className={s.impactTwo}>
            <div className={s.icardWin}>
              <div className={s.icardHead}>
                <svg viewBox="0 0 24 24" width={17} height={17} fill="none" stroke="currentColor" strokeWidth={2.2}><path d={CheckStroke} /></svg>
                {a.impact.win.ih}
              </div>
              <div className={s.icardBig}>
                {a.impact.win.big}
                {a.impact.win.bigSm ? <span className={s.icardBigSm}>{a.impact.win.bigSm}</span> : null}
              </div>
              <div className={s.icardCap}>{a.impact.win.cap}</div>
            </div>
            <div className={s.icard}>
              <div className={s.icardHead} style={{ color: "var(--text-2)" }}>
                <InfoSvg />{a.impact.other.ih}
              </div>
              <div className={s.icardBig}>{a.impact.other.big}</div>
              <div className={s.icardCap}>{a.impact.other.cap}</div>
            </div>
          </div>
          {role === "ngo" && (
            <>
              <h2 className={`${s.secH} ${s.districtsH}`}>Working across seven districts of Maharashtra</h2>
              <div className={s.districts}>
                {["Jalgaon 11", "Aurangabad 7", "Nashik 5", "Parbhani 4", "Hingoli 3", "Buldhana 2", "Dhule 2"].map((d, i) => {
                  const parts = d.split(" ");
                  const n = parts.slice(0, -1).join(" ");
                  const c = parts[parts.length - 1];
                  return <span className={s.district} key={i}>{n} <span className={s.districtCount}>{c}</span></span>;
                })}
              </div>
            </>
          )}
        </div>
      )}

      {tab === 1 && (
        <div className={s.panel}>
          <h2 className={s.secH} style={{ marginBottom: 28 }}>{a.itemsTitle}</h2>
          <div className={s.filterRow}>
            {a.filters.map((f, i) => (
              <button key={i} className={filterIdx === i ? s.fchipOn : s.fchip} onClick={() => setFilterIdx(i)}>{f}</button>
            ))}
          </div>
          {a.items.map((item, i) => (
            <ProjectCard key={i} item={item} open={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? -1 : i)} />
          ))}
        </div>
      )}

      {tab === 2 && (
        <div className={s.panel}>
          <div className={s.aboutGrid}>
            <div className={s.about}>
              <h2 className={s.secH} style={{ marginBottom: 24 }}>About</h2>
              {about.map((p, i) => <p key={i} dangerouslySetInnerHTML={{ __html: p }} />)}
            </div>
            <div>
              <div className={s.info}>
                <div className={s.infoLead}>Details</div>
                {info.map((r, i) => (
                  <div className={s.infoRow} key={i}>
                    <span className={s.infoKey}>{r[0]}</span>
                    <span className={s.infoVal}>{r[1]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── PAGE ─── */
export default function ProfilePage() {
  const { role, setRole } = useRole();
  const [editOpen, setEditOpen] = useState(false);
  const [editsByRole, setEditsByRole] = useState<Partial<Record<Role, Partial<Edits>>>>({});

  const roles: Role[] = ["citizen", "ngo", "corporate", "government"];
  const roleLabels: Record<Role, string> = { citizen: "Citizen", ngo: "NGO", corporate: "Corporate", government: "Government" };

  const handleSave = (e: Edits) => {
    setEditsByRole(prev => ({ ...prev, [role]: e }));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} style={{ minHeight: "100vh" }}>
      {/* subtle role switcher */}
      <div className={s.roleSwitcher}>
        <span className={s.roleSwitcherLabel}>view as</span>
        {roles.map(r => (
          <button key={r} className={role === r ? s.roleSwitcherOn : s.roleSwitcherOff} onClick={() => setRole(r)}>
            {roleLabels[r]}
          </button>
        ))}
      </div>

      <div className={s.wrap}>
        <ProfileContent role={role} overrides={editsByRole[role] || null} onOpenEdit={() => setEditOpen(true)} />
      </div>

      <AnimatePresence>
        {editOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ position: "fixed", inset: 0, zIndex: 200 }}
          >
            <EditModal role={role} onClose={() => setEditOpen(false)} onSave={handleSave} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
