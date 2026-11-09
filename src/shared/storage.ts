import { DEFAULT_STATE, type StilloraState } from "./types";

const KEY = "stillora.state";

export async function readState(): Promise<StilloraState> {
  const result = await chrome.storage.local.get(KEY);
  const stored = result[KEY] as Partial<StilloraState> | undefined;
  return {
    ...DEFAULT_STATE,
    ...stored,
    websites: stored?.websites ?? DEFAULT_STATE.websites,
    history: stored?.history ?? DEFAULT_STATE.history
  };
}

export async function writeState(state: StilloraState): Promise<void> {
  await chrome.storage.local.set({ [KEY]: state });
}