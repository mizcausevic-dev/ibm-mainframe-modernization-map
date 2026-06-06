import { describe, expect, it } from "vitest";
import sample from "../fixtures/mainframe-modernization-sample.json" with { type: "json" };
import { buildMap, classifyTier, renderMarkdown, scoreWorkload } from "../src/index.js";

describe("ibm mainframe modernization map", () => {
  it("classifies modernization tiers", () => {
    expect(classifyTier(84)).toBe("REBUILD");
    expect(classifyTier(70)).toBe("STRANGLE");
    expect(classifyTier(50)).toBe("WRAP");
    expect(classifyTier(20)).toBe("CONTAIN");
  });

  it("scores dependency-heavy workloads", () => {
    const workload = scoreWorkload(sample.workloads[0]);
    expect(workload.modernizationScore).toBeGreaterThan(50);
    expect(workload.boardSignal).toContain("modernization");
  });

  it("sorts the map by modernization score", () => {
    const map = buildMap(sample);
    expect(map.summary.workloadCount).toBe(4);
    expect(map.workloads[0].modernizationScore).toBeGreaterThanOrEqual(map.workloads[1].modernizationScore);
    expect(map.summary.primaryRecommendation).toContain(map.summary.highestRiskWorkload);
  });

  it("renders markdown for README packaging", () => {
    const markdown = renderMarkdown(buildMap(sample));
    expect(markdown).toContain("| Workload | Tier | Score |");
    expect(markdown).toContain("COBOL");
  });
});
