import {DEFAULT_STATE,type StilloraState} from "./types"; const KEY="stillora.state";
export async function readState():Promise<StilloraState>{const r=await chrome.storage.local.get(KEY);return {...DEFAULT_STATE,...(r[KEY] as Partial<StilloraState>|undefined)}}
export async function writeState(state:StilloraState):Promise<void>{await chrome.storage.local.set({[KEY]:state})}