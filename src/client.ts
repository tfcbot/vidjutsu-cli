// VidJutsu HTTP client for CLI
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { homedir } from "os";

const CONFIG_DIR = join(homedir(), ".vidjutsu");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");

interface Config {
  apiUrl: string;
  payment?: string; // "card:<token>" or "wallet:<address>"
}

function loadConfig(): Config {
  if (existsSync(CONFIG_FILE)) {
    return JSON.parse(readFileSync(CONFIG_FILE, "utf-8"));
  }
  return { apiUrl: "https://api.vidjutsu.ai" };
}

function saveConfig(config: Config) {
  if (!existsSync(CONFIG_DIR)) mkdirSync(CONFIG_DIR, { recursive: true });
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

export function getConfig(): Config {
  return loadConfig();
}

export function setPayment(payment: string) {
  const config = loadConfig();
  config.payment = payment;
  saveConfig(config);
}

export function setApiUrl(url: string) {
  const config = loadConfig();
  config.apiUrl = url;
  saveConfig(config);
}

export async function apiRequest(
  method: string,
  path: string,
  body?: unknown
): Promise<unknown> {
  const config = loadConfig();
  if (!config.payment) {
    throw new Error(
      'Not authenticated. Run "vidjutsu auth --card <token>" or "vidjutsu auth --wallet <address>" first.'
    );
  }

  const url = `${config.apiUrl}${path}`;
  const headers: Record<string, string> = {
    "X-Payment": config.payment,
    "Content-Type": "application/json",
  };

  const res = await fetch(url, {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
  });

  const json = await res.json();

  if (!res.ok) {
    const msg =
      typeof json === "object" && json !== null && "error" in json
        ? (json as any).message ?? (json as any).error
        : `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return json;
}
