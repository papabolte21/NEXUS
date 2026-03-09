import { useState, useEffect, useRef, useCallback } from "react";
import {
  Home, Zap, GraduationCap, Briefcase, Brain, TrendingUp, Bot, BookOpen,
  CalendarDays, Sparkles, ClipboardList, X, Pencil, Trash2, Plus, Bell,
  ChevronLeft, ChevronRight, Check, FileText, CheckSquare, LayoutGrid,
  BarChart2, Diamond, Target, Search, ArrowRight, Flame, Wifi, Timer,
  Download, RefreshCw, Network
} from "lucide-react";

const SECTIONS = [
  { id:"home",       label:"Home",        emoji:"🏠", color:"#F59E0B" },
  { id:"health",     label:"Health",      emoji:"❤️",  color:"#10B981" },
  { id:"sidehustle", label:"Side Hustle", emoji:"⚡",  color:"#F59E0B" },
  { id:"college",    label:"College",     emoji:"🎓",  color:"#60A5FA" },
  { id:"career",     label:"Career",      emoji:"💼",  color:"#A78BFA" },
  { id:"thoughts",   label:"Thoughts",    emoji:"🧠",  color:"#F472B6" },
  { id:"finance",    label:"Finance",     emoji:"📈",  color:"#34D399" },
  { id:"ai",         label:"AI",          emoji:"🤖",  color:"#FB923C" },
  { id:"reading",    label:"Reading",     emoji:"📚",  color:"#E879F9" },
  { id:"network",    label:"Network",     emoji:"🌐",  color:"#38BDF8" },
  { id:"calendar",   label:"Calendar",    emoji:"📅",  color:"#818CF8" },
];

const SECTION_IDS = SECTIONS.map(function(s){ return s.id; });

const DEFAULT_HABITS = [
  { id:1, label:"Morning pages", streak:7,  done:false },
  { id:2, label:"Exercise",      streak:4,  done:false },
  { id:3, label:"Read 20 mins",  streak:12, done:false },
  { id:4, label:"Cold shower",   streak:2,  done:false },
];

const DEFAULT_TASKS = {
  health:     [
    { id:1, text:"Book dentist appointment",    deadline:"2026-03-10", done:false, priority:"high" },
    { id:2, text:"Try new workout routine",     deadline:"2026-03-08", done:false, priority:"medium" }
  ],
  sidehustle: [
    { id:1, text:"Finish client proposal",      deadline:"2026-03-07", done:false, priority:"high" },
    { id:2, text:"Post on LinkedIn",            deadline:"2026-03-06", done:true,  priority:"low" }
  ],
  college:    [
    { id:1, text:"Submit Data Structures",      deadline:"2026-03-09", done:false, priority:"high" },
    { id:2, text:"Group project meeting",       deadline:"2026-03-11", done:false, priority:"medium" }
  ],
  career:     [
    { id:1, text:"Update resume",               deadline:"2026-03-15", done:false, priority:"medium" },
    { id:2, text:"Apply to 3 internships",      deadline:"2026-03-12", done:false, priority:"high" }
  ],
  thoughts:   [],
  finance:    [
    { id:1, text:"Track monthly expenses",      deadline:"2026-03-31", done:false, priority:"medium" }
  ],
  ai:         [
    { id:1, text:"Explore Cursor IDE",          deadline:"2026-03-08", done:false, priority:"low" }
  ],
  reading:    [
    { id:1, text:"Finish Zero to One",          deadline:"2026-03-20", done:false, priority:"medium" }
  ],
  network:    [
    { id:1, text:"Follow up with mentor",       deadline:"2026-03-07", done:false, priority:"high" }
  ],
};

const DEFAULT_NOTES = {
  health:     "## Health Notes\n\n→ Sleep consistency (10pm target)\n→ Reduce caffeine after 2pm\n→ Weekly weigh-in every Monday",
  sidehustle: "## Side Hustle\n\n→ AI tools directory\n→ Notion templates for students\n→ SaaS agency (in progress!)\n\nMonthly revenue goal: 10,000",
  college:    "## Semester Notes\n\nGPA target: 8.5+\n\n→ Data Structures\n→ DBMS\n→ Operating Systems",
  career:     "## Career Roadmap\n\nTarget: Product/Tech role\nSkills: AI/ML, System Design\n\nSee also: [[Side Hustle]]",
  thoughts:   "## Thoughts\n\n> The goal is not to be busy. The goal is to be effective.\n\n→ What if productivity was measured by outcomes?",
  finance:    "## Finance\n\nMonthly budget: 15,000\nFixed costs: 8,000\nSavings goal: 20%",
  ai:         "## AI Experiments\n\n→ Claude API\n→ Bolt.new for prototyping\n→ Perplexity for research",
  reading:    "## Reading List\n\n→ Zero to One (current)\n→ The Lean Startup (done)\n→ Deep Work\n→ Atomic Habits",
  network:    "## Network Notes\n\nMentors: reach out monthly\nPeers: weekly accountability call",
};

const REVIEW_QUESTIONS = [
  { id:"wins",      q:"What were your biggest wins this week?",          placeholder:"e.g. Finished Nexus, hit gym 4x..." },
  { id:"struggles", q:"What did you struggle with?",                     placeholder:"e.g. Procrastinated on career research..." },
  { id:"learned",   q:"What is the most important thing you learned?",   placeholder:"e.g. Learned about Supabase..." },
  { id:"grateful",  q:"What are you grateful for this week?",            placeholder:"e.g. Good health, family..." },
  { id:"nextweek",  q:"Top 3 priorities for next week?",                 placeholder:"1.\n2.\n3." },
];

const THEMES = {
  linen:    { label:"Linen",    emoji:"📜", bg:"#F0EBE0", surf:"#E8E1D4", card:"#FDFAF4", cardLo:"#EDE7DA", inpt:"#E5DFD2", bdr:"#1A1714", bdrSm:"rgba(26,23,20,0.14)", bdrFine:"rgba(26,23,20,0.07)", txt:"#1A1714", txt2:"#52493C", txt3:"#96897A", brand:"#1E1B16", accent:"#8C5E28", ctaBg:"#D4A843", cta:"#8A6A1A", red:"#B82E1A", grn:"#22855A", blue:"#2E5BB8", shadowMd:"0 4px 14px rgba(26,23,20,0.08)", shadowXl:"0 24px 60px rgba(26,23,20,0.14)" },
  slate:    { label:"Slate",    emoji:"🌫️", bg:"#F0F2F5", surf:"#E6E9EE", card:"#FAFBFC", cardLo:"#EAEDF1", inpt:"#E0E4EA", bdr:"#1C2130", bdrSm:"rgba(28,33,48,0.15)", bdrFine:"rgba(28,33,48,0.07)", txt:"#1C2130", txt2:"#4A5568", txt3:"#8A93A6", brand:"#1C2130", accent:"#3B6DD4", ctaBg:"#A8C4FA", cta:"#1A4BB8", red:"#C53030", grn:"#2F855A", blue:"#3B6DD4", shadowMd:"0 4px 14px rgba(28,33,48,0.08)", shadowXl:"0 24px 60px rgba(28,33,48,0.14)" },
  midnight: { label:"Midnight", emoji:"🌙", bg:"#0F1117", surf:"#161A24", card:"#1C2135", cardLo:"#131720", inpt:"#1A1F2E", bdr:"#E2E8FF", bdrSm:"rgba(226,232,255,0.12)", bdrFine:"rgba(226,232,255,0.06)", txt:"#E8EDF8", txt2:"#9AA3B8", txt3:"#4E566A", brand:"#7C6EF8", accent:"#7C6EF8", ctaBg:"#7C6EF8", cta:"#E8EDF8", red:"#F56565", grn:"#48BB78", blue:"#63B3ED", shadowMd:"0 4px 14px rgba(0,0,0,0.4)", shadowXl:"0 24px 60px rgba(0,0,0,0.6)" },
  forest:   { label:"Forest",   emoji:"🌿", bg:"#EDF3EE", surf:"#E2EDE3", card:"#F6FAF6", cardLo:"#E6EFE7", inpt:"#DDE8DE", bdr:"#1A2E1C", bdrSm:"rgba(26,46,28,0.14)", bdrFine:"rgba(26,46,28,0.07)", txt:"#1A2E1C", txt2:"#3D5C40", txt3:"#7A9E7D", brand:"#1A2E1C", accent:"#3A7D44", ctaBg:"#7FD48A", cta:"#1A5C24", red:"#C0392B", grn:"#27AE60", blue:"#2980B9", shadowMd:"0 4px 14px rgba(26,46,28,0.08)", shadowXl:"0 24px 60px rgba(26,46,28,0.14)" },
  rose:     { label:"Rose",     emoji:"🌸", bg:"#FDF0F2", surf:"#F7E6E9", card:"#FFFAFA", cardLo:"#F5E6E9", inpt:"#EED9DD", bdr:"#3D1A22", bdrSm:"rgba(61,26,34,0.14)", bdrFine:"rgba(61,26,34,0.07)", txt:"#3D1A22", txt2:"#6B3B47", txt3:"#A8717C", brand:"#7A2535", accent:"#B5365A", ctaBg:"#F4A0B0", cta:"#7A2535", red:"#B5365A", grn:"#27AE60", blue:"#2980B9", shadowMd:"0 4px 14px rgba(61,26,34,0.08)", shadowXl:"0 24px 60px rgba(61,26,34,0.14)" },
  carbon:   { label:"Carbon",   emoji:"⚫", bg:"#181818", surf:"#1F1F1F", card:"#252525", cardLo:"#1A1A1A", inpt:"#222222", bdr:"#E0E0E0", bdrSm:"rgba(224,224,224,0.12)", bdrFine:"rgba(224,224,224,0.06)", txt:"#EFEFEF", txt2:"#9A9A9A", txt3:"#585858", brand:"#2C2C2C", accent:"#E0B030", ctaBg:"#E0B030", cta:"#1A1A1A", red:"#F05050", grn:"#50C878", blue:"#5099F0", shadowMd:"0 4px 14px rgba(0,0,0,0.6)", shadowXl:"0 24px 60px rgba(0,0,0,0.8)" },
};

let K = THEMES.linen;

const PRIORITY_COLORS = { high:"#EF4444", medium:"#F59E0B", low:"#9CA3AF" };

function getDeadlineInfo(ds) {
  var d = new Date(ds);
  var now = new Date();
  var diff = Math.ceil((d - now) / 86400000);
  if (diff < 0)   return { label: Math.abs(diff) + "d overdue", color:"#EF4444" };
  if (diff === 0) return { label:"Today",    color:"#F59E0B" };
  if (diff === 1) return { label:"Tomorrow", color:"#FB923C" };
  return { label: diff + "d left", color:"#6B7280" };
}

// ─────────────────────────────────────────────────────────────────────────────
// PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────

function RingProgress(props) {
  var pct    = props.pct;
  var color  = props.color;
  var size   = props.size  || 38;
  var stroke = props.stroke || 3.5;
  var r = (size - stroke) / 2;
  var circ = 2 * Math.PI * r;
  var filled = circ * (pct / 100);
  return (
    <svg width={size} height={size} style={{ transform:"rotate(-90deg)", flexShrink:0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={K.bdrSm} strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={filled + " " + (circ - filled)} strokeLinecap="round"/>
    </svg>
  );
}

function Card(props) {
  return (
    <div onClick={props.onClick}
      style={Object.assign({ background:K.card, borderRadius:"18px", border:"1.5px solid " + K.bdr,
        overflow:"hidden", boxShadow:K.shadowMd }, props.style || {})}>
      {props.children}
    </div>
  );
}

function Label(props) {
  return (
    <div style={Object.assign({ fontFamily:"'Inter',sans-serif", fontSize:"10px", fontWeight:600,
      letterSpacing:"0.08em", color:K.txt2, textTransform:"uppercase" }, props.style || {})}>
      {props.children}
    </div>
  );
}

function Btn(props) {
  var variant = props.variant || "dark";
  var base = {
    cursor: props.disabled ? "not-allowed" : "pointer",
    fontFamily:"'Inter',sans-serif", fontWeight:600, borderRadius:"100px",
    display:"inline-flex", alignItems:"center", gap:"6px", whiteSpace:"nowrap",
    transition:"all 0.12s", border:"none",
    opacity: props.disabled ? 0.5 : 1,
  };
  var s;
  if (variant === "lime")    s = Object.assign({}, base, { background:K.ctaBg, color:K.cta, padding:"9px 22px", fontSize:"12px" });
  else if (variant === "ghost")   s = Object.assign({}, base, { background:"transparent", color:K.txt2, padding:"8px 18px", fontSize:"12px", border:"1.5px solid " + K.bdr });
  else if (variant === "ghostSm") s = Object.assign({}, base, { background:"transparent", color:K.txt2, padding:"5px 13px", fontSize:"10px", border:"1.5px solid " + K.bdrSm });
  else if (variant === "sm")      s = Object.assign({}, base, { background:K.brand, color:K.bg, padding:"5px 14px", fontSize:"10px" });
  else s = Object.assign({}, base, { background:K.brand, color:K.bg, padding:"9px 22px", fontSize:"12px" });
  s = Object.assign({}, s, props.style || {});
  return (
    <button onClick={props.onClick} disabled={props.disabled} style={s}>
      {props.children}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// POMODORO
// ─────────────────────────────────────────────────────────────────────────────

function PomodoroTimer(props) {
  var onComplete = props.onComplete;
  var [mins, setMins] = useState(25);
  var [secs, setSecs] = useState(0);
  var [running, setRunning] = useState(false);
  var [done, setDone] = useState(false);
  var total = 25 * 60;
  var elapsed = total - (mins * 60 + secs);
  var pct = Math.round((elapsed / total) * 100);

  useEffect(function() {
    if (!running) return;
    var id = setInterval(function() {
      setSecs(function(s) {
        if (s > 0) return s - 1;
        setMins(function(m) {
          if (m > 0) return m - 1;
          setRunning(false);
          setDone(true);
          if (onComplete) onComplete();
          return 0;
        });
        return 59;
      });
    }, 1000);
    return function() { clearInterval(id); };
  }, [running]);

  function reset() { setMins(25); setSecs(0); setRunning(false); setDone(false); }
  function pad(n) { return String(n).padStart(2, "0"); }

  return (
    <div style={{ display:"flex", alignItems:"center", gap:"8px", background:K.cardLo,
      border:"1px solid " + K.bdrSm, borderRadius:"10px", padding:"6px 10px" }}>
      <RingProgress pct={pct} color={done ? K.grn : K.accent} size={28} stroke={3}/>
      <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"12px", fontWeight:600,
        color: done ? K.grn : K.txt, minWidth:"42px" }}>
        {done ? "Done!" : pad(mins) + ":" + pad(secs)}
      </span>
      {!done && (
        <button onClick={function(){ setRunning(function(v){ return !v; }); }}
          style={{ background: running ? K.red : K.accent, border:"none", color:K.bg,
            borderRadius:"6px", padding:"3px 8px", fontSize:"10px", fontWeight:600, cursor:"pointer" }}>
          {running ? "Pause" : "Start"}
        </button>
      )}
      <button onClick={reset} style={{ background:"transparent", border:"none", color:K.txt3,
        cursor:"pointer", padding:"2px", display:"flex" }}>
        <RefreshCw size={10} strokeWidth={2}/>
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MIND MAP  (NotebookLM-style: hierarchical tree, zoom/pan, collapse/expand,
//            inline edit, hover-add-child, right-click menu, search highlight)
// ─────────────────────────────────────────────────────────────────────────────

var MM_NW = 152, MM_NH = 34, MM_LGAP = 196, MM_VGAP = 10;

function mmMk(id, label, color, children) {
  return { id:id, label:label, color:color, children: children || [], collapsed:false };
}

function mmClone(t) { return JSON.parse(JSON.stringify(t)); }

function mmFind(node, id) {
  if (node.id === id) return node;
  for (var i = 0; i < node.children.length; i++) {
    var f = mmFind(node.children[i], id);
    if (f) return f;
  }
  return null;
}

function mmSubH(node) {
  if (node.collapsed || !node.children.length) return MM_NH + MM_VGAP;
  var sum = 0;
  for (var i = 0; i < node.children.length; i++) sum += mmSubH(node.children[i]);
  return Math.max(MM_NH + MM_VGAP, sum);
}

function mmLayout(node, depth, yStart) {
  node.x = depth * MM_LGAP + 24;
  if (node.collapsed || !node.children.length) {
    node.y = yStart + MM_NH / 2;
    return;
  }
  var y = yStart;
  for (var i = 0; i < node.children.length; i++) {
    mmLayout(node.children[i], depth + 1, y);
    y += mmSubH(node.children[i]);
  }
  node.y = (node.children[0].y + node.children[node.children.length - 1].y) / 2;
}

function mmFlatten(node, acc) {
  if (!acc) acc = [];
  acc.push(node);
  if (!node.collapsed) {
    for (var i = 0; i < node.children.length; i++) mmFlatten(node.children[i], acc);
  }
  return acc;
}

function mmEdges(node, acc) {
  if (!acc) acc = [];
  if (!node.collapsed) {
    for (var i = 0; i < node.children.length; i++) {
      acc.push({ from:node, to:node.children[i] });
      mmEdges(node.children[i], acc);
    }
  }
  return acc;
}

function mmBuildTree(sectionId, tasks, notes) {
  var sec   = SECTIONS.find(function(s){ return s.id === sectionId; });
  var color = sec ? sec.color : "#888";
  var label = sec ? sec.label : sectionId;
  var list  = tasks[sectionId] || [];
  var high  = list.filter(function(t){ return !t.done && t.priority === "high"; });
  var med   = list.filter(function(t){ return !t.done && t.priority === "medium"; });
  var low   = list.filter(function(t){ return !t.done && t.priority === "low"; });
  var done  = list.filter(function(t){ return t.done; }).slice(0, 5);
  var noteText = notes[sectionId] || "";
  var noteLines = noteText.split("\n")
    .filter(function(l){ return /^[→\-•]/.test(l); })
    .map(function(l){ return l.replace(/^[→\-•]\s*/, "").slice(0, 36); });
  var headLines = noteText.split("\n")
    .filter(function(l){ return l.indexOf("##") === 0; })
    .map(function(l){ return l.replace(/^#+\s*/, "").slice(0, 36); });

  var taskKids = [];
  if (high.length) taskKids.push(mmMk("g-high", "🔴 High Priority", "#EF4444",
    high.map(function(t, i){ return mmMk("th"+i, t.text.slice(0,34), "#EF4444"); })));
  if (med.length)  taskKids.push(mmMk("g-med",  "🟡 Medium Priority","#F59E0B",
    med.map(function(t, i){ return mmMk("tm"+i, t.text.slice(0,34), "#F59E0B"); })));
  if (low.length)  taskKids.push(mmMk("g-low",  "⚪ Low Priority",   "#6B7280",
    low.map(function(t, i){ return mmMk("tl"+i, t.text.slice(0,34), "#6B7280"); })));
  if (done.length) taskKids.push(mmMk("g-done", "✅ Completed",      "#10B981",
    done.map(function(t, i){ return mmMk("td"+i, t.text.slice(0,34), "#10B981"); })));

  var rootKids = [];
  if (taskKids.length) rootKids.push(mmMk("tasks", "📋 Tasks", color, taskKids));
  if (noteLines.length) rootKids.push(mmMk("notes", "💡 Key Points", color,
    noteLines.slice(0, 8).map(function(l, i){ return mmMk("nl"+i, l, "#A78BFA"); })));
  if (headLines.length) rootKids.push(mmMk("heads", "📌 Topics", color,
    headLines.map(function(l, i){ return mmMk("hl"+i, l, "#38BDF8"); })));

  return mmMk("root", label, color, rootKids);
}

function MindMap(props) {
  var sectionId   = props.sectionId;
  var tasks       = props.tasks;
  var notes       = props.notes;
  var accentColor = props.accentColor;

  var svgRef  = useRef(null);
  var panRef  = useRef(null);

  var [tree,    setTree]    = useState(null);
  var [zoom,    setZoom]    = useState(0.88);
  var [pan,     setPan]     = useState({ x:28, y:36 });
  var [editId,  setEditId]  = useState(null);
  var [editVal, setEditVal] = useState("");
  var [ctxMenu, setCtxMenu] = useState(null);
  var [search,  setSearch]  = useState("");
  var [hoverId, setHoverId] = useState(null);
  var [isPanning, setIsPanning] = useState(false);

  // Build/reset tree when section changes
  useEffect(function() {
    setTree(mmBuildTree(sectionId, tasks, notes));
    setZoom(0.88);
    setPan({ x:28, y:36 });
    setSearch("");
    setEditId(null);
    setCtxMenu(null);
  }, [sectionId]);

  // Compute laid-out version
  var laid = null;
  if (tree) {
    laid = mmClone(tree);
    mmLayout(laid, 0, 0);
  }
  var allNodes = laid ? mmFlatten(laid) : [];
  var allEdges = laid ? mmEdges(laid) : [];

  // Search matching
  var matchIds = null;
  if (search.trim()) {
    var sq = search.toLowerCase();
    matchIds = {};
    for (var ni = 0; ni < allNodes.length; ni++) {
      if (allNodes[ni].label.toLowerCase().indexOf(sq) !== -1) {
        matchIds[allNodes[ni].id] = true;
      }
    }
  }

  // Zoom via scroll wheel
  function onWheel(e) {
    e.preventDefault();
    setZoom(function(z) {
      var next = e.deltaY < 0 ? z * 1.09 : z * 0.92;
      return Math.min(2.2, Math.max(0.22, next));
    });
  }

  // Pan handlers
  function onBgDown(e) {
    if (e.button !== 0) return;
    panRef.current = { sx: e.clientX - pan.x, sy: e.clientY - pan.y };
    setIsPanning(true);
  }
  function onBgMove(e) {
    if (!panRef.current) return;
    setPan({ x: e.clientX - panRef.current.sx, y: e.clientY - panRef.current.sy });
  }
  function onBgUp() { panRef.current = null; setIsPanning(false); }

  // Tree mutations
  function mutate(fn) {
    setTree(function(prev) {
      var t = mmClone(prev);
      fn(t);
      return t;
    });
  }

  function toggleCollapse(id) {
    mutate(function(t) {
      var n = mmFind(t, id);
      if (n) n.collapsed = !n.collapsed;
    });
  }

  function deleteNode(id) {
    mutate(function(t) {
      function rem(node) {
        node.children = node.children.filter(function(c){ return c.id !== id; });
        node.children.forEach(rem);
      }
      rem(t);
    });
  }

  function addChild(parentId) {
    var newId = "cust-" + Date.now();
    mutate(function(t) {
      var n = mmFind(t, parentId);
      if (n) {
        n.children.push(mmMk(newId, "New idea", accentColor));
        n.collapsed = false;
      }
    });
    setTimeout(function() { setEditId(newId); setEditVal("New idea"); }, 60);
  }

  function startEdit(id, lbl) { setEditId(id); setEditVal(lbl); }

  function commitEdit() {
    if (!editId) return;
    var eid = editId, val = editVal;
    mutate(function(t) {
      var n = mmFind(t, eid);
      if (n && val.trim()) n.label = val.trim();
    });
    setEditId(null);
  }

  // Bezier: right-edge of parent → left-edge of child
  function bezier(f, t) {
    var x1 = f.x + MM_NW, y1 = f.y;
    var x2 = t.x,         y2 = t.y;
    var cx  = (x1 + x2) / 2;
    return "M" + x1 + "," + y1 + " C" + cx + "," + y1 + " " + cx + "," + y2 + " " + x2 + "," + y2;
  }

  var zoomPct = Math.round(zoom * 100);
  var isGroupId = { tasks:1, notes:1, heads:1, "g-high":1, "g-med":1, "g-low":1, "g-done":1 };

  var tbtnBase = {
    border:"1px solid " + K.bdrSm, borderRadius:"5px", cursor:"pointer",
    padding:"4px 9px", fontSize:"10px", fontFamily:"'Inter',sans-serif", fontWeight:700,
    background:K.cardLo, color:K.txt2
  };

  return (
    <div style={{ background:K.cardLo, border:"1.5px solid " + K.bdrSm, borderRadius:"16px", overflow:"hidden", userSelect:"none" }}>

      {/* ── Toolbar ── */}
      <div style={{ padding:"10px 14px", borderBottom:"1.5px solid " + K.bdrSm,
        display:"flex", alignItems:"center", gap:"8px", flexWrap:"wrap", background:K.surf }}>

        <span style={{ fontFamily:"'Inter',sans-serif", fontSize:"11px", fontWeight:700,
          color:K.txt3, marginRight:"4px" }}>🧠 MIND MAP</span>

        {/* Search */}
        <div style={{ position:"relative", flex:1, maxWidth:"200px" }}>
          <input value={search} onChange={function(e){ setSearch(e.target.value); }}
            placeholder="Search nodes…"
            style={{ width:"100%", background:K.card, border:"1px solid " + K.bdrSm,
              color:K.txt, padding:"4px 26px 4px 26px", borderRadius:"6px",
              fontFamily:"'JetBrains Mono',monospace", fontSize:"10px", outline:"none", boxSizing:"border-box" }}/>
          <span style={{ position:"absolute", left:"8px", top:"5px", fontSize:"11px", color:K.txt3 }}>⌕</span>
          {search && (
            <span onClick={function(){ setSearch(""); }}
              style={{ position:"absolute", right:"7px", top:"4px", fontSize:"11px", color:K.txt3, cursor:"pointer" }}>✕</span>
          )}
        </div>

        {/* Zoom & controls */}
        <div style={{ display:"flex", gap:"4px", marginLeft:"auto" }}>
          <button onClick={function(){ setZoom(function(z){ return Math.min(2.2, z+0.14); }); }} style={tbtnBase}>＋</button>
          <button onClick={function(){ setZoom(function(z){ return Math.max(0.22, z-0.14); }); }} style={tbtnBase}>－</button>
          <button onClick={function(){ setZoom(1); }}
            style={Object.assign({}, tbtnBase, { color:K.accent, borderColor:K.accent+"55" })}>
            {zoomPct}%
          </button>
          <button onClick={function(){ setZoom(0.88); setPan({ x:28, y:36 }); }} style={tbtnBase}>⊕ Fit</button>
          <button onClick={function(){ setTree(mmBuildTree(sectionId, tasks, notes)); }}
            style={Object.assign({}, tbtnBase, { color:accentColor, borderColor:accentColor+"66", background:accentColor+"11" })}>
            ↺ Refresh
          </button>
        </div>
      </div>

      {/* ── Canvas ── */}
      <div style={{ position:"relative", height:"500px", overflow:"hidden",
        cursor: isPanning ? "grabbing" : "grab" }}
        onMouseDown={onBgDown}
        onMouseMove={onBgMove}
        onMouseUp={onBgUp}
        onMouseLeave={onBgUp}
        onWheel={onWheel}
        onClick={function(){ setCtxMenu(null); }}>

        <svg width="100%" height="100%" style={{ display:"block" }}>
          <defs>
            <filter id="mmglow">
              <feGaussianBlur stdDeviation="3" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="mmglow2">
              <feGaussianBlur stdDeviation="1.5" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          <g transform={"translate(" + pan.x + "," + pan.y + ") scale(" + zoom + ")"}>

            {/* Edges */}
            {allEdges.map(function(e, i) {
              var dimmed = matchIds && !matchIds[e.to.id];
              var highlighted = matchIds && matchIds[e.to.id];
              return (
                <path key={i} d={bezier(e.from, e.to)}
                  stroke={dimmed ? K.bdrSm : e.to.color + "66"}
                  strokeWidth={highlighted ? 2 : 1.5}
                  fill="none" strokeLinecap="round"/>
              );
            })}

            {/* Nodes */}
            {allNodes.map(function(n) {
              var isRoot  = n.id === "root";
              var isGroup = !!isGroupId[n.id];
              var hasKids = n.children.length > 0;
              var isMatch = matchIds ? !!matchIds[n.id] : false;
              var isDim   = matchIds && !isMatch;
              var isHov   = hoverId === n.id;
              var isEd    = editId === n.id;
              var lbl     = n.label.length > 20 ? n.label.slice(0, 20) + "…" : n.label;
              var nH      = isRoot ? 40 : MM_NH;
              var nW      = isRoot ? 134 : MM_NW;

              return (
                <g key={n.id}
                  transform={"translate(" + n.x + "," + (n.y - nH/2) + ")"}
                  onMouseEnter={function(){ setHoverId(n.id); }}
                  onMouseLeave={function(){ setHoverId(null); }}
                  onDoubleClick={function(e){ e.stopPropagation(); startEdit(n.id, n.label); }}
                  onContextMenu={function(e){ e.preventDefault(); e.stopPropagation(); setCtxMenu({ id:n.id, x:e.clientX, y:e.clientY }); }}
                  style={{ cursor:"pointer", opacity: isDim ? 0.18 : 1, transition:"opacity 0.2s" }}>

                  {/* Background rect */}
                  <rect x={0} y={0} width={nW} height={nH}
                    rx={isRoot ? 14 : isGroup ? 9 : 7}
                    fill={isRoot ? n.color+"26" : isGroup ? n.color+"16" : K.card}
                    stroke={isMatch ? n.color : isHov ? n.color+"BB" : n.color + (isRoot?"CC":isGroup?"88":"44")}
                    strokeWidth={isRoot ? 2 : isMatch ? 1.5 : 1}
                    filter={isRoot ? "url(#mmglow)" : isMatch ? "url(#mmglow2)" : "none"}/>

                  {/* Inline edit */}
                  {isEd ? (
                    <foreignObject x={5} y={5} width={nW-10} height={nH-10}>
                      <input value={editVal}
                        onChange={function(e){ setEditVal(e.target.value); }}
                        onBlur={commitEdit}
                        onKeyDown={function(e){
                          if (e.key === "Enter") commitEdit();
                          if (e.key === "Escape") setEditId(null);
                        }}
                        autoFocus
                        onClick={function(e){ e.stopPropagation(); }}
                        style={{ width:"100%", background:"transparent", border:"none",
                          color:n.color, fontFamily:"'JetBrains Mono',monospace",
                          fontSize: isRoot?"12px":"10px", outline:"none",
                          fontWeight: isRoot ? 700 : 500 }}/>
                    </foreignObject>
                  ) : (
                    <text x={nW/2} y={nH/2+1} textAnchor="middle" dominantBaseline="middle"
                      fill={isRoot ? n.color : isGroup ? n.color : isMatch ? K.txt : K.txt2}
                      fontSize={isRoot ? 13 : isGroup ? 11 : 10}
                      fontFamily="'Inter',sans-serif"
                      fontWeight={isRoot || isGroup ? 700 : 400}>
                      {lbl}
                    </text>
                  )}

                  {/* Collapse/expand toggle */}
                  {hasKids && (
                    <g transform={"translate(" + (nW-15) + "," + (nH/2-7) + ")"}
                      onClick={function(e){ e.stopPropagation(); toggleCollapse(n.id); }}>
                      <rect width={14} height={14} rx={4}
                        fill={n.color+"22"} stroke={n.color+"66"} strokeWidth={0.5}/>
                      <text x={7} y={8} textAnchor="middle" dominantBaseline="middle"
                        fill={n.color} fontSize={9}
                        fontFamily="'Inter',sans-serif" fontWeight={700}>
                        {n.collapsed ? "+" : "−"}
                      </text>
                    </g>
                  )}

                  {/* Hover: add-child button */}
                  {isHov && !isRoot && (
                    <g transform={"translate(" + (nW+5) + "," + (nH/2-9) + ")"}
                      onClick={function(e){ e.stopPropagation(); addChild(n.id); }}>
                      <rect width={18} height={18} rx={5}
                        fill={accentColor+"22"} stroke={accentColor+"77"} strokeWidth={1}/>
                      <text x={9} y={10} textAnchor="middle" dominantBaseline="middle"
                        fill={accentColor} fontSize={13}
                        fontFamily="'Inter',sans-serif" fontWeight={700}>+</text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Context menu */}
        {ctxMenu && (
          <div style={{ position:"fixed", left:ctxMenu.x, top:ctxMenu.y,
            background:K.surf, border:"1px solid " + K.bdrSm, borderRadius:"10px",
            padding:"5px", zIndex:999, minWidth:"158px",
            boxShadow:"0 14px 36px rgba(0,0,0,0.35)" }}
            onClick={function(e){ e.stopPropagation(); }}>
            {[
              { icon:"✏️", label:"Edit label",
                fn:function(){ var n = mmFind(tree, ctxMenu.id); if(n) startEdit(n.id, n.label); setCtxMenu(null); } },
              { icon:"＋", label:"Add child node",
                fn:function(){ addChild(ctxMenu.id); setCtxMenu(null); } },
              { icon: (function(){ var n=tree&&mmFind(tree,ctxMenu.id); return n&&n.collapsed?"▶":"▼"; })(),
                label: (function(){ var n=tree&&mmFind(tree,ctxMenu.id); return n&&n.collapsed?"Expand":"Collapse"; })(),
                fn:function(){ toggleCollapse(ctxMenu.id); setCtxMenu(null); },
                hide: !(tree && mmFind(tree,ctxMenu.id) && mmFind(tree,ctxMenu.id).children.length) },
              { icon:"🗑", label:"Delete", danger:true,
                fn:function(){ deleteNode(ctxMenu.id); setCtxMenu(null); },
                hide: ctxMenu.id === "root" }
            ].filter(function(item){ return !item.hide; }).map(function(item, i) {
              return (
                <div key={i} onClick={item.fn}
                  style={{ display:"flex", alignItems:"center", gap:"9px",
                    padding:"7px 12px", borderRadius:"7px", cursor:"pointer",
                    fontSize:"12px", color: item.danger ? K.red : K.txt,
                    fontFamily:"'Inter',sans-serif" }}
                  onMouseEnter={function(e){ e.currentTarget.style.background = K.card; }}
                  onMouseLeave={function(e){ e.currentTarget.style.background = "transparent"; }}>
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom-left hints */}
        <div style={{ position:"absolute", bottom:"8px", left:"12px",
          display:"flex", gap:"10px", fontSize:"9px", color:K.txt3,
          fontFamily:"'JetBrains Mono',monospace", pointerEvents:"none" }}>
          <span>scroll=zoom</span>
          <span>drag=pan</span>
          <span>right-click=options</span>
          <span>dbl-click=edit</span>
        </div>

        {/* Bottom-right: zoom + count */}
        <div style={{ position:"absolute", bottom:"8px", right:"12px",
          fontSize:"9px", color:K.txt3,
          fontFamily:"'JetBrains Mono',monospace", pointerEvents:"none" }}>
          {zoomPct}% · {allNodes.length} nodes
        </div>
      </div>

      {/* Legend */}
      <div style={{ padding:"7px 14px 9px", borderTop:"1.5px solid " + K.bdrSm,
        display:"flex", gap:"14px", flexWrap:"wrap",
        fontSize:"9px", color:K.txt3, background:K.surf }}>
        <span><span style={{ color:"#EF4444" }}>●</span> High</span>
        <span><span style={{ color:"#F59E0B" }}>●</span> Medium</span>
        <span><span style={{ color:"#6B7280" }}>●</span> Low</span>
        <span><span style={{ color:"#A78BFA" }}>●</span> Key points</span>
        <span><span style={{ color:"#38BDF8" }}>●</span> Topics</span>
        <span><span style={{ color:"#10B981" }}>●</span> Done</span>
        <span style={{ marginLeft:"auto", color:K.txt3 }}>hover node → [+] add child</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AI ASSISTANT
// ─────────────────────────────────────────────────────────────────────────────

function AIAssistant(props) {
  var open    = props.open;
  var onClose = props.onClose;
  var tasks   = props.tasks;
  var habits  = props.habits;

  var [messages, setMessages] = useState([{
    role:"assistant",
    content:"Hey! I'm your Nexus AI with full life context and live web search.\n\nTry:\n• Weather in Lucknow right now?\n• Latest AI tools this week\n• What are my overdue tasks?\n• Advice on growing my side hustle"
  }]);
  var [input, setInput]             = useState("");
  var [loading, setLoading]         = useState(false);
  var [searchStatus, setSearchStatus] = useState("");
  var bottomRef = useRef(null);

  useEffect(function() {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior:"smooth" });
  }, [messages]);

  function buildSystem() {
    var tLines = Object.entries(tasks).map(function(entry) {
      var sec = entry[0], list = entry[1];
      var pending = list.filter(function(t){ return !t.done; });
      var overdue = pending.filter(function(t){ return new Date(t.deadline) < new Date(); });
      var line = sec.toUpperCase() + ": " + pending.length + " pending";
      if (overdue.length) line += " — " + overdue.length + " OVERDUE: " + overdue.map(function(t){ return t.text; }).join(", ");
      return line;
    }).join("\n");
    var hLines = habits.map(function(h){ return h.label + ": " + h.streak + "d streak, " + (h.done ? "done" : "not done"); }).join("\n");
    return "You are the AI inside NEXUS. TODAY: " + new Date().toLocaleDateString("en-IN", { weekday:"long", year:"numeric", month:"long", day:"numeric" }) + "\n\nTASKS:\n" + tLines + "\n\nHABITS:\n" + hLines + "\n\nFor weather, news, prices — ALWAYS use web_search first. Never guess real-time data.";
  }

  async function send() {
    if (!input.trim() || loading) return;
    var userMsg = { role:"user", content:input };
    var history = messages.concat([userMsg]);
    setMessages(history);
    setInput("");
    setLoading(true);
    setSearchStatus("");
    try {
      var apiMsgs = history
        .filter(function(m){ return m.role === "user" || m.role === "assistant"; })
        .map(function(m){ return { role:m.role, content:m.content }; });
      var finalText = "";
      for (var turn = 0; turn < 8; turn++) {
        var res = await fetch("https://api.anthropic.com/v1/messages", {
          method:"POST",
          headers:{ "Content-Type":"application/json" },
          body: JSON.stringify({
            model:"claude-sonnet-4-20250514",
            max_tokens:2000,
            system: buildSystem(),
            tools:[{ type:"web_search_20250305", name:"web_search" }],
            messages: apiMsgs
          })
        });
        var data = await res.json();
        if (data.error) throw new Error(data.error.message || "API error");
        var blocks = data.content || [];
        blocks.filter(function(b){ return b.type === "text"; }).forEach(function(b){ finalText += b.text; });
        var toolUses = blocks.filter(function(b){ return b.type === "tool_use"; });
        if (data.stop_reason === "end_turn" || toolUses.length === 0) break;
        setSearchStatus("Searching: \"" + toolUses.map(function(tu){ return (tu.input && tu.input.query) || "..."; }).join(", ") + "\"");
        apiMsgs = apiMsgs.concat([{ role:"assistant", content:blocks }]);
        apiMsgs = apiMsgs.concat([{ role:"user", content: toolUses.map(function(tu){
          return { type:"tool_result", tool_use_id:tu.id, content:[{ type:"text", text:"Search completed." }] };
        })}]);
      }
      setSearchStatus("");
      setMessages(function(p){ return p.concat([{ role:"assistant", content: finalText.trim() || "No response." }]); });
    } catch(e) {
      setSearchStatus("");
      setMessages(function(p){ return p.concat([{ role:"assistant", content:"Error: " + (e.message || "Failed.") }]); });
    }
    setLoading(false);
  }

  if (!open) return null;
  return (
    <div style={{ position:"fixed", right:0, top:0, bottom:0, width:"370px", background:K.card,
      borderLeft:"2px solid " + K.bdr, display:"flex", flexDirection:"column", zIndex:100,
      boxShadow:"-12px 0 48px rgba(0,0,0,0.18)" }}>
      <div style={{ padding:"16px 18px", borderBottom:"1.5px solid " + K.bdrSm,
        display:"flex", alignItems:"center", justifyContent:"space-between", background:K.surf, flexShrink:0 }}>
        <div>
          <div style={{ fontFamily:"'Instrument Serif',serif", fontSize:"17px", fontStyle:"italic",
            color:K.txt, display:"flex", alignItems:"center", gap:"6px" }}>
            <Sparkles size={14} color={K.accent}/> Nexus AI
          </div>
          <div style={{ fontSize:"11px", color:K.txt3, marginTop:"2px" }}>Full context · Web search live</div>
        </div>
        <button onClick={onClose} style={{ background:K.cardLo, border:"1.5px solid " + K.bdrSm,
          color:K.txt2, cursor:"pointer", width:"30px", height:"30px", borderRadius:"8px",
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          <X size={14}/>
        </button>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"14px", display:"flex", flexDirection:"column", gap:"10px" }}>
        {messages.map(function(m, i) {
          return (
            <div key={i} style={{ display:"flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
              <div style={{ maxWidth:"88%", padding:"10px 14px",
                borderRadius: m.role === "user" ? "14px 14px 3px 14px" : "14px 14px 14px 3px",
                background: m.role === "user" ? K.brand : K.cardLo,
                fontSize:"12px", color: m.role === "user" ? K.bg : K.txt,
                lineHeight:"1.7", whiteSpace:"pre-wrap" }}>
                {m.content}
              </div>
            </div>
          );
        })}
        {loading && (
          <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
            {searchStatus && (
              <div style={{ padding:"8px 12px", borderRadius:"10px",
                background: K.accent + "14", fontSize:"11px", color:K.accent }}>
                🔍 {searchStatus}
              </div>
            )}
            <div style={{ display:"flex" }}>
              <div style={{ padding:"10px 14px", borderRadius:"14px", background:K.cardLo,
                display:"flex", gap:"5px", alignItems:"center" }}>
                {[0,1,2].map(function(i){
                  return (
                    <div key={i} style={{ width:"6px", height:"6px", borderRadius:"50%",
                      background:K.accent, animation:"dot 1.2s " + (i*0.2) + "s infinite ease-in-out" }}/>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>
      <div style={{ padding:"12px 14px", borderTop:"1.5px solid " + K.bdrSm,
        display:"flex", gap:"8px", background:K.cardLo, flexShrink:0 }}>
        <input value={input}
          onChange={function(e){ setInput(e.target.value); }}
          onKeyDown={function(e){ if (e.key === "Enter") send(); }}
          placeholder="Ask anything..."
          style={{ flex:1, background:K.inpt, border:"1.5px solid " + K.bdrSm,
            color:K.txt, padding:"10px 14px", borderRadius:"12px",
            fontFamily:"'Inter',sans-serif", fontSize:"13px", outline:"none" }}/>
        <button onClick={send} disabled={loading}
          style={{ background:K.brand, border:"none", color:K.bg, padding:"10px 16px",
            borderRadius:"12px", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.5 : 1 }}>
          <ArrowRight size={14} strokeWidth={2.5}/>
        </button>
      </div>
      <style>{"@keyframes dot{0%,100%{opacity:0.3;transform:scale(0.7)}50%{opacity:1;transform:scale(1)}}"}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WEEKLY REVIEW
// ─────────────────────────────────────────────────────────────────────────────

function WeeklyReview(props) {
  var open    = props.open;
  var onClose = props.onClose;
  var tasks   = props.tasks;
  var habits  = props.habits;

  var [step,       setStep]       = useState(0);
  var [answers,    setAnswers]    = useState({});
  var [done,       setDone]       = useState(false);
  var [summary,    setSummary]    = useState("");
  var [generating, setGenerating] = useState(false);

  if (!open) return null;

  var allTasks = Object.values(tasks).reduce(function(a, l){ return a.concat(l); }, []);
  var doneTasks = allTasks.filter(function(t){ return t.done; }).length;
  var overdue   = allTasks.filter(function(t){ return !t.done && new Date(t.deadline) < new Date(); }).length;
  var habitPct  = habits.length > 0 ? Math.round((habits.filter(function(h){ return h.done; }).length / habits.length) * 100) : 0;

  function reset() { setStep(0); setAnswers({}); setDone(false); setSummary(""); }

  async function generate() {
    setDone(true);
    setGenerating(true);
    try {
      var qa = REVIEW_QUESTIONS.map(function(q){
        return "Q: " + q.q + "\nA: " + (answers[q.id] || "(skipped)");
      }).join("\n\n");
      var res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          messages:[{ role:"user", content:"Weekly review. Stats: " + doneTasks + " tasks done, " + overdue + " overdue, " + habitPct + "% habits.\n\n" + qa + "\n\nWrite a warm, sharp 3-paragraph summary. Celebrate wins, note struggles, 2-3 action points. Under 200 words." }]
        })
      });
      var data = await res.json();
      setSummary((data.content && data.content[0] && data.content[0].text) || "Could not generate.");
    } catch(e) { setSummary("Error: " + e.message); }
    setGenerating(false);
  }

  var q = REVIEW_QUESTIONS[step];

  return (
    <div style={{ position:"fixed", inset:0, zIndex:150, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div onClick={function(){ reset(); onClose(); }}
        style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.5)", backdropFilter:"blur(4px)" }}/>
      <div style={{ position:"relative", zIndex:151, width:"100%", maxWidth: window.innerWidth < 700 ? "calc(100% - 24px)" : "540px", margin:"0 12px",
        background:K.card, border:"2px solid " + K.bdr, borderRadius:"24px",
        display:"flex", flexDirection:"column", maxHeight:"85vh", overflow:"hidden", boxShadow:K.shadowXl }}>
        <div style={{ padding:"16px 22px", borderBottom:"1.5px solid " + K.bdrSm,
          display:"flex", alignItems:"center", justifyContent:"space-between",
          background:K.surf, flexShrink:0 }}>
          <div style={{ fontFamily:"'Instrument Serif',serif", fontSize:"20px", fontStyle:"italic", color:K.txt }}>
            Weekly Review
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
            <div style={{ display:"flex", gap:"4px" }}>
              {REVIEW_QUESTIONS.map(function(_, i){
                return (
                  <div key={i} style={{ width:"7px", height:"7px", borderRadius:"50%",
                    background: i <= step || done ? K.accent : K.bdrSm }}/>
                );
              })}
            </div>
            <button onClick={function(){ reset(); onClose(); }}
              style={{ background:K.cardLo, border:"1.5px solid " + K.bdrSm, color:K.txt2,
                cursor:"pointer", width:"30px", height:"30px", borderRadius:"8px",
                display:"flex", alignItems:"center", justifyContent:"center" }}>
              <X size={14}/>
            </button>
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"8px",
          padding:"14px 22px 0", flexShrink:0 }}>
          {[
            { v:doneTasks,      l:"Tasks Done",  c:K.grn },
            { v:habitPct + "%", l:"Habit Rate",  c:K.accent },
            { v:overdue,        l:"Overdue",      c: overdue > 0 ? K.red : K.grn }
          ].map(function(s){
            return (
              <div key={s.l} style={{ background:K.cardLo, border:"1px solid " + K.bdrSm,
                borderRadius:"12px", padding:"10px 12px" }}>
                <div style={{ fontFamily:"'Instrument Serif',serif", fontStyle:"italic",
                  fontSize:"20px", color:s.c, lineHeight:1 }}>{s.v}</div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"8px",
                  color:K.txt3, marginTop:"4px", letterSpacing:"0.08em", textTransform:"uppercase" }}>
                  {s.l}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"20px 22px" }}>
          {done ? (
            <div>
              <div style={{ fontSize:"13px", fontWeight:700, color:K.accent, marginBottom:"12px" }}>
                Your AI Summary
              </div>
              {generating
                ? <div style={{ color:K.txt3, fontSize:"13px" }}>Generating...</div>
                : <div style={{ fontSize:"13px", color:K.txt, lineHeight:"1.8", whiteSpace:"pre-wrap",
                    background:K.surf, padding:"16px", borderRadius:"14px", border:"1.5px solid " + K.bdrSm }}>
                    {summary}
                  </div>
              }
            </div>
          ) : (
            <div>
              <div style={{ fontSize:"10px", color:K.txt3, fontWeight:700, marginBottom:"8px", letterSpacing:"0.5px" }}>
                QUESTION {step+1} OF {REVIEW_QUESTIONS.length}
              </div>
              <div style={{ fontFamily:"'Instrument Serif',serif", fontSize:"18px", color:K.txt,
                marginBottom:"14px", lineHeight:"1.5" }}>
                {q.q}
              </div>
              <textarea
                value={answers[q.id] || ""}
                onChange={function(e){ var v = e.target.value; setAnswers(function(a){ return Object.assign({}, a, { [q.id]:v }); }); }}
                placeholder={q.placeholder}
                rows={5}
                style={{ width:"100%", background:K.cardLo, border:"1.5px solid " + K.bdrSm,
                  color:K.txt, padding:"12px", borderRadius:"12px", fontFamily:"'Inter',sans-serif",
                  fontSize:"13px", resize:"vertical", outline:"none", lineHeight:"1.75",
                  boxSizing:"border-box" }}/>
            </div>
          )}
        </div>
        <div style={{ padding:"14px 22px", borderTop:"1.5px solid " + K.bdrSm,
          display:"flex", justifyContent:"space-between", alignItems:"center",
          background:K.cardLo, flexShrink:0 }}>
          {done ? (
            <Btn onClick={function(){ reset(); onClose(); }} variant="lime" style={{ marginLeft:"auto" }}>
              <Check size={12}/> Done
            </Btn>
          ) : (
            <div style={{ display:"flex", justifyContent:"space-between", width:"100%" }}>
              <Btn onClick={function(){ if(step>0) setStep(function(s){return s-1;}); }}
                variant="ghost" style={{ opacity: step > 0 ? 1 : 0.3 }}>
                <ChevronLeft size={13}/> Back
              </Btn>
              {step < REVIEW_QUESTIONS.length - 1
                ? <Btn onClick={function(){ setStep(function(s){return s+1;}); }}>
                    Next <ChevronRight size={13}/>
                  </Btn>
                : <Btn onClick={generate} variant="lime">
                    <Sparkles size={12}/> Generate
                  </Btn>
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// THEME PICKER
// ─────────────────────────────────────────────────────────────────────────────

function ThemePicker(props) {
  var current  = props.current;
  var onChange = props.onChange;
  var open     = props.open;
  var onClose  = props.onClose;
  if (!open) return null;
  return (
    <div style={{ position:"fixed", inset:0, zIndex:200, display:"flex",
      alignItems:"flex-end", justifyContent:"flex-start" }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0,
        background:"rgba(0,0,0,0.35)", backdropFilter:"blur(2px)" }}/>
      <div style={{ position:"relative", zIndex:201, margin:"0 0 12px 12px",
        background:K.card, border:"1.5px solid " + K.bdr, borderRadius:"20px",
        padding:"18px", boxShadow:K.shadowXl, width:"270px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"14px" }}>
          <div style={{ fontFamily:"'Instrument Serif',serif", fontStyle:"italic", fontSize:"17px", color:K.txt }}>
            Appearance
          </div>
          <button onClick={onClose} style={{ background:K.cardLo, border:"1px solid " + K.bdrSm,
            borderRadius:"8px", width:"26px", height:"26px", cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center", color:K.txt2 }}>
            <X size={12}/>
          </button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
          {Object.entries(THEMES).map(function(entry) {
            var id = entry[0], t = entry[1];
            return (
              <button key={id}
                onClick={function(){ onChange(id); onClose(); }}
                style={{ background: current === id ? K.brand : K.cardLo,
                  border:"1.5px solid " + (current === id ? K.accent : K.bdrSm),
                  borderRadius:"12px", padding:"10px 8px", cursor:"pointer",
                  textAlign:"left", position:"relative" }}>
                <div style={{ display:"flex", gap:"3px", marginBottom:"7px" }}>
                  {[t.bg, t.surf, t.accent, t.ctaBg, t.brand].map(function(c, i){
                    return <div key={i} style={{ flex:1, height:"4px", borderRadius:"3px", background:c }}/>;
                  })}
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                  <span style={{ fontSize:"13px" }}>{t.emoji}</span>
                  <span style={{ fontFamily:"'Inter',sans-serif", fontSize:"11px",
                    fontWeight: current === id ? 600 : 500,
                    color: current === id ? K.bg : K.txt }}>
                    {t.label}
                  </span>
                </div>
                {current === id && (
                  <div style={{ position:"absolute", top:"6px", right:"6px" }}>
                    <Check size={10} strokeWidth={3} color={K.accent}/>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NOTES RENDERER
// ─────────────────────────────────────────────────────────────────────────────

function NotesRenderer(props) {
  var content     = props.content;
  var accentColor = props.accentColor;
  var onNavigate  = props.onNavigate;

  if (!content) {
    return (
      <div style={{ color:K.txt3, fontSize:"13px", padding:"22px 24px" }}>
        Nothing written yet. Click EDIT to start.
      </div>
    );
  }

  function renderText(text) {
    var parts = text.split(/\[\[([^\]]+)\]\]/g);
    return parts.map(function(part, j) {
      if (j % 2 === 1) {
        var sec = SECTIONS.find(function(s){ return s.label.toLowerCase() === part.toLowerCase(); });
        if (sec) {
          return (
            <span key={j}
              onClick={function(){ if (onNavigate) onNavigate(sec.id); }}
              style={{ color:K.accent, fontWeight:600, cursor:"pointer", borderBottom:"1px solid " + K.accent + "50" }}>
              {part}
            </span>
          );
        }
        return <span key={j} style={{ color:K.accent }}>{part}</span>;
      }
      return <span key={j}>{part}</span>;
    });
  }

  return (
    <div style={{ padding:"18px 22px", fontFamily:"'Inter',sans-serif", lineHeight:"1.9", fontSize:"14px" }}>
      {content.split("\n").map(function(line, i) {
        var isH2     = line.startsWith("## ");
        var isH1     = line.startsWith("# ");
        var isBullet = /^[→\-•]\s/.test(line);
        var isQuote  = line.startsWith("> ");
        var isEmpty  = line.trim() === "";
        var raw = line;
        if (isH2)     raw = line.slice(3);
        else if (isH1) raw = line.slice(2);
        else if (isBullet) raw = line.replace(/^[→\-•]\s/, "");
        else if (isQuote)  raw = line.slice(2);

        return (
          <div key={i} style={{
            fontStyle: isH1 || isH2 || isQuote ? "italic" : "normal",
            fontFamily: isH1 || isH2 ? "'Instrument Serif',serif" : "'Inter',sans-serif",
            fontSize: isH1 ? "18px" : isH2 ? "15px" : "14px",
            color: isH1 || isH2 ? K.txt : K.txt2,
            marginTop: isH1 || isH2 ? "10px" : 0,
            paddingLeft: isBullet ? "6px" : isQuote ? "16px" : 0,
            borderLeft: isQuote ? "2px solid " + K.bdrSm : "none",
            minHeight: isEmpty ? "16px" : "auto"
          }}>
            {isBullet
              ? <span><span style={{ color:accentColor, marginRight:"8px", fontWeight:700 }}>›</span>{renderText(raw)}</span>
              : renderText(raw || " ")
            }
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SEARCH MODAL
// ─────────────────────────────────────────────────────────────────────────────

function SearchModal(props) {
  var open         = props.open;
  var onClose      = props.onClose;
  var tasks        = props.tasks;
  var notes        = props.notes;
  var setActive    = props.setActive;
  var setSectionTab = props.setSectionTab;

  var [q, setQ] = useState("");
  var inpRef = useRef(null);

  useEffect(function() {
    if (open) { setQ(""); setTimeout(function(){ if (inpRef.current) inpRef.current.focus(); }, 50); }
  }, [open]);

  if (!open) return null;

  var qLo = q.toLowerCase().trim();
  var results = [];
  if (qLo.length >= 2) {
    Object.entries(tasks).forEach(function(entry) {
      var sid = entry[0], list = entry[1];
      list.filter(function(t){ return t.text.toLowerCase().includes(qLo); })
        .slice(0, 4)
        .forEach(function(t){ results.push(Object.assign({}, t, { sid:sid, rtype:"task" })); });
    });
    Object.entries(notes).forEach(function(entry) {
      var sid = entry[0], n = entry[1];
      if (n && n.toLowerCase().includes(qLo)) {
        var idx = n.toLowerCase().indexOf(qLo);
        results.push({ sid:sid, snippet:"..." + n.slice(Math.max(0,idx-30), idx+60).replace(/\n/g," ") + "...", rtype:"note" });
      }
    });
    results = results.slice(0, 10);
  }

  function navigate(r) {
    setActive(r.sid);
    setSectionTab(r.rtype === "note" ? "notes" : "tasks");
    onClose();
  }

  return (
    <div style={{ position:"fixed", inset:0, zIndex:300, display:"flex",
      alignItems:"flex-start", justifyContent:"center", paddingTop:"80px" }}>
      <div onClick={onClose}
        style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.5)", backdropFilter:"blur(4px)" }}/>
      <div style={{ position:"relative", zIndex:301, width:"100%", maxWidth: window.innerWidth < 700 ? "calc(100% - 24px)" : "540px", margin:"0 12px",
        background:K.card, border:"2px solid " + K.bdr, borderRadius:"20px",
        boxShadow:K.shadowXl, overflow:"hidden" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px",
          padding:"14px 18px", borderBottom:"1px solid " + K.bdrSm }}>
          <Search size={16} color={K.txt3}/>
          <input ref={inpRef} value={q}
            onChange={function(e){ setQ(e.target.value); }}
            onKeyDown={function(e){ if (e.key === "Escape") onClose(); }}
            placeholder="Search tasks and notes..."
            style={{ flex:1, background:"transparent", border:"none", outline:"none",
              fontFamily:"'Inter',sans-serif", fontSize:"14px", color:K.txt }}/>
          <kbd onClick={onClose}
            style={{ background:K.cardLo, border:"1px solid " + K.bdrSm, borderRadius:"6px",
              padding:"2px 7px", fontSize:"10px", color:K.txt3, cursor:"pointer",
              fontFamily:"'JetBrains Mono',monospace" }}>
            ESC
          </kbd>
        </div>
        <div style={{ maxHeight:"340px", overflowY:"auto" }}>
          {qLo.length < 2 ? (
            <div style={{ padding:"30px 18px", textAlign:"center", color:K.txt2,
              fontFamily:"'Instrument Serif',serif", fontStyle:"italic", fontSize:"15px" }}>
              Type to search...
            </div>
          ) : results.length === 0 ? (
            <div style={{ padding:"30px 18px", textAlign:"center", color:K.txt2,
              fontFamily:"'Instrument Serif',serif", fontStyle:"italic", fontSize:"15px" }}>
              No results for "{q}"
            </div>
          ) : (
            <div style={{ padding:"8px" }}>
              {results.map(function(r, i) {
                var sec = SECTIONS.find(function(s){ return s.id === r.sid; });
                return (
                  <div key={i} onClick={function(){ navigate(r); }}
                    style={{ display:"flex", alignItems:"center", gap:"10px",
                      padding:"9px 10px", borderRadius:"10px", cursor:"pointer", marginBottom:"2px" }}
                    onMouseEnter={function(e){ e.currentTarget.style.background = K.cardLo; }}
                    onMouseLeave={function(e){ e.currentTarget.style.background = "transparent"; }}>
                    <div style={{ width:"26px", height:"26px", borderRadius:"7px",
                      background:(sec && sec.color) ? sec.color + "22" : K.accent + "22",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:"13px", flexShrink:0 }}>
                      {sec && sec.emoji}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:"13px", color:K.txt, fontWeight:500,
                        whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                        {r.rtype === "task" ? r.text : r.snippet}
                      </div>
                      <div style={{ fontSize:"9px", color:K.txt3, marginTop:"2px",
                        fontFamily:"'JetBrains Mono',monospace" }}>
                        {sec && sec.label.toUpperCase()} · {r.rtype === "task" ? "TASK" : "NOTE"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// QUICK CAPTURE
// ─────────────────────────────────────────────────────────────────────────────

function QuickCapture(props) {
  var open     = props.open;
  var onClose  = props.onClose;
  var setTasks = props.setTasks;

  var [text,     setText]     = useState("");
  var [section,  setSection]  = useState("sidehustle");
  var [priority, setPriority] = useState("medium");
  var [deadline, setDeadline] = useState("");
  var inpRef = useRef(null);

  useEffect(function() {
    if (open) { setText(""); setTimeout(function(){ if (inpRef.current) inpRef.current.focus(); }, 50); }
  }, [open]);

  if (!open) return null;

  function add() {
    if (!text.trim()) return;
    var dl = deadline || new Date(Date.now() + 7*86400000).toISOString().split("T")[0];
    setTasks(function(p){ return Object.assign({}, p, { [section]: (p[section] || []).concat([{ id:Date.now(), text:text.trim(), deadline:dl, done:false, priority:priority }]) }); });
    onClose();
  }

  var si = { background:K.inpt, border:"1.5px solid " + K.bdrSm, borderRadius:"10px",
    padding:"9px 12px", color:K.txt, fontFamily:"'Inter',sans-serif",
    fontSize:"13px", outline:"none", width:"100%", boxSizing:"border-box" };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:300, display:"flex",
      alignItems:"flex-end", justifyContent:"center" }}>
      <div onClick={onClose}
        style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.4)", backdropFilter:"blur(3px)" }}/>
      <div style={{ position:"relative", zIndex:301, width:"100%", maxWidth: window.innerWidth < 700 ? "calc(100% - 24px)" : "540px",
        background:K.card, border:"2px solid " + K.bdr, borderRadius:"20px 20px 0 0",
        padding:"22px", boxShadow:K.shadowXl }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"16px" }}>
          <div style={{ fontFamily:"'Instrument Serif',serif", fontStyle:"italic", fontSize:"19px", color:K.txt }}>
            Quick Capture
          </div>
          <button onClick={onClose}
            style={{ background:K.cardLo, border:"1px solid " + K.bdrSm, borderRadius:"8px",
              width:"28px", height:"28px", cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center", color:K.txt2 }}>
            <X size={13}/>
          </button>
        </div>
        <textarea ref={inpRef} value={text}
          onChange={function(e){ setText(e.target.value); }}
          onKeyDown={function(e){
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") add();
            if (e.key === "Escape") onClose();
          }}
          placeholder="What needs to get done?"
          style={Object.assign({}, si, { minHeight:"76px", resize:"none", marginBottom:"10px", lineHeight:1.6 })}/>
        <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr", gap:"8px", marginBottom:"14px" }}>
          <select value={section} onChange={function(e){ setSection(e.target.value); }} style={si}>
            {SECTIONS.filter(function(s){ return s.id !== "home" && s.id !== "calendar"; }).map(function(s){
              return <option key={s.id} value={s.id}>{s.emoji} {s.label}</option>;
            })}
          </select>
          <select value={priority} onChange={function(e){ setPriority(e.target.value); }} style={si}>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <input type="date" value={deadline}
            onChange={function(e){ setDeadline(e.target.value); }} style={si}/>
        </div>
        <div style={{ display:"flex", gap:"8px", justifyContent:"flex-end" }}>
          <button onClick={onClose}
            style={{ background:"transparent", border:"1.5px solid " + K.bdrSm,
              borderRadius:"100px", padding:"8px 18px", fontFamily:"'Inter',sans-serif",
              fontSize:"12px", color:K.txt2, cursor:"pointer" }}>
            Cancel
          </button>
          <button onClick={add} disabled={!text.trim()}
            style={{ background: text.trim() ? K.brand : K.bdrSm,
              color: text.trim() ? K.bg : K.txt3,
              border:"none", borderRadius:"100px", padding:"8px 22px",
              fontFamily:"'Inter',sans-serif", fontSize:"12px", fontWeight:600,
              cursor: text.trim() ? "pointer" : "not-allowed",
              display:"flex", alignItems:"center", gap:"6px" }}>
            <Plus size={12} strokeWidth={2.5}/> Add Task
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROGRESS CHARTS
// ─────────────────────────────────────────────────────────────────────────────

function ProgressCharts(props) {
  var tasks = props.tasks;
  var data = SECTIONS.filter(function(s){ return s.id !== "home" && s.id !== "calendar"; }).map(function(s) {
    var list = tasks[s.id] || [];
    var done = list.filter(function(t){ return t.done; }).length;
    var total = list.length;
    return { name:s.label, emoji:s.emoji, color:s.color, done:done, total:total,
      pct: total === 0 ? 0 : Math.round((done/total)*100) };
  });
  var ttlDone  = data.reduce(function(a,d){ return a + d.done; }, 0);
  var ttlTotal = data.reduce(function(a,d){ return a + d.total; }, 0);
  var pct      = ttlTotal === 0 ? 0 : Math.round((ttlDone/ttlTotal)*100);
  var r = 44, circ = 2 * Math.PI * r;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
      <Card style={{ padding:"22px 26px", display:"grid", gridTemplateColumns:"auto 1fr", gap:"24px", alignItems:"center" }}>
        <div style={{ position:"relative", width:"108px", height:"108px", flexShrink:0 }}>
          <svg width="108" height="108" viewBox="0 0 108 108">
            <circle cx="54" cy="54" r={r} fill="none" stroke={K.bdrSm} strokeWidth="10"/>
            <circle cx="54" cy="54" r={r} fill="none" stroke={K.accent} strokeWidth="10"
              strokeDasharray={(pct*circ/100) + " " + (circ - pct*circ/100)}
              strokeLinecap="round" transform="rotate(-90 54 54)"/>
          </svg>
          <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ fontFamily:"'Instrument Serif',serif", fontSize:"24px", fontStyle:"italic", color:K.accent }}>
              {pct}%
            </div>
          </div>
        </div>
        <div>
          <div style={{ fontFamily:"'Instrument Serif',serif", fontSize:"20px", fontStyle:"italic",
            color:K.txt, marginBottom:"6px", display:"flex", alignItems:"center", gap:"8px" }}>
            <BarChart2 size={18} color={K.accent}/> Overall Progress
          </div>
          <div style={{ fontSize:"13px", color:K.txt2, marginBottom:"12px" }}>
            {ttlDone} of {ttlTotal} tasks completed
          </div>
          <div style={{ display:"flex", gap:"8px" }}>
            <span style={{ fontSize:"11px", background:K.grn + "18", color:K.grn,
              padding:"4px 12px", borderRadius:"20px", fontWeight:700, border:"1px solid " + K.grn + "33" }}>
              {ttlDone} done
            </span>
            <span style={{ fontSize:"11px", background:K.red + "12", color:K.red,
              padding:"4px 12px", borderRadius:"20px", fontWeight:700, border:"1px solid " + K.red + "33" }}>
              {ttlTotal - ttlDone} left
            </span>
          </div>
        </div>
      </Card>
      <Card style={{ padding:"20px 22px" }}>
        <Label style={{ marginBottom:"14px" }}>Completion by area</Label>
        <div style={{ display:"flex", flexDirection:"column", gap:"9px" }}>
          {data.map(function(d) {
            return (
              <div key={d.name} style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                <div style={{ width:"18px", textAlign:"center", fontSize:"12px", flexShrink:0 }}>{d.emoji}</div>
                <div style={{ width:"68px", fontSize:"11px", color:K.txt2, flexShrink:0 }}>{d.name}</div>
                <div style={{ flex:1, background:K.bdrSm, borderRadius:"5px", height:"9px", overflow:"hidden" }}>
                  <div style={{ height:"100%", width:d.pct + "%",
                    background: d.pct === 100 ? K.grn : d.color,
                    borderRadius:"5px", transition:"width 1.2s ease" }}/>
                </div>
                <div style={{ width:"34px", textAlign:"right", fontFamily:"'JetBrains Mono',monospace",
                  fontSize:"10px", fontWeight:600,
                  color: d.pct === 100 ? K.grn : d.color, flexShrink:0 }}>
                  {d.pct}%
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CALENDAR VIEW
// ─────────────────────────────────────────────────────────────────────────────

function CalendarView(props) {
  var tasks      = props.tasks;
  var onNavigate = props.onNavigate;
  var isMobile   = props.isMobile || false;

  var [year,     setYear]     = useState(new Date().getFullYear());
  var [month,    setMonth]    = useState(new Date().getMonth());
  var [selected, setSelected] = useState(null);

  var today = new Date();
  var firstDay = new Date(year, month, 1).getDay();
  var daysInMonth = new Date(year, month + 1, 0).getDate();
  var monthNames = ["January","February","March","April","May","June",
    "July","August","September","October","November","December"];

  var tasksByDate = {};
  Object.entries(tasks).forEach(function(entry) {
    var sec = entry[0], list = entry[1];
    list.forEach(function(t) {
      var d = new Date(t.deadline);
      if (d.getFullYear() === year && d.getMonth() === month) {
        var key = d.getDate();
        if (!tasksByDate[key]) tasksByDate[key] = [];
        var secObj = SECTIONS.find(function(s){ return s.id === sec; });
        tasksByDate[key].push(Object.assign({}, t, {
          section: sec,
          sectionColor: secObj ? secObj.color : "#7A7468"
        }));
      }
    });
  });

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(function(y){ return y-1; }); }
    else setMonth(function(m){ return m-1; });
    setSelected(null);
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(function(y){ return y+1; }); }
    else setMonth(function(m){ return m+1; });
    setSelected(null);
  }

  var allTasksThisMonth = Object.values(tasksByDate).reduce(function(a, l){ return a.concat(l); }, []);
  var doneThisMonth    = allTasksThisMonth.filter(function(t){ return t.done; }).length;
  var overdueThisMonth = allTasksThisMonth.filter(function(t){ return !t.done && new Date(t.deadline) < today; }).length;
  var selectedTasks    = selected ? (tasksByDate[selected] || []) : [];

  var days = [];
  for (var i = 0; i < firstDay; i++) days.push(null);
  for (var d = 1; d <= daysInMonth; d++) days.push(d);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
      <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr", gap:"10px" }}>
        {[
          { label:"Tasks this month", value:allTasksThisMonth.length, color:"#818CF8" },
          { label:"Completed",        value:doneThisMonth,            color:K.grn },
          { label:"Overdue",          value:overdueThisMonth,         color:K.red }
        ].map(function(s) {
          return (
            <Card key={s.label} style={{ padding:"13px 15px" }}>
              <div style={{ fontFamily:"'Instrument Serif',serif", fontStyle:"italic",
                fontSize:"22px", color:s.color }}>
                {s.value}
              </div>
              <div style={{ fontSize:"10px", color:K.txt3, marginTop:"2px" }}>{s.label}</div>
            </Card>
          );
        })}
      </div>
      <Card>
        <div style={{ padding:"12px 16px", borderBottom:"1.5px solid " + K.bdrSm,
          display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <button onClick={prevMonth}
            style={{ background:K.cardLo, border:"1.5px solid " + K.bdrSm, borderRadius:"7px",
              width:"30px", height:"30px", cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center", color:K.txt2 }}>
            <ChevronLeft size={15}/>
          </button>
          <div style={{ fontFamily:"'Instrument Serif',serif", fontSize:"19px", fontStyle:"italic", color:K.txt }}>
            {monthNames[month]} {year}
          </div>
          <button onClick={nextMonth}
            style={{ background:K.cardLo, border:"1.5px solid " + K.bdrSm, borderRadius:"7px",
              width:"30px", height:"30px", cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center", color:K.txt2 }}>
            <ChevronRight size={15}/>
          </button>
        </div>
        <div style={{ padding:"12px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", marginBottom:"6px" }}>
            {["Su","Mo","Tu","We","Th","Fr","Sa"].map(function(d) {
              return (
                <div key={d} style={{ textAlign:"center", fontSize:"9px", fontWeight:700,
                  color:K.txt3, padding:"4px 0", fontFamily:"'JetBrains Mono',monospace" }}>
                  {d}
                </div>
              );
            })}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"3px" }}>
            {days.map(function(day, idx) {
              if (!day) return <div key={"e" + idx}/>;
              var isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
              var isSel   = selected === day;
              var dayTasks = tasksByDate[day] || [];
              var hasOver  = dayTasks.some(function(t){ return !t.done && new Date(t.deadline) < today; });
              return (
                <div key={day}
                  onClick={function(){ setSelected(isSel ? null : day); }}
                  style={{ aspectRatio:"1", borderRadius:"9px", display:"flex", flexDirection:"column",
                    alignItems:"center", justifyContent:"center",
                    cursor: dayTasks.length ? "pointer" : "default",
                    background: isToday ? K.brand : isSel ? K.accent + "22" : "transparent",
                    border:"1.5px solid " + (isToday ? K.brand : isSel ? K.accent : dayTasks.length ? K.bdrSm : "transparent"),
                    transition:"all 0.13s" }}>
                  <div style={{ fontSize:"11px", fontWeight: isToday ? 700 : 400,
                    color: isToday ? K.bg : K.txt }}>
                    {day}
                  </div>
                  {dayTasks.length > 0 && (
                    <div style={{ display:"flex", gap:"2px", marginTop:"2px" }}>
                      {dayTasks.slice(0, 3).map(function(t, ti) {
                        return (
                          <div key={ti} style={{ width:"4px", height:"4px", borderRadius:"50%",
                            background: hasOver && !t.done ? K.red : t.sectionColor }}/>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Card>
      {selected && selectedTasks.length > 0 && (
        <Card>
          <div style={{ padding:"11px 16px", borderBottom:"1.5px solid " + K.bdrSm,
            fontFamily:"'Instrument Serif',serif", fontStyle:"italic", fontSize:"15px", color:K.txt }}>
            {monthNames[month]} {selected}
          </div>
          <div style={{ padding:"10px" }}>
            {selectedTasks.map(function(t) {
              var sec = SECTIONS.find(function(s){ return s.id === t.section; });
              return (
                <div key={t.id}
                  onClick={function(){ if (onNavigate) onNavigate(t.section); }}
                  style={{ display:"flex", alignItems:"center", gap:"9px",
                    padding:"9px 11px", borderRadius:"11px",
                    background:K.cardLo, marginBottom:"6px", cursor:"pointer",
                    border:"1.5px solid " + K.bdrSm }}>
                  <div style={{ width:"7px", height:"7px", borderRadius:"50%",
                    background:PRIORITY_COLORS[t.priority], flexShrink:0 }}/>
                  <div style={{ flex:1, fontSize:"12px",
                    color: t.done ? K.txt3 : K.txt,
                    textDecoration: t.done ? "line-through" : "none" }}>
                    {t.text}
                  </div>
                  <div style={{ fontSize:"11px", color:K.txt3 }}>
                    {sec && sec.emoji} {sec && sec.label}
                  </div>
                  {t.done && <Check size={13} color={K.grn}/>}
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION VIEW
// ─────────────────────────────────────────────────────────────────────────────

function SectionView(props) {
  var active      = props.active;
  var tasks       = props.tasks;
  var setTasks    = props.setTasks;
  var notes       = props.notes;
  var setNotes    = props.setNotes;
  var sectionTab  = props.sectionTab;
  var setSectionTab = props.setSectionTab;
  var accentColor = props.accentColor;
  var setActive   = props.setActive;

  var [editNote,     setEditNote]     = useState(false);
  var [noteVal,      setNoteVal]      = useState(notes[active] || "");
  var [showAdd,      setShowAdd]      = useState(false);
  var [newTask,      setNewTask]      = useState({ text:"", deadline:"", priority:"medium" });
  var [editTask,     setEditTask]     = useState(null);
  var [pomodoroTask, setPomodoroTask] = useState(null);

  useEffect(function() {
    setNoteVal(notes[active] || "");
    setEditNote(false);
    setShowAdd(false);
    setNewTask({ text:"", deadline:"", priority:"medium" });
    setEditTask(null);
    setPomodoroTask(null);
  }, [active]);

  var list    = tasks[active] || [];
  var pending = list.filter(function(t){ return !t.done; });
  var sortedPending = pending.slice().sort(function(a, b) {
    var p = { high:0, medium:1, low:2 };
    if (p[a.priority] !== p[b.priority]) return p[a.priority] - p[b.priority];
    if (a.deadline && b.deadline) return new Date(a.deadline) - new Date(b.deadline);
    return 0;
  });
  var done     = list.filter(function(t){ return t.done; });
  var allSorted = sortedPending.concat(done);

  function toggle(id) {
    setTasks(function(p){ return Object.assign({}, p, { [active]: p[active].map(function(t){ return t.id === id ? Object.assign({}, t, { done:!t.done }) : t; }) }); });
  }
  function del(id) {
    setTasks(function(p){ return Object.assign({}, p, { [active]: p[active].filter(function(t){ return t.id !== id; }) }); });
  }
  function addTask() {
    if (!newTask.text.trim()) return;
    var dl = newTask.deadline || new Date(Date.now() + 7*86400000).toISOString().split("T")[0];
    setTasks(function(p){ return Object.assign({}, p, { [active]: (p[active] || []).concat([{ id:Date.now(), text:newTask.text.trim(), deadline:dl, done:false, priority:newTask.priority }]) }); });
    setNewTask({ text:"", deadline:"", priority:"medium" });
    setShowAdd(false);
  }
  function saveEdit() {
    if (!editTask || !editTask.text.trim()) return;
    var et = editTask;
    setTasks(function(p){ return Object.assign({}, p, { [active]: p[active].map(function(t){ return t.id === et.id ? Object.assign({}, t, et) : t; }) }); });
    setEditTask(null);
  }
  function saveNote() {
    setNotes(function(p){ return Object.assign({}, p, { [active]:noteVal }); });
    setEditNote(false);
  }

  var si = { background:K.inpt, border:"1.5px solid " + K.bdrSm, borderRadius:"10px",
    padding:"8px 11px", color:K.txt, fontFamily:"'Inter',sans-serif",
    fontSize:"13px", outline:"none" };

  var emptyMsgs = {
    health:"No tasks yet — start with one health goal.",
    sidehustle:"Your side hustle journey starts here.",
    college:"Add your first assignment or deadline.",
    career:"Plan your next career move.",
    thoughts:"Drop a goal you have been thinking about.",
    finance:"Track something financial today.",
    ai:"What AI experiment are you curious about?",
    reading:"Add a book to your reading list.",
    network:"Who should you follow up with?"
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"0" }}>
      <div style={{ display:"flex", gap:"4px", background:K.surf, padding:"4px",
        borderRadius:"12px", border:"1.5px solid " + K.bdrSm,
        width:"fit-content", marginBottom:"14px" }}>
        {[
          ["notes",   "Notes"],
          ["tasks",   "Tasks (" + pending.length + ")"],
          ["mindmap", "Mind Map"]
        ].map(function(pair) {
          var t = pair[0], l = pair[1];
          return (
            <button key={t}
              onClick={function(){ setSectionTab(t); }}
              style={{ background: sectionTab === t ? K.bdr : "transparent",
                color: sectionTab === t ? K.bg : K.txt2,
                border:"none", padding:"7px 16px", borderRadius:"9px", cursor:"pointer",
                fontFamily:"'Inter',sans-serif", fontSize:"11px", fontWeight:700,
                transition:"all 0.13s" }}>
              {l}
            </button>
          );
        })}
      </div>

      {sectionTab === "notes" && (
        <Card>
          <div style={{ padding:"10px 16px", borderBottom:"1.5px solid " + K.bdrSm,
            display:"flex", alignItems:"center", justifyContent:"space-between", background:K.surf }}>
            <Label style={{ display:"flex", alignItems:"center", gap:"5px" }}>
              <FileText size={11}/> Notes
            </Label>
            {editNote ? (
              <div style={{ display:"flex", gap:"6px" }}>
                <Btn onClick={saveNote} variant="lime" style={{ padding:"5px 13px", fontSize:"10px" }}>
                  <Check size={10}/> Save
                </Btn>
                <Btn onClick={function(){ setEditNote(false); setNoteVal(notes[active] || ""); }}
                  variant="ghost" style={{ padding:"5px 13px", fontSize:"10px" }}>
                  Cancel
                </Btn>
              </div>
            ) : (
              <Btn onClick={function(){ setEditNote(true); }} variant="ghostSm">
                <Pencil size={10}/> EDIT
              </Btn>
            )}
          </div>
          {editNote ? (
            <textarea value={noteVal}
              onChange={function(e){ setNoteVal(e.target.value); }}
              style={{ width:"100%", minHeight:"300px", background:K.cardLo,
                border:"none", color:K.txt, padding:"18px 22px",
                fontFamily:"'Inter',sans-serif", fontSize:"14px",
                resize:"vertical", outline:"none", lineHeight:1.9, boxSizing:"border-box" }}/>
          ) : (
            <NotesRenderer content={notes[active]} accentColor={accentColor} onNavigate={setActive}/>
          )}
        </Card>
      )}

      {sectionTab === "tasks" && (
        <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
          {allSorted.length === 0 && !showAdd && (
            <Card style={{ padding:"38px", textAlign:"center" }}>
              <div style={{ fontSize:"20px", marginBottom:"10px" }}>✦</div>
              <div style={{ fontFamily:"'Instrument Serif',serif", fontStyle:"italic",
                fontSize:"17px", color:K.txt, marginBottom:"6px" }}>
                {emptyMsgs[active] || "No tasks yet."}
              </div>
              <Btn onClick={function(){ setShowAdd(true); }} variant="lime" style={{ marginTop:"12px" }}>
                <Plus size={12}/> Add first task
              </Btn>
            </Card>
          )}
          {showAdd && (
            <Card style={{ padding:"14px 16px" }}>
              <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
                <input value={newTask.text}
                  onChange={function(e){ var v=e.target.value; setNewTask(function(p){ return Object.assign({},p,{text:v}); }); }}
                  onKeyDown={function(e){ if(e.key==="Enter") addTask(); }}
                  placeholder="Task description..."
                  autoFocus
                  style={Object.assign({}, si, { width:"100%", boxSizing:"border-box" })}/>
                <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr auto", gap:"8px", alignItems:"center" }}>
                  <input type="date" value={newTask.deadline}
                    onChange={function(e){ var v=e.target.value; setNewTask(function(p){ return Object.assign({},p,{deadline:v}); }); }}
                    style={si}/>
                  <select value={newTask.priority}
                    onChange={function(e){ var v=e.target.value; setNewTask(function(p){ return Object.assign({},p,{priority:v}); }); }}
                    style={si}>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  <div style={{ display:"flex", gap:"6px" }}>
                    <Btn onClick={addTask} variant="lime" style={{ padding:"7px 14px", fontSize:"11px" }}>
                      <Check size={11}/> Add
                    </Btn>
                    <Btn onClick={function(){ setShowAdd(false); }} variant="ghost" style={{ padding:"7px 14px", fontSize:"11px" }}>
                      Cancel
                    </Btn>
                  </div>
                </div>
              </div>
            </Card>
          )}
          {allSorted.map(function(t) {
            var dlInfo = (!t.done && t.deadline) ? getDeadlineInfo(t.deadline) : null;
            return (
              <div key={t.id}>
                <Card>
                  {editTask && editTask.id === t.id ? (
                    <div style={{ padding:"12px 14px", display:"flex", flexDirection:"column", gap:"8px" }}>
                      <input value={editTask.text}
                        onChange={function(e){ var v=e.target.value; setEditTask(function(p){ return Object.assign({},p,{text:v}); }); }}
                        style={Object.assign({}, si, { width:"100%", boxSizing:"border-box" })}/>
                      <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr auto", gap:"8px" }}>
                        <input type="date" value={editTask.deadline}
                          onChange={function(e){ var v=e.target.value; setEditTask(function(p){ return Object.assign({},p,{deadline:v}); }); }}
                          style={si}/>
                        <select value={editTask.priority}
                          onChange={function(e){ var v=e.target.value; setEditTask(function(p){ return Object.assign({},p,{priority:v}); }); }}
                          style={si}>
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </select>
                        <div style={{ display:"flex", gap:"6px" }}>
                          <Btn onClick={saveEdit} variant="lime" style={{ padding:"6px 12px", fontSize:"10px" }}>
                            <Check size={10}/> Save
                          </Btn>
                          <Btn onClick={function(){ setEditTask(null); }} variant="ghost" style={{ padding:"6px 12px", fontSize:"10px" }}>
                            Cancel
                          </Btn>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding:"11px 14px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"9px" }}>
                        <div onClick={function(){ toggle(t.id); }}
                          style={{ width:"17px", height:"17px", borderRadius:"5px",
                            border:"2px solid " + (t.done ? K.grn : K.bdrSm),
                            background: t.done ? K.grn : "transparent",
                            display:"flex", alignItems:"center", justifyContent:"center",
                            flexShrink:0, cursor:"pointer", transition:"all 0.13s" }}>
                          {t.done && <Check size={9} strokeWidth={3} color={K.bg}/>}
                        </div>
                        <div style={{ flex:1, fontSize:"13px",
                          color: t.done ? K.txt3 : K.txt,
                          textDecoration: t.done ? "line-through" : "none",
                          fontWeight: t.done ? 400 : 500 }}>
                          {t.text}
                        </div>
                        {dlInfo && (
                          <span style={{ fontSize:"10px", color:dlInfo.color,
                            fontWeight:700, flexShrink:0,
                            fontFamily:"'JetBrains Mono',monospace" }}>
                            {dlInfo.label}
                          </span>
                        )}
                        <div style={{ width:"7px", height:"7px", borderRadius:"50%",
                          background:PRIORITY_COLORS[t.priority], flexShrink:0 }}/>
                        {!t.done && (
                          <button
                            onClick={function(){ setPomodoroTask(function(prev){ return prev === t.id ? null : t.id; }); }}
                            style={{ background: pomodoroTask === t.id ? K.accent + "20" : "transparent",
                              border:"none", color: pomodoroTask === t.id ? K.accent : K.txt3,
                              cursor:"pointer", padding:"2px 3px", display:"flex",
                              alignItems:"center", borderRadius:"4px" }}>
                            <Timer size={12}/>
                          </button>
                        )}
                        <button onClick={function(){ setEditTask(Object.assign({}, t)); }}
                          style={{ background:"transparent", border:"none", color:K.txt3,
                            cursor:"pointer", padding:"2px", display:"flex" }}>
                          <Pencil size={12}/>
                        </button>
                        <button onClick={function(){ del(t.id); }}
                          style={{ background:"transparent", border:"none", color:K.txt3,
                            cursor:"pointer", padding:"2px", display:"flex" }}>
                          <Trash2 size={12}/>
                        </button>
                      </div>
                      {pomodoroTask === t.id && !t.done && (
                        <div style={{ marginTop:"9px", paddingTop:"9px", borderTop:"1px solid " + K.bdrFine }}>
                          <PomodoroTimer onComplete={function(){ toggle(t.id); }}/>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              </div>
            );
          })}
          {allSorted.length > 0 && (
            <button onClick={function(){ setShowAdd(true); }}
              style={{ display:"flex", alignItems:"center", gap:"8px",
                padding:"9px 14px", background:"transparent",
                border:"1.5px dashed " + K.bdrSm, borderRadius:"12px",
                cursor:"pointer", color:K.txt3, fontFamily:"'Inter',sans-serif",
                fontSize:"12px", width:"100%", transition:"all 0.13s" }}
              onMouseEnter={function(e){ e.currentTarget.style.background = K.cardLo; }}
              onMouseLeave={function(e){ e.currentTarget.style.background = "transparent"; }}>
              <Plus size={13} color={accentColor}/> Add task
            </button>
          )}
        </div>
      )}

      {sectionTab === "mindmap" && (
        <MindMap sectionId={active} tasks={tasks} notes={notes} accentColor={accentColor}/>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOME VIEW
// ─────────────────────────────────────────────────────────────────────────────

function HomeView(props) {
  var tasks             = props.tasks;
  var habits            = props.habits;
  var setHabits         = props.setHabits;
  var homeTab           = props.homeTab;
  var setHomeTab        = props.setHomeTab;
  var setActive         = props.setActive;
  var permission        = props.permission;
  var requestPermission = props.requestPermission;
  var setAiOpen         = props.setAiOpen;
  var setReviewOpen     = props.setReviewOpen;
  var isMobile          = props.isMobile || false;

  var [addingHabit,  setAddingHabit]  = useState(false);
  var [newHabitTxt,  setNewHabitTxt]  = useState("");

  var allTasks = Object.values(tasks).reduce(function(a, l){ return a.concat(l); }, []);
  var ttlDone  = allTasks.filter(function(t){ return t.done; }).length;
  var ttlTotal = allTasks.length;
  var overdue  = allTasks.filter(function(t){ return !t.done && new Date(t.deadline) < new Date(); }).length;
  var topStreak = habits.length > 0 ? Math.max.apply(null, habits.map(function(h){ return h.streak; })) : 0;

  var allHigh = Object.entries(tasks).reduce(function(arr, entry) {
    var sid = entry[0], list = entry[1];
    return arr.concat(list.filter(function(t){ return !t.done && t.priority === "high"; }).map(function(t){ return Object.assign({}, t, { section:sid }); }));
  }, []).slice(0, 6);

  var today = new Date().toISOString().split("T")[0];
  var todayTasks = Object.entries(tasks).reduce(function(arr, entry) {
    var sid = entry[0], list = entry[1];
    return arr.concat(list.filter(function(t){ return t.deadline === today && !t.done; }).map(function(t){ return Object.assign({}, t, { sid:sid }); }));
  }, []).sort(function(a, b){ var p={high:0,medium:1,low:2}; return p[a.priority] - p[b.priority]; });

  function toggleHabit(id) {
    setHabits(function(hs){ return hs.map(function(h){ return h.id === id ? Object.assign({}, h, { done:!h.done, streak: !h.done ? h.streak + 1 : Math.max(0, h.streak - 1) }) : h; }); });
  }
  function delHabit(id) {
    setHabits(function(hs){ return hs.filter(function(h){ return h.id !== id; }); });
  }
  function addHabit() {
    if (!newHabitTxt.trim()) return;
    setHabits(function(hs){ return hs.concat([{ id:Date.now(), label:newHabitTxt.trim(), streak:0, done:false }]); });
    setNewHabitTxt("");
    setAddingHabit(false);
  }

  var hour = new Date().getHours();
  var greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
      <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap:"10px" }}>
        {[
          { v:ttlDone,        l:"Done",       c:K.grn },
          { v:ttlTotal-ttlDone, l:"Remaining", c:K.accent },
          { v:overdue,        l:"Overdue",     c: overdue > 0 ? K.red : K.grn },
          { v:topStreak + "🔥", l:"Best streak", c:"#C08A10" }
        ].map(function(s) {
          return (
            <Card key={s.l} style={{ padding:"18px 20px" }}>
              <div style={{ fontFamily:"'Instrument Serif',serif", fontSize:"30px",
                fontStyle:"italic", color:s.c, lineHeight:1 }}>{s.v}</div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"9px",
                color:K.txt3, marginTop:"8px", letterSpacing:"0.08em", textTransform:"uppercase" }}>
                {s.l}
              </div>
            </Card>
          );
        })}
      </div>

      <Card style={{ overflow:"hidden" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr auto", alignItems:"stretch" }}>
          <div style={{ padding:"22px 24px" }}>
            <div style={{ fontFamily:"'Instrument Serif',serif", fontSize:"24px",
              fontStyle:"italic", color:K.txt, marginBottom:"4px" }}>
              {greeting}
            </div>
            <div style={{ fontSize:"12px", color:K.txt2 }}>
              {new Date().toLocaleDateString("en-IN", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}
            </div>
            {permission !== "granted" && (
              <div style={{ display:"flex", alignItems:"center", gap:"8px", background:K.cardLo,
                padding:"9px 12px", borderRadius:"10px", border:"1.5px solid " + K.bdrSm, marginTop:"12px" }}>
                <Bell size={13} color={K.accent}/>
                <span style={{ flex:1, fontSize:"11px", color:K.txt2 }}>Enable deadline notifications</span>
                <Btn onClick={requestPermission} variant="sm">Enable</Btn>
              </div>
            )}
          </div>
          <div style={{ display:"flex", flexDirection:"column", borderLeft:"1.5px solid " + K.bdrSm, minWidth:"150px" }}>
            <button onClick={function(){ setAiOpen(true); }}
              style={{ flex:1, background:K.brand, color:K.bg, border:"none",
                padding:"16px 18px", fontFamily:"'Inter',sans-serif", fontSize:"11px", fontWeight:600,
                cursor:"pointer", borderBottom:"1.5px solid rgba(255,255,255,0.08)",
                textAlign:"left", display:"flex", alignItems:"center", gap:"7px" }}>
              <Sparkles size={12}/> Ask AI <ArrowRight size={11}/>
            </button>
            <button onClick={function(){ setReviewOpen(true); }}
              style={{ flex:1, background:K.ctaBg, color:K.cta, border:"none",
                padding:"16px 18px", fontFamily:"'Inter',sans-serif", fontSize:"11px", fontWeight:600,
                cursor:"pointer", borderBottom:"1.5px solid " + K.bdrSm,
                textAlign:"left", display:"flex", alignItems:"center", gap:"7px" }}>
              <ClipboardList size={12}/> Review <ArrowRight size={11}/>
            </button>
            <button onClick={function(){ setActive("calendar"); }}
              style={{ flex:1, background:K.cardLo, color:K.txt2, border:"none",
                padding:"16px 18px", fontFamily:"'Inter',sans-serif", fontSize:"11px",
                cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:"7px" }}>
              <CalendarDays size={12}/> Calendar <ArrowRight size={11}/>
            </button>
          </div>
        </div>
      </Card>

      <div style={{ display:"flex", gap:"4px", background:K.surf, padding:"4px",
        borderRadius:"12px", border:"1.5px solid " + K.bdrSm, width:"fit-content" }}>
        {[["overview","Overview"],["today","Today"],["progress","Progress"]].map(function(pair) {
          var t = pair[0], l = pair[1];
          return (
            <button key={t} onClick={function(){ setHomeTab(t); }}
              style={{ background: homeTab === t ? K.bdr : "transparent",
                color: homeTab === t ? K.bg : K.txt2,
                border:"none", padding:"7px 16px", borderRadius:"9px", cursor:"pointer",
                fontFamily:"'Inter',sans-serif", fontSize:"11px", fontWeight:700, transition:"all 0.13s" }}>
              {l}
            </button>
          );
        })}
      </div>

      {homeTab === "today" && (
        <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap:"12px" }}>
          <Card>
            <div style={{ padding:"11px 14px", borderBottom:"1.5px solid " + K.bdrSm,
              display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <Label style={{ display:"flex", alignItems:"center", gap:"5px" }}>
                <CheckSquare size={10}/> Due Today
              </Label>
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"10px", color:K.accent, fontWeight:600 }}>
                {todayTasks.length}
              </span>
            </div>
            <div style={{ padding:"9px" }}>
              {todayTasks.length === 0 ? (
                <div style={{ padding:"22px", textAlign:"center" }}>
                  <div style={{ fontSize:"18px", marginBottom:"7px" }}>✨</div>
                  <div style={{ fontFamily:"'Instrument Serif',serif", fontStyle:"italic",
                    fontSize:"14px", color:K.txt2 }}>
                    Nothing due today!
                  </div>
                </div>
              ) : (
                todayTasks.map(function(t) {
                  var sec = SECTIONS.find(function(s){ return s.id === t.sid; });
                  return (
                    <div key={t.id} onClick={function(){ setActive(t.sid); }}
                      style={{ display:"flex", alignItems:"center", gap:"7px",
                        padding:"8px 9px", borderRadius:"9px", marginBottom:"3px",
                        background:K.cardLo, cursor:"pointer" }}>
                      <div style={{ width:"6px", height:"6px", borderRadius:"50%",
                        background:PRIORITY_COLORS[t.priority], flexShrink:0 }}/>
                      <div style={{ flex:1, fontSize:"11px", color:K.txt, fontWeight:500,
                        whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                        {t.text}
                      </div>
                      <span style={{ fontSize:"12px", flexShrink:0 }}>{sec && sec.emoji}</span>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
          <Card>
            <div style={{ padding:"11px 14px", borderBottom:"1.5px solid " + K.bdrSm,
              display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <Label style={{ display:"flex", alignItems:"center", gap:"5px" }}>
                <Target size={10}/> Habits
              </Label>
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"10px",
                color: habits.filter(function(h){ return h.done; }).length === habits.length && habits.length > 0 ? K.grn : K.txt3 }}>
                {habits.filter(function(h){ return h.done; }).length}/{habits.length}
              </span>
            </div>
            <div style={{ padding:"9px" }}>
              {habits.map(function(h) {
                return (
                  <div key={h.id} onClick={function(){ toggleHabit(h.id); }}
                    style={{ display:"flex", alignItems:"center", gap:"7px",
                      padding:"7px 9px", borderRadius:"9px", marginBottom:"3px",
                      cursor:"pointer", background: h.done ? K.grn + "12" : "transparent" }}>
                    <div style={{ width:"15px", height:"15px", borderRadius:"4px",
                      border:"2px solid " + (h.done ? K.grn : K.bdrSm),
                      background: h.done ? K.grn : "transparent",
                      display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      {h.done && <Check size={8} strokeWidth={3} color={K.bg}/>}
                    </div>
                    <span style={{ flex:1, fontSize:"11px",
                      color: h.done ? K.txt3 : K.txt,
                      textDecoration: h.done ? "line-through" : "none" }}>
                      {h.label}
                    </span>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"9px", color:K.accent }}>
                      {h.streak}🔥
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {homeTab === "overview" && (
        <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
          <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "3fr 2fr", gap:"12px" }}>
            <Card>
              <div style={{ padding:"11px 16px", borderBottom:"1.5px solid " + K.bdrSm,
                display:"flex", alignItems:"center", justifyContent:"space-between", background:K.surf }}>
                <Label style={{ display:"flex", alignItems:"center", gap:"5px" }}>
                  <Diamond size={10} color={K.accent}/> High Priority
                </Label>
                <span style={{ width:"7px", height:"7px", borderRadius:"50%",
                  background: allHigh.length > 0 ? K.red : K.grn, display:"inline-block" }}/>
              </div>
              <div style={{ padding:"10px" }}>
                {allHigh.length === 0 ? (
                  <div style={{ padding:"16px", color:K.txt3, fontSize:"12px", textAlign:"center" }}>
                    All clear!
                  </div>
                ) : (
                  allHigh.map(function(t) {
                    var sec = SECTIONS.find(function(s){ return s.id === t.section; });
                    var dl  = getDeadlineInfo(t.deadline);
                    return (
                      <div key={t.id} onClick={function(){ setActive(t.section); }}
                        style={{ display:"flex", alignItems:"center", gap:"9px",
                          padding:"9px 11px", background:K.surf, borderRadius:"11px",
                          border:"1.5px solid " + K.bdrSm, marginBottom:"5px", cursor:"pointer" }}>
                        <div style={{ width:"6px", height:"6px", borderRadius:"50%",
                          background:(sec && sec.color) || K.accent, flexShrink:0 }}/>
                        <div style={{ flex:1, fontSize:"12px", color:K.txt }}>{t.text}</div>
                        <span style={{ fontSize:"9px", color:dl.color, fontWeight:700,
                          flexShrink:0, fontFamily:"'JetBrains Mono',monospace" }}>
                          {dl.label}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </Card>
            <Card>
              <div style={{ padding:"11px 14px", borderBottom:"1.5px solid " + K.bdrSm,
                display:"flex", alignItems:"center", justifyContent:"space-between", background:K.surf }}>
                <Label style={{ display:"flex", alignItems:"center", gap:"5px" }}>
                  <Target size={10}/> Habits
                </Label>
                <Btn onClick={function(){ setAddingHabit(function(v){ return !v; }); }} variant="ghostSm">
                  {addingHabit ? "Cancel" : "+ Add"}
                </Btn>
              </div>
              <div style={{ padding:"10px" }}>
                {addingHabit && (
                  <div style={{ display:"flex", gap:"5px", marginBottom:"9px" }}>
                    <input value={newHabitTxt}
                      onChange={function(e){ setNewHabitTxt(e.target.value); }}
                      onKeyDown={function(e){ if(e.key==="Enter") addHabit(); }}
                      placeholder="New habit..."
                      autoFocus
                      style={{ flex:1, background:K.inpt, border:"1.5px solid " + K.bdrSm,
                        color:K.txt, padding:"6px 10px", borderRadius:"9px",
                        fontFamily:"'Inter',sans-serif", fontSize:"11px", outline:"none" }}/>
                    <Btn onClick={addHabit} variant="sm">Add</Btn>
                  </div>
                )}
                {habits.map(function(h) {
                  return (
                    <div key={h.id}
                      style={{ display:"flex", alignItems:"center", gap:"7px",
                        padding:"7px 8px", borderRadius:"9px",
                        background: h.done ? K.grn + "12" : "transparent", marginBottom:"3px" }}>
                      <div onClick={function(){ toggleHabit(h.id); }}
                        style={{ width:"16px", height:"16px", borderRadius:"4px",
                          border:"2px solid " + (h.done ? K.grn : K.bdrSm),
                          background: h.done ? K.grn : "transparent",
                          display:"flex", alignItems:"center", justifyContent:"center",
                          flexShrink:0, cursor:"pointer" }}>
                        {h.done && <Check size={9} strokeWidth={3} color={K.bg}/>}
                      </div>
                      <div onClick={function(){ toggleHabit(h.id); }}
                        style={{ flex:1, fontSize:"11px",
                          color: h.done ? K.txt3 : K.txt,
                          textDecoration: h.done ? "line-through" : "none", cursor:"pointer" }}>
                        {h.label}
                      </div>
                      <span style={{ fontSize:"10px", color:K.accent, fontFamily:"'JetBrains Mono',monospace" }}>
                        {h.streak}🔥
                      </span>
                      <button onClick={function(){ delHabit(h.id); }}
                        style={{ background:"transparent", border:"none", color:K.txt3,
                          cursor:"pointer", padding:"0 2px", display:"flex" }}>
                        <X size={11}/>
                      </button>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
          <Card>
            <div style={{ padding:"11px 16px", borderBottom:"1.5px solid " + K.bdrSm,
              display:"flex", alignItems:"center", background:K.surf }}>
              <Label style={{ display:"flex", alignItems:"center", gap:"5px" }}>
                <LayoutGrid size={10}/> Life Areas
              </Label>
            </div>
            <div style={{ padding:"12px", display:"grid", gridTemplateColumns: isMobile ? "repeat(3,1fr)" : "repeat(5,1fr)", gap:"7px" }}>
              {SECTIONS.filter(function(s){ return s.id !== "home" && s.id !== "calendar"; }).map(function(s) {
                var tot  = (tasks[s.id] || []).length;
                var dn   = (tasks[s.id] || []).filter(function(t){ return t.done; }).length;
                var p    = tot === 0 ? 0 : Math.round((dn/tot)*100);
                var pend = (tasks[s.id] || []).filter(function(t){ return !t.done; }).length;
                return (
                  <div key={s.id} onClick={function(){ setActive(s.id); }}
                    style={{ padding:"12px 10px", background:K.cardLo, borderRadius:"12px",
                      cursor:"pointer", border:"1.5px solid " + K.bdrSm, transition:"all 0.16s" }}
                    onMouseEnter={function(e){ e.currentTarget.style.background = K.surf; }}
                    onMouseLeave={function(e){ e.currentTarget.style.background = K.cardLo; }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"5px" }}>
                      <span style={{ fontSize:"15px" }}>{s.emoji}</span>
                      {tot > 0 && <RingProgress pct={p} color={s.color} size={24} stroke={2.5}/>}
                    </div>
                    <div style={{ fontFamily:"'Inter',sans-serif", fontSize:"9px",
                      fontWeight:600, color:K.txt2, letterSpacing:"0.4px" }}>
                      {s.label}
                    </div>
                    {pend > 0 && (
                      <div style={{ fontSize:"9px", color:s.color, marginTop:"3px",
                        fontFamily:"'JetBrains Mono',monospace" }}>
                        {pend} left
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {homeTab === "progress" && <ProgressCharts tasks={tasks}/>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────────────────────

export default function Nexus() {
  var [active,      setActive]      = useState("home");
  var [tasks,       setTasks]       = useState(DEFAULT_TASKS);
  var [notes,       setNotes]       = useState(DEFAULT_NOTES);
  var [habits,      setHabits]      = useState(DEFAULT_HABITS);
  var [sectionTab,  setSectionTab]  = useState("notes");
  var [homeTab,     setHomeTab]     = useState("overview");
  var [sidebarOpen, setSidebarOpen] = useState(true);
  var [aiOpen,      setAiOpen]      = useState(false);
  var [themeId,     setThemeId]     = useState("linen");
  var [themeOpen,   setThemeOpen]   = useState(false);
  var [reviewOpen,  setReviewOpen]  = useState(false);
  var [searchOpen,  setSearchOpen]  = useState(false);
  var [captureOpen, setCaptureOpen] = useState(false);
  var [permission,  setPermission]  = useState("default");
  var [mounted,     setMounted]     = useState(false);
  var [isMobile,    setIsMobile]    = useState(false);
  var [navDrawer,   setNavDrawer]   = useState(false);
  var saveTimer = useRef(null);

  useEffect(function() {
    // Viewport meta for mobile
    var existing = document.querySelector("meta[name='viewport']");
    if (!existing) {
      var meta = document.createElement("meta");
      meta.name = "viewport";
      meta.content = "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no";
      document.head.appendChild(meta);
    }

    var lnk = document.createElement("link");
    lnk.rel = "stylesheet";
    lnk.href = "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap";
    document.head.appendChild(lnk);

    function checkMobile() { setIsMobile(window.innerWidth < 700); }
    checkMobile();
    window.addEventListener("resize", checkMobile);

    (async function() {
      try {
        var todayStr = new Date().toISOString().split("T")[0];
        var results = await Promise.all([
          window.storage && window.storage.get("nx-tasks"),
          window.storage && window.storage.get("nx-notes"),
          window.storage && window.storage.get("nx-habits"),
          window.storage && window.storage.get("nx-theme"),
          window.storage && window.storage.get("nx-hdate"),
        ]);
        if (results[0] && results[0].value) setTasks(JSON.parse(results[0].value));
        if (results[1] && results[1].value) setNotes(JSON.parse(results[1].value));
        if (results[2] && results[2].value) {
          var parsed = JSON.parse(results[2].value);
          if (!results[4] || results[4].value !== todayStr) {
            parsed = parsed.map(function(h){ return Object.assign({}, h, { done:false }); });
            if (window.storage) window.storage.set("nx-hdate", todayStr);
          }
          setHabits(parsed);
        }
        if (results[3] && results[3].value && THEMES[results[3].value]) setThemeId(results[3].value);
      } catch(e) {}
      setMounted(true);
    })();

    if (typeof Notification !== "undefined") setPermission(Notification.permission);

    return function() { window.removeEventListener("resize", checkMobile); };
  }, []);

  var save = useCallback(function(t, n, h) {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async function() {
      try {
        if (window.storage) {
          await window.storage.set("nx-tasks",  JSON.stringify(t));
          await window.storage.set("nx-notes",  JSON.stringify(n));
          await window.storage.set("nx-habits", JSON.stringify(h));
        }
      } catch(e) {}
    }, 800);
  }, []);

  useEffect(function() { if (mounted) save(tasks, notes, habits); }, [tasks, notes, habits, mounted]);
  useEffect(function() { if (mounted && window.storage) window.storage.set("nx-theme", themeId); }, [themeId, mounted]);
  useEffect(function() { setSectionTab("notes"); }, [active]);

  useEffect(function() {
    function handler(e) {
      var tag = e.target.tagName;
      var editing = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearchOpen(function(v){ return !v; }); return; }
      if ((e.metaKey || e.ctrlKey) && e.key === "j") { e.preventDefault(); setCaptureOpen(function(v){ return !v; }); return; }
      if (editing) return;
      if (e.key === "Escape") { setSearchOpen(false); setCaptureOpen(false); setThemeOpen(false); setNavDrawer(false); }
    }
    window.addEventListener("keydown", handler);
    return function() { window.removeEventListener("keydown", handler); };
  }, []);

  async function requestPermission() {
    if (typeof Notification !== "undefined") {
      var p = await Notification.requestPermission();
      setPermission(p);
    }
  }

  function exportData() {
    var blob = new Blob([JSON.stringify({ tasks:tasks, notes:notes, habits:habits, exportedAt:new Date().toISOString() }, null, 2)], { type:"application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "nexus-backup-" + new Date().toISOString().split("T")[0] + ".json";
    a.click();
    URL.revokeObjectURL(url);
  }

  K = THEMES[themeId] || THEMES.linen;
  var sec    = SECTIONS.find(function(s){ return s.id === active; });
  var accent = (sec && sec.color) || K.accent;

  function pendingCount(sid) {
    return (tasks[sid] || []).filter(function(t){ return !t.done; }).length;
  }

  // ── Bottom nav sections (most-used 4) ──
  var BOT_NAV = [
    { id:"home",       emoji:"🏠", label:"Home" },
    { id:"calendar",   emoji:"📅", label:"Calendar" },
    { id:"sidehustle", emoji:"⚡",  label:"Hustle" },
    { id:"thoughts",   emoji:"🧠", label:"Thoughts" },
  ];

  var mobileCSS = [
    "*{box-sizing:border-box;margin:0;padding:0;-webkit-font-smoothing:antialiased;-webkit-tap-highlight-color:transparent;}",
    "::-webkit-scrollbar{width:3px}",
    "::-webkit-scrollbar-track{background:" + K.surf + "}",
    "::-webkit-scrollbar-thumb{background:" + K.bdrSm + ";border-radius:4px}",
    "button,a{-webkit-tap-highlight-color:transparent;touch-action:manipulation;}",
    "button:focus,input:focus,textarea:focus,select:focus{outline:none}",
    "select{-webkit-appearance:none}",
    "body{overscroll-behavior:none;}"
  ].join("");

  // ── MOBILE LAYOUT ──────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div style={{ display:"flex", flexDirection:"column", height:"100vh", width:"100%",
        background:K.bg, fontFamily:"'Inter',sans-serif", color:K.txt, overflow:"hidden",
        opacity: mounted ? 1 : 0, transition:"opacity 0.4s" }}>
        <style>{mobileCSS}</style>

        {/* ── Mobile Topbar ── */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"0 14px", minHeight:"54px", flexShrink:0,
          background:K.surf, borderBottom:"1.5px solid " + K.bdr,
          boxShadow:"0 2px 10px rgba(0,0,0,0.07)", zIndex:20, position:"relative" }}>

          {/* Left: logo + title */}
          <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
            <div style={{ width:"30px", height:"30px", borderRadius:"8px", background:K.brand,
              display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="2" width="12" height="2.5" rx="1.25" fill="#D4A843"/>
                <rect x="1" y="6.5" width="8" height="2.5" rx="1.25" fill="#D4A843" opacity="0.7"/>
                <rect x="1" y="11" width="5" height="2" rx="1" fill="#D4A843" opacity="0.4"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily:"'Instrument Serif',serif", fontSize:"17px",
                fontStyle:"italic", color:K.txt, lineHeight:1 }}>
                {sec ? sec.label : "Nexus"}
              </div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"7px",
                color:K.txt3, letterSpacing:"0.1em" }}>
                {new Date().toLocaleDateString("en-IN", { weekday:"short", day:"2-digit", month:"short" }).toUpperCase()}
              </div>
            </div>
          </div>

          {/* Right: icon buttons */}
          <div style={{ display:"flex", gap:"6px", alignItems:"center" }}>
            <button onClick={function(){ setSearchOpen(true); }}
              style={{ background:K.cardLo, border:"1.5px solid " + K.bdrSm,
                borderRadius:"10px", width:"38px", height:"38px",
                display:"flex", alignItems:"center", justifyContent:"center",
                cursor:"pointer", color:K.txt2 }}>
              <Search size={16}/>
            </button>
            <button onClick={function(){ setCaptureOpen(true); }}
              style={{ background:K.brand, border:"none", borderRadius:"10px",
                width:"38px", height:"38px", display:"flex", alignItems:"center",
                justifyContent:"center", cursor:"pointer", color:K.bg }}>
              <Plus size={18}/>
            </button>
            <button onClick={function(){ setAiOpen(function(v){ return !v; }); }}
              style={{ background: aiOpen ? K.brand : K.cardLo,
                border:"1.5px solid " + (aiOpen ? K.brand : K.bdrSm),
                borderRadius:"10px", width:"38px", height:"38px",
                display:"flex", alignItems:"center", justifyContent:"center",
                cursor:"pointer", color: aiOpen ? K.bg : K.txt2 }}>
              <Sparkles size={16}/>
            </button>
          </div>
        </div>

        {/* ── Main scroll area ── */}
        <div style={{ flex:1, overflowY:"auto", overflowX:"hidden",
          padding:"14px 14px", WebkitOverflowScrolling:"touch",
          paddingBottom:"80px" }}>
          {active === "home" && (
            <HomeView tasks={tasks} habits={habits} setHabits={setHabits}
              homeTab={homeTab} setHomeTab={setHomeTab} setActive={setActive}
              permission={permission} requestPermission={requestPermission}
              setAiOpen={setAiOpen} setReviewOpen={setReviewOpen} isMobile={true}/>
          )}
          {active === "calendar" && (
            <CalendarView tasks={tasks} onNavigate={function(sid){ setActive(sid); }} isMobile={true}/>
          )}
          {active !== "home" && active !== "calendar" && (
            <SectionView key={active} active={active}
              tasks={tasks} setTasks={setTasks}
              notes={notes} setNotes={setNotes}
              sectionTab={sectionTab} setSectionTab={setSectionTab}
              accentColor={accent} setActive={setActive} isMobile={true}/>
          )}
        </div>

        {/* ── Bottom Navigation Bar ── */}
        <div style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:50,
          background:K.surf, borderTop:"1.5px solid " + K.bdr,
          display:"flex", alignItems:"stretch",
          boxShadow:"0 -4px 20px rgba(0,0,0,0.1)",
          paddingBottom:"env(safe-area-inset-bottom)" }}>

          {BOT_NAV.map(function(n) {
            var isAct = active === n.id;
            var p = pendingCount(n.id);
            return (
              <div key={n.id} onClick={function(){ setActive(n.id); setNavDrawer(false); }}
                style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center",
                  justifyContent:"center", padding:"8px 4px 10px",
                  cursor:"pointer", position:"relative",
                  borderTop: isAct ? "2.5px solid " + accent : "2.5px solid transparent",
                  transition:"border-color 0.15s" }}>
                <span style={{ fontSize:"20px", lineHeight:1 }}>{n.emoji}</span>
                <span style={{ fontFamily:"'Inter',sans-serif", fontSize:"9px",
                  color: isAct ? accent : K.txt3, fontWeight: isAct ? 700 : 400,
                  marginTop:"3px" }}>{n.label}</span>
                {p > 0 && (
                  <span style={{ position:"absolute", top:"6px", right:"calc(50% - 16px)",
                    background:K.red, color:"#fff", fontSize:"7px", fontWeight:700,
                    minWidth:"14px", height:"14px", borderRadius:"7px",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    padding:"0 3px" }}>{p}</span>
                )}
              </div>
            );
          })}

          {/* More button */}
          <div onClick={function(){ setNavDrawer(function(v){ return !v; }); }}
            style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center",
              justifyContent:"center", padding:"8px 4px 10px", cursor:"pointer",
              borderTop: navDrawer ? "2.5px solid " + K.txt3 : "2.5px solid transparent" }}>
            <span style={{ fontSize:"20px", lineHeight:1 }}>☰</span>
            <span style={{ fontFamily:"'Inter',sans-serif", fontSize:"9px",
              color: navDrawer ? K.txt2 : K.txt3, fontWeight: navDrawer ? 700 : 400,
              marginTop:"3px" }}>More</span>
          </div>
        </div>

        {/* ── Nav Drawer (More sheet) ── */}
        {navDrawer && (
          <div style={{ position:"fixed", inset:0, zIndex:45 }}
            onClick={function(){ setNavDrawer(false); }}>
            <div style={{ position:"absolute", bottom:"62px", left:0, right:0,
              background:K.surf, borderTop:"2px solid " + K.bdr,
              borderRadius:"20px 20px 0 0",
              boxShadow:"0 -8px 30px rgba(0,0,0,0.2)",
              maxHeight:"70vh", overflowY:"auto",
              paddingBottom:"env(safe-area-inset-bottom)" }}
              onClick={function(e){ e.stopPropagation(); }}>

              {/* Handle */}
              <div style={{ display:"flex", justifyContent:"center", padding:"10px 0 6px" }}>
                <div style={{ width:"36px", height:"4px", borderRadius:"2px", background:K.bdrSm }}/>
              </div>

              {/* Header row */}
              <div style={{ padding:"4px 18px 10px", display:"flex",
                alignItems:"center", justifyContent:"space-between" }}>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"10px",
                  fontWeight:700, color:K.txt3, letterSpacing:"0.1em" }}>ALL SECTIONS</span>
                <div style={{ display:"flex", gap:"8px" }}>
                  <button onClick={function(){ setReviewOpen(true); setNavDrawer(false); }}
                    style={{ background:K.ctaBg, border:"none", borderRadius:"8px",
                      padding:"5px 10px", fontSize:"10px", color:K.cta,
                      fontFamily:"'Inter',sans-serif", fontWeight:600, cursor:"pointer" }}>
                    Review
                  </button>
                  <button onClick={function(){ setThemeOpen(true); setNavDrawer(false); }}
                    style={{ background:K.cardLo, border:"1px solid " + K.bdrSm,
                      borderRadius:"8px", padding:"5px 10px", fontSize:"10px",
                      color:K.txt2, fontFamily:"'Inter',sans-serif", cursor:"pointer" }}>
                    🎨
                  </button>
                  <button onClick={function(){ exportData(); setNavDrawer(false); }}
                    style={{ background:K.cardLo, border:"1px solid " + K.bdrSm,
                      borderRadius:"8px", padding:"5px 10px", fontSize:"10px",
                      color:K.txt2, fontFamily:"'Inter',sans-serif", cursor:"pointer" }}>
                    <Download size={12}/>
                  </button>
                </div>
              </div>

              {/* Section grid */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr",
                gap:"8px", padding:"0 14px 18px" }}>
                {SECTIONS.map(function(s) {
                  var isAct = active === s.id;
                  var p = pendingCount(s.id);
                  return (
                    <div key={s.id}
                      onClick={function(){ setActive(s.id); setNavDrawer(false); }}
                      style={{ background: isAct ? (s.color || K.accent) + "20" : K.card,
                        border:"1.5px solid " + (isAct ? (s.color || K.accent) + "66" : K.bdrSm),
                        borderRadius:"12px", padding:"12px 8px",
                        display:"flex", flexDirection:"column",
                        alignItems:"center", gap:"5px", cursor:"pointer",
                        position:"relative" }}>
                      <span style={{ fontSize:"22px" }}>{s.emoji}</span>
                      <span style={{ fontFamily:"'Inter',sans-serif", fontSize:"10px",
                        fontWeight: isAct ? 700 : 500, color: isAct ? (s.color||K.accent) : K.txt2,
                        textAlign:"center", lineHeight:1.2 }}>{s.label}</span>
                      {p > 0 && (
                        <span style={{ position:"absolute", top:"6px", right:"6px",
                          background:(s.color||K.accent)+"22", color:s.color||K.accent,
                          fontSize:"8px", fontWeight:700, minWidth:"14px", height:"14px",
                          borderRadius:"7px", display:"flex", alignItems:"center",
                          justifyContent:"center", padding:"0 3px" }}>{p}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── AI Panel — full-screen on mobile ── */}
        {aiOpen && (
          <div style={{ position:"fixed", inset:0, zIndex:80,
            background:K.card, display:"flex", flexDirection:"column" }}>
            <div style={{ padding:"14px 16px", borderBottom:"1.5px solid " + K.bdrSm,
              display:"flex", alignItems:"center", justifyContent:"space-between",
              background:K.surf, flexShrink:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                <Sparkles size={15} style={{ color:K.accent }}/>
                <span style={{ fontFamily:"'Inter',sans-serif", fontSize:"14px",
                  fontWeight:700, color:K.txt }}>Nexus AI</span>
              </div>
              <button onClick={function(){ setAiOpen(false); }}
                style={{ background:"transparent", border:"none", cursor:"pointer",
                  color:K.txt2, display:"flex", alignItems:"center",
                  justifyContent:"center", width:"36px", height:"36px" }}>
                <X size={20}/>
              </button>
            </div>
            <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
              <AIAssistant open={true} onClose={function(){ setAiOpen(false); }}
                tasks={tasks} habits={habits} embedded={true}/>
            </div>
          </div>
        )}

        <SearchModal open={searchOpen} onClose={function(){ setSearchOpen(false); }}
          tasks={tasks} notes={notes} setActive={setActive} setSectionTab={setSectionTab}/>
        <QuickCapture open={captureOpen} onClose={function(){ setCaptureOpen(false); }} setTasks={setTasks}/>
        <ThemePicker current={themeId} onChange={setThemeId} open={themeOpen} onClose={function(){ setThemeOpen(false); }}/>
        <WeeklyReview open={reviewOpen} onClose={function(){ setReviewOpen(false); }} tasks={tasks} habits={habits}/>
      </div>
    );
  }

  // ── DESKTOP LAYOUT ─────────────────────────────────────────────────────────
  return (
    <div style={{ display:"flex", height:"100vh", width:"100%", background:K.bg,
      fontFamily:"'Inter',sans-serif", color:K.txt, overflow:"hidden",
      opacity: mounted ? 1 : 0, transition:"opacity 0.4s" }}>
      <style>{mobileCSS}</style>

      {/* Sidebar */}
      <div style={{ width: sidebarOpen ? "215px" : "58px", background:K.surf,
        borderRight:"2px solid " + K.bdr, display:"flex", flexDirection:"column",
        transition:"width 0.28s", overflow:"hidden", flexShrink:0,
        zIndex:10, boxShadow:"4px 0 18px rgba(0,0,0,0.07)" }}>
        <div style={{ padding:"14px 10px", borderBottom:"1.5px solid " + K.bdrSm,
          display:"flex", alignItems:"center",
          justifyContent: sidebarOpen ? "space-between" : "center", minHeight:"58px" }}>
          {sidebarOpen && (
            <div style={{ display:"flex", alignItems:"center", gap:"9px" }}>
              <div style={{ width:"28px", height:"28px", borderRadius:"7px", background:K.brand,
                display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="2" width="12" height="2.5" rx="1.25" fill="#D4A843"/>
                  <rect x="1" y="6.5" width="8" height="2.5" rx="1.25" fill="#D4A843" opacity="0.7"/>
                  <rect x="1" y="11" width="5" height="2" rx="1" fill="#D4A843" opacity="0.4"/>
                </svg>
              </div>
              <div>
                <div style={{ fontFamily:"'Inter',sans-serif", fontSize:"12px", fontWeight:700,
                  color:K.txt, letterSpacing:"0.08em" }}>NEXUS</div>
                <div style={{ fontSize:"8px", color:K.txt3, letterSpacing:"0.12em" }}>LIFE OS</div>
              </div>
            </div>
          )}
          <button onClick={function(){ setSidebarOpen(function(v){ return !v; }); }}
            style={{ background:K.card, border:"1.5px solid " + K.bdrSm, color:K.txt2,
              cursor:"pointer", width:"28px", height:"28px", borderRadius:"7px",
              display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            {sidebarOpen ? <ChevronLeft size={13}/> : <ChevronRight size={13}/>}
          </button>
        </div>
        <nav style={{ flex:1, padding:"7px", display:"flex", flexDirection:"column",
          gap:"2px", overflowY:"auto" }}>
          {SECTIONS.map(function(s) {
            var p = pendingCount(s.id);
            var isAct = active === s.id;
            return (
              <div key={s.id} onClick={function(){ setActive(s.id); }}
                style={{ display:"flex", alignItems:"center", gap:"9px", padding:"8px 9px",
                  borderRadius:"9px", cursor:"pointer",
                  background: isAct ? K.brand : "transparent", transition:"all 0.13s" }}
                onMouseEnter={function(e){ if (!isAct) e.currentTarget.style.background = "rgba(128,128,128,0.08)"; }}
                onMouseLeave={function(e){ if (!isAct) e.currentTarget.style.background = "transparent"; }}>
                <span style={{ width:"17px", textAlign:"center", flexShrink:0, fontSize:"13px" }}>
                  {s.emoji}
                </span>
                <span style={{ fontFamily:"'Inter',sans-serif", fontSize:"11px",
                  fontWeight: isAct ? 600 : 400,
                  color: isAct ? K.bg : K.txt2,
                  opacity: sidebarOpen ? 1 : 0, transition:"opacity 0.2s",
                  flex:1, whiteSpace:"nowrap" }}>
                  {s.label}
                </span>
                {sidebarOpen && s.id !== "home" && s.id !== "calendar" && p > 0 && (
                  <span style={{ fontSize:"8px",
                    background:(s.color || K.accent) + "22",
                    color: s.color || K.accent,
                    minWidth:"16px", height:"16px", borderRadius:"50%",
                    display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700 }}>
                    {p}
                  </span>
                )}
              </div>
            );
          })}
        </nav>
        <div style={{ padding:"5px 7px 10px", borderTop:"1.5px solid " + K.bdrSm,
          display:"flex", flexDirection:"column", gap:"2px" }}>
          {[
            { icon:<Sparkles size={12}/>, label:"AI Assistant",  fn:function(){ setAiOpen(function(v){return !v;}); },  act:aiOpen },
            { icon:<ClipboardList size={12}/>, label:"Review",   fn:function(){ setReviewOpen(true); },      act:false },
            { icon:<Download size={12}/>,   label:"Export",      fn:exportData,                               act:false },
            { icon:<div style={{ display:"flex", gap:"2px" }}>{[K.accent,K.ctaBg,K.brand].map(function(c,i){ return <span key={i} style={{ width:"5px",height:"5px",borderRadius:"50%",background:c,display:"inline-block" }}/>; })}</div>,
              label:"Appearance", fn:function(){ setThemeOpen(true); }, act:false },
          ].map(function(item, i) {
            return (
              <div key={i} onClick={item.fn}
                style={{ display:"flex", alignItems:"center", gap:"9px", padding:"8px 9px",
                  borderRadius:"9px", cursor:"pointer",
                  background: item.act ? K.bdr : "transparent", transition:"all 0.13s" }}
                onMouseEnter={function(e){ if (!item.act) e.currentTarget.style.background = "rgba(128,128,128,0.08)"; }}
                onMouseLeave={function(e){ if (!item.act) e.currentTarget.style.background = item.act ? K.bdr : "transparent"; }}>
                <span style={{ width:"17px", textAlign:"center", flexShrink:0,
                  color: item.act ? K.ctaBg : K.txt3,
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {item.icon}
                </span>
                <span style={{ fontFamily:"'Inter',sans-serif", fontSize:"11px",
                  color: item.act ? K.bg : K.txt2,
                  opacity: sidebarOpen ? 1 : 0, whiteSpace:"nowrap", transition:"opacity 0.2s" }}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main */}
      <main style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden",
        marginRight: aiOpen ? "370px" : "0", transition:"margin-right 0.28s" }}>
        <div style={{ padding:"0 24px", borderBottom:"2px solid " + K.bdr,
          display:"flex", alignItems:"center", justifyContent:"space-between",
          background:K.surf, flexShrink:0, minHeight:"58px",
          boxShadow:"0 4px 14px rgba(0,0,0,0.05)", zIndex:5, position:"relative" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
            <div style={{ width:"3px", height:"22px", borderRadius:"2px",
              background:accent, flexShrink:0 }}/>
            <div>
              <div style={{ fontFamily:"'Instrument Serif',serif", fontSize:"19px",
                fontStyle:"italic", color:K.txt, lineHeight:1 }}>
                {sec ? sec.label : "Home"}
              </div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"8px",
                color:K.txt3, letterSpacing:"0.1em", marginTop:"3px" }}>
                {new Date().toLocaleDateString("en-IN", { weekday:"short", day:"2-digit", month:"short", year:"numeric" }).toUpperCase()}
              </div>
            </div>
          </div>
          <div style={{ display:"flex", gap:"7px", alignItems:"center" }}>
            <button onClick={function(){ setSearchOpen(true); }}
              style={{ background:K.cardLo, border:"1.5px solid " + K.bdrSm, borderRadius:"9px",
                padding:"6px 12px", cursor:"pointer", display:"flex", alignItems:"center",
                gap:"5px", color:K.txt3, fontFamily:"'JetBrains Mono',monospace", fontSize:"9px" }}>
              <Search size={12}/> Cmd+K
            </button>
            <button onClick={function(){ setCaptureOpen(true); }}
              style={{ background:K.brand, border:"none", borderRadius:"9px",
                padding:"6px 12px", cursor:"pointer",
                display:"flex", alignItems:"center", gap:"5px",
                color:K.bg, fontFamily:"'Inter',sans-serif", fontSize:"10px", fontWeight:600 }}>
              <Plus size={12}/> Capture
            </button>
            <button onClick={function(){ setAiOpen(function(v){return !v;}); }}
              style={{ background: aiOpen ? K.brand : "transparent",
                border:"1.5px solid " + K.bdr, borderRadius:"100px",
                padding:"6px 14px", cursor:"pointer",
                display:"flex", alignItems:"center", gap:"5px",
                color: aiOpen ? K.bg : K.txt2,
                fontFamily:"'Inter',sans-serif", fontSize:"10px", fontWeight:600 }}>
              <Sparkles size={11}/> AI
            </button>
            <button onClick={function(){ setReviewOpen(true); }}
              style={{ background:K.ctaBg, border:"none", borderRadius:"100px",
                padding:"6px 14px", cursor:"pointer",
                display:"flex", alignItems:"center", gap:"5px",
                color:K.cta, fontFamily:"'Inter',sans-serif", fontSize:"10px", fontWeight:600 }}>
              <ClipboardList size={11}/> Review
            </button>
          </div>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"20px 24px" }}>
          {active === "home" && (
            <HomeView tasks={tasks} habits={habits} setHabits={setHabits}
              homeTab={homeTab} setHomeTab={setHomeTab} setActive={setActive}
              permission={permission} requestPermission={requestPermission}
              setAiOpen={setAiOpen} setReviewOpen={setReviewOpen}/>
          )}
          {active === "calendar" && (
            <CalendarView tasks={tasks} onNavigate={function(sid){ setActive(sid); }}/>
          )}
          {active !== "home" && active !== "calendar" && (
            <SectionView key={active} active={active}
              tasks={tasks} setTasks={setTasks}
              notes={notes} setNotes={setNotes}
              sectionTab={sectionTab} setSectionTab={setSectionTab}
              accentColor={accent} setActive={setActive}/>
          )}
        </div>
      </main>

      <SearchModal open={searchOpen} onClose={function(){ setSearchOpen(false); }}
        tasks={tasks} notes={notes} setActive={setActive} setSectionTab={setSectionTab}/>
      <QuickCapture open={captureOpen} onClose={function(){ setCaptureOpen(false); }} setTasks={setTasks}/>
      <ThemePicker current={themeId} onChange={setThemeId} open={themeOpen} onClose={function(){ setThemeOpen(false); }}/>
      <AIAssistant open={aiOpen} onClose={function(){ setAiOpen(false); }} tasks={tasks} habits={habits}/>
      <WeeklyReview open={reviewOpen} onClose={function(){ setReviewOpen(false); }} tasks={tasks} habits={habits}/>
    </div>
  );
}
