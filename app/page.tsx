/* eslint-disable @next/next/no-img-element */
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

const roles = [
  {
    id: "PnR Engineer",
    title: "PnR Engineer",
    email: "pnrengineer@123.com",
    description: "Experiment runs, timing detail",
    icon: "⚙️",
  },
  {
    id: "Design Lead",
    title: "Design Lead",
    email: "designlead@123.com",
    description: "Risk heatmap, block attention",
    icon: "🔎",
  },
  
  {
    id: "PM / Chip Lead",
    title: "PM / Chip Lead",
    email: "pmchiplead@123.com",
    description: "Chip-wide status overview",
    icon: "📊",
  },
];

export default function Home() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState(roles[0].id);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const enteredEmail = userId.trim().toLowerCase();

    if (!enteredEmail) {
      setLoginError("Enter your email to continue.");
      return;
    }

    setLoginError("");
    router.push(
      `/dashboard?user=${encodeURIComponent(enteredEmail)}&role=${encodeURIComponent(selectedRole)}`
    );
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.loginCard}>
        <div className={styles.cardOverlay} />
        <div className={styles.cardInner}>
          <div className={styles.headerBlock}>
            <div >
              {/* <span className={styles.logoIcon}>🔍</span> */}
              <img src="/renesas-logoblue.png" alt="Renesas logo" className={styles.topLeftLogo} />
            </div>
            <div>
              <h1 className={styles.title}> DASHBOARD</h1>
              
            </div>
          </div>

          <div className={styles.pageHeading}>
            <h2 className={styles.headingPrimary}>Sign in</h2>
            <p className={styles.headingText}>Enter your credentials and select your role.</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
            <div className={styles.fieldGroup}>
              <label htmlFor="userId" className={styles.label}>
                User ID
              </label>
              <input
                id="userId"
                name="userId"
                type="email"
                autoComplete="off"
                value={userId}
                onChange={(event) => setUserId(event.currentTarget.value)}
                placeholder="e.g. example.cad@renesas.com"
                className={styles.inputField}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.currentTarget.value)}
                placeholder="••••••••"
                className={styles.inputField}
              />
            </div>

            <div>
              <p className={styles.roleLabel}>Select your role / persona</p>
              <div className={styles.roleGrid}>
                {roles.map((role) => {
                  const isSelected = selectedRole === role.id;
                  const isDisabled = role.id === "PM / Chip Lead";
                  return (
                    <button
                      key={role.id}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => {
                        if (isDisabled) return;
                        setSelectedRole(role.id);
                      }}
                      className={`${styles.roleButton} ${isSelected ? styles.roleButtonActive : ""} ${isDisabled ? styles.roleButtonDisabled : ""}`}
                    >
                      <div className={styles.roleIcon}>{role.icon}</div>
                      <div className={styles.roleTitle}>{role.title}</div>
                      <p className={styles.roleDescription}>{role.description}</p>
                      {/* <p className={styles.roleEmail}>{role.email}</p> */}
                    </button>
                  );
                })}
              </div>
            </div>

            <button type="submit" className={styles.submitButton}>
              Sign in to RENESAS →
            </button>
            {loginError && <p className={styles.errorMessage}>{loginError}</p>}
          </form>

          {/* <p className={styles.footerText}>REEF-BE v0.5 · Confidential</p> */}
        </div>
      </div>
    </div>
  );
}
