# Immersive Zennify deck: "AI-Advanced Delivery" — client-facing, about enabling the
# client's own teams. Progressive-enable funnel (GESA-style) + flowing generate-it
# pipeline (Discovery -> stories -> design -> wireframe -> tests). No per-stage numbers,
# no named skills, no time-savings estimates (may re-add later).
import base64, json

SK = "/root/.claude/skills/synced/zennify-html-artifacts"
FONTS=f"{SK}/assets/fonts"; LOGOS=f"{SK}/assets/logos"; ICONS=f"{SK}/assets/icons"
def b64(p):
    with open(p,"rb") as f: return base64.b64encode(f.read()).decode()
def font_css():
    faces=[("DMSans-regular.ttf","400","normal"),("DMSans-italic.ttf","400","italic"),
           ("DMSansMedium-regular.ttf","500","normal"),("DMSans-bold.ttf","700","normal")]
    return "".join(f"@font-face{{font-family:'DM Sans';font-weight:{w};font-style:{s};src:url('data:font/truetype;base64,{b64(f'{FONTS}/{fn}')}') format('truetype')}}\n" for fn,w,s in faces)
def logo(fn): return f"data:image/png;base64,{b64(f'{LOGOS}/{fn}')}"
def icon(v,fn): return f"data:image/png;base64,{b64(f'{ICONS}/{v}/{fn}')}"
WHITE,DARK,BADGE=logo("zennify_logo_white.png"),logo("zennify_logo_dark.png"),logo("zennify_badge.png")
def idk(fn): return icon("dark",fn)

TOKENS=""":root{--z-dark:#1C4A4D;--z-teal:#27BBAF;--z-teal-light:#62D7B8;--z-mint:#B0EDD3;
--z-white:#FFFFFF;--z-lt:#F2F4F9;--z-ice:#E8F7F6;--z-orange:#FE9732;--z-blue:#3D81F6;
--z-slate:#8094C0;--z-purple:#B19CD8;--z-purple-lt:#C7D3EC;--z-font:'DM Sans',system-ui,sans-serif;
--z-radius:6px;--z-radius-sm:4px;}"""

CSS=font_css()+TOKENS+r"""
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{width:100%;height:100%;background:#0e2a2c;overflow:hidden;font-family:var(--z-font);color:var(--z-dark)}
#deck{position:relative;width:100vw;height:100vh;display:flex;align-items:center;justify-content:center}
.slide{position:absolute;width:960px;height:540px;overflow:hidden;display:none;flex-direction:column;background:var(--z-white);transform-origin:center center}
.slide.active{display:flex}
.slide.dark{background:var(--z-dark);color:#fff}
.pad{padding:38px 48px;flex:1;display:flex;flex-direction:column;min-height:0}
.eyebrow{font-size:11px;font-weight:700;letter-spacing:1.7px;text-transform:uppercase;color:var(--z-teal)}
.slide.dark .eyebrow{color:var(--z-teal-light)}
h1{font-size:38px;font-weight:700;line-height:1.06;letter-spacing:-.5px;color:var(--z-dark)}
.slide.dark h1{color:#fff}
.lead{font-size:15px;line-height:1.55;color:var(--z-slate);margin-top:13px;max-width:700px}
.slide.dark .lead{color:rgba(255,255,255,.82)}
.logo{height:26px;width:auto;align-self:flex-start}
.foot{display:flex;justify-content:space-between;align-items:center;padding:9px 22px;border-top:1px solid var(--z-purple-lt)}
.slide.dark .foot{border-top-color:rgba(255,255,255,.1)}
.foot .c{font-size:9px;color:var(--z-slate);letter-spacing:.3px}.slide.dark .foot .c{color:rgba(255,255,255,.4)}
.foot img{height:18px;width:18px}
.rv{opacity:0;transform:translateY(12px)}
.slide.active .rv{animation:rv .5s cubic-bezier(.22,.8,.28,1) forwards}
.slide.active .rv:nth-child(2){animation-delay:.05s}.slide.active .rv:nth-child(3){animation-delay:.12s}
.slide.active .rv:nth-child(4){animation-delay:.19s}.slide.active .rv:nth-child(5){animation-delay:.26s}
.slide.active .rv:nth-child(6){animation-delay:.33s}
@keyframes rv{to{opacity:1;transform:none}}
.nav{position:fixed;bottom:16px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:14px;z-index:50;background:rgba(28,74,77,.92);border-radius:30px;padding:8px 16px}
.nav button{background:none;border:none;color:#fff;font-size:16px;cursor:pointer;width:24px;height:24px;line-height:1;opacity:.85}
.nav button:hover{opacity:1}
.dots{display:flex;gap:6px}.dot{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.3);cursor:pointer}.dot.on{background:var(--z-teal-light)}
.count{font-size:11px;color:rgba(255,255,255,.7);font-weight:500;min-width:38px;text-align:center}
.prog{position:fixed;top:0;left:0;height:3px;background:var(--z-teal);z-index:60;transition:width .3s}
.cover{display:grid;grid-template-columns:1.15fr .85fr;height:100%}
.cover .l{background:var(--z-dark);color:#fff;padding:48px;display:flex;flex-direction:column}
.cover .r{background:var(--z-ice);display:flex;align-items:center;justify-content:center;padding:34px}
.cover h1{color:#fff;font-size:37px;margin-top:auto}
.cover .sub{color:rgba(255,255,255,.82);font-size:15px;line-height:1.55;margin-top:16px;max-width:440px}
.cover .tagrow{display:flex;gap:8px;margin-top:24px}
.tag{font-size:10px;font-weight:700;letter-spacing:.5px;padding:4px 10px;border-radius:var(--z-radius-sm);background:rgba(255,255,255,.12);color:var(--z-teal-light)}
.cols2{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:22px}
.card{background:var(--z-lt);border-radius:var(--z-radius);padding:20px 22px}
.card.out{background:var(--z-white);border:1px solid var(--z-purple-lt)}
.card .ch{font-size:11px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;color:var(--z-slate);margin-bottom:10px}
.card.acc .ch{color:var(--z-teal)}
.card p{font-size:13px;line-height:1.5;color:var(--z-dark)}
.card .ico{width:26px;height:26px;margin-bottom:12px}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:22px}
.gc{background:var(--z-lt);border-radius:var(--z-radius);padding:18px 20px}
.gc .ico{width:24px;height:24px;margin-bottom:10px}
.gc b{font-size:14px;display:block;color:var(--z-dark);margin-bottom:5px}
.gc span{font-size:12px;line-height:1.45;color:var(--z-slate)}
.beliefs{display:flex;flex-direction:column;gap:9px;margin-top:20px}
.belief{display:flex;gap:12px;align-items:flex-start;background:rgba(255,255,255,.06);border-radius:var(--z-radius);padding:13px 16px}
.belief .n{font-size:15px;font-weight:700;color:var(--z-teal-light);flex:none;width:22px}
.belief p{font-size:14px;line-height:1.4;color:#fff}
/* ENABLE FUNNEL (GESA-style progressive enable) */
.enfun{display:grid;grid-template-columns:460px 1fr;gap:34px;margin-top:14px;flex:1;min-height:0;align-items:center}
.funnel2{display:flex;flex-direction:column;gap:4px}
.fseg2{height:54px;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-family:var(--z-font);font-size:14px;font-weight:700;color:var(--z-slate);background:var(--z-lt);transition:background .45s,color .45s}
.fseg2.on{background:var(--z-teal);color:#fff}
.fseg2.cur{background:var(--z-dark);color:#fff}
.enbtn{align-self:flex-start;margin-top:16px;font-family:var(--z-font);font-size:13px;font-weight:700;color:#fff;background:var(--z-dark);border:none;border-radius:var(--z-radius);padding:12px 20px;cursor:pointer}
.enbtn:hover{background:var(--z-teal)}
.endesc-state{font-size:11px;font-weight:700;letter-spacing:.7px;text-transform:uppercase;color:var(--z-teal)}
.endesc p{font-size:17px;line-height:1.55;color:var(--z-dark);margin-top:12px;max-width:380px}
/* FLOW PIPELINE */
.pipehdr{display:flex;align-items:center;gap:8px;margin-top:12px;flex-wrap:wrap}
.ppill{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:700;color:var(--z-slate);background:var(--z-lt);border-radius:20px;padding:5px 12px;transition:all .2s}
.ppill.done{color:var(--z-dark)}.ppill.done .pd{background:var(--z-teal)}
.ppill.cur{color:#fff;background:var(--z-dark)}.ppill.cur .pd{background:var(--z-teal-light)}
.ppill .pd{width:7px;height:7px;border-radius:50%;background:var(--z-purple-lt)}
.ppill .parrow{color:var(--z-purple-lt);margin:0 -2px}
.flowvp{flex:1;min-height:0;overflow:hidden;margin-top:14px;position:relative}
.flow{display:flex;align-items:stretch;gap:0;height:100%;transition:transform .6s cubic-bezier(.22,.8,.28,1)}
.pcard{width:250px;flex:none;background:var(--z-white);border:1px solid var(--z-purple-lt);border-radius:var(--z-radius);display:flex;flex-direction:column;overflow:hidden;animation:rv .4s ease both}
.pcard .pch{padding:9px 12px;background:var(--z-lt);border-bottom:1px solid var(--z-purple-lt)}
.pcard .pcs{font-size:12px;font-weight:700;color:var(--z-dark)}
.pcard .pcf{font-size:9.5px;color:var(--z-slate);margin-top:1px}.pcard .pcf b{color:var(--z-teal)}
.pcard .pcbody{padding:12px;flex:1;overflow:hidden;font-size:11px}
.pcard .pcgen{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:10px;text-align:center;color:var(--z-slate)}
.spin{width:15px;height:15px;border-radius:50%;border:2px solid rgba(39,187,175,.3);border-top-color:var(--z-teal);animation:sp .7s linear infinite}
@keyframes sp{to{transform:rotate(360deg)}}
.pcard .pcgen .gtxt{font-size:11px;font-weight:600;color:var(--z-dark)}
.parrw{width:44px;flex:none;display:flex;align-items:center;justify-content:center;color:var(--z-teal);font-size:20px;position:relative}
.parrw::after{content:'';position:absolute;left:6px;right:6px;top:50%;height:2px;background:var(--z-purple-lt);z-index:0}
.parrw span{position:relative;z-index:1;background:var(--z-white);padding:2px}
.pctrl{display:flex;align-items:center;gap:12px;margin-top:6px}
.replay{font-family:var(--z-font);font-size:12px;font-weight:700;color:var(--z-dark);background:var(--z-white);border:1px solid var(--z-purple-lt);border-radius:var(--z-radius);padding:8px 14px;cursor:pointer}
.replay:hover{border-color:var(--z-teal);color:var(--z-teal)}
.pctrl .hint{font-size:11px;color:var(--z-slate)}
.fnd{display:flex;gap:7px;align-items:flex-start;margin-bottom:7px;line-height:1.35}
.fdot{width:7px;height:7px;border-radius:50%;flex:none;margin-top:4px}
.fdot.n{background:var(--z-teal)}.fdot.a{background:#f0c000}.fdot.r{background:var(--z-orange)}
.mstory{background:var(--z-ice);border-radius:var(--z-radius-sm);padding:8px 10px;margin-bottom:7px}
.mstory .sk{font-size:9px;font-weight:700;color:#fff;background:var(--z-teal);border-radius:3px;padding:1px 6px}
.mstory b2{font-size:11px;font-weight:700;color:var(--z-dark);margin-left:5px}
.mstory p{font-size:10.5px;line-height:1.4;color:var(--z-dark);margin-top:5px}.mstory p b{color:var(--z-teal)}
.drow{display:flex;justify-content:space-between;gap:8px;font-size:10.5px;padding:5px 0;border-bottom:1px solid var(--z-purple-lt);line-height:1.3}
.drow:last-child{border:none}.drow .dl{font-weight:700;color:var(--z-dark)}.drow .dr{color:var(--z-slate);text-align:right}
.wf{border:1px solid var(--z-purple-lt);border-radius:var(--z-radius-sm);overflow:hidden}
.wf .wt{display:flex;align-items:center;gap:6px;padding:6px 8px;border-bottom:1px solid var(--z-purple-lt)}
.wf .wo{font-size:7.5px;font-weight:700;color:#fff;background:#0176d3;border-radius:2px;padding:1px 4px}
.wf .wtt{font-size:10px;font-weight:700;color:var(--z-dark)}
.wf .wff{padding:8px;display:grid;grid-template-columns:1fr 1fr;gap:6px 8px}
.wf .wfi span{font-size:7.5px;color:var(--z-slate);display:block}.wf .wfi span em{font-style:normal;color:var(--z-orange);font-weight:700}
.wf .wfi .bx{height:11px;border:1px solid var(--z-purple-lt);border-radius:2px;background:#fbfcfe;margin-top:2px}
.wf .wfi.warn .bx{border-color:var(--z-orange);background:#fff7ef}.wf .wfi.full{grid-column:1/-1}
.tc{font-size:10px;padding:5px 0;border-bottom:1px solid var(--z-purple-lt);line-height:1.35}.tc:last-child{border:none}
.tc b{color:var(--z-teal);font-size:9.5px;margin-right:5px}
.proofs{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:22px}
.proof{background:var(--z-lt);border-radius:var(--z-radius);padding:22px 24px;display:flex;align-items:center;gap:20px}
.proof .ba{display:flex;align-items:baseline;gap:10px}
.proof .b{font-size:32px;font-weight:700;color:var(--z-orange);line-height:1}
.proof .ar{font-size:19px;color:var(--z-slate)}
.proof .a{font-size:32px;font-weight:700;color:var(--z-teal);line-height:1}
.proof .t b{font-size:14px;color:var(--z-dark);display:block}.proof .t span{font-size:11px;color:var(--z-slate)}
.proof .meas{font-size:9px;font-weight:700;letter-spacing:.3px;color:#1C6B3A;margin-top:5px;display:block}
.honest{margin-top:16px;font-size:12px;color:var(--z-slate);line-height:1.5;font-style:italic}
.offer{display:grid;grid-template-columns:1.2fr .8fr;gap:18px;margin-top:20px}
.olist{list-style:none;display:flex;flex-direction:column;gap:8px}
.olist li{position:relative;padding-left:16px;font-size:12.5px;line-height:1.45;color:var(--z-dark)}
.olist li::before{content:'\25CF';position:absolute;left:0;top:5px;font-size:6px;color:var(--z-teal)}
.olist.no li::before{content:'\2715';color:var(--z-slate);font-size:9px;top:2px}
.subh{font-size:11px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;color:var(--z-slate);margin-bottom:10px}.subh.acc{color:var(--z-teal)}
.startchip{margin-top:auto;background:var(--z-dark);color:#fff;border-radius:var(--z-radius);padding:14px 16px}
.startchip b{color:var(--z-teal-light);font-size:11px;letter-spacing:.5px;text-transform:uppercase}
.startchip p{font-size:14px;margin-top:5px;color:#fff;line-height:1.35}
.steps{display:flex;gap:10px;margin-top:24px}
.pstep{flex:1;background:var(--z-lt);border-radius:var(--z-radius);padding:18px}
.pstep .pn{font-size:11px;font-weight:700;color:var(--z-teal);letter-spacing:.5px}
.pstep b{font-size:15px;display:block;margin:7px 0 6px;color:var(--z-dark)}
.pstep span{font-size:12px;color:var(--z-slate);line-height:1.45}
.close .cta{margin-top:26px;display:inline-block;background:var(--z-teal);color:#fff;font-size:14px;font-weight:700;border-radius:var(--z-radius);padding:14px 26px}
"""

def foot(dark=False):
    return f'<div class="foot"><span class="c">&copy; 2026 Zennify &middot; Confidential &middot; AI-Advanced Delivery</span><img src="{BADGE}" alt="Zennify"></div>'

# enable funnel: names + plain (no numbers/skills)
STAGES2=["Discovery","Solution design","Build","UAT","Go-Live","Run & grow"]
ENDESC=[
 "Workshops become a structured, traceable backlog your teams can build straight from.",
 "Requirements become a build-ready design before the first sprint, so your teams start with answers.",
 "Your developers spend their time on judgment, not boilerplate, and the quality line holds.",
 "Testing becomes an evidence-based go/no-go your stakeholders can trust.",
 "Cutover becomes a rehearsed, controlled event, not a leap of faith.",
 "After launch, your teams keep adoption and value compounding, quarter over quarter.",
]
STAGES2_JSON=json.dumps(STAGES2); ENDESC_JSON=json.dumps(ENDESC)
def funnel_segs():
    bounds=[100,88,76,66,57,49,42]
    out=""
    for i,name in enumerate(STAGES2):
        top=bounds[i]; bot=bounds[i+1]
        clip=f"polygon({(100-top)/2:.1f}% 0,{(100+top)/2:.1f}% 0,{(100+bot)/2:.1f}% 100%,{(100-bot)/2:.1f}% 100%)"
        out+=f'<button class="fseg2" data-i="{i}" onclick="enableTo({i})" style="clip-path:{clip};-webkit-clip-path:{clip}">{name}</button>'
    return out

def art_findings():
    return ('<div class="fnd"><span class="fdot n"></span>Cases logged across 3 systems; originating branch often lost.</div>'
            '<div class="fnd"><span class="fdot a"></span>No single owner for follow-up after the call.</div>'
            '<div class="fnd"><span class="fdot r"></span>Gap: no SLA on response time.</div>')
def art_stories():
    return ('<div class="mstory"><span class="sk">US-118</span><b2>Member case intake</b2><p><b>As a</b> rep, <b>I want</b> one screen <b>so that</b> nothing falls through.</p></div>'
            '<div class="mstory"><span class="sk">US-119</span><b2>Route to branch</b2><p><b>As a</b> manager, <b>I want</b> cases in my queue.</p></div>')
def art_design():
    return ('<div class="drow"><span class="dl">UI</span><span class="dr">Lightning page + quick action</span></div>'
            '<div class="drow"><span class="dl">Automation</span><span class="dr">Flow routing, no Apex</span></div>'
            '<div class="drow"><span class="dl">Data</span><span class="dr">Case + Branch lookup</span></div>'
            '<div class="drow"><span class="dl">Integration</span><span class="dr">Platform event to core</span></div>')
def art_wire():
    return ('<div class="wf"><div class="wt"><span class="wo">CASE</span><span class="wtt">New Member Case</span></div>'
            '<div class="wff"><div class="wfi"><span>Subject</span><div class="bx"></div></div><div class="wfi"><span>Member</span><div class="bx"></div></div>'
            '<div class="wfi"><span>Case Type</span><div class="bx"></div></div><div class="wfi warn"><span>Branch <em>req</em></span><div class="bx"></div></div>'
            '<div class="wfi full"><span>Description</span><div class="bx" style="height:20px"></div></div></div></div>')
def art_tests():
    return ('<div class="tc"><b>TC-01</b>All fields &rarr; routed to queue</div>'
            '<div class="tc"><b>TC-02</b>No branch &rarr; blocked, error</div>'
            '<div class="tc"><b>TC-03</b>Duplicate &rarr; warn, override</div>'
            '<div class="tc"><b>TC-04</b>SLA breach &rarr; escalates</div>')
PIPE=[
 {"stage":"Discovery","frm":"Workshop notes","gen":["Reading workshop notes…","Clustering needs…","Flagging gaps…"],"art":art_findings()},
 {"stage":"User stories","frm":"Discovery findings","gen":["Splitting into stories…","Writing acceptance criteria…"],"art":art_stories()},
 {"stage":"Solution design","frm":"User stories","gen":["Selecting components…","Designing the data model…"],"art":art_design()},
 {"stage":"Wireframe","frm":"Solution design","gen":["Choosing Lightning components…","Rendering the screen…"],"art":art_wire()},
 {"stage":"Test cases","frm":"Wireframe + stories","gen":["Deriving scenarios…","Writing expected results…"],"art":art_tests()},
]
PIPE_JSON=json.dumps(PIPE)

SL=[]
SL.append(f'''<div class="slide dark active" data-i="0"><div class="cover">
<div class="l"><img class="logo" src="{WHITE}" alt="Zennify" style="margin-bottom:auto">
<span class="eyebrow rv">AI-advanced delivery</span>
<h1 class="rv">Your teams, delivering on an AI value chain.</h1>
<p class="sub rv">We reapply the skills, agents, and processes proven across our delivery work, and enable them inside your teams&rsquo; own implementation lifecycle, one part at a time.</p>
<div class="tagrow rv"><span class="tag">Financial services</span><span class="tag">Your delivery lifecycle</span><span class="tag">Zennify Accelerate</span></div>
</div><div class="r"><img src="{idk('Route.png')}" style="width:120px;height:120px;opacity:.9"></div>
</div></div>''')
SL.append(f'''<div class="slide" data-i="1"><div class="pad">
<span class="eyebrow rv">What changed</span>
<h1 class="rv">AI moved from pilot to production inside delivery.</h1>
<p class="lead rv">The question for your teams is no longer whether to use AI on an implementation. It is whether each part of your delivery lifecycle is set up to use it well, on your data and under your controls.</p>
<div class="cols2 rv">
<div class="card out"><img class="ico" src="{idk('Puzzle.png')}"><div class="ch">Point tools, in isolation</div><p>An assistant here, a script there, used by whoever knows about them. Effort goes up. Consistency across your teams does not.</p></div>
<div class="card acc"><img class="ico" src="{idk('Route.png')}"><div class="ch">Enabled across the lifecycle</div><p>Proven skills, agents, and processes enabled part by part inside your teams&rsquo; existing process, and measured on your platform.</p></div>
</div></div>{foot()}</div>''')
SL.append(f'''<div class="slide" data-i="2"><div class="pad">
<span class="eyebrow rv">Where the time goes</span>
<h1 class="rv">Run the old way, each stage quietly costs your teams.</h1>
<div class="grid3 rv">
<div class="gc"><img class="ico" src="{idk('Zoom_In.png')}"><b>Discovery drags</b><span>It takes weeks to turn workshops into a build-ready, traceable backlog.</span></div>
<div class="gc"><img class="ico" src="{idk('Git_Branch.png')}"><b>Rework piles up</b><span>Requirements drift from design drift from build, and it surfaces late.</span></div>
<div class="gc"><img class="ico" src="{idk('Chart_Bar.png')}"><b>Status is hard to see</b><span>Leadership learns about risk when it is already expensive to fix.</span></div>
</div>
<p class="lead rv">None of this is an AI problem. It is where AI, enabled inside your process, helps your teams most.</p>
</div>{foot()}</div>''')
SL.append(f'''<div class="slide dark" data-i="3"><div class="pad">
<span class="eyebrow rv">How we work</span>
<h1 class="rv">We enable each part of your funnel. We don&rsquo;t replace your teams.</h1>
<p class="lead rv">This is not a rip-and-replace, or another tool for your people to learn on their own. We bring proven skills, agents, and processes, and enable them stage by stage inside your existing delivery lifecycle, on your platform and under your governance.</p>
<div class="beliefs rv">
<div class="belief"><span class="n">1</span><p>We enable your process. We don&rsquo;t replace it.</p></div>
<div class="belief"><span class="n">2</span><p>We start where the constraint is, and enable one part at a time.</p></div>
<div class="belief"><span class="n">3</span><p>Everything runs, and is measured, on your own platform.</p></div>
</div>
</div>{foot(True)}</div>''')
SL.append(f'''<div class="slide" data-i="4"><div class="pad">
<span class="eyebrow">Your delivery funnel</span>
<h1 style="font-size:32px">We enable each part, one at a time.</h1>
<div class="enfun">
<div style="display:flex;flex-direction:column"><div class="funnel2" id="funnel2">{funnel_segs()}</div>
<button class="enbtn" id="enbtn" onclick="enableNext()">Enable first stage &rarr;</button></div>
<div><div class="endesc-state" id="en-state">Today</div>
<p id="en-line">Each part of your delivery funnel runs mostly by hand today. Enable a stage to see how AI opens the flow, one part at a time.</p></div>
</div>
</div>{foot()}</div>''')
SL.append(f'''<div class="slide" data-i="5"><div class="pad">
<span class="eyebrow">One part feeds the next</span>
<h1 style="font-size:30px">Enable a stage, and its output feeds the next.</h1>
<div class="pipehdr" id="pipehdr"></div>
<div class="flowvp"><div class="flow" id="flow"></div></div>
<div class="pctrl"><button class="replay" id="replayBtn" onclick="playPipe(true)">&#9654; Replay the flow</button><span class="hint">Discovery findings become stories, stories become design, design becomes a screen, then tests. One motion, inside your process.</span></div>
</div>{foot()}</div>''')
SL.append(f'''<div class="slide" data-i="6"><div class="pad">
<span class="eyebrow rv">The proof</span>
<h1 class="rv">Measured on Salesforce, not asserted on a slide.</h1>
<div class="proofs rv">
<div class="proof"><div class="ba"><span class="b">~5%</span><span class="ar">&rarr;</span><span class="a">~1%</span></div>
<div class="t"><b>Estimate variance</b><span>Delivery effort predicted far more accurately</span><span class="meas">MEASURED &middot; SALESFORCE</span></div></div>
<div class="proof"><div class="ba"><span class="b">56.7%</span><span class="ar">&rarr;</span><span class="a">57.1%</span></div>
<div class="t"><b>Delivered margin</b><span>An AI-run engagement delivering above what was sold</span><span class="meas">MEASURED &middot; SALESFORCE</span></div></div>
</div>
<p class="honest rv">These are from engagements we have run. Everything else we would show your teams as a directional estimate, clearly labelled, until your own data measures it.</p>
</div>{foot()}</div>''')
SL.append(f'''<div class="slide" data-i="7"><div class="pad">
<span class="eyebrow rv">What we enable</span>
<h1 class="rv">Proven capability, inside your teams&rsquo; process.</h1>
<p class="lead rv" style="margin-top:10px">We enable your teams to run implementations on an AI value chain: proven skills, agents, and processes, configured to your lifecycle and governed on your platform.</p>
<div class="offer rv">
<div><div class="subh acc">What we bring</div>
<ul class="olist"><li>The delivery value chain, enabled inside your teams&rsquo; existing process.</li><li>A working set of skills and agents, configured on your org.</li><li>Your teams enabled to run the motion themselves.</li><li>A baseline on one engagement, measured on your data.</li></ul></div>
<div style="display:flex;flex-direction:column"><div class="subh">Explicitly out of scope</div>
<ul class="olist no"><li>Bespoke model training.</li><li>A rip-and-replace of your platform.</li><li>Anything we can&rsquo;t measure or govern.</li></ul>
<div class="startchip"><b>Start here</b><p>Enable one part of the funnel on an active engagement.</p></div></div>
</div>
</div>{foot()}</div>''')
SL.append(f'''<div class="slide" data-i="8"><div class="pad">
<span class="eyebrow rv">Is this you?</span>
<h1 class="rv">Built for teams ready to modernize how they deliver.</h1>
<div class="cols2 rv" style="margin-top:20px">
<div class="card acc"><div class="ch">Ideal fit</div>
<ul class="olist"><li>On, or moving to, Salesforce as the system of record.</li><li>A pipeline of implementations, not a one-off project.</li><li>Delivery leaders frustrated by rework and inconsistency.</li><li>Governance and audit requirements to satisfy.</li></ul></div>
<div class="card out"><div class="ch">Not the fit</div>
<ul class="olist no"><li>Looking for a single AI feature or chatbot.</li><li>No appetite to measure outcomes on your own data.</li><li>Off-platform with no plan to consolidate.</li></ul></div>
</div></div>{foot()}</div>''')
SL.append(f'''<div class="slide" data-i="9"><div class="pad">
<span class="eyebrow rv">The next step</span>
<h1 class="rv">Enable one part first.</h1>
<div class="steps rv">
<div class="pstep"><div class="pn">STEP 1</div><b>Focus</b><span>Together we find the part of your funnel where the constraint costs your teams the most.</span></div>
<div class="pstep"><div class="pn">STEP 2</div><b>Enable</b><span>We enable that stage with proven skills and agents, on your platform and in your process.</span></div>
<div class="pstep"><div class="pn">STEP 3</div><b>Reapply</b><span>Your teams reapply the motion across the rest of the funnel, at your pace.</span></div>
</div>
<p class="lead rv" style="margin-top:22px">One part in, your teams have a defensible read on where AI helps delivery, and a motion they can repeat.</p>
</div>{foot()}</div>''')
SL.append(f'''<div class="slide dark close" data-i="10"><div class="pad" style="justify-content:center">
<img class="logo rv" src="{WHITE}" alt="Zennify" style="margin-bottom:26px">
<span class="eyebrow rv">Zennify Accelerate</span>
<h1 class="rv">Every part of your funnel, enabled.</h1>
<p class="lead rv">Let&rsquo;s enable the part of your delivery lifecycle where it matters most, and prove it on your data.</p>
<span class="cta rv">Enable one part of your funnel</span>
</div>{foot(True)}</div>''')

N=len(SL)
dots="".join(f'<span class="dot {"on" if i==0 else ""}" onclick="go({i})"></span>' for i in range(N))
FLOW_SLIDE=5

JS=f"""
const N={N};let cur=0;
const slides=[...document.querySelectorAll('.slide')];
function scaleSlides(){{const s=Math.min(innerWidth/960,innerHeight/540);slides.forEach(x=>x.style.transform=`scale(${{s}})`);}}
addEventListener('resize',scaleSlides);scaleSlides();
function render(){{
 slides.forEach((s,i)=>s.classList.toggle('active',i===cur));
 document.querySelectorAll('.dot').forEach((d,i)=>d.classList.toggle('on',i===cur));
 document.getElementById('count').textContent=(cur+1)+' / '+N;
 document.getElementById('prog').style.width=((cur+1)/N*100)+'%';
 if(cur==={FLOW_SLIDE}) playPipe(false);
}}
function go(n){{cur=Math.max(0,Math.min(N-1,n));render();}}
function next(){{go(cur+1);}}function prev(){{go(cur-1);}}
addEventListener('keydown',e=>{{if(e.key==='ArrowRight'||e.key===' '){{e.preventDefault();next();}}if(e.key==='ArrowLeft')prev();}});
// enable funnel
const STAGES2={STAGES2_JSON};const ENDESC={ENDESC_JSON};const EN=STAGES2.length;let enabled=0;
function paintFunnel(){{
 document.querySelectorAll('#funnel2 .fseg2').forEach((b,i)=>{{b.classList.toggle('on',i<enabled-1);b.classList.toggle('cur',i===enabled-1);}});
 const st=document.getElementById('en-state'),ln=document.getElementById('en-line'),btn=document.getElementById('enbtn');
 if(enabled===0){{st.textContent='Today';ln.textContent='Each part of your delivery funnel runs mostly by hand today. Enable a stage to see how AI opens the flow, one part at a time.';btn.textContent='Enable first stage →';}}
 else if(enabled>=EN){{st.textContent='Fully enabled';ln.textContent='Every part of your funnel is AI-enabled, end to end, on your platform and under your governance.';btn.textContent='↻ Reset';}}
 else {{st.textContent=STAGES2[enabled-1]+' · enabled';ln.textContent=ENDESC[enabled-1];btn.textContent='Enable next stage →';}}
}}
function enableNext(){{enabled=enabled>=EN?0:enabled+1;paintFunnel();}}
function enableTo(i){{enabled=i+1;paintFunnel();}}
paintFunnel();
// flowing pipeline
const PIPE={PIPE_JSON};let pipeTimers=[],pipeStarted=false;
function clearPipe(){{pipeTimers.forEach(t=>{{if(typeof t==='number')clearTimeout(t);}});pipeTimers=[];}}
function renderHdr(c){{
 document.getElementById('pipehdr').innerHTML=PIPE.map((p,i)=>{{
  const cls=i<c?'done':i===c?'cur':'';const arrow=i<PIPE.length-1?'<span class=parrow>&rsaquo;</span>':'';
  return `<span class="ppill ${{cls}}"><span class=pd></span>${{p.stage}}</span>${{arrow}}`;
 }}).join('');
}}
function scrollFlow(i){{document.getElementById('flow').style.transform=`translateX(${{-Math.max(0,i*294-560)}}px)`;}}
function playPipe(force){{
 if(pipeStarted&&!force)return;pipeStarted=true;clearPipe();
 const flow=document.getElementById('flow');flow.innerHTML='';flow.style.transform='translateX(0)';renderHdr(0);
 let i=0;
 function step(){{
  if(i>=PIPE.length){{renderHdr(PIPE.length);return;}}
  const p=PIPE[i];
  if(i>0)flow.insertAdjacentHTML('beforeend','<div class="parrw"><span>&rarr;</span></div>');
  flow.insertAdjacentHTML('beforeend',
   `<div class="pcard" id="pc${{i}}"><div class="pch"><div class="pcs">${{p.stage}}</div><div class="pcf">from <b>${{p.frm}}</b></div></div>`+
   `<div class="pcbody"><div class="pcgen"><span class="spin"></span><span class="gtxt" id="gt${{i}}">${{p.gen[0]}}</span></div></div></div>`);
  renderHdr(i);scrollFlow(i);
  let g=0;const gt=document.getElementById('gt'+i);
  const tick=setInterval(()=>{{g++;if(g<p.gen.length)gt.textContent=p.gen[g];}},560);
  pipeTimers.push(setTimeout(()=>{{clearInterval(tick);document.getElementById('pc'+i).querySelector('.pcbody').innerHTML=p.art;i++;pipeTimers.push(setTimeout(step,650));}},p.gen.length*560+250));
 }}
 step();
}}
render();
"""

HTML=f'''<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Zennify &middot; AI-Advanced Delivery</title><style>{CSS}</style></head>
<body><div class="prog" id="prog"></div><div id="deck">{"".join(SL)}</div>
<div class="nav"><button onclick="prev()">&#8249;</button><div class="dots">{dots}</div><button onclick="next()">&#8250;</button><span class="count" id="count">1 / {N}</span></div>
<script>{JS}</script></body></html>'''
open("delivery.html","w").write(HTML)
print("wrote delivery.html",len(HTML),"bytes,",N,"slides")
