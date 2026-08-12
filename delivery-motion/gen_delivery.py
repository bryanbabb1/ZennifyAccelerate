# Zennify deck: "AI-Enabled Services Delivery" (client-facing, about enabling the
# client's teams). Bottleneck funnel + manual, deep, differentiated generate pipeline +
# results-cascade + skills rolodex. No time-savings estimates on the funnel.
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
WHITE,DARK,BADGE=logo("zennify_logo_white.png"),logo("zennify_logo_dark.png"),logo("zennify_badge.png")

TOKENS=""":root{--z-dark:#1C4A4D;--z-teal:#27BBAF;--z-teal-light:#62D7B8;--z-mint:#B0EDD3;
--z-white:#FFFFFF;--z-lt:#F2F4F9;--z-ice:#E8F7F6;--z-orange:#FE9732;--z-blue:#3D81F6;
--z-slate:#8094C0;--z-purple:#B19CD8;--z-purple-lt:#C7D3EC;--z-font:'DM Sans',system-ui,sans-serif;
--z-radius:6px;--z-radius-sm:4px;}"""

CSS=font_css()+TOKENS+r"""
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{width:100%;height:100%;background:#0e2a2c;overflow:hidden;font-family:var(--z-font);color:var(--z-dark)}
#deck{position:relative;width:100vw;height:100vh;display:flex;align-items:center;justify-content:center}
.slide{position:absolute;width:960px;height:540px;overflow:hidden;display:none;flex-direction:column;background:var(--z-white);transform-origin:center center}
.slide.active{display:flex}.slide.dark{background:var(--z-dark);color:#fff}
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
.cover{display:grid;grid-template-columns:1.12fr .88fr;height:100%}
.cover .l{background:var(--z-dark);color:#fff;padding:48px;display:flex;flex-direction:column}
.cover .r{background:var(--z-ice);display:flex;align-items:center;justify-content:center;padding:40px}
.cover h1{color:#fff;font-size:36px;margin-top:auto}
.cover .sub{color:rgba(255,255,255,.82);font-size:15px;line-height:1.55;margin-top:16px;max-width:450px;margin-bottom:8px}
/* cover motif */
.motif{display:flex;flex-direction:column;gap:8px;align-items:center;width:100%}
.motif .mseg{height:40px;border-radius:var(--z-radius);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;background:var(--z-teal)}
.motif .mseg.d{background:var(--z-dark)}
.motif .marr{color:var(--z-slate);font-size:13px;line-height:.4}
.cols2{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:22px}
.card{background:var(--z-lt);border-radius:var(--z-radius);padding:20px 22px}
.card.out{background:var(--z-white);border:1px solid var(--z-purple-lt)}
.card .ch{font-size:11px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;color:var(--z-slate);margin-bottom:10px}
.card.acc .ch{color:var(--z-teal)}
.card p{font-size:13px;line-height:1.5;color:var(--z-dark)}
.card .ico{width:26px;height:26px;margin-bottom:12px}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:22px}
.gc{background:var(--z-lt);border-radius:var(--z-radius);padding:18px 20px}
.gc b{font-size:14px;display:block;color:var(--z-dark);margin-bottom:5px}
.gc span{font-size:12px;line-height:1.45;color:var(--z-slate)}
.beliefs{display:flex;flex-direction:column;gap:9px;margin-top:20px}
.belief{display:flex;gap:12px;align-items:flex-start;background:rgba(255,255,255,.06);border-radius:var(--z-radius);padding:13px 16px}
.belief .n{font-size:15px;font-weight:700;color:var(--z-teal-light);flex:none;width:22px}
.belief p{font-size:14px;line-height:1.4;color:#fff}
/* bottleneck funnel */
.enfun{display:grid;grid-template-columns:440px 1fr;gap:36px;margin-top:14px;flex:1;min-height:0;align-items:center}
.funnel2{display:flex;flex-direction:column;gap:4px}
.fseg2{height:56px;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-family:var(--z-font);font-size:14px;font-weight:700;color:var(--z-slate);background:var(--z-lt);transition:background .45s,color .45s}
.fseg2.on{background:var(--z-teal);color:#fff}
.fseg2.bottleneck{background:var(--z-orange);color:#fff;animation:pulseb 1.6s ease-in-out infinite}
@keyframes pulseb{0%,100%{opacity:.82}50%{opacity:1}}
.endesc-state{font-size:11px;font-weight:700;letter-spacing:.7px;text-transform:uppercase;color:var(--z-orange)}
.endesc-state.done{color:var(--z-teal)}
.endesc h3{font-size:20px;color:var(--z-dark);margin:8px 0 10px;line-height:1.15}
.endesc p{font-size:14px;line-height:1.55;color:var(--z-slate);max-width:400px}
.enbtn{margin-top:18px;font-family:var(--z-font);font-size:13px;font-weight:700;color:#fff;background:var(--z-dark);border:none;border-radius:var(--z-radius);padding:12px 20px;cursor:pointer}
.enbtn:hover{background:var(--z-teal)}
/* manual pipeline */
.pipehdr{display:flex;align-items:center;gap:7px;margin-top:12px;flex-wrap:wrap}
.ppill{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:700;color:var(--z-slate);background:var(--z-lt);border-radius:20px;padding:5px 11px;transition:all .2s}
.ppill.done{color:var(--z-dark)}.ppill.done .pd{background:var(--z-teal)}
.ppill.cur{color:#fff;background:var(--z-dark)}.ppill.cur .pd{background:var(--z-teal-light)}
.ppill .pd{width:7px;height:7px;border-radius:50%;background:var(--z-purple-lt)}
.ppill .parrow{color:var(--z-purple-lt);margin:0 -1px}
.pipe2{display:grid;grid-template-columns:230px 1fr;gap:18px;margin-top:14px;flex:1;min-height:0}
.pin{background:var(--z-lt);border-radius:var(--z-radius);padding:14px 16px;display:flex;flex-direction:column}
.pin .pil{font-size:10px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:var(--z-slate)}
.pin .pifrom{font-size:11px;color:var(--z-teal);font-weight:700;margin:6px 0 8px}
.pin .pibody{font-size:12px;line-height:1.5;color:var(--z-dark)}
.pin .pibody.note{font-style:italic}
.pnext{margin-top:auto;font-family:var(--z-font);font-size:12.5px;font-weight:700;color:#fff;background:var(--z-dark);border:none;border-radius:var(--z-radius);padding:11px 14px;cursor:pointer;text-align:left}
.pnext:hover{background:var(--z-teal)}.pnext:disabled{opacity:.6;cursor:default}
.pout{background:var(--z-white);border:1px solid var(--z-purple-lt);border-radius:var(--z-radius);overflow:hidden;display:flex;flex-direction:column}
.pout .pouth{padding:8px 14px;background:var(--z-lt);border-bottom:1px solid var(--z-purple-lt);font-size:11px;font-weight:700;color:var(--z-dark);display:flex;justify-content:space-between;align-items:center}
.pout .pouth .flag{font-size:9px;font-weight:700;letter-spacing:.4px;text-transform:uppercase;color:var(--z-teal)}
.pout .poutb{padding:14px;overflow:auto;flex:1}
.pgen{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:12px;color:var(--z-slate)}
.spin{width:16px;height:16px;border-radius:50%;border:2px solid rgba(39,187,175,.3);border-top-color:var(--z-teal);animation:sp .7s linear infinite}
@keyframes sp{to{transform:rotate(360deg)}}
.pgen .gtxt{font-size:12px;font-weight:600;color:var(--z-dark)}
.pstart{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:12px;color:var(--z-slate);text-align:center;font-size:12px}
/* rich artifacts */
.afind{display:flex;gap:8px;align-items:flex-start;margin-bottom:9px;font-size:12px;line-height:1.4;color:var(--z-dark)}
.afind .fd{width:8px;height:8px;border-radius:50%;flex:none;margin-top:4px}
.fd.n{background:var(--z-teal)}.fd.a{background:#f0c000}.fd.r{background:var(--z-orange)}
.acall{background:var(--z-ice);border-radius:var(--z-radius);padding:9px 12px;font-size:11.5px;color:var(--z-dark);margin-top:4px}.acall b{color:var(--z-teal)}
.astory{background:var(--z-ice);border-radius:var(--z-radius);padding:11px 13px;margin-bottom:9px}
.astory .sk{font-size:10px;font-weight:700;color:#fff;background:var(--z-teal);border-radius:3px;padding:2px 7px}
.astory .snm{font-size:12px;font-weight:700;color:var(--z-dark);margin-left:6px}
.astory p{font-size:11.5px;line-height:1.5;color:var(--z-dark);margin:7px 0 6px}.astory p b{color:var(--z-teal)}
.astory ul{list-style:none;display:flex;flex-direction:column;gap:3px}
.astory li{position:relative;padding-left:14px;font-size:10.5px;line-height:1.35;color:var(--z-dark)}
.astory li::before{content:'\2713';position:absolute;left:0;color:var(--z-teal);font-weight:700;font-size:10px}
.atbl{border:1px solid var(--z-purple-lt);border-radius:var(--z-radius);overflow:hidden;margin-bottom:10px}
.atr{display:grid;grid-template-columns:110px 1fr;gap:10px;padding:9px 13px;border-bottom:1px solid var(--z-purple-lt);font-size:12px}
.atr:last-child{border:none}.atr .al{font-weight:700;color:var(--z-dark)}.atr .ar{color:var(--z-slate)}
.awf{border:1px solid var(--z-purple-lt);border-radius:var(--z-radius);overflow:hidden}
.awf .wt{display:flex;align-items:center;gap:7px;padding:8px 11px;border-bottom:1px solid var(--z-purple-lt)}
.awf .wo{font-size:8px;font-weight:700;color:#fff;background:#0176d3;border-radius:2px;padding:2px 5px}
.awf .wtt{font-size:11px;font-weight:700;color:var(--z-dark)}
.awf .wpath{display:flex;gap:3px;padding:7px 10px;background:var(--z-lt);border-bottom:1px solid var(--z-purple-lt);flex-wrap:wrap}
.awf .wch{font-size:8px;font-weight:700;color:var(--z-slate);background:#fff;border:1px solid var(--z-purple-lt);padding:2px 8px 2px 11px;clip-path:polygon(0 0,calc(100% - 5px) 0,100% 50%,calc(100% - 5px) 100%,0 100%,5px 50%)}
.awf .wch.cur{background:var(--z-teal);color:#fff;border-color:var(--z-teal)}
.awf .wff{padding:10px;display:grid;grid-template-columns:1fr 1fr;gap:8px 12px}
.awf .wfi span{font-size:8.5px;color:var(--z-slate);display:block}.awf .wfi span em{font-style:normal;color:var(--z-orange);font-weight:700}
.awf .wfi .bx{height:13px;border:1px solid var(--z-purple-lt);border-radius:2px;background:#fbfcfe;margin-top:2px}
.awf .wfi.warn .bx{border-color:var(--z-orange);background:#fff7ef}.awf .wfi.full{grid-column:1/-1}
.atc{display:grid;grid-template-columns:56px 1fr 1fr;gap:8px;padding:7px 0;border-bottom:1px solid var(--z-purple-lt);font-size:11px;line-height:1.3}
.atc:last-child{border:none}.atc b{color:var(--z-teal);font-size:10px}.atc .ex{color:var(--z-slate)}
.acov{font-size:11px;color:var(--z-slate);font-style:italic;margin-top:8px}
/* results cascade */
.rescols{display:grid;grid-template-columns:1.3fr 1fr;gap:24px;margin-top:20px;align-items:center}
.reschart{background:var(--z-lt);border-radius:var(--z-radius);padding:18px}
.reschart .rct{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.4px;color:var(--z-slate);display:flex;justify-content:space-between;margin-bottom:10px}
.reschart .leg{display:flex;gap:14px;margin-top:10px;font-size:10px;color:var(--z-slate)}
.reschart .leg i{display:inline-block;width:14px;height:3px;border-radius:2px;margin-right:5px;vertical-align:middle}
.restiles{display:flex;flex-direction:column;gap:12px}
.rtile{background:var(--z-lt);border-radius:var(--z-radius);padding:14px 16px}
.rtile b{font-size:20px;color:var(--z-dark)}.rtile .u{font-size:12px;color:var(--z-teal);font-weight:700}
.rtile span{font-size:11px;color:var(--z-slate);display:block;margin-top:2px}
.resnote{margin-top:16px;font-size:11.5px;color:var(--z-slate);font-style:italic;line-height:1.5}
.resnote b{color:#1C6B3A;font-style:normal}
/* offer + rolodex */
.offer{display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-top:20px;align-items:center}
.olist{list-style:none;display:flex;flex-direction:column;gap:9px}
.olist li{position:relative;padding-left:16px;font-size:13px;line-height:1.45;color:var(--z-dark)}
.olist li::before{content:'\25CF';position:absolute;left:0;top:5px;font-size:6px;color:var(--z-teal)}
.subh{font-size:11px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;color:var(--z-teal);margin-bottom:12px}
.rolo{display:flex;flex-direction:column;align-items:center}
.rolostack{position:relative;width:280px;height:150px}
.rolocard{position:absolute;inset:0;background:var(--z-white);border:1px solid var(--z-purple-lt);border-radius:var(--z-radius);padding:18px 20px;display:flex;flex-direction:column;justify-content:center}
.rolocard.b1{transform:translateY(10px) scale(.95);opacity:.5;z-index:1}
.rolocard.b2{transform:translateY(20px) scale(.9);opacity:.3;z-index:0}
.rolocard.front{z-index:2}
.rolocard .rt{font-size:9px;font-weight:700;letter-spacing:.4px;text-transform:uppercase;color:#fff;background:var(--z-teal);border-radius:var(--z-radius-sm);padding:2px 8px;align-self:flex-start}
.rolocard .rn{font-size:17px;font-weight:700;color:var(--z-dark);margin:9px 0 6px}
.rolocard .rd{font-size:12px;line-height:1.45;color:var(--z-slate)}
.spinbtn{margin-top:18px;font-family:var(--z-font);font-size:13px;font-weight:700;color:#fff;background:var(--z-dark);border:none;border-radius:var(--z-radius);padding:11px 22px;cursor:pointer}
.spinbtn:hover{background:var(--z-teal)}
.roms{font-size:11px;color:var(--z-slate);margin-top:10px}
/* steps + close */
.steps{display:flex;gap:10px;margin-top:24px}
.pstep{flex:1;background:var(--z-lt);border-radius:var(--z-radius);padding:18px}
.pstep .pn{font-size:11px;font-weight:700;color:var(--z-teal);letter-spacing:.5px}
.pstep b{font-size:15px;display:block;margin:7px 0 6px;color:var(--z-dark)}
.pstep span{font-size:12px;color:var(--z-slate);line-height:1.45}
.close .cta{margin-top:26px;display:inline-block;background:var(--z-teal);color:#fff;font-size:14px;font-weight:700;border-radius:var(--z-radius);padding:14px 26px}
"""

def foot():
    return f'<div class="foot"><span class="c">&copy; 2026 Zennify &middot; Confidential &middot; AI-Enabled Services Delivery</span><img src="{BADGE}" alt="Zennify"></div>'

# ---- data ----
STAGES2=["Discovery","Solution design","Build","UAT","Go-Live"]
BOTTLE=[
 "Discovery is the first constraint. Turning workshops into a complete, traceable backlog takes weeks, and every stage downstream waits on it.",
 "With discovery flowing, design becomes the constraint. Teams start building before the blueprint is settled, and rework follows.",
 "Now build is the constraint. Developer hours go to boilerplate and test-writing instead of judgment.",
 "UAT becomes the constraint. Test prep and defect triage stretch the go-live window.",
 "Go-live is the last constraint. Cutover is manual, and the risk lands on a single weekend.",
]
ENDMSG="Every part is enabled. The delivery motion runs end to end, with no single bottleneck, from intake to production."
STAGES2_JSON=json.dumps(STAGES2); BOTTLE_JSON=json.dumps(BOTTLE); ENDMSG_JSON=json.dumps(ENDMSG)

def funnel_segs():
    bounds=[100,88,77,67,58,50]
    out=""
    for i,name in enumerate(STAGES2):
        top=bounds[i]; bot=bounds[i+1]
        clip=f"polygon({(100-top)/2:.1f}% 0,{(100+top)/2:.1f}% 0,{(100+bot)/2:.1f}% 100%,{(100-bot)/2:.1f}% 100%)"
        out+=f'<button class="fseg2" data-i="{i}" onclick="enableTo({i})" style="clip-path:{clip};-webkit-clip-path:{clip}">{name}</button>'
    return out

# manual pipeline artifacts (rich, distinct) + input summaries
A_FIND=('<div class="afind"><span class="fd r"></span>Cases are logged across three systems, and the originating branch is often lost.</div>'
        '<div class="afind"><span class="fd a"></span>No single owner for follow-up once the call ends.</div>'
        '<div class="afind"><span class="fd a"></span>Reporting can\'t break cases down by branch.</div>'
        '<div class="afind"><span class="fd n"></span>Security and sharing model are already sound.</div>'
        '<div class="acall"><b>Gap flagged:</b> no SLA on response time, and no way to measure it.</div>')
A_STORY=('<div class="astory"><span class="sk">US-118</span><span class="snm">Member case intake</span>'
         '<p><b>As a</b> branch rep, <b>I want</b> to log an issue in one screen <b>so that</b> nothing falls through.</p>'
         '<ul><li>One-screen capture of member, branch, type, description.</li><li>Branch is required on every case.</li></ul></div>'
         '<div class="astory"><span class="sk">US-119</span><span class="snm">Route to owning branch</span>'
         '<p><b>As a</b> manager, <b>I want</b> new cases in my queue <b>so that</b> my team owns follow-up.</p>'
         '<ul><li>Case routes to the originating branch on submit.</li><li>Reassignment is logged.</li></ul></div>')
A_DESIGN=('<div class="atbl">'
          '<div class="atr"><span class="al">UI</span><span class="ar">Lightning record page + quick action</span></div>'
          '<div class="atr"><span class="al">Automation</span><span class="ar">Flow for routing; no Apex</span></div>'
          '<div class="atr"><span class="al">Data</span><span class="ar">Case + custom Branch lookup</span></div>'
          '<div class="atr"><span class="al">Integration</span><span class="ar">Platform event to core banking</span></div></div>'
          '<div class="acall"><b>Decision:</b> configuration over code keeps routing admin-maintainable.</div>')
A_WIRE=('<div class="awf"><div class="wt"><span class="wo">CASE</span><span class="wtt">New Member Case</span></div>'
        '<div class="wpath"><span class="wch cur">New</span><span class="wch">In progress</span><span class="wch">Escalated</span><span class="wch">Resolved</span><span class="wch">Closed</span></div>'
        '<div class="wff"><div class="wfi"><span>Subject</span><div class="bx"></div></div><div class="wfi"><span>Member</span><div class="bx"></div></div>'
        '<div class="wfi"><span>Case Type</span><div class="bx"></div></div><div class="wfi warn"><span>Branch <em>required</em></span><div class="bx"></div></div>'
        '<div class="wfi full"><span>Description</span><div class="bx" style="height:24px"></div></div></div></div>')
A_TEST=('<div class="atc"><b>TC-01</b><span>Create with all fields</span><span class="ex">Saved, routed to queue</span></div>'
        '<div class="atc"><b>TC-02</b><span>Submit with no branch</span><span class="ex">Blocked, error shown</span></div>'
        '<div class="atc"><b>TC-03</b><span>Duplicate member + subject</span><span class="ex">Warn, allow override</span></div>'
        '<div class="atc"><b>TC-04</b><span>SLA passes 4h</span><span class="ex">Case escalates</span></div>'
        '<div class="acov">14 cases generated: happy path, edge, and negative. ~92% coverage.</div>')
PIPE=[
 {"stage":"Discovery findings","frm":"Workshop notes","in":'"When a member calls the branch, the rep opens three systems to log it, and the branch is often lost."',"innote":True,"gen":["Reading workshop notes…","Clustering needs…","Flagging gaps & risks…"],"art":A_FIND},
 {"stage":"User stories","frm":"Discovery findings","in":"3 issues and 1 gap, prioritized.","innote":False,"gen":["Splitting findings into stories…","Writing acceptance criteria…","Grooming the backlog…"],"art":A_STORY},
 {"stage":"Solution design","frm":"User stories","in":"2 build-ready stories with acceptance criteria.","innote":False,"gen":["Selecting components & patterns…","Designing the data model…"],"art":A_DESIGN},
 {"stage":"Wireframe","frm":"Solution design","in":"A build-ready design: Case object, Flow routing.","innote":False,"gen":["Choosing Lightning components…","Laying out fields…","Rendering the screen…"],"art":A_WIRE},
 {"stage":"Test cases","frm":"Wireframe + stories","in":"The Case screen and its acceptance criteria.","innote":False,"gen":["Deriving scenarios…","Writing expected results…","Covering edge & negative…"],"art":A_TEST},
]
PIPE_JSON=json.dumps(PIPE)

# rolodex skills
SKILLS=[
 ("Skill","Business Requirements Document","Turns discovery workshops into a complete, traceable requirements doc."),
 ("Skill","Story & Design Writer","A build-ready user story and an editable Salesforce wireframe."),
 ("Skill","Solution Design","A build-ready blueprint your team develops against."),
 ("Skill","QA Test Writer","Executable test cases generated straight from the stories."),
 ("Skill","Data Model Advisor","Defensible schema decisions, with risks flagged early."),
 ("Skill","Deployment Runbook","A minute-by-minute cutover plan with rollback triggers."),
 ("Skill","Architecture Health Check","A scored risk read on an inherited environment."),
 ("Skill","Test Strategy & UAT Plan","Coverage, entry and exit criteria, and a clear go/no-go."),
 ("Skill","Weekly Status Report","Live status, risks, and asks, drawn from your systems."),
 ("Skill","Change & Enablement Plan","Turns a launch into real, measured adoption."),
 ("Agent","Testing & Quality Agent","Automated regression coverage across a delivery."),
 ("Skill","Discovery Session Planning","A structured discovery agenda and question bank."),
 ("Skill","Documentation Writer","Clear user guides, data dictionaries, and release notes."),
 ("Skill","Quarterly Business Review","Outcomes, adoption, and the forward roadmap."),
 ("Skill","Live Project Dashboard","One always-current view of program health."),
 ("Skill","Sprint Recap","A branded, data-backed recap every sprint."),
]
SKILLS_JSON=json.dumps([{"t":s[0],"n":s[1],"d":s[2]} for s in SKILLS])

# results cascade chart (SVG): 5 enable steps; cycle time down, throughput up
def res_chart():
    W,Hc=300,150; xs=[10+i*(W-20)/4 for i in range(5)]
    cyc=[92,74,58,42,26]  # cycle-time index (down)
    thr=[30,46,60,74,88]  # throughput index (up)
    def pts(v): return " ".join(f"{xs[i]:.0f},{Hc-8-(val/100)*(Hc-24):.0f}" for i,val in enumerate(v))
    dots="".join(f'<circle cx="{xs[i]:.0f}" cy="{Hc-8-(cyc[i]/100)*(Hc-24):.0f}" r="3" fill="var(--z-orange)"/>' for i in range(5))
    dots+="".join(f'<circle cx="{xs[i]:.0f}" cy="{Hc-8-(thr[i]/100)*(Hc-24):.0f}" r="3" fill="var(--z-teal)"/>' for i in range(5))
    return (f'<svg viewBox="0 0 {W} {Hc}" width="100%" style="height:150px">'
            f'<polyline points="{pts(cyc)}" fill="none" stroke="var(--z-orange)" stroke-width="2.5" stroke-linejoin="round"/>'
            f'<polyline points="{pts(thr)}" fill="none" stroke="var(--z-teal)" stroke-width="2.5" stroke-linejoin="round"/>{dots}</svg>')

SL=[]
# 1 cover — no tags, motif instead of icon
motif=('<div class="motif">'
 '<div class="mseg" style="width:100%">Discovery</div><div class="marr">&darr;</div>'
 '<div class="mseg" style="width:84%">Design</div><div class="marr">&darr;</div>'
 '<div class="mseg d" style="width:68%">Build</div><div class="marr">&darr;</div>'
 '<div class="mseg" style="width:52%">UAT</div><div class="marr">&darr;</div>'
 '<div class="mseg" style="width:40%">Go-Live</div></div>')
SL.append(f'''<div class="slide dark active" data-i="0"><div class="cover">
<div class="l"><img class="logo" src="{WHITE}" alt="Zennify" style="margin-bottom:auto">
<span class="eyebrow rv">AI-enabled services delivery</span>
<h1 class="rv">Your teams, delivering on an AI value chain.</h1>
<p class="sub rv">We reapply the skills, agents, and processes proven across our delivery work, and enable them inside your teams&rsquo; own implementation lifecycle, one part at a time.</p>
</div><div class="r">{motif}</div>
</div></div>''')
# 2 what changed
SL.append(f'''<div class="slide" data-i="1"><div class="pad">
<span class="eyebrow rv">What changed</span>
<h1 class="rv">AI moved from pilot to production inside delivery.</h1>
<p class="lead rv">The question for your teams is no longer whether to use AI on an implementation. It is whether each part of your delivery lifecycle is set up to use it well, on your data and under your controls.</p>
<div class="cols2 rv">
<div class="card out"><div class="ch">Point tools, in isolation</div><p>An assistant here, a script there, used by whoever knows about them. Effort goes up. Consistency across your teams does not.</p></div>
<div class="card acc"><div class="ch">Enabled across the lifecycle</div><p>Proven skills, agents, and processes enabled part by part inside your teams&rsquo; existing process, and measured on your platform.</p></div>
</div></div>{foot()}</div>''')
# 3 cost of waiting
SL.append(f'''<div class="slide" data-i="2"><div class="pad">
<span class="eyebrow rv">Where the time goes</span>
<h1 class="rv">Run the old way, each stage quietly costs your teams.</h1>
<div class="grid3 rv">
<div class="gc"><b>Discovery drags</b><span>It takes weeks to turn workshops into a build-ready, traceable backlog.</span></div>
<div class="gc"><b>Rework piles up</b><span>Requirements drift from design drift from build, and it surfaces late.</span></div>
<div class="gc"><b>Status is hard to see</b><span>Leadership learns about risk when it is already expensive to fix.</span></div>
</div>
<p class="lead rv">None of this is an AI problem. It is exactly where AI, enabled inside your process, helps your teams most.</p>
</div>{foot()}</div>''')
# 4 POV
SL.append(f'''<div class="slide dark" data-i="3"><div class="pad">
<span class="eyebrow rv">How we work</span>
<h1 class="rv">We enable each part of your funnel. We don&rsquo;t replace your teams.</h1>
<p class="lead rv">This is not a rip-and-replace, or another tool for your people to learn on their own. We bring proven skills, agents, and processes, and enable them stage by stage inside your existing delivery lifecycle, on your platform and under your governance.</p>
<div class="beliefs rv">
<div class="belief"><span class="n">1</span><p>We enable your process. We don&rsquo;t replace it.</p></div>
<div class="belief"><span class="n">2</span><p>We start where the constraint is, and enable one part at a time.</p></div>
<div class="belief"><span class="n">3</span><p>Everything runs, and is measured, on your own platform.</p></div>
</div>
</div>{foot()}</div>''')
# 5 bottleneck funnel
SL.append(f'''<div class="slide" data-i="4"><div class="pad">
<span class="eyebrow">Your delivery funnel</span>
<h1 style="font-size:31px">Enable a part, and the bottleneck moves down the line.</h1>
<div class="enfun">
<div class="funnel2" id="funnel2">{funnel_segs()}</div>
<div><div class="endesc-state" id="en-state">Bottleneck &middot; Discovery</div>
<h3 id="en-title" style="display:none"></h3>
<p id="en-line"></p>
<button class="enbtn" id="enbtn" onclick="enableNext()">Enable Discovery &rarr;</button></div>
</div>
</div>{foot()}</div>''')
# 6 manual pipeline
SL.append(f'''<div class="slide" data-i="5"><div class="pad">
<span class="eyebrow">One part feeds the next</span>
<h1 style="font-size:29px">Step through it. Each output becomes the next input.</h1>
<div class="pipehdr" id="pipehdr"></div>
<div class="pipe2">
<div class="pin"><div class="pil">Input</div><div class="pifrom" id="pin-from"></div><div class="pibody" id="pin-body"></div>
<button class="pnext" id="pnext" onclick="pipeNext()"></button></div>
<div class="pout"><div class="pouth"><span id="pout-title">Output</span><span class="flag" id="pout-flag"></span></div>
<div class="poutb" id="pout-body"><div class="pstart">Step through the delivery pipeline. Each artifact is generated, then feeds the next.</div></div></div>
</div>
</div>{foot()}</div>''')
# 7 results cascade
SL.append(f'''<div class="slide" data-i="6"><div class="pad">
<span class="eyebrow rv">Measurable results</span>
<h1 class="rv">Results compound as the enablement cascades.</h1>
<div class="rescols rv">
<div class="reschart"><div class="rct"><span>Intake &rarr; production</span><span>per part enabled</span></div>{res_chart()}
<div class="leg"><span><i style="background:var(--z-orange)"></i>Time to production</span><span><i style="background:var(--z-teal)"></i>Throughput</span></div></div>
<div class="restiles">
<div class="rtile"><b class="u">Higher</b><span>throughput per delivery team, sprint over sprint</span></div>
<div class="rtile"><b>Shorter</b> <span class="u" style="font-size:inherit"></span><span>time from intake to production as each part enables</span></div>
<div class="rtile"><b>Less</b><span>rework, because each stage hands off cleaner work</span></div>
</div>
</div>
<p class="resnote rv">Two of these are already <b>measured on Salesforce</b>: estimate variance tightened from ~5% to ~1%, and a recent AI-run engagement delivered above the margin it was sold at. The rest we measure on your data as each part enables.</p>
</div>{foot()}</div>''')
# 8 offer + rolodex
SL.append(f'''<div class="slide" data-i="7"><div class="pad">
<span class="eyebrow rv">What we bring</span>
<h1 class="rv">Proven capability, ready to enable in your process.</h1>
<div class="offer rv">
<div><div class="subh">What we bring</div>
<ul class="olist"><li>The delivery value chain, enabled inside your teams&rsquo; existing process.</li><li>A working set of skills and agents, configured on your org.</li><li>Your teams enabled to run the motion, with us alongside.</li></ul>
<div class="roms">A library of skills and agents at your disposal &mdash; spin to explore a few.</div></div>
<div class="rolo"><div class="rolostack" id="rolostack">
<div class="rolocard b2"></div><div class="rolocard b1"></div>
<div class="rolocard front" id="rolofront"><span class="rt" id="ro-t"></span><div class="rn" id="ro-n"></div><div class="rd" id="ro-d"></div></div>
</div><button class="spinbtn" id="spinbtn" onclick="spinRolo()">&#8635; Spin the wheel</button></div>
</div>
</div>{foot()}</div>''')
# 9 fit (no salesforce)
SL.append(f'''<div class="slide" data-i="8"><div class="pad">
<span class="eyebrow rv">Is this you?</span>
<h1 class="rv">Built for teams that deliver, again and again.</h1>
<div class="cols2 rv" style="margin-top:20px">
<div class="card acc"><div class="ch">Where this fits</div>
<ul class="olist"><li>You run implementations continuously, not as a one-off project.</li><li>Delivery leaders feel the cost of rework and inconsistency.</li><li>You&rsquo;re ready to measure outcomes on your own data.</li><li>You have governance and audit standards to meet.</li></ul></div>
<div class="card out"><div class="ch">Where it doesn&rsquo;t</div>
<ul class="olist"><li>You want a single AI feature or chatbot, not a delivery motion.</li><li>There&rsquo;s no appetite to change how delivery runs.</li><li>Measuring results isn&rsquo;t a priority yet.</li></ul></div>
</div></div>{foot()}</div>''')
# 10 next step
SL.append(f'''<div class="slide" data-i="9"><div class="pad">
<span class="eyebrow rv">The next step</span>
<h1 class="rv">Enable one part. Prove it. Scale it together.</h1>
<div class="steps rv">
<div class="pstep"><div class="pn">STEP 1</div><b>Focus</b><span>Together we find the part of your lifecycle where the constraint costs the most.</span></div>
<div class="pstep"><div class="pn">STEP 2</div><b>Enable</b><span>We enable that stage with proven skills and agents, on your platform and in your process.</span></div>
<div class="pstep"><div class="pn">STEP 3</div><b>Scale</b><span>We scale the motion across the rest of the delivery lifecycle, working alongside your teams.</span></div>
</div>
<p class="lead rv" style="margin-top:22px">One part in, you have proven, measurable results you can see, enough to green-light the rest of the AI-enabled delivery motion.</p>
</div>{foot()}</div>''')
# 11 close
SL.append(f'''<div class="slide dark close" data-i="10"><div class="pad" style="justify-content:center">
<img class="logo rv" src="{WHITE}" alt="Zennify" style="margin-bottom:26px">
<span class="eyebrow rv">AI-enabled services delivery</span>
<h1 class="rv">A delivery lifecycle that gets faster every time you run it.</h1>
<p class="lead rv">Let&rsquo;s start with the stage that costs you the most, prove it on your data, and enable the rest of the lifecycle together.</p>
<span class="cta rv">Map your delivery lifecycle</span>
</div>{foot()}</div>''')

N=len(SL)
dots="".join(f'<span class="dot {"on" if i==0 else ""}" onclick="go({i})"></span>' for i in range(N))
FLOW_SLIDE=5; ROLO_SLIDE=7

JS=f"""
const N={N};let cur=0;const slides=[...document.querySelectorAll('.slide')];
function scaleSlides(){{const s=Math.min(innerWidth/960,innerHeight/540);slides.forEach(x=>x.style.transform=`scale(${{s}})`);}}
addEventListener('resize',scaleSlides);scaleSlides();
function render(){{
 slides.forEach((s,i)=>s.classList.toggle('active',i===cur));
 document.querySelectorAll('.dot').forEach((d,i)=>d.classList.toggle('on',i===cur));
 document.getElementById('count').textContent=(cur+1)+' / '+N;
 document.getElementById('prog').style.width=((cur+1)/N*100)+'%';
 if(cur==={FLOW_SLIDE})resetPipe();
 if(cur==={ROLO_SLIDE}&&!roloInit){{roloInit=true;showRolo(0);}}
}}
function go(n){{cur=Math.max(0,Math.min(N-1,n));render();}}
function next(){{go(cur+1);}}function prev(){{go(cur-1);}}
addEventListener('keydown',e=>{{if(e.key==='ArrowRight'||e.key===' '){{e.preventDefault();next();}}if(e.key==='ArrowLeft')prev();}});
// bottleneck funnel
const STAGES2={STAGES2_JSON},BOTTLE={BOTTLE_JSON},ENDMSG={ENDMSG_JSON},EN=STAGES2.length;let enabled=0;
function paintFunnel(){{
 document.querySelectorAll('#funnel2 .fseg2').forEach((b,i)=>{{
  b.classList.toggle('on',i<enabled);
  b.classList.toggle('bottleneck',i===enabled&&enabled<EN);
 }});
 const st=document.getElementById('en-state'),ln=document.getElementById('en-line'),btn=document.getElementById('enbtn');
 if(enabled>=EN){{st.textContent='End to end · enabled';st.className='endesc-state done';ln.textContent=ENDMSG;btn.textContent='↻ Reset';}}
 else{{st.textContent='Bottleneck · '+STAGES2[enabled];st.className='endesc-state';ln.textContent=BOTTLE[enabled];btn.textContent='Enable '+STAGES2[enabled]+' →';}}
}}
function enableNext(){{enabled=enabled>=EN?0:enabled+1;paintFunnel();}}
function enableTo(i){{enabled=(i+1===enabled)?i:i+1;paintFunnel();}}
paintFunnel();
// manual pipeline
const PIPE={PIPE_JSON};let pStep=0,pBusy=false,pTimers=[];
function clearP(){{pTimers.forEach(t=>clearTimeout(t));pTimers=[];}}
function renderPHdr(done){{
 document.getElementById('pipehdr').innerHTML=PIPE.map((p,i)=>{{
  const cls=i<done?'done':i===done?'cur':'';const a=i<PIPE.length-1?'<span class=parrow>&rsaquo;</span>':'';
  return `<span class="ppill ${{cls}}"><span class=pd></span>${{p.stage}}</span>${{a}}`;}}).join('');
}}
function renderInput(i){{
 const p=PIPE[i];
 document.getElementById('pin-from').textContent='from '+p.frm;
 const bd=document.getElementById('pin-body');bd.className='pibody'+(p.innote?' note':'');bd.innerHTML=p.in;
 const btn=document.getElementById('pnext');btn.disabled=false;
 btn.textContent=(i===0?'▶ Generate ':'Generate next: ')+p.stage+' →';
}}
function resetPipe(){{clearP();pStep=0;pBusy=false;renderPHdr(0);renderInput(0);
 document.getElementById('pout-title').textContent='Output';document.getElementById('pout-flag').textContent='';
 document.getElementById('pout-body').innerHTML='<div class="pstart">Step through the delivery pipeline. Each artifact is generated, then feeds the next.</div>';
}}
function pipeNext(){{
 if(pBusy)return;
 if(pStep>=PIPE.length){{resetPipe();return;}}
 pBusy=true;const p=PIPE[pStep];const btn=document.getElementById('pnext');btn.disabled=true;btn.textContent='Generating…';
 document.getElementById('pout-title').textContent=p.stage;document.getElementById('pout-flag').textContent='';
 const body=document.getElementById('pout-body');
 body.innerHTML='<div class="pgen"><span class="spin"></span><span class="gtxt" id="pgt">'+p.gen[0]+'</span></div>';
 let g=0;const gt=document.getElementById('pgt');
 const tick=setInterval(()=>{{g++;if(g<p.gen.length)gt.textContent=p.gen[g];}},620);
 pTimers.push(setTimeout(()=>{{
  clearInterval(tick);body.innerHTML=p.art;document.getElementById('pout-flag').textContent='Generated';
  pStep++;renderPHdr(pStep);pBusy=false;
  if(pStep>=PIPE.length){{const b=document.getElementById('pnext');b.disabled=false;b.textContent='↻ Start over';document.getElementById('pin-from').textContent='complete';document.getElementById('pin-body').className='pibody';document.getElementById('pin-body').textContent='Discovery notes became stories, design, a screen, and tests — one motion.';}}
  else renderInput(pStep);
 }},p.gen.length*620+300));
}}
// rolodex
const SKILLS={SKILLS_JSON};let roloInit=false,roloIdx=0,roloSpin=null;
function showRolo(i){{roloIdx=i;const s=SKILLS[i];
 document.getElementById('ro-t').textContent=s.t;document.getElementById('ro-n').textContent=s.n;document.getElementById('ro-d').textContent=s.d;}}
function spinRolo(){{
 if(roloSpin)return;let n=0;const total=16+Math.floor(SKILLS.length*Math.random());let d=45;
 function tick(){{roloIdx=(roloIdx+1)%SKILLS.length;showRolo(roloIdx);n++;
  if(n>=total){{roloSpin=null;return;}}
  if(n>total-6)d+=45;roloSpin=setTimeout(tick,d);}}
 roloSpin=setTimeout(tick,d);
}}
render();
"""

HTML=f'''<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Zennify &middot; AI-Enabled Services Delivery</title><style>{CSS}</style></head>
<body><div class="prog" id="prog"></div><div id="deck">{"".join(SL)}</div>
<div class="nav"><button onclick="prev()">&#8249;</button><div class="dots">{dots}</div><button onclick="next()">&#8250;</button><span class="count" id="count">1 / {N}</span></div>
<script>{JS}</script></body></html>'''
open("delivery.html","w").write(HTML)
print("wrote delivery.html",len(HTML),"bytes,",N,"slides")
