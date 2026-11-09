import { useEffect, useState } from "react";
import { ExternalLink, MoonStar, Play, ShieldCheck, Square } from "lucide-react";
import { sendMessage } from "../shared/messaging";
import { DEFAULT_STATE, type BlockingMode, type StilloraState } from "../shared/types";

export default function Popup() {
  const [state, setState] = useState<StilloraState>(DEFAULT_STATE);
  const [error, setError] = useState("");

  useEffect(() => {
    void sendMessage({ type: "GET_STATE" }).then(setState).catch((e) => setError(e.message));
  }, []);

  const active = state.session !== null;

  async function start() {
    try {
      setError("");
      setState(await sendMessage({ type: "START_SESSION" }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start protection.");
    }
  }

  async function stop() {
    try {
      setError("");
      setState(await sendMessage({ type: "END_SESSION" }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not stop protection.");
    }
  }

  async function setMode(mode: BlockingMode) {
    try {
      setError("");
      setState(await sendMessage({ type: "SET_MODE", mode }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not change blocking mode.");
    }
  }

  return (
    <div className="w-[360px] bg-[#0B1020] p-5 text-slate-100">
      <header className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-300 text-slate-950"><MoonStar size={20} /></div>
          <div><div className="font-semibold">Stillora</div><div className="text-[10px] text-slate-500">Protect your focus</div></div>
        </div>
        <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] text-slate-400">LOCAL · PRIVATE</span>
      </header>

      <section className="rounded-2xl border border-violet-300/15 bg-violet-300/[.06] p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Protection status</div>
            <div className="mt-1 text-lg font-semibold">{active ? "You're protected" : "You're in control"}</div>
          </div>
          <span className={active ? "h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,.7)]" : "h-2.5 w-2.5 rounded-full bg-slate-600"} />
        </div>
        <p className="mt-2 text-xs leading-5 text-slate-400">
          {active ? "Your website rules are active. Stop whenever you're ready." : "Start protection when you're ready to focus. No timer or duration required."}
        </p>
        {active ? (
          <button onClick={stop} className="secondary mt-5 flex w-full items-center justify-center gap-2 py-3"><Square size={15} /> Stop protection</button>
        ) : (
          <button onClick={start} className="primary mt-5 flex w-full items-center justify-center gap-2 py-3"><Play size={16} /> Start protection</button>
        )}
      </section>

      <section className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xs font-semibold text-slate-300">Blocking mode</h2>
          <span className="text-[10px] text-slate-500">Choose your boundaries</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => void setMode("blocklist")} aria-pressed={state.mode === "blocklist"} className={state.mode === "blocklist" ? "rounded-xl border border-violet-200/40 bg-violet-300 px-3 py-3 text-left text-slate-950" : "rounded-xl border border-white/10 bg-white/[.04] px-3 py-3 text-left text-slate-300 hover:bg-white/[.08]"}>
            <div className="flex items-center gap-2"><Square size={14} /><span className="text-sm font-semibold">Blocklist</span></div>
            <div className="mt-1 text-[10px] opacity-75">Block selected websites</div>
          </button>
          <button onClick={() => void setMode("allowlist")} aria-pressed={state.mode === "allowlist"} className={state.mode === "allowlist" ? "rounded-xl border border-violet-200/40 bg-violet-300 px-3 py-3 text-left text-slate-950" : "rounded-xl border border-white/10 bg-white/[.04] px-3 py-3 text-left text-slate-300 hover:bg-white/[.08]"}>
            <div className="flex items-center gap-2"><ShieldCheck size={14} /><span className="text-sm font-semibold">Allowlist</span></div>
            <div className="mt-1 text-[10px] opacity-75">Allow only selected websites</div>
          </button>
        </div>
      </section>

      <div className="mt-4 flex items-center justify-between rounded-xl bg-white/[.04] px-3 py-3">
        <div><div className="text-xs font-medium">{state.websites.filter((site) => site.enabled).length} websites configured</div><div className="mt-1 text-[10px] text-slate-500">Manage your website rules in the dashboard</div></div>
        <ShieldCheck size={18} className="text-violet-200" />
      </div>

      {error && <p role="alert" className="mt-3 rounded-lg bg-rose-400/10 p-2 text-xs text-rose-200">{error}</p>}
      <button onClick={() => chrome.runtime.openOptionsPage()} className="mt-5 flex w-full items-center justify-center gap-2 border-t border-white/10 pt-4 text-xs text-slate-400 hover:text-white">Open full dashboard <ExternalLink size={13} /></button>
    </div>
  );
}
