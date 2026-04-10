export type TushareRequest = {
  api_name: string;
  token: string;
  params: Record<string, any>;
  fields?: string;
};

export async function callTushare(body: TushareRequest) {
  const response = await fetch(process.env.TUSHARE_BASE_URL || "https://api.tushare.pro", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`Tushare request failed: ${response.status}`);
  }

  return response.json();
}
