import { describe, expect, it } from "vitest";
import { buildRules } from "../src/background/blocking";
import type { Website } from "../src/shared/types";

const sites: Website[] = [{ id: "1", domain: "youtube.com", enabled: true, createdAt: 0 }];

describe("buildRules", () => {
  it("creates redirect rules for blocklist websites", () => {
    const rules = buildRules("blocklist", sites);
    expect(rules).toHaveLength(1);
    expect(rules[0].action.type).toBe("redirect");
    expect(rules[0].condition.urlFilter).toContain("youtube.com");
  });

  it("allows configured websites and search result pages in allowlist mode", () => {
    const rules = buildRules("allowlist", sites);
    expect(rules[0].action.type).toBe("allow");
    const searchRules = rules.filter((rule) => rule.id >= 5900 && rule.id < 5999);
    expect(searchRules).toHaveLength(4);
    expect(searchRules.some((rule) => rule.condition.regexFilter?.includes("google"))).toBe(true);
    expect(searchRules.every((rule) => rule.priority > 1)).toBe(true);
    expect(rules[rules.length - 1].action.type).toBe("redirect");
  });

  it("keeps search-result exceptions out of blocklist mode", () => {
    expect(buildRules("blocklist", sites)).toHaveLength(1);
  });

  it("ignores disabled domains", () => {
    const rules = buildRules("blocklist", [{ ...sites[0], enabled: false }]);
    expect(rules).toHaveLength(0);
  });

  it("deduplicates repeated domains", () => {
    expect(buildRules("blocklist", [sites[0], { ...sites[0], id: "2" }])).toHaveLength(1);
  });
});
