import React, { useState, useEffect, useCallback } from "react";
import { useApi } from "./hooks/useApi";
import "./App.css";

const STROOPS = 10_000_000;
const fmt = (n) => (n / STROOPS).toFixed(7);

// ─── Sub-components ───────────────────────────────────────────────────────────

function Badge({ source }) {
  const styles = {
    treasury: { background: "#0d9488", color: "#fff" },
    user:     { background: "#6366f1", color: "#fff" },
  };
  return (
    <span className="badge" style={styles[source] || styles.user}>
      {source === "treasury" ? "🏛 Treasury-funded" : "👤 Self-funded"}
    </span>
  );
}

function StatCard({ label, value, sub }) {
  return (
    <div className="stat-card">
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
      {sub && <p className="stat-sub">{sub}</p>}
    </div>
  );
}

function Spinner() {
  return <span className="spinner" aria-label="Loading" />;
}

// ─── Setup Screen ─────────────────────────────────────────────────────────────

function SetupScreen({ onReady }) {
  const [wallet, setWallet]     = useState("");
  const [source, setSource]     = useState("user");
  const [busy, setBusy]         = useState(false);
  const [err, setErr]           = useState("");
  const { generateKey }         = useApi();

  const submit = async () => {
    if (!wallet.trim()) { setErr("Wallet address is required"); return; }
    setBusy(true);
    setErr("");
    try {
      const data = await generateKey(wallet.trim(), source);
      onReady({ apiKey: data.apiKey, wallet: wallet.trim(), fundingSource: source });
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="setup-screen">
      <div className="setup-card">
        <div className="logo">⚡ MicroPay</div>
        <h1>Developer Dashboard</h1>
        <p className="setup-desc">
          Pay-per-request API infrastructure powered by{" "}
          <a href="https://stellar.org" target="_blank" rel="noreferrer">Stellar</a>{" "}
          and governed by the{" "}
          <a href="https://github.com/orgs/Stellar-Treasury/repositories" target="_blank" rel="noreferrer">
            DAO Treasury
          </a>.
        </p>

        <label>Stellar Wallet Address</label>
        <input
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          placeholder="G…"
          className="input"
        />

        <label>Funding Source</label>
        <div className="radio-group">
          {["user", "treasury"].map((s) => (
            <label key={s} className={`radio-label ${source === s ? "active" : ""}`}>
              <input
                type="radio"
                name="source"
                value={s}
                checked={source === s}
                onChange={() => setSource(s)}
              />
              {s === "user" ? "👤 Self-funded" : "🏛 Treasury-funded"}
            </label>
          ))}
        </div>

        {err && <p className="error-msg">{err}</p>}

        <button className="btn primary" onClick={submit} disabled={busy}>
          {busy ? <Spinner /> : "Generate API Key"}
        </button>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard({ session }) {
  const { apiKey, wallet, fundingSource } = session;
  const { loading, error, getBalance, getUsage, topUp, callPremium } = useApi();

  const [balance, setBalance]         = useState(null);
  const [usage, setUsage]             = useState(null);
  const [topUpAmt, setTopUpAmt]       = useState("1");
  const [lastResult, setLastResult]   = useState(null);
  const [txState, setTxState]         = useState("idle"); // idle | pending | success | error
  const [copied, setCopied]           = useState(false);

  const refresh = useCallback(async () => {
    const [b, u] = await Promise.all([getBalance(apiKey), getUsage(apiKey)]);
    setBalance(b);
    setUsage(u);
  }, [apiKey, getBalance, getUsage]);

  useEffect(() => { refresh(); }, [refresh]);

  const handleTopUp = async () => {
    const xlm = parseFloat(topUpAmt);
    if (isNaN(xlm) || xlm <= 0) return;
    setTxState("pending");
    try {
      await topUp(apiKey, xlm);
      setTxState("success");
      await refresh();
      setTimeout(() => setTxState("idle"), 3000);
    } catch {
      setTxState("error");
      setTimeout(() => setTxState("idle"), 3000);
    }
  };

  const handlePremium = async () => {
    setLastResult(null);
    setTxState("pending");
    try {
      const res = await callPremium(apiKey);
      setLastResult(res);
      setTxState("success");
      await refresh();
      setTimeout(() => setTxState("idle"), 4000);
    } catch (e) {
      setTxState("error");
      setTimeout(() => setTxState("idle"), 3000);
    }
  };

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="dashboard">
      {/* ── Header ── */}
      <header className="dash-header">
        <span className="logo">⚡ MicroPay</span>
        <Badge source={fundingSource} />
      </header>

      {/* ── API Key ── */}
      <section className="card">
        <h2>API Key</h2>
        <div className="key-row">
          <code className="key-display">{apiKey}</code>
          <button className="btn ghost" onClick={copyKey}>
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>
        <p className="key-sub">Wallet: <code>{wallet}</code></p>
      </section>

      {/* ── Stats ── */}
      <section className="stats-grid">
        <StatCard
          label="Balance"
          value={balance ? `${fmt(balance.balance)} XLM` : "—"}
          sub={`${balance?.balance ?? 0} stroops`}
        />
        <StatCard
          label="Requests"
          value={usage?.requestCount ?? "—"}
          sub="total calls"
        />
        <StatCard
          label="Total Spent"
          value={usage ? `${fmt(usage.totalCharged)} XLM` : "—"}
          sub={`${usage?.totalCharged ?? 0} stroops`}
        />
        <StatCard
          label="Cost / Request"
          value="0.0010000 XLM"
          sub="10,000 stroops"
        />
      </section>

      {/* ── Top-up ── */}
      <section className="card">
        <h2>Top-Up Balance</h2>
        <div className="topup-row">
          <input
            type="number"
            min="0.001"
            step="0.1"
            value={topUpAmt}
            onChange={(e) => setTopUpAmt(e.target.value)}
            className="input small"
          />
          <span className="unit">XLM</span>
          <button
            className="btn primary"
            onClick={handleTopUp}
            disabled={txState === "pending"}
          >
            {txState === "pending" ? <Spinner /> : "Deposit"}
          </button>
        </div>
        {txState === "success" && <p className="success-msg">✓ Transaction confirmed</p>}
        {txState === "error"   && <p className="error-msg">✗ Transaction failed — check balance</p>}
      </section>

      {/* ── Demo call ── */}
      <section className="card">
        <h2>Call Premium Endpoint</h2>
        <p className="muted">
          Calls <code>GET /premium-data</code> — deducts{" "}
          <strong>0.001 XLM</strong> on-chain per request.
        </p>
        <button
          className="btn accent"
          onClick={handlePremium}
          disabled={txState === "pending"}
        >
          {txState === "pending" ? <><Spinner /> Processing…</> : "Make Paid Request"}
        </button>

        {lastResult && (
          <div className="result-box">
            <p className="result-meta">
              Charged: <strong>{lastResult.meta.chargedXLM} XLM</strong> ·{" "}
              Tx: <code>{lastResult.meta.txHash?.slice(0, 20)}…</code>
            </p>
            <pre>{JSON.stringify(lastResult.data, null, 2)}</pre>
          </div>
        )}
      </section>

      {/* ── Usage table ── */}
      {usage?.events?.length > 0 && (
        <section className="card">
          <h2>Usage History</h2>
          <table className="usage-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Endpoint</th>
                <th>Charged (stroops)</th>
                <th>Tx Hash</th>
              </tr>
            </thead>
            <tbody>
              {[...usage.events].reverse().map((e, i) => (
                <tr key={i}>
                  <td>{new Date(e.ts).toLocaleTimeString()}</td>
                  <td><code>{e.endpoint}</code></td>
                  <td>{e.amountCharged.toLocaleString()}</td>
                  <td><code>{e.txHash ? e.txHash.slice(0, 16) + "…" : "mock"}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {error && <p className="error-msg global">{error}</p>}
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [session, setSession] = useState(null);
  return session
    ? <Dashboard session={session} />
    : <SetupScreen onReady={setSession} />;
}
