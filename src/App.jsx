import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPA_URL = "https://pmlrqzviwjnfwowdhjiy.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtbHJxenZpd2puZndvd2Roaml5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwMDA5NTYsImV4cCI6MjA5MzU3Njk1Nn0.Ys_JFKJ-1jnxr70ssRtlNxxREClgVIJQ8GxcI4gIVRE";
const supabase = createClient(SUPA_URL, SUPA_KEY);

const HIPATIA_URL  = "https://m365.cloud.microsoft/chat/?titleId=T_9b1c72cd-8ffb-8b74-1e22-11bf2bab84e9&source=embedded-builder";
const SORJUANA_URL = "https://m365.cloud.microsoft/chat/?titleId=T_87e151b4-d92c-6ec5-985a-0e66bad65f0d&source";
const TEACHER_PASSWORD = "Hipatia26";
const FETCH_INTERVAL   = 30000;
const IDLE_MS          = 10 * 60 * 1000;

const BASE = import.meta.env.BASE_URL;
const LOGOS = {
  cc_iso:  BASE + "assets/cc-iso.svg",
  cc_word: BASE + "assets/cc-word.svg",
  lasalle: BASE + "assets/lasalle.svg",
  unesco:  BASE + "assets/unesco.svg",
};

const CC = {
  tinta:"#171717", papel:"#F4EFE6", papelBlanco:"#FAF8F3", papelSecund:"#E8E3DA",
  terracota:"#B85C38", azulNoche:"#17324D",
  verdeCuidado:"#6F8F72", amarillo:"#E5B94E", grisCiudad:"#6D6A65", grisPapel:"#E8E3DA",
  tintaSuave:"#2A2A2A", tintaBorde:"#333333",
  successBg:"rgba(111,143,114,0.14)", successBd:"rgba(111,143,114,0.35)", successTxt:"#3D5E3F",
  warningBg:"rgba(229,185,78,0.16)",  warningBd:"rgba(229,185,78,0.40)",  warningTxt:"#7A5E1A",
  errorBg:"rgba(184,92,56,0.12)",     errorBd:"rgba(184,92,56,0.35)",     errorTxt:"#B85C38",
  infoBg:"rgba(23,50,77,0.08)",       infoBd:"rgba(23,50,77,0.28)",       infoTxt:"#17324D",
  shadowSm:"0 1px 3px rgba(23,23,23,0.08)",
  shadowMd:"0 4px 12px rgba(23,23,23,0.10)",
  shadowLg:"0 8px 24px rgba(23,23,23,0.12)",
};
const F = {
  display: "'Fraunces',Georgia,serif",
  body:    "'Inter',system-ui,sans-serif",
  mono:    "'IBM Plex Mono',monospace",
};
const FASES = [
  {n:1,label:"Hipatia"},
  {n:2,label:"Prompt"},
  {n:3,label:"Sor Juana"},
  {n:4,label:"Fichas"},
  {n:5,label:"Listo"},
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,400;0,600;0,700;0,900;1,400&family=Inter:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@300;400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
::-webkit-scrollbar{width:5px;height:5px;}
::-webkit-scrollbar-track{background:#E8E3DA;}
::-webkit-scrollbar-thumb{background:#B85C38;border-radius:9999px;}
.cc-input{width:100%;padding:10px 12px;font-family:'Inter',system-ui,sans-serif;font-size:14px;color:#171717;background:#FAF8F3;border:1px solid #D4CFCA;border-radius:4px;transition:border-color 150ms,box-shadow 150ms;outline:none;}
.cc-input:focus{border-color:#17324D;box-shadow:0 0 0 3px rgba(184,92,56,0.28);}
.cc-input::placeholder{color:#6D6A65;opacity:0.75;}
select.cc-input option{background:#FAF8F3;}
.cc-label{display:block;margin-bottom:5px;font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:500;color:#6D6A65;letter-spacing:0.08em;text-transform:uppercase;}
.btn-p{font-family:'Inter',system-ui,sans-serif;font-size:13px;font-weight:600;color:#FAF8F3;background:#17324D;border:none;border-radius:6px;padding:10px 20px;cursor:pointer;transition:background 200ms;}
.btn-p:hover{background:#0F2338;}
.btn-p:disabled{background:#E8E3DA;color:#9E9B96;cursor:not-allowed;}
.btn-t{background:#B85C38!important;}
.btn-t:hover{background:#9E4E2E!important;}
.btn-g{font-family:'Inter',system-ui,sans-serif;font-size:12px;font-weight:500;color:#6D6A65;background:transparent;border:1px solid #D4CFCA;border-radius:6px;padding:7px 14px;cursor:pointer;transition:all 150ms;}
.btn-g:hover{border-color:#B85C38;color:#B85C38;}
.modal-bg{position:fixed;inset:0;background:rgba(23,23,23,0.65);backdrop-filter:blur(5px);z-index:300;display:flex;align-items:center;justify-content:center;padding:16px;}
.modal{background:#F4EFE6;border-radius:16px;border:1px solid #E8E3DA;box-shadow:0 16px 48px rgba(23,23,23,0.18);width:100%;max-width:560px;max-height:92vh;overflow-y:auto;padding:28px;}
.preview{background:#FAF8F3;border:1px solid #E8E3DA;border-radius:6px;padding:11px 13px;font-family:'IBM Plex Mono',monospace;font-size:9px;color:#6D6A65;white-space:pre-wrap;max-height:120px;overflow-y:auto;line-height:1.65;}
.tag{display:inline-block;padding:2px 7px;border-radius:3px;font-family:'IBM Plex Mono',monospace;font-size:9px;letter-spacing:0.06em;text-transform:uppercase;}
.field{margin-bottom:14px;}
`;

function copyText(t) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(t).catch(() => execCopy(t));
  return execCopy(t);
}
function execCopy(t) {
  return new Promise((res, rej) => {
    try {
      const ta = document.createElement("textarea");
      ta.value = t;
      ta.style.cssText = "position:fixed;top:0;left:0;opacity:0;";
      document.body.appendChild(ta);
      ta.focus(); ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      res();
    } catch (e) { rej(e); }
  });
}

function riskC(r) {
  if (r === "bajo")  return { dot: CC.verdeCuidado };
  if (r === "medio") return { dot: CC.amarillo };
  return                    { dot: CC.terracota };
}
function RiskDot({ r, s = 8 }) {
  return <span style={{ display:"inline-block", width:s, height:s, borderRadius:"50%", background:riskC(r).dot, flexShrink:0 }} />;
}
function PhaseBar({ fase, dark = false }) {
  return (
    <div style={{ display:"flex", gap:5, alignItems:"flex-start" }}>
      {FASES.map(f => {
        const done = f.n < fase, act = f.n === fase;
        const bg = done ? CC.verdeCuidado : act ? (dark ? "#4A8BBE" : CC.azulNoche) : (dark ? CC.tintaBorde : CC.grisPapel);
        const lc = done ? (dark ? "rgba(244,239,230,0.55)" : CC.grisCiudad) : act ? (dark ? "#4A8BBE" : CC.azulNoche) : (dark ? "rgba(244,239,230,0.22)" : "#C8C3BA");
        return (
          <div key={f.n} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, flex:1 }}>
            <div style={{ width:"100%", height:3, borderRadius:9999, background:bg, transition:"background 300ms" }} />
            <span style={{ fontFamily:F.mono, fontSize:7, color:lc, letterSpacing:"0.06em", textTransform:"uppercase", lineHeight:1.1 }}>{f.label}</span>
          </div>
        );
      })}
    </div>
  );
}
function CopyBtn({ text, label = "Copiar", ghost = false }) {
  const [ok, setOk] = useState(false);
  const go = () => copyText(text)
    .then(() => { setOk(true); setTimeout(() => setOk(false), 2200); })
    .catch(() => { setOk(true); setTimeout(() => setOk(false), 2200); });
  if (ghost) return <button onClick={go} className="btn-g" style={ok ? { borderColor:CC.verdeCuidado, color:CC.successTxt } : {}}>{ok ? "Copiado" : `Copiar ${label}`}</button>;
  return <button onClick={go} className="btn-p btn-t" style={ok ? { background:CC.verdeCuidado } : {}}>{ok ? "Copiado" : `Copiar ${label}`}</button>;
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [nom, setNom]         = useState("");
  const [mat, setMat]         = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    if (!nom.trim() || !mat.trim()) { setError("Ingresa tu nomenclatura y matricula"); return; }
    setLoading(true); setError("");
    try {
      const { data, error: err } = await supabase.rpc("login_alumno", {
        p_nomenclatura: nom.trim().toUpperCase(),
        p_matricula: mat.trim(),
      });
      if (err || !data?.ok) { setError(data?.error || "Error de conexion"); setLoading(false); return; }
      onLogin(data);
    } catch {
      setError("Error de conexion. Verifica tu internet.");
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight:"100vh", background:CC.papel, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ width:"100%", maxWidth:380 }}>
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <img src={LOGOS.cc_iso} alt="Casa Colectiva" style={{ height:52, marginBottom:16 }} />
          <div style={{ fontFamily:F.display, fontSize:28, fontWeight:700, color:CC.tinta, marginBottom:6 }}>Ficha II</div>
          <div style={{ fontFamily:F.display, fontSize:15, color:CC.grisCiudad, fontStyle:"italic", marginBottom:4 }}>Marco Teorico · Fisica STEAM</div>
          <div style={{ fontFamily:F.mono, fontSize:9, color:CC.terracota, letterSpacing:"0.10em", textTransform:"uppercase" }}>Colegio Regiomontano Contry La Salle · 2 Secundaria</div>
        </div>
        <div style={{ background:CC.papelBlanco, border:`1px solid ${CC.grisPapel}`, borderRadius:14, padding:28, boxShadow:CC.shadowMd }}>
          <form onSubmit={handleLogin}>
            <div className="field">
              <label className="cc-label">Nomenclatura</label>
              <input className="cc-input" placeholder="ej. 2A15" value={nom}
                onChange={e => setNom(e.target.value.toUpperCase())} maxLength={4} autoComplete="off" />
              <div style={{ fontFamily:F.mono, fontSize:8, color:CC.grisCiudad, marginTop:4, opacity:0.7 }}>Grado + Grupo + Numero de lista</div>
            </div>
            <div className="field">
              <label className="cc-label">Matricula</label>
              <input className="cc-input" type="password" placeholder="Tu numero de matricula"
                value={mat} onChange={e => setMat(e.target.value)} autoComplete="off" />
            </div>
            {error && (
              <div style={{ background:CC.errorBg, border:`1px solid ${CC.errorBd}`, borderRadius:6, padding:"9px 12px", fontFamily:F.mono, fontSize:9, color:CC.errorTxt, marginBottom:14 }}>
                {error}
              </div>
            )}
            <button type="submit" className="btn-p btn-t" disabled={loading} style={{ width:"100%", fontSize:14, padding:"11px" }}>
              {loading ? "Verificando..." : "Entrar"}
            </button>
          </form>
        </div>
        <div style={{ textAlign:"center", marginTop:18, fontFamily:F.mono, fontSize:8, color:CC.grisCiudad, opacity:0.6 }}>
          Si tienes problemas, pide ayuda a tu maestro
        </div>
      </div>
    </div>
  );
}

// ─── IDLE MODAL ───────────────────────────────────────────────────────────────
function IdleModal({ user, onStay, onLeave }) {
  const [secs, setSecs] = useState(60);

  useEffect(() => {
    if (secs <= 0) { onLeave(); return; }
    const t = setTimeout(() => setSecs(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [secs]);

  return (
    <div className="modal-bg">
      <div className="modal" style={{ maxWidth:360, textAlign:"center", padding:40 }}>
        <div style={{ fontSize:48, marginBottom:14 }}>👋</div>
        <div style={{ fontFamily:F.display, fontSize:28, fontWeight:700, color:CC.tinta, marginBottom:8 }}>
          Sigues ahi?
        </div>
        <div style={{ fontFamily:F.display, fontSize:16, color:CC.grisCiudad, fontStyle:"italic", marginBottom:6 }}>
          {user.nombre}
        </div>
        <div style={{ fontFamily:F.mono, fontSize:10, color:CC.grisCiudad, marginBottom:30, lineHeight:1.6 }}>
          Tu sesion cerrara en{" "}
          <span style={{ color:CC.terracota, fontWeight:700, fontSize:13 }}>{secs}s</span>
          {" "}si no hay actividad
        </div>
        <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
          <button onClick={onLeave} className="btn-g" style={{ fontSize:13, padding:"9px 18px" }}>Salir</button>
          <button onClick={onStay} className="btn-p btn-t" style={{ minWidth:170, fontSize:14, padding:"9px 20px" }}>
            Si, continuo
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── HIPATIA MODAL ────────────────────────────────────────────────────────────
function HipatiaModal({ user, onClose }) {
  const today = new Date().toISOString().split("T")[0];
  const [members, setMembers]         = useState([{ nom:user.nomenclatura, nombre:user.nombre, loading:false, error:"" }]);
  const [form, setForm]               = useState({ fecha:today, sesion:"Primera", retorno:"", ficha:"Si", asign:"Asignado" });
  const [launched, setLaunched]       = useState(false);
  const [creating, setCreating]       = useState(false);
  const [errorEquipo, setErrorEquipo] = useState("");
  const [existingTeam, setExistingTeam] = useState(null);
  const [checkingTeam, setCheckingTeam] = useState(true);

  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }));

  useEffect(() => {
    supabase.from("equipos")
      .select("*")
      .contains("integrantes", [user.nomenclatura])
      .maybeSingle()
      .then(({ data }) => {
        if (data) setExistingTeam(data);
        setCheckingTeam(false);
      });
  }, []);

  useEffect(() => {
    const h = e => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  async function lookupMember(idx, nom) {
    if (nom.length !== 4) {
      setMembers(p => p.map((m, i) => i === idx ? { ...m, nombre:"", error:"" } : m));
      return;
    }
    setMembers(p => p.map((m, i) => i === idx ? { ...m, loading:true, error:"" } : m));
    const { data } = await supabase.rpc("buscar_alumno", { p_nomenclatura: nom.toUpperCase() });
    const alumno = data?.[0];
    setMembers(p => p.map((m, i) => i === idx ? {
      ...m, nombre: alumno?.nombre || "", loading: false,
      error: alumno ? "" : "No encontrado: " + nom,
    } : m));
  }

  const addMember    = () => { if (members.length < 7) setMembers(p => [...p, { nom:"", nombre:"", loading:false, error:"" }]); };
  const removeMember = idx => setMembers(p => p.filter((_, i) => i !== idx));
  const updateMember = (idx, nom) => {
    setMembers(p => p.map((m, i) => i === idx ? { ...m, nom: nom.toUpperCase() } : m));
    if (nom.length === 4) lookupMember(idx, nom);
  };

  const validMembers = members.filter(m => m.nombre && !m.error);
  const canCreate    = validMembers.length >= 2;

  function buildPrompt(equipoNombre) {
    const integrantes = validMembers.map(m => m.nombre).join(", ");
    const extra = form.sesion === "Retorno" && form.retorno ? ` - ${form.retorno}` : "";
    return `Hipatia, iniciamos una sesion grupal.

- Fecha: ${form.fecha}
- Grupo: ${user.grupo}
- Equipo: ${equipoNombre}
- Integrantes: ${integrantes} (${validMembers.length} miembros)
- Sesion: ${form.sesion}${extra}
- Ficha II visible: ${form.ficha}
- Tema: ${form.asign}

CRITERIOS QUE EL DOCENTE PRIORIZARA:
- Fenomeno fisico concreto y medible, no generico.
- Subtemas 5-7 con postura argumentativa real, no descriptiva.
- Al menos un subtema expositivo y uno argumentativo por alumno.

INSTRUCCION DE ARRANQUE: Confirma los datos, saluda al equipo con calidez y pide los datos de la Parte A.`;
  }

  async function handleGo() {
    if (!canCreate) return;
    setCreating(true); setErrorEquipo("");
    const { data } = await supabase.rpc("crear_equipo", {
      p_integrantes: validMembers.map(m => m.nom),
      p_grupo:    user.grupo,
      p_grado:    user.grado || "",
      p_tema:     "",
      p_fenomeno: "",
    });
    if (data?.ok === false) {
      setErrorEquipo(data.error || "Error al crear el equipo");
      setCreating(false);
      return;
    }
    setCreating(false);
    const equipoNombre = data?.nombreEquipo || "Equipo";
    window.open(HIPATIA_URL, "_blank");
    setLaunched(true);
    copyText(buildPrompt(equipoNombre)).catch(console.error);
  }

  if (checkingTeam) {
    return (
      <div className="modal-bg">
        <div className="modal" style={{ textAlign:"center", padding:48 }}>
          <div style={{ fontFamily:F.mono, fontSize:11, color:CC.grisCiudad }}>Verificando equipo...</div>
        </div>
      </div>
    );
  }

  if (existingTeam) {
    return (
      <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="modal">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20, paddingBottom:16, borderBottom:`1px solid ${CC.grisPapel}` }}>
            <div>
              <div style={{ fontFamily:F.display, fontSize:22, fontWeight:700, color:CC.tinta }}>Tu equipo ya esta registrado</div>
              <div style={{ fontFamily:F.mono, fontSize:9, color:CC.grisCiudad, marginTop:3, letterSpacing:"0.06em", textTransform:"uppercase" }}>{existingTeam.nombre} · {existingTeam.grupo}</div>
            </div>
            <button onClick={onClose} className="btn-g" style={{ padding:"4px 10px" }}>✕</button>
          </div>
          <div style={{ background:CC.infoBg, border:`1px solid ${CC.infoBd}`, borderRadius:8, padding:"14px 16px", marginBottom:20 }}>
            <div style={{ fontFamily:F.mono, fontSize:9, color:CC.azulNoche, marginBottom:10, letterSpacing:"0.06em", textTransform:"uppercase" }}>Integrantes</div>
            {(existingTeam.integrantes || []).map((nom, i) => (
              <div key={i} style={{ fontFamily:F.body, fontSize:13, color:CC.tinta, padding:"4px 0", borderBottom: i < existingTeam.integrantes.length - 1 ? `1px solid ${CC.grisPapel}` : "none" }}>{nom}</div>
            ))}
          </div>
          {!existingTeam.prompt_hijo && (
            <div style={{ background:CC.warningBg, border:`1px solid ${CC.warningBd}`, borderRadius:6, padding:"9px 12px", fontFamily:F.mono, fontSize:9, color:CC.warningTxt, marginBottom:16 }}>
              El equipo aun no tiene Prompt Hijo. Completa la sesion grupal con Hipatia.
            </div>
          )}
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
            <button onClick={onClose} className="btn-g">Cerrar</button>
            {existingTeam.prompt_hijo && (
              <button onClick={() => { window.open(HIPATIA_URL, "_blank"); copyText(existingTeam.prompt_hijo).catch(console.error); }} className="btn-p btn-t">
                Copiar prompt e ir a Hipatia
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22, paddingBottom:16, borderBottom:`1px solid ${CC.grisPapel}` }}>
          <div>
            <div style={{ fontFamily:F.display, fontSize:24, fontWeight:700, color:CC.tinta }}>Hipatia</div>
            <div style={{ fontFamily:F.mono, fontSize:9, color:CC.grisCiudad, marginTop:3, letterSpacing:"0.06em", textTransform:"uppercase" }}>Sesion grupal</div>
          </div>
          <button onClick={onClose} className="btn-g" style={{ padding:"4px 10px" }}>✕</button>
        </div>

        <div style={{ marginBottom:20 }}>
          <div style={{ fontFamily:F.mono, fontSize:9, color:CC.azulNoche, letterSpacing:"0.07em", textTransform:"uppercase", marginBottom:12 }}>Integrantes del equipo</div>
          {members.map((m, i) => (
            <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr 1fr auto", gap:8, marginBottom:8, alignItems:"center" }}>
              <div>
                {i === 0 && <label className="cc-label">Nomenclatura</label>}
                <input className="cc-input" placeholder="ej. 2B12" maxLength={4}
                  value={m.nom} onChange={e => updateMember(i, e.target.value)}
                  style={{ borderColor: m.error ? CC.terracota : m.nombre ? CC.verdeCuidado : "" }} />
              </div>
              <div>
                {i === 0 && <label className="cc-label">Nombre</label>}
                <div style={{ padding:"10px 12px", background:CC.papelSecund, borderRadius:4, fontFamily:F.body, fontSize:13, minHeight:40, display:"flex", alignItems:"center",
                  color: m.loading ? CC.grisCiudad : m.error ? CC.errorTxt : m.nombre ? CC.tinta : CC.grisCiudad }}>
                  {m.loading ? "Buscando..." : m.error || m.nombre || "—"}
                </div>
              </div>
              {i > 0
                ? <button onClick={() => removeMember(i)} style={{ background:"transparent", border:"none", cursor:"pointer", color:CC.grisCiudad, fontSize:16, padding:"0 4px" }}>×</button>
                : <div />
              }
            </div>
          ))}
          {members.length < 7 && (
            <button onClick={addMember} className="btn-g" style={{ fontSize:11, padding:"6px 12px", marginTop:4 }}>
              + Anadir integrante ({members.length}/7)
            </button>
          )}
          {canCreate && <div style={{ fontFamily:F.mono, fontSize:9, color:CC.successTxt, marginTop:8 }}>✓ {validMembers.length} integrantes confirmados</div>}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
          {[
            { k:"fecha",  l:"Fecha",        type:"date" },
            { k:"sesion", l:"Sesion",       type:"sel",  opts:["Primera","Retorno"] },
            { k:"ficha",  l:"Ficha visible", type:"sel", opts:["Si","No"] },
            { k:"asign",  l:"Tema",         type:"sel",  opts:["Asignado","Elegido por el equipo"] },
          ].map(({ k, l, type, opts }) => (
            <div key={k} className="field" style={{ marginBottom:0 }}>
              <label className="cc-label">{l}</label>
              {type === "date"
                ? <input type="date" className="cc-input" value={form[k]} onChange={e => setF(k, e.target.value)} />
                : <select className="cc-input" value={form[k]} onChange={e => setF(k, e.target.value)}>
                    {opts.map(o => <option key={o}>{o}</option>)}
                  </select>
              }
            </div>
          ))}
          {form.sesion === "Retorno" && (
            <div className="field" style={{ gridColumn:"1/-1", marginBottom:0 }}>
              <label className="cc-label">En que fase quedaron?</label>
              <input className="cc-input" placeholder="ej. Fase 2, subtemas pendientes"
                value={form.retorno} onChange={e => setF("retorno", e.target.value)} />
            </div>
          )}
        </div>

        {errorEquipo && (
          <div style={{ background:CC.errorBg, border:`1px solid ${CC.errorBd}`, borderRadius:6, padding:"9px 12px", fontFamily:F.mono, fontSize:9, color:CC.errorTxt, marginBottom:14 }}>
            {errorEquipo}
          </div>
        )}
        {!canCreate && (
          <div style={{ background:CC.warningBg, border:`1px solid ${CC.warningBd}`, borderRadius:6, padding:"9px 12px", fontFamily:F.mono, fontSize:9, color:CC.warningTxt, marginBottom:14 }}>
            Se necesitan minimo 2 integrantes validos
          </div>
        )}

        <div style={{ display:"flex", gap:10, justifyContent:"flex-end", alignItems:"center" }}>
          {launched && <span style={{ fontFamily:F.mono, fontSize:9, color:CC.successTxt }}>Copiado — abriendo Hipatia...</span>}
          <button onClick={onClose} className="btn-g">Cancelar</button>
          <button onClick={handleGo} disabled={!canCreate || creating} className="btn-p btn-t"
            style={{ opacity: canCreate && !creating ? 1 : 0.4 }}>
            {creating ? "Creando equipo..." : launched ? "Listo" : "Copiar y abrir Hipatia"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SOR JUANA MODAL ──────────────────────────────────────────────────────────
function SorJuanaModal({ user, onClose }) {
  const [equipos, setEquipos]   = useState([]);
  const [equipo, setEquipo]     = useState(null);
  const [subtemas, setSubtemas] = useState([]);
  const [tipo, setTipo]         = useState("ambos");
  const [sesion, setSesion]     = useState("1");
  const [retorno, setRetorno]   = useState("");
  const [launched, setLaunched] = useState(false);
  const [loading, setLoading]   = useState(true);

  function selectEquipo(eq) {
    setEquipo(eq);
    const subs  = Array.isArray(eq.subtemas) ? eq.subtemas : [];
    const mine  = subs.filter(s => s.alumno === user.nomenclatura);
    const nums  = mine.length > 0 ? mine.map(s => s.n).filter(n => typeof n === "number") : [];
    setSubtemas(nums);
  }

  useEffect(() => {
    supabase.from("equipos").select("*").eq("grupo", user.grupo)
      .then(({ data }) => {
        const all = data || [];
        setEquipos(all);
        const mine = all.find(e => Array.isArray(e.integrantes) && e.integrantes.includes(user.nomenclatura));
        if (mine) selectEquipo(mine);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const h = e => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  function buildPrompt() {
    if (!equipo) return "";
    const subStr  = subtemas.length > 0 ? "Subtemas " + subtemas.join(" y ") : "[seleccionar]";
    const retStr  = sesion === "2" ? (retorno || "Si") : "No";
    const ph      = equipo.prompt_hijo || "[Prompt Hijo pendiente — completa primero la sesion grupal con Hipatia]";
    return `Sor Juana, inicio mi sesion individual.
- Numero de sesion: ${sesion}
- Retomas sesion anterior: ${retStr}

${ph}

DATOS INDIVIDUALES:
Mi nombre: ${user.nombre}
Mi nomenclatura: ${user.nomenclatura}
Mis subtemas asignados: ${subStr}
Tipo de texto: ${tipo}`;
  }

  const canGo = Boolean(equipo && equipo.prompt_hijo && subtemas.length > 0);

  function handleGo() {
    window.open(SORJUANA_URL, "_blank");
    setLaunched(true);
    copyText(buildPrompt()).catch(console.error);
  }

  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22, paddingBottom:16, borderBottom:`1px solid ${CC.grisPapel}` }}>
          <div>
            <div style={{ fontFamily:F.display, fontSize:24, fontWeight:700, color:CC.tinta, fontStyle:"italic" }}>Sor Juana</div>
            <div style={{ fontFamily:F.mono, fontSize:9, color:CC.grisCiudad, marginTop:3, letterSpacing:"0.06em", textTransform:"uppercase" }}>Sesion individual</div>
          </div>
          <button onClick={onClose} className="btn-g" style={{ padding:"4px 10px" }}>✕</button>
        </div>

        <div style={{ marginBottom:18 }}>
          <div style={{ fontFamily:F.mono, fontSize:9, color:CC.azulNoche, letterSpacing:"0.07em", textTransform:"uppercase", marginBottom:10 }}>Tu equipo</div>
          {loading ? (
            <div style={{ fontFamily:F.mono, fontSize:10, color:CC.grisCiudad }}>Cargando equipos...</div>
          ) : equipos.length === 0 ? (
            <div style={{ fontFamily:F.mono, fontSize:9, color:CC.warningTxt, background:CC.warningBg, border:`1px solid ${CC.warningBd}`, borderRadius:6, padding:"10px 12px" }}>
              No hay equipos en {user.grupo}. Realiza primero la sesion grupal con Hipatia.
            </div>
          ) : (
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {equipos.map(eq => (
                <button key={eq.id} onClick={() => selectEquipo(eq)} style={{
                  padding:"7px 14px", borderRadius:6, cursor:"pointer", fontFamily:F.body, fontSize:13, fontWeight:500,
                  background: equipo?.id === eq.id ? CC.infoBg : "#FAF8F3",
                  border:     `1px solid ${equipo?.id === eq.id ? CC.azulNoche : CC.grisPapel}`,
                  color:      equipo?.id === eq.id ? CC.azulNoche : CC.tinta,
                  display:"flex", alignItems:"center", gap:7,
                }}>
                  {eq.nombre}
                  {equipo?.id === eq.id && <span style={{ color:CC.verdeCuidado, fontSize:11 }}>✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {equipo && (
          <>
            <div style={{ marginBottom:16 }}>
              <div style={{ fontFamily:F.mono, fontSize:9, color:CC.azulNoche, letterSpacing:"0.07em", textTransform:"uppercase", marginBottom:8 }}>Tus subtemas</div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {[1,2,3,4,5,6,7].map(n => {
                  const sel = subtemas.includes(n);
                  const ts  = n <= 4 ? "exp" : "arg";
                  return (
                    <button key={n}
                      onClick={() => setSubtemas(p => sel ? p.filter(x => x !== n) : [...p, n].sort((a,b)=>a-b))}
                      style={{
                        padding:"5px 10px", borderRadius:4, cursor:"pointer", fontFamily:F.mono, fontSize:10,
                        background: sel ? (ts==="exp" ? "rgba(23,50,77,0.08)" : "rgba(107,90,142,0.08)") : "#FAF8F3",
                        border:     `1px solid ${sel ? (ts==="exp" ? CC.azulNoche : "#6B5A8E") : CC.grisPapel}`,
                        color:      sel ? (ts==="exp" ? CC.azulNoche : "#6B5A8E") : CC.grisCiudad,
                      }}>
                      S{n} <span style={{ fontSize:8, opacity:0.6 }}>{ts}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
              <div className="field" style={{ marginBottom:0 }}>
                <label className="cc-label">Tipo de texto</label>
                <select className="cc-input" value={tipo} onChange={e => setTipo(e.target.value)}>
                  <option value="ambos">Ambos</option>
                  <option value="expositivo">Expositivo</option>
                  <option value="argumentativo">Argumentativo</option>
                </select>
              </div>
              <div className="field" style={{ marginBottom:0 }}>
                <label className="cc-label">Numero de sesion</label>
                <select className="cc-input" value={sesion} onChange={e => setSesion(e.target.value)}>
                  <option value="1">1 — Primera sesion</option>
                  <option value="2">2 — Retomando</option>
                </select>
              </div>
              {sesion === "2" && (
                <div className="field" style={{ gridColumn:"1/-1", marginBottom:0 }}>
                  <label className="cc-label">En que subtema y etapa quedaste?</label>
                  <input className="cc-input" placeholder="ej. Subtema 5, inicio Iteracion 2"
                    value={retorno} onChange={e => setRetorno(e.target.value)} />
                </div>
              )}
            </div>

            {!equipo.prompt_hijo && (
              <div style={{ background:CC.warningBg, border:`1px solid ${CC.warningBd}`, borderRadius:6, padding:"9px 12px", fontFamily:F.mono, fontSize:9, color:CC.warningTxt, marginBottom:14 }}>
                El equipo {equipo.nombre} aun no tiene Prompt Hijo. Completa primero la sesion grupal con Hipatia.
              </div>
            )}

            {canGo && (
              <div style={{ marginBottom:14 }}>
                <label className="cc-label" style={{ marginBottom:5 }}>Vista previa del prompt</label>
                <div className="preview">{buildPrompt()}</div>
              </div>
            )}
          </>
        )}

        <div style={{ display:"flex", gap:10, justifyContent:"flex-end", alignItems:"center" }}>
          {launched && <span style={{ fontFamily:F.mono, fontSize:9, color:CC.successTxt }}>Copiado — abriendo Sor Juana...</span>}
          <button onClick={onClose} className="btn-g">Cancelar</button>
          <button onClick={handleGo} disabled={!canGo} className="btn-p btn-t" style={{ opacity: canGo ? 1 : 0.35 }}>
            {launched ? "Listo" : "Copiar y abrir Sor Juana"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── STUDENT PORTAL ───────────────────────────────────────────────────────────
function StudentPortal({ user, sesionActiva, onLogout }) {
  const [modal, setModal] = useState(null);
  const hipActiva = sesionActiva === "grupal"     || sesionActiva === "ambas";
  const sorActiva = sesionActiva === "individual" || sesionActiva === "ambas";

  return (
    <div style={{ maxWidth:900, margin:"0 auto", padding:"36px 20px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
        <div style={{ fontFamily:F.display, fontSize:20, fontWeight:600, color:CC.tinta }}>Hola, {user.nombre}</div>
        <div style={{ fontFamily:F.mono, fontSize:9, color:CC.terracota, padding:"2px 7px", background:CC.errorBg, border:`1px solid ${CC.errorBd}`, borderRadius:3, letterSpacing:"0.08em", textTransform:"uppercase" }}>
          {user.nomenclatura} · {user.grupo}
        </div>
        <button onClick={onLogout} style={{ marginLeft:"auto", background:"transparent", border:"none", cursor:"pointer", fontFamily:F.mono, fontSize:9, color:CC.grisCiudad, letterSpacing:"0.06em", textTransform:"uppercase" }}>
          Cerrar sesion
        </button>
      </div>
      <div style={{ fontFamily:F.mono, fontSize:9, color:CC.grisCiudad, marginBottom:36 }}>Selecciona tu sesion de trabajo</div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:48 }}>
        {[
          { key:"hipatia",  name:"Hipatia",   italic:false, tag:"Sesion grupal",      desc:"Organiza tu proyecto y obtén el Prompt Hijo de tu equipo.", activa:hipActiva },
          { key:"sorjuana", name:"Sor Juana",  italic:true,  tag:"Sesion individual", desc:"Encuentra fuentes y elabora tus fichas de trabajo con acompañamiento.", activa:sorActiva },
        ].map(ag => (
          <div key={ag.key} style={{
            background: ag.activa ? CC.papelBlanco : "#EDE8DF",
            border:     `1.5px solid ${ag.activa ? CC.grisPapel : "#DDD8CF"}`,
            borderRadius:12, padding:"22px 22px 18px",
            boxShadow:  ag.activa ? CC.shadowSm : "none",
            opacity:    ag.activa ? 1 : 0.5,
          }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
              <div style={{ fontFamily:F.display, fontSize:26, fontWeight:700, color: ag.activa ? CC.tinta : "#9A9590", fontStyle: ag.italic ? "italic" : "normal", lineHeight:1.1 }}>{ag.name}</div>
              <span className="tag" style={{ background: ag.activa ? CC.infoBg : "transparent", border:`1px solid ${ag.activa ? CC.infoBd : "#DDD8CF"}`, color: ag.activa ? CC.azulNoche : "#C0BAB0" }}>
                {ag.activa ? "Activa" : "Inactiva"}
              </span>
            </div>
            <div style={{ fontFamily:F.mono, fontSize:8, color:CC.terracota, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:5 }}>{ag.tag}</div>
            <div style={{ fontFamily:F.body, fontSize:12, color:CC.grisCiudad, lineHeight:1.65, marginBottom:18 }}>{ag.desc}</div>
            <button onClick={() => ag.activa && setModal(ag.key)} disabled={!ag.activa}
              className="btn-p btn-t" style={{ width:"100%", opacity: ag.activa ? 1 : 0.35, fontSize:13, padding:"9px" }}>
              Preparar y abrir {ag.name}
            </button>
          </div>
        ))}
      </div>

      <div style={{ background:CC.papelBlanco, border:`1px solid ${CC.grisPapel}`, borderLeft:`3px solid ${CC.azulNoche}`, borderRadius:"0 8px 8px 0", padding:"16px 18px" }}>
        <div style={{ fontFamily:F.mono, fontSize:8, color:CC.azulNoche, letterSpacing:"0.10em", textTransform:"uppercase", marginBottom:12 }}>Andamiaje · Prompts sugeridos</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:9 }}>
          {[
            { ag:"Hipatia",   txt:"Para delimitar el fenomeno: que proceso fisico puedo medir en mi contexto?", ok:hipActiva },
            { ag:"Hipatia",   txt:"Si los subtemas 5-7 no tienen tension: alguien podria estar en desacuerdo?",  ok:hipActiva },
            { ag:"Sor Juana", txt:"Para fuentes: concepto + institucion — ej. efecto fotovoltaico UNAM",         ok:sorActiva },
            { ag:"Sor Juana", txt:"Justificacion: Institucion · Año · URL · Por que · Que idea usare",           ok:sorActiva },
          ].map((t, i) => (
            <div key={i} style={{ padding:"9px 11px", borderRadius:6, background: t.ok ? CC.papel : "#EDE8DF", border:`1px solid ${t.ok ? CC.grisPapel : "#DDD8CF"}`, opacity: t.ok ? 1 : 0.4 }}>
              <div style={{ fontFamily:F.mono, fontSize:7, color:CC.terracota, marginBottom:4, letterSpacing:"0.09em", textTransform:"uppercase" }}>{t.ag}</div>
              <div style={{ fontFamily:F.body, fontSize:10, color:CC.grisCiudad, lineHeight:1.6 }}>{t.txt}</div>
            </div>
          ))}
        </div>
      </div>

      {modal === "hipatia"  && <HipatiaModal  user={user} onClose={() => setModal(null)} />}
      {modal === "sorjuana" && <SorJuanaModal user={user} onClose={() => setModal(null)} />}
    </div>
  );
}

// ─── TEACHER PORTAL ───────────────────────────────────────────────────────────
function TeacherPortal({ lastUpdate }) {
  const [pw, setPw]           = useState("");
  const [auth, setAuth]       = useState(false);
  const [err, setErr]         = useState(false);
  const [fg, setFg]           = useState("Todos");
  const [exp, setExp]         = useState(null);
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(false);

  async function loadEquipos() {
    setLoading(true);
    const { data } = await supabase.from("equipos").select("*").order("grupo").order("nombre");
    setEquipos(data || []);
    setLoading(false);
  }

  function login() {
    if (pw === TEACHER_PASSWORD) { setAuth(true); setErr(false); loadEquipos(); }
    else { setErr(true); setPw(""); }
  }

  useEffect(() => {
    if (!auth) return;
    const t = setInterval(loadEquipos, FETCH_INTERVAL);
    return () => clearInterval(t);
  }, [auth]);

  const T = { color: CC.papel };
  const S = { color: "rgba(244,239,230,0.50)" };
  const M = { color: "rgba(244,239,230,0.25)" };

  if (!auth) return (
    <div style={{ maxWidth:320, margin:"90px auto", padding:32, background:CC.tintaSuave, border:`1px solid ${CC.tintaBorde}`, borderRadius:14, textAlign:"center", boxShadow:CC.shadowLg }}>
      <div style={{ fontFamily:F.display, fontSize:24, fontWeight:700, ...T, marginBottom:5 }}>Portal docente</div>
      <div style={{ fontFamily:F.mono, fontSize:8, ...M, letterSpacing:"0.07em", textTransform:"uppercase", marginBottom:24 }}>Acceso restringido</div>
      <input type="password" placeholder="Contrasena" value={pw}
        onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === "Enter" && login()}
        style={{ width:"100%", padding:"9px 11px", borderRadius:4, background:"#1E1E1E", border:`1px solid ${err ? CC.terracota : "#444"}`, color:CC.papel, fontFamily:F.body, fontSize:12, outline:"none", boxSizing:"border-box", marginBottom:8 }} />
      {err && <div style={{ fontFamily:F.mono, fontSize:9, color:CC.terracota, marginBottom:8 }}>Contrasena incorrecta</div>}
      <button onClick={login} className="btn-p btn-t" style={{ width:"100%" }}>Entrar</button>
    </div>
  );

  const grupos = ["Todos","2A","2B","2C","2D"];
  const eqs    = fg === "Todos" ? equipos : equipos.filter(e => e.grupo === fg);
  const st = {
    total: equipos.length,
    f1: equipos.filter(e => e.fase === 1).length,
    f2: equipos.filter(e => e.fase === 2).length,
    f3: equipos.filter(e => e.fase === 3).length,
    f4: equipos.filter(e => e.fase === 4).length,
    f5: equipos.filter(e => e.fase === 5).length,
    ra: equipos.reduce((a, e) => {
      const s = Array.isArray(e.subtemas) ? e.subtemas : [];
      return a + s.filter(x => x.riesgo === "alto").length;
    }, 0),
  };

  return (
    <div style={{ maxWidth:1060, margin:"0 auto", padding:"28px 20px" }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(95px,1fr))", gap:10, marginBottom:26 }}>
        {[
          { l:"Equipos",    v:st.total, c:CC.papel },
          { l:"Hipatia",    v:st.f1,    c:"rgba(244,239,230,0.55)" },
          { l:"Prompt",     v:st.f2,    c:CC.amarillo },
          { l:"Sor Juana",  v:st.f3,    c:"#5B8FC0" },
          { l:"Fichas",     v:st.f4,    c:"#B080D0" },
          { l:"Completo",   v:st.f5,    c:CC.verdeCuidado },
          { l:"Riesgo alto",v:st.ra,    c:CC.terracota },
        ].map(s => (
          <div key={s.l} style={{ padding:"12px 10px", borderRadius:6, background:CC.tintaSuave, border:`1px solid ${CC.tintaBorde}`, textAlign:"center", borderLeft:`2px solid ${s.c}` }}>
            <div style={{ fontFamily:F.mono, fontSize:24, fontWeight:700, color:s.c, lineHeight:1 }}>{loading ? "…" : s.v}</div>
            <div style={{ fontFamily:F.mono, fontSize:7, ...M, marginTop:4, letterSpacing:"0.08em", textTransform:"uppercase" }}>{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"flex", gap:6, marginBottom:16, alignItems:"center" }}>
        {grupos.map(g => (
          <button key={g} onClick={() => setFg(g)} style={{
            padding:"4px 11px", borderRadius:3, cursor:"pointer", fontFamily:F.body, fontSize:12, fontWeight:500,
            background: fg === g ? CC.terracota : "transparent",
            border:     `1px solid ${fg === g ? CC.terracota : "#444"}`,
            color:      fg === g ? CC.papel : "rgba(244,239,230,0.55)",
          }}>{g}</button>
        ))}
        {lastUpdate && (
          <div style={{ marginLeft:"auto", fontFamily:F.mono, fontSize:8, ...M }}>
            Actualizado: {lastUpdate.toLocaleTimeString("es-MX",{hour:"2-digit",minute:"2-digit"})}
          </div>
        )}
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {eqs.length === 0 && !loading && (
          <div style={{ fontFamily:F.mono, fontSize:10, ...M, padding:20, textAlign:"center" }}>
            No hay equipos en {fg === "Todos" ? "ningun grupo" : fg}
          </div>
        )}
        {eqs.map(eq => {
          const subs   = Array.isArray(eq.subtemas) ? eq.subtemas : [];
          const listas = subs.reduce((a,s) => a + (s.fichasListas || 0), 0);
          const total  = subs.reduce((a,s) => a + (s.fichasTotal  || 3), 0) || 21;
          const ra     = subs.filter(s => s.riesgo === "alto").length;
          const pct    = Math.round(listas / total * 100);
          const isExp  = exp === eq.id;
          const pc     = pct === 100 ? CC.verdeCuidado : pct > 50 ? CC.amarillo : CC.terracota;
          return (
            <div key={eq.id} style={{ border:`1.5px solid ${isExp ? CC.terracota : CC.tintaBorde}`, borderRadius:8, background:"#0E0C08", overflow:"hidden" }}>
              <div onClick={() => setExp(isExp ? null : eq.id)}
                style={{ display:"grid", gridTemplateColumns:"130px 1fr 200px 56px 70px", gap:12, alignItems:"center", padding:"13px 16px", cursor:"pointer" }}>
                <div>
                  <div style={{ fontFamily:F.mono, fontSize:8, color:CC.terracota, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:2 }}>{eq.grupo}</div>
                  <div style={{ fontFamily:F.display, fontSize:17, fontWeight:600, ...T }}>{eq.nombre}</div>
                  <div style={{ fontFamily:F.mono, fontSize:7, ...M, marginTop:1 }}>{(eq.integrantes||[]).length} integrantes</div>
                </div>
                <div>
                  <div style={{ fontFamily:F.body, fontSize:11, ...S, lineHeight:1.4, marginBottom:2 }}>{eq.fenomeno || "Sin fenomeno"}</div>
                  <div style={{ fontFamily:F.mono, fontSize:8, ...M }}>{(eq.tema||"Sin tema").substring(0,55)}{(eq.tema||"").length>55?"…":""}</div>
                </div>
                <PhaseBar fase={eq.fase||1} dark />
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontFamily:F.mono, fontSize:16, fontWeight:700, color:pc, lineHeight:1 }}>{pct}%</div>
                  <div style={{ fontFamily:F.mono, fontSize:6, ...M, marginTop:1 }}>{listas}/{total}</div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:3, alignItems:"flex-end" }}>
                  {ra > 0 && (
                    <div style={{ display:"flex", alignItems:"center", gap:3 }}>
                      <RiskDot r="alto" s={6} />
                      <span style={{ fontFamily:F.mono, fontSize:7, color:CC.terracota }}>{ra} alto{ra>1?"s":""}</span>
                    </div>
                  )}
                  <div style={{ fontFamily:F.mono, fontSize:7, ...M }}>{isExp?"▲":"▼"}</div>
                </div>
              </div>
              {isExp && (
                <div style={{ borderTop:`1px solid ${CC.tintaBorde}`, padding:"12px 16px" }}>
                  <div style={{ fontFamily:F.mono, fontSize:8, ...M, marginBottom:8 }}>Integrantes: {(eq.integrantes||[]).join(" · ")}</div>
                  {subs.length > 0 && (
                    <>
                      <div style={{ display:"grid", gridTemplateColumns:"20px 1fr 80px 80px 80px 1fr", gap:7, fontFamily:F.mono, fontSize:7, ...M, letterSpacing:"0.06em", textTransform:"uppercase", paddingBottom:5, borderBottom:"1px solid #1E1E1E", marginBottom:4 }}>
                        <span>#</span><span>Subtema</span><span>Tipo</span><span>Alumno</span><span>Fichas</span><span>Nota</span>
                      </div>
                      {subs.map(s => (
                        <div key={s.n} style={{ display:"grid", gridTemplateColumns:"20px 1fr 80px 80px 80px 1fr", gap:7, alignItems:"center", padding:"5px 0", borderBottom:"1px solid #161412" }}>
                          <span style={{ fontFamily:F.mono, fontSize:7, ...M }}>{s.n}</span>
                          <span style={{ fontFamily:F.body, fontSize:10, ...S, lineHeight:1.3 }}>{s.titulo}</span>
                          <span style={{ fontFamily:F.mono, fontSize:7, padding:"1px 5px", borderRadius:2, color:s.tipo==="exp"?"#5B8FC0":"#B080D0", background:s.tipo==="exp"?"rgba(91,143,192,0.10)":"rgba(176,128,208,0.10)" }}>
                            {s.tipo==="exp"?"Expositivo":"Argument."}
                          </span>
                          <span style={{ fontFamily:F.mono, fontSize:8, color:"rgba(244,239,230,0.45)" }}>{(s.alumno||"").split(" ")[0]}</span>
                          <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                            <div style={{ flex:1, height:3, borderRadius:9999, background:"#1E1E1E", overflow:"hidden" }}>
                              <div style={{ height:"100%", width:`${s.fichasTotal>0?(s.fichasListas||0)/s.fichasTotal*100:0}%`, background:s.fichasListas===s.fichasTotal?CC.verdeCuidado:CC.terracota }} />
                            </div>
                            <span style={{ fontFamily:F.mono, fontSize:7, ...M }}>{s.fichasListas||0}/{s.fichasTotal||3}</span>
                          </div>
                          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                            <RiskDot r={s.riesgo||"bajo"} s={6} />
                            <span style={{ fontFamily:F.mono, fontSize:7, color:"rgba(244,239,230,0.38)", lineHeight:1.4 }}>{s.nota||""}</span>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                  {eq.prompt_hijo && (
                    <div style={{ marginTop:9, paddingTop:9, borderTop:`1px solid ${CC.tintaBorde}` }}>
                      <CopyBtn text={eq.prompt_hijo} label="Prompt Hijo" ghost />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser]               = useState(null);
  const [view, setView]               = useState("student");
  const [sesionActiva, setSesionActiva] = useState("ambas");
  const [lastUpdate, setLastUpdate]   = useState(null);
  const [showIdle, setShowIdle]       = useState(false);
  const idleRef = useRef(null);

  const resetIdle = useCallback(() => {
    clearTimeout(idleRef.current);
    idleRef.current = setTimeout(() => setShowIdle(true), IDLE_MS);
  }, []);

  useEffect(() => {
    if (!user) { clearTimeout(idleRef.current); setShowIdle(false); return; }
    const evts = ["mousemove","keydown","click","scroll","touchstart"];
    evts.forEach(e => window.addEventListener(e, resetIdle, { passive:true }));
    resetIdle();
    return () => { evts.forEach(e => window.removeEventListener(e, resetIdle)); clearTimeout(idleRef.current); };
  }, [user, resetIdle]);

  useEffect(() => {
    supabase.from("config").select("valor").eq("clave","sesion_activa").single()
      .then(({ data }) => { if (data?.valor) setSesionActiva(data.valor); });
    const t = setInterval(async () => {
      const { data } = await supabase.from("config").select("valor").eq("clave","sesion_activa").single();
      if (data?.valor) setSesionActiva(data.valor);
      setLastUpdate(new Date());
    }, FETCH_INTERVAL);
    return () => clearInterval(t);
  }, []);

  const handleLogout = () => { setUser(null); setView("student"); setShowIdle(false); clearTimeout(idleRef.current); };
  const handleStay   = () => { setShowIdle(false); resetIdle(); };

  if (!user) return (
    <>
      <style>{CSS}</style>
      <LoginScreen onLogin={d => setUser(d)} />
    </>
  );

  const isDark = view === "teacher";
  return (
    <div style={{ minHeight:"100vh", background: isDark ? CC.tinta : CC.papel, transition:"background 300ms" }}>
      <style>{CSS}</style>

      <header style={{ position:"sticky", top:0, zIndex:100, background:CC.tinta, borderBottom:`1px solid ${CC.tintaBorde}`, display:"flex", alignItems:"center", padding:"0 16px", gap:12, minHeight:60 }}>
        <div style={{ display:"flex", alignItems:"center", gap:6, paddingRight:12, borderRight:"1px solid rgba(244,239,230,0.08)" }}>
          <div style={{ background:"rgba(255,255,255,0.07)", borderRadius:5, padding:"3px 5px", display:"flex", alignItems:"center" }}>
            <img src={LOGOS.lasalle} alt="La Salle" style={{ height:32, objectFit:"contain" }} />
          </div>
          <div style={{ background:"rgba(255,255,255,0.07)", borderRadius:5, padding:"3px 5px", display:"flex", alignItems:"center" }}>
            <img src={LOGOS.unesco} alt="UNESCO" style={{ height:28, objectFit:"contain" }} />
          </div>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:7 }}>
            <img src={LOGOS.cc_iso} alt="cc" style={{ height:20 }} />
            <img src={LOGOS.cc_word} alt="Casa Colectiva" style={{ height:14, filter:"brightness(0) invert(1)", opacity:0.85 }} />
            <span style={{ fontFamily:F.mono, fontSize:7, color:"rgba(244,239,230,0.28)", letterSpacing:"0.10em", textTransform:"uppercase" }}>· Ficha II · Marco Teorico</span>
          </div>
          <div style={{ fontFamily:F.mono, fontSize:7, marginTop:1, marginLeft:27, color:"rgba(244,239,230,0.22)", letterSpacing:"0.07em", textTransform:"uppercase" }}>
            Colegio Regiomontano Contry La Salle · 2 Secundaria
          </div>
        </div>
        <nav style={{ display:"flex", gap:4 }}>
          {[{k:"student",l:"Alumnos"},{k:"teacher",l:"Docente"}].map(v => (
            <button key={v.k} onClick={() => setView(v.k)} style={{
              padding:"5px 12px", borderRadius:4, cursor:"pointer", fontFamily:F.body, fontSize:11, fontWeight:500,
              background: view===v.k ? CC.terracota : "transparent",
              border:     `1px solid ${view===v.k ? CC.terracota : "rgba(244,239,230,0.15)"}`,
              color:      view===v.k ? CC.papel : "rgba(244,239,230,0.50)",
            }}>{v.l}</button>
          ))}
        </nav>
      </header>

      {view === "student" && <StudentPortal user={user} sesionActiva={sesionActiva} onLogout={handleLogout} />}
      {view === "teacher" && <TeacherPortal lastUpdate={lastUpdate} />}

      <footer style={{ borderTop:`1px solid ${isDark ? CC.tintaBorde : CC.grisPapel}`, marginTop:44 }}>
        <div style={{ background:CC.papelBlanco, padding:"14px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <img src={LOGOS.lasalle} alt="Colegio Regiomontano Contry La Salle" style={{ height:42, objectFit:"contain" }} />
          <img src={LOGOS.unesco}  alt="UNESCO Escuelas Asociadas"            style={{ height:38, objectFit:"contain", opacity:0.80, filter:"grayscale(20%)" }} />
        </div>
        <div style={{ background: isDark ? CC.tinta : "#EDE8DF", padding:"14px 24px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10, marginBottom:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <img src={LOGOS.cc_iso} alt="cc" style={{ height:24, opacity:0.65 }} />
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <img src={LOGOS.cc_word} alt="Casa Colectiva" style={{ height:13, opacity:0.55, filter: isDark ? "brightness(0) invert(1)" : "none" }} />
                  <span style={{ fontFamily:F.mono, fontSize:7, letterSpacing:"0.07em", textTransform:"uppercase", color: isDark ? "rgba(244,239,230,0.22)" : "#9A9590" }}>
                    2026 · Todos los derechos reservados
                  </span>
                </div>
                <div style={{ fontFamily:F.mono, fontSize:7, marginTop:2, letterSpacing:"0.07em", textTransform:"uppercase", color: isDark ? "rgba(244,239,230,0.18)" : "#B8B3AA" }}>
                  Diseno pedagogico · Jesus Angel Alvarez Gonzalez
                </div>
              </div>
            </div>
            <div style={{ fontFamily:F.mono, fontSize:7, textAlign:"right", letterSpacing:"0.06em", textTransform:"uppercase", color: isDark ? "rgba(244,239,230,0.15)" : "#C0BAB0" }}>
              Ficha II · Marco Teorico · Fisica STEAM
            </div>
          </div>
          <div style={{ borderTop:`1px solid ${isDark ? "rgba(244,239,230,0.05)" : "rgba(109,106,101,0.10)"}`, paddingTop:9 }}>
            <div style={{ fontFamily:F.mono, fontSize:7.5, fontStyle:"italic", textAlign:"center", lineHeight:1.75, color: isDark ? "rgba(244,239,230,0.16)" : "#C5BFB6" }}>
              Esta herramienta tiene fines exclusivamente pedagogicos y no comerciales.
              Ningun alumno fue reprobado durante su desarrollo — aunque varios prompts si necesitaron correcciones.
              El uso de los logotipos institucionales corresponde al Colegio Regiomontano Contry La Salle y a la Red de Escuelas Asociadas a la UNESCO.
            </div>
          </div>
        </div>
      </footer>

      {showIdle && user && <IdleModal user={user} onStay={handleStay} onLeave={handleLogout} />}
    </div>
  );
}
