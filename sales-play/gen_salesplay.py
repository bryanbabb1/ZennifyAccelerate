# Immersive Zennify sales-play deck: "AI-Accelerated Implementation".
# Self-contained HTML: embedded DM Sans + logos + icons, vanilla-JS slide deck,
# interactive lifecycle rail + live generate-it worked example. Generalized (FSI).
import base64, os

SK = "/root/.claude/skills/synced/zennify-html-artifacts"
FONTS = f"{SK}/assets/fonts"; LOGOS = f"{SK}/assets/logos"; ICONS = f"{SK}/assets/icons"

def b64(path):
    with open(path, "rb") as f: return base64.b64encode(f.read()).decode()

def font_css():
    faces = [("DMSans-regular.ttf","400","normal"),("DMSans-italic.ttf","400","italic"),
             ("DMSansMedium-regular.ttf","500","normal"),("DMSans-bold.ttf","700","normal")]
    css=""
    for fn,w,st in faces:
        css+=f"@font-face{{font-family:'DM Sans';font-weight:{w};font-style:{st};src:url('data:font/truetype;base64,{b64(f'{FONTS}/{fn}')}') format('truetype')}}\n"
    return css

def logo(fn): return f"data:image/png;base64,{b64(f'{LOGOS}/{fn}')}"
def icon(variant, fn): return f"data:image/png;base64,{b64(f'{ICONS}/{variant}/{fn}')}"

WHITE, DARK, BADGE = logo("zennify_logo_white.png"), logo("zennify_logo_dark.png"), logo("zennify_badge.png")
def il(fn): return icon("light", fn)   # for dark backgrounds
def idk(fn): return icon("dark", fn)   # for light backgrounds

TOKENS = """:root{
--z-dark:#1C4A4D;--z-teal:#27BBAF;--z-teal-light:#62D7B8;--z-mint:#B0EDD3;
--z-white:#FFFFFF;--z-lt:#F2F4F9;--z-ice:#E8F7F6;--z-orange:#FE9732;--z-blue:#3D81F6;
--z-slate:#8094C0;--z-purple:#B19CD8;--z-purple-lt:#C7D3EC;
--z-font:'DM Sans',system-ui,sans-serif;--z-radius:6px;--z-radius-sm:4px;}
"""

CSS = font_css() + TOKENS + r"""
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{width:100%;height:100%;background:#0e2a2c;overflow:hidden;font-family:var(--z-font);color:var(--z-dark)}
#deck{position:relative;width:100vw;height:100vh;display:flex;align-items:center;justify-content:center}
.slide{position:absolute;width:960px;height:540px;overflow:hidden;display:none;flex-direction:column;background:var(--z-white);transform-origin:center center}
.slide.active{display:flex}
.slide.dark{background:var(--z-dark);color:#fff}
.pad{padding:40px 48px;flex:1;display:flex;flex-direction:column;min-height:0}
.eyebrow{font-size:11px;font-weight:700;letter-spacing:1.7px;text-transform:uppercase;color:var(--z-teal)}
.slide.dark .eyebrow{color:var(--z-teal-light)}
h1{font-size:40px;font-weight:700;line-height:1.06;letter-spacing:-.5px;color:var(--z-dark)}
.slide.dark h1{color:#fff}
h2{font-size:27px;font-weight:700;line-height:1.14;color:var(--z-dark);margin-top:10px}
.slide.dark h2{color:#fff}
.lead{font-size:15px;line-height:1.55;color:var(--z-slate);margin-top:14px;max-width:660px}
.slide.dark .lead{color:rgba(255,255,255,.82)}
.logo{height:26px;width:auto;align-self:flex-start}
.foot{display:flex;justify-content:space-between;align-items:center;padding:9px 22px;border-top:1px solid var(--z-purple-lt)}
.slide.dark .foot{border-top-color:rgba(255,255,255,.1)}
.foot .c{font-size:9px;color:var(--z-slate);letter-spacing:.3px}.slide.dark .foot .c{color:rgba(255,255,255,.4)}
.foot img{height:18px;width:18px}
/* reveals */
.rv{opacity:0;transform:translateY(12px)}
.slide.active .rv{animation:rv .5s cubic-bezier(.22,.8,.28,1) forwards}
.slide.active .rv:nth-child(2){animation-delay:.05s}.slide.active .rv:nth-child(3){animation-delay:.12s}
.slide.active .rv:nth-child(4){animation-delay:.19s}.slide.active .rv:nth-child(5){animation-delay:.26s}
.slide.active .rv:nth-child(6){animation-delay:.33s}
@keyframes rv{to{opacity:1;transform:none}}
.d1{animation-delay:.1s}.d2{animation-delay:.2s}.d3{animation-delay:.3s}.d4{animation-delay:.4s}
/* nav */
.nav{position:fixed;bottom:16px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:14px;z-index:50;background:rgba(28,74,77,.9);border-radius:30px;padding:8px 16px}
.nav button{background:none;border:none;color:#fff;font-size:16px;cursor:pointer;width:24px;height:24px;line-height:1;opacity:.85}
.nav button:hover{opacity:1}
.dots{display:flex;gap:6px}
.dot{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.3);cursor:pointer}
.dot.on{background:var(--z-teal-light)}
.count{font-size:11px;color:rgba(255,255,255,.7);font-weight:500;min-width:38px;text-align:center}
.prog{position:fixed;top:0;left:0;height:3px;background:var(--z-teal);z-index:60;transition:width .3s}
/* cover */
.cover{display:grid;grid-template-columns:1.15fr .85fr;height:100%}
.cover .l{background:var(--z-dark);color:#fff;padding:48px;display:flex;flex-direction:column}
.cover .r{background:var(--z-ice);display:flex;align-items:center;justify-content:center;padding:34px}
.cover h1{color:#fff;font-size:38px;margin-top:auto}
.cover .sub{color:rgba(255,255,255,.82);font-size:15px;line-height:1.55;margin-top:16px;max-width:440px}
.cover .tagrow{display:flex;gap:8px;margin-top:24px}
.tag{font-size:10px;font-weight:700;letter-spacing:.5px;padding:4px 10px;border-radius:var(--z-radius-sm);background:rgba(255,255,255,.12);color:var(--z-teal-light)}
/* two-col compare */
.cols2{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:22px}
.card{background:var(--z-lt);border-radius:var(--z-radius);padding:20px 22px}
.card.out{background:var(--z-white);border:1px solid var(--z-purple-lt)}
.card .ch{font-size:11px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;color:var(--z-slate);margin-bottom:10px}
.card.acc .ch{color:var(--z-teal)}
.card p{font-size:13px;line-height:1.5;color:var(--z-dark)}
.card .ico{width:26px;height:26px;margin-bottom:12px}
/* cost cards */
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:22px}
.gc{background:var(--z-lt);border-radius:var(--z-radius);padding:18px 20px}
.gc .ico{width:24px;height:24px;margin-bottom:10px}
.gc b{font-size:14px;display:block;color:var(--z-dark);margin-bottom:5px}
.gc span{font-size:12px;line-height:1.45;color:var(--z-slate)}
/* POV beliefs */
.beliefs{display:flex;flex-direction:column;gap:9px;margin-top:20px}
.belief{display:flex;gap:12px;align-items:flex-start;background:rgba(255,255,255,.06);border-radius:var(--z-radius);padding:13px 16px}
.belief .n{font-size:15px;font-weight:700;color:var(--z-teal-light);flex:none;width:22px}
.belief p{font-size:14px;line-height:1.4;color:#fff}
.notdo{margin-top:16px;font-size:13px;color:rgba(255,255,255,.75);line-height:1.5}
.notdo b{color:var(--z-orange)}
/* lifecycle rail */
.raillab{font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--z-slate);margin:14px 0 7px}
.rail{display:flex;gap:6px}
.sbtn{flex:1;background:var(--z-lt);border:1px solid transparent;border-radius:var(--z-radius);padding:8px 7px;cursor:pointer;text-align:left;transition:all .15s}
.sbtn:hover{border-color:var(--z-teal)}
.sbtn.on{background:var(--z-dark)}
.sbtn .sc{font-size:11px;font-weight:700;color:var(--z-teal)}.sbtn.on .sc{color:var(--z-teal-light)}
.sbtn .sn{font-size:10px;color:var(--z-dark);margin-top:2px;line-height:1.2}.sbtn.on .sn{color:#fff}
.sdetail{display:grid;grid-template-columns:300px 1fr;gap:18px;margin-top:16px;flex:1;min-height:0}
.sdcard{background:var(--z-dark);color:#fff;border-radius:var(--z-radius);padding:20px 22px}
.sdcard .st{font-size:10px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;color:var(--z-teal-light)}
.sdcard h3{font-size:19px;color:#fff;margin:8px 0 10px;line-height:1.15}
.sdcard p{font-size:12.5px;color:rgba(255,255,255,.82);line-height:1.5}
.sdcard .impact{margin-top:16px;padding-top:14px;border-top:1px solid rgba(255,255,255,.12)}
.sdcard .impact .in{font-size:22px;font-weight:700;color:var(--z-teal-light);line-height:1}
.sdcard .impact .il{font-size:11px;color:rgba(255,255,255,.6);margin-top:4px}
.scaps{display:flex;flex-direction:column;gap:9px}
.scap{background:var(--z-white);border:1px solid var(--z-purple-lt);border-radius:var(--z-radius);padding:11px 14px}
.scap b{font-size:13px;color:var(--z-dark)}
.scap span{font-size:11.5px;color:var(--z-slate);display:block;margin-top:2px;line-height:1.4}
/* gen worked example */
.genwrap{display:grid;grid-template-columns:270px 1fr;gap:18px;margin-top:18px;flex:1;min-height:0}
.geninput{background:var(--z-lt);border-radius:var(--z-radius);padding:16px 18px;display:flex;flex-direction:column}
.geninput .il{font-size:10px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:var(--z-slate);margin-bottom:8px}
.geninput .note{font-size:13px;line-height:1.5;color:var(--z-dark);font-style:italic}
.gensteps{margin-top:14px;display:flex;flex-direction:column;gap:8px}
.gstep{display:flex;gap:8px;align-items:center;font-size:12px;color:var(--z-slate)}
.gstep.on{color:var(--z-dark);font-weight:600}.gstep.done{color:var(--z-dark)}
.gstep .gi{width:14px;flex:none;color:var(--z-teal);font-weight:700}
.spin{width:13px;height:13px;border-radius:50%;border:2px solid rgba(39,187,175,.3);border-top-color:var(--z-teal);animation:sp .7s linear infinite;display:inline-block}
@keyframes sp{to{transform:rotate(360deg)}}
.genout{background:var(--z-white);border:1px solid var(--z-purple-lt);border-radius:var(--z-radius);padding:16px;overflow:hidden;display:flex;flex-direction:column;gap:11px}
.genart{opacity:0;transform:translateY(8px)}
.genart.show{animation:rv .5s cubic-bezier(.22,.8,.28,1) forwards}
.scard{background:var(--z-ice);border-radius:var(--z-radius);padding:12px 14px}
.scard .sh{font-size:13px;font-weight:700;color:var(--z-dark);display:flex;align-items:center;gap:8px}
.scard .sk{font-size:10px;font-weight:700;color:#fff;background:var(--z-teal);border-radius:var(--z-radius-sm);padding:2px 7px}
.scard .story{font-size:12px;line-height:1.5;color:var(--z-dark);margin:8px 0}.scard .story b{color:var(--z-teal)}
.scard ul{list-style:none;display:flex;flex-direction:column;gap:4px}
.scard li{position:relative;padding-left:14px;font-size:11px;line-height:1.35;color:var(--z-dark)}
.scard li::before{content:'\2713';position:absolute;left:0;color:var(--z-teal);font-weight:700;font-size:10px}
.mini{background:var(--z-white);border:1px solid var(--z-purple-lt);border-radius:var(--z-radius);overflow:hidden}
.mini .mt{display:flex;align-items:center;gap:7px;padding:8px 11px;border-bottom:1px solid var(--z-purple-lt)}
.mini .mo{font-size:8px;font-weight:700;color:#fff;background:#0176d3;border-radius:3px;padding:2px 5px}
.mini .mtt{font-size:11px;font-weight:700;color:var(--z-dark)}
.mini .mf{display:grid;grid-template-columns:1fr 1fr;gap:8px 12px;padding:11px}
.mini .mfi span{font-size:8.5px;color:var(--z-slate);display:block}.mini .mfi span em{font-style:normal;color:var(--z-orange);font-weight:700}
.mini .mfi .box{height:13px;border:1px solid var(--z-purple-lt);border-radius:3px;background:#fbfcfe;margin-top:2px}
.mini .mfi.warn .box{border-color:var(--z-orange);background:#fff7ef}.mini .mfi.full{grid-column:1/-1}
/* proof */
.proofs{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:22px}
.proof{background:var(--z-lt);border-radius:var(--z-radius);padding:22px 24px;display:flex;align-items:center;gap:20px}
.proof .ba{display:flex;align-items:baseline;gap:10px}
.proof .b{font-size:34px;font-weight:700;color:var(--z-orange);line-height:1}
.proof .ar{font-size:20px;color:var(--z-slate)}
.proof .a{font-size:34px;font-weight:700;color:var(--z-teal);line-height:1}
.proof .t b{font-size:14px;color:var(--z-dark);display:block}
.proof .t span{font-size:11px;color:var(--z-slate)}
.proof .meas{font-size:9px;font-weight:700;letter-spacing:.3px;color:#1C6B3A;margin-top:5px;display:block}
.honest{margin-top:16px;font-size:12px;color:var(--z-slate);line-height:1.5;font-style:italic}
/* offer / fit two-col lists */
.offer{display:grid;grid-template-columns:1.2fr .8fr;gap:18px;margin-top:20px}
.olist{list-style:none;display:flex;flex-direction:column;gap:8px}
.olist li{position:relative;padding-left:16px;font-size:12.5px;line-height:1.45;color:var(--z-dark)}
.olist li::before{content:'\25CF';position:absolute;left:0;top:5px;font-size:6px;color:var(--z-teal)}
.olist.no li::before{content:'\2715';color:var(--z-slate);font-size:9px;top:2px}
.subh{font-size:11px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;color:var(--z-slate);margin-bottom:10px}
.subh.acc{color:var(--z-teal)}
.startchip{margin-top:auto;background:var(--z-dark);color:#fff;border-radius:var(--z-radius);padding:14px 16px}
.startchip b{color:var(--z-teal-light);font-size:11px;letter-spacing:.5px;text-transform:uppercase}
.startchip p{font-size:14px;margin-top:5px;color:#fff;line-height:1.35}
/* path steps */
.steps{display:flex;gap:10px;margin-top:24px}
.pstep{flex:1;background:var(--z-lt);border-radius:var(--z-radius);padding:18px 18px;position:relative}
.pstep .pn{font-size:11px;font-weight:700;color:var(--z-teal);letter-spacing:.5px}
.pstep b{font-size:15px;display:block;margin:7px 0 6px;color:var(--z-dark)}
.pstep span{font-size:12px;color:var(--z-slate);line-height:1.45}
/* close */
.close{align-items:flex-start;justify-content:center}
.close h1{font-size:38px;max-width:680px}
.close .cta{margin-top:26px;display:inline-block;background:var(--z-teal);color:#fff;font-size:14px;font-weight:700;border-radius:var(--z-radius);padding:14px 26px}
"""

def foot(dark=False):
    return f'<div class="foot"><span class="c">&copy; 2026 Zennify &middot; Confidential &middot; AI-Accelerated Implementation</span><img src="{BADGE}" alt="Zennify"></div>'

# ---- lifecycle data (generalized) ----
STAGES = [
 ("S1","Qualify","Sales","Qualify the right opportunities",
  "Account intelligence and maturity signals focus effort on the initiatives worth pursuing, with a prescriptive point of view from the first conversation.",
  "~90%","less pre-call prep",
  [("Account Intelligence","A briefing on the institution, its signals, and the whitespace, in minutes."),
   ("Digital Maturity Assessment","An objective, scored read of where they stand and what to do next.")]),
 ("S3","Solution & Proposal","Sales","Propose with precision",
  "Discovery becomes a defensible, precisely-scoped proposal in days, not weeks, grounded in a real estimate.",
  "40 → 14 days","opportunity to proposal (measured)",
  [("Pre-Sales Factory","Turns discovery into a defensible proposal on a consistent basis."),
   ("Estimating Factory","A workstream estimate with confidence bands, within ~1% of actuals.")]),
 ("D2","Discovery","Delivery","Discovery that diagnoses",
  "Structured discovery maps every real need to a capability and a story, so scope is grounded in evidence, not a wish-list.",
  "~75%","faster requirements",
  [("Business Requirements Document","Workshops become a complete, traceable requirements document."),
   ("Story & Design Writer","A build-ready user story and an editable Salesforce wireframe.")]),
 ("D3","Sprint 0","Delivery","Design once, build with confidence",
  "A build-ready solution and architecture are set before the first sprint, so development starts with answers, not open questions.",
  "~70%","faster design",
  [("Solution Design","A build-ready blueprint your team can develop against."),
   ("Data Model Advisor","Defensible schema decisions, with risks flagged before they cost you.")]),
 ("D4","Build","Delivery","Build faster, review tighter",
  "AI-assisted development, stories, and QA accelerate the build while holding the quality line.",
  "~80%","less effort on stories & tests",
  [("QA Test Writer","Executable test cases generated straight from the stories."),
   ("Sprint Recap","A branded, data-backed recap the client gets every sprint.")]),
 ("D5","UAT","Delivery","Prove it works",
  "Testing turns go-live from a leap of faith into an evidence-based go/no-go.",
  "~75%","faster UAT setup",
  [("Test Strategy & UAT Plan","Coverage, entry/exit criteria, and a clear go/no-go gate."),
   ("Weekly Status Report","Live status, risks, and asks, drawn from your own systems.")]),
 ("D7","Go-Live","Delivery","Go live without surprises",
  "Runbooks, cutover, and hypercare make go-live a controlled, rehearsed event.",
  "~70%","faster cutover prep",
  [("Deployment Runbook","A minute-by-minute cutover plan with rollback triggers."),
   ("Live Project Overview Dashboard","One always-current view of program health.")]),
 ("D8","Close & grow","Delivery","Sustain and grow the value",
  "A BAU operating model and QBRs keep the platform improving after launch, so value compounds.",
  "~80%","faster QBR & close-out",
  [("Quarterly Business Review","Outcomes, adoption, and the forward roadmap, framed for the sponsor."),
   ("Change Management & Enablement Plan","Turns a launch into real, measured adoption.")]),
]

import json
STAGE_JSON = json.dumps([{"code":s[0],"name":s[1],"phase":s[2],"title":s[3],"desc":s[4],
    "stat":s[5],"statl":s[6],"caps":[{"n":c[0],"d":c[1]} for c in s[7]]} for s in STAGES])

def rail_buttons():
    out=""
    for i,s in enumerate(STAGES):
        on="on" if i==0 else ""
        out+=f'<button class="sbtn {on}" data-i="{i}" onclick="pickStage({i})"><div class="sc">{s[0]}</div><div class="sn">{s[1]}</div></button>'
    return out

# ---------------- SLIDES ----------------
SL = []

# 1 cover
SL.append(f'''<div class="slide dark active" data-i="0"><div class="cover">
<div class="l"><img class="logo" src="{WHITE}" alt="Zennify" style="margin-bottom:auto">
<span class="eyebrow rv">Sales play</span>
<h1 class="rv">Run your next implementation on an AI value chain.</h1>
<p class="sub rv">The skills, agents, and processes Zennify uses to deliver, reapplied inside your institution&rsquo;s own lifecycle, from first conversation to long after go-live.</p>
<div class="tagrow rv"><span class="tag">Financial services</span><span class="tag">Sales &amp; delivery</span><span class="tag">Zennify Accelerate</span></div>
</div>
<div class="r"><img src="{idk('Route.png')}" style="width:120px;height:120px;opacity:.9"></div>
</div></div>''')

# 2 what changed
SL.append(f'''<div class="slide" data-i="1"><div class="pad">
<span class="eyebrow rv">What changed</span>
<h1 class="rv">AI moved from pilot to production in financial services.</h1>
<p class="lead rv">The question is no longer whether to use AI in an implementation. It is whether your delivery model is built to compound it, at every stage, on your data, under your controls.</p>
<div class="cols2 rv">
<div class="card out"><img class="ico" src="{idk('Puzzle.png')}"><div class="ch">The bolt-on era</div><p>Isolated pilots and point tools, toggled on by individual teams. Activity goes up. Outcomes, and proof, do not.</p></div>
<div class="card acc"><img class="ico" src="{idk('Route.png')}"><div class="ch">The value-chain era</div><p>A coordinated chain of skills, agents, and processes that spans sales through delivery, reapplied to every engagement and measured on your platform.</p></div>
</div></div>{foot()}</div>''')

# 3 cost of waiting
SL.append(f'''<div class="slide" data-i="2"><div class="pad">
<span class="eyebrow rv">The cost of waiting</span>
<h1 class="rv">Every stage run the old way is time and margin you don&rsquo;t get back.</h1>
<div class="grid3 rv">
<div class="gc"><img class="ico" src="{idk('Report_Money.png')}"><b>Proposals take weeks</b><span>Discovery-to-proposal drags while the deal cools and the competitor moves.</span></div>
<div class="gc"><img class="ico" src="{idk('Chart_Bar.png')}"><b>Estimates miss</b><span>Effort is guessed, not benchmarked, so scope and margin slip in delivery.</span></div>
<div class="gc"><img class="ico" src="{idk('Zoom_In.png')}"><b>Delivery is inconsistent</b><span>Quality rides on who is staffed, and the client feels the difference.</span></div>
</div>
<p class="lead rv">None of this is an AI problem. It is a delivery-model problem that AI, applied as a value chain, is now built to solve.</p>
</div>{foot()}</div>''')

# 4 POV (dark)
SL.append(f'''<div class="slide dark" data-i="3"><div class="pad">
<span class="eyebrow rv">Our point of view</span>
<h1 class="rv">Stop buying AI tools. Run your lifecycle as one accelerated value chain.</h1>
<p class="lead rv">The institutions that win will treat AI as an operating model that spans sales through delivery, governed and reapplied to every engagement, not a set of features their teams switch on. The advantage is not the model. It is the value chain around it.</p>
<div class="beliefs rv">
<div class="belief"><span class="n">1</span><p>The lifecycle, not the tool, is the unit of acceleration.</p></div>
<div class="belief"><span class="n">2</span><p>If it isn&rsquo;t measured on your own system of record, it isn&rsquo;t proof.</p></div>
<div class="belief"><span class="n">3</span><p>Consistency beats heroics: the same standard on every engagement.</p></div>
</div>
<p class="notdo rv"><b>What not to do:</b> launch another isolated pilot. A pilot that never reapplies across the lifecycle is a demo you paid for.</p>
</div>{foot(True)}</div>''')

# 5 the value chain overview
def chain_overview():
    sales=[s for s in STAGES if s[2]=="Sales"]; deliv=[s for s in STAGES if s[2]=="Delivery"]
    def chip(s): return f'<div class="sbtn" style="cursor:default"><div class="sc">{s[0]}</div><div class="sn">{s[1]}</div></div>'
    return (f'<div class="raillab">Sales &amp; pre-sales</div><div class="rail">{"".join(chip(s) for s in sales)}</div>'
            f'<div class="raillab">Delivery</div><div class="rail">{"".join(chip(s) for s in deliv)}</div>')
SL.append(f'''<div class="slide" data-i="4"><div class="pad">
<span class="eyebrow rv">The value chain</span>
<h1 class="rv">One coordinated chain, first conversation to long after go-live.</h1>
<p class="lead rv" style="margin-bottom:6px">Every stage of the engagement has AI capabilities working behind it. Reapplied to your lifecycle, the chain is the same, the content is yours.</p>
<div class="rv">{chain_overview()}</div>
</div>{foot()}</div>''')

# 6 interactive reapply
SL.append(f'''<div class="slide" data-i="5"><div class="pad">
<span class="eyebrow">Reapply to your lifecycle</span>
<h1 style="font-size:32px">Select a stage. See what accelerates it.</h1>
<div class="raillab">Your engagement</div>
<div class="rail" id="rail">{rail_buttons()}</div>
<div class="sdetail">
<div class="sdcard"><div class="st" id="sd-code">S1 &middot; Qualify</div><h3 id="sd-title"></h3><p id="sd-desc"></p>
<div class="impact"><div class="in" id="sd-stat"></div><div class="il" id="sd-statl"></div></div></div>
<div class="scaps" id="sd-caps"></div>
</div>
</div>{foot()}</div>''')

# 7 worked example (generate-it)
SL.append(f'''<div class="slide" data-i="6"><div class="pad">
<span class="eyebrow">See it in action</span>
<h1 style="font-size:30px">From a discovery note to a build-ready story and screen.</h1>
<div class="genwrap">
<div class="geninput">
<div class="il">Input &middot; discovery note</div>
<div class="note">&ldquo;When a member calls the branch about a problem, the rep opens three systems to log it, and the branch that took the call often never gets recorded.&rdquo;</div>
<div class="gensteps" id="gensteps"></div>
</div>
<div class="genout" id="genout"><div style="margin:auto;color:var(--z-slate);font-size:12px" id="genidle">Generating&hellip;</div></div>
</div>
</div>{foot()}</div>''')

# 8 proof
SL.append(f'''<div class="slide" data-i="7"><div class="pad">
<span class="eyebrow rv">The proof</span>
<h1 class="rv">Measured on Salesforce, not asserted on a slide.</h1>
<div class="proofs rv">
<div class="proof"><div class="ba"><span class="b">40</span><span class="ar">&rarr;</span><span class="a">14</span></div>
<div class="t"><b>Days to proposal</b><span>3&times; faster, new-business opportunities</span><span class="meas">MEASURED &middot; SALESFORCE</span></div></div>
<div class="proof"><div class="ba"><span class="b">~5%</span><span class="ar">&rarr;</span><span class="a">~1%</span></div>
<div class="t"><b>Estimate variance</b><span>4&times; tighter vs actuals</span><span class="meas">MEASURED &middot; SALESFORCE</span></div></div>
</div>
<p class="honest rv">Everything else in this play we show as a directional estimate, clearly labelled, until your own data measures it. The claim ceiling is deliberate: a number we can&rsquo;t defend is one your sellers shouldn&rsquo;t carry.</p>
</div>{foot()}</div>''')

# 9 offer
SL.append(f'''<div class="slide" data-i="8"><div class="pad">
<span class="eyebrow rv">The offer</span>
<h1 class="rv">What you get.</h1>
<p class="lead rv" style="margin-top:10px">A way to run your implementations on an AI-accelerated value chain: the skills, agents, and delivery playbook, configured to your lifecycle and governed on your platform.</p>
<div class="offer rv">
<div><div class="subh acc">Deliverables</div>
<ul class="olist"><li>A value-chain map fitted to your engagement lifecycle.</li><li>A working set of skills and agents, configured on your org.</li><li>Measured baselines for the stages that matter most to you.</li><li>Seller and delivery enablement, so it reapplies without us in the room.</li></ul></div>
<div style="display:flex;flex-direction:column"><div class="subh">Explicitly out of scope</div>
<ul class="olist no"><li>Bespoke model training.</li><li>A rip-and-replace of your platform.</li><li>Anything we can&rsquo;t measure or govern.</li></ul>
<div class="startchip"><b>Start here</b><p>A Digital Maturity Assessment, in a single session.</p></div></div>
</div>
</div>{foot()}</div>''')

# 10 fit
SL.append(f'''<div class="slide" data-i="9"><div class="pad">
<span class="eyebrow rv">Is this you?</span>
<h1 class="rv">Built for institutions ready to operationalize AI.</h1>
<div class="cols2 rv" style="margin-top:20px">
<div class="card acc"><div class="ch">Ideal fit</div>
<ul class="olist"><li>On, or moving to, Salesforce as the system of record.</li><li>A pipeline of implementations, not a one-off project.</li><li>Leadership mandate to modernize, with governance to satisfy.</li><li>Frustrated by slow proposals or inconsistent delivery.</li></ul></div>
<div class="card out"><div class="ch">Not for you</div>
<ul class="olist no"><li>Looking for a single AI feature or chatbot.</li><li>No appetite to measure outcomes on your own data.</li><li>Off-platform with no plan to consolidate.</li></ul></div>
</div>
</div>{foot()}</div>''')

# 11 path / next step
SL.append(f'''<div class="slide" data-i="10"><div class="pad">
<span class="eyebrow rv">The next step</span>
<h1 class="rv">Start with a single session.</h1>
<div class="steps rv">
<div class="pstep"><div class="pn">STEP 1</div><b>Assess</b><span>A Digital Maturity Assessment scores where you stand and pinpoints the highest-value stages.</span></div>
<div class="pstep"><div class="pn">STEP 2</div><b>Map</b><span>We fit the value chain to your lifecycle and set measured baselines on your platform.</span></div>
<div class="pstep"><div class="pn">STEP 3</div><b>Accelerate</b><span>Reapply the skills and agents on a first engagement, then scale across your pipeline.</span></div>
</div>
<p class="lead rv" style="margin-top:22px">One session in, you have a defensible read on where AI moves the needle for your institution, and a plan to reapply it.</p>
</div>{foot()}</div>''')

# 12 close
SL.append(f'''<div class="slide dark close" data-i="11"><div class="pad" style="justify-content:center">
<img class="logo rv" src="{WHITE}" alt="Zennify" style="margin-bottom:26px">
<span class="eyebrow rv">Zennify Accelerate</span>
<h1 class="rv">Every stage of your engagement, accelerated by AI.</h1>
<p class="lead rv">Let&rsquo;s map the value chain to your lifecycle, and prove it on your data.</p>
<span class="cta rv">Book a Digital Maturity Assessment</span>
</div>{foot(True)}</div>''')

N = len(SL)
dots = "".join(f'<span class="dot {"on" if i==0 else ""}" onclick="go({i})"></span>' for i in range(N))

JS = f"""
const N={N}; let cur=0;
const slides=[...document.querySelectorAll('.slide')];
function scaleSlides(){{const s=Math.min(innerWidth/960,innerHeight/540);slides.forEach(x=>x.style.transform=`scale(${{s}})`);}}
addEventListener('resize',scaleSlides);scaleSlides();
function render(){{
 slides.forEach((s,i)=>s.classList.toggle('active',i===cur));
 document.querySelectorAll('.dot').forEach((d,i)=>d.classList.toggle('on',i===cur));
 document.getElementById('count').textContent=(cur+1)+' / '+N;
 document.getElementById('prog').style.width=((cur+1)/N*100)+'%';
 if(cur===6) startGen();
}}
function go(n){{cur=Math.max(0,Math.min(N-1,n));render();}}
function next(){{go(cur+1);}} function prev(){{go(cur-1);}}
addEventListener('keydown',e=>{{if(e.key==='ArrowRight'||e.key===' '){{e.preventDefault();next();}}if(e.key==='ArrowLeft')prev();}});
// lifecycle
const STAGES={STAGE_JSON};
function pickStage(i){{
 document.querySelectorAll('#rail .sbtn').forEach((b,j)=>b.classList.toggle('on',j===i));
 const s=STAGES[i];
 document.getElementById('sd-code').innerHTML=s.code+' &middot; '+s.name;
 document.getElementById('sd-title').textContent=s.title;
 document.getElementById('sd-desc').textContent=s.desc;
 document.getElementById('sd-stat').textContent=s.stat;
 document.getElementById('sd-statl').textContent=s.statl;
 document.getElementById('sd-caps').innerHTML=s.caps.map(c=>`<div class="scap"><b>${{c.n}}</b><span>${{c.d}}</span></div>`).join('');
}}
pickStage(0);
// generate-it
const GS=['Reading the discovery note…','Extracting the requirement and actors…','Drafting the user story and acceptance criteria…','Mapping fields to Salesforce objects…','Rendering the editable wireframe…'];
let genTimers=[],genDone=false;
function startGen(){{
 if(genDone) return; genDone=true;
 const stepsEl=document.getElementById('gensteps');
 stepsEl.innerHTML=GS.map((t,i)=>`<div class="gstep" id="gs${{i}}"><span class="gi"></span><span>${{t}}</span></div>`).join('');
 const setStep=(k)=>{{GS.forEach((_,i)=>{{const el=document.getElementById('gs'+i);el.className='gstep '+(i<k?'done':i===k?'on':'');el.querySelector('.gi').innerHTML=i<k?'✓':(i===k?'<span class=spin></span>':'');}});}};
 GS.forEach((_,i)=>genTimers.push(setTimeout(()=>setStep(i),i*640)));
 genTimers.push(setTimeout(()=>{{setStep(GS.length);showArt();}},GS.length*640));
}}
function showArt(){{
 document.getElementById('genout').innerHTML=`
 <div class="genart show scard"><div class="sh"><span class="sk">US-118</span> Member case intake</div>
 <div class="story"><b>As a</b> branch rep, <b>I want</b> to log an issue in one screen <b>so that</b> nothing falls through.</div>
 <ul><li>One-screen capture of member, branch, type, description.</li><li>Branch is required on every case.</li><li>Submitting routes the case to the branch queue.</li></ul></div>
 <div class="genart show mini" style="animation-delay:.15s"><div class="mt"><span class="mo">CASE</span><span class="mtt">New Member Case</span></div>
 <div class="mf"><div class="mfi"><span>Subject</span><div class="box"></div></div><div class="mfi"><span>Member</span><div class="box"></div></div>
 <div class="mfi"><span>Case Type</span><div class="box"></div></div><div class="mfi warn"><span>Branch <em>required</em></span><div class="box"></div></div>
 <div class="mfi full"><span>Description</span><div class="box" style="height:22px"></div></div></div></div>`;
}}
render();
"""

HTML = f'''<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Zennify &middot; AI-Accelerated Implementation</title><style>{CSS}</style></head>
<body><div class="prog" id="prog"></div><div id="deck">{"".join(SL)}</div>
<div class="nav"><button onclick="prev()">&#8249;</button><div class="dots">{dots}</div><button onclick="next()">&#8250;</button><span class="count" id="count">1 / {N}</span></div>
<script>{JS}</script></body></html>'''

open("salesplay.html","w").write(HTML)
print("wrote salesplay.html", len(HTML), "bytes,", N, "slides")
