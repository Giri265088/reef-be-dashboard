import React from "react";
import styles from "./dashboard.module.css";

export default function EmptyState({ message }: { message?: string }) {
  return (
    <div className={styles.emptyCard}>
      <div className={styles.emptyIcon}>📭</div>
      <div>
        <h3 className={styles.emptyTitle}>No data available</h3>
        <p className={styles.emptyDescription}>{message || "There is currently no data to display."}</p>
      </div>
    </div>
  );
}
