import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowUpRight, Search, ShieldCheck, MoonStar, Sparkles } from "lucide-react";

export default function Blocked() {
  const [query, setQuery] = useState("");

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;
    // Always submit as a search query, never as a direct destination URL.
    window.location.assign(`https://www.google.com/search?q=${encodeURIComponent(value)}`);
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0A1020] px-5 py-12 text-[#F4F6FC]">
      <div className="pointer-events-none absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-violet-500/[.10] blur-[130px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[420px] w-[420px] rounded-full bg-teal-400/[.06] blur-[120px]" />

      <div className="relative w-full max-w-2xl">
        <header className="mb-12 flex items-center justify-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl border border-violet-200/20 bg-violet-300/10 text-violet-200">
            <MoonStar size={22} />
          </div>
          <div className="text-left">
            <div className="text-base font-semibold tracking-tight">Stillora</div>
            <div className="text-[11px] tracking-wide text-slate-500">FOCUS, ON YOUR TERMS</div>
          </div>
        </header>

        <section className="rounded-[28px] border border-[#293650] bg-[#111A2D]/95 p-7 text-center shadow-2xl shadow-black/30 sm:p-11">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-teal-300/15 bg-teal-300/[.07] px-3.5 py-2 text-xs font-medium text-teal-200">
            <ShieldCheck size={14} /> Focus boundary active
          </div>

          <div className="mb-4 text-xs font-semibold uppercase tracking-[.24em] text-[#9AA8C0]">A deliberate pause</div>
          <h1 className="text-4xl font-semibold leading-[1.08] tracking-[-.04em] sm:text-6xl">
            Stay with what
            <span className="block text-[#BDAEFF]">matters most.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[#A5B1C5]">
            This destination is outside your focus boundaries. You can still research and search the web without opening restricted websites.
          </p>

          <form onSubmit={search} className="mx-auto mt-9 flex max-w-lg items-center gap-2 rounded-2xl border border-[#34425D] bg-[#0B1324] p-2 transition focus-within:border-[#A78BFA] focus-within:ring-2 focus-within:ring-violet-300/10">
            <Search className="ml-3 shrink-0 text-[#8291AA]" size={19} />
            <input
              aria-label="Search the web"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search the web without leaving your focus..."
              className="min-w-0 flex-1 bg-transparent px-1 py-3 text-sm text-white outline-none placeholder:text-[#71809A]"
            />
            <button type="submit" disabled={!query.trim()} className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#A78BFA] px-4 py-3 text-xs font-semibold text-[#171329] transition hover:bg-[#B9A6FF] disabled:cursor-not-allowed disabled:opacity-40">
              Search <ArrowUpRight size={14} />
            </button>
          </form>
          <p className="mt-3 text-[11px] leading-5 text-[#7F8DA5]">
            Search results are available. Opening a restricted result will still be blocked.
          </p>

          <div className="mx-auto mt-9 flex max-w-lg items-center gap-3 rounded-2xl border border-[#26334A] bg-[#172238]/70 p-4 text-left">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet-300/10 text-violet-200"><Sparkles size={18} /></div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-[#E6EAF3]">Your focus is still yours.</div>
              <div className="mt-1 text-xs leading-5 text-[#91A0B8]">Use your browser search or return to the task you chose.</div>
            </div>
          </div>

          <button onClick={() => history.back()} className="mt-8 inline-flex items-center gap-2 rounded-xl border border-[#3A4863] px-5 py-3 text-sm font-medium text-[#DCE3F0] transition hover:border-violet-300/50 hover:bg-white/[.04]">
            <ArrowLeft size={16} /> Return to work
          </button>
        </section>

        <footer className="mt-7 text-center text-[10px] font-medium tracking-[.22em] text-[#65738C]">STILLORA · PROTECT YOUR ATTENTION</footer>
      </div>
    </main>
  );
}
