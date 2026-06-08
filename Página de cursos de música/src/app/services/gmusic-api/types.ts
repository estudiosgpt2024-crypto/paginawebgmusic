export interface DashboardUser {
  id: string;
  name: string;
  timezone: string;
  levelLabel: string;
  pathLabel: string;
}

export interface DashboardStreak {
  currentDays: number;
  activeToday: boolean;
}

export interface DashboardXp {
  total: number;
  earnedThisWeek: number;
}

export interface DashboardModuleProgress {
  moduleId: string;
  moduleTitle: string;
  percentCompleted: number;
  currentNodeTitle: string;
  completedNodes: number;
  totalNodes: number;
}

export interface DashboardNextPractice {
  nodeId: string;
  title: string;
  typeLabel: string;
  description: string;
}

export interface DashboardResponse {
  user: DashboardUser;
  streak: DashboardStreak;
  xp: DashboardXp;
  moduleProgress: DashboardModuleProgress;
  nextPractice: DashboardNextPractice | null;
}

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
  };
}
