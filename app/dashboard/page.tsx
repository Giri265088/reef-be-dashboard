/* eslint-disable @next/next/no-img-element */
"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense, useEffect, useRef } from "react";
import styles from "./dashboard.module.css";
import Loading from "./Loading";
import EmptyState from "./EmptyState";
import PnREngineerSynthesis from "./pnr-engineer/PnREngineerSynthesis";

const designLeadBlocks = [
  { block: "erc", exp: "xp15", date: "Jan20 2026", risk: 29, red: 9, amber: 2, green: 4, wns: 2640, drc: 880, lvs: 250, ppa: 1290 },
  { block: "camfd", exp: "xp11", date: "Feb06 2026", risk: 28, red: 9, amber: 1, green: 5, wns: 4313, drc: 925, lvs: 280, ppa: 2162 },
  { block: "csr", exp: "xp11", date: "Feb05 2026", risk: 27, red: 8, amber: 3, green: 5, wns: 730, drc: 750, lvs: 215, ppa: 476 },
  { block: "poqd", exp: "xp11", date: "Jan27 2026", risk: 27, red: 8, amber: 3, green: 4, wns: 2154, drc: 850, lvs: 188, ppa: 1652 },
  { block: "elc", exp: "ry16", date: "Jan26 2026", risk: 25, red: 7, amber: 4, green: 4, wns: 956, drc: 750, lvs: 150, ppa: 1234 },
  { block: "doc", exp: "ry16", date: "Feb02 2026", risk: 23, red: 6, amber: 5, green: 4, wns: 1780, drc: 900, lvs: 151, ppa: 1577 },
  { block: "debug", exp: "xp14", date: "Jan27 2026", risk: 22, red: 6, amber: 4, green: 5, wns: 666, drc: 777, lvs: 186, ppa: 1428 },
  { block: "pdmif", exp: "xp14", date: "Jan29 2026", risk: 22, red: 6, amber: 4, green: 5, wns: 2800, drc: 1000, lvs: 175, ppa: 2894 },
  { block: "raip", exp: "ry01", date: "Feb02 2026", risk: 20, red: 5, amber: 5, green: 5, wns: 514, drc: 750, lvs: 59, ppa: 1655 },
  { block: "iwdt", exp: "xp14", date: "Feb04 2026", risk: 20, red: 5, amber: 5, green: 5, wns: 627, drc: 775, lvs: 64, ppa: 1787 },
  { block: "timer", exp: "ry12", date: "Feb02 2026", risk: 18, red: 5, amber: 3, green: 7, wns: 384, drc: 650, lvs: 100, ppa: 940 },
  { block: "tfu", exp: "ry01", date: "Feb03 2026", risk: 17, red: 4, amber: 5, green: 6, wns: 716, drc: 650, lvs: 68, ppa: 1811 },
  { block: "ached", exp: "xp17", date: "Feb05 2026", risk: 17, red: 5, amber: 2, green: 6, wns: 1164, drc: 2200, lvs: 65, ppa: 1890 },
  { block: "cpu", exp: "try16", date: "Jan29 2026", risk: 16, red: 4, amber: 4, green: 7, wns: 321, drc: 625, lvs: 115, ppa: 1811 },
  { block: "dmadtc", exp: "xp12", date: "Feb04 2026", risk: 15, red: 4, amber: 3, green: 8, wns: 390, drc: 800, lvs: 46, ppa: 1533 },
  { block: "dmac", exp: "xp15", date: "Jan29 2026", risk: 11, red: 3, amber: 2, green: 10, wns: 180, drc: 650, lvs: 25, ppa: 1781 },
  { block: "usbfs", exp: "ry12", date: "Jan27 2026", risk: 11, red: 3, amber: 2, green: 10, wns: 370, drc: 625, lvs: 18, ppa: 1940 },
  { block: "wdt", exp: "ry12", date: "Feb03 2026", risk: 10, red: 3, amber: 1, green: 11, wns: 242, drc: 600, lvs: 20, ppa: 1858 },
  { block: "rtc", exp: "xp12", date: "Jan26 2026", risk: 10, red: 3, amber: 1, green: 11, wns: 292, drc: 650, lvs: 19, ppa: 1919 },
  { block: "elic", exp: "ry01", date: "Jan26 2026", risk: 7, red: 1, amber: 4, green: 10, wns: 185, drc: 680, lvs: 31, ppa: 1487 },
];

type MetricCard = {
  label: string;
  value: string;
  description?: string;
  color: string;
};

type RoleData = {
  title: string;
  summary: string;
  stats: { label: string; value: string }[];
  highlights: string[];
  blocks?: typeof designLeadBlocks;
  metrics?: MetricCard[];
};

const roleDataMap: Record<"Design Lead" | "PnR Engineer" | "PM / Chip Lead", RoleData> = {
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
      { label: "FLOW PROGRESS", value: "63%", description: "26/41 steps done", color: "#2563eb" },
      { label: "PASS", value: "23", description: "gatekeeper green", color: "#10b981" },
      { label: "WARN", value: "2", description: "gatekeeper yellow", color: "#f59e0b" },
      { label: "FAIL", value: "1", description: "gatekeeper red", color: "#ef4444" },
      { label: "EXECUTION", value: "3", description: "running now", color: "#7c3aed" },
      { label: "NOT YET", value: "12", description: "11 pending · 1 skip", color: "#475569" },
      { label: "SYS/DAT ERRORS", value: "1", description: "across all steps", color: "#f97316" },
      { label: "WARNINGS", value: "312", description: "across all steps", color: "#8b5cf6" },
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

const universalMetrics = [
  { label: "FLOW PROGRESS", value: "63%", description: "26/41 steps done", color: "#2563eb" },
  { label: "PASS", value: "23", description: "gatekeeper green", color: "#10b981" },
  { label: "WARN", value: "2", description: "gatekeeper yellow", color: "#f59e0b" },
  { label: "FAIL", value: "1", description: "gatekeeper red", color: "#ef4444" },
  { label: "EXECUTION", value: "3", description: "running now", color: "#7c3aed" },
  { label: "NOT YET", value: "12", description: "11 pending · 1 skip", color: "#475569" },
  { label: "SYS/DAT ERRORS", value: "1", description: "across all steps", color: "#f97316" },
  { label: "WARNINGS", value: "312", description: "across all steps", color: "#8b5cf6" },
];

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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string>("Project");
  // Temporarily hide non-project levels
  const levelTabs = ["Project"];
  // const levelTabs = ["Project", "Block level", "Top level"];
  const initials = getInitials(user);

  const roleTabs = ["PM / Chip Lead", "Design Lead", "PnR Engineer"] as const;
  type RoleTab = (typeof roleTabs)[number];
  const initialRole = (searchParams?.get("role") === "PnR Engineer" || searchParams?.get("role") === "Design Lead"
    ? searchParams.get("role")
    : "Design Lead") as RoleTab;
  const [selectedTab, setSelectedTab] = useState<RoleTab>(initialRole);
  const initialNavTab = initialRole === "PnR Engineer" ? "Synthesis" : "Summary";
  const [selectedNavTab, setSelectedNavTab] = useState<"Summary" | "DFT" | "Synthesis" | "PnR" | "Timing" | "Power" | "Sign-off">(initialNavTab);
  const [pnrEngineerTab, setPnrEngineerTab] = useState<"Result" | "Matrix">("Result");
  const navTabs = ["Summary", "DFT", "Synthesis", "PnR", "Timing", "Power", "Sign-off"] as const;
  const [designLeadSearchInput, setDesignLeadSearchInput] = useState<string>("");
  const [designLeadSearchTerm, setDesignLeadSearchTerm] = useState<string>("");
  const [pnrResultSearchInput, setPnrResultSearchInput] = useState<string>("");
  const [pnrResultSearchTerm, setPnrResultSearchTerm] = useState<string>("");
  const [pnrMatrixSearchInput, setPnrMatrixSearchInput] = useState<string>("");
  const [pnrMatrixSearchTerm, setPnrMatrixSearchTerm] = useState<string>("");
  // Keep Design Lead and PNR searches independent from each other.

  const role = selectedTab;
  const roleData = roleDataMap[selectedTab] as RoleData;
  const isDesignLeadTab = selectedTab === "Design Lead";
  const designLeadData = roleData as { blocks?: typeof designLeadBlocks };
  const normalizedDesignLeadSearch = designLeadSearchTerm.trim().toLowerCase();
  const filteredBlocks = Array.isArray(designLeadData.blocks)
    ? designLeadData.blocks.filter((blockData) => blockData.block.toLowerCase().includes(normalizedDesignLeadSearch))
    : [];
  const metrics: MetricCard[] = roleData.metrics ?? universalMetrics;
  const showProjectTable = selectedLevel === "Project" && isDesignLeadTab && Array.isArray(designLeadData.blocks);

  // Format block names for consistent display in the table.
  const formatBlockName = (blockName: string) => blockName.toUpperCase();

  const [selectedCellInfo, setSelectedCellInfo] = useState<{
    block: string;
    exp: string;
    date: string;
    column: string;
    value: string | number;
    filePath: string;
    details: Array<{ label: string; value: string | number }>;
  } | null>(null);
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);

  // Open the details panel with the selected cell metadata.
  const handleCellClick = (
    blockData: (typeof designLeadBlocks)[number],
    column: string,
    value: string | number
  ) => {
    const sanitizedColumn = column.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const filePath = `/eda/runs/${blockData.exp}/${blockData.block}/${sanitizedColumn}.rpt`;

    setSelectedCellInfo({
      block: blockData.block,
      exp: blockData.exp,
      date: blockData.date,
      column,
      value,
      filePath,
      details: [
        { label: "Risk score", value: blockData.risk },
        { label: "Red issues", value: blockData.red },
        { label: "Amber issues", value: blockData.amber },
        { label: "Green issues", value: blockData.green },
        { label: "PPA", value: blockData.ppa },
      ],
    });
    setIsPanelExpanded(false);
  };

  // Toggle and close the expandable details panel.
  const handlePanelToggle = () => setIsPanelExpanded((current) => !current);
  const closeDetailPanel = () => {
    setSelectedCellInfo(null);
    setIsPanelExpanded(false);
  };

  // Return the user to the sign-in screen.
  const handleSignOut = () => {
    router.push("/");
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!userMenuRef.current) return;
      const target = e.target as Node;
      if (isUserMenuOpen && userMenuRef.current && !userMenuRef.current.contains(target)) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isUserMenuOpen]);

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
          <div className={`${styles.tabButtons} ${styles.headerRoleTabs}`}>
            {roleTabs.map((tabRole) => {
              const enabledRoles = ["Design Lead", "PnR Engineer"];
              const isDisabled = !enabledRoles.includes(tabRole);
              return (
                <button
                  key={tabRole}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => {
                    if (isDisabled) return;
                    setSelectedTab(tabRole);
                    if (tabRole === "PnR Engineer") {
                      setSelectedNavTab("Synthesis");
                    }
                  }}
                  className={`${styles.tabButton} ${selectedTab === tabRole ? styles.tabButtonActive : ""} ${isDisabled ? styles.tabButtonDisabled : ""}`}
                >
                  {tabRole}
                </button>
              );
            })}
          </div>
          <div className={styles.userMenuWrapper} ref={userMenuRef}>
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
                <span className={styles.loggedInText}>Logged in as {role}</span>
                <div className={styles.userMenuEmail}>{user}</div>
                <button type="button" onClick={handleSignOut} className={styles.userMenuSignout}>
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <nav className={styles.dashboardNav} aria-label="Dashboard navigation tabs">
        <div className={styles.dashboardNavInner}>
          <div className={styles.navTabs}>
            {navTabs.map((tab) => {
              const isDisabled = tab !== "Synthesis";
              return (
                <button
                  key={tab}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => {
                    if (isDisabled) return;
                    setSelectedNavTab(tab);
                  }}
                  className={`${styles.tabButton} ${selectedNavTab === tab ? styles.tabButtonActive : ""} ${isDisabled ? styles.tabButtonDisabled : ""}`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
          <div className={styles.navMeta}>
            <div className={styles.navMetaItem}>
              <span className={styles.navMetaLabel}>Project</span>
              <span className={styles.navMetaValue}>Project AAA</span>
            </div>
            <div className={styles.navMetaItem}>
              <span className={styles.navMetaLabel}>DF</span>
              <span className={styles.navMetaValue}>v031</span>
            </div>
            <div className={styles.navMetaItem}>
              <span className={styles.navMetaLabel}>Milestone</span>
              <span className={styles.navMetaValue}>MS2</span>
            </div>
            <div className={styles.navMetaItem}>
              <span className={styles.navMetaLabel}>Netlist</span>
              <span className={styles.navMetaValue}>v031_net02</span>
            </div>
          </div>
        </div>
      </nav>

      <main className={styles.mainContent}>
        <div className={styles.tabContainer}>
          {selectedLevel === "Project" && (
            <div className={styles.tabToolbar}>
              <div className={styles.searchToolbar}>
                <input
                  type="search"
                  value={selectedTab === "PnR Engineer" && selectedNavTab === "Synthesis"
                    ? pnrEngineerTab === "Result"
                      ? pnrResultSearchInput
                      : pnrMatrixSearchInput
                    : designLeadSearchInput}
                  onChange={(event) => {
                    const value = event.target.value;
                    if (selectedTab === "PnR Engineer" && selectedNavTab === "Synthesis") {
                      if (pnrEngineerTab === "Result") {
                        setPnrResultSearchInput(value);
                        if (value === "") {
                          setPnrResultSearchTerm("");
                        }
                      } else {
                        setPnrMatrixSearchInput(value);
                        if (value === "") {
                          setPnrMatrixSearchTerm("");
                        }
                      }
                    } else {
                      setDesignLeadSearchInput(value);
                      if (value === "") {
                        setDesignLeadSearchTerm("");
                      }
                    }
                  }}
                  placeholder={selectedTab === "PnR Engineer" && selectedNavTab === "Synthesis"
                    ? pnrEngineerTab === "Result"
                      ? "Search PnR result"
                      : "Search PnR matrix"
                    : "Search blocks"}
                  className={styles.searchInput}
                  aria-label={selectedTab === "PnR Engineer" && selectedNavTab === "Synthesis"
                    ? pnrEngineerTab === "Result"
                      ? "Search PnR result"
                      : "Search PnR matrix"
                    : "Search blocks"}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      if (selectedTab === "PnR Engineer" && selectedNavTab === "Synthesis") {
                        if (pnrEngineerTab === "Result") {
                          setPnrResultSearchTerm(pnrResultSearchInput);
                        } else {
                          setPnrMatrixSearchTerm(pnrMatrixSearchInput);
                        }
                      } else {
                        setDesignLeadSearchTerm(designLeadSearchInput);
                      }
                    }
                    if (event.key === "Escape") {
                      if (selectedTab === "PnR Engineer" && selectedNavTab === "Synthesis") {
                        if (pnrEngineerTab === "Result") {
                          setPnrResultSearchInput("");
                          setPnrResultSearchTerm("");
                        } else {
                          setPnrMatrixSearchInput("");
                          setPnrMatrixSearchTerm("");
                        }
                      } else {
                        setDesignLeadSearchInput("");
                        setDesignLeadSearchTerm("");
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  className={styles.searchButton}
                  onClick={() => {
                    if (selectedTab === "PnR Engineer" && selectedNavTab === "Synthesis") {
                      if (pnrEngineerTab === "Result") {
                        setPnrResultSearchTerm(pnrResultSearchInput);
                      } else {
                        setPnrMatrixSearchTerm(pnrMatrixSearchInput);
                      }
                    } else {
                      setDesignLeadSearchTerm(designLeadSearchInput);
                    }
                  }}
                >
                  Search
                </button>
                
              </div>
            </div>
          )}
        </div>
        

        <div className={styles.card}>
          
          <section className={styles.roleSection}>
            {selectedLevel === "Project" ? (
              <>
                {metrics && (
                  <div className={styles.metricsContainer}>
                    {metrics.map((metric) => (
                      <div key={metric.label} className={styles.metricCard} style={{ borderLeftColor: metric.color }}>
                        <div className={styles.metricValue}>{metric.value}</div>
                        <div className={styles.metricLabel}>{metric.label}</div>
                        {metric.description && <div className={styles.metricDescription}>{metric.description}</div>}
                      </div>
                    ))}
                  </div>
                )}

                {selectedTab === "PnR Engineer" && selectedNavTab === "Synthesis" ? (
                  <>
                    <div className={styles.pnrSynthesisTabs}>
                      {(["Result", "Matrix"] as const).map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setPnrEngineerTab(tab)}
                          className={`${styles.pnrTabButton} ${pnrEngineerTab === tab ? styles.pnrTabButtonActive : ""}`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                    <PnREngineerSynthesis
                      activeTab={pnrEngineerTab}
                      searchTerm={pnrEngineerTab === "Result" ? pnrResultSearchTerm : pnrMatrixSearchTerm}
                    />
                  </>
                ) : showProjectTable ? (
                  <div className={styles.tableContainer}>
                    <div className={styles.tableWithPanel}>
                      <table className={styles.blocksTable}>
                        <thead>
                          <tr className={styles.tableHeaderGroup}>
                            <th colSpan={3} className={styles.headerGroupLabel}></th>
                            {/* <th colSpan={4} className={styles.headerGroupLabel} style={{ textAlign: "center", color: "#fff" }}>
                              RISK ANALYSIS
                            </th> */}
                            <th colSpan={4} className={styles.headerGroupLabel} style={{ textAlign: "center", color: "#fff" }}>
                              KEY METRICS
                            </th>
                            <th></th>
                          </tr>
                          <tr>
                            <th>Block</th>
                            <th>Exp</th>
                            <th>Date</th>
                            {/* <th className={styles.riskColumn}>⚠ Risk</th>
                            <th className={styles.colorCell}>🔴 Red</th>
                            <th className={styles.colorCell}>🟡 Amber </th>
                            <th className={styles.colorCell}>✓ Green</th> */}
                            <th>WNS R2R</th>
                            <th>DRC</th>
                            <th>LVS</th>
                            <th>PPA</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredBlocks.map((blockData) => (
                            <tr key={blockData.block}>
                              <td className={styles.blockName}>
                                <a
                                  href={`/block/${encodeURIComponent(blockData.block)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={styles.blockLink}
                                  aria-label={`Open details for block ${formatBlockName(blockData.block)} in a new tab`}
                                >
                                  {formatBlockName(blockData.block)}
                                </a>
                              </td>
                              <td className={styles.normalCell}>{blockData.exp}</td>
                              <td className={styles.normalCell}>{blockData.date}</td>
                              {/* <td className={styles.riskValueCell}>{blockData.risk}</td>
                              <td className={`${styles.colorCell} ${blockData.red >= 8 ? styles.redCell : ''}`}>{blockData.red}</td>
                              <td className={`${styles.colorCell} ${blockData.amber >= 5 ? styles.amberCell : ''}`}>{blockData.amber}</td>
                              <td className={`${styles.colorCell} ${blockData.green >= 10 ? styles.greenCell : ''}`}>{blockData.green}</td> */}
                              <td
                                className={`${styles.colorCell} ${blockData.wns >= 500 ? styles.wnsCell : ''} ${styles.clickableCell}`}
                                onClick={() => handleCellClick(blockData, "WNS R2R", blockData.wns)}
                                role="button"
                                tabIndex={0}
                              >
                                {blockData.wns}
                              </td>
                              <td
                                className={`${styles.colorCell} ${blockData.drc >= 700 ? styles.drcCell : ''} ${styles.clickableCell}`}
                                onClick={() => handleCellClick(blockData, "DRC", blockData.drc)}
                                role="button"
                                tabIndex={0}
                              >
                                {blockData.drc}
                              </td>
                              <td
                                className={`${styles.colorCell} ${blockData.lvs >= 100 ? styles.lvsCell : ''} ${styles.clickableCell}`}
                                onClick={() => handleCellClick(blockData, "LVS", blockData.lvs)}
                                role="button"
                                tabIndex={0}
                              >
                                {blockData.lvs}
                              </td>
                              <td
                                className={`${styles.colorCell} ${blockData.ppa >= 1400 ? styles.ppaCell : ''} ${styles.clickableCell}`}
                                onClick={() => handleCellClick(blockData, "PPA", blockData.ppa)}
                                role="button"
                                tabIndex={0}
                              >
                                {blockData.ppa}
                              </td>
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
                                  <EmptyState message="No blocks match your search." />
                                </td>
                              </tr>
                            )}
                        </tbody>
                      </table>

                      {selectedCellInfo && (
                        <aside className={`${styles.detailPanel} ${isPanelExpanded ? styles.detailPanelExpanded : ""}`}>
                          <div className={styles.detailPanelHeader}>
                            <div>
                              <p className={styles.detailPanelTitle}>Cell detail</p>
                              <p className={styles.detailPanelSubtitle}>{`${selectedCellInfo.block} / ${selectedCellInfo.exp}`}</p>
                            </div>
                            <div className={styles.detailPanelActions}>
                              <button
                                type="button"
                                className={styles.detailExpandButton}
                                onClick={handlePanelToggle}
                                aria-label={isPanelExpanded ? "Collapse panel" : "Expand panel"}
                              >
                                {isPanelExpanded ? "↙" : "⤢"}
                              </button>
                              <button type="button" className={styles.detailCloseButton} onClick={closeDetailPanel} aria-label="Close details panel">
                                ×
                              </button>
                            </div>
                          </div>
                          <div className={styles.detailPanelBody}>
                            <div className={styles.detailCellHeadline}>{`${selectedCellInfo.column} = ${selectedCellInfo.value}`}</div>
                            <div className={styles.detailFilePath}>{selectedCellInfo.filePath}</div>
                            <div className={styles.detailStatsList}>
                              {selectedCellInfo.details.map((detail) => (
                                <div key={detail.label} className={styles.detailStatRow}>
                                  <span className={styles.detailStatLabel}>{detail.label}</span>
                                  <span className={styles.detailStatValue}>{detail.value}</span>
                                </div>
                              ))}
                            </div>
                            {isPanelExpanded && (
                              <div className={styles.detailExpandedContent}>
                                <div className={styles.detailExpandedRow}>
                                  <span className={styles.detailExpandedLabel}>Block date</span>
                                  <span>{selectedCellInfo.date}</span>
                                </div>
                                <div className={styles.detailExpandedRow}>
                                  <span className={styles.detailExpandedLabel}>Report type</span>
                                  <span>{selectedCellInfo.column}</span>
                                </div>
                                <div className={styles.detailExpandedRow}>
                                  <span className={styles.detailExpandedLabel}>Suggested action</span>
                                  <span>Review the report details and confirm the closure path for this metric.</span>
                                </div>
                                <div className={styles.detailExpandedRow}>
                                  <span className={styles.detailExpandedLabel}>Detail notes</span>
                                  <span>Compare this value against the current timing and signoff status.</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </aside>
                      )}
                    </div>
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
                )}
              </>
            ) : selectedLevel === "Block level" && isDesignLeadTab ? (
              <div className={styles.blockGrid}>
                {(designLeadData.blocks ?? []).map((b) => {
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
                        <div className={`${styles.blockTag} ${tag === "AT RISK" ? styles.blockTagRisk : tag === "ATTENTION" ? styles.blockTagAttention : styles.blockTagOk}`}>{tag}</div>
                      </div>
                      <div className={styles.blockMeta}>{b.exp} · {b.date}</div>

                      <div className={styles.progressBar}>
                        <div className={styles.progressSegment} style={{ width: `${greenPct}%`, background: '#10b981' }} />
                        <div className={styles.progressSegment} style={{ width: `${amberPct}%`, background: '#f59e0b' }} />
                        <div className={styles.progressSegment} style={{ width: `${redPct}%`, background: '#ef4444' }} />
                      </div>

                      <div className={styles.smallStatsRow}>
                        <div className={styles.smallStat}><div className={styles.smallStatValue}>{b.wns}</div><div className={styles.smallStatLabel}>WNS</div></div>
                        <div className={styles.smallStat}><div className={styles.smallStatValue}>{b.drc}</div><div className={styles.smallStatLabel}>DRC</div></div>
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
                        {(designLeadData.blocks ?? []).map((blockData) => (
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
    <Suspense fallback={<div className={styles.dashboardPage}><Loading /></div>}>
      <DashboardContent />
    </Suspense>
  );
}
