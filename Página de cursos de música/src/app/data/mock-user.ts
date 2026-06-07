export interface MockUser {
  id: string;
  name: string;
  initials: string;
  currentMonth: number;
  currentNode: number;
  totalNodesInMonth: number;
  currentNodeTitle: string;
  streakDays: number;
  monthlyProgress: number;
  instrument: string;
  levelLabel: string;
  pathLabel: string;
  /** Stats del dropdown público (legacy UI, no flujo principal) */
  xp: number;
  weeklyDone: number;
  weeklyTotal: number;
}

export const MOCK_USER: MockUser = {
  id: "carlos-demo",
  name: "Carlos",
  initials: "C",
  currentMonth: 2,
  currentNode: 3,
  totalNodesInMonth: 6,
  currentNodeTitle: "Acordes abiertos",
  streakDays: 4,
  monthlyProgress: 38,
  instrument: "Guitarra",
  levelLabel: "Fundamento",
  pathLabel: "Mes 2 · Nodo 3 de 6",
  xp: 1240,
  weeklyDone: 4,
  weeklyTotal: 5,
};

export function getUserPathLabel(user: MockUser = MOCK_USER): string {
  return `Mes ${user.currentMonth} · Nodo ${user.currentNode} de ${user.totalNodesInMonth}`;
}

export function getUserLevelMonthLabel(user: MockUser = MOCK_USER): string {
  return `${user.levelLabel} · Mes ${user.currentMonth}`;
}

export function getWelcomeGreeting(user: MockUser = MOCK_USER): string {
  return `¡Hola, ${user.name}! Tu estudio está listo.`;
}

export function getStreakMessage(user: MockUser = MOCK_USER): string {
  return `${user.streakDays} días seguidos practicando — vamos por el quinto.`;
}

export function getStreakDaysLabel(user: MockUser = MOCK_USER): string {
  return `${user.streakDays} días`;
}

export function getMonthlyProgressLabel(user: MockUser = MOCK_USER): string {
  return `${user.monthlyProgress}%`;
}

export function getCurrentNodeProgressLine(user: MockUser = MOCK_USER): string {
  return `Nodo actual: ${user.currentNodeTitle} · ${user.pathLabel}`;
}
