import { readFile } from "node:fs/promises";

export type ModernizationTier = "CONTAIN" | "WRAP" | "STRANGLE" | "REBUILD";

export interface Workload {
  name: string;
  owner: string;
  audience: string;
  languageMix: string[];
  monthlyRunVolume: number;
  batchWindowHours: number;
  dependencyCount: number;
  dataSensitivity: number;
  changeFailureRate: number;
  apiCoverage: number;
  testCoverage: number;
  documentationCoverage: number;
  annualRunCostMillions: number;
  businessCriticality: number;
  narrative: string;
  nextAction: string;
}

export interface ModernizationInput {
  generatedAt: string;
  organization: string;
  workloads: Workload[];
}

export interface ScoredWorkload extends Workload {
  modernizationScore: number;
  tier: ModernizationTier;
  boardSignal: string;
}

export interface ModernizationMap {
  generatedAt: string;
  organization: string;
  workloads: ScoredWorkload[];
  summary: {
    workloadCount: number;
    highestRiskWorkload: string;
    meanModernizationScore: number;
    totalRunCostMillions: number;
    rebuildCandidates: number;
    primaryRecommendation: string;
  };
}

const clamp = (value: number, min = 0, max = 100): number => Math.min(max, Math.max(min, value));

export function classifyTier(score: number): ModernizationTier {
  if (score >= 78) return "REBUILD";
  if (score >= 62) return "STRANGLE";
  if (score >= 42) return "WRAP";
  return "CONTAIN";
}

export function scoreWorkload(workload: Workload): ScoredWorkload {
  const dependencyPressure = clamp(workload.dependencyCount * 3.2);
  const batchPressure = clamp(workload.batchWindowHours * 8);
  const integrationGap = 100 - workload.apiCoverage;
  const testGap = 100 - workload.testCoverage;
  const documentationGap = 100 - workload.documentationCoverage;
  const runCostPressure = clamp(workload.annualRunCostMillions * 9);

  const modernizationScore = Math.round(
    clamp(
      dependencyPressure * 0.18 +
        batchPressure * 0.12 +
        workload.dataSensitivity * 0.12 +
        workload.changeFailureRate * 0.16 +
        integrationGap * 0.14 +
        testGap * 0.1 +
        documentationGap * 0.08 +
        runCostPressure * 0.06 +
        workload.businessCriticality * 0.04
    )
  );

  const tier = classifyTier(modernizationScore);
  const boardSignal =
    tier === "REBUILD"
      ? "High-risk modernization lane: operating exposure is large enough to justify a dedicated investment decision."
      : tier === "STRANGLE"
        ? "modernization sequencing lane: wrap stable interfaces now and move risk behind strangler patterns."
        : tier === "WRAP"
          ? "Control lane: improve API, test, and documentation coverage before deeper migration."
          : "Contain lane: keep stable, monitored, and explicitly owned.";

  return {
    ...workload,
    modernizationScore,
    tier,
    boardSignal
  };
}

export function buildMap(input: ModernizationInput): ModernizationMap {
  const workloads = input.workloads.map(scoreWorkload).sort((a, b) => b.modernizationScore - a.modernizationScore);
  const totalRunCostMillions = Number(workloads.reduce((sum, workload) => sum + workload.annualRunCostMillions, 0).toFixed(1));
  const meanModernizationScore = Math.round(
    workloads.reduce((sum, workload) => sum + workload.modernizationScore, 0) / Math.max(workloads.length, 1)
  );
  const highestRiskWorkload = workloads[0]?.name ?? "No workloads";
  const rebuildCandidates = workloads.filter((workload) => workload.tier === "REBUILD").length;
  const primaryRecommendation =
    rebuildCandidates > 0
      ? `Prepare investment packet for ${highestRiskWorkload}; it has enough dependency, test, and run-cost pressure to require board-level sequencing.`
      : `Start with ${highestRiskWorkload}; wrap interfaces and reduce migration ambiguity before a rebuild decision.`;

  return {
    generatedAt: input.generatedAt,
    organization: input.organization,
    workloads,
    summary: {
      workloadCount: workloads.length,
      highestRiskWorkload,
      meanModernizationScore,
      totalRunCostMillions,
      rebuildCandidates,
      primaryRecommendation
    }
  };
}

export async function loadMap(path: string): Promise<ModernizationMap> {
  return buildMap(JSON.parse(await readFile(path, "utf8")) as ModernizationInput);
}

export function renderMarkdown(map: ModernizationMap): string {
  const rows = map.workloads
    .map(
      (workload) =>
        `| ${workload.name} | ${workload.tier} | ${workload.modernizationScore} | ${workload.languageMix.join(", ")} | $${workload.annualRunCostMillions}M | ${workload.nextAction} |`
    )
    .join("\n");

  return [
    "# IBM Mainframe Modernization Map",
    "",
    `Organization: ${map.organization}`,
    "",
    `Primary recommendation: ${map.summary.primaryRecommendation}`,
    "",
    "| Workload | Tier | Score | Language signals | Annual run cost | Next action |",
    "| --- | --- | ---: | --- | ---: | --- |",
    rows
  ].join("\n");
}
