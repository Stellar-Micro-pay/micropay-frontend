const BASE_URL = "http://localhost:8080";

export async function createApiKey(userAddress: string, source: "treasury" | "user") {
  const res = await fetch(`${BASE_URL}/api-key`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userAddress, source })
  });
  return res.json();
}

export async function fetchBalance(apiKey: string) {
  const res = await fetch(`${BASE_URL}/balance`, {
    headers: { "x-api-key": apiKey }
  });
  return res.json();
}

export async function fetchUsage(apiKey: string) {
  const res = await fetch(`${BASE_URL}/usage`, {
    headers: { "x-api-key": apiKey }
  });
  return res.json();
}

export async function topUp(userAddress: string, amount: number, source: "treasury" | "user") {
  const res = await fetch(`${BASE_URL}/top-up`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userAddress, amount, source })
  });
  return res.json();
}

export async function callPremiumData(apiKey: string) {
  const res = await fetch(`${BASE_URL}/premium-data`, {
    headers: { "x-api-key": apiKey }
  });
  return res.json();
}
