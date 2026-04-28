import { useState } from "react";
import { callPremiumData, createApiKey, fetchBalance, fetchUsage, topUp } from "./api";

const REQUEST_COST = 100;

export function App() {
  const [userAddress, setUserAddress] = useState("GUSERADDRESSDEMO123456");
  const [source, setSource] = useState<"treasury" | "user">("treasury");
  const [apiKey, setApiKey] = useState("");
  const [usage, setUsage] = useState<any>(null);
  const [balance, setBalance] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [txState, setTxState] = useState("");
  const [topUpAmount, setTopUpAmount] = useState(1000);

  async function handleCreateApiKey() {
    setLoading(true);
    const data = await createApiKey(userAddress, source);
    setApiKey(data.apiKey || "");
    setUsage(data);
    setLoading(false);
  }

  async function handleRefresh() {
    if (!apiKey) return;
    setLoading(true);
    const [u, b] = await Promise.all([fetchUsage(apiKey), fetchBalance(apiKey)]);
    setUsage(u);
    setBalance(b);
    setLoading(false);
  }

  async function handleTopUp() {
    setLoading(true);
    const data = await topUp(userAddress, topUpAmount, source);
    setTxState(data.txHash ? `Top-up submitted: ${data.txHash}` : "Top-up failed");
    await handleRefresh();
    setLoading(false);
  }

  async function handlePremiumRequest() {
    if (!apiKey) return;
    setLoading(true);
    const data = await callPremiumData(apiKey);
    setTxState(data.txHash ? `Charge submitted: ${data.txHash}` : "Charge failed");
    await handleRefresh();
    setLoading(false);
  }

  return (
    <main className="container">
      <h1>Micropay Developer Dashboard</h1>
      <p className="sub">
        This project is funded and governed by the Stellar Treasury system:
        https://github.com/YOUR-USERNAME/stellar-treasury
      </p>

      <section className="card">
        <h2>Identity</h2>
        <label>
          User Address
          <input value={userAddress} onChange={(e) => setUserAddress(e.target.value)} />
        </label>
        <label>
          Funding Source
          <select value={source} onChange={(e) => setSource(e.target.value as "treasury" | "user")}>
            <option value="treasury">Treasury-funded</option>
            <option value="user">Personal-funded</option>
          </select>
        </label>
        <button onClick={handleCreateApiKey} disabled={loading}>
          {loading ? "Creating..." : "Create API Key"}
        </button>
      </section>

      <section className="card">
        <h2>API Access</h2>
        <p><strong>Cost per request:</strong> {REQUEST_COST} stroops</p>
        <p><strong>API Key:</strong> {apiKey || "Not generated yet"}</p>
        <button onClick={handleRefresh} disabled={loading || !apiKey}>
          {loading ? "Loading..." : "Refresh Balance + Usage"}
        </button>
      </section>

      <section className="card">
        <h2>Usage + Balance</h2>
        <p><strong>Funding source:</strong> {usage?.source ?? "n/a"}</p>
        <p><strong>Requests:</strong> {usage?.requests ?? 0}</p>
        <p><strong>Total charged:</strong> {usage?.totalCharged ?? 0}</p>
        <p><strong>Balance:</strong> {balance?.balance ?? "n/a"}</p>
      </section>

      <section className="card">
        <h2>Actions</h2>
        <label>
          Top-up amount
          <input
            type="number"
            min={1}
            value={topUpAmount}
            onChange={(e) => setTopUpAmount(Number(e.target.value))}
          />
        </label>
        <button onClick={handleTopUp} disabled={loading}>
          {loading ? "Submitting..." : "Top Up"}
        </button>
        <button onClick={handlePremiumRequest} disabled={loading || !apiKey}>
          {loading ? "Charging..." : "Call /premium-data"}
        </button>
        <p>{txState}</p>
      </section>
    </main>
  );
}
