import { useState, useEffect, useCallback } from 'react';
import {
  getPreferences,
  savePreferences,
  getStats,
  saveSession,
  generateSessionId,
} from '../services/storage';
import type { UserPreferences, FocusStats } from '../types';

export function useFocusSession() {
  const [preferences, setPreferences] = useState<UserPreferences>({
    defaultDuration: 25,
    selectedAppIds: ['instagram', 'twitter', 'tiktok', 'youtube', 'reddit'],
    onboardingDone: false,
  });
  const [stats, setStats] = useState<FocusStats>({
    totalSessions: 0,
    completedSessions: 0,
    totalFocusMinutes: 0,
    currentStreak: 0,
    longestStreak: 0,
  });
  const [loaded, setLoaded] = useState(false);

  const reload = useCallback(async () => {
    const [prefs, st] = await Promise.all([getPreferences(), getStats()]);
    setPreferences(prefs);
    setStats(st);
    setLoaded(true);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const updatePreferences = useCallback(
    async (partial: Partial<UserPreferences>) => {
      await savePreferences(partial);
      setPreferences((prev) => ({ ...prev, ...partial }));
    },
    [],
  );

  const completeSession = useCallback(
    async (
      durationMinutes: number,
      elapsedSeconds: number,
      selectedAppIds: string[],
      completed: boolean,
    ) => {
      await saveSession({
        id: generateSessionId(),
        startedAt: new Date(Date.now() - elapsedSeconds * 1000).toISOString(),
        endedAt: new Date().toISOString(),
        durationMinutes,
        completedMinutes: Math.round(elapsedSeconds / 60),
        completed,
        selectedAppIds,
      });
      const newStats = await getStats();
      setStats(newStats);
    },
    [],
  );

  return {
    preferences,
    stats,
    loaded,
    updatePreferences,
    completeSession,
    reload,
  };
}
