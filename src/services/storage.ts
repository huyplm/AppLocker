import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FocusSession, UserPreferences, FocusStats } from '../types';

const KEYS = {
  PREFERENCES: '@lockerapp:preferences',
  SESSIONS: '@lockerapp:sessions',
} as const;

const DEFAULT_PREFERENCES: UserPreferences = {
  defaultDuration: 25,
  selectedAppIds: ['instagram', 'twitter', 'tiktok', 'youtube', 'reddit'],
  onboardingDone: false,
};

export async function getPreferences(): Promise<UserPreferences> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.PREFERENCES);
    if (!raw) return { ...DEFAULT_PREFERENCES };
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_PREFERENCES };
  }
}

export async function savePreferences(
  partial: Partial<UserPreferences>,
): Promise<void> {
  const current = await getPreferences();
  await AsyncStorage.setItem(
    KEYS.PREFERENCES,
    JSON.stringify({ ...current, ...partial }),
  );
}

export async function getSessions(): Promise<FocusSession[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.SESSIONS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveSession(session: FocusSession): Promise<void> {
  const sessions = await getSessions();
  sessions.unshift(session);
  if (sessions.length > 200) sessions.length = 200;
  await AsyncStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
}

export async function getStats(): Promise<FocusStats> {
  const sessions = await getSessions();

  const completed = sessions.filter((s) => s.completed);
  const totalMinutes = sessions.reduce(
    (sum, s) => sum + s.completedMinutes,
    0,
  );

  let currentStreak = 0;
  let longestStreak = 0;

  if (completed.length > 0) {
    const daySet = new Set(
      completed.map((s) => s.startedAt.slice(0, 10)),
    );
    const days = [...daySet].sort().reverse();

    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .slice(0, 10);

    if (days[0] === today || days[0] === yesterday) {
      currentStreak = 1;
      for (let i = 1; i < days.length; i++) {
        const prev = new Date(days[i - 1]);
        const curr = new Date(days[i]);
        const diff = (prev.getTime() - curr.getTime()) / 86400000;
        if (Math.round(diff) === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    let streak = 1;
    const sorted = [...daySet].sort();
    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(sorted[i - 1]);
      const curr = new Date(sorted[i]);
      const diff = (curr.getTime() - prev.getTime()) / 86400000;
      if (Math.round(diff) === 1) {
        streak++;
      } else {
        longestStreak = Math.max(longestStreak, streak);
        streak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, streak);
  }

  return {
    totalSessions: sessions.length,
    completedSessions: completed.length,
    totalFocusMinutes: Math.round(totalMinutes),
    currentStreak,
    longestStreak,
  };
}

export function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
