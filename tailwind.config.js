import daisyui from "daisyui";
export default {
 content:["./index.html","./popup.html","./blocked.html","./src/**/*.{ts,tsx}"],
 theme:{extend:{
  colors:{stillora:{ink:"#101719",panel:"#172326",elevated:"#1E3033",teal:"#2DD4BF",mint:"#5EEAD4",muted:"#91A5A8"}},
  fontFamily:{sans:["Inter","ui-sans-serif","system-ui","sans-serif"]},
  boxShadow:{glow:"0 0 90px rgba(45,212,191,.12)"}
 }},
 daisyui:{themes:[{stillora:{
  "primary":"#2DD4BF","primary-content":"#071719","secondary":"#5EEAD4","secondary-content":"#0B1C1D",
  "accent":"#99F6E4","accent-content":"#102426","neutral":"#172326","neutral-content":"#E6F4F2",
  "base-100":"#101719","base-200":"#172326","base-300":"#1E3033","base-content":"#F0FAF8",
  "info":"#60A5FA","success":"#34D399","warning":"#FBBF24","error":"#FB7185"
 }}],darkTheme:"stillora"},
 plugins:[daisyui]
};