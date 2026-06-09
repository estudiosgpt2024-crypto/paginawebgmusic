import type { ExerciseType } from "../../../services/gmusic-api/types";

export interface SafeExerciseOption {
  id: string;
  text: string;
}

export interface SafeExerciseMedia {
  audioUrl?: string;
  imageUrl?: string;
  diagramLabel?: string;
  patternBeats?: string[];
}

export interface ParsedExerciseView {
  id: string;
  type: ExerciseType;
  difficulty: number;
  instruction: string;
  options: SafeExerciseOption[];
  media: SafeExerciseMedia;
}

export type ExerciseParseResult =
  | { kind: "supported"; exercise: ParsedExerciseView }
  | { kind: "incompatible"; exerciseId: string; reason: string };
