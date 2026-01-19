export type DeviceSession = {
  deviceId: string;
  storeId: string;
  deviceToken: string;
};

const KEY = 'menucast.player.device';

export function getDeviceSession(): DeviceSession | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DeviceSession;
  } catch {
    return null;
  }
}

export function setDeviceSession(s: DeviceSession) {
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function clearDeviceSession() {
  localStorage.removeItem(KEY);
}
