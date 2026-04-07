import type { Property } from "./types";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://api.intelleqn8n.net/h2o";
const AGENT_URL = import.meta.env.VITE_AGENT_URL || "https://api.intelleqn8n.net/h2o-agent";

// Static fallback properties (used if API fails)
import { fallbackProperties } from "../data/fallback-properties";

export async function fetchProperties(filters?: { area?: string; status?: string }): Promise<Property[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.area) params.set("area", filters.area);
    if (filters?.status) params.set("status", filters.status);
    const res = await fetch(`${BACKEND_URL}/public/properties?${params}`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error("API failed");
    return await res.json();
  } catch {
    // Fallback to static data
    let result = fallbackProperties;
    if (filters?.status) result = result.filter(p => p.status === filters.status);
    if (filters?.area) result = result.filter(p => p.area === filters.area);
    return result;
  }
}

export async function fetchPropertyById(id: number): Promise<Property | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/public/properties/${id}`);
    if (!res.ok) throw new Error("API failed");
    return await res.json();
  } catch {
    return fallbackProperties.find(p => p.id === id) || null;
  }
}

// Chat API (talks to the state machine agent on EC2)
export interface ChatStartResponse {
  sessionId: string;
  greeting: string;
  state: string;
}

export interface ChatMessageResponse {
  response: string;
  state: string;
  shouldEnd: boolean;
}

export async function chatStart(): Promise<ChatStartResponse> {
  const res = await fetch(`${AGENT_URL}/api/chat/start`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to start chat");
  return await res.json();
}

export async function chatMessage(sessionId: string, message: string): Promise<ChatMessageResponse> {
  const res = await fetch(`${AGENT_URL}/api/chat/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, message }),
  });
  if (!res.ok) throw new Error("Failed to send message");
  return await res.json();
}

export async function chatEnd(sessionId: string): Promise<void> {
  await fetch(`${AGENT_URL}/api/chat/end`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId }),
  });
}
