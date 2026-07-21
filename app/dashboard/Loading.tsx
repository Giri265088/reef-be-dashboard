import React from "react";
import styles from "./dashboard.module.css";

export default function Loading() {
  return (
    <div className={styles.loadingWrap}>
      <div className={styles.loadingGrid}>
        <div className={styles.skeletonCard} />
        <div className={styles.skeletonCard} />
        <div className={styles.skeletonCard} />
      </div>
      <div className={styles.loadingTable}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={styles.skeletonRow} />
        ))}
      </div>
    </div>
  );
}
