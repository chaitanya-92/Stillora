import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, MoonStar, Play, ShieldCheck, Square, Ban, X } from "lucide-react";
import { sendMessage } from "../shared/messaging";
import { domainMatches } from "../shared/domain";
import { DEFAULT_STATE, type BlockingMode, type StilloraState } from "../shared/types";

const enter = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function Popup() {
  const [state, setState] = useState<StilloraState>(DEFAULT_STATE);
  const [error, setError] = useState("");
  const [pendingTabs, setPendingTabs] = useState<chrome.tabs.Tab[]>([]);
  const [busy, setBusy] = useState(false);
  useEffect(() => { void sendMessage({ type: "GET_STATE" }).then(setState).catch((e) => setError(e.message)); }, []);
  const active = state.session !== null;

  async function run(type: "START_SESSION" | "END_SESSION", existingTabAction?: "close" | "redirect") {
    try {
      setBusy(true); setError("");
      setState(await sendMessage({ type, ...(existingTabAction ? { existingTabAction } : {}) }));
      setPendingTabs([]);
    } catch (e) { setError(e instanceof Error ? e.message : "Could not update protection."); }
    finally { setBusy(false); }
  }

  async function requestStart() {
    try {
      setError("");
      const tabs = await chrome.tabs.query({});
      const domains = state.websites.filter(site => site.enabled).map(site => site.domain);
      const invalid = tabs.filter(tab => {
        if (!tab.id || !tab.url) return false;
        try {
          const url = new URL(tab.url);
          if (url.protocol !== "http:" && url.protocol !== "https:") return false;
          const matches = domains.some(domain => domainMatches(url.hostname, domain));
          return state.mode === "blocklist" ? matches : !matches;
        } catch { return false; }
      });
      if (invalid.length) { setPendingTabs(invalid); return; }
      await run("START_SESSION", "redirect");
    } catch (e) { setError(e instanceof Error ? e.message : "Could not inspect open tabs."); }
  }

  async function setMode(mode: BlockingMode) {
    try { setError(""); setState(await sendMessage({ type: "SET_MODE", mode })); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not change blocking mode."); }
  }

  return (
    <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: .07 } } }} className="w-[360px] bg-[#101719] p-5 text-[#F0FAF8]">
      <motion.header variants={enter} className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#2DD4BF] text-[#071719]"><MoonStar size={20}/></div>
          <div><div className="font-semibold tracking-tight">Stillora</div><div className="text-[10px] text-[#91A5A8]">Protect your focus</div></div>
        </div>
        <span className="badge badge-outline border-[#365052] text-[#91A5A8]">LOCAL · PRIVATE</span>
      </motion.header>

      <motion.section variants={enter} className="card rounded-2xl border-[#294144] bg-[#172326] p-5 shadow-xl shadow-black/20">
        <div className="flex items-center justify-between">
          <div><div className="text-xs text-[#91A5A8]">Protection status</div><div className="mt-1 text-lg font-semibold">{active ? "You're protected" : "You're in control"}</div></div>
          <motion.span animate={active ? {scale:[1,1.25,1],opacity:[1,.7,1]} : {scale:1,opacity:.55}} transition={{duration:2,repeat:active?Infinity:0}} className={active ? "h-2.5 w-2.5 rounded-full bg-[#34D399] shadow-[0_0_14px_rgba(52,211,153,.7)]" : "h-2.5 w-2.5 rounded-full bg-slate-600"}/>
        </div>
        <p className="mt-2 text-xs leading-5 text-[#91A5A8]">{active ? "Your website rules are active. Stop whenever you're ready." : "Start protection when you're ready. No timer or duration required."}</p>
        <AnimatePresence mode="wait">
          <motion.button key={active ? "stop" : "start"} initial={{opacity:0,y:7}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-5}} transition={{duration:.16}} disabled={busy} onClick={() => void (active ? run("END_SESSION") : requestStart())} className={active ? "btn btn-outline mt-5 w-full border-[#365052] text-[#E6F4F2] hover:bg-[#203437]" : "btn btn-primary mt-5 w-full border-0 bg-[#2DD4BF] text-[#071719] hover:bg-[#5EEAD4]"}>
            {active ? <><Square size={15}/> Stop protection</> : <><Play size={16}/> Start protection</>}
          </motion.button>
        </AnimatePresence>
      </motion.section>

      <motion.section variants={enter} className="mt-4">
        <div className="mb-2 flex items-center justify-between"><h2 className="text-xs font-semibold text-[#D7E6E3]">Blocking mode</h2><span className="text-[10px] text-[#91A5A8]">Choose your boundaries</span></div>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => void setMode("blocklist")} aria-pressed={state.mode === "blocklist"} className={state.mode === "blocklist" ? "btn h-auto min-h-0 flex-col items-start border border-[#2DD4BF]/50 bg-[#2DD4BF] p-3 text-left text-[#071719] hover:bg-[#5EEAD4]" : "btn h-auto min-h-0 flex-col items-start border border-[#294144] bg-[#172326] p-3 text-left text-[#D7E6E3] hover:bg-[#203437]"}><span className="flex items-center gap-2"><Ban size={14}/><span className="text-sm">Blocklist</span></span><span className="text-[10px] opacity-75">Block selected sites</span></button>
          <button onClick={() => void setMode("allowlist")} aria-pressed={state.mode === "allowlist"} className={state.mode === "allowlist" ? "btn h-auto min-h-0 flex-col items-start border border-[#2DD4BF]/50 bg-[#2DD4BF] p-3 text-left text-[#071719] hover:bg-[#5EEAD4]" : "btn h-auto min-h-0 flex-col items-start border border-[#294144] bg-[#172326] p-3 text-left text-[#D7E6E3] hover:bg-[#203437]"}><span className="flex items-center gap-2"><ShieldCheck size={14}/><span className="text-sm">Allowlist</span></span><span className="text-[10px] opacity-75">Allow selected sites only</span></button>
        </div>
      </motion.section>

      <motion.div variants={enter} className="mt-4 flex items-center justify-between rounded-xl border border-[#294144] bg-[#172326] px-3 py-3">
        <div><div className="text-xs font-medium">{state.websites.filter((site) => site.enabled).length} websites configured</div><div className="mt-1 text-[10px] text-[#91A5A8]">Manage your website rules</div></div><ShieldCheck size={18} className="text-[#5EEAD4]"/>
      </motion.div>

      <AnimatePresence>
        {pendingTabs.length > 0 && <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:8}} className="mt-4 rounded-2xl border border-[#2DD4BF]/30 bg-[#142124] p-4">
          <div className="flex items-start justify-between gap-2"><div className="text-sm font-semibold text-[#F0FAF8]">{state.mode === "allowlist" ? "Tabs outside your Allowlist" : "Blocked websites are already open"}</div><button aria-label="Cancel" onClick={()=>setPendingTabs([])}><X size={15}/></button></div>
          <p className="mt-1 text-xs leading-5 text-[#91A5A8]">{pendingTabs.length} open tab(s) do not match your {state.mode === "allowlist" ? "Allowlist" : "Blocklist"}. Choose what happens before protection starts. Nothing is closed until you confirm.</p>
          <div className="mt-3 max-h-24 space-y-1 overflow-y-auto rounded-xl border border-[#294144] bg-[#101719] p-2">{pendingTabs.slice(0,5).map((tab) => { let host = tab.url ?? "Website"; try { host = new URL(tab.url ?? "").hostname; } catch {} return <div key={tab.id} className="truncate text-[11px] text-[#A8BCB8]">{host}</div>; })}{pendingTabs.length > 5 && <div className="text-[10px] text-[#718986]">and {pendingTabs.length - 5} more tabs</div>}</div><div className="mt-3 grid grid-cols-2 gap-2">
            <button disabled={busy} onClick={()=>void run("START_SESSION","close")} className="btn btn-primary h-auto min-h-0 border-0 bg-[#2DD4BF] px-2 py-2 text-xs text-[#071719]">Close outside tabs</button>
            <button disabled={busy} onClick={()=>void run("START_SESSION","redirect")} className="btn btn-outline h-auto min-h-0 border-[#365052] px-2 py-2 text-xs text-[#E6F4F2]">Keep & redirect</button>
          </div>
          <button onClick={()=>setPendingTabs([])} className="mt-3 w-full text-xs text-[#91A5A8]">Cancel protection</button>
        </motion.div>}
      </AnimatePresence>

      {error && <p role="alert" className="mt-3 rounded-lg bg-rose-400/10 p-2 text-xs text-rose-200">{error}</p>}
      <motion.button variants={enter} onClick={() => chrome.runtime.openOptionsPage()} className="mt-5 flex w-full items-center justify-center gap-2 border-t border-[#294144] pt-4 text-xs text-[#91A5A8] hover:text-[#5EEAD4]">Open full dashboard <ExternalLink size={13}/></motion.button>
    </motion.div>
  );
}