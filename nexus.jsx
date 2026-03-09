import { useState, useEffect, useRef, useCallback } from "react";
// Professional fonts injected via Google Fonts (done in useEffect)
import { Home, Heart, Zap, GraduationCap, Briefcase, Brain, TrendingUp, Bot, BookOpen, Users, CalendarDays, Sparkles, ClipboardList, X, Pencil, Trash2, Plus, Bell, BellOff, ChevronLeft, ChevronRight, Check, FileText, CheckSquare, Network, LayoutGrid, BarChart2, Diamond, Target, Search, ArrowRight, Flame, Activity, DollarSign, BookMarked, Wifi } from "lucide-react";
import { RadialBarChart, RadialBar, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const FONT_LINK = "https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600;700&display=swap";

const SECTIONS = [
  { id:"home",       label:"Home",        icon:"🏠", color:"#F59E0B" },
  { id:"health",     label:"Health",      icon:"❤️", color:"#10B981" },
  { id:"sidehustle", label:"Side Hustle", icon:"⚡", color:"#F59E0B" },
  { id:"college",    label:"College",     icon:"🎓", color:"#60A5FA" },
  { id:"career",     label:"Career",      icon:"💼", color:"#A78BFA" },
  { id:"thoughts",   label:"Thoughts",    icon:"🧠", color:"#F472B6" },
  { id:"finance",    label:"Finance",     icon:"📈", color:"#34D399" },
  { id:"ai",         label:"AI",          icon:"🤖", color:"#FB923C" },
  { id:"reading",    label:"Reading",     icon:"📚", color:"#E879F9" },
  { id:"network",    label:"Network",     icon:"🌐", color:"#38BDF8" },
  { id:"calendar",   label:"Calendar",    icon:"📅", color:"#818CF8" },
];

// Lucide icon map per section
const ICON_MAP = {
  home:       <Home size={16}/>,
  health:     <Activity size={16}/>,
  sidehustle: <Zap size={16}/>,
  college:    <GraduationCap size={16}/>,
  career:     <Briefcase size={16}/>,
  thoughts:   <Brain size={16}/>,
  finance:    <TrendingUp size={16}/>,
  ai:         <Bot size={16}/>,
  reading:    <BookOpen size={16}/>,
  network:    <Wifi size={16}/>,
  calendar:   <CalendarDays size={16}/>,
};
const SecIcon = ({ id, size=16, color }) => {
  const icons = {
    home:       Home, health: Activity, sidehustle: Zap,
    college:    GraduationCap, career: Briefcase, thoughts: Brain,
    finance:    TrendingUp, ai: Bot, reading: BookOpen,
    network:    Wifi, calendar: CalendarDays,
  };
  const Ic = icons[id] || Home;
  return <Ic size={size} color={color} strokeWidth={2}/>;
};

const DEFAULT_HABITS = [
  { id:1, label:"Morning pages", streak:7,  done:false },
  { id:2, label:"Exercise",       streak:4,  done:false },
  { id:3, label:"Read 20 mins",   streak:12, done:false },
  { id:4, label:"Cold shower",    streak:2,  done:false },
  { id:5, label:"No phone 1hr",   streak:0,  done:false },
];

const DEFAULT_TASKS = {
  health:     [{ id:1,text:"Book dentist appointment",           deadline:"2026-03-10",done:false,priority:"high"   },
               { id:2,text:"Try new workout routine",            deadline:"2026-03-08",done:false,priority:"medium" }],
  sidehustle: [{ id:1,text:"Finish client proposal",             deadline:"2026-03-07",done:false,priority:"high"   },
               { id:2,text:"Post on LinkedIn",                   deadline:"2026-03-06",done:true, priority:"low"    }],
  college:    [{ id:1,text:"Submit — Data Structures assignment", deadline:"2026-03-09",done:false,priority:"high"   },
               { id:2,text:"Group project meeting",              deadline:"2026-03-11",done:false,priority:"medium" }],
  career:     [{ id:1,text:"Update resume",                      deadline:"2026-03-15",done:false,priority:"medium" },
               { id:2,text:"Apply to 3 internships",             deadline:"2026-03-12",done:false,priority:"high"   }],
  thoughts:   [],
  finance:    [{ id:1,text:"Track monthly expenses",             deadline:"2026-03-31",done:false,priority:"medium" }],
  ai:         [{ id:1,text:"Explore Cursor IDE",                 deadline:"2026-03-08",done:false,priority:"low"    }],
  reading:    [{ id:1,text:"Finish Zero to One",                 deadline:"2026-03-20",done:false,priority:"medium" }],
  network:    [{ id:1,text:"Follow up with mentor",              deadline:"2026-03-07",done:false,priority:"high"   }],
};

const DEFAULT_NOTES = {
  health:     "## Health Notes\n\nFocus areas:\n- Sleep consistency (10pm target)\n- Reduce caffeine after 2pm\n- Weekly weigh-in every Monday",
  sidehustle: "## Side Hustle Ideas\n\n→ AI tools directory\n→ Notion templates for students\n→ SaaS agency (in progress!)\n\nMonthly revenue goal: 10,000",
  college:    "## Semester Notes\n\nGPA target: 8.5+\n\nKey subjects:\n- Data Structures\n- DBMS\n- Operating Systems",
  career:     "## Career Roadmap\n\nTarget: Product/Tech role\nSkills: AI/ML, System Design\n\nConnections:\n- PM at a startup\n- Senior dev at FAANG",
  thoughts:   "## Thoughts Dump\n\n> The goal is not to be busy. The goal is to be effective.\n\n- What if productivity was measured by outcomes?\n- Build vs buy decision for tools",
  finance:    "## Finance Tracker\n\nMonthly budget: 15,000\nFixed costs: 8,000\nSavings goal: 20%",
  ai:         "## AI Experiments\n\nTools:\n- Claude API\n- Bolt.new for prototyping\n- Perplexity for research",
  reading:    "## Reading List\n\n→ Zero to One (current)\n- The Lean Startup (done)\n- Deep Work\n- Atomic Habits",
  network:    "## Network Notes\n\nMentors: reach out monthly\nPeers: weekly accountability call",
};

const REVIEW_QUESTIONS = [
  { id:"wins",      q:"What were your biggest wins this week?",          placeholder:"e.g. Finished Nexus, hit gym 4x..." },
  { id:"struggles", q:"What did you struggle with or leave unfinished?", placeholder:"e.g. Procrastinated on career research..." },
  { id:"learned",   q:"What is the most important thing you learned?",   placeholder:"e.g. Learned about Supabase..." },
  { id:"grateful",  q:"What are you grateful for this week?",            placeholder:"e.g. Good health, family..." },
  { id:"nextweek",  q:"What are your top 3 priorities for next week?",   placeholder:"1.\n2.\n3." },
  { id:"selfcheck", q:"How is your mental & physical energy? (1-10)",    placeholder:"Rate + explain briefly..." },
];

const priorityColors = { high:"#C8321C", medium:"#E05828", low:"#9C9278" };

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const diff = Math.ceil((d - new Date()) / 86400000);
  if (diff < 0)   return { label:`${Math.abs(diff)}d overdue`, color:"#EF4444" };
  if (diff === 0) return { label:"Today",    color:"#F59E0B" };
  if (diff === 1) return { label:"Tomorrow", color:"#FB923C" };
  return { label:`${diff}d left`, color:"#6B7280" };
}

// ── Notification System ───────────────────────────────────────────────
function useNotifications(tasks) {
  const [permission, setPermission] = useState(Notification?.permission || "default");
  const [notifLog,   setNotifLog]   = useState([]);

  const requestPermission = async () => {
    if (!("Notification" in window)) return;
    const p = await Notification.requestPermission();
    setPermission(p);
    if (p === "granted") checkAndNotify(tasks, true);
  };

  const checkAndNotify = useCallback((currentTasks, force = false) => {
    if (permission !== "granted" && !force) return;
    const now  = new Date();
    const logs = [];
    Object.entries(currentTasks).forEach(([sec, list]) => {
      list.filter(t => !t.done).forEach(t => {
        const d    = new Date(t.deadline);
        const diff = Math.ceil((d - now) / 86400000);
        if (diff <= 1 && diff >= 0) {
          const msg = diff === 0 ? `Due TODAY: ${t.text}` : `Due tomorrow: ${t.text}`;
          logs.push({ sec, text:t.text, diff, msg, color: SECTIONS.find(s=>s.id===sec)?.color || "#F59E0B" });
          try {
            new Notification(`Nexus — ${sec.charAt(0).toUpperCase()+sec.slice(1)}`, {
              body: msg, icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%230D0D10'/><text y='22' x='8' font-size='18'>⌂</text></svg>"
            });
          } catch {}
        }
        if (diff < 0) {
          logs.push({ sec, text:t.text, diff, msg:`OVERDUE: ${t.text}`, color:"#EF4444" });
        }
      });
    });
    setNotifLog(logs);
  }, [permission]);

  useEffect(() => {
    checkAndNotify(tasks);
    const interval = setInterval(() => checkAndNotify(tasks), 60000 * 30);
    return () => clearInterval(interval);
  }, [tasks, checkAndNotify]);

  return { permission, requestPermission, notifLog };
}

// ── Mind Map ─────────────────────────────────────────────────────────
// Architecture:
//   tree    = pure structure { id, label, color, children[], collapsed }
//   posMap  = { [id]: {x, y} }   ← positions NEVER stored inside tree
//   treeRef = always-fresh ref for drag closure (avoids stale state)
//
// UX design:
//   Single-click  = SELECT node (highlights + shows action bar)
//   Double-click  = EDIT label inline
//   Drag node     = MOVE it (+ whole subtree)
//   Drag bg       = PAN canvas
//   Scroll        = ZOOM
//   Right-click   = context menu
//   Toolbar "＋"  = add child of SELECTED node (or root if nothing selected)
//   Toolbar "↺"   = rebuild layout from tasks/notes

const MM_NW = 152, MM_NH = 36, MM_LGAP = 210, MM_VGAP = 14;
const MM_SYS = new Set(["tasks","notes","heads","g-high","g-med","g-low","g-done"]);

function mmMk(id, label, color, children = []) {
  return { id, label, color, children, collapsed: false };
}
function mmFind(node, id) {
  if (!node) return null;
  if (node.id === id) return node;
  for (const c of node.children) { const r = mmFind(c, id); if (r) return r; }
  return null;
}
function mmClone(n) { return JSON.parse(JSON.stringify(n)); }
function mmSubH(node) {
  if (!node || node.collapsed || !node.children.length) return MM_NH + MM_VGAP;
  return node.children.reduce((s, c) => s + mmSubH(c), 0);
}
function mmLayout(node, pm, depth, yTop) {
  const x = depth * MM_LGAP + 20;
  if (node.collapsed || !node.children.length) {
    pm[node.id] = { x, y: yTop + MM_NH / 2 };
    return;
  }
  let y = yTop;
  node.children.forEach(c => { mmLayout(c, pm, depth + 1, y); y += mmSubH(c); });
  const ys = node.children.map(c => pm[c.id]?.y ?? 0);
  pm[node.id] = { x, y: (ys[0] + ys[ys.length - 1]) / 2 };
}
function mmFlatten(node, out = []) {
  if (!node) return out;
  out.push(node);
  if (!node.collapsed) node.children.forEach(c => mmFlatten(c, out));
  return out;
}
function mmEdges(node, out = []) {
  if (!node || node.collapsed) return out;
  node.children.forEach(c => { out.push([node.id, c.id]); mmEdges(c, out); });
  return out;
}
function mmAllIds(node, out = new Set()) {
  if (!node) return out;
  out.add(node.id);
  if (!node.collapsed) node.children.forEach(c => mmAllIds(c, out));
  return out;
}

function MindMap({ sectionId, tasks, notes, setNotes, color }) {
  const boxRef     = useRef(null);
  const treeRef    = useRef(null);   // always fresh — used inside drag handlers
  const posMapRef  = useRef({});     // always fresh — used inside drag handlers
  const dragRef    = useRef(null);   // { id, ox, oy } — active drag
  const panRef     = useRef(null);   // { sx, sy }     — active pan
  const mouseRef   = useRef(null);   // { x, y }       — mousedown pos (drag vs click detection)
  const newIdRef   = useRef(null);   // id of node pending notes-sync after edit commit

  const sec = SECTIONS.find(s => s.id === sectionId);

  const [tree,       setTree]       = useState(null);
  const [posMap,     setPosMap]     = useState({});
  const [zoom,       setZoom]       = useState(0.85);
  const [pan,        setPan]        = useState({ x: 40, y: 60 });
  const [selectedId, setSelectedId] = useState(null);
  const [editId,     setEditId]     = useState(null);
  const [editVal,    setEditVal]    = useState("");
  const [ctxMenu,    setCtxMenu]    = useState(null);
  const [search,     setSearch]     = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // Keep refs in sync with state (for drag handlers)
  useEffect(() => { treeRef.current  = tree;   }, [tree]);
  useEffect(() => { posMapRef.current = posMap; }, [posMap]);

  // ── Build fresh tree from section data ─────────────────────────────
  const buildTree = useCallback(() => {
    const pending = (tasks[sectionId] || []).filter(t => !t.done);
    const high = pending.filter(t => t.priority === "high");
    const med  = pending.filter(t => t.priority === "medium");
    const low  = pending.filter(t => t.priority === "low");
    const done = (tasks[sectionId] || []).filter(t => t.done).slice(0, 5);
    const nLines = (notes[sectionId] || "").split("\n")
      .filter(l => /^[→\-•]/.test(l))
      .map(l => l.replace(/^[→\-•]\s*/, "").slice(0, 36));
    const hLines = (notes[sectionId] || "").split("\n")
      .filter(l => l.startsWith("##"))
      .map(l => l.replace(/^#+\s*/, "").slice(0, 36));

    const taskKids = [];
    if (high.length) taskKids.push(mmMk("g-high","🔴 High","#EF4444", high.map((t,i)=>mmMk(`th${i}`,t.text.slice(0,34),"#EF4444"))));
    if (med.length)  taskKids.push(mmMk("g-med", "🟡 Medium","#F59E0B",med.map((t,i) =>mmMk(`tm${i}`,t.text.slice(0,34),"#F59E0B"))));
    if (low.length)  taskKids.push(mmMk("g-low", "⚪ Low","#6B7280",   low.map((t,i) =>mmMk(`tl${i}`,t.text.slice(0,34),"#6B7280"))));
    if (done.length) taskKids.push(mmMk("g-done","✅ Done","#10B981",  done.map((t,i)=>mmMk(`td${i}`,t.text.slice(0,34),"#10B981"))));

    const rootKids = [];
    if (taskKids.length) rootKids.push(mmMk("tasks","📋 Tasks",     color, taskKids));
    if (nLines.length)   rootKids.push(mmMk("notes","💡 Key Points", color, nLines.slice(0,8).map((l,i)=>mmMk(`nl${i}`,l,"#A78BFA"))));
    if (hLines.length)   rootKids.push(mmMk("heads","📌 Topics",     color, hLines.map((l,i)=>mmMk(`hl${i}`,l,"#38BDF8"))));

    return mmMk("root", sec.label, color, rootKids);
  }, [sectionId, tasks, notes, color, sec.label]);

  // ── Layout: build posMap from tree structure ────────────────────────
  // preservedPosMap: if provided, we keep manually-placed node positions
  const runLayout = useCallback((treeIn, preservedPosMap) => {
    const root = treeIn || buildTree();
    const pm = {};
    mmLayout(root, pm, 0, 0);
    // Merge: keep manually moved positions for existing nodes
    if (preservedPosMap) {
      Object.keys(preservedPosMap).forEach(id => {
        if (pm[id] && preservedPosMap[id]?.manual) pm[id] = preservedPosMap[id];
      });
    }
    setTree(root);
    setPosMap(pm);
    treeRef.current   = root;
    posMapRef.current = pm;
  }, [buildTree]);

  // Reset on section change
  useEffect(() => {
    runLayout(null, null);
    setZoom(0.85);
    setPan({ x: 40, y: 60 });
    setSearch("");
    setEditId(null);
    setCtxMenu(null);
    setSelectedId(null);
  }, [sectionId]);

  // ── Derived ────────────────────────────────────────────────────────
  const nodes    = tree ? mmFlatten(tree) : [];
  const edges    = tree ? mmEdges(tree)   : [];
  const matchSet = search.trim()
    ? new Set(nodes.filter(n => n.label.toLowerCase().includes(search.toLowerCase())).map(n => n.id))
    : null;

  const selNode = selectedId && tree ? mmFind(tree, selectedId) : null;

  // ── Coordinates ────────────────────────────────────────────────────
  const toMap = useCallback((cx, cy) => {
    const r = boxRef.current?.getBoundingClientRect() ?? { left:0, top:0 };
    return { x: (cx - r.left - pan.x) / zoom, y: (cy - r.top - pan.y) / zoom };
  }, [pan, zoom]);

  // ── Mouse DOWN on a node ───────────────────────────────────────────
  const onNodeMouseDown = useCallback((e, id) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    mouseRef.current = { x: e.clientX, y: e.clientY, moved: false };
    const mp  = toMap(e.clientX, e.clientY);
    const pos = posMapRef.current[id] ?? { x: 0, y: 0 };
    dragRef.current = { id, ox: mp.x - pos.x, oy: mp.y - pos.y };
  }, [toMap]);

  // ── Mouse DOWN on background ────────────────────────────────────────
  const onBgMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    panRef.current = { sx: e.clientX - pan.x, sy: e.clientY - pan.y };
    mouseRef.current = { x: e.clientX, y: e.clientY, moved: false };
    setCtxMenu(null);
  }, [pan]);

  // ── Mouse MOVE ─────────────────────────────────────────────────────
  const onMouseMove = useCallback((e) => {
    // Track if mouse moved enough to be a drag (>4px)
    if (mouseRef.current && !mouseRef.current.moved) {
      const dx = e.clientX - mouseRef.current.x;
      const dy = e.clientY - mouseRef.current.y;
      if (Math.sqrt(dx*dx + dy*dy) > 4) {
        mouseRef.current.moved = true;
        if (dragRef.current) setIsDragging(true);
      }
    }

    if (dragRef.current && mouseRef.current?.moved) {
      // Drag node — use REFS so we always have fresh data
      const mp   = toMap(e.clientX, e.clientY);
      const id   = dragRef.current.id;
      const newX = mp.x - dragRef.current.ox;
      const newY = mp.y - dragRef.current.oy;
      const curPm = posMapRef.current;
      const dx = newX - (curPm[id]?.x ?? 0);
      const dy = newY - (curPm[id]?.y ?? 0);

      // Move entire subtree
      const subIds = mmAllIds(mmFind(treeRef.current, id));
      const next = { ...curPm };
      subIds.forEach(sid => {
        if (next[sid]) next[sid] = { x: next[sid].x + dx, y: next[sid].y + dy, manual: true };
      });
      posMapRef.current = next;
      setPosMap(next);
    } else if (panRef.current) {
      setPan({ x: e.clientX - panRef.current.sx, y: e.clientY - panRef.current.sy });
    }
  }, [toMap]);

  // ── Mouse UP ────────────────────────────────────────────────────────
  const onMouseUp = useCallback(() => {
    dragRef.current = null;
    panRef.current  = null;
    mouseRef.current = null;
    setIsDragging(false);
  }, []);

  // ── Click on node (select / deselect) ──────────────────────────────
  // Only fires if mouse didn't move (i.e. not a drag)
  const onNodeClick = useCallback((e, id) => {
    if (mouseRef.current?.moved) return; // was a drag, not a click
    e.stopPropagation();
    setSelectedId(prev => prev === id ? null : id);
    setCtxMenu(null);
  }, []);

  // ── Wheel zoom ─────────────────────────────────────────────────────
  const onWheel = useCallback((e) => {
    e.preventDefault();
    setZoom(z => Math.min(2.5, Math.max(0.2, z * (e.deltaY < 0 ? 1.08 : 0.93))));
  }, []);

  // ── Tree mutations ─────────────────────────────────────────────────
  const mutateTree = useCallback((fn) => {
    setTree(prev => {
      if (!prev) return prev;
      const t = mmClone(prev);
      fn(t);
      treeRef.current = t;
      return t;
    });
  }, []);

  const toggleCollapse = useCallback((id) => {
    mutateTree(t => { const n = mmFind(t, id); if (n) n.collapsed = !n.collapsed; });
  }, [mutateTree]);

  // ── ADD NODE: adds as child of selectedId (or root) ────────────────
  const addNode = useCallback(() => {
    const parentId = selectedId || "root";
    const id = `u${Date.now()}`;
    newIdRef.current = id;

    // Position near parent
    const pPos = posMapRef.current[parentId] ?? { x: 200, y: 200 };
    const newPos = {
      x: pPos.x + MM_LGAP,
      y: pPos.y + (Math.random() - 0.5) * 80,
      manual: true
    };

    mutateTree(t => {
      const parent = mmFind(t, parentId) ?? t;
      parent.children.push(mmMk(id, "New idea", color));
      parent.collapsed = false;
    });
    setPosMap(prev => {
      const next = { ...prev, [id]: newPos };
      posMapRef.current = next;
      return next;
    });
    setSelectedId(id);
    setTimeout(() => { setEditId(id); setEditVal("New idea"); }, 40);
  }, [selectedId, color, mutateTree]);

  // ── Edit ────────────────────────────────────────────────────────────
  const startEdit = useCallback((id, lbl) => {
    setEditId(id);
    setEditVal(lbl);
    setSelectedId(id);
  }, []);

  const commitEdit = useCallback(() => {
    if (!editId) return;
    const label = editVal.trim() || "Untitled";
    mutateTree(t => { const n = mmFind(t, editId); if (n) n.label = label; });
    if (newIdRef.current === editId) {
      setNotes(prev => ({
        ...prev,
        [sectionId]: (prev[sectionId] || "").trimEnd() + `\n→ ${label}`
      }));
      newIdRef.current = null;
    }
    setEditId(null);
  }, [editId, editVal, sectionId, setNotes, mutateTree]);

  const cancelEdit = useCallback(() => {
    if (newIdRef.current === editId) {
      // Remove orphan node
      mutateTree(t => {
        const rm = n => { n.children = n.children.filter(c => c.id !== editId); n.children.forEach(rm); };
        rm(t);
      });
      setPosMap(prev => { const n = { ...prev }; delete n[editId]; posMapRef.current = n; return n; });
      newIdRef.current = null;
      setSelectedId(null);
    }
    setEditId(null);
  }, [editId, mutateTree]);

  // ── Delete ──────────────────────────────────────────────────────────
  const deleteNode = useCallback((id) => {
    if (!id || id === "root") return;
    const node = treeRef.current ? mmFind(treeRef.current, id) : null;
    mutateTree(t => {
      const rm = n => { n.children = n.children.filter(c => c.id !== id); n.children.forEach(rm); };
      rm(t);
    });
    setPosMap(prev => { const n = { ...prev }; delete n[id]; posMapRef.current = n; return n; });
    if (selectedId === id) setSelectedId(null);
    if (node) {
      setNotes(prev => {
        const lines = (prev[sectionId] || "").split("\n");
        return { ...prev, [sectionId]: lines.filter(l => !l.replace(/^[→\-•]\s*/, "").startsWith(node.label)).join("\n") };
      });
    }
  }, [mutateTree, selectedId, sectionId, setNotes]);

  // ── Bezier path ─────────────────────────────────────────────────────
  const bezier = (fp, tp) => {
    const x1 = fp.x + MM_NW, y1 = fp.y, x2 = tp.x, y2 = tp.y, cx = (x1 + x2) / 2;
    return `M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}`;
  };

  const btnS = (active) => ({
    background: active ? color + "22" : "transparent",
    border: `1px solid ${active ? color + "55" : "rgba(26,23,16,0.25)"}`,
    color: active ? color : "#7A7468",
    padding: "4px 10px", borderRadius: "6px", cursor: "pointer",
    fontSize: "10px", fontFamily: "'Syne',sans-serif", fontWeight: 700,
    transition: "all 0.15s",
  });

  const addLabel = selNode && selNode.id !== "root"
    ? `＋ Add to "${selNode.label.slice(0,12)}${selNode.label.length>12?"…":""}"`
    : "＋ Add Node";

  return (
    <div style={{ background: "#E9E4CE", borderRadius: "12px", border: "1.5px solid rgba(26,23,16,0.18)", overflow: "hidden", userSelect: "none" }}>

      {/* ── Toolbar ── */}
      <div style={{ padding: "9px 14px", borderBottom: "1.5px solid rgba(26,23,16,0.18)", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
        <span style={{ fontFamily: "'Syne',sans-serif", fontSize: "11px", fontWeight: 700, color: "#A09888" }}>🧠 MIND MAP</span>

        {/* Search */}
        <div style={{ position: "relative" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search nodes..."
            style={{ background: "#F0ECDA", border: "1px solid #2A2A35", color: "#1A1710", padding: "4px 22px 4px 24px", borderRadius: "6px", fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", outline: "none", width: "145px" }} />
          <span style={{ position: "absolute", left: "7px", top: "6px", color: "#8A8478", pointerEvents: "none",display:"flex" }}><Search size={10} strokeWidth={2}/></span>
          {search && <span onClick={() => setSearch("")} style={{ position: "absolute", right: "6px", top: "6px", color: "#9A9488", cursor: "pointer", display:"flex" }}><X size={10} strokeWidth={2}/></span>}
        </div>

        {/* Add node — label shows target */}
        <button onClick={addNode}
          style={{ ...btnS(false), color, borderColor: color + "55", background: color + "11", whiteSpace: "nowrap" }}>
          {addLabel}
        </button>

        {/* Selected node quick actions */}
        {selNode && (
          <div style={{ display: "flex", gap: "4px" }}>
            <button onClick={() => startEdit(selNode.id, selNode.label)} style={btnS(false)}>✏ Edit</button>
            {selNode.children.length > 0 && (
              <button onClick={() => toggleCollapse(selNode.id)} style={btnS(false)}>
                {selNode.collapsed ? "▶ Expand" : "▼ Collapse"}
              </button>
            )}
            {selNode.id !== "root" && (
              <button onClick={() => deleteNode(selNode.id)}
                style={{ ...btnS(false), color: "#EF4444", borderColor: "#EF444433" }}>🗑</button>
            )}
          </div>
        )}

        {/* Zoom + layout */}
        <div style={{ marginLeft: "auto", display: "flex", gap: "4px" }}>
          <button onClick={() => setZoom(z => Math.min(2.5, z + 0.15))} style={btnS(false)}>＋</button>
          <button onClick={() => setZoom(z => Math.max(0.2, z - 0.15))} style={btnS(false)}>－</button>
          <button onClick={() => setZoom(1)} style={btnS(Math.abs(zoom - 1) < 0.05)}>{Math.round(zoom * 100)}%</button>
          <button onClick={() => { setZoom(0.85); setPan({ x: 40, y: 60 }); }} style={btnS(false)}>⌖ Fit</button>
          <button onClick={() => runLayout(null, posMap)} style={{ ...btnS(false), color, borderColor: color+"44", background: color+"11" }}><LayoutGrid size={11} strokeWidth={2}/> Layout</button>
        </div>
      </div>

      {/* ── Hint bar ── */}
      <div style={{ padding: "3px 14px", background: "#080808", borderBottom: "1px solid #111", fontSize: "9px", color: "rgba(26,23,16,0.25)", fontFamily: "'JetBrains Mono',monospace", display: "flex", gap: "14px", flexWrap: "wrap" }}>
        <span>click = select · dbl-click = rename · drag node = move · drag bg = pan · scroll = zoom · right-click = menu</span>
      </div>

      {/* ── Canvas ── */}
      <div
        ref={boxRef}
        style={{ position: "relative", height: "520px", overflow: "hidden", cursor: isDragging ? "grabbing" : "default" }}
        onMouseDown={onBgMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onWheel={onWheel}
        onClick={() => { setSelectedId(null); setCtxMenu(null); }}
      >
        <svg width="100%" height="100%" style={{ display: "block" }}>
          <defs>
            <filter id="mm-glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            <filter id="mm-sel"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>

          <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>

            {/* Edges */}
            {edges.map(([fId, tId], i) => {
              const fp = posMap[fId], tp = posMap[tId];
              if (!fp || !tp) return null;
              const toN   = nodes.find(n => n.id === tId);
              const dimmed = matchSet && !matchSet.has(tId);
              const isSelPath = selectedId && (fId === selectedId || tId === selectedId);
              return (
                <path key={i} d={bezier(fp, tp)}
                  stroke={dimmed ? "rgba(26,23,16,0.15)" : isSelPath ? (toN?.color ?? "#7A7468") + "CC" : (toN?.color ?? "#7A7468") + "44"}
                  strokeWidth={isSelPath ? 2.5 : matchSet && matchSet.has(tId) ? 2 : 1.5}
                  fill="none" strokeLinecap="round" style={{ pointerEvents: "none" }} />
              );
            })}

            {/* Nodes */}
            {nodes.map(n => {
              const pos = posMap[n.id];
              if (!pos) return null;

              const isRoot  = n.id === "root";
              const isSys   = MM_SYS.has(n.id);
              const hasKids = n.children.length > 0;
              const isSel   = selectedId === n.id;
              const isMatch = matchSet ? matchSet.has(n.id) : false;
              const dimmed  = matchSet && !isMatch;
              const nW = isRoot ? 142 : MM_NW;
              const nH = isRoot ? 42  : MM_NH;
              const lbl = n.label.length > 21 ? n.label.slice(0, 21) + "…" : n.label;

              return (
                <g key={n.id}
                  transform={`translate(${pos.x},${pos.y - nH / 2})`}
                  onMouseDown={e => onNodeMouseDown(e, n.id)}
                  onClick={e => onNodeClick(e, n.id)}
                  onDoubleClick={e => { e.stopPropagation(); startEdit(n.id, n.label); }}
                  onContextMenu={e => { e.preventDefault(); e.stopPropagation(); setCtxMenu({ id: n.id, x: e.clientX, y: e.clientY }); setSelectedId(n.id); }}
                  style={{ cursor: isDragging && dragRef.current?.id === n.id ? "grabbing" : "pointer", opacity: dimmed ? 0.12 : 1, transition: "opacity 0.15s" }}
                >
                  {/* Selection ring */}
                  {isSel && (
                    <rect x={-3} y={-3} width={nW + 6} height={nH + 6}
                      rx={isRoot ? 14 : 10} fill="none"
                      stroke={n.color} strokeWidth={2} strokeDasharray="4 2"
                      filter="url(#mm-sel)" opacity={0.7} />
                  )}

                  {/* Box */}
                  <rect x={0} y={0} width={nW} height={nH}
                    rx={isRoot ? 12 : isSys ? 8 : 7}
                    fill={isRoot ? n.color + "22" : isSys ? n.color + "14" : isSel ? n.color + "18" : "#F0ECDA"}
                    stroke={isSel ? n.color : isMatch ? n.color : n.color + (isRoot ? "BB" : isSys ? "66" : "2A")}
                    strokeWidth={isSel ? 1.5 : isRoot ? 2 : 1}
                    filter={isRoot ? "url(#mm-glow)" : "none"} />

                  {/* Label / inline edit */}
                  {editId === n.id ? (
                    <foreignObject x={6} y={5} width={nW - 12} height={nH - 10}>
                      <input value={editVal}
                        onChange={e => setEditVal(e.target.value)}
                        onBlur={commitEdit}
                        onKeyDown={e => { if (e.key === "Enter") commitEdit(); if (e.key === "Escape") cancelEdit(); }}
                        onMouseDown={e => e.stopPropagation()}
                        autoFocus
                        style={{ width: "100%", background: "transparent", border: "none", outline: "none", color: n.color, fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", fontWeight: isRoot ? 700 : 400, boxSizing: "border-box" }} />
                    </foreignObject>
                  ) : (
                    <text x={nW / 2} y={nH / 2 + 1} textAnchor="middle" dominantBaseline="middle"
                      fill={isRoot ? n.color : isSys ? n.color : isMatch ? "#FFF" : "#3A3628"}
                      fontSize={isRoot ? 13 : isSys ? 11 : 10}
                      fontFamily="'Inter',sans-serif"
                      fontWeight={isRoot || isSys ? 700 : 400}>{lbl}</text>
                  )}

                  {/* Collapse/expand pill */}
                  {hasKids && (
                    <g transform={`translate(${nW - 15},${nH / 2 - 8})`}
                      onMouseDown={e => e.stopPropagation()}
                      onClick={e => { e.stopPropagation(); toggleCollapse(n.id); }}
                      style={{ cursor: "pointer" }}>
                      <rect width={15} height={15} rx={4} fill={n.color + "22"} stroke={n.color + "44"} strokeWidth={0.5} />
                      <text x={7.5} y={8.5} textAnchor="middle" dominantBaseline="middle"
                        fill={n.color} fontSize={9} fontFamily="'Inter',sans-serif" fontWeight={700}>
                        {n.collapsed ? "＋" : "−"}
                      </text>
                    </g>
                  )}

                  {/* Selected node: show child count badge */}
                  {isSel && !isRoot && (
                    <g transform={`translate(${nW + 4},${-4})`}>
                      <rect x={0} y={0} width={32} height={14} rx={7}
                        fill={n.color + "22"} stroke={n.color + "66"} strokeWidth={1}/>
                      <text x={16} y={7} textAnchor="middle" dominantBaseline="middle"
                        fill={n.color} fontSize={8} fontFamily="'Inter',sans-serif" fontWeight={700}>
                        selected
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Info overlay */}
        <div style={{ position: "absolute", bottom: "8px", right: "10px", fontSize: "9px", color: "#222", fontFamily: "'JetBrains Mono',monospace" }}>
          {Math.round(zoom * 100)}% · {nodes.length} nodes{selectedId ? ` · "${(selNode?.label||"").slice(0,16)}" selected` : ""}
        </div>
      </div>

      {/* ── Context menu ── */}
      {ctxMenu && tree && mmFind(tree, ctxMenu.id) && (() => {
        const ctxNode = mmFind(tree, ctxMenu.id);
        return (
          <div style={{ position: "fixed", left: ctxMenu.x, top: ctxMenu.y, background: "#F0ECDA", border: "1px solid #2A2A35", borderRadius: "10px", padding: "5px", zIndex: 9999, minWidth: "165px", boxShadow: "0 14px 40px rgba(0,0,0,0.85)" }}
            onClick={e => e.stopPropagation()} onMouseDown={e => e.stopPropagation()}>
            {[
              { icon: "edit", label: "Rename",      fn: () => { startEdit(ctxMenu.id, ctxNode.label); setCtxMenu(null); } },
              { icon: "plus", label: "Add child here",fn: () => { setSelectedId(ctxMenu.id); setTimeout(addNode, 20); setCtxMenu(null); } },
              { icon: ctxNode.collapsed ? "▶" : "▼", label: ctxNode.collapsed ? "Expand" : "Collapse",
                fn: () => { toggleCollapse(ctxMenu.id); setCtxMenu(null); }, hide: !ctxNode.children.length },
              { icon: "trash", label: "Delete",       fn: () => { deleteNode(ctxMenu.id); setCtxMenu(null); }, danger: true, hide: ctxMenu.id === "root" },
            ].filter(i => !i.hide).map((item, i) => (
              <div key={i} onClick={item.fn}
                style={{ display: "flex", alignItems: "center", gap: "9px", padding: "7px 11px", borderRadius: "7px", cursor: "pointer", fontSize: "12px", color: item.danger ? "#EF4444" : "#3A3628", fontFamily: "'JetBrains Mono',monospace" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(26,23,16,0.15)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <span>{item.icon}</span><span>{item.label}</span>
              </div>
            ))}
          </div>
        );
      })()}

      {/* ── Legend ── */}
      <div style={{ padding: "6px 14px 9px", borderTop: "1.5px solid rgba(26,23,16,0.18)", display: "flex", gap: "12px", flexWrap: "wrap", fontSize: "9px", color: "#8A8478" }}>
        <span><span style={{ color: "#EF4444" }}>●</span> High</span>
        <span><span style={{ color: "#F59E0B" }}>●</span> Medium</span>
        <span><span style={{ color: "#A78BFA" }}>●</span> Key Points</span>
        <span><span style={{ color: "#38BDF8" }}>●</span> Topics</span>
        <span><span style={{ color: "#10B981" }}>●</span> Done</span>
        <span style={{ marginLeft: "auto", color: "#A09888" }}>New nodes auto-sync → Notes</span>
      </div>
    </div>
  );
}


// ── Calendar View ─────────────────────────────────────────────────────
function CalendarView({ tasks, onNavigate }) {
  const [year,  setYear]  = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [selected, setSelected] = useState(null);

  const today    = new Date();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const tasksByDate = {};
  Object.entries(tasks).forEach(([sec, list]) => {
    list.forEach(t => {
      const d = new Date(t.deadline);
      if (d.getFullYear()===year && d.getMonth()===month) {
        const key = d.getDate();
        if (!tasksByDate[key]) tasksByDate[key] = [];
        tasksByDate[key].push({ ...t, section:sec, sectionColor: SECTIONS.find(s=>s.id===sec)?.color||"#7A7468" });
      }
    });
  });

  const selectedTasks = selected ? (tasksByDate[selected]||[]) : [];
  const prevMonth = () => { if(month===0){setMonth(11);setYear(y=>y-1);}else setMonth(m=>m-1); setSelected(null); };
  const nextMonth = () => { if(month===11){setMonth(0);setYear(y=>y+1);}else setMonth(m=>m+1); setSelected(null); };

  const allTasksThisMonth = Object.values(tasksByDate).flat();
  const doneThisMonth = allTasksThisMonth.filter(t=>t.done).length;
  const overdueThisMonth = allTasksThisMonth.filter(t=>!t.done&&new Date(t.deadline)<today).length;

  return (
    <div style={{display:"flex",flexDirection:"column",gap:"16px"}}>
      {/* Stats row */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"12px"}}>
        {[
          {label:"Tasks this month", value:allTasksThisMonth.length, color:"#818CF8"},
          {label:"Completed",        value:doneThisMonth,            color:"#10B981"},
          {label:"Overdue",          value:overdueThisMonth,         color:"#EF4444"},
        ].map(s=>(
          <div key={s.label} style={{background:"#E9E4CE",borderRadius:"10px",padding:"14px 16px",border:"1.5px solid rgba(26,23,16,0.18)"}}>
            <div style={{fontFamily:"'Instrument Serif',serif",fontSize:"22px",fontWeight:800,color:s.color}}>{s.value}</div>
            <div style={{fontSize:"10px",color:"#A09888",marginTop:"2px"}}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:"16px",alignItems:"start"}}>
        {/* Calendar grid */}
        <div style={{background:"#E9E4CE",borderRadius:"12px",border:"1.5px solid rgba(26,23,16,0.18)",overflow:"hidden"}}>
          <div style={{padding:"14px 18px",borderBottom:"1.5px solid rgba(26,23,16,0.18)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <button onClick={prevMonth} style={{background:"transparent",border:"1px solid #2A2A35",color:"#7A7468",width:"28px",height:"28px",borderRadius:"6px",cursor:"pointer",fontSize:"13px"}}>←</button>
            <div style={{fontFamily:"'Instrument Serif',serif",fontSize:"16px",fontWeight:400,fontStyle:"italic",color:K.txt}}>{monthNames[month]} {year}</div>
            <button onClick={nextMonth} style={{background:"transparent",border:"1px solid #2A2A35",color:"#7A7468",width:"28px",height:"28px",borderRadius:"6px",cursor:"pointer",fontSize:"13px"}}>→</button>
          </div>

          <div style={{padding:"12px 14px"}}>
            {/* Day headers */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",marginBottom:"6px"}}>
              {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d=>(
                <div key={d} style={{textAlign:"center",fontSize:"10px",color:"#8A8478",fontFamily:"'Inter',sans-serif",fontWeight:600,padding:"4px"}}>{d}</div>
              ))}
            </div>

            {/* Days */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:"2px"}}>
              {Array(firstDay).fill(null).map((_,i)=><div key={`e${i}`}/>)}
              {Array(daysInMonth).fill(null).map((_,i)=>{
                const day=i+1;
                const dayTasks=tasksByDate[day]||[];
                const isToday=today.getDate()===day&&today.getMonth()===month&&today.getFullYear()===year;
                const isSelected=selected===day;
                const hasOverdue=dayTasks.some(t=>!t.done&&new Date(t.deadline)<today);
                const hasTasks=dayTasks.length>0;
                return (
                  <div key={day} onClick={()=>setSelected(selected===day?null:day)}
                    style={{padding:"6px 4px",borderRadius:"8px",cursor:hasTasks?"pointer":"default",
                      background:isSelected?"#818CF822":isToday?"#1A1A2E":"transparent",
                      border:isToday?"1px solid #818CF844":isSelected?"1px solid #818CF866":"1px solid transparent",
                      transition:"all 0.15s",minHeight:"46px",display:"flex",flexDirection:"column",alignItems:"center",gap:"2px"}}>
                    <div style={{fontSize:"11px",fontFamily:"'Inter',sans-serif",fontWeight:isToday?700:400,color:isToday?"#818CF8":isSelected?"#3A3628":"#7A7468"}}>{day}</div>
                    {hasTasks&&(
                      <div style={{display:"flex",gap:"2px",flexWrap:"wrap",justifyContent:"center"}}>
                        {dayTasks.slice(0,4).map((t,ti)=>(
                          <div key={ti} style={{width:"5px",height:"5px",borderRadius:"50%",background:t.done?"#A09888":hasOverdue?"#EF4444":t.sectionColor}}/>
                        ))}
                        {dayTasks.length>4&&<div style={{fontSize:"8px",color:"#A09888"}}>+{dayTasks.length-4}</div>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{padding:"8px 14px 12px",display:"flex",gap:"12px",fontSize:"9px",color:"#8A8478",borderTop:"1.5px solid rgba(26,23,16,0.18)"}}>
            <span><span style={{color:"#818CF8"}}>●</span> Today</span>
            <span><span style={{color:"#EF4444"}}>●</span> Overdue</span>
            <span><span style={{color:"#10B981"}}>●</span> Task</span>
            <span><span style={{color:"#A09888"}}>●</span> Done</span>
          </div>
        </div>

        {/* Selected day panel */}
        <div style={{width:"220px",background:"#E9E4CE",borderRadius:"12px",border:"1.5px solid rgba(26,23,16,0.18)",overflow:"hidden",minHeight:"200px"}}>
          <div style={{padding:"12px 14px",borderBottom:"1.5px solid rgba(26,23,16,0.18)"}}>
            <div style={{fontFamily:"'Inter',sans-serif",fontSize:"12px",fontWeight:600,color:K.txt2}}>
              {selected ? `${monthNames[month]} ${selected}` : "Select a day"}
            </div>
            <div style={{fontSize:"10px",color:"#8A8478"}}>{selected ? `${selectedTasks.length} task${selectedTasks.length!==1?"s":""}` : "Click any date"}</div>
          </div>
          <div style={{padding:"10px"}}>
            {selected&&selectedTasks.length===0&&<div style={{fontSize:"11px",color:"#A09888",padding:"10px",textAlign:"center"}}>No tasks this day ✓</div>}
            {selectedTasks.map(t=>{
              const sec=SECTIONS.find(s=>s.id===t.section);
              return (
                <div key={t.id} onClick={()=>onNavigate(t.section)}
                  style={{padding:"8px 10px",background:"#F0ECDA",borderRadius:"7px",marginBottom:"5px",cursor:"pointer",border:"1px solid #1E1E28",opacity:t.done?0.4:1}}>
                  <div style={{display:"flex",gap:"6px",alignItems:"center",marginBottom:"3px"}}>
                    <div style={{width:"6px",height:"6px",borderRadius:"50%",background:sec?.color,flexShrink:0}}/>
                    <div style={{fontSize:"10px",color:"#7A7468",fontFamily:"'Inter',sans-serif",fontWeight:600}}>{sec?.label}</div>
                    <div style={{fontSize:"9px",background:priorityColors[t.priority]+"1A",color:priorityColors[t.priority],padding:"1px 5px",borderRadius:"8px",marginLeft:"auto",fontFamily:"'Inter',sans-serif",fontWeight:600}}>{t.priority}</div>
                  </div>
                  <div style={{fontSize:"11px",color:t.done?"#8A8478":"#3A3628",textDecoration:t.done?"line-through":"none"}}>{t.text}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Progress Charts ───────────────────────────────────────────────────

// ══════════════════════════════════════════════════════════════════════
//  NEXUS — Editorial Bento Theme
//  Inspired by: warm parchment bg · thick dark borders · pill buttons
//  orange diamonds · yellow-green CTAs · Syne 800 display
// ══════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════
//  THEMES — 6 hand-crafted palettes
// ═══════════════════════════════════════════════════════════════════
const mkTheme = (bg,surf,card,cardLo,inpt,bdr,bdrSm,bdrFine,txt,txt2,txt3,brand,brandMid,accent,accentLt,cta,ctaBg,red,grn,blue,sh) => ({
  bg,surf,card,cardLo,inpt,bdr,bdrSm,bdrFine,txt,txt2,txt3,brand,brandMid,accent,accentLt,cta,ctaBg,red,grn,blue,
  shadowSm: `0 1px 3px ${sh}07, 0 1px 2px ${sh}05`,
  shadowMd: `0 4px 14px ${sh}08, 0 2px 4px ${sh}05, 0 0 0 1px ${sh}04`,
  shadowLg: `0 12px 32px ${sh}10, 0 4px 10px ${sh}06, 0 0 0 1px ${sh}04`,
  shadowXl: `0 24px 60px ${sh}14, 0 8px 20px ${sh}08`,
});

const THEMES = {
  linen: {
    label: "Linen",
    emoji: "📜",
    ...mkTheme(
      "#F0EBE0","#E8E1D4","#FDFAF4","#EDE7DA","#E5DFD2",
      "#1A1714","rgba(26,23,20,0.14)","rgba(26,23,20,0.07)",
      "#1A1714","#52493C","#96897A",
      "#1E1B16","#2E2A22",
      "#8C5E28","#B07A3A","#8A6A1A","#D4A843",
      "#B82E1A","#22855A","#2E5BB8","rgba(26,23,20,"
    ),
  },
  slate: {
    label: "Slate",
    emoji: "🌫️",
    ...mkTheme(
      "#F0F2F5","#E6E9EE","#FAFBFC","#EAEDF1","#E0E4EA",
      "#1C2130","rgba(28,33,48,0.15)","rgba(28,33,48,0.07)",
      "#1C2130","#4A5568","#8A93A6",
      "#1C2130","#2D3748",
      "#3B6DD4","#5585E8","#1A4BB8","#A8C4FA",
      "#C53030","#2F855A","#3B6DD4","rgba(28,33,48,"
    ),
  },
  midnight: {
    label: "Midnight",
    emoji: "🌙",
    ...mkTheme(
      "#0F1117","#161A24","#1C2135","#131720","#1A1F2E",
      "#E2E8FF","rgba(226,232,255,0.12)","rgba(226,232,255,0.06)",
      "#E8EDF8","#9AA3B8","#4E566A",
      "#7C6EF8","#6457D4",
      "#7C6EF8","#9D92FA","#F0EBE0","#7C6EF8",
      "#F56565","#48BB78","#63B3ED","rgba(0,0,0,"
    ),
  },
  forest: {
    label: "Forest",
    emoji: "🌿",
    ...mkTheme(
      "#EDF3EE","#E2EDE3","#F6FAF6","#E6EFE7","#DDE8DE",
      "#1A2E1C","rgba(26,46,28,0.14)","rgba(26,46,28,0.07)",
      "#1A2E1C","#3D5C40","#7A9E7D",
      "#1A2E1C","#2A4A2D",
      "#3A7D44","#52A85E","#1A5C24","#7FD48A",
      "#C0392B","#27AE60","#2980B9","rgba(26,46,28,"
    ),
  },
  rose: {
    label: "Rose",
    emoji: "🌸",
    ...mkTheme(
      "#FDF0F2","#F7E6E9","#FFFAFA","#F5E6E9","#EED9DD",
      "#3D1A22","rgba(61,26,34,0.14)","rgba(61,26,34,0.07)",
      "#3D1A22","#6B3B47","#A8717C",
      "#7A2535","#932E41",
      "#B5365A","#D4526E","#7A2535","#F4A0B0",
      "#B5365A","#27AE60","#2980B9","rgba(61,26,34,"
    ),
  },
  carbon: {
    label: "Carbon",
    emoji: "⚫",
    ...mkTheme(
      "#181818","#1F1F1F","#252525","#1A1A1A","#222222",
      "#E0E0E0","rgba(224,224,224,0.12)","rgba(224,224,224,0.06)",
      "#EFEFEF","#9A9A9A","#585858",
      "#2C2C2C","#383838",
      "#E0B030","#F0C84A","#1A1A1A","#E0B030",
      "#F05050","#50C878","#5099F0","rgba(0,0,0,"
    ),
  },
};

// Active theme — will be overridden by the app before render
let K = THEMES.linen;


// ── Reusable primitives ───────────────────────────────────────────────
const Pill = ({ children, variant="dark", onClick, disabled, style={} }) => {
  const base = { cursor: disabled?"not-allowed":"pointer", fontFamily:"'Inter',sans-serif", fontWeight:600, borderRadius:"100px", letterSpacing:"0.2px", display:"inline-flex", alignItems:"center", justifyContent:"center", gap:"6px", whiteSpace:"nowrap", transition:"all 0.12s", fontSize:"12px", border:"none", ...style };
  const v = {
    dark:    { ...base, background:K.brand,  color:K.bg, padding:"9px 22px", boxShadow:"0 2px 8px rgba(26,23,16,0.22), 0 1px 2px rgba(26,23,16,0.14)" },
    lime:    { ...base, background:K.ctaBg, color:K.cta, padding:"9px 22px", boxShadow:"0 3px 10px rgba(138,106,26,0.30), 0 1px 2px rgba(26,23,20,0.10)" },
    ghost:   { ...base, background:K.card, color:K.txt2, padding:"8px 18px", border:`1.5px solid ${K.bdr}`, boxShadow:K.shadowSm },
    ghostSm: { ...base, background:"transparent", color:K.txt2, padding:"5px 13px", border:`1.5px solid ${K.bdrSm}`, fontSize:"10px" },
    sm:      { ...base, background:K.brand,  color:K.bg, padding:"5px 14px", fontSize:"10px", boxShadow:"0 2px 6px rgba(26,23,16,0.2)" },
  };
  return <button onClick={onClick} disabled={disabled} style={v[variant]||v.dark}>{children}</button>;
};

const Card = ({ children, style={}, onClick }) => (
  <div onClick={onClick} style={{ background:K.card, borderRadius:"18px", border:`1.5px solid ${K.bdr}`, overflow:"hidden", boxShadow:K.shadowMd, backgroundImage:"linear-gradient(175deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0) 60%)", ...style }}>
    {children}
  </div>
);

const CardHead = ({ children, style={} }) => (
  <div style={{ padding:"14px 20px", borderBottom:`1.5px solid ${K.bdrSm}`, display:"flex", alignItems:"center", justifyContent:"space-between", background:K.surf, ...style }}>
    {children}
  </div>
);

const Label = ({ children, style={} }) => (
  <span style={{ fontFamily:"'Inter',sans-serif", fontSize:"10px", fontWeight:600, letterSpacing:"0.08em", color:K.txt2, ...style }}>{children}</span>
);

// ── Progress Charts ───────────────────────────────────────────────────
function ProgressCharts({ tasks }) {
  const data = SECTIONS.filter(s => s.id!=="home" && s.id!=="calendar").map(s => {
    const list=tasks[s.id]||[], total=list.length, done=list.filter(t=>t.done).length;
    return { name:s.label, done, total, pct:total===0?0:Math.round((done/total)*100), color:s.color, icon:s.icon };
  });
  const ttlDone=data.reduce((a,d)=>a+d.done,0), ttlTotal=data.reduce((a,d)=>a+d.total,0);
  const pct=ttlTotal===0?0:Math.round((ttlDone/ttlTotal)*100);

  const Tip=({active,payload})=>{
    if(!active||!payload?.length) return null;
    const d=data.find(x=>x.icon+" "+x.name.slice(0,8)===payload[0].payload.name);
    return <div style={{background:K.card,border:`1.5px solid ${K.bdr}`,borderRadius:"12px",padding:"10px 14px",fontFamily:"'Inter',sans-serif"}}><div style={{fontSize:"12px",fontWeight:700,color:payload[0].payload.color}}>{d?.name}</div><div style={{fontSize:"11px",color:K.txt2}}>{d?.done}/{d?.total} tasks · {payload[0].value}%</div></div>;
  };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
      {/* Overall */}
      <Card style={{padding:"24px 28px",display:"grid",gridTemplateColumns:"auto 1fr",gap:"28px",alignItems:"center"}}>
        <div style={{position:"relative",width:"110px",height:"110px",flexShrink:0}}>
          <svg width="110" height="110" viewBox="0 0 110 110">
            <circle cx="55" cy="55" r="44" fill="none" stroke={K.bdrSm} strokeWidth="10"/>
            <circle cx="55" cy="55" r="44" fill="none" stroke={K.accent} strokeWidth="10"
              strokeDasharray={`${pct*2.765} 276.5`} strokeLinecap="round"
              transform="rotate(-90 55 55)" style={{transition:"stroke-dasharray 1.2s ease"}}/>
          </svg>
          <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
            <div style={{fontFamily:"'Instrument Serif',serif",fontSize:"26px",fontWeight:400,fontStyle:"italic",color:K.accent,lineHeight:1}}>{pct}%</div>
          </div>
        </div>
        <div>
          <div style={{fontFamily:"'Instrument Serif',serif",fontSize:"22px",fontWeight:400,fontStyle:"italic",color:K.txt,lineHeight:1.1,marginBottom:"6px",display:"flex",alignItems:"center",gap:"10px"}}><BarChart2 size={20} strokeWidth={2} color={K.accent}/> Overall Progress</div>
          <div style={{fontSize:"13px",color:K.txt2,marginBottom:"14px"}}>{ttlDone} of {ttlTotal} tasks completed</div>
          <div style={{display:"flex",gap:"8px"}}>
            <span style={{fontSize:"11px",background:`${K.grn}18`,color:K.grn,padding:"4px 12px",borderRadius:"20px",fontFamily:"'Inter',sans-serif",fontWeight:700,border:`1px solid ${K.grn}33`}}>{ttlDone} done</span>
            <span style={{fontSize:"11px",background:`${K.red}12`,color:K.red,padding:"4px 12px",borderRadius:"20px",fontFamily:"'Inter',sans-serif",fontWeight:700,border:`1px solid ${K.red}33`}}>{ttlTotal-ttlDone} left</span>
          </div>
        </div>
      </Card>

      {/* Bar chart */}
      <Card style={{padding:"22px 24px"}}>
        <Label style={{marginBottom:"18px",display:"flex",alignItems:"center",gap:"6px"}}><BarChart2 size={12} strokeWidth={2}/> COMPLETION BY AREA</Label>
        <ResponsiveContainer width="100%" height={210}>
          <BarChart data={data.map(d=>({name:d.icon+" "+d.name.slice(0,7),pct:d.pct,color:d.color}))} margin={{top:0,right:10,left:-20,bottom:40}}>
            <XAxis dataKey="name" tick={{fill:K.txt2,fontSize:9,fontFamily:"'Inter',sans-serif"}} angle={-35} textAnchor="end" interval={0}/>
            <YAxis tick={{fill:K.txt3,fontSize:9}} domain={[0,100]}/>
            <Tooltip content={<Tip/>}/>
            <Bar dataKey="pct" radius={[6,6,0,0]}>
              {data.map((e,i)=><Cell key={i} fill={e.color}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Per-section grid */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"10px"}}>
        {data.map(d=>(
          <Card key={d.name} style={{padding:"16px 18px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"}}>
              <div style={{fontFamily:"'Inter',sans-serif",fontSize:"12px",fontWeight:700,color:d.color,display:"flex",alignItems:"center",gap:"6px"}}><SecIcon id={SECTIONS.find(x=>x.label===d.name)?.id} size={13} color={d.color}/> {d.name}</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"14px",fontWeight:600,color:d.pct===100?K.grn:d.color}}>{d.pct}%</div>
            </div>
            <div style={{background:K.bdrSm,borderRadius:"4px",height:"4px",overflow:"hidden"}}>
              <div style={{height:"100%",width:`${d.pct}%`,background:d.pct===100?K.grn:d.color,borderRadius:"4px",transition:"width 1.2s ease"}}/>
            </div>
            <div style={{fontSize:"10px",color:K.txt3,marginTop:"7px"}}>{d.done}/{d.total} tasks</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── AI Assistant ──────────────────────────────────────────────────────
function AIAssistant({ open, onClose, tasks, notes, habits }) {
  const [messages,setMessages]=useState([{role:"assistant",content:"Hey! I'm your Nexus AI — I have full context of your notes, tasks, and habits.\n\nTry:\n• What's overdue?\n• Summarize my week\n• Advice on my side hustle\n• What should I focus on today?"}]);
  const [input,setInput]=useState(""); const [loading,setLoading]=useState(false);
  const bottomRef=useRef(null);
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[messages]);

  const buildSystem=()=>{
    const tSum=Object.entries(tasks).map(([s,l])=>{const p=l.filter(t=>!t.done),ov=p.filter(t=>new Date(t.deadline)<new Date());return `${s.toUpperCase()}: ${p.length} pending${ov.length?` — ${ov.length} OVERDUE: ${ov.map(t=>t.text).join(", ")}`:""}`}).join("\n");
    const hStr=habits.map(h=>`${h.label}: ${h.streak}d streak, ${h.done?"done today":"not done"}`).join("\n");
    const nStr=Object.entries(notes).map(([s,n])=>`=== ${s.toUpperCase()} ===\n${n}`).join("\n\n");
    return `You are the AI inside NEXUS — personal life OS for an ambitious student building a SaaS agency. TODAY: ${new Date().toLocaleDateString("en-IN",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}\n\nTASKS:\n${tSum}\n\nHABITS:\n${hStr}\n\nNOTES:\n${nStr}\n\nBe sharp, direct, no fluff. Like a brilliant personal advisor.`;
  };
  const send=async()=>{
    if(!input.trim()||loading)return;
    const userMsg={role:"user",content:input};
    const history=[...messages,userMsg];
    setMessages(history); setInput(""); setLoading(true);
    try {
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:buildSystem(),messages:history.map(m=>({role:m.role,content:m.content}))})});
      const data=await res.json();
      setMessages(p=>[...p,{role:"assistant",content:data.content?.map(b=>b.text||"").join("")||"No response."}]);
    } catch { setMessages(p=>[...p,{role:"assistant",content:"Connection error."}]); }
    setLoading(false);
  };
  if(!open) return null;
  return (
    <div style={{position:"fixed",right:0,top:0,bottom:0,width:"380px",background:K.card,borderLeft:`2px solid ${K.bdr}`,display:"flex",flexDirection:"column",zIndex:100,boxShadow:"-12px 0 48px rgba(26,23,16,0.18), -4px 0 16px rgba(26,23,16,0.10)"}}>
      <div style={{padding:"18px 20px",borderBottom:`1.5px solid ${K.bdrSm}`,display:"flex",alignItems:"center",justifyContent:"space-between",background:K.surf}}>
        <div>
          <div style={{fontFamily:"'Instrument Serif',serif",fontSize:"17px",fontWeight:400,fontStyle:"italic",color:K.txt}}><Sparkles size={14} strokeWidth={2} color={K.accent}/> Nexus AI</div>
          <div style={{fontSize:"11px",color:K.txt3}}>Full context of your life OS</div>
        </div>
        <button onClick={onClose} style={{background:K.inpt,border:`1.5px solid ${K.bdrSm}`,color:K.txt2,cursor:"pointer",width:"30px",height:"30px",borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center"}}><X size={14} strokeWidth={2}/></button>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"14px",display:"flex",flexDirection:"column",gap:"10px"}}>
        {messages.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
            <div style={{maxWidth:"88%",padding:"10px 14px",borderRadius:m.role==="user"?"14px 14px 3px 14px":"14px 14px 14px 3px",background:m.role==="user"?K.bdr:K.cardLo,border:`1.5px solid ${m.role==="user"?K.bdr:K.bdrSm}`,fontSize:"12px",color:m.role==="user"?K.card:K.txt,lineHeight:"1.7",fontFamily:"'Inter',sans-serif",whiteSpace:"pre-wrap"}}>{m.content}</div>
          </div>
        ))}
        {loading&&<div style={{display:"flex"}}><div style={{padding:"10px 14px",borderRadius:"14px 14px 14px 3px",background:K.cardLo,border:`1.5px solid ${K.bdrSm}`,display:"flex",gap:"5px",alignItems:"center"}}>{[0,1,2].map(i=><div key={i} style={{width:"6px",height:"6px",borderRadius:"50%",background:K.accent,animation:`dot 1.2s ${i*0.2}s infinite ease-in-out`}}/>)}</div></div>}
        <div ref={bottomRef}/>
      </div>
      <div style={{padding:"12px 14px",borderTop:`1.5px solid ${K.bdrSm}`,display:"flex",gap:"8px",background:K.cardLo}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask anything..."
          style={{flex:1,background:K.inpt,border:`1.5px solid ${K.bdrSm}`,color:K.txt,padding:"10px 14px",borderRadius:"12px",fontFamily:"'Inter',sans-serif",fontSize:"13px",outline:"none"}}/>
        <button onClick={send} disabled={loading} style={{background:K.brand,border:"none",color:K.bg,padding:"10px 16px",borderRadius:"12px",cursor:loading?"not-allowed":"pointer",fontFamily:"'Inter',sans-serif",fontSize:"13px",fontWeight:600,opacity:loading?0.5:1}}><ArrowRight size={14} strokeWidth={2.5}/></button>
      </div>
      <style>{`@keyframes dot{0%,100%{opacity:0.3;transform:scale(0.7)}50%{opacity:1;transform:scale(1)}}`}</style>
    </div>
  );
}

// ── Weekly Review ─────────────────────────────────────────────────────
function WeeklyReview({ open, onClose, tasks, notes, habits }) {
  const [answers,setAnswers]=useState({}); const [step,setStep]=useState(0);
  const [summary,setSummary]=useState(""); const [generating,setGenerating]=useState(false); const [done,setDone]=useState(false);
  const reset=()=>{setAnswers({});setStep(0);setSummary("");setGenerating(false);setDone(false);};
  const generate=async()=>{
    setGenerating(true); setDone(true);
    const qa=REVIEW_QUESTIONS.map(q=>`Q: ${q.q}\nA: ${answers[q.id]||"(skipped)"}`).join("\n\n");
    const overdue=Object.entries(tasks).flatMap(([s,l])=>l.filter(t=>!t.done&&new Date(t.deadline)<new Date()).map(t=>`${s}: ${t.text}`));
    try {
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:`You are a brilliant personal life coach. Weekly review:\n\n${qa}\n\nOverdue: ${overdue.length?overdue.join(", "):"none"}\nTop habit streak: ${Math.max(...habits.map(h=>h.streak))} days\n\nWrite a warm, sharp 3-paragraph weekly summary. Celebrate wins, acknowledge struggles without judgment, give 2-3 specific action points. Like a brilliant mentor. Under 200 words.`}]})});
      const data=await res.json();
      setSummary(data.content?.map(b=>b.text||"").join("")||"");
    } catch { setSummary("Could not generate summary. Your reflections are saved."); }
    setGenerating(false);
  };
  if(!open) return null;
  const q=REVIEW_QUESTIONS[step];
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(26,23,16,0.55)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
      <div style={{background:K.card,borderRadius:"20px",border:`2px solid ${K.bdr}`,width:"100%",maxWidth:"540px",maxHeight:"88vh",overflow:"hidden",display:"flex",flexDirection:"column",boxShadow:"0 32px 80px rgba(26,23,16,0.28), 0 12px 32px rgba(26,23,16,0.16), 0 0 0 1px rgba(26,23,16,0.08)"}}>
        <div style={{padding:"18px 24px",borderBottom:`1.5px solid ${K.bdrSm}`,display:"flex",alignItems:"center",justifyContent:"space-between",background:K.surf}}>
          <div>
            <div style={{fontFamily:"'Instrument Serif',serif",fontSize:"20px",fontWeight:400,fontStyle:"italic",color:K.txt}}>Weekly Review</div>
            <div style={{fontSize:"11px",color:K.txt3,marginTop:"2px"}}>{new Date().toLocaleDateString("en-IN",{weekday:"long",day:"2-digit",month:"long"})}</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
            <div style={{display:"flex",gap:"4px"}}>{REVIEW_QUESTIONS.map((_,i)=><div key={i} style={{width:"7px",height:"7px",borderRadius:"50%",background:i<=step||done?K.accent:K.bdrSm,transition:"background 0.2s"}}/>)}</div>
            <button onClick={()=>{reset();onClose();}} style={{background:K.inpt,border:`1.5px solid ${K.bdrSm}`,color:K.txt2,cursor:"pointer",width:"30px",height:"30px",borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center"}}><X size={14} strokeWidth={2}/></button>
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"24px"}}>
          {done
            ?<div>
               <div style={{fontFamily:"'Inter',sans-serif",fontSize:"14px",fontWeight:800,color:K.accent,marginBottom:"14px"}}><Sparkles size={14} strokeWidth={2}/> Your AI Summary</div>
               {generating
                 ?<div style={{color:K.txt3,fontSize:"13px",fontFamily:"'Inter',sans-serif"}}>Generating your personalised summary...</div>
                 :<div style={{fontSize:"13px",color:K.txt,lineHeight:"1.8",whiteSpace:"pre-wrap",fontFamily:"'Inter',sans-serif",background:K.surf,padding:"16px",borderRadius:"14px",border:`1.5px solid ${K.bdrSm}`}}>{summary}</div>}
               {!generating&&<div style={{marginTop:"18px"}}>{REVIEW_QUESTIONS.map(q=>answers[q.id]&&<div key={q.id} style={{marginBottom:"12px"}}><div style={{fontSize:"10px",color:K.accent,fontFamily:"'Inter',sans-serif",fontWeight:700,marginBottom:"3px",letterSpacing:"0.5px"}}>{q.q}</div><div style={{fontSize:"12px",color:K.txt2,whiteSpace:"pre-wrap",fontFamily:"'Inter',sans-serif"}}>{answers[q.id]}</div></div>)}</div>}
             </div>
            :<div>
               <div style={{fontSize:"10px",color:K.txt3,fontFamily:"'Inter',sans-serif",fontWeight:700,marginBottom:"8px",letterSpacing:"0.5px"}}>QUESTION {step+1} OF {REVIEW_QUESTIONS.length}</div>
               <div style={{fontFamily:"'Instrument Serif',serif",fontSize:"18px",fontWeight:400,color:K.txt,marginBottom:"16px",lineHeight:"1.5"}}>{q.q}</div>
               <textarea value={answers[q.id]||""} onChange={e=>setAnswers(a=>({...a,[q.id]:e.target.value}))} placeholder={q.placeholder} rows={5}
                 style={{width:"100%",background:K.cardLo,border:`1.5px solid ${K.bdrSm}`,color:K.txt,padding:"13px",borderRadius:"14px",fontFamily:"'Inter',sans-serif",fontSize:"13px",resize:"vertical",outline:"none",lineHeight:"1.75",boxSizing:"border-box"}}/>
             </div>
          }
        </div>
        <div style={{padding:"16px 24px",borderTop:`1.5px solid ${K.bdrSm}`,display:"flex",justifyContent:"space-between",alignItems:"center",background:K.cardLo}}>
          {done
            ?<Pill onClick={()=>{reset();onClose();}} variant="lime" style={{marginLeft:"auto"}}><Check size={12} strokeWidth={2.5}/> Done</Pill>
            :<><Pill onClick={()=>step>0&&setStep(s=>s-1)} variant="ghost" style={{opacity:step>0?1:0.3}}><ChevronLeft size={13} strokeWidth={2.5}/> Back</Pill>
               {step<REVIEW_QUESTIONS.length-1
                 ?<Pill onClick={()=>setStep(s=>s+1)}>Next <ChevronRight size={13} strokeWidth={2.5}/></Pill>
                 :<Pill onClick={generate} variant="lime"><Sparkles size={12} strokeWidth={2}/> Generate Summary</Pill>
               }</>
          }
        </div>
      </div>
    </div>
  );
}

// ── Notes Renderer ────────────────────────────────────────────────────
function NotesRenderer({ content, accentColor }) {
  if (!content) return <div style={{color:K.txt3,fontSize:"13px",padding:"22px 24px",fontFamily:"'Inter',sans-serif"}}>Click EDIT to start writing...</div>;
  return (
    <div style={{padding:"20px 24px"}}>
      {content.split("\n").map((line,i) => {
        const h2=line.startsWith("## "),h1=line.startsWith("# ");
        const bullet=/^[→\-•]\s/.test(line),quote=line.startsWith("> ");
        const empty=line.trim()==="";
        return (
          <div key={i} style={{color:h1||h2?accentColor:quote?K.txt2:bullet?K.txt:K.txt2,fontWeight:h1||h2?800:400,fontFamily:h1||h2?"'Syne',sans-serif":"'Outfit',sans-serif",fontSize:h1?"17px":h2?"13px":"13px",lineHeight:"1.9",marginTop:h1||h2?"10px":0,paddingLeft:bullet?"6px":quote?"16px":0,borderLeft:quote?`2px solid ${K.bdrSm}`:"none",fontStyle:quote?"italic":"normal",minHeight:empty?"16px":"auto"}}>
            {bullet?<><span style={{color:accentColor,marginRight:"8px",fontWeight:700}}>›</span>{line.replace(/^[→\-•]\s/,"")}</>:quote?line.replace(/^>\s/,""):h2?line.replace(/^##\s/,""):h1?line.replace(/^#\s/,""):line||" "}
          </div>
        );
      })}
    </div>
  );
}

// ── ThemePicker ──────────────────────────────────────────────────────
function ThemePicker({ current, onChange, open, onClose }) {
  if (!open) return null;
  const themes = Object.entries(THEMES);
  return (
    <div style={{position:"fixed",inset:0,zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"flex-start"}}>
      {/* Backdrop */}
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.35)",backdropFilter:"blur(2px)"}}/>
      {/* Panel */}
      <div style={{
        position:"relative",zIndex:201,
        margin:"0 0 12px 12px",
        background:K.card,border:`1.5px solid ${K.bdr}`,
        borderRadius:"20px",padding:"20px",
        boxShadow:K.shadowXl,
        width:"280px",
        animation:"nx-in 0.2s ease"
      }}>
        {/* Header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"16px"}}>
          <div>
            <div style={{fontFamily:"'Instrument Serif',serif",fontStyle:"italic",fontSize:"18px",fontWeight:400,color:K.txt,lineHeight:1}}>Appearance</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:K.txt3,letterSpacing:"0.1em",marginTop:"4px"}}>CHOOSE YOUR THEME</div>
          </div>
          <button onClick={onClose} style={{background:K.cardLo,border:`1px solid ${K.bdrSm}`,borderRadius:"8px",width:"30px",height:"30px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:K.txt2}}>
            <X size={13} strokeWidth={2}/>
          </button>
        </div>

        {/* Theme grid */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px"}}>
          {themes.map(([id, t]) => {
            const isActive = current === id;
            return (
              <button key={id} onClick={()=>{ onChange(id); onClose(); }} style={{
                background: isActive ? K.brand : K.cardLo,
                border: `1.5px solid ${isActive ? K.accent : K.bdrSm}`,
                borderRadius:"14px", padding:"12px 10px",
                cursor:"pointer", textAlign:"left",
                transition:"all 0.15s",
                boxShadow: isActive ? K.shadowMd : "none",
                position:"relative", overflow:"hidden",
              }}>
                {/* Colour swatch bar */}
                <div style={{display:"flex",gap:"3px",marginBottom:"8px"}}>
                  {[t.bg, t.surf, t.accent, t.ctaBg, t.brand].map((c,i) => (
                    <div key={i} style={{flex:1,height:"5px",borderRadius:"3px",background:c,opacity:i===4?0.9:1}}/>
                  ))}
                </div>
                <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                  <span style={{fontSize:"14px"}}>{t.emoji}</span>
                  <span style={{fontFamily:"'Inter',sans-serif",fontSize:"12px",fontWeight:isActive?600:500,color:isActive?K.bg:K.txt}}>{t.label}</span>
                </div>
                {isActive && (
                  <div style={{position:"absolute",top:"8px",right:"8px"}}>
                    <Check size={11} strokeWidth={3} color={K.accent}/>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer note */}
        <div style={{marginTop:"14px",padding:"10px 12px",background:K.cardLo,borderRadius:"10px",border:`1px solid ${K.bdrFine}`}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",color:K.txt3,letterSpacing:"0.06em"}}>Theme preference is saved automatically.</div>
        </div>
      </div>
    </div>
  );
}

// ── HomeView ──────────────────────────────────────────────────────────
function HomeView({ tasks, habits, setHabits, notes, active, homeTab, setHomeTab, setActive, permission, requestPermission, notifLog, setAiOpen, setReviewOpen }) {
  const [addingHabit,setAddingHabit]=useState(false);
  const [newHabitTxt,setNewHabitTxt]=useState("");

  const ttlDone =Object.values(tasks).flat().filter(t=>t.done).length;
  const ttlTotal=Object.values(tasks).flat().length;
  const overdue =Object.values(tasks).flat().filter(t=>!t.done&&new Date(t.deadline)<new Date()).length;
  const allHigh =Object.entries(tasks).flatMap(([s,l])=>l.filter(t=>!t.done&&t.priority==="high").map(t=>({...t,section:s}))).slice(0,6);
  const topStreak=Math.max(0,...habits.map(h=>h.streak));
  const pend=sid=>(tasks[sid]||[]).filter(t=>!t.done).length;

  const toggleHabit=id=>setHabits(h=>h.map(hb=>hb.id===id?{...hb,done:!hb.done,streak:!hb.done?hb.streak+1:Math.max(0,hb.streak-1)}:hb));
  const deleteHabit=id=>setHabits(h=>h.filter(hb=>hb.id!==id));
  const addHabit=()=>{ if(!newHabitTxt.trim())return; setHabits(h=>[...h,{id:Date.now(),label:newHabitTxt.trim(),streak:0,done:false}]); setNewHabitTxt(""); setAddingHabit(false); };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:"14px",fontFamily:"'Inter',sans-serif"}}>

      {/* ── STAT BENTO ROW ── */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"10px"}}>
        {[
          {v:ttlDone,          l:"Tasks done",   c:K.grn,       ic:<CheckSquare size={18} strokeWidth={1.5}/>},
          {v:ttlTotal-ttlDone, l:"Remaining",    c:K.accent,      ic:<Activity size={18} strokeWidth={1.5}/>},
          {v:overdue,          l:"Overdue",      c:overdue>0?K.red:K.txt3, ic:<Diamond size={18} strokeWidth={1.5}/>},
          {v:`${topStreak}`,   l:"Best streak",  c:"#C08A10",   ic:<Flame size={18} strokeWidth={1.5}/>, sub:`${habits.filter(h=>h.done).length} habits done today`},
        ].map(s=>(
          <Card key={s.l} className="nx-card-hover" style={{padding:"22px 22px 18px",position:"relative",overflow:"visible"}}>
            <div style={{position:"absolute",top:"14px",right:"16px",color:s.c,opacity:0.25}}>{s.ic}</div>
            <div style={{fontFamily:"'Instrument Serif',serif",fontSize:"34px",fontWeight:400,fontStyle:"italic",color:s.c,lineHeight:1}}>{s.v}{s.l==="Best streak"&&<span style={{fontSize:"22px",marginLeft:"3px"}}>🔥</span>}</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",fontWeight:500,color:K.txt3,marginTop:"8px",letterSpacing:"0.08em",textTransform:"uppercase"}}>{s.l.toUpperCase()}</div>
            {s.sub&&<div style={{fontSize:"11px",color:K.txt3,marginTop:"3px"}}>{s.sub}</div>}
          </Card>
        ))}
      </div>

      {/* ── HERO GREETING ── */}
      <Card style={{padding:"0",overflow:"hidden",boxShadow:"0 8px 32px rgba(26,23,16,0.12), 0 3px 10px rgba(26,23,16,0.08)"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr auto",alignItems:"stretch"}}>
          <div style={{padding:"28px 30px"}}>
            <div style={{fontFamily:"'Instrument Serif',serif",fontSize:"28px",fontWeight:400,fontStyle:"italic",color:K.txt,lineHeight:1.2,marginBottom:"8px"}}>
              Good {new Date().getHours()<12?"morning":new Date().getHours()<17?"afternoon":"evening"}
            </div>
            <div style={{fontSize:"13px",color:K.txt2,marginBottom:"18px"}}>{new Date().toLocaleDateString("en-IN",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</div>
            {permission!=="granted"&&(
              <div style={{display:"flex",alignItems:"center",gap:"12px",background:K.cardLo,padding:"11px 16px",borderRadius:"14px",border:`1.5px solid ${K.bdrSm}`,marginBottom:"10px"}}>
                <Bell size={16} color={K.accent} strokeWidth={2}/>
                <span style={{flex:1,fontSize:"12px",color:K.txt2}}>Enable notifications for deadline reminders</span>
                <Pill onClick={requestPermission} variant="sm">ENABLE</Pill>
              </div>
            )}
            {permission==="granted"&&notifLog.length>0&&(
              <div style={{background:`${K.red}10`,border:`1.5px solid ${K.red}30`,borderRadius:"14px",padding:"11px 16px",marginBottom:"10px"}}>
                <div style={{fontSize:"11px",color:K.red,fontFamily:"'Inter',sans-serif",fontWeight:700}}><Bell size={11} strokeWidth={2}/> {notifLog.length} deadline alert{notifLog.length!==1?"s":""}</div>
                {notifLog.slice(0,2).map((n,i)=><div key={i} style={{fontSize:"11px",color:K.txt2,marginTop:"3px"}}>{n.msg}</div>)}
              </div>
            )}
          </div>
          {/* Right CTA column */}
          <div style={{display:"flex",flexDirection:"column",gap:"0",borderLeft:`1.5px solid ${K.bdrSm}`,minWidth:"180px"}}>
            <button onClick={()=>setAiOpen(true)} style={{flex:1,background:K.brand,color:K.bg,border:"none",padding:"20px 24px",fontFamily:"'Inter',sans-serif",fontSize:"12px",fontWeight:600,cursor:"pointer",borderBottom:`1.5px solid rgba(255,255,255,0.08)`,transition:"opacity 0.15s",textAlign:"left",display:"flex",alignItems:"center",gap:"8px"}}><Sparkles size={14} strokeWidth={2}/> Ask AI <ArrowRight size={13} strokeWidth={2.5}/></button>
            <button onClick={()=>setReviewOpen(true)} style={{flex:1,background:K.ctaBg,color:"#1C1812",border:"none",padding:"20px 24px",fontFamily:"'Inter',sans-serif",fontSize:"12px",fontWeight:600,cursor:"pointer",borderBottom:`1.5px solid ${K.bdrSm}`,transition:"opacity 0.15s",textAlign:"left",display:"flex",alignItems:"center",gap:"8px"}}><ClipboardList size={14} strokeWidth={2}/> Weekly Review <ArrowRight size={13} strokeWidth={2.5}/></button>
            <button onClick={()=>setActive("calendar")} style={{flex:1,background:K.cardLo,color:K.txt2,border:"none",padding:"20px 24px",fontFamily:"'Inter',sans-serif",fontSize:"12px",fontWeight:500,cursor:"pointer",transition:"opacity 0.15s",textAlign:"left",display:"flex",alignItems:"center",gap:"8px"}}><CalendarDays size={14} strokeWidth={2}/> Calendar <ArrowRight size={13} strokeWidth={2.5}/></button>
          </div>
        </div>
      </Card>

      {/* ── TAB BAR ── */}
      <div style={{display:"flex",gap:"4px",background:K.surf,padding:"4px",borderRadius:"12px",border:`1.5px solid ${K.bdrSm}`,width:"fit-content",boxShadow:K.shadowSm}}>
        {[["overview",<><LayoutGrid size={11} strokeWidth={2}/> Overview</>],["progress",<><BarChart2 size={11} strokeWidth={2}/> Progress</>]].map(([t,l])=>(
          <button key={t} onClick={()=>setHomeTab(t)} style={{background:homeTab===t?K.bdr:"transparent",color:homeTab===t?K.card:K.txt2,border:"none",padding:"8px 20px",borderRadius:"10px",cursor:"pointer",fontFamily:"'Inter',sans-serif",fontSize:"11px",fontWeight:700,transition:"all 0.15s",display:"flex",alignItems:"center",gap:"5px"}}>{l}</button>
        ))}
      </div>

      {homeTab==="overview"&&(
        <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>

          {/* Priorities + Habits */}
          <div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:"12px"}}>

            <Card>
              <CardHead>
                <Label style={{display:"flex",alignItems:"center",gap:"6px"}}><Diamond size={11} strokeWidth={2.5} color={K.accent}/> HIGH PRIORITY</Label>
                <span style={{width:"8px",height:"8px",borderRadius:"50%",background:allHigh.length>0?K.red:K.grn,display:"inline-block"}}/>
              </CardHead>
              <div style={{padding:"12px"}}>
                {allHigh.length===0
                  ?<div style={{padding:"18px",color:K.txt3,fontSize:"13px",textAlign:"center"}}>All clear 🎉</div>
                  :allHigh.map(t=>{
                      const s=SECTIONS.find(x=>x.id===t.section),dl=formatDate(t.deadline);
                      return (
                        <div key={t.id} onClick={()=>setActive(t.section)} className="nx-card-hover" style={{display:"flex",alignItems:"center",gap:"10px",padding:"10px 12px",background:K.surf,borderRadius:"12px",border:`1.5px solid ${K.bdrSm}`,marginBottom:"6px",cursor:"pointer",transition:"all 0.15s",boxShadow:K.shadowSm}}>
                          <div style={{width:"7px",height:"7px",borderRadius:"50%",background:s?.color||K.accent,flexShrink:0}}/>
                          <div style={{flex:1,fontSize:"13px",color:K.txt}}>{t.text}</div>
                          <span style={{fontSize:"10px",color:dl.color,fontFamily:"'Inter',sans-serif",fontWeight:700,flexShrink:0}}>{dl.label}</span>
                        </div>
                      );
                    })
                }
              </div>
            </Card>

            <Card>
              <CardHead>
                <Label style={{display:"flex",alignItems:"center",gap:"6px"}}><Target size={11} strokeWidth={2.5} color={K.txt2}/> HABITS</Label>
                <Pill onClick={()=>setAddingHabit(v=>!v)} variant="ghostSm">{addingHabit?"CANCEL":"+ ADD"}</Pill>
              </CardHead>
              <div style={{padding:"12px"}}>
                {addingHabit&&(
                  <div style={{display:"flex",gap:"5px",marginBottom:"10px"}}>
                    <input value={newHabitTxt} onChange={e=>setNewHabitTxt(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addHabit()} placeholder="New habit..." autoFocus
                      style={{flex:1,background:K.inpt,border:`1.5px solid ${K.bdrSm}`,color:K.txt,padding:"7px 11px",borderRadius:"10px",fontFamily:"'Inter',sans-serif",fontSize:"12px",outline:"none"}}/>
                    <Pill onClick={addHabit} variant="sm">ADD</Pill>
                  </div>
                )}
                {habits.length===0&&<div style={{color:K.txt3,fontSize:"12px",padding:"10px"}}>No habits yet — add one ↑</div>}
                {habits.map(h=>(
                  <div key={h.id} style={{display:"flex",alignItems:"center",gap:"8px",padding:"8px 9px",borderRadius:"10px",background:h.done?`${K.grn}12`:"transparent",marginBottom:"4px",transition:"all 0.15s",boxShadow:h.done?"0 1px 4px rgba(46,158,104,0.12)":"none"}}>
                    <div onClick={()=>toggleHabit(h.id)} style={{width:"17px",height:"17px",borderRadius:"5px",border:`2px solid ${h.done?K.grn:K.bdrSm}`,background:h.done?K.grn:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,cursor:"pointer"}}>
                      {h.done&&<Check size={10} strokeWidth={3} color="#fff"/>}
                    </div>
                    <div onClick={()=>toggleHabit(h.id)} style={{flex:1,fontSize:"12px",color:h.done?K.grn:K.txt,textDecoration:h.done?"line-through":"none",cursor:"pointer"}}>{h.label}</div>
                    <span style={{fontSize:"11px",color:K.accent,fontFamily:"'JetBrains Mono',monospace",fontWeight:500}}>{h.streak}🔥</span>
                    <button onClick={e=>{e.stopPropagation();deleteHabit(h.id);}} style={{background:"transparent",border:"none",color:K.txt3,cursor:"pointer",padding:"0 2px",display:"flex",alignItems:"center"}}><X size={12} strokeWidth={2}/></button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Life Areas Bento */}
          <Card>
            <CardHead><Label style={{display:"flex",alignItems:"center",gap:"6px"}}><LayoutGrid size={11} strokeWidth={2.5} color={K.txt2}/> LIFE AREAS</Label></CardHead>
            <div style={{padding:"14px",display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:"8px"}}>
              {SECTIONS.filter(s=>s.id!=="home"&&s.id!=="calendar").map(s=>{
                const p=pend(s.id);
                const ov=(tasks[s.id]||[]).filter(t=>!t.done&&new Date(t.deadline)<new Date()).length;
                const isAct=active===s.id;
                return (
                  <div key={s.id} onClick={()=>setActive(s.id)} className="nx-card-hover" style={{padding:"14px 12px",background:isAct?K.bdr:K.cardLo,borderRadius:"14px",cursor:"pointer",border:`1.5px solid ${isAct?K.bdr:K.bdrSm}`,transition:"all 0.18s",position:"relative",boxShadow:isAct?"0 4px 14px rgba(26,23,16,0.18)":K.shadowSm}}>
                    <div style={{marginBottom:"8px",display:"flex",alignItems:"center",justifyContent:"flex-start",color:isAct?K.ctaBg:s.color}}><SecIcon id={s.id} size={18} color={isAct?K.ctaBg:s.color}/></div>
                    <div style={{fontFamily:"'Inter',sans-serif",fontSize:"9px",fontWeight:600,color:isAct?K.card:K.txt2,letterSpacing:"0.5px",marginTop:"2px"}}>{s.label}</div>
                    {p>0&&<div style={{position:"absolute",top:"8px",right:"8px",fontSize:"9px",background:ov>0?`${K.red}22`:`${s.color}22`,color:ov>0?K.red:s.color,padding:"2px 6px",borderRadius:"10px",fontFamily:"'Inter',sans-serif",fontWeight:700}}>{p}</div>}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {homeTab==="progress"&&<ProgressCharts tasks={tasks}/>}
    </div>
  );
}

// ── SectionView ───────────────────────────────────────────────────────
function SectionView({ active, tasks, setTasks, notes, setNotes, habits, sectionTab, setSectionTab, accentColor }) {
  const [showAdd,setShowAdd]=useState(false);
  const [editNote,setEditNote]=useState(false);
  const [noteVal,setNoteVal]=useState(notes[active]||"");
  const [newTask,setNewTask]=useState({text:"",deadline:"",priority:"medium"});
  const [editTask,setEditTask]=useState(null);

  useEffect(()=>{setNoteVal(notes[active]||"");setEditNote(false);setShowAdd(false);setNewTask({text:"",deadline:"",priority:"medium"});setEditTask(null);},[active]);

  const secTasks=tasks[active]||[];
  const pending=secTasks.filter(t=>!t.done);
  const done=secTasks.filter(t=>t.done);

  const addTask=()=>{
    if(!newTask.text.trim())return;
    const dl=newTask.deadline||new Date(Date.now()+7*86400000).toISOString().split("T")[0];
    setTasks(p=>({...p,[active]:[...(p[active]||[]),{id:Date.now(),text:newTask.text.trim(),deadline:dl,done:false,priority:newTask.priority}]}));
    setNewTask({text:"",deadline:"",priority:"medium"}); setShowAdd(false);
  };
  const toggle=tid=>setTasks(p=>({...p,[active]:p[active].map(t=>t.id===tid?{...t,done:!t.done}:t)}));
  const del=tid=>setTasks(p=>({...p,[active]:p[active].filter(t=>t.id!==tid)}));
  const clearDone=()=>setTasks(p=>({...p,[active]:p[active].filter(t=>!t.done)}));
  const saveNote=()=>{setNotes(p=>({...p,[active]:noteVal}));setEditNote(false);};
  const saveEdit=()=>{if(!editTask)return;setTasks(p=>({...p,[active]:p[active].map(t=>t.id===editTask.id?{...t,...editTask}:t)}));setEditTask(null);};

  const today=new Date().toISOString().split("T")[0];
  const pClr={high:K.red,medium:K.accent,low:K.txt3};
  const inp=(extra={})=>({background:K.inpt,border:`1.5px solid ${K.bdrSm}`,color:K.txt,padding:"9px 14px",borderRadius:"12px",fontFamily:"'Inter',sans-serif",fontSize:"13px",outline:"none",...extra});

  return (
    <div style={{display:"flex",flexDirection:"column",gap:"14px",fontFamily:"'Inter',sans-serif"}}>

      {/* Tab bar */}
      <div style={{display:"flex",gap:"4px",background:K.surf,padding:"4px",borderRadius:"12px",border:`1.5px solid ${K.bdrSm}`,width:"fit-content",boxShadow:K.shadowSm}}>
        {[["notes",<><FileText size={11} strokeWidth={2}/> Notes</>],["tasks",<><CheckSquare size={11} strokeWidth={2}/> Tasks ({pending.length})</>],["mindmap",<><Network size={11} strokeWidth={2}/> Map</>]].map(([t,l])=>(
          <button key={t} onClick={()=>setSectionTab(t)} style={{background:sectionTab===t?K.bdr:"transparent",color:sectionTab===t?K.card:K.txt2,border:"none",padding:"8px 18px",borderRadius:"10px",cursor:"pointer",fontFamily:"'Inter',sans-serif",fontSize:"11px",fontWeight:700,transition:"all 0.15s",display:"flex",alignItems:"center",gap:"5px"}}>{l}</button>
        ))}
      </div>

      {/* NOTES */}
      {sectionTab==="notes"&&(
        <Card>
          <CardHead>
            <Label style={{display:"flex",alignItems:"center",gap:"6px"}}><FileText size={11} strokeWidth={2.5}/> NOTES {editNote&&<span style={{color:accentColor,fontSize:"10px",fontWeight:400,marginLeft:"6px",display:"flex",alignItems:"center",gap:"3px"}}><span style={{width:"6px",height:"6px",borderRadius:"50%",background:accentColor,display:"inline-block"}}/> editing</span>}</Label>
            <div style={{display:"flex",gap:"7px"}}>
              {editNote&&<Pill onClick={()=>{setNoteVal(notes[active]||"");setEditNote(false);}} variant="ghost" style={{fontSize:"10px",padding:"5px 14px"}}>CANCEL</Pill>}
              <Pill onClick={()=>editNote?saveNote():(setNoteVal(notes[active]||""),setEditNote(true))} variant={editNote?"lime":"ghost"} style={{fontSize:"11px",padding:"6px 16px"}}>{editNote?<><Check size={11} strokeWidth={2.5}/> SAVE</>:"EDIT"}</Pill>
            </div>
          </CardHead>
          {editNote
            ?<textarea value={noteVal} onChange={e=>setNoteVal(e.target.value)} autoFocus style={{width:"100%",minHeight:"320px",background:K.bg,color:K.txt,border:"none",padding:"20px 24px",fontFamily:"'Inter',sans-serif",fontSize:"14px",lineHeight:"1.9",resize:"vertical",outline:"none",boxSizing:"border-box"}}/>
            :<NotesRenderer content={notes[active]||""} accentColor={accentColor}/>
          }
        </Card>
      )}

      {/* TASKS */}
      {sectionTab==="tasks"&&(
        <Card>
          <CardHead>
            <Label style={{display:"flex",alignItems:"center",gap:"6px"}}><CheckSquare size={11} strokeWidth={2.5}/> TASKS <span style={{color:K.accent,fontWeight:700}}>{pending.length}</span>{done.length>0&&<span style={{color:K.txt3,fontSize:"10px",fontWeight:400,marginLeft:"8px"}}>{done.length} done</span>}</Label>
            <div style={{display:"flex",gap:"7px"}}>
              {done.length>0&&<Pill onClick={clearDone} variant="ghostSm"><Trash2 size={11} strokeWidth={2}/> Clear done</Pill>}
              <Pill onClick={()=>{setShowAdd(v=>!v);setEditTask(null);}} variant={showAdd?"ghost":"dark"} style={{fontSize:"11px",padding:"6px 16px"}}>{showAdd?"CANCEL":"+ ADD"}</Pill>
            </div>
          </CardHead>

          {showAdd&&(
            <div style={{padding:"14px 16px",borderBottom:`1.5px solid ${K.bdrSm}`,background:K.bg}}>
              <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
                <input value={newTask.text} onChange={e=>setNewTask(p=>({...p,text:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addTask()} placeholder="Task description..." autoFocus style={{...inp(),flex:1,minWidth:"140px"}}/>
                <input type="date" value={newTask.deadline} min={today} onChange={e=>setNewTask(p=>({...p,deadline:e.target.value}))} style={inp()}/>
                <select value={newTask.priority} onChange={e=>setNewTask(p=>({...p,priority:e.target.value}))} style={inp()}>
                  <option value="high">🔴 High</option><option value="medium">🟡 Medium</option><option value="low">⚪ Low</option>
                </select>
                <Pill onClick={addTask} style={{padding:"9px 22px"}}>ADD</Pill>
              </div>
            </div>
          )}

          {editTask&&(
            <div style={{padding:"14px 16px",borderBottom:`1.5px solid ${K.bdrSm}`,background:`${accentColor}08`}}>
              <div style={{fontSize:"10px",color:accentColor,fontFamily:"'Inter',sans-serif",fontWeight:700,marginBottom:"10px",letterSpacing:"0.5px",display:"flex",alignItems:"center",gap:"5px"}}><Pencil size={10} strokeWidth={2}/> EDITING TASK</div>
              <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
                <input value={editTask.text} onChange={e=>setEditTask(p=>({...p,text:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&saveEdit()} autoFocus style={{...inp({border:`1.5px solid ${accentColor}66`}),flex:1,minWidth:"140px"}}/>
                <input type="date" value={editTask.deadline} onChange={e=>setEditTask(p=>({...p,deadline:e.target.value}))} style={inp({border:`1.5px solid ${accentColor}66`})}/>
                <select value={editTask.priority} onChange={e=>setEditTask(p=>({...p,priority:e.target.value}))} style={inp({border:`1.5px solid ${accentColor}66`})}>
                  <option value="high">🔴 High</option><option value="medium">🟡 Medium</option><option value="low">⚪ Low</option>
                </select>
                <Pill onClick={saveEdit} style={{padding:"9px 20px"}}>SAVE</Pill>
                <Pill onClick={()=>setEditTask(null)} variant="ghost" style={{padding:"9px 14px"}}>✕</Pill>
              </div>
            </div>
          )}

          <div style={{padding:"10px 12px"}}>
            {secTasks.length===0
              ?<div style={{padding:"28px",color:K.txt3,fontSize:"13px",textAlign:"center"}}>No tasks yet — hit + ADD above</div>
              :secTasks.map(t=>{
                  const dl=formatDate(t.deadline),isEd=editTask?.id===t.id;
                  return (
                    <div key={t.id} style={{display:"flex",alignItems:"center",gap:"10px",padding:"11px 14px",borderRadius:"14px",marginBottom:"5px",background:t.done?"transparent":isEd?`${accentColor}0A`:K.surf,border:`1.5px solid ${isEd?accentColor+"55":t.done?"transparent":K.bdrSm}`,opacity:t.done?0.45:1,transition:"all 0.15s",boxShadow:t.done?"none":K.shadowSm}}>
                      <div onClick={()=>toggle(t.id)} style={{width:"18px",height:"18px",borderRadius:"5px",border:`2px solid ${t.done?accentColor:pClr[t.priority]}`,background:t.done?accentColor:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,cursor:"pointer"}}>
                        {t.done&&<Check size={10} strokeWidth={3} color="#fff"/>}
                      </div>
                      <div style={{flex:1,fontSize:"13px",color:t.done?K.txt3:K.txt,textDecoration:t.done?"line-through":"none",cursor:"pointer"}} onClick={()=>toggle(t.id)}>{t.text}</div>
                      <span style={{fontSize:"10px",background:`${pClr[t.priority]}18`,color:pClr[t.priority],padding:"3px 9px",borderRadius:"20px",fontFamily:"'JetBrains Mono',monospace",fontWeight:500,flexShrink:0,border:`1px solid ${pClr[t.priority]}30`,fontSize:"9px"}}>{t.priority}</span>
                      <span style={{fontSize:"10px",color:dl.color,flexShrink:0,minWidth:"66px",textAlign:"right",fontFamily:"'JetBrains Mono',monospace",fontWeight:400}}>{dl.label}</span>
                      {!t.done&&<button onClick={e=>{e.stopPropagation();isEd?setEditTask(null):setEditTask({id:t.id,text:t.text,deadline:t.deadline,priority:t.priority});}} style={{background:"transparent",border:"none",color:isEd?accentColor:K.txt3,cursor:"pointer",padding:"0 3px",flexShrink:0,display:"flex",alignItems:"center"}}><Pencil size={12} strokeWidth={2}/></button>}
                      <button onClick={e=>{e.stopPropagation();del(t.id);}} style={{background:"transparent",border:"none",color:K.txt3,cursor:"pointer",padding:"0 3px",flexShrink:0,display:"flex",alignItems:"center"}} onMouseEnter={e=>{e.currentTarget.style.color=K.red;e.currentTarget.style.transform="scale(1.2)"}} onMouseLeave={e=>{e.currentTarget.style.color=K.txt3;e.currentTarget.style.transform="scale(1)"}}><Trash2 size={12} strokeWidth={2}/></button>
                    </div>
                  );
                })
            }
          </div>
        </Card>
      )}

      {sectionTab==="mindmap"&&<MindMap sectionId={active} tasks={tasks} notes={notes} setNotes={setNotes} color={accentColor}/>}
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────
export default function Nexus() {
  const [active,      setActive]      = useState("home");
  const [tasks,       setTasks]       = useState(DEFAULT_TASKS);
  const [notes,       setNotes]       = useState(DEFAULT_NOTES);
  const [habits,      setHabits]      = useState(DEFAULT_HABITS);
  const [sectionTab,  setSectionTab]  = useState("notes");
  const [homeTab,     setHomeTab]     = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [aiOpen,      setAiOpen]      = useState(false);
  const [themeId,     setThemeId]     = useState("linen");
  const [themeOpen,   setThemeOpen]   = useState(false);
  const [reviewOpen,  setReviewOpen]  = useState(false);
  const [mounted,     setMounted]     = useState(false);
  const [storageOk,   setStorageOk]   = useState(false);
  const saveTimer = useRef(null);
  const { permission, requestPermission, notifLog } = useNotifications(tasks);

  useEffect(()=>{
    const lnk=document.createElement("link"); lnk.rel="stylesheet";
    lnk.href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap";
    document.head.appendChild(lnk);
    (async()=>{
      try {
        const [t,n,h,th]=await Promise.all([window.storage?.get("nexus-tasks"),window.storage?.get("nexus-notes"),window.storage?.get("nexus-habits"),window.storage?.get("nexus-theme")]);
        if(t?.value)setTasks(JSON.parse(t.value));
        if(n?.value)setNotes(JSON.parse(n.value));
        if(h?.value)setHabits(JSON.parse(h.value));
        if(th?.value && THEMES[th.value]) setThemeId(th.value);
      } catch {}
      setStorageOk(true); setMounted(true);
    })();
  },[]);

  const save=useCallback((t,n,h)=>{
    clearTimeout(saveTimer.current);
    saveTimer.current=setTimeout(async()=>{try{await Promise.all([window.storage?.set("nexus-tasks",JSON.stringify(t)),window.storage?.set("nexus-notes",JSON.stringify(n)),window.storage?.set("nexus-habits",JSON.stringify(h))]);}catch{}},800);
  },[]);
  useEffect(()=>{if(storageOk)save(tasks,notes,habits);},[tasks,notes,habits,storageOk,save]);
  useEffect(()=>{if(storageOk)window.storage?.set("nexus-theme",themeId).catch(()=>{});},[themeId,storageOk]);
  useEffect(()=>{setSectionTab("notes");},[active]);

  // Apply active theme globally
  K = THEMES[themeId] || THEMES.linen;
  const sec=SECTIONS.find(s=>s.id===active);
  const accent=sec?.color||K.accent;
  const pend=sid=>(tasks[sid]||[]).filter(t=>!t.done).length;
  const navSecs=[...SECTIONS.filter(s=>s.id!=="calendar"),SECTIONS.find(s=>s.id==="calendar")];

  return (
    <div className="nx-theme-transition" style={{display:"flex",height:"100vh",width:"100%",background:K.bg,fontFamily:"'Inter',sans-serif",color:K.txt,overflow:"hidden",fontSize:"13px",opacity:mounted?1:0,transition:"opacity 0.5s"}}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
        .nx-theme-transition,.nx-theme-transition *{transition:background-color 0.25s ease,border-color 0.25s ease,color 0.15s ease!important}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:${K.surf}}
        ::-webkit-scrollbar-thumb{background:rgba(26,23,16,0.2);border-radius:4px}
        input[type="date"]::-webkit-calendar-picker-indicator{opacity:0.4;cursor:pointer}
        button:focus,textarea:focus,input:focus,select:focus{outline:none}
        select{-webkit-appearance:none;appearance:none}
        @keyframes nx-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        h1,h2,h3{font-family:'Instrument Serif',serif}
        .nx-card-hover:hover{box-shadow:0 8px 28px rgba(26,23,16,0.13),0 3px 8px rgba(26,23,16,0.08)!important;transform:translateY(-1px);transition:all 0.2s!important}
        .nx-nav-item:hover{background:rgba(26,23,16,0.06)!important}
      `}</style>

      {/* ══ SIDEBAR ══ */}
      <div style={{width:sidebarOpen?"222px":"62px",background:K.surf,borderRight:`2px solid ${K.bdr}`,display:"flex",flexDirection:"column",transition:"width 0.3s cubic-bezier(0.4,0,0.2,1)",overflow:"hidden",flexShrink:0,boxShadow:"4px 0 24px rgba(26,23,16,0.10), 2px 0 8px rgba(26,23,16,0.06)",zIndex:10,position:"relative"}}>

        {/* Logo */}
        <div style={{padding:"18px 14px",borderBottom:`1.5px solid ${K.bdrSm}`,display:"flex",alignItems:"center",justifyContent:sidebarOpen?"space-between":"center",minHeight:"64px"}}>
          {sidebarOpen&&(
            <div style={{display:"flex",alignItems:"center",gap:"11px"}}>
              {/* Mark: two stacked bars — minimalist logotype feel */}
              <div style={{width:"32px",height:"32px",borderRadius:"8px",background:K.brand,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"0 2px 8px rgba(26,23,20,0.28), inset 0 1px 0 rgba(255,255,255,0.06)"}}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="3" width="12" height="2.5" rx="1.25" fill="#D4A843"/>
                  <rect x="2" y="7.5" width="8" height="2.5" rx="1.25" fill="#D4A843" opacity="0.7"/>
                  <rect x="2" y="12" width="5" height="2" rx="1" fill="#D4A843" opacity="0.4"/>
                </svg>
              </div>
              <div>
                <div style={{fontFamily:"'Inter',sans-serif",fontSize:"14px",fontWeight:700,color:K.txt,letterSpacing:"0.08em",lineHeight:1}}>NEXUS</div>
                <div style={{fontFamily:"'Inter',sans-serif",fontSize:"9px",fontWeight:400,color:K.txt3,letterSpacing:"0.12em",marginTop:"2px",lineHeight:1}}>LIFE OS</div>
              </div>
            </div>
          )}
          <button onClick={()=>setSidebarOpen(v=>!v)} style={{background:K.card,border:`1.5px solid ${K.bdrSm}`,color:K.txt2,cursor:"pointer",fontSize:"13px",width:"34px",height:"34px",borderRadius:"10px",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.15s"}}>
            {sidebarOpen?<ChevronLeft size={15} strokeWidth={2.5}/>:<ChevronRight size={15} strokeWidth={2.5}/>}
          </button>
        </div>

        {/* Nav */}
        <nav style={{flex:1,padding:"10px 8px",display:"flex",flexDirection:"column",gap:"3px",overflowY:"auto"}}>
          {navSecs.map(s=>{
            const p=pend(s.id),isAct=active===s.id;
            return (
              <div key={s.id} onClick={()=>setActive(s.id)} style={{display:"flex",alignItems:"center",gap:"10px",padding:"9px 11px",borderRadius:"12px",cursor:"pointer",background:isAct?K.brand:"transparent",border:`1.5px solid transparent`,color:isAct?K.bg:K.txt2,whiteSpace:"nowrap",overflow:"hidden",transition:"all 0.15s"}}>
                <span style={{width:"20px",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:isAct?K.ctaBg:s.color}}><SecIcon id={s.id} size={15} color={isAct?K.ctaBg:s.color}/></span>
                <span style={{fontFamily:"'Inter',sans-serif",fontSize:"12px",fontWeight:isAct?600:400,color:isAct?K.bg:K.txt2,opacity:sidebarOpen?1:0,transition:"opacity 0.2s",flex:1}}>{s.label}</span>
                {sidebarOpen&&s.id!=="home"&&s.id!=="calendar"&&p>0&&(
                  <span style={{fontSize:"9px",background:isAct?"rgba(255,255,255,0.15)":s.color+"22",color:isAct?K.ctaBg:s.color,minWidth:"20px",height:"20px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Inter',sans-serif",fontWeight:700,flexShrink:0,padding:"0 2px"}}>{p}</span>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{padding:"6px 8px 12px",borderTop:`1.5px solid ${K.bdrSm}`,display:"flex",flexDirection:"column",gap:"3px"}}>
          <div onClick={()=>setAiOpen(v=>!v)} style={{display:"flex",alignItems:"center",gap:"10px",padding:"9px 11px",borderRadius:"12px",cursor:"pointer",background:aiOpen?K.bdr:"transparent",border:`1.5px solid ${aiOpen?K.bdr:"transparent"}`,transition:"all 0.15s"}}>
            <span style={{width:"20px",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:aiOpen?K.ctaBg:K.txt3}}><Sparkles size={15} strokeWidth={2}/></span>
            <span style={{fontFamily:"'Inter',sans-serif",fontSize:"12px",fontWeight:400,color:aiOpen?K.bg:K.txt2,opacity:sidebarOpen?1:0,whiteSpace:"nowrap"}}>AI Assistant</span>
          </div>
          <div onClick={()=>setReviewOpen(true)} style={{display:"flex",alignItems:"center",gap:"10px",padding:"9px 11px",borderRadius:"12px",cursor:"pointer",border:"1.5px solid transparent",transition:"all 0.15s"}}>
            <span style={{width:"20px",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:K.txt3}}><ClipboardList size={15} strokeWidth={2}/></span>
            <span style={{fontFamily:"'Inter',sans-serif",fontSize:"12px",fontWeight:400,color:K.txt2,opacity:sidebarOpen?1:0,whiteSpace:"nowrap"}}>Weekly Review</span>
          </div>
          {/* Theme Picker Button */}
          <div onClick={()=>setThemeOpen(true)} style={{display:"flex",alignItems:"center",gap:"10px",padding:"9px 11px",borderRadius:"12px",cursor:"pointer",border:"1.5px solid transparent",transition:"all 0.15s"}}>
            <span style={{width:"20px",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <div style={{display:"flex",gap:"2px"}}>
                {[K.accent, K.ctaBg, K.brand].map((c,i)=><div key={i} style={{width:"5px",height:"5px",borderRadius:"50%",background:c}}/>)}
              </div>
            </span>
            <span style={{fontFamily:"'Inter',sans-serif",fontSize:"12px",fontWeight:400,color:K.txt2,opacity:sidebarOpen?1:0,whiteSpace:"nowrap"}}>Appearance</span>
          </div>
          {sidebarOpen&&<div style={{padding:"8px 11px",fontSize:"9px",color:K.txt3,borderTop:`1px solid ${K.bdrSm}`,marginTop:"3px",fontFamily:"'JetBrains Mono',monospace",letterSpacing:"0.8px"}}>NEXUS v3 · {permission==="granted"?<><Bell size={9} strokeWidth={2}/> on</>:<><BellOff size={9} strokeWidth={2}/> off</>}</div>}
        </div>
      </div>

      {/* ══ MAIN ══ */}
      <main style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",marginRight:aiOpen?"380px":"0",transition:"margin-right 0.3s cubic-bezier(0.4,0,0.2,1)"}}>

        {/* Top bar */}
        <div style={{padding:"0 28px",borderBottom:`2px solid ${K.bdr}`,display:"flex",alignItems:"center",justifyContent:"space-between",background:K.surf,flexShrink:0,minHeight:"64px",boxShadow:"0 4px 16px rgba(26,23,16,0.09), 0 1px 4px rgba(26,23,16,0.06)",zIndex:5,position:"relative"}}>
          <div style={{display:"flex",alignItems:"center",gap:"20px"}}>
            <div style={{display:"flex",alignItems:"center",gap:"16px"}}>
              <div style={{width:"3px",height:"26px",borderRadius:"2px",background:K.accent,flexShrink:0,opacity:0.8}}/>
              <div>
                <div style={{fontFamily:"'Instrument Serif',serif",fontSize:"22px",fontWeight:400,color:K.txt,lineHeight:1,letterSpacing:"0.01em",fontStyle:"italic"}}>{sec?.label||"Home"}</div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",fontWeight:400,color:K.txt3,letterSpacing:"0.1em",marginTop:"4px",lineHeight:1}}>{new Date().toLocaleDateString("en-IN",{weekday:"short",day:"2-digit",month:"short",year:"numeric"}).toUpperCase()}</div>
              </div>
            </div>
          </div>
          <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
            <Pill onClick={()=>setAiOpen(v=>!v)} variant={aiOpen?"dark":"ghost"} style={{fontSize:"11px",padding:"7px 18px"}}><Sparkles size={12} strokeWidth={2}/> AI</Pill>
            <Pill onClick={()=>setReviewOpen(true)} variant="lime" style={{fontSize:"11px",padding:"7px 18px"}}><ClipboardList size={12} strokeWidth={2}/> Review</Pill>
            {permission!=="granted"&&<Pill onClick={requestPermission} variant="ghost" style={{fontSize:"11px",padding:"7px 14px"}}><Bell size={12} strokeWidth={2}/></Pill>}
          </div>
        </div>

        {/* Content */}
        <div style={{flex:1,overflowY:"auto",padding:"22px 28px"}}>
          {active==="home"&&<HomeView tasks={tasks} habits={habits} setHabits={setHabits} notes={notes} active={active} homeTab={homeTab} setHomeTab={setHomeTab} setActive={setActive} permission={permission} requestPermission={requestPermission} notifLog={notifLog} setAiOpen={setAiOpen} setReviewOpen={setReviewOpen}/>}
          {active==="calendar"&&<CalendarView tasks={tasks} onNavigate={sid=>setActive(sid)}/>}
          {active!=="home"&&active!=="calendar"&&<SectionView key={active} active={active} tasks={tasks} setTasks={setTasks} notes={notes} setNotes={setNotes} habits={habits} sectionTab={sectionTab} setSectionTab={setSectionTab} accentColor={accent}/>}
        </div>
      </main>

      {/* ══ AI PANEL ══ */}
      <ThemePicker current={themeId} onChange={setThemeId} open={themeOpen} onClose={()=>setThemeOpen(false)}/>
      <AIAssistant open={aiOpen} onClose={()=>setAiOpen(false)} tasks={tasks} notes={notes} habits={habits}/>
      <WeeklyReview open={reviewOpen} onClose={()=>setReviewOpen(false)} tasks={tasks} notes={notes} habits={habits}/>
    </div>
  );
}
