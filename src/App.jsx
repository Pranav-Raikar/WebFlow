import { useState, useRef, useEffect } from "react";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// THEME & CONSTANTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const C = {
  bg:'#0a0a13', s1:'#111120', s2:'#191929', s3:'#21213a',
  border:'#2c2c4a', p:'#7c6ef5', g:'#3de59a', amber:'#f59e0b',
  rose:'#f472b6', text:'#e0ddf8', mid:'#8880c0', muted:'#4e4e78',
};
const GRID = 8;
const CW = 760, CH = 900;

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  ::-webkit-scrollbar{width:4px;height:4px}
  ::-webkit-scrollbar-track{background:${C.s1}}
  ::-webkit-scrollbar-thumb{background:${C.border};border-radius:2px}
  ::placeholder{color:${C.muted}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
  @keyframes blink{0%,100%{opacity:.3}50%{opacity:1}}
  @keyframes pulse{0%,100%{opacity:.5}50%{opacity:1}}
  .bf-btn{transition:all .15s!important}
  .bf-btn:hover{filter:brightness(1.1)!important;transform:translateY(-1px)!important}
  .bf-btn:active{transform:translateY(0)!important}
  .pal-row:hover{background:${C.s3}!important;border-color:${C.p}!important;color:${C.text}!important}
  .layer-row:hover{background:${C.s3}!important;border-color:${C.border}!important}
  .ex-chip:hover{background:${C.s3}!important;border-color:${C.p}!important;color:${C.text}!important}
  .sc-tab:hover{background:${C.s2}!important}
  .qa-btn:hover{background:${C.s3}!important}
`;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CATALOG
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const CATALOG = [
  { cat:'Layout', accent:C.p, items:[
    {type:'navbar',   icon:'≡',  label:'Navbar'  },
    {type:'hero',     icon:'⊡',  label:'Hero'    },
    {type:'section',  icon:'▤',  label:'Section' },
    {type:'divider',  icon:'─',  label:'Divider' },
    {type:'footer',   icon:'⊞',  label:'Footer'  },
  ]},
  { cat:'Content', accent:C.g, items:[
    {type:'heading',    icon:'H1', label:'Heading'    },
    {type:'subheading', icon:'H2', label:'Subheading' },
    {type:'para',       icon:'¶',  label:'Paragraph'  },
    {type:'badge',      icon:'◉',  label:'Badge'      },
    {type:'stat',       icon:'#',  label:'Stat'       },
  ]},
  { cat:'Blocks', accent:C.amber, items:[
    {type:'image',       icon:'⬜', label:'Image'      },
    {type:'card',        icon:'▭', label:'Card'       },
    {type:'feature',     icon:'✦', label:'Feature'    },
    {type:'testimonial', icon:'"', label:'Testimonial'},
  ]},
  { cat:'Forms', accent:C.rose, items:[
    {type:'button',  icon:'⬡', label:'Button'     },
    {type:'btn-out', icon:'⬡', label:'Outline Btn'},
    {type:'input',   icon:'⊟', label:'Input Field'},
  ]},
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ELEMENT DEFAULTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const DEFS = {
  navbar:      {w:760,h:60, x:0,  y:0,  content:'Brand',bg:'#fff',fg:'#111122'},
  hero:        {w:760,h:400,x:0,  y:0,  title:'Build Something Amazing',sub:'The hook that makes visitors want to know more about what you do.',cta:'Get Started →',bg:'#f5f4ff',fg:'#0d0d1a',accent:'#7c6ef5'},
  section:     {w:760,h:100,x:0,  y:0,  title:'Section Title',sub:'Supporting description text',bg:'#f9f9ff',fg:'#222244'},
  divider:     {w:680,h:2,  x:40, y:400,bg:'#e4e4f0'},
  footer:      {w:760,h:80, x:0,  y:820,content:'© 2026 YourBrand. All rights reserved.',bg:'#f4f4fc',fg:'#9999bb',fs:13},
  heading:     {w:500,h:64, x:130,y:100,content:'Your Heading Here',bg:'transparent',fg:'#0d0d1a',fs:38,fw:'800'},
  subheading:  {w:400,h:48, x:180,y:160,content:'Section Subheading',bg:'transparent',fg:'#333366',fs:22,fw:'700'},
  para:        {w:460,h:88, x:150,y:200,content:'Write your supporting description here. Keep it concise and compelling.',bg:'transparent',fg:'#555588',fs:15},
  badge:       {w:120,h:32, x:320,y:100,content:'✦ New Feature',bg:'#ede9fe',fg:'#5b21b6',radius:20,fs:12},
  stat:        {w:160,h:110,x:300,y:200,value:'10K+',label:'Happy Users',fg:'#0d0d1a',accent:'#7c6ef5'},
  image:       {w:360,h:240,x:200,y:120,bg:'#dde0f8',radius:12,label:'Image Placeholder'},
  card:        {w:240,h:190,x:130,y:260,content:'Card Title\nShort description of this card item.',bg:'#ffffff',fg:'#111122',radius:16},
  feature:     {w:200,h:180,x:80, y:200,icon:'⚡',title:'Feature Name',desc:'A short description of this feature and why it matters.',bg:'#f8f8ff',fg:'#111',radius:14},
  testimonial: {w:300,h:160,x:230,y:200,quote:'This product completely changed how our team works.',author:'Jane Doe · CEO',bg:'#ffffff',fg:'#111',radius:14},
  button:      {w:168,h:48, x:296,y:290,content:'Get Started →',bg:'#7c6ef5',fg:'#ffffff',radius:10,fs:15},
  'btn-out':   {w:168,h:48, x:296,y:350,content:'Learn More',bg:'transparent',fg:'#7c6ef5',radius:10,fs:15,borderCol:'#7c6ef5'},
  input:       {w:300,h:48, x:230,y:360,placeholder:'Enter your email...',bg:'#f8f8fe',borderCol:'#d0cfff',radius:8},
};

let _uid = 3000;
const nid = () => `el-${++_uid}`;
const mkEl = type => ({ id:nid(), type, ...JSON.parse(JSON.stringify(DEFS[type] || DEFS.heading)) });
const snapV = v => Math.round(v / GRID) * GRID;
const STACK_GAP = 16;
const ROW_GAP = 16;
// Consecutive elements of the SAME type (e.g. 3x 'feature' suggested for a
// features section) are laid out as a centered row instead of overlapping
// or stacking one under another; distinct sections stack vertically.
const initEls = types => {
  const list = types && types.length ? types : ['navbar','heading','para','button'];
  const out = [];
  let cursorY = 0, i = 0;
  while (i < list.length) {
    let j = i;
    while (j < list.length && list[j] === list[i]) j++;
    const group = list.slice(i, j);
    const def = DEFS[group[0]] || DEFS.heading;
    const n = group.length;
    const totalW = n * def.w + (n - 1) * ROW_GAP;
    const startX = Math.max(0, (CW - totalW) / 2);
    group.forEach((t, k) => {
      const el = mkEl(t);
      el.x = startX + k * (def.w + ROW_GAP);
      el.y = cursorY;
      out.push(el);
    });
    cursorY += def.h + STACK_GAP;
    i = j;
  }
  return out;
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CANVAS ELEMENT RENDERER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function CanvasEl({ el, selected, sc, onDown }) {
  const s = {
    position:'absolute', left:el.x*sc, top:el.y*sc,
    width:el.w*sc, height:el.h*sc, cursor:'move',
    userSelect:'none', boxSizing:'border-box',
    outline: selected ? '2px solid #7c6ef5' : 'none',
    outlineOffset:2, zIndex: selected ? 20 : 1,
  };
  const f = sc;
  switch(el.type) {
    case 'navbar': return (
      <div style={{...s,background:el.bg,display:'flex',alignItems:'center',padding:`0 ${24*f}px`,borderBottom:`${f}px solid #eeeef8`,boxShadow:`0 ${f}px ${4*f}px #0001`}} onMouseDown={onDown}>
        <span style={{color:el.fg,fontWeight:800,fontSize:15*f,fontFamily:"'Syne',sans-serif"}}>{el.content}</span>
        <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:20*f}}>
          {['Home','Features','Pricing'].map(l=><span key={l} style={{color:el.fg,fontSize:12*f,opacity:.6}}>{l}</span>)}
          <span style={{background:'#7c6ef5',color:'#fff',padding:`${4*f}px ${12*f}px`,borderRadius:6*f,fontSize:11*f,fontWeight:600}}>Sign Up</span>
        </div>
      </div>
    );
    case 'hero': return (
      <div style={{...s,background:el.bg,display:'flex',alignItems:'center',padding:`0 ${52*f}px`,position:'relative',overflow:'hidden'}} onMouseDown={onDown}>
        <div style={{position:'absolute',right:30*f,top:'50%',transform:'translateY(-50%)',width:240*f,height:240*f,background:`${el.accent}10`,borderRadius:'50%',border:`${2*f}px solid ${el.accent}20`}}/>
        <div style={{position:'absolute',right:100*f,bottom:20*f,width:110*f,height:110*f,background:`${el.accent}07`,borderRadius:'50%'}}/>
        <div style={{position:'relative',maxWidth:'60%'}}>
          <span style={{background:`${el.accent}18`,color:el.accent,borderRadius:20*f,padding:`${3*f}px ${12*f}px`,fontSize:10*f,fontWeight:600,display:'inline-block',marginBottom:12*f,letterSpacing:'.3px'}}>✦ Welcome</span>
          <div style={{color:el.fg,fontSize:30*f,fontWeight:800,lineHeight:1.18,fontFamily:"'Syne',sans-serif",marginBottom:10*f,letterSpacing:'-1px'}}>{el.title}</div>
          <div style={{color:el.fg,fontSize:13*f,opacity:.6,lineHeight:1.75,marginBottom:20*f,maxWidth:'90%'}}>{el.sub}</div>
          <div style={{display:'flex',gap:10*f,alignItems:'center'}}>
            <span style={{background:el.accent,color:'#fff',borderRadius:8*f,padding:`${9*f}px ${20*f}px`,fontSize:12*f,fontWeight:600,boxShadow:`0 ${4*f}px ${18*f}px ${el.accent}50`}}>{el.cta}</span>
            <span style={{color:el.accent,fontSize:12*f,opacity:.75}}>Watch Demo →</span>
          </div>
        </div>
      </div>
    );
    case 'section': return (
      <div style={{...s,background:el.bg,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:5*f,borderBottom:`${f}px solid #ebebfa`}} onMouseDown={onDown}>
        <div style={{color:el.fg,fontSize:20*f,fontWeight:700,fontFamily:"'Syne',sans-serif",textAlign:'center'}}>{el.title}</div>
        <div style={{color:el.fg,fontSize:13*f,opacity:.5,textAlign:'center'}}>{el.sub}</div>
        <div style={{width:36*f,height:3*f,background:'#7c6ef5',borderRadius:2*f,marginTop:3*f}}/>
      </div>
    );
    case 'divider': return <div style={{...s,background:el.bg}} onMouseDown={onDown}/>;
    case 'footer': return (
      <div style={{...s,background:el.bg,display:'flex',alignItems:'center',justifyContent:'space-between',padding:`0 ${28*f}px`,borderTop:`${f}px solid #e8e8f4`}} onMouseDown={onDown}>
        <span style={{color:el.fg,fontSize:(el.fs||13)*f}}>{el.content}</span>
        <div style={{display:'flex',gap:16*f}}>
          {['Privacy','Terms','Contact'].map(l=><span key={l} style={{color:el.fg,fontSize:12*f,opacity:.5}}>{l}</span>)}
        </div>
      </div>
    );
    case 'heading': return (
      <div style={{...s,display:'flex',alignItems:'center'}} onMouseDown={onDown}>
        <span style={{color:el.fg,fontSize:(el.fs||38)*f,fontWeight:el.fw||'800',lineHeight:1.15,fontFamily:"'Syne',sans-serif",letterSpacing:'-1.5px'}}>{el.content}</span>
      </div>
    );
    case 'subheading': return (
      <div style={{...s,display:'flex',alignItems:'center'}} onMouseDown={onDown}>
        <span style={{color:el.fg,fontSize:(el.fs||22)*f,fontWeight:el.fw||'700',lineHeight:1.25,fontFamily:"'Syne',sans-serif",letterSpacing:'-.5px'}}>{el.content}</span>
      </div>
    );
    case 'para': return (
      <div style={{...s,display:'flex',alignItems:'flex-start',paddingTop:2*f}} onMouseDown={onDown}>
        <span style={{color:el.fg,fontSize:(el.fs||15)*f,lineHeight:1.75,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{el.content}</span>
      </div>
    );
    case 'badge': return (
      <div style={{...s,background:el.bg,color:el.fg,borderRadius:(el.radius||20)*f,display:'flex',alignItems:'center',justifyContent:'center',fontSize:(el.fs||12)*f,fontWeight:600}} onMouseDown={onDown}>
        {el.content}
      </div>
    );
    case 'stat': return (
      <div style={{...s,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:4*f}} onMouseDown={onDown}>
        <div style={{color:el.accent||'#7c6ef5',fontSize:38*f,fontWeight:800,fontFamily:"'Syne',sans-serif",lineHeight:1}}>{el.value}</div>
        <div style={{color:el.fg,fontSize:11*f,opacity:.5,textTransform:'uppercase',letterSpacing:'1.5px'}}>{el.label}</div>
        <div style={{width:24*f,height:2*f,background:el.accent||'#7c6ef5',borderRadius:f,marginTop:2*f}}/>
      </div>
    );
    case 'image': return (
      <div style={{...s,background:el.bg,borderRadius:(el.radius||12)*f,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:8*f,border:`${f}px dashed #c0c0e0`}} onMouseDown={onDown}>
        <span style={{fontSize:28*f,opacity:.3}}>🖼</span>
        <span style={{color:'#8888aa',fontSize:11*f,fontFamily:"'DM Mono',monospace"}}>{el.label||'Image'}</span>
      </div>
    );
    case 'card': return (
      <div style={{...s,background:el.bg,borderRadius:(el.radius||16)*f,padding:18*f,boxShadow:`0 ${4*f}px ${24*f}px #0000000d`,border:`${f}px solid #eeeeff`,display:'flex',flexDirection:'column',gap:9*f}} onMouseDown={onDown}>
        <div style={{width:32*f,height:3*f,background:'#7c6ef5',borderRadius:2*f}}/>
        {el.content.split('\n').map((line,i)=><span key={i} style={{color:el.fg,fontSize:i===0?14*f:12*f,fontWeight:i===0?700:400,opacity:i===0?1:.6,lineHeight:1.5}}>{line}</span>)}
      </div>
    );
    case 'feature': return (
      <div style={{...s,background:el.bg,borderRadius:(el.radius||14)*f,padding:18*f,boxShadow:`0 ${2*f}px ${14*f}px #00000009`,border:`${f}px solid #eeeeff`,display:'flex',flexDirection:'column',gap:10*f}} onMouseDown={onDown}>
        <div style={{width:38*f,height:38*f,background:'#7c6ef514',borderRadius:10*f,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20*f}}>{el.icon}</div>
        <div style={{color:el.fg,fontSize:14*f,fontWeight:700,lineHeight:1.3,fontFamily:"'Syne',sans-serif"}}>{el.title}</div>
        <div style={{color:el.fg,fontSize:12*f,opacity:.6,lineHeight:1.6}}>{el.desc}</div>
      </div>
    );
    case 'testimonial': return (
      <div style={{...s,background:el.bg,borderRadius:(el.radius||14)*f,padding:20*f,boxShadow:`0 ${3*f}px ${18*f}px #0000000b`,border:`${f}px solid #eeeeff`,display:'flex',flexDirection:'column',gap:10*f}} onMouseDown={onDown}>
        <div style={{color:'#7c6ef5',fontSize:44*f,lineHeight:.8,fontFamily:'Georgia,serif',opacity:.25}}>"</div>
        <div style={{color:el.fg,fontSize:13*f,lineHeight:1.7,fontStyle:'italic',flex:1}}>{el.quote}</div>
        <div style={{display:'flex',alignItems:'center',gap:8*f,paddingTop:6*f,borderTop:`${f}px solid #f0f0f8`}}>
          <div style={{width:28*f,height:28*f,background:'linear-gradient(135deg,#c7d2fe,#ddd6fe)',borderRadius:'50%'}}/>
          <span style={{color:el.fg,fontSize:11*f,fontWeight:600,opacity:.65}}>{el.author}</span>
        </div>
      </div>
    );
    case 'button': return (
      <div style={{...s,background:el.bg,color:el.fg,borderRadius:(el.radius||10)*f,display:'flex',alignItems:'center',justifyContent:'center',fontSize:(el.fs||15)*f,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif",boxShadow:`0 ${6*f}px ${20*f}px ${el.bg}70`}} onMouseDown={onDown}>
        {el.content}
      </div>
    );
    case 'btn-out': return (
      <div style={{...s,background:'transparent',color:el.fg,borderRadius:(el.radius||10)*f,display:'flex',alignItems:'center',justifyContent:'center',fontSize:(el.fs||15)*f,fontWeight:600,border:`${1.5*f}px solid ${el.borderCol||el.fg}`}} onMouseDown={onDown}>
        {el.content}
      </div>
    );
    case 'input': return (
      <div style={{...s,background:el.bg,border:`${1.5*f}px solid ${el.borderCol||'#d0cfff'}`,borderRadius:(el.radius||8)*f,display:'flex',alignItems:'center',padding:`0 ${14*f}px`,gap:8*f}} onMouseDown={onDown}>
        <span style={{color:'#aaaacc',fontSize:14*f}}>✉</span>
        <span style={{color:'#aaaacc',fontSize:13*f,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{el.placeholder}</span>
      </div>
    );
    default: return <div style={{...s,background:'#eee',display:'flex',alignItems:'center',justifyContent:'center',color:'#999',fontSize:12*f}} onMouseDown={onDown}>{el.type}</div>;
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RESIZE HANDLES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const HANDLE_DEFS = [
  {id:'nw',lx:0,  ly:0,  cx:'nw-resize'},{id:'n', lx:.5,ly:0,  cx:'n-resize'},
  {id:'ne',lx:1,  ly:0,  cx:'ne-resize'},{id:'e', lx:1, ly:.5, cx:'e-resize'},
  {id:'se',lx:1,  ly:1,  cx:'se-resize'},{id:'s', lx:.5,ly:1,  cx:'s-resize'},
  {id:'sw',lx:0,  ly:1,  cx:'sw-resize'},{id:'w', lx:0, ly:.5, cx:'w-resize'},
];
function ResizeHandles({ el, sc, onStart }) {
  return HANDLE_DEFS.map(h => (
    <div key={h.id}
      onMouseDown={e=>{e.stopPropagation();e.preventDefault();onStart(e,h.id,el);}}
      style={{
        position:'absolute',zIndex:200,pointerEvents:'all',
        left:(el.x + h.lx*el.w)*sc - 5,
        top: (el.y + h.ly*el.h)*sc - 5,
        width:10,height:10,background:'#fff',
        border:'2px solid #7c6ef5',borderRadius:3,
        cursor:h.cx,boxShadow:'0 1px 6px #0005',
      }}
    />
  ));
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// QUICK ACTION BAR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function QuickBar({ el, sc, onDuplicate, onDelete, onForward, onBack }) {
  const barY = Math.max(0, el.y*sc - 38);
  return (
    <div style={{position:'absolute',left:el.x*sc,top:barY,zIndex:300,display:'flex',alignItems:'center',background:C.s1,border:`1px solid ${C.border}`,borderRadius:8,padding:'3px 5px',gap:1,boxShadow:'0 4px 20px #00000077',pointerEvents:'all'}}>
      {[
        {icon:'⎘', tip:'Duplicate (⌘D)', fn:onDuplicate, col:C.mid},
        {icon:'↑', tip:'Bring Forward',  fn:onForward,   col:C.g},
        {icon:'↓', tip:'Send Back',      fn:onBack,       col:C.g},
        {icon:'✕', tip:'Delete (Del)',   fn:onDelete,     col:'#f87171'},
      ].map(a=>(
        <button key={a.tip} className="qa-btn" title={a.tip} onClick={a.fn}
          style={{background:'none',border:'none',color:a.col,cursor:'pointer',padding:'3px 8px',borderRadius:5,fontSize:13,fontFamily:'monospace',transition:'background .1s'}}>
          {a.icon}
        </button>
      ))}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PROPERTIES PANEL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Lbl({t}) { return <div style={{color:C.muted,fontSize:10,marginBottom:3,textTransform:'uppercase',letterSpacing:'.8px',fontFamily:"'DM Mono',monospace"}}>{t}</div>; }
function TIn({value,onChange,type='text',ph}) {
  return <input type={type} value={value??''} placeholder={ph} onChange={e=>onChange(type==='number'?parseFloat(e.target.value)||0:e.target.value)}
    style={{width:'100%',background:C.s2,border:`1px solid ${C.border}`,borderRadius:6,padding:'5px 9px',color:C.text,fontSize:12,fontFamily:"'DM Mono',monospace",outline:'none',boxSizing:'border-box'}}/>;
}
function TAr({value,onChange}) {
  return <textarea value={value||''} onChange={e=>onChange(e.target.value)}
    style={{width:'100%',background:C.s2,border:`1px solid ${C.border}`,borderRadius:6,padding:'6px 9px',color:C.text,fontSize:12,fontFamily:"'Plus Jakarta Sans',sans-serif",outline:'none',boxSizing:'border-box',minHeight:64,resize:'vertical',lineHeight:1.6}}/>;
}
function Col2({a,b}) { return <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:7,marginBottom:11}}>{a}{b}</div>; }
function ColorPicker({label,value,onChange}) {
  return (
    <div style={{marginBottom:11}}>
      <Lbl t={label}/>
      <div style={{display:'flex',gap:7,alignItems:'center'}}>
        <input type="color" value={(value||'#ffffff').match(/^#[0-9a-f]{3,6}$/i)?value:'#ffffff'} onChange={e=>onChange(e.target.value)}
          style={{width:30,height:28,border:'none',borderRadius:5,cursor:'pointer',flexShrink:0,background:'none'}}/>
        <TIn value={value} onChange={onChange}/>
      </div>
    </div>
  );
}

function PropsPanel({ el, onUpdate, onDelete }) {
  if (!el) return (
    <div style={{padding:24,textAlign:'center',paddingTop:52}}>
      <div style={{fontSize:36,opacity:.15,marginBottom:12}}>☝</div>
      <div style={{color:C.muted,fontSize:12,fontFamily:"'Plus Jakarta Sans',sans-serif",lineHeight:2}}>
        Click any element<br/>on the canvas to<br/>edit its properties
      </div>
      <div style={{marginTop:20,padding:'10px 14px',background:C.s2,border:`1px solid ${C.border}`,borderRadius:10}}>
        <div style={{color:C.muted,fontSize:10,fontFamily:"'DM Mono',monospace",marginBottom:8,textAlign:'left',fontWeight:500,textTransform:'uppercase',letterSpacing:'.6px'}}>Shortcuts</div>
        {[['Del','Delete element'],['Esc','Deselect'],['⌘Z','Undo'],['⌘D','Duplicate'],['↑↓←→','Nudge 8px']].map(([k,v])=>(
          <div key={k} style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
            <span style={{background:C.s3,border:`1px solid ${C.border}`,color:C.mid,fontSize:10,padding:'1px 6px',borderRadius:4,fontFamily:"'DM Mono',monospace"}}>{k}</span>
            <span style={{color:C.muted,fontSize:10}}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const up = (k,v) => onUpdate({...el,[k]:v});

  const fields = () => {
    switch(el.type) {
      case 'navbar': return (<>
        <div style={{marginBottom:11}}><Lbl t="Brand Name"/><TIn value={el.content} onChange={v=>up('content',v)}/></div>
        <ColorPicker label="Background" value={el.bg} onChange={v=>up('bg',v)}/>
        <ColorPicker label="Text Color" value={el.fg} onChange={v=>up('fg',v)}/>
      </>);
      case 'hero': return (<>
        <div style={{marginBottom:11}}><Lbl t="Headline"/><TIn value={el.title} onChange={v=>up('title',v)}/></div>
        <div style={{marginBottom:11}}><Lbl t="Subtext"/><TAr value={el.sub} onChange={v=>up('sub',v)}/></div>
        <div style={{marginBottom:11}}><Lbl t="Button Label"/><TIn value={el.cta} onChange={v=>up('cta',v)}/></div>
        <ColorPicker label="Background" value={el.bg} onChange={v=>up('bg',v)}/>
        <ColorPicker label="Text Color" value={el.fg} onChange={v=>up('fg',v)}/>
        <ColorPicker label="Accent Color" value={el.accent} onChange={v=>up('accent',v)}/>
      </>);
      case 'section': return (<>
        <div style={{marginBottom:11}}><Lbl t="Title"/><TIn value={el.title} onChange={v=>up('title',v)}/></div>
        <div style={{marginBottom:11}}><Lbl t="Subtitle"/><TIn value={el.sub} onChange={v=>up('sub',v)}/></div>
        <ColorPicker label="Background" value={el.bg} onChange={v=>up('bg',v)}/>
        <ColorPicker label="Text Color" value={el.fg} onChange={v=>up('fg',v)}/>
      </>);
      case 'heading': case 'subheading': return (<>
        <div style={{marginBottom:11}}><Lbl t="Text"/><TIn value={el.content} onChange={v=>up('content',v)}/></div>
        <Col2
          a={<div><Lbl t="Size"/><TIn type="number" value={el.fs} onChange={v=>up('fs',v)}/></div>}
          b={<div><Lbl t="Weight"/><TIn value={el.fw} onChange={v=>up('fw',v)}/></div>}
        />
        <ColorPicker label="Color" value={el.fg} onChange={v=>up('fg',v)}/>
      </>);
      case 'para': return (<>
        <div style={{marginBottom:11}}><Lbl t="Text"/><TAr value={el.content} onChange={v=>up('content',v)}/></div>
        <div style={{marginBottom:11}}><Lbl t="Font Size"/><TIn type="number" value={el.fs} onChange={v=>up('fs',v)}/></div>
        <ColorPicker label="Color" value={el.fg} onChange={v=>up('fg',v)}/>
      </>);
      case 'badge': return (<>
        <div style={{marginBottom:11}}><Lbl t="Label"/><TIn value={el.content} onChange={v=>up('content',v)}/></div>
        <Col2
          a={<div><Lbl t="Font Size"/><TIn type="number" value={el.fs} onChange={v=>up('fs',v)}/></div>}
          b={<div><Lbl t="Radius"/><TIn type="number" value={el.radius} onChange={v=>up('radius',v)}/></div>}
        />
        <ColorPicker label="Background" value={el.bg} onChange={v=>up('bg',v)}/>
        <ColorPicker label="Text Color" value={el.fg} onChange={v=>up('fg',v)}/>
      </>);
      case 'stat': return (<>
        <div style={{marginBottom:11}}><Lbl t="Value"/><TIn value={el.value} onChange={v=>up('value',v)}/></div>
        <div style={{marginBottom:11}}><Lbl t="Label"/><TIn value={el.label} onChange={v=>up('label',v)}/></div>
        <ColorPicker label="Text Color" value={el.fg} onChange={v=>up('fg',v)}/>
        <ColorPicker label="Accent Color" value={el.accent} onChange={v=>up('accent',v)}/>
      </>);
      case 'image': return (<>
        <div style={{marginBottom:11}}><Lbl t="Caption"/><TIn value={el.label} onChange={v=>up('label',v)}/></div>
        <div style={{marginBottom:11}}><Lbl t="Border Radius"/><TIn type="number" value={el.radius} onChange={v=>up('radius',v)}/></div>
        <ColorPicker label="Fill Color" value={el.bg} onChange={v=>up('bg',v)}/>
      </>);
      case 'card': return (<>
        <div style={{marginBottom:11}}><Lbl t="Content (line 1 = title)"/><TAr value={el.content} onChange={v=>up('content',v)}/></div>
        <div style={{marginBottom:11}}><Lbl t="Radius"/><TIn type="number" value={el.radius} onChange={v=>up('radius',v)}/></div>
        <ColorPicker label="Background" value={el.bg} onChange={v=>up('bg',v)}/>
        <ColorPicker label="Text Color" value={el.fg} onChange={v=>up('fg',v)}/>
      </>);
      case 'feature': return (<>
        <div style={{marginBottom:11}}><Lbl t="Icon (emoji)"/><TIn value={el.icon} onChange={v=>up('icon',v)}/></div>
        <div style={{marginBottom:11}}><Lbl t="Title"/><TIn value={el.title} onChange={v=>up('title',v)}/></div>
        <div style={{marginBottom:11}}><Lbl t="Description"/><TAr value={el.desc} onChange={v=>up('desc',v)}/></div>
        <div style={{marginBottom:11}}><Lbl t="Radius"/><TIn type="number" value={el.radius} onChange={v=>up('radius',v)}/></div>
        <ColorPicker label="Background" value={el.bg} onChange={v=>up('bg',v)}/>
        <ColorPicker label="Text Color" value={el.fg} onChange={v=>up('fg',v)}/>
      </>);
      case 'testimonial': return (<>
        <div style={{marginBottom:11}}><Lbl t="Quote"/><TAr value={el.quote} onChange={v=>up('quote',v)}/></div>
        <div style={{marginBottom:11}}><Lbl t="Author"/><TIn value={el.author} onChange={v=>up('author',v)}/></div>
        <div style={{marginBottom:11}}><Lbl t="Radius"/><TIn type="number" value={el.radius} onChange={v=>up('radius',v)}/></div>
        <ColorPicker label="Background" value={el.bg} onChange={v=>up('bg',v)}/>
        <ColorPicker label="Text Color" value={el.fg} onChange={v=>up('fg',v)}/>
      </>);
      case 'button': return (<>
        <div style={{marginBottom:11}}><Lbl t="Label"/><TIn value={el.content} onChange={v=>up('content',v)}/></div>
        <Col2
          a={<div><Lbl t="Radius"/><TIn type="number" value={el.radius} onChange={v=>up('radius',v)}/></div>}
          b={<div><Lbl t="Font Size"/><TIn type="number" value={el.fs} onChange={v=>up('fs',v)}/></div>}
        />
        <ColorPicker label="Background" value={el.bg} onChange={v=>up('bg',v)}/>
        <ColorPicker label="Text Color" value={el.fg} onChange={v=>up('fg',v)}/>
      </>);
      case 'btn-out': return (<>
        <div style={{marginBottom:11}}><Lbl t="Label"/><TIn value={el.content} onChange={v=>up('content',v)}/></div>
        <Col2
          a={<div><Lbl t="Radius"/><TIn type="number" value={el.radius} onChange={v=>up('radius',v)}/></div>}
          b={<div><Lbl t="Font Size"/><TIn type="number" value={el.fs} onChange={v=>up('fs',v)}/></div>}
        />
        <ColorPicker label="Text / Border" value={el.fg} onChange={v=>up('fg',v)}/>
        <div style={{marginBottom:11}}><Lbl t="Border Color Hex"/><TIn value={el.borderCol} onChange={v=>up('borderCol',v)}/></div>
      </>);
      case 'input': return (<>
        <div style={{marginBottom:11}}><Lbl t="Placeholder"/><TIn value={el.placeholder} onChange={v=>up('placeholder',v)}/></div>
        <div style={{marginBottom:11}}><Lbl t="Radius"/><TIn type="number" value={el.radius} onChange={v=>up('radius',v)}/></div>
        <ColorPicker label="Background" value={el.bg} onChange={v=>up('bg',v)}/>
        <div style={{marginBottom:11}}><Lbl t="Border Color"/><TIn value={el.borderCol} onChange={v=>up('borderCol',v)}/></div>
      </>);
      case 'footer': return (<>
        <div style={{marginBottom:11}}><Lbl t="Text"/><TIn value={el.content} onChange={v=>up('content',v)}/></div>
        <div style={{marginBottom:11}}><Lbl t="Font Size"/><TIn type="number" value={el.fs} onChange={v=>up('fs',v)}/></div>
        <ColorPicker label="Background" value={el.bg} onChange={v=>up('bg',v)}/>
        <ColorPicker label="Text Color" value={el.fg} onChange={v=>up('fg',v)}/>
      </>);
      case 'divider': return <ColorPicker label="Color" value={el.bg} onChange={v=>up('bg',v)}/>;
      default: return null;
    }
  };

  return (
    <div style={{height:'100%',overflow:'auto',padding:14}}>
      {/* Header */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16,paddingBottom:12,borderBottom:`1px solid ${C.border}`}}>
        <div>
          <div style={{color:C.text,fontWeight:700,fontSize:13,fontFamily:"'Syne',sans-serif"}}>{el.type}</div>
          <div style={{color:C.muted,fontSize:10,fontFamily:"'DM Mono',monospace",marginTop:2}}>{Math.round(el.w)} × {Math.round(el.h)}px</div>
        </div>
        <button onClick={onDelete} style={{background:'#f8717118',border:'1px solid #f8717140',color:'#f87171',borderRadius:6,padding:'3px 10px',cursor:'pointer',fontSize:11}}>✕ Delete</button>
      </div>
      {fields()}
      {/* Position & Size */}
      <div style={{borderTop:`1px solid ${C.border}`,paddingTop:12,marginTop:4}}>
        <Lbl t="Position & Size"/>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
          {[['X','x'],['Y','y'],['W','w'],['H','h']].map(([l,k])=>(
            <div key={k}>
              <div style={{color:C.muted,fontSize:10,marginBottom:2,fontFamily:"'DM Mono',monospace"}}>{l}</div>
              <input type="number" value={Math.round(el[k])} onChange={e=>up(k,parseFloat(e.target.value)||0)}
                style={{width:'100%',background:C.s2,border:`1px solid ${C.border}`,borderRadius:5,padding:'4px 7px',color:C.text,fontSize:11,fontFamily:"'DM Mono',monospace",outline:'none',boxSizing:'border-box'}}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FLOW DIAGRAM
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function FlowDiag({ screens }) {
  const cols = Math.min(3, screens.length);
  const BW=190, BH=100, GX=50, GY=50;
  const W = cols*BW+(cols-1)*GX+40;
  const ROWS = Math.ceil(screens.length/cols);
  const H = ROWS*BH+(ROWS-1)*GY+40;
  const pos = screens.map((_,i)=>({x:20+(i%cols)*(BW+GX),y:20+Math.floor(i/cols)*(BH+GY)}));
  const conns = [];
  screens.forEach((sc,i)=>(sc.connectedTo||[]).forEach(tid=>{
    const j=screens.findIndex(s=>s.id===tid);
    if(j>=0) conns.push([i,j]);
  }));
  return (
    <div style={{overflowX:'auto'}}>
      <svg width={W} height={H}>
        {conns.map(([f,t],k)=>{
          const fx=pos[f].x+BW/2,fy=pos[f].y+BH/2,tx=pos[t].x+BW/2,ty=pos[t].y+BH/2,mx=(fx+tx)/2;
          return <path key={k} d={`M${fx},${fy} C${mx},${fy} ${mx},${ty} ${tx},${ty}`} stroke={C.p} strokeWidth="1.5" fill="none" opacity=".45" strokeDasharray="5 4"/>;
        })}
        {screens.map((sc,i)=>{
          const {x,y}=pos[i];
          return (
            <g key={sc.id}>
              <rect x={x} y={y} width={BW} height={BH} rx={12} fill={C.s2} stroke={C.border}/>
              <rect x={x} y={y} width={BW} height={3} rx={2} fill={C.p} opacity=".9"/>
              <text x={x+14} y={y+26} fill={C.text} fontSize="13" fontWeight="700" fontFamily="Syne,sans-serif">{sc.icon} {sc.name}</text>
              <text x={x+14} y={y+42} fill={C.muted} fontSize="10" fontFamily="DM Mono,monospace">{sc.route}</text>
              <foreignObject x={x+8} y={y+49} width={BW-16} height={42}>
                <div style={{color:C.muted,fontSize:9.5,lineHeight:1.45,overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical'}}>{sc.description}</div>
              </foreignObject>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STAGE BREADCRUMB
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Stepper({ stage }) {
  const steps = [{id:'prompt',label:'Describe'},{id:'flow',label:'Flow'},{id:'editor',label:'Design'},{id:'code',label:'Code'}];
  const cur = {prompt:0,flow:1,editor:2,code:3}[stage]??0;
  return (
    <div style={{display:'flex',alignItems:'center',gap:4}}>
      {steps.map((st,i)=>(
        <div key={st.id} style={{display:'flex',alignItems:'center',gap:4}}>
          <div style={{display:'flex',alignItems:'center',gap:5,padding:'3px 10px',borderRadius:20,background:i===cur?`${C.p}22`:'transparent',border:i===cur?`1px solid ${C.p}44`:'1px solid transparent'}}>
            <div style={{width:17,height:17,borderRadius:'50%',background:i<cur?C.g:i===cur?C.p:C.s3,border:i>cur?`1px solid ${C.border}`:'none',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,color:i<cur?'#0a1a0e':'#fff',fontWeight:700,fontFamily:"'DM Mono',monospace"}}>
              {i<cur?'✓':i+1}
            </div>
            <span style={{color:i===cur?C.text:C.muted,fontSize:11,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:i===cur?600:400}}>{st.label}</span>
          </div>
          {i<steps.length-1&&<div style={{width:16,height:1,background:i<cur?`${C.g}50`:C.border}}/>}
        </div>
      ))}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const EXAMPLES = [
  {e:'📋',t:'Task manager with kanban boards and team collaboration'},
  {e:'🛍',t:'E-commerce store for handmade jewelry with cart and checkout'},
  {e:'💪',t:'Fitness tracker with workout plans and progress charts'},
  {e:'📊',t:'SaaS dashboard for API monitoring and billing'},
  {e:'🍔',t:'Food delivery app with restaurants and live order tracking'},
  {e:'💼',t:'Job board with applicant tracking and company profiles'},
];
const LOAD_FLOW = ['Analyzing your idea…','Mapping screen architecture…','Planning component layouts…','Finalizing your flow…'];
const LOAD_CODE = ['Reading your design…','Writing component HTML…','Building styles and scripts…','Assembling the project…'];

export default function BuildFlow() {
  const [stage,    setStage]    = useState('prompt');
  const [prompt,   setPrompt]   = useState('');
  const [flowData, setFlowData] = useState(null);
  const [screens,  setScreens]  = useState([]);
  const [activeIdx,setActiveIdx]= useState(0);
  const [selId,    setSelId]    = useState(null);
  const [code,     setCode]     = useState('');
  const [error,    setError]    = useState('');
  const [zoom,     setZoom]     = useState(75);
  const [snapOn,   setSnapOn]   = useState(true);
  const [showLayers,setShowLayers]=useState(false);
  const [codeTab,  setCodeTab]  = useState('preview');
  const [copied,   setCopied]   = useState(false);
  const [loadStep, setLoadStep] = useState(0);

  const canvasRef   = useRef(null);
  const interactRef = useRef(null);
  const histRef     = useRef({stack:[],idx:-1});

  const sc = zoom / 100;
  const activeScreen = screens[activeIdx];
  const selEl = activeScreen?.elements?.find(e=>e.id===selId);

  // Loading message cycle
  useEffect(()=>{
    if(stage!=='loading') return;
    setLoadStep(0);
    const iv = setInterval(()=>setLoadStep(p=>(p+1)%4), 1500);
    return ()=>clearInterval(iv);
  },[stage]);

  // Keyboard shortcuts
  useEffect(()=>{
    if(stage!=='editor') return;
    const h = e => {
      if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA') return;
      if((e.key==='Delete'||e.key==='Backspace')&&selId){ e.preventDefault(); deleteEl(); }
      if(e.key==='Escape') setSelId(null);
      if(e.key==='z'&&(e.metaKey||e.ctrlKey)&&!e.shiftKey){ e.preventDefault(); undo(); }
      if(e.key==='z'&&(e.metaKey||e.ctrlKey)&&e.shiftKey){ e.preventDefault(); redo(); }
      if(e.key==='d'&&(e.metaKey||e.ctrlKey)){ e.preventDefault(); duplicateEl(); }
      if(!selId) return;
      const step = e.shiftKey?GRID*4:GRID;
      if(e.key==='ArrowUp')   { e.preventDefault(); nudge(0,-step); }
      if(e.key==='ArrowDown') { e.preventDefault(); nudge(0,step);  }
      if(e.key==='ArrowLeft') { e.preventDefault(); nudge(-step,0); }
      if(e.key==='ArrowRight'){ e.preventDefault(); nudge(step,0);  }
    };
    window.addEventListener('keydown', h);
    return ()=>window.removeEventListener('keydown', h);
  },[stage, selId, screens, activeIdx]);

  // ── History ──
  function saveHist() {
    const snap = JSON.parse(JSON.stringify(screens));
    const {stack,idx}=histRef.current;
    const ns = stack.slice(0,idx+1).concat([snap]).slice(-50);
    histRef.current = {stack:ns,idx:ns.length-1};
  }
  function undo() {
    const {stack,idx}=histRef.current;
    if(idx>0){histRef.current.idx--;setScreens(JSON.parse(JSON.stringify(stack[histRef.current.idx])));setSelId(null);}
  }
  function redo() {
    const {stack,idx}=histRef.current;
    if(idx<stack.length-1){histRef.current.idx++;setScreens(JSON.parse(JSON.stringify(stack[histRef.current.idx])));setSelId(null);}
  }

  // ── Element helpers ──
  function updEls(fn) {
    setScreens(p=>p.map((s,i)=>i===activeIdx?{...s,elements:fn(s.elements)}:s));
  }
  function addEl(type) {
    saveHist();
    const el=mkEl(type);
    if(snapOn){el.x=snapV(el.x);el.y=snapV(el.y);}
    updEls(els=>[...els,el]); setSelId(el.id);
  }
  function updateEl(upd) { updEls(els=>els.map(e=>e.id===upd.id?upd:e)); }
  function deleteEl() {
    if(!selId) return; saveHist();
    updEls(els=>els.filter(e=>e.id!==selId)); setSelId(null);
  }
  function duplicateEl() {
    if(!selEl) return; saveHist();
    const cl={...JSON.parse(JSON.stringify(selEl)),id:nid(),x:selEl.x+GRID*3,y:selEl.y+GRID*3};
    updEls(els=>[...els,cl]); setSelId(cl.id);
  }
  function bringForward() { updEls(els=>{ const i=els.findIndex(e=>e.id===selId); if(i<els.length-1){const a=[...els];[a[i],a[i+1]]=[a[i+1],a[i]];return a;} return els; }); }
  function sendBack()     { updEls(els=>{ const i=els.findIndex(e=>e.id===selId); if(i>0){const a=[...els];[a[i-1],a[i]]=[a[i],a[i-1]];return a;} return els; }); }
  function nudge(dx,dy)   { updEls(els=>els.map(e=>e.id===selId?{...e,x:e.x+dx,y:e.y+dy}:e)); }

  // ── Canvas interaction ──
  function onElDown(e, id) {
    e.stopPropagation(); setSelId(id);
    const el=activeScreen.elements.find(el=>el.id===id);
    interactRef.current={kind:'drag',elId:id,sx:e.clientX,sy:e.clientY,origEl:{...el}};
  }
  function onResizeStart(e, handle, el) {
    interactRef.current={kind:'resize',elId:el.id,handle,sx:e.clientX,sy:e.clientY,origEl:{...el}};
  }
  function onCanvasMove(e) {
    const ir=interactRef.current;
    if(!ir) return;
    const dx=(e.clientX-ir.sx)/sc, dy=(e.clientY-ir.sy)/sc;
    if(ir.kind==='drag'){
      let nx=ir.origEl.x+dx, ny=ir.origEl.y+dy;
      if(snapOn){nx=snapV(nx);ny=snapV(ny);}
      updEls(els=>els.map(el=>el.id===ir.elId?{...el,x:nx,y:ny}:el));
    } else {
      const oe=ir.origEl;
      let [nx,ny,nw,nh]=[oe.x,oe.y,oe.w,oe.h];
      if(ir.handle.includes('e')) nw=Math.max(40,oe.w+dx);
      if(ir.handle.includes('s')) nh=Math.max(20,oe.h+dy);
      if(ir.handle.includes('w')){nx=oe.x+dx;nw=Math.max(40,oe.w-dx);}
      if(ir.handle.includes('n')){ny=oe.y+dy;nh=Math.max(20,oe.h-dy);}
      if(snapOn){nx=snapV(nx);ny=snapV(ny);nw=snapV(nw);nh=snapV(nh);}
      updEls(els=>els.map(el=>el.id===ir.elId?{...el,x:nx,y:ny,w:nw,h:nh}:el));
    }
  }
  function onCanvasUp() { if(interactRef.current)saveHist(); interactRef.current=null; }

  // ── API: Generate Flow ──
  async function generateFlow() {
    if(!prompt.trim()) return;
    setStage('loading'); setError('');
    try {
      const res = await fetch('/api/anthropic/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({model:'claude-sonnet-4-6',max_tokens:1000,
          system:`UX architect. Return ONLY valid JSON — no markdown, no commentary.
Schema:
{"appName":"...","tagline":"...","type":"web","primaryColor":"#hexcode","screens":[{"id":"s1","name":"...","route":"/...","icon":"emoji","description":"2 sentences","connectedTo":["s2"],"suggestedElements":["navbar","hero","heading","para","button","footer"]}]}
Rules: 4-7 screens. suggestedElements from ONLY: navbar,hero,section,divider,footer,heading,subheading,para,badge,stat,image,card,feature,testimonial,button,btn-out,input. connectedTo must be valid ids.`,
          messages:[{role:'user',content:`App idea: ${prompt}`}]
        })
      });
      const d=await res.json();
      const txt=d.content?.map(c=>c.text||'').join('')||'';
      const json=JSON.parse(txt.replace(/```json|```/g,'').trim());
      setFlowData(json);
      const scs=json.screens.map(sc=>({...sc,elements:initEls(sc.suggestedElements)}));
      setScreens(scs); setActiveIdx(0); setSelId(null);
      histRef.current={stack:[],idx:-1};
      setStage('flow');
    } catch(e){ setError('Could not generate flow. Please try again.'); setStage('prompt'); }
  }

  // ── API: Generate Code ──
  async function generateCode() {
    setStage('loading'); setError('');
    try {
      const payload = screens.map(sc=>({
        name:sc.name, route:sc.route, description:sc.description,
        elements:sc.elements.map(el=>({
          type:el.type,
          content:el.content||el.title||el.value||el.cta||el.placeholder||el.quote||el.label||'',
          sub:el.sub||el.desc||el.author||'',
          bg:el.bg, fg:el.fg, accent:el.accent||el.borderCol||'',
        }))
      }));
      const res = await fetch('/api/anthropic/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({model:'claude-sonnet-4-6',max_tokens:8000,
          system:`Expert web developer. Generate a complete single-file HTML website. Return ONLY the HTML starting with <!DOCTYPE html>. No markdown backticks.
Requirements: embedded CSS + vanilla JS only, smooth JS routing between screens (show/hide), modern beautiful design using the primary color, Google Fonts (Syne + Plus Jakarta Sans), hover effects, CSS transitions, fully mobile responsive, hamburger nav on mobile, all screens as <section> data-page attributes, first visible.`,
          messages:[{role:'user',content:`Project: ${flowData?.appName||'App'}\nIdea: ${prompt}\nPrimary Color: ${flowData?.primaryColor||'#7c6ef5'}\nScreens:\n${JSON.stringify(payload,null,2)}`}]
        })
      });
      const d=await res.json();
      const txt=d.content?.map(c=>c.text||'').join('')||'';
      const html=txt.replace(/^```html\n?|^```\n?|```$/gm,'').trim();
      setCode(html); setCodeTab('preview'); setStage('code');
    } catch(e){ setError('Code generation failed. Try again.'); setStage('editor'); }
  }

  function downloadCode() {
    const b=new Blob([code],{type:'text/html'});
    const u=URL.createObjectURL(b);
    const a=document.createElement('a');
    a.href=u; a.download=`${(flowData?.appName||'app').toLowerCase().replace(/\s+/g,'-')}.html`;
    a.click(); URL.revokeObjectURL(u);
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // LOADING SCREEN
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if(stage==='loading') {
    const msgs = flowData ? LOAD_CODE : LOAD_FLOW;
    return (
      <div style={{height:'100vh',background:C.bg,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:"'Plus Jakarta Sans',sans-serif",gap:0}}>
        <style>{CSS}</style>
        <div style={{width:54,height:54,border:`3px solid ${C.border}`,borderTopColor:C.p,borderRadius:'50%',animation:'spin 1s linear infinite',marginBottom:28}}/>
        <div style={{color:C.text,fontSize:18,fontWeight:700,fontFamily:"'Syne',sans-serif",marginBottom:20,letterSpacing:'-.3px'}}>
          {flowData ? 'Generating your code' : 'Designing your flow'}
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:8,alignItems:'flex-start'}}>
          {msgs.map((m,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:10,opacity: loadStep===i?1:.3,transition:'opacity .4s'}}>
              <div style={{width:6,height:6,borderRadius:'50%',background:loadStep===i?C.p:C.border,transition:'background .4s',boxShadow:loadStep===i?`0 0 8px ${C.p}`:'none'}}/>
              <span style={{color:loadStep===i?C.text:C.muted,fontSize:12,fontFamily:"'DM Mono',monospace",transition:'color .4s'}}>{m}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PROMPT SCREEN
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if(stage==='prompt') return (
    <div style={{minHeight:'100vh',background:C.bg,display:'flex',flexDirection:'column',fontFamily:"'Plus Jakarta Sans',sans-serif",position:'relative',overflow:'hidden'}}>
      <style>{CSS}</style>
      {/* Background grid + glows */}
      <div style={{position:'fixed',inset:0,backgroundImage:`radial-gradient(circle at 1px 1px, ${C.border}77 1px, transparent 0)`,backgroundSize:'32px 32px',opacity:.7,pointerEvents:'none'}}/>
      <div style={{position:'fixed',top:'20%',left:'50%',transform:'translate(-50%,-50%)',width:900,height:900,background:`radial-gradient(circle,${C.p}0c,transparent 60%)`,pointerEvents:'none'}}/>
      <div style={{position:'fixed',bottom:'10%',right:'5%',width:500,height:500,background:`radial-gradient(circle,${C.g}07,transparent 65%)`,pointerEvents:'none'}}/>

      {/* Header */}
      <div style={{position:'relative',zIndex:1,padding:'16px 28px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:`1px solid ${C.border}`}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:32,height:32,background:`linear-gradient(135deg,${C.p},#c084fc)`,borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 4px 18px ${C.p}40`}}>
            <span style={{color:'#fff',fontSize:15}}>⬡</span>
          </div>
          <span style={{color:C.text,fontWeight:800,fontSize:17,fontFamily:"'Syne',sans-serif",letterSpacing:'-.4px'}}>BuildFlow</span>
          <span style={{background:C.s2,border:`1px solid ${C.border}`,color:C.muted,fontSize:10,padding:'2px 8px',borderRadius:20,fontFamily:"'DM Mono',monospace"}}>v2</span>
        </div>
        <div style={{display:'flex',gap:24,alignItems:'center'}}>
          {['Prompt','Flow','Design','Code'].map((s,i)=>(
            <span key={s} style={{color:C.muted,fontSize:12,display:'flex',alignItems:'center',gap:5}}>
              <span style={{width:16,height:16,borderRadius:'50%',background:C.s3,border:`1px solid ${C.border}`,display:'inline-flex',alignItems:'center',justifyContent:'center',fontSize:9,color:C.muted,fontFamily:"'DM Mono',monospace"}}>{i+1}</span>
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'40px 24px 60px',position:'relative',zIndex:1}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:8,background:C.s2,border:`1px solid ${C.border}`,borderRadius:20,padding:'6px 16px',marginBottom:24,animation:'fadeUp .4s ease'}}>
          <div style={{width:6,height:6,borderRadius:'50%',background:C.g,boxShadow:`0 0 8px ${C.g}`,animation:'pulse 2s ease infinite'}}/>
          <span style={{color:C.mid,fontSize:11,fontFamily:"'DM Mono',monospace",letterSpacing:'.3px'}}>AI-powered · Prompt to code</span>
        </div>

        <h1 style={{color:C.text,fontSize:Math.min(62,window.innerWidth*.075),fontWeight:800,lineHeight:1.06,fontFamily:"'Syne',sans-serif",letterSpacing:'-2.5px',textAlign:'center',maxWidth:680,marginBottom:16,animation:'fadeUp .45s ease .06s both'}}>
          Describe your app.<br/>
          <span style={{background:`linear-gradient(100deg,${C.p},#c084fc 50%,${C.g})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
            We'll design & build it.
          </span>
        </h1>

        <p style={{color:C.muted,fontSize:16,lineHeight:1.7,fontWeight:300,textAlign:'center',maxWidth:460,marginBottom:40,animation:'fadeUp .5s ease .12s both'}}>
          Design every screen visually, then export production-ready HTML — in minutes.
        </p>

        {/* Input box */}
        <div style={{width:'100%',maxWidth:680,animation:'fadeUp .55s ease .18s both'}}>
          <div style={{background:C.s1,border:`1px solid ${C.border}`,borderRadius:16,overflow:'hidden',boxShadow:`0 20px 80px #00000055`}}>
            <textarea value={prompt} onChange={e=>setPrompt(e.target.value)}
              onKeyDown={e=>{if(e.key==='Enter'&&(e.metaKey||e.ctrlKey))generateFlow();}}
              placeholder="Describe the app or website you want to build in detail…"
              style={{width:'100%',background:'transparent',border:'none',padding:'20px 24px',color:C.text,fontSize:15,fontFamily:"'Plus Jakarta Sans',sans-serif",resize:'none',minHeight:120,outline:'none',lineHeight:1.75}}/>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 16px 14px',borderTop:`1px solid ${C.border}`,background:`${C.s2}88`}}>
              <div style={{display:'flex',gap:12,alignItems:'center'}}>
                <span style={{color:C.muted,fontSize:11,fontFamily:"'DM Mono',monospace"}}>⌘↵ to generate</span>
                {prompt.length>0&&<span style={{color:C.muted,fontSize:11,fontFamily:"'DM Mono',monospace"}}>{prompt.length} chars</span>}
              </div>
              <button className="bf-btn" onClick={generateFlow} disabled={!prompt.trim()}
                style={{background:prompt.trim()?`linear-gradient(135deg,${C.p},#a78bfa)`:`${C.s3}`,color:prompt.trim()?'#fff':C.muted,border:'none',borderRadius:10,padding:'10px 26px',cursor:prompt.trim()?'pointer':'not-allowed',fontSize:14,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif",boxShadow:prompt.trim()?`0 4px 22px ${C.p}40`:'none'}}>
                Generate Flow →
              </button>
            </div>
          </div>
        </div>

        {/* Examples */}
        <div style={{marginTop:26,maxWidth:680,width:'100%',animation:'fadeUp .6s ease .22s both'}}>
          <div style={{color:C.muted,fontSize:11,marginBottom:10,fontFamily:"'DM Mono',monospace"}}>→ Start with an example</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
            {EXAMPLES.map((ex,i)=>(
              <button key={i} className="ex-chip" onClick={()=>setPrompt(ex.t)}
                style={{background:C.s2,border:`1px solid ${C.border}`,color:C.mid,borderRadius:10,padding:'7px 13px',cursor:'pointer',fontSize:12,fontFamily:"'Plus Jakarta Sans',sans-serif",transition:'all .15s',display:'flex',alignItems:'center',gap:7}}>
                <span>{ex.e}</span>{ex.t}
              </button>
            ))}
          </div>
        </div>

        {error&&<div style={{marginTop:16,background:'#f8717118',border:'1px solid #f8717144',borderRadius:10,padding:'10px 16px',color:'#fca5a5',fontSize:13,maxWidth:680,width:'100%'}}>{error}</div>}

        {/* Feature pills */}
        <div style={{marginTop:52,display:'flex',flexWrap:'wrap',justifyContent:'center',gap:10,animation:'fadeUp .7s ease .28s both'}}>
          {[['⬡','17 components'],['☉','Resize & snap'],['↩','Undo / Redo'],['⌨','Keyboard shortcuts'],['⊞','Layers panel'],['↓','Export HTML']].map(([i,l])=>(
            <div key={l} style={{display:'flex',alignItems:'center',gap:7,background:C.s1,border:`1px solid ${C.border}`,borderRadius:20,padding:'5px 14px'}}>
              <span style={{color:C.p,fontSize:13}}>{i}</span>
              <span style={{color:C.muted,fontSize:12}}>{l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // FLOW SCREEN
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if(stage==='flow') return (
    <div style={{minHeight:'100vh',background:C.bg,color:C.text,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
      <style>{CSS}</style>
      <div style={{height:52,borderBottom:`1px solid ${C.border}`,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 20px',background:C.s1}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <button onClick={()=>{setStage('prompt');setFlowData(null);setScreens([]);}} style={{background:'none',border:'none',color:C.muted,cursor:'pointer',fontSize:18,lineHeight:1}}>←</button>
          <div style={{width:1,height:18,background:C.border}}/>
          <div style={{width:26,height:26,background:`linear-gradient(135deg,${C.p},#c084fc)`,borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,color:'#fff'}}>⬡</div>
          <span style={{color:C.text,fontWeight:700,fontFamily:"'Syne',sans-serif",fontSize:14}}>{flowData?.appName}</span>
        </div>
        <Stepper stage="flow"/>
        <button className="bf-btn" onClick={()=>setStage('editor')} style={{background:`linear-gradient(135deg,${C.p},#a78bfa)`,color:'#fff',border:'none',borderRadius:9,padding:'8px 22px',cursor:'pointer',fontSize:13,fontWeight:600,boxShadow:`0 4px 16px ${C.p}40`}}>
          Open Editor →
        </button>
      </div>

      <div style={{maxWidth:1100,margin:'0 auto',padding:32}}>
        <div style={{marginBottom:28}}>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:800,letterSpacing:'-.5px',marginBottom:6}}>{flowData?.appName}</h2>
          <p style={{color:C.muted,fontSize:13}}>{flowData?.tagline} · {screens.length} screens · {CATALOG.flatMap(c=>c.items).length} components available</p>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:14,marginBottom:32}}>
          {screens.map((sc,i)=>(
            <div key={sc.id} style={{background:C.s1,border:`1px solid ${C.border}`,borderRadius:14,padding:20,position:'relative',overflow:'hidden',transition:'border-color .2s,transform .2s'}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=C.p;e.currentTarget.style.transform='translateY(-2px)'}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform='none'}}>
              <div style={{position:'absolute',top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${C.p},#c084fc)`}}/>
              <div style={{position:'absolute',top:14,right:14,width:22,height:22,borderRadius:'50%',background:C.s2,border:`1px solid ${C.border}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:C.muted,fontFamily:"'DM Mono',monospace"}}>{i+1}</div>
              <div style={{fontSize:28,marginBottom:10}}>{sc.icon}</div>
              <div style={{fontWeight:700,fontSize:14,fontFamily:"'Syne',sans-serif",marginBottom:4}}>{sc.name}</div>
              <div style={{color:C.p,fontSize:11,fontFamily:"'DM Mono',monospace",marginBottom:8}}>{sc.route}</div>
              <div style={{color:C.muted,fontSize:12,lineHeight:1.65,marginBottom:12}}>{sc.description}</div>
              {sc.suggestedElements?.length>0&&(
                <div style={{display:'flex',flexWrap:'wrap',gap:3,marginBottom:8}}>
                  {sc.suggestedElements.slice(0,4).map((t,j)=>(
                    <span key={j} style={{background:C.s3,border:`1px solid ${C.border}`,color:C.muted,fontSize:9,borderRadius:4,padding:'1px 5px',fontFamily:"'DM Mono',monospace"}}>{t}</span>
                  ))}
                  {sc.suggestedElements.length>4&&<span style={{color:C.muted,fontSize:9}}>+{sc.suggestedElements.length-4}</span>}
                </div>
              )}
              {sc.connectedTo?.length>0&&(
                <div style={{display:'flex',flexWrap:'wrap',gap:3}}>
                  {sc.connectedTo.map(tid=>{
                    const tgt=screens.find(s=>s.id===tid);
                    return tgt&&<span key={tid} style={{background:C.s3,border:`1px solid ${C.border}`,color:C.muted,fontSize:9,borderRadius:4,padding:'1px 6px',fontFamily:"'DM Mono',monospace"}}>→ {tgt.name}</span>;
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{background:C.s1,border:`1px solid ${C.border}`,borderRadius:14,padding:24,marginBottom:28}}>
          <div style={{color:C.mid,fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:'.8px',marginBottom:16,fontFamily:"'DM Mono',monospace"}}>Navigation Flow Diagram</div>
          <FlowDiag screens={screens}/>
        </div>

        <div style={{display:'flex',gap:10}}>
          <button className="bf-btn" onClick={()=>{setStage('prompt');setFlowData(null);setScreens([]);}} style={{background:'none',border:`1px solid ${C.border}`,color:C.muted,borderRadius:9,padding:'10px 18px',cursor:'pointer',fontSize:13}}>← Regenerate</button>
          <button className="bf-btn" onClick={()=>setStage('editor')} style={{background:`linear-gradient(135deg,${C.p},#a78bfa)`,color:'#fff',border:'none',borderRadius:9,padding:'10px 0',cursor:'pointer',fontSize:13,fontWeight:600,flex:1,boxShadow:`0 4px 20px ${C.p}30`}}>
            Customize Every Screen in the Visual Editor →
          </button>
        </div>
      </div>
    </div>
  );

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // EDITOR SCREEN
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if(stage==='editor') {
    const canW = Math.round(CW*sc), canH = Math.round(CH*sc);
    return (
      <div style={{height:'100vh',display:'flex',flexDirection:'column',background:C.bg,fontFamily:"'Plus Jakarta Sans',sans-serif",color:C.text,overflow:'hidden'}}>
        <style>{CSS}</style>

        {/* ── Topbar ── */}
        <div style={{height:48,borderBottom:`1px solid ${C.border}`,display:'flex',alignItems:'center',padding:'0 12px',background:C.s1,gap:6,flexShrink:0}}>
          <button onClick={()=>setStage('flow')} style={{background:'none',border:'none',color:C.muted,cursor:'pointer',fontSize:17,lineHeight:1,padding:'4px 8px'}}>←</button>
          <div style={{width:1,height:18,background:C.border}}/>
          <span style={{color:C.text,fontWeight:700,fontFamily:"'Syne',sans-serif",fontSize:13}}>{flowData?.appName}</span>

          <div style={{flex:1}}/>
          <Stepper stage="editor"/>
          <div style={{flex:1}}/>

          {/* Undo / Redo */}
          {[{fn:undo,ic:'↩',tip:'Undo ⌘Z'},{fn:redo,ic:'↪',tip:'Redo ⌘⇧Z'}].map(({fn,ic,tip})=>(
            <button key={tip} title={tip} onClick={fn}
              style={{background:C.s2,border:`1px solid ${C.border}`,color:C.mid,borderRadius:6,width:28,height:28,cursor:'pointer',fontSize:14,display:'flex',alignItems:'center',justifyContent:'center',transition:'all .15s'}}
              onMouseEnter={e=>e.currentTarget.style.borderColor=C.p}
              onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
              {ic}
            </button>
          ))}

          <div style={{width:1,height:18,background:C.border}}/>

          {/* Zoom */}
          <div style={{display:'flex',alignItems:'center',background:C.s2,border:`1px solid ${C.border}`,borderRadius:7,overflow:'hidden'}}>
            <button onClick={()=>setZoom(z=>Math.max(40,z-25))} style={{background:'none',border:'none',color:C.mid,cursor:'pointer',fontSize:16,padding:'0 8px',height:28}}>−</button>
            <span style={{color:C.mid,fontSize:11,fontFamily:"'DM Mono',monospace",minWidth:36,textAlign:'center',borderLeft:`1px solid ${C.border}`,borderRight:`1px solid ${C.border}`,lineHeight:'28px',height:28,display:'inline-block'}}>{zoom}%</span>
            <button onClick={()=>setZoom(z=>Math.min(150,z+25))} style={{background:'none',border:'none',color:C.mid,cursor:'pointer',fontSize:16,padding:'0 8px',height:28}}>+</button>
          </div>

          {/* Snap toggle */}
          <button onClick={()=>setSnapOn(s=>!s)} title="Toggle snap to grid"
            style={{background:snapOn?`${C.p}22`:C.s2,border:`1px solid ${snapOn?C.p:C.border}`,color:snapOn?C.p:C.muted,borderRadius:6,padding:'4px 10px',cursor:'pointer',fontSize:11,fontFamily:"'DM Mono',monospace",transition:'all .15s'}}>
            ⊞ {snapOn?'Snap on':'Snap off'}
          </button>

          <div style={{width:1,height:18,background:C.border}}/>

          <button className="bf-btn" onClick={generateCode}
            style={{background:`linear-gradient(135deg,${C.g},#059669)`,color:'#0a1a0e',border:'none',borderRadius:8,padding:'6px 20px',cursor:'pointer',fontSize:12,fontWeight:700,boxShadow:`0 3px 16px ${C.g}30`,letterSpacing:'.2px'}}>
            Generate Code ✦
          </button>
        </div>

        {/* ── Body ── */}
        <div style={{flex:1,display:'flex',overflow:'hidden'}}>

          {/* LEFT PANEL */}
          <div style={{width:164,borderRight:`1px solid ${C.border}`,background:C.s1,display:'flex',flexDirection:'column',flexShrink:0}}>
            <div style={{display:'flex',borderBottom:`1px solid ${C.border}`,flexShrink:0}}>
              {[{v:false,l:'Add'},{v:true,l:'Layers'}].map(({v,l})=>(
                <button key={l} onClick={()=>setShowLayers(v)}
                  style={{flex:1,padding:'8px 0',background:showLayers===v?C.s2:'none',border:'none',borderBottom:showLayers===v?`2px solid ${C.p}`:'2px solid transparent',color:showLayers===v?C.text:C.muted,cursor:'pointer',fontSize:11,fontFamily:"'DM Mono',monospace",transition:'all .12s'}}>
                  {l}
                </button>
              ))}
            </div>
            <div style={{flex:1,overflowY:'auto',padding:7}}>
              {!showLayers ? (
                CATALOG.map(cat=>(
                  <div key={cat.cat} style={{marginBottom:10}}>
                    <div style={{color:cat.accent,fontSize:9,fontFamily:"'DM Mono',monospace",textTransform:'uppercase',letterSpacing:'1px',padding:'4px 8px 3px',fontWeight:600}}>{cat.cat}</div>
                    {cat.items.map(it=>(
                      <button key={it.type} className="pal-row" onClick={()=>addEl(it.type)}
                        style={{display:'flex',alignItems:'center',gap:8,background:C.s2,border:`1px solid ${C.border}`,borderRadius:7,padding:'6px 9px',cursor:'pointer',color:C.mid,fontSize:11,fontFamily:"'Plus Jakarta Sans',sans-serif",transition:'all .12s',textAlign:'left',width:'100%',marginBottom:2}}>
                        <span style={{color:cat.accent,fontSize:12,width:14,textAlign:'center',fontFamily:'monospace'}}>{it.icon}</span>
                        {it.label}
                      </button>
                    ))}
                  </div>
                ))
              ) : (
                activeScreen?.elements?.length ? (
                  [...(activeScreen.elements||[])].reverse().map(el=>{
                    const info = CATALOG.flatMap(c=>c.items).find(i=>i.type===el.type)||{icon:'?'};
                    const cat  = CATALOG.find(c=>c.items.some(i=>i.type===el.type));
                    return (
                      <button key={el.id} className="layer-row" onClick={()=>setSelId(el.id)}
                        style={{width:'100%',display:'flex',alignItems:'center',gap:7,padding:'6px 8px',background:el.id===selId?C.s3:'none',border:`1px solid ${el.id===selId?C.p:C.border}`,borderRadius:7,cursor:'pointer',marginBottom:3,transition:'all .12s',boxSizing:'border-box'}}>
                        <span style={{color:cat?.accent||C.mid,fontSize:12,fontFamily:'monospace',width:14,textAlign:'center'}}>{info.icon}</span>
                        <span style={{color:el.id===selId?C.text:C.mid,fontSize:11,fontFamily:"'Plus Jakarta Sans',sans-serif",overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',flex:1,textAlign:'left'}}>{info.label||el.type}</span>
                      </button>
                    );
                  })
                ) : <div style={{padding:14,textAlign:'center',color:C.muted,fontSize:11}}>No elements yet</div>
              )}
            </div>
          </div>

          {/* CENTER CANVAS */}
          <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
            {/* Screen tabs */}
            <div style={{height:36,borderBottom:`1px solid ${C.border}`,display:'flex',alignItems:'flex-end',paddingLeft:10,gap:2,overflowX:'auto',flexShrink:0,background:C.s2}}>
              {screens.map((sc,i)=>(
                <button key={sc.id} className="sc-tab" onClick={()=>{setActiveIdx(i);setSelId(null);}}
                  style={{background:i===activeIdx?C.bg:'none',border:`1px solid ${i===activeIdx?C.border:'transparent'}`,borderBottom:i===activeIdx?`1px solid ${C.bg}`:'none',color:i===activeIdx?C.text:C.muted,borderRadius:'7px 7px 0 0',padding:'4px 13px',cursor:'pointer',fontSize:11,fontFamily:"'Plus Jakarta Sans',sans-serif",whiteSpace:'nowrap',flexShrink:0,transition:'all .12s',marginBottom:i===activeIdx?-1:0}}>
                  {sc.icon} {sc.name}
                </button>
              ))}
              <div style={{flex:1}}/>
              <span style={{color:C.muted,fontSize:10,fontFamily:"'DM Mono',monospace",padding:'0 12px',alignSelf:'center',whiteSpace:'nowrap'}}>Del · Esc · ↑↓ · ⌘D · ⌘Z</span>
            </div>

            {/* Canvas area */}
            <div style={{flex:1,overflow:'auto',display:'flex',alignItems:'flex-start',justifyContent:'center',padding:28,background:'#0d0d1a'}}>
              <div style={{position:'relative'}}>
                <div style={{position:'absolute',inset:-1,borderRadius:5,boxShadow:`0 0 0 1px ${C.border},0 24px 80px #000000cc`,pointerEvents:'none',zIndex:0}}/>
                <div
                  ref={canvasRef}
                  onClick={e=>{if(e.target===canvasRef.current)setSelId(null);}}
                  onMouseMove={onCanvasMove}
                  onMouseUp={onCanvasUp}
                  onMouseLeave={onCanvasUp}
                  style={{position:'relative',width:canW,height:canH,background:'#ffffff',cursor:'default',overflow:'hidden',zIndex:1}}>

                  {/* Grid overlay */}
                  {snapOn&&<div style={{position:'absolute',inset:0,backgroundImage:`linear-gradient(#7c6ef506 1px,transparent 1px),linear-gradient(90deg,#7c6ef506 1px,transparent 1px)`,backgroundSize:`${GRID*sc}px ${GRID*sc}px`,pointerEvents:'none',zIndex:0}}/>}

                  {/* Elements */}
                  {activeScreen?.elements?.map(el=>(
                    <CanvasEl key={el.id} el={el} selected={el.id===selId} sc={sc} onDown={e=>onElDown(e,el.id)}/>
                  ))}

                  {/* Resize handles */}
                  {selEl&&<ResizeHandles el={selEl} sc={sc} onStart={onResizeStart}/>}

                  {/* Quick action bar */}
                  {selEl&&<QuickBar el={selEl} sc={sc} onDuplicate={duplicateEl} onDelete={deleteEl} onForward={bringForward} onBack={sendBack}/>}

                  {/* Empty state */}
                  {!activeScreen?.elements?.length&&(
                    <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',color:'#b0b0c8',gap:12,pointerEvents:'none'}}>
                      <div style={{fontSize:48,opacity:.2}}>+</div>
                      <div style={{fontSize:14,opacity:.5}}>Add components from the left panel</div>
                    </div>
                  )}
                </div>

                <div style={{marginTop:8,textAlign:'center',color:C.muted,fontSize:10,fontFamily:"'DM Mono',monospace"}}>
                  {CW} × {CH}px canvas · {zoom}% zoom · {activeScreen?.elements?.length||0} elements
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Properties */}
          <div style={{width:222,borderLeft:`1px solid ${C.border}`,background:C.s1,display:'flex',flexDirection:'column',flexShrink:0}}>
            <div style={{padding:'10px 14px 8px',borderBottom:`1px solid ${C.border}`,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <span style={{color:C.muted,fontSize:10,textTransform:'uppercase',letterSpacing:'.8px',fontFamily:"'DM Mono',monospace"}}>Properties</span>
              {selEl&&<span style={{color:C.p,fontSize:10,fontFamily:"'DM Mono',monospace"}}>{selEl.type}</span>}
            </div>
            <div style={{flex:1,overflow:'hidden'}}>
              <PropsPanel el={selEl} onUpdate={updateEl} onDelete={deleteEl}/>
            </div>
          </div>
        </div>

        {error&&<div style={{position:'fixed',bottom:16,left:'50%',transform:'translateX(-50%)',background:'#f8717118',border:'1px solid #f8717150',borderRadius:9,padding:'9px 16px',color:'#fca5a5',fontSize:12,zIndex:999,pointerEvents:'none'}}>{error}</div>}
      </div>
    );
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // CODE SCREEN
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if(stage==='code') {
    const lines = code.split('\n');
    const colorLine = l => {
      const t=l.trim();
      if(t.startsWith('<!--'))                     return '#546e8a';
      if(t.startsWith('</'))                        return '#f78c6c';
      if(t.match(/^<(style|script)/))               return '#c3e88d';
      if(t.match(/^<\/(style|script)/))             return '#c3e88d';
      if(t.startsWith('<'))                         return '#82aaff';
      if(t.includes('{')&&!t.includes('"'))         return '#c3e88d';
      if(t.startsWith('//')||t.startsWith('/*')||t.startsWith('*')) return '#4a6070';
      return '#d4d0f0';
    };
    return (
      <div style={{height:'100vh',display:'flex',flexDirection:'column',background:C.bg,fontFamily:"'Plus Jakarta Sans',sans-serif",color:C.text,overflow:'hidden'}}>
        <style>{CSS}</style>

        <div style={{height:52,borderBottom:`1px solid ${C.border}`,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 18px',background:C.s1,flexShrink:0}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <button onClick={()=>setStage('editor')} style={{background:'none',border:'none',color:C.muted,cursor:'pointer',fontSize:17}}>←</button>
            <div style={{width:18,height:18,borderRadius:'50%',background:C.g,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:'#0a1a0e',fontWeight:800}}>✓</div>
            <span style={{color:C.text,fontWeight:700,fontFamily:"'Syne',sans-serif",fontSize:14}}>{flowData?.appName}</span>
            <span style={{color:C.muted,fontSize:12}}>— ready to download</span>
          </div>
          <Stepper stage="code"/>
          <div style={{display:'flex',gap:8}}>
            <button className="bf-btn" onClick={()=>navigator.clipboard.writeText(code).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2200);})}
              style={{background:C.s2,border:`1px solid ${copied?C.g:C.border}`,color:copied?C.g:C.muted,borderRadius:8,padding:'6px 14px',cursor:'pointer',fontSize:12,transition:'all .2s'}}>
              {copied?'✓ Copied':'⎘ Copy Code'}
            </button>
            <button className="bf-btn" onClick={downloadCode}
              style={{background:`linear-gradient(135deg,${C.g},#059669)`,color:'#0a1a0e',border:'none',borderRadius:8,padding:'6px 20px',cursor:'pointer',fontSize:12,fontWeight:700,boxShadow:`0 3px 18px ${C.g}30`}}>
              ↓ Download HTML
            </button>
            <button className="bf-btn" onClick={()=>{setStage('prompt');setPrompt('');setFlowData(null);setScreens([]);setCode('');}}
              style={{background:C.s2,border:`1px solid ${C.border}`,color:C.muted,borderRadius:8,padding:'6px 14px',cursor:'pointer',fontSize:12}}>
              + New App
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{display:'flex',borderBottom:`1px solid ${C.border}`,background:C.s1,flexShrink:0}}>
          {[['preview','⬡ Live Preview'],['code','< > Source Code']].map(([tab,label])=>(
            <button key={tab} onClick={()=>setCodeTab(tab)}
              style={{padding:'10px 24px',background:codeTab===tab?C.bg:'none',border:'none',borderBottom:codeTab===tab?`2px solid ${C.p}`:'2px solid transparent',color:codeTab===tab?C.text:C.muted,cursor:'pointer',fontSize:12,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:codeTab===tab?600:400,transition:'all .15s'}}>
              {label}
            </button>
          ))}
          <div style={{flex:1}}/>
          {codeTab==='code'&&<span style={{display:'flex',alignItems:'center',paddingRight:18,color:C.muted,fontSize:11,fontFamily:"'DM Mono',monospace"}}>{lines.length} lines</span>}
        </div>

        <div style={{flex:1,overflow:'hidden'}}>
          {codeTab==='preview' ? (
            <iframe srcDoc={code} style={{width:'100%',height:'100%',border:'none'}} title="App Preview" sandbox="allow-scripts allow-same-origin"/>
          ) : (
            <div style={{height:'100%',overflow:'auto',padding:'16px 20px'}}>
              <pre style={{background:C.s1,border:`1px solid ${C.border}`,borderRadius:12,padding:'20px 0',overflow:'visible',margin:0}}>
                {lines.map((line,i)=>(
                  <div key={i} style={{display:'flex',alignItems:'flex-start',minHeight:22,padding:'0 20px',gap:16}}
                    onMouseEnter={e=>e.currentTarget.style.background=C.s2}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <span style={{color:C.muted,fontSize:11,userSelect:'none',minWidth:32,textAlign:'right',paddingTop:1,fontFamily:"'DM Mono',monospace",flexShrink:0,opacity:.5}}>{i+1}</span>
                    <span style={{color:colorLine(line),fontSize:12,fontFamily:"'DM Mono',monospace",lineHeight:1.8,flex:1,whiteSpace:'pre-wrap',wordBreak:'break-word'}}>{line||' '}</span>
                  </div>
                ))}
              </pre>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
