import type { BlockingMode, Website } from "../shared/types";

const FIRST_RULE_ID = 1000;
const CATCH_ALL_RULE_ID = 5999;
const MAIN_FRAME = "main_frame" as unknown as chrome.declarativeNetRequest.ResourceType;

export function buildRules(
  mode: BlockingMode,
  websites: Website[]
): chrome.declarativeNetRequest.Rule[] {
  const active = [
    ...new Map(
      websites
        .filter((site) => site.enabled)
        .map((site) => [site.domain.toLowerCase(), site])
    ).values()
  ];
  const rules: chrome.declarativeNetRequest.Rule[] = [];

  if (mode === "blocklist") {
    active.slice(0, 4999).forEach((site, index) => {
      rules.push({
        id: FIRST_RULE_ID + index,
        priority: 10,
        action: {
          type: "redirect" as unknown as chrome.declarativeNetRequest.RuleActionType,
          redirect: { extensionPath: "/blocked.html" }
        },
        condition: {
          urlFilter: `||${site.domain}^`,
          resourceTypes: [MAIN_FRAME]
        }
      });
    });
    return rules;
  }

  active.slice(0, 4998).forEach((site, index) => {
    rules.push({
      id: FIRST_RULE_ID + index,
      priority: 20,
      action: { type: "allow" as unknown as chrome.declarativeNetRequest.RuleActionType },
      condition: {
        urlFilter: `||${site.domain}^`,
        resourceTypes: [MAIN_FRAME]
      }
    });
  });

  rules.push({
    id: CATCH_ALL_RULE_ID,
    priority: 1,
    action: {
      type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
      redirect: { extensionPath: "/blocked.html" }
    },
    condition: {
      regexFilter: "^https?://",
      resourceTypes: [MAIN_FRAME]
    }
  });

  return rules;
}

export async function syncBlockingRules(
  mode: BlockingMode,
  websites: Website[]
): Promise<void> {
  const desired = buildRules(mode, websites);
  const current = await chrome.declarativeNetRequest.getDynamicRules();
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: current.map((rule) => rule.id),
    addRules: desired
  });
}
