
export enum PromptType {
  BASELINE = 'Baseline',
  ROLE_BASED = 'Role-based',
  CONSTRAINT_DRIVEN = 'Constraint-driven'
}

export interface EvaluationMetrics {
  wordCount: number;
  riskyKeywords: string[];
  hasDisclaimer: boolean;
  hallucinationRiskScore: number; // 0-100 (lower is better)
  evidenceConfidence: number; // 0-100 (higher is better)
}

export interface TestResult {
  id: string;
  promptType: PromptType;
  promptUsed: string;
  response: string;
  temperature: number;
  metrics: EvaluationMetrics;
  timestamp: number;
}

export interface TestCase {
  query: string;
  temperature: number;
  activePromptTypes: PromptType[];
}
