"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Check, CheckCircle, User, Send } from "lucide-react";
import type { CorroborationEntry } from "@/lib/mock-data";

interface CorroborationListProps {
  entries: CorroborationEntry[];
  woundId: string;
  count: number;
}

export function CorroborationList({ entries, woundId, count }: CorroborationListProps) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [statement, setStatement] = useState("");
  const [addedEntries, setAddedEntries] = useState<CorroborationEntry[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const allEntries = [...addedEntries, ...entries];

  const canSubmit = name.trim().length > 0 && statement.trim().length >= 3;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const newEntry: CorroborationEntry = {
      id: "new-" + Date.now(),
      woundId,
      name: name.trim() || "Anonymous",
      role: role.trim() || "Witness",
      statement: statement.trim(),
      time: "Just now",
      verified: false,
    };
    setAddedEntries((prev) => [newEntry, ...prev]);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
    setName("");
    setRole("");
    setStatement("");
    setShowForm(false);
  };

  const handleCancel = () => {
    setName("");
    setRole("");
    setStatement("");
    setShowForm(false);
  };

  return (
    <div className="flex flex-col" style={{ gap: 16 }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="text-number" style={{ fontSize: "1.5rem", lineHeight: 1 }}>
            {count}
          </span>
          <span className="text-caption text-2">corroborations</span>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-ghost btn-sm"
          aria-label={showForm ? "Close form" : "Add your witness"}
        >
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? "Cancel" : "Add your witness"}
        </button>
      </div>

      {/* Inline add form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div
              className="card card-compact"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                background: "var(--bg-alt)",
                border: "1px solid var(--border)",
              }}
            >
              <p className="text-label" style={{ color: "var(--text)" }}>
                Add your witness
              </p>
              <input
                className="input"
                placeholder="Your name (optional — anonymous if blank)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-label="Your name"
              />
              <input
                className="input"
                placeholder="Your role (e.g. teacher, resident)"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                aria-label="Your role"
              />
              <textarea
                className="input"
                placeholder="What did you see or experience?"
                value={statement}
                onChange={(e) => setStatement(e.target.value)}
                rows={3}
                style={{ minHeight: 80, padding: "10px 14px", resize: "vertical" }}
                aria-label="Your statement"
              />
              <div className="flex" style={{ gap: 8, justifyContent: "flex-end" }}>
                <button onClick={handleCancel} className="btn btn-ghost btn-sm">
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="btn btn-primary btn-sm"
                >
                  <Send size={13} />
                  Submit
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success feedback */}
      {showSuccess && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--st-healed-mark)", fontSize: 13, fontWeight: 500 }}>
          <CheckCircle size={16} />
          Corroboration submitted successfully!
        </div>
      )}

      {/* List */}
      <div className="flex flex-col" style={{ gap: 10 }} role="list" aria-label="Corroboration entries">
        {allEntries.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "32px 16px",
              color: "var(--text-3)",
            }}
          >
            <User size={28} style={{ margin: "0 auto 10px", opacity: 0.4 }} />
            <p className="text-caption">No corroborations yet. Be the first.</p>
          </div>
        ) : (
          allEntries.map((entry, idx) => (
            <motion.div
              role="listitem"
              key={entry.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="card card-compact"
              style={{ display: "flex", flexDirection: "column", gap: 8 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "var(--bg-muted)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--text-2)",
                      flexShrink: 0,
                    }}
                  >
                    {entry.verified ? (
                      <CheckCircle size={16} color="var(--st-healed-mark)" />
                    ) : (
                      <User size={16} color="var(--text-3)" />
                    )}
                  </div>
                  <div>
                    <p className="text-label" style={{ color: "var(--text)", fontWeight: 600 }}>
                      {entry.name}
                      {entry.verified && (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 3,
                            marginLeft: 6,
                            fontSize: 11,
                            fontWeight: 600,
                            color: "var(--st-healed-mark)",
                          }}
                        >
                          <Check size={12} />
                          Verified
                        </span>
                      )}
                    </p>
                    <p className="text-caption" style={{ color: "var(--text-2)" }}>
                      {entry.role}
                    </p>
                  </div>
                </div>
                <span className="text-caption" style={{ color: "var(--text-3)", flexShrink: 0 }}>
                  {entry.time}
                </span>
              </div>
              <div className="corroboration-quote">
                <p className="text-body" style={{ color: "var(--text-2)" }}>
                  &ldquo;{entry.statement}&rdquo;
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
