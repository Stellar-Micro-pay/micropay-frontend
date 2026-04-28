/**
 * useApi.js
 * Central hook for all backend API interactions.
 */

import { useState, useCallback } from "react";

const BASE = process.env.REACT_APP_API_URL || "http://localhost:3001";

function buildHeaders(apiKey) {
  const h = { "Content-Type": "application/json" };
  if (apiKey) h["x-api-key"] = apiKey;
  return h;
}

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const request = useCallback(async (method, path, body, apiKey) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE}${path}`, {
        method,
        headers: buildHeaders(apiKey),
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateKey = (walletAddress, fundingSource = "user") =>
    request("POST", "/api-key", { walletAddress, fundingSource });

  const getBalance = (apiKey) =>
    request("GET", "/balance", null, apiKey);

  const getUsage = (apiKey) =>
    request("GET", "/usage", null, apiKey);

  const topUp = (apiKey, amountXLM) =>
    request("POST", "/top-up", { amountXLM }, apiKey);

  const callPremium = (apiKey) =>
    request("GET", "/premium-data", null, apiKey);

  return { loading, error, generateKey, getBalance, getUsage, topUp, callPremium };
}
