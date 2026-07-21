"use client";

import EmptyState from "../EmptyState";
import styles from "../dashboard.module.css";
import { pnrEngineerMatrixRows, pnrEngineerResultRows, PnRResultRow } from "./constants";

type PnREngineerSynthesisProps = {
  activeTab: "Result" | "Matrix";
  searchTerm: string;
};

export default function PnREngineerSynthesis({ activeTab, searchTerm }: PnREngineerSynthesisProps) {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  // Filter result rows by the active PNR search term.
  const rowContainsSearch = (row: PnRResultRow): boolean => {
    const text = (value: unknown): string => {
      if (value == null) return "";
      if (typeof value === "object") {
        return Object.values(value as Record<string, unknown>).map(text).join(" ");
      }
      return String(value);
    };

    return text(row).toLowerCase().includes(normalizedSearch);
  };

  const filteredResultRows = normalizedSearch
    ? pnrEngineerResultRows.filter(rowContainsSearch)
    : pnrEngineerResultRows;

  // Filter matrix rows by the active PNR search term.
  const rowContainsSearchMatrix = (row: typeof pnrEngineerMatrixRows[number]): boolean => {
    if (row.section) {
      return row.section.toLowerCase().includes(normalizedSearch);
    }
    return [row.metric, row.detail, row.value, row.green, row.yellow, row.red]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(normalizedSearch);
  };

  const filteredMatrixRows = normalizedSearch
    ? pnrEngineerMatrixRows.reduce<typeof pnrEngineerMatrixRows>((acc, row) => {
        if (row.section) {
          acc.push(row);
          return acc;
        }
        if (rowContainsSearchMatrix(row)) {
          acc.push(row);
        }
        return acc;
      }, [])
    : pnrEngineerMatrixRows;

  // Apply the shared table cell styling for result rows.
  const cellClass = (field: string) => {
    const base = styles.colorCell;
    if (field === "WNS") return `${base} ${styles.wnsCell}`;
    if (field === "DRC") return `${base} ${styles.drcCell}`;
    if (field === "LVS") return `${base} ${styles.lvsCell}`;
    if (field === "PPA") return `${base} ${styles.ppaCell}`;
    return base;
  };

  // Convert a numeric-looking string into a usable number.
  const parseNumericValue = (value: string) => {
    const normalized = value.replace(/,/g, "").trim();
    if (normalized === "no_value") return NaN;
    return Number(normalized);
  };

  // Check whether a matrix value matches the provided green, amber, or red rule.
  const matchesCriteria = (value: string, criteria: string): boolean => {
    if (!criteria || criteria === "-") return false;
    if (criteria.includes("|")) {
      return criteria.split("|").some((part) => matchesCriteria(value, part));
    }

    const trimmed = criteria.trim();
    if (trimmed === "=no_value") {
      return value === "no_value";
    }
    if (trimmed === "=0") {
      return value === "0";
    }

    const numeric = parseNumericValue(value);
    if (Number.isNaN(numeric)) return false;

    const evaluatePart = (part: string) => {
      const trimmedPart = part.trim();
      if (trimmedPart.startsWith(">=")) {
        return numeric >= Number(trimmedPart.slice(2));
      }
      if (trimmedPart.startsWith("<=")) {
        return numeric <= Number(trimmedPart.slice(2));
      }
      if (trimmedPart.startsWith(">")) {
        return numeric > Number(trimmedPart.slice(1));
      }
      if (trimmedPart.startsWith("<")) {
        return numeric < Number(trimmedPart.slice(1));
      }
      if (trimmedPart === "=0") {
        return numeric === 0;
      }
      return false;
    };

    if (trimmed.includes("&")) {
      return trimmed
        .split("&")
        .map(evaluatePart)
        .every(Boolean);
    }

    return evaluatePart(trimmed);
  };

  // Pick the badge style for the value column based on the matching rule.
  const getValueBadgeClass = (row: { value?: string; green?: string; yellow?: string; red?: string }) => {
    const value = row.value ?? "";
    if (matchesCriteria(value, row.green ?? "")) return styles.sigPass;
    if (matchesCriteria(value, row.yellow ?? "")) return styles.sigWarn;
    if (matchesCriteria(value, row.red ?? "")) return styles.sigFail;
    return styles.sig;
  };

  return (
    <div className={styles.pnrEngineerSection}>
      <div className={styles.blocksTableWrapper}>
        {activeTab === "Result" ? (
          <table className={styles.blocksTable}>
            <thead>
              <tr className={`${styles.tableHeaderGroup} ${styles.tableHeaderDark}`}>
                <th colSpan={4} className={styles.headerGroupLabel}></th>
                <th colSpan={3} className={styles.headerGroupLabel}>
                  R2R
                </th>
                <th colSpan={3} className={styles.headerGroupLabel}>
                  I2R
                </th>
                <th colSpan={8} className={styles.headerGroupLabel}>
                  POWER
                </th>
                <th colSpan={4} className={styles.headerGroupLabel}>
                  Sign Off
                </th>
                <th colSpan={1} className={styles.headerGroupLabel}>
                  Yield
                </th>
              </tr>
              <tr>
                <th>
                  Experiment
                  <span className={styles.headerSubLabel}></span>
                </th>
                <th>
                  TAT
                  <span className={styles.headerSubLabel}>HH:MM:SS</span>
                </th>
                <th>
                  Date
                  <span className={styles.headerSubLabel}></span>
                </th>
                <th>
                  Area
                  <span className={styles.headerSubLabel}>&micro;m²</span>
                </th>
                <th>
                  WNS
                  <span className={styles.headerSubLabel}>ps</span>
                </th>
                <th>
                  TNS
                  <span className={styles.headerSubLabel}>ps</span>
                </th>
                <th>
                  Fail#
                  <span className={styles.headerSubLabel}>paths</span>
                </th>
                <th>
                  WNS
                  <span className={styles.headerSubLabel}>ps</span>
                </th>
                <th>
                  TNS
                  <span className={styles.headerSubLabel}>ps</span>
                </th>
                <th>
                  Fail#
                  <span className={styles.headerSubLabel}>paths</span>
                </th>
                <th>
                  Total
                  <span className={styles.headerSubLabel}>mW</span>
                </th>
                <th>
                  Dyn
                  <span className={styles.headerSubLabel}>mW</span>
                </th>
                <th>
                  Leak
                  <span className={styles.headerSubLabel}>mW</span>
                </th>
                <th>
                  IR avg
                  <span className={styles.headerSubLabel}>mV</span>
                </th>
                <th>
                  IR max
                  <span className={styles.headerSubLabel}>mV</span>
                </th>
                <th>
                  EM
                  <span className={styles.headerSubLabel}>%</span>
                </th>
                <th>
                  Stdcel
                  <span className={styles.headerSubLabel}>MHz</span>
                </th>
                <th>
                  Clk
                  <span className={styles.headerSubLabel}>MHz</span>
                </th>
                <th>
                  LVS
                  <span className={styles.headerSubLabel}>viol</span>
                </th>
                <th>
                  DRC
                  <span className={styles.headerSubLabel}>viol</span>
                </th>
                <th>
                  Ant
                  <span className={styles.headerSubLabel}>viol</span>
                </th>
                <th>
                  Cong
                  <span className={styles.headerSubLabel}>ratio</span>
                </th>
                <th>
                  PPA
                  <span className={styles.headerSubLabel}>%</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredResultRows.map((row) => (
                <tr key={row.experiment}>
                  <td className={cellClass("Experiment")}>{row.experiment}</td>
                  <td className={cellClass("TAT")}>{row.tat}</td>
                  <td className={cellClass("Date")}>{row.date}</td>
                  <td className={cellClass("Area")}>{row.area}</td>
                  <td className={cellClass("WNS")}>{row.r2r.wns}</td>
                  <td className={cellClass("TNS")}>{row.r2r.tns}</td>
                  <td className={cellClass("Fail#")}>{row.r2r.fail}</td>
                  <td className={cellClass("WNS")}>{row.i2r.wns}</td>
                  <td className={cellClass("TNS")}>{row.i2r.tns}</td>
                  <td className={cellClass("Fail#")}>{row.i2r.fail}</td>
                  <td className={cellClass("Total")}>{row.power.total}</td>
                  <td className={cellClass("Dyn")}>{row.power.dyn}</td>
                  <td className={cellClass("Leak")}>{row.power.leak}</td>
                  <td className={cellClass("IR avg")}>{row.ir.avg}</td>
                  <td className={cellClass("IR max")}>{row.ir.max}</td>
                  <td className={cellClass("EM")}>{row.em}</td>
                  <td className={cellClass("Stdcel")}>{row.stdcel}</td>
                  <td className={cellClass("Clk")}>{row.clk}</td>
                  <td className={cellClass("LVS")}>{row.lvs}</td>
                  <td className={cellClass("DRC")}>{row.drc}</td>
                  <td className={cellClass("Ant")}>{row.ant}</td>
                  <td className={cellClass("Cong")}>{row.cong}</td>
                  <td className={cellClass("PPA")}>{row.ppa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : pnrEngineerMatrixRows.length > 0 ? (
          <table className={`${styles.blocksTable} ${styles.pnrMatrixTable}`}>
            <thead>
              <tr className={styles.tableHeaderGroup}>
                <th colSpan={1} className={styles.headerGroupLabel}>Metrics</th>
                <th colSpan={1} className={styles.headerGroupLabel}>Detail</th>
                <th colSpan={1} className={styles.headerGroupLabel}>VALUE</th>
                <th colSpan={1} className={styles.headerGroupLabel}>CRITERIA green</th>
                <th colSpan={1} className={styles.headerGroupLabel}>CRITERIA yellow</th>
                <th colSpan={1} className={styles.headerGroupLabel}>CRITERIA red</th>
              </tr>
            </thead>
            <tbody>
              {filteredMatrixRows.map((row, index) => (
                row.section ? (
                  <tr key={`section-${index}`}>
                    <td colSpan={6} className={styles.blockName} style={{ background: '#f8fafc' }}>
                      {row.section}
                    </td>
                  </tr>
                ) : (
                  <tr key={row.metric}>
                    <td>{row.metric}</td>
                    <td className={styles.matrixGrayTextCell}>{row.detail ?? ""}</td>
                    <td className={styles.valueCell}>
                      <span className={`${styles.sig} ${getValueBadgeClass(row)}`}>
                        {row.value}
                      </span>
                    </td>
                    <td className={styles.matrixGrayTextCell}>{row.green}</td>
                    <td className={styles.matrixGrayTextCell}>{row.yellow}</td>
                    <td className={styles.matrixGrayTextCell}>{row.red}</td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState message={`No ${activeTab.toLowerCase()} data available yet.`} />
        )}
      </div>
    </div>
  );
}
