import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Search, ShieldCheck, MoonStar, Sparkles, LockKeyhole } from "lucide-react";

export default function Blocked() {
  const [query, setQuery] = useState("");
  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;
    window.location.assign(`https://www.google.com/search?q=${encodeURIComponent(value)}`);
  }
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#101719] px-5 py-12 text-[#F0FAF8]">
      <motion.div aria-hidden initial={{opacity:0}} animate={{opacity:1}} transition={{duration:1}} className="pointer-events-none absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-teal-400/[.09] blur-[130px]"/>
      <motion.div aria-hidden initial={{opacity:0}} animate={{opacity:1}} transition={{duration:1.2,delay:.15}} className="pointer-events-none absolute -right-40 bottom-0 h-[420px] w-[420px] rounded-full bg-cyan-400/[.07] blur-[120px]"/>
      <motion.div initial={{opacity:0,y:22,scale:.985}} animate={{opacity:1,y:0,scale:1}} transition={{duration:.55,ease:[.22,1,.36,1]}} className="relative w-full max-w-2xl">
        <header className="mb-10 flex items-center justify-center gap-3">
          <motion.div initial={{rotate:-18,scale:.8}} animate={{rotate:0,scale:1}} transition={{type:"spring",stiffness:180,damping:14}} className="grid h-12 w-12 place-items-center rounded-2xl border border-[#2DD4BF]/25 bg-[#2DD4BF]/10 text-[#5EEAD4]"><MoonStar size={23}/></motion.div>
          <div className="text-left"><div className="text-lg font-semibold tracking-tight">Stillora</div><div className="text-[10px] font-medium tracking-[.18em] text-[#91A5A8]">FOCUS, ON YOUR TERMS</div></div>
        </header>
        <motion.section whileHover={{borderColor:"rgba(45,212,191,.3)"}} className="card rounded-[30px] border border-[#294144] bg-[#172326]/95 p-7 text-center shadow-2xl shadow-black/30 sm:p-11">
          <div className="badge badge-outline gap-2 border-[#2DD4BF]/25 bg-[#2DD4BF]/[.07] px-4 py-4 text-[#5EEAD4]"><ShieldCheck size={14}/> Focus boundary active</div>
          <div className="mb-4 mt-7 flex items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[.25em] text-[#91A5A8]"><motion.span animate={{opacity:[.35,1,.35],scale:[.85,1,.85]}} transition={{duration:2,repeat:Infinity}} className="h-2 w-2 rounded-full bg-[#2DD4BF] shadow-[0_0_16px_#2DD4BF]"/>A deliberate pause<motion.span animate={{opacity:[.35,1,.35],scale:[.85,1,.85]}} transition={{duration:2,repeat:Infinity,delay:1}} className="h-2 w-2 rounded-full bg-[#5EEAD4]"/></div>
          <h1 className="text-4xl font-semibold leading-[1.08] tracking-[-.045em] sm:text-6xl">Stay with what<span className="block text-[#5EEAD4]">matters most.</span></h1>
          <div className="mx-auto mb-5 flex max-w-sm items-center justify-center gap-6 border-y border-[#294144] py-3"><div className="text-center"><motion.div initial={{y:12,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:.5}} className="font-mono text-2xl font-semibold text-[#5EEAD4]">01</motion.div><div className="text-[9px] uppercase tracking-[.18em] text-[#718986]">Pause</div></div><div className="h-7 w-px bg-[#294144]"/><div className="text-center"><motion.div initial={{y:12,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:.5,delay:.12}} className="font-mono text-2xl font-semibold text-[#5EEAD4]">02</motion.div><div className="text-[9px] uppercase tracking-[.18em] text-[#718986]">Search</div></div><div className="h-7 w-px bg-[#294144]"/><div className="text-center"><motion.div initial={{y:12,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:.5,delay:.24}} className="font-mono text-2xl font-semibold text-[#5EEAD4]">03</motion.div><div className="text-[9px] uppercase tracking-[.18em] text-[#718986]">Return</div></div></div><p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[#A8BCB8]">This destination is outside your focus boundaries. You can still search and research the web without opening restricted websites.</p>
          <form onSubmit={search} className="form-control mx-auto mt-9 flex max-w-lg flex-row items-center gap-2 rounded-2xl border border-[#365052] bg-[#101719] p-2 transition focus-within:border-[#2DD4BF] focus-within:ring-2 focus-within:ring-[#2DD4BF]/10">
            <Search className="ml-3 shrink-0 text-[#91A5A8]" size={19}/>
            <input aria-label="Search the web" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search the web without leaving your focus..." className="input input-ghost min-w-0 flex-1 border-0 bg-transparent text-sm text-[#F0FAF8] outline-none placeholder:text-[#718986] focus:bg-transparent focus:outline-none"/>
            <button type="submit" disabled={!query.trim()} className="btn btn-primary shrink-0 rounded-xl border-0 bg-[#2DD4BF] px-4 text-xs font-bold text-[#071719] hover:bg-[#5EEAD4] disabled:opacity-40">Search <ArrowUpRight size={14}/></button>
          </form>
          <p className="mt-3 text-[11px] leading-5 text-[#91A5A8]">Search results are available. Opening a restricted result will still be blocked.</p>
          <div className="mx-auto mt-9 flex max-w-lg items-center gap-3 rounded-2xl border border-[#294144] bg-[#1E3033]/70 p-4 text-left">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#2DD4BF]/10 text-[#5EEAD4]"><LockKeyhole size={18}/></div>
            <div className="min-w-0 flex-1"><div className="text-sm font-medium text-[#E6F4F2]">Your focus is still yours.</div><div className="mt-1 text-xs leading-5 text-[#91A5A8]">Use search to find information, or return to the task you chose.</div></div><Sparkles className="shrink-0 text-[#5EEAD4]" size={17}/>
          </div>
          <button onClick={()=>history.back()} className="btn btn-outline mt-8 rounded-xl border-[#365052] text-sm text-[#D7E6E3] hover:border-[#2DD4BF] hover:bg-[#2DD4BF]/10 hover:text-[#5EEAD4]"><ArrowLeft size={16}/> Return to work</button>
        </motion.section>
        <div className="mt-7 overflow-hidden border-y border-[#294144]/70 py-2"><motion.div animate={{x:["0%","-50%"]}} transition={{duration:22,repeat:Infinity,ease:"linear"}} className="flex w-max gap-8 whitespace-nowrap text-[9px] font-semibold tracking-[.28em] text-[#718986]"><span>FOCUS IS A PRACTICE · ATTENTION IS A CHOICE · PROTECT YOUR FLOW · </span><span>FOCUS IS A PRACTICE · ATTENTION IS A CHOICE · PROTECT YOUR FLOW · </span></motion.div></div><footer className="mt-5 text-center text-[10px] font-medium tracking-[.22em] text-[#718986]">STILLORA · PROTECT YOUR ATTENTION</footer>
      </motion.div>
    </main>
  );
}