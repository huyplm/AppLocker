export interface AppInfo {
  id: string;
  name: string;
  category: string;
  icon: string;
  color: string;
}

export interface FocusSession {
  id: string;
  startedAt: string;
  endedAt: string;
  durationMinutes: number;
  completedMinutes: number;
  completed: boolean;
  selectedAppIds: string[];
}

export interface UserPreferences {
  defaultDuration: number;
  selectedAppIds: string[];
  onboardingDone: boolean;
}

export interface FocusStats {
  totalSessions: number;
  completedSessions: number;
  totalFocusMinutes: number;
  currentStreak: number;
  longestStreak: number;
}

export type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
  AppSelection: { selectedAppIds: string[] };
  FocusActive: { durationMinutes: number; selectedAppIds: string[] };
  LockedPrompt: { appName: string; remainingSeconds: number };
};
