export type BlockingMode="blocklist"|"allowlist"; export type SessionStatus="running"|"paused";
export interface Website{id:string;domain:string;enabled:boolean;createdAt:number}
export interface FocusSession{id:string;status:SessionStatus;startedAt:number;endsAt:number|null;remainingMs:number}
export interface StilloraState{mode:BlockingMode;websites:Website[];session:FocusSession|null;strictMode:boolean}
export const DEFAULT_STATE:StilloraState={mode:"blocklist",websites:[],session:null,strictMode:false};
export type Message={type:"GET_STATE"}|{type:"SAVE_WEBSITES";websites:Website[]}|{type:"SET_MODE";mode:BlockingMode}|{type:"START_SESSION";durationMinutes:number}|{type:"PAUSE_SESSION"}|{type:"RESUME_SESSION"}|{type:"END_SESSION"};