/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import styles from "./dashboard.module.css";

const designLeadBlocks = [
  { block: "erc", exp: "xp15", date: "Jan20 2026", risk: 29, red: 9, amber: 2, green: 4, wns: 2640, gbc: 880, lvs: 250, ppa: 1290 },
  { block: "camfd", exp: "xp11", date: "Feb06 2026", risk: 28, red: 9, amber: 1, green: 5, wns: 4313, gbc: 925, lvs: 280, ppa: 2162 },
  { block: "csr", exp: "xp11", date: "Feb05 2026", risk: 27, red: 8, amber: 3, green: 5, wns: 730, gbc: 750, lvs: 215, ppa: 476 },
  { block: "poqd", exp: "xp11", date: "Jan27 2026", risk: 27, red: 8, amber: 3, green: 4, wns: 2154, gbc: 850, lvs: 188, ppa: 1652 },
  { block: "elc", exp: "ry16", date: "Jan26 2026", risk: 25, red: 7, amber: 4, green: 4, wns: 956, gbc: 750, lvs: 150, ppa: 1234 },
  { block: "doc", exp: "ry16", date: "Feb02 2026", risk: 23, red: 6, amber: 5, green: 4, wns: 1780, gbc: 900, lvs: 151, ppa: 1577 },
  { block: "debug", exp: "xp14", date: "Jan27 2026", risk: 22, red: 6, amber: 4, green: 5, wns: 666, gbc: 777, lvs: 186, ppa: 1428 },
  { block: "pdmif", exp: "xp14", date: "Jan29 2026", risk: 22, red: 6, amber: 4, green: 5, wns: 2800, gbc: 1000, lvs: 175, ppa: 2894 },
  { block: "raip", exp: "ry01", date: "Feb02 2026", risk: 20, red: 5, amber: 5, green: 5, wns: 514, gbc: 750, lvs: 59, ppa: 1655 },
  { block: "iwdt", exp: "xp14", date: "Feb04 2026", risk: 20, red: 5, amber: 5, green: 5, wns: 627, gbc: 775, lvs: 64, ppa: 1787 },
  { block: "timer", exp: "ry12", date: "Feb02 2026", risk: 18, red: 5, amber: 3, green: 7, wns: 384, gbc: 650, lvs: 100, ppa: 940 },
  { block: "tfu", exp: "ry01", date: "Feb03 2026", risk: 17, red: 4, amber: 5, green: 6, wns: 716, gbc: 650, lvs: 68, ppa: 1811 },
  { block: "ached", exp: "xp17", date: "Feb05 2026", risk: 17, red: 5, amber: 2, green: 6, wns: 1164, gbc: 2200, lvs: 65, ppa: 1890 },
  { block: "cpu", exp: "try16", date: "Jan29 2026", risk: 16, red: 4, amber: 4, green: 7, wns: 321, gbc: 625, lvs: 115, ppa: 1811 },
  { block: "dmadtc", exp: "xp12", date: "Feb04 2026", risk: 15, red: 4, amber: 3, green: 8, wns: 390, gbc: 800, lvs: 46, ppa: 1533 },
  { block: "dmac", exp: "xp15", date: "Jan29 2026", risk: 11, red: 3, amber: 2, green: 10, wns: 180, gbc: 650, lvs: 25, ppa: 1781 },
  { block: "usbfs", exp: "ry12", date: "Jan27 2026", risk: 11, red: 3, amber: 2, green: 10, wns: 370, gbc: 625, lvs: 18, ppa: 1940 },
  { block: "wdt", exp: "ry12", date: "Feb03 2026", risk: 10, red: 3, amber: 1, green: 11, wns: 242, gbc: 600, lvs: 20, ppa: 1858 },
  { block: "rtc", exp: "xp12", date: "Jan26 2026", risk: 10, red: 3, amber: 1, green: 11, wns: 292, gbc: 650, lvs: 19, ppa: 1919 },
  { block: "elic", exp: "ry01", date: "Jan26 2026", risk: 7, red: 1, amber: 4, green: 10, wns: 185, gbc: 680, lvs: 31, ppa: 1487 },
];

const roleDataMap = {
  "Design Lead": {
    title: "Design Lead",
    summary: "View the latest risk heatmap, assess block attention, and prioritize high-impact design issues.",
    stats: [
      { label: "Open Risks", value: "14" },
      { label: "Blocks Reviewed", value: "7" },
      { label: "Critical Paths", value: "3" },
    ],
    highlights: [
      "Complete the risk review for the analog block.",
      "Validate timing closure assumptions with PnR.",
      "Prepare the next design checkpoint summary.",
    ],
    blocks: designLeadBlocks,
    metrics: [
      { label: "BLOCKS", value: "20", color: "#6b7280" },
      { label: "GREEN", value: "20", color: "#10b981" },
      { label: "AMBER", value: "0", color: "#f59e0b" },
      { label: "RED", value: "0", color: "#ef4444" },
      { label: "WORST WNS", value: "105", color: "#3b82f6" },
      { label: "TOTAL GBC", value: "16,407", color: "#f97316" },
      { label: "TOTAL LYS", value: "2,085", color: "#eab308" },
      { label: "LAST UPDATED", value: "Feb 04 2026 - 18:42 JST", color: "#7c3aed" },
    ],
  },
  "PnR Engineer": {
    title: "PnR Engineer",
    summary: "Monitor experiment runs, timing detail, and placement progress for the current tape-out cycle.",
    stats: [
      { label: "Run Success Rate", value: "87%" },
      { label: "Timing Violations", value: "2" },
      { label: "Floorplan Status", value: "75%" },
    ],
    highlights: [
      "Review the latest routing results for critical nets.",
      "Confirm placement updates for the new macros.",
      "Synchronize timing fixes with the design team.",
    ],
    blocks: undefined,
  },
  "PM / Chip Lead": {
    title: "PM / Chip Lead",
    summary: "Track chip-wide status and alignment across teams so the roadmap stays on schedule.",
    stats: [
      { label: "Program Health", value: "Good" },
      { label: "Deliverables", value: "5 of 7" },
      { label: "Next Review", value: "2 days" },
    ],
    highlights: [
      "Review the latest status report from design and PnR.",
      "Confirm launch readiness for the next milestone.",
      "Track dependencies with cross-functional leads.",
    ],
    blocks: undefined,
  },
};

const topLevelSections = [
  {
    title: "Timing — R2R (Setup)",
    rows: [
      {
        label: "WNS (PS)",
        good: 20,
        caution: 0,
        bad: 0,
        best: "4313",
        worst: "105",
        progressLabel: "100% converged",
        progress: [
          { width: 72, color: "#10b981" },
          { width: 0, color: "#f59e0b" },
          { width: 0, color: "#ef4444" },
        ],
      },
      {
        label: "TNS",
        good: 14,
        caution: 5,
        bad: 1,
        best: "4",
        worst: "2048",
        progressLabel: "70% converged",
        progress: [
          { width: 58, color: "#10b981" },
          { width: 28, color: "#f59e0b" },
          { width: 14, color: "#ef4444" },
        ],
      },
      {
        label: "# VIOLATIONS",
        good: 7,
        caution: 18,
        bad: 3,
        best: "18",
        worst: "250",
        progressLabel: "35% converged",
        progress: [
          { width: 28, color: "#10b981" },
          { width: 42, color: "#f59e0b" },
          { width: 30, color: "#ef4444" },
        ],
      },
    ],
  },
  {
    title: "Timing — I2R",
    rows: [
      {
        label: "WNS (PS)",
        good: 20,
        caution: 0,
        bad: 0,
        best: "2200",
        worst: "600",
        progressLabel: "100% converged",
        progress: [
          { width: 72, color: "#10b981" },
          { width: 0, color: "#f59e0b" },
          { width: 0, color: "#ef4444" },
        ],
      },
      {
        label: "TNS",
        good: 19,
        caution: 1,
        bad: 0,
        best: "59",
        worst: "420",
        progressLabel: "95% converged",
        progress: [
          { width: 70, color: "#10b981" },
          { width: 30, color: "#f59e0b" },
          { width: 0, color: "#ef4444" },
        ],
      },
      {
        label: "# VIOLATIONS",
        good: 0,
        caution: 1,
        bad: 19,
        best: "105",
        worst: "4313",
        progressLabel: "0% converged",
        progress: [
          { width: 0, color: "#10b981" },
          { width: 5, color: "#f59e0b" },
          { width: 95, color: "#ef4444" },
        ],
      },
    ],
  },
  {
    title: "Power & Clock",
    rows: [
      {
        label: "TDP (MW)",
        good: 20,
        caution: 0,
        bad: 0,
        best: "18",
        worst: "250",
        progressLabel: "100% converged",
        progress: [
          { width: 72, color: "#10b981" },
          { width: 0, color: "#f59e0b" },
          { width: 0, color: "#ef4444" },
        ],
      },
      {
        label: "CLK MAX",
        good: 0,
        caution: 8,
        bad: 12,
        best: "600",
        worst: "2200",
        progressLabel: "0% converged",
        progress: [
          { width: 0, color: "#10b981" },
          { width: 45, color: "#f59e0b" },
          { width: 55, color: "#ef4444" },
        ],
      },
      {
        label: "PWR MAX",
        good: 5,
        caution: 10,
        bad: 5,
        best: "59",
        worst: "420",
        progressLabel: "25% converged",
        progress: [
          { width: 38, color: "#10b981" },
          { width: 38, color: "#f59e0b" },
          { width: 24, color: "#ef4444" },
        ],
      },
    ],
  },
  {
    title: "Signoff — DRC / LVS",
    rows: [
      {
        label: "DRC VIOLATIONS",
        good: 0,
        caution: 0,
        bad: 20,
        best: "600",
        worst: "2200",
        progressLabel: "0% converged",
        progress: [
          { width: 0, color: "#10b981" },
          { width: 0, color: "#f59e0b" },
          { width: 100, color: "#ef4444" },
        ],
      },
      {
        label: "LVS VIOLATIONS",
        good: 7,
        caution: 13,
        bad: 0,
        best: "18",
        worst: "250",
        progressLabel: "35% converged",
        progress: [
          { width: 58, color: "#10b981" },
          { width: 42, color: "#f59e0b" },
          { width: 0, color: "#ef4444" },
        ],
      },
      {
        label: "PPA SCORE",
        good: 7,
        caution: 6,
        bad: 7,
        best: "2162",
        worst: "474",
        progressLabel: "35% converged",
        progress: [
          { width: 35, color: "#10b981" },
          { width: 35, color: "#f59e0b" },
          { width: 30, color: "#ef4444" },
        ],
      },
    ],
  },
];

// const defaultRoleData = {
//   title: "Unknown Role",
//   summary: "No role-specific dashboard data is available for this user.",
//   stats: [{ label: "Status", value: "No data" }],
//   highlights: ["Sign in again with a valid role to view the dashboard details."],
// };

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = searchParams?.get("user") || "Guest User";
  const role = "Design Lead";
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string>("Project");
  const levelTabs = ["Project", "Block level", "Top level"];
  const initials = getInitials(user);

  const roleTabs = ["Design Lead", "PnR Engineer", "PM / Chip Lead"];
  const [selectedTab, setSelectedTab] = useState<string>("Design Lead");
  const [blockSearch, setBlockSearch] = useState<string>("");
  const [activeSearch, setActiveSearch] = useState<string>("");

  const roleData = roleDataMap["Design Lead"];
  const isDesignLeadTab = true;
  const designLeadData = roleData as typeof roleDataMap["Design Lead"];
  const normalizedSearch = activeSearch.trim().toLowerCase();
  const filteredBlocks = Array.isArray(designLeadData.blocks)
    ? designLeadData.blocks.filter((blockData) => blockData.block.toLowerCase().includes(normalizedSearch))
    : [];
  const showProjectTable = selectedLevel === "Project" && isDesignLeadTab && Array.isArray(designLeadData.blocks);

  const handleSignOut = () => {
    router.push("/");
  };

  return (
    <div className={styles.dashboardPage}>
      <header className={styles.dashboardHeader}>
        <div className={styles.headerBrand}>
          <img src="/renesas-logo.svg" alt="Renesas logo" className={styles.topLeftLogo} />
          <h1 className={styles.dashboardTitleMain}>Dashboard overview</h1>
        </div>

        <div className={styles.headerCenter}>
          {levelTabs.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setSelectedLevel(level)}
              className={`${styles.levelTabButton} ${selectedLevel === level ? styles.levelTabButtonActive : ""}`}
            >
              {level}
            </button>
          ))}
        </div>

        <div className={styles.dashboardHeaderActions}>
          <span className={styles.loggedInText}>Logged in as {role}</span>
          <div className={styles.userMenuWrapper}>
            <button
              type="button"
              className={styles.userAvatarButton}
              onClick={() => setIsUserMenuOpen((open) => !open)}
              aria-expanded={isUserMenuOpen}
              aria-label={`Open user menu for ${user}`}
            >
              {initials}
            </button>
            {isUserMenuOpen && (
              <div className={styles.userMenu}>
                <div className={styles.userMenuEmail}>{user}</div>
                <button type="button" onClick={handleSignOut} className={styles.userMenuSignout}>
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.tabContainer}>
          <div className={styles.tabButtons}>
            {roleTabs.map((tabRole) => {
              const isDisabled = tabRole !== "Design Lead";
              return (
                <button
                  key={tabRole}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => {
                    if (isDisabled) return;
                    setSelectedTab(tabRole);
                  }}
                  className={`${styles.tabButton} ${selectedTab === tabRole ? styles.tabButtonActive : ""} ${isDisabled ? styles.tabButtonDisabled : ""}`}
                >
                  {tabRole}
                </button>
              );
            })}
          </div>
          <div className={styles.tabToolbar}>
            <div className={styles.searchToolbar}>
              <input
                type="search"
                value={blockSearch}
                onChange={(event) => setBlockSearch(event.target.value)}
                placeholder="Search blocks"
                className={styles.searchInput}
                aria-label="Search blocks"
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                  }
                }}
              />
              <button
                type="button"
                className={styles.searchButton}
                onClick={() => setActiveSearch(blockSearch)}
              >
                Search
              </button>
            </div>
          </div>
        </div>
        

        <div className={styles.card}>
         
          <section className={styles.roleSection}>
            {selectedLevel === "Project" ? (
              showProjectTable ? (
                <div className={styles.tableContainer}>
                  {isDesignLeadTab && designLeadData.metrics && (
                    <div className={styles.metricsContainer}>
                      {designLeadData.metrics.map((metric) => (
                        <div key={metric.label} className={styles.metricCard} style={{ borderLeftColor: metric.color }}>
                          <div className={styles.metricValue}>{metric.value}</div>
                          <div className={styles.metricLabel}>{metric.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <table className={styles.blocksTable}>
                    <thead>
                      <tr className={styles.tableHeaderGroup}>
                        <th colSpan={3} className={styles.headerGroupLabel}></th>
                        <th colSpan={4} className={styles.headerGroupLabel} style={{ textAlign: "center", color: "#fff" }}>
                          RISK ANALYSIS
                        </th>
                        <th colSpan={4} className={styles.headerGroupLabel} style={{ textAlign: "center", color: "#fff" }}>
                          KEY METRICS
                        </th>
                        <th></th>
                      </tr>
                      <tr>
                        <th>Block</th>
                        <th>Exp</th>
                        <th>Date</th>
                        <th className={styles.riskColumn}>⚠ Risk</th>
                        <th className={styles.colorCell}>🔴 Red</th>
                        <th className={styles.colorCell}>🟡 Amber </th>
                        <th className={styles.colorCell}>✓ Green</th>
                        <th>WNS SIR</th>
                        <th>GBC</th>
                        <th>LVS</th>
                        <th>PPA</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBlocks.map((blockData) => (
                        <tr key={blockData.block}>
                          <td className={styles.blockName}>{blockData.block}</td>
                          <td className={styles.normalCell}>{blockData.exp}</td>
                          <td className={styles.normalCell}>{blockData.date}</td>
                          <td className={styles.riskValueCell}>{blockData.risk}</td>
                          <td className={`${styles.colorCell} ${blockData.red >= 8 ? styles.redCell : ''}`}>{blockData.red}</td>
                          <td className={`${styles.colorCell} ${blockData.amber >= 5 ? styles.amberCell : ''}`}>{blockData.amber}</td>
                          <td className={`${styles.colorCell} ${blockData.green >= 10 ? styles.greenCell : ''}`}>{blockData.green}</td>
                          <td className={`${styles.colorCell} ${blockData.wns >= 500 ? styles.wnsCell : ''}`}>{blockData.wns}</td>
                          <td className={`${styles.colorCell} ${blockData.gbc >= 700 ? styles.gbcCell : ''}`}>{blockData.gbc}</td>
                          <td className={`${styles.colorCell} ${blockData.lvs >= 100 ? styles.lvsCell : ''}`}>{blockData.lvs}</td>
                          <td className={`${styles.colorCell} ${blockData.ppa >= 1400 ? styles.ppaCell : ''}`}>{blockData.ppa}</td>
                          <td>
                            <button type="button" className={styles.viewRowButton}>
                              View row →
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredBlocks.length === 0 && (
                        <tr>
                          <td colSpan={12} className={styles.emptyState}>
                            No blocks match your search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <>
                  <p className={styles.sectionLabel}>Quick stats</p>
                  <div className={styles.statsGrid}>
                    {roleData.stats.map((stat) => (
                      <div key={stat.label} className={styles.statCard}>
                        <div className={styles.statValue}>{stat.value}</div>
                        <div className={styles.statLabel}>{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className={styles.highlights}>
                    <h3 className={styles.sectionHeading}>Key actions</h3>
                    <ul className={styles.highlightList}>
                      {roleData.highlights.map((item) => (
                        <li key={item} className={styles.highlightItem}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )
            ) : selectedLevel === "Block level" && isDesignLeadTab ? (
              <div className={styles.blockGrid}>
                {designLeadData.blocks.map((b) => {
                  const total = b.red + b.amber + b.green || 1;
                  const redPct = Math.round((b.red / total) * 100);
                  const amberPct = Math.round((b.amber / total) * 100);
                  const greenPct = 100 - redPct - amberPct;
                  const tag = b.risk >= 25 ? "AT RISK" : b.risk >= 15 ? "ATTENTION" : "OK";
                  const statusClass = b.risk >= 25 ? styles.topRed : b.risk >= 15 ? styles.topAmber : styles.topGreen;
                  return (
                    <div key={b.block} className={`${styles.blockCard} ${statusClass}`}>
                      <div className={styles.blockCardHeader}>
                        <div className={styles.blockTitle}>{b.block.toUpperCase()}</div>
                        <div className={styles.blockTag}>{tag}</div>
                      </div>
                      <div className={styles.blockMeta}>{b.exp} · {b.date}</div>

                      <div className={styles.progressBar}>
                        <div className={styles.progressSegment} style={{ width: `${greenPct}%`, background: '#10b981' }} />
                        <div className={styles.progressSegment} style={{ width: `${amberPct}%`, background: '#f59e0b' }} />
                        <div className={styles.progressSegment} style={{ width: `${redPct}%`, background: '#ef4444' }} />
                      </div>

                      <div className={styles.smallStatsRow}>
                        <div className={styles.smallStat}><div className={styles.smallStatValue}>{b.wns}</div><div className={styles.smallStatLabel}>WNS</div></div>
                        <div className={styles.smallStat}><div className={styles.smallStatValue}>{b.gbc}</div><div className={styles.smallStatLabel}>GBC</div></div>
                        <div className={styles.smallStat}><div className={styles.smallStatValue}>{b.lvs}</div><div className={styles.smallStatLabel}>LVS</div></div>
                      </div>

                      <div className={styles.cardFooter}>
                        <div className={styles.ppa}>PPA {b.ppa}</div>
                        <button type="button" className={styles.viewRuns}>VIEW RUNS →</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : selectedLevel === "Top level" && isDesignLeadTab ? (
              <div className={styles.topLevelPage}>
                <div className={styles.topLevelHeader}>
                  <div>
                    <h2 className={styles.topLevelTitle}>Chip-Wide Convergence Status</h2>
                  </div>
                </div>

                <div className={styles.topLevelGrid}>
                  {topLevelSections.map((section) => (
                    <section key={section.title} className={styles.topLevelPanel}>
                      <div className={styles.panelHeader}>{section.title}</div>
                      {section.rows.map((row) => (
                        <div key={row.label} className={styles.panelRow}>
                          <div className={styles.rowLabel}>{row.label}</div>
                          <div className={styles.statusRow}>
                            <div className={styles.statusChip}>
                              ✓ {row.good}
                            </div>
                            <div className={styles.statusChip}>
                              △ {row.caution}
                            </div>
                            <div className={styles.statusChip}>
                              ✕ {row.bad}
                            </div>
                          </div>
                          <div className={styles.progressBarLarge}>
                            {row.progress.map((segment, idx) => (
                              <div key={`${row.label}-${idx}`} className={styles.progressSegmentLarge} style={{ width: `${segment.width}%`, background: segment.color }} />
                            ))}
                          </div>
                          <div className={styles.rowSummary}>
                            <span>{row.progressLabel}</span>
                            <span>best {row.best} · worst {row.worst}</span>
                          </div>
                        </div>
                      ))}
                      <div className={styles.heatmapLabel}>BLOCK HEATMAP (FIRST METRIC)</div>
                      <div className={styles.heatmapList}>
                        {designLeadData.blocks.map((blockData) => (
                          <span key={blockData.block} className={styles.heatmapPill}>{blockData.block}</span>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              </div>
            ) : selectedLevel === "Top level" ? (
              <div className={styles.emptyState}>
                <p>No data is available for the Top level view.</p>
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p>No content is available for the {selectedLevel} view yet.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function getInitials(input: string) {
  const prefix = input.split("@")[0];
  const segments = prefix.split(/[^A-Za-z0-9]+/).filter(Boolean);
  if (segments.length >= 2) {
    return `${segments[0][0]}${segments[1][0]}`.toUpperCase();
  }
  return prefix.slice(0, 2).toUpperCase();
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className={styles.dashboardPage} />}>
      <DashboardContent />
    </Suspense>
  );
}
