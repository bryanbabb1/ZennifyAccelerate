# Zennify deck: "AI-Enabled Services Delivery". Mirrors the GESA spine:
# Constraint/Starved/Enabled funnel with the constraint marching down, and the
# human-in-the-loop "machine assembles / your people decide" effort shift.
import base64, json, math

SK = "/root/.claude/skills/synced/zennify-html-artifacts"
FONTS=f"{SK}/assets/fonts"; LOGOS=f"{SK}/assets/logos"
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
.pad{padding:36px 48px;flex:1;display:flex;flex-direction:column;min-height:0}
.eyebrow{font-size:11px;font-weight:700;letter-spacing:1.7px;text-transform:uppercase;color:var(--z-teal)}
.slide.dark .eyebrow{color:var(--z-teal-light)}
h1{font-size:37px;font-weight:700;line-height:1.06;letter-spacing:-.5px;color:var(--z-dark)}
.slide.dark h1{color:#fff}
.lead{font-size:15px;line-height:1.55;color:var(--z-slate);margin-top:12px;max-width:720px}
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
@keyframes rv{to{opacity:1;transform:none}}
.nav{position:fixed;bottom:16px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:14px;z-index:80;background:rgba(28,74,77,.92);border-radius:30px;padding:8px 16px}
.nav button{background:none;border:none;color:#fff;font-size:16px;cursor:pointer;width:24px;height:24px;line-height:1;opacity:.85}
.nav button:hover{opacity:1}
.dots{display:flex;gap:6px}.dot{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.3);cursor:pointer}.dot.on{background:var(--z-teal-light)}
.count{font-size:11px;color:rgba(255,255,255,.7);font-weight:500;min-width:38px;text-align:center}
.prog{position:fixed;top:0;left:0;height:3px;background:var(--z-teal);z-index:90;transition:width .3s}
.cover{display:grid;grid-template-columns:1.12fr .88fr;height:100%}
.cover .l{background:var(--z-dark);color:#fff;padding:48px;display:flex;flex-direction:column}
.cover .r{background:var(--z-ice);display:flex;align-items:center;justify-content:center;padding:44px}
.cover h1{color:#fff;font-size:36px;margin-top:auto}
.cover .sub{color:rgba(255,255,255,.82);font-size:15px;line-height:1.55;margin-top:16px;max-width:450px}
.motif{display:flex;flex-direction:column;gap:8px;align-items:center;width:100%}
.motif .mseg{height:38px;border-radius:var(--z-radius);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;background:var(--z-teal)}
.motif .mseg.d{background:var(--z-dark)}.motif .marr{color:var(--z-slate);font-size:12px;line-height:.3}
.cols2{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:22px}
.card{background:var(--z-lt);border-radius:var(--z-radius);padding:20px 22px}
.card.out{background:var(--z-white);border:1px solid var(--z-purple-lt)}
.card .ch{font-size:11px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;color:var(--z-slate);margin-bottom:10px}
.card.acc .ch{color:var(--z-teal)}
.card p{font-size:13px;line-height:1.5;color:var(--z-dark)}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:22px}
.gc{background:var(--z-lt);border-radius:var(--z-radius);padding:18px 20px}
.gc b{font-size:14px;display:block;color:var(--z-dark);margin-bottom:5px}
.gc span{font-size:12px;line-height:1.45;color:var(--z-slate)}
.beliefs{display:flex;flex-direction:column;gap:9px;margin-top:20px}
.belief{display:flex;gap:12px;align-items:flex-start;background:rgba(255,255,255,.06);border-radius:var(--z-radius);padding:13px 16px}
.belief .n{font-size:15px;font-weight:700;color:var(--z-teal-light);flex:none;width:22px}
.belief p{font-size:14px;line-height:1.4;color:#fff}
/* funnel constraint/starved/enabled */
.enfun{display:grid;grid-template-columns:440px 1fr;gap:34px;margin-top:8px;flex:1;min-height:0;align-items:center}
.funcol{display:flex;flex-direction:column}
.flabel{font-size:10px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:var(--z-slate);text-align:center}
.funnel2{display:flex;flex-direction:column;gap:4px;margin:6px 0}
.fseg2{height:60px;border:none;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:var(--z-font);background:var(--z-lt);transition:background .45s}
.fseg2 .fsn{font-size:13.5px;font-weight:700;color:var(--z-slate);transition:color .45s}
.fseg2 .fst{font-size:8.5px;font-weight:700;letter-spacing:.7px;text-transform:uppercase;margin-top:3px;color:var(--z-slate)}
.fseg2.enabled{background:var(--z-teal)}.fseg2.enabled .fsn{color:#fff}.fseg2.enabled .fst{color:rgba(255,255,255,.85)}
.fseg2.starved{background:var(--z-lt)}.fseg2.starved .fsn{color:var(--z-slate)}.fseg2.starved .fst{color:var(--z-slate)}
.fseg2.constraint{background:var(--z-orange);animation:pulseb 1.6s ease-in-out infinite}.fseg2.constraint .fsn{color:#fff}.fseg2.constraint .fst{color:#fff}
@keyframes pulseb{0%,100%{opacity:.84}50%{opacity:1}}
.fpeyebrow{font-size:10px;font-weight:700;letter-spacing:.7px;text-transform:uppercase;color:var(--z-teal)}
.fphead{font-size:20px;font-weight:700;color:var(--z-dark);margin:8px 0 9px;line-height:1.18}
.fpnote{font-size:14px;line-height:1.55;color:var(--z-slate);max-width:400px}
.fpnote b{color:var(--z-orange)}
.enbtn{margin-top:18px;font-family:var(--z-font);font-size:13px;font-weight:700;color:#fff;background:var(--z-dark);border:none;border-radius:var(--z-radius);padding:12px 20px;cursor:pointer}
.enbtn:hover{background:var(--z-teal)}
/* human slide (light) */
.hcols{display:grid;grid-template-columns:1fr 70px 1fr;gap:0;margin-top:18px;align-items:stretch}
.hpanel{background:var(--z-lt);border-radius:var(--z-radius);padding:18px 20px}
.hpanel.ai{background:var(--z-ice)}
.hpanel .he{font-size:10px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;color:var(--z-teal);margin-bottom:12px}
.hrow{margin-bottom:11px}.hrow b{font-size:13px;color:var(--z-dark)}.hrow span{font-size:11.5px;color:var(--z-slate);display:block;line-height:1.4;margin-top:1px}
.hpanel .hf{font-size:11.5px;color:var(--z-teal);font-weight:700;margin-top:14px;padding-top:12px;border-top:1px solid var(--z-purple-lt)}
.handoff{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px}
.handoff .hl{font-size:9px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;color:var(--z-slate);writing-mode:vertical-rl;transform:rotate(180deg)}
.handoff .ha{color:var(--z-teal);font-size:20px}
.shiftband{display:grid;grid-template-columns:1fr 40px 1fr;gap:10px;align-items:center;margin-top:16px;background:var(--z-dark);border-radius:var(--z-radius);padding:14px 18px}
.shiftband .sb b{font-size:11px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:rgba(255,255,255,.55)}
.shiftband .sb.now b{color:var(--z-teal-light)}
.shiftband .sb p{font-size:12.5px;color:rgba(255,255,255,.9);line-height:1.4;margin-top:4px}
.shiftband .sarr{text-align:center;color:var(--z-teal-light);font-size:20px}
/* pipeline */
.pipehdr{display:flex;align-items:center;gap:7px;margin-top:12px;flex-wrap:wrap}
.ppill{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:700;color:var(--z-slate);background:var(--z-lt);border-radius:20px;padding:5px 11px;transition:all .2s}
.ppill.done{color:var(--z-dark)}.ppill.done .pd{background:var(--z-teal)}
.ppill.cur{color:#fff;background:var(--z-dark)}.ppill.cur .pd{background:var(--z-teal-light)}
.ppill .pd{width:7px;height:7px;border-radius:50%;background:var(--z-purple-lt)}
.ppill .parrow{color:var(--z-purple-lt);margin:0 -1px}
.pipe2{display:grid;grid-template-columns:220px 1fr;gap:16px;margin-top:12px;flex:1;min-height:0}
.pin{background:var(--z-lt);border-radius:var(--z-radius);padding:13px 15px;display:flex;flex-direction:column}
.pin .pil{font-size:10px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:var(--z-slate)}
.pin .pifrom{font-size:11px;color:var(--z-teal);font-weight:700;margin:6px 0 8px}
.pin .pibody{font-size:12px;line-height:1.5;color:var(--z-dark)}.pin .pibody.note{font-style:italic}
.pnext{margin-top:auto;font-family:var(--z-font);font-size:12.5px;font-weight:700;color:#fff;background:var(--z-dark);border:none;border-radius:var(--z-radius);padding:11px 14px;cursor:pointer;text-align:left}
.pnext:hover{background:var(--z-teal)}.pnext:disabled{opacity:.6;cursor:default}
.pout{background:var(--z-white);border:1px solid var(--z-purple-lt);border-radius:var(--z-radius);overflow:hidden;display:flex;flex-direction:column}
.pouth{padding:8px 14px;background:var(--z-lt);border-bottom:1px solid var(--z-purple-lt);font-size:11px;font-weight:700;color:var(--z-dark);display:flex;justify-content:space-between;align-items:center}
.pouth .flag{font-size:9px;font-weight:700;letter-spacing:.4px;text-transform:uppercase;color:var(--z-teal)}
.poutb{padding:13px;overflow:auto;flex:1}
.pgen{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:12px;color:var(--z-slate)}
.spin{width:16px;height:16px;border-radius:50%;border:2px solid rgba(39,187,175,.3);border-top-color:var(--z-teal);animation:sp .7s linear infinite}
@keyframes sp{to{transform:rotate(360deg)}}
.pgen .gtxt{font-size:12px;font-weight:600;color:var(--z-dark)}
.pstart{display:flex;align-items:center;justify-content:center;height:100%;color:var(--z-slate);text-align:center;font-size:12px;padding:0 20px;line-height:1.5}
.hgate{margin-top:11px;padding-top:9px;border-top:1px dashed var(--z-purple-lt);font-size:11px;color:var(--z-dark);display:flex;align-items:center;gap:7px}
.hgate .hgi{width:15px;height:15px;border-radius:50%;background:var(--z-mint);color:var(--z-dark);font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center;flex:none}
.hgate b{color:var(--z-teal)}
/* rich artifacts */
.afind{display:flex;gap:8px;align-items:flex-start;margin-bottom:8px;font-size:12px;line-height:1.4;color:var(--z-dark)}
.afind .fd{width:8px;height:8px;border-radius:50%;flex:none;margin-top:4px}
.fd.n{background:var(--z-teal)}.fd.a{background:#f0c000}.fd.r{background:var(--z-orange)}
.acall{background:var(--z-ice);border-radius:var(--z-radius);padding:9px 12px;font-size:11.5px;color:var(--z-dark);margin-top:2px}.acall b{color:var(--z-teal)}
.astory{background:var(--z-ice);border-radius:var(--z-radius);padding:11px 13px;margin-bottom:8px}
.astory .sk{font-size:10px;font-weight:700;color:#fff;background:var(--z-teal);border-radius:3px;padding:2px 7px}
.astory .snm{font-size:12px;font-weight:700;color:var(--z-dark);margin-left:6px}
.astory p{font-size:11.5px;line-height:1.5;color:var(--z-dark);margin:7px 0 6px}.astory p b{color:var(--z-teal)}
.astory ul{list-style:none;display:flex;flex-direction:column;gap:3px}
.astory li{position:relative;padding-left:14px;font-size:10.5px;line-height:1.35;color:var(--z-dark)}
.astory li::before{content:'\2713';position:absolute;left:0;color:var(--z-teal);font-weight:700;font-size:10px}
.atbl{border:1px solid var(--z-purple-lt);border-radius:var(--z-radius);overflow:hidden;margin-bottom:9px}
.atr{display:grid;grid-template-columns:104px 1fr;gap:10px;padding:8px 13px;border-bottom:1px solid var(--z-purple-lt);font-size:12px}
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
.awf .wt .wlive{margin-left:auto;font-size:8px;font-weight:700;letter-spacing:.4px;text-transform:uppercase;color:var(--z-teal);background:var(--z-ice);border-radius:20px;padding:2px 8px}
.awf .wch{cursor:pointer}
.awf .wtabs{display:flex;gap:16px;padding:0 11px;border-bottom:1px solid var(--z-purple-lt);background:#fff}
.awf .wtab{font-size:9.5px;color:var(--z-slate);padding:7px 0;border-bottom:2px solid transparent;cursor:pointer}
.awf .wtab.on{color:#0176d3;border-bottom-color:#0176d3;font-weight:700}
.awf .wrel{display:flex;justify-content:space-between;padding:8px 11px;border-bottom:1px solid var(--z-purple-lt);font-size:10.5px;color:var(--z-dark)}
.awf .wrel:last-child{border:none}.awf .wrel .ws{color:var(--z-slate)}
.awf .wact{padding:7px 11px;position:relative;padding-left:22px}
.awf .wact::before{content:'';position:absolute;left:11px;top:11px;width:6px;height:6px;border-radius:50%;background:var(--z-teal)}
.awf .wact b{font-size:10.5px;color:var(--z-dark)}.awf .wact span{font-size:9.5px;color:var(--z-slate);display:block}
.whint{font-size:10.5px;color:var(--z-teal);font-style:italic;margin-top:8px}
.adiag{background:var(--z-lt);border-radius:var(--z-radius);padding:8px 10px}
.atc{display:grid;grid-template-columns:52px 1fr 1fr;gap:8px;padding:6px 0;border-bottom:1px solid var(--z-purple-lt);font-size:11px;line-height:1.3}
.atc:last-child{border:none}.atc b{color:var(--z-teal);font-size:10px}.atc .ex{color:var(--z-slate)}
.acov{font-size:11px;color:var(--z-slate);font-style:italic;margin-top:7px}
/* results cascade */
.rescols{display:grid;grid-template-columns:1.35fr 1fr;gap:24px;margin-top:18px;align-items:center}
.reschart{background:var(--z-lt);border-radius:var(--z-radius);padding:16px 18px}
.reschart .rlegend{display:flex;gap:16px;margin-bottom:8px}
.reschart .rlegend span{font-size:10px;font-weight:700;color:var(--z-slate);display:inline-flex;align-items:center}
.reschart .rlegend i{width:14px;height:3px;border-radius:2px;margin-right:6px}
.reschart .rlegend .lt{background:var(--z-teal)}.reschart .rlegend .lo{background:var(--z-orange)}
.reschart .rcx{display:flex;justify-content:space-between;font-size:9px;color:var(--z-slate);margin-top:6px}
.restiles{display:flex;flex-direction:column;gap:11px}
.rtile{background:var(--z-lt);border-radius:var(--z-radius);padding:13px 16px}
.rtile b{font-size:13px;color:var(--z-teal);font-weight:700}
.rtile span{font-size:12px;color:var(--z-slate);display:block;margin-top:3px;line-height:1.4}
.resnote{margin-top:16px;font-size:12px;color:var(--z-slate);line-height:1.5;font-style:italic}
/* offer + rolodex + modal */
.offer{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:16px;align-items:center}
.olist{list-style:none;display:flex;flex-direction:column;gap:9px}
.olist li{position:relative;padding-left:16px;font-size:13px;line-height:1.45;color:var(--z-dark)}
.olist li::before{content:'\25CF';position:absolute;left:0;top:5px;font-size:6px;color:var(--z-teal)}
.subh{font-size:11px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;color:var(--z-teal);margin-bottom:12px}
.roms{font-size:11px;color:var(--z-slate);margin-top:12px}
.rolo{display:flex;flex-direction:column;align-items:center;justify-content:center}
.rolodex{position:relative;width:300px;height:180px;cursor:pointer;perspective:900px}
.rolospindle{position:absolute;top:-8px;left:50%;transform:translateX(-50%);width:120px;height:14px;background:var(--z-slate);border-radius:8px;z-index:5;display:flex;align-items:center;justify-content:space-between;padding:0 16px}
.rolospindle::before,.rolospindle::after{content:'';width:8px;height:8px;border-radius:50%;background:var(--z-lt)}
.rolostack .b{position:absolute;inset:0;top:6px;background:#fff;border:1px solid var(--z-purple-lt);border-radius:var(--z-radius)}
.rolostack .b1{transform:translateY(8px) scale(.97);opacity:.55}.rolostack .b2{transform:translateY(16px) scale(.94);opacity:.3}
.rolofront{position:absolute;inset:0;top:6px;background:#fff;border:1px solid var(--z-purple-lt);border-radius:var(--z-radius);padding:20px 22px;display:flex;flex-direction:column;justify-content:center;z-index:4;transform-origin:top center;backface-visibility:hidden}
.rolofront.flip{animation:flipc .16s ease}
@keyframes flipc{0%{transform:rotateX(0)}50%{transform:rotateX(-38deg)}100%{transform:rotateX(0)}}
.rolofront .rt{font-size:9px;font-weight:700;letter-spacing:.4px;text-transform:uppercase;color:#fff;background:var(--z-teal);border-radius:var(--z-radius-sm);padding:2px 8px;align-self:flex-start}
.rolofront .rn{font-size:18px;font-weight:700;color:var(--z-dark);margin:10px 0 6px}
.rolofront .rd{font-size:12px;line-height:1.45;color:var(--z-slate)}
.roarrow{background:var(--z-lt);border:1px solid var(--z-purple-lt);border-radius:var(--z-radius);color:var(--z-dark);font-size:13px;cursor:pointer;width:44px;height:26px;line-height:1}
.roarrow:hover{border-color:var(--z-teal);color:var(--z-teal)}
.rolo .rolodex{margin:10px 0}
.rolohint{font-size:11px;color:var(--z-slate);margin-top:12px}
/* modal */
.mscrim{position:fixed;inset:0;background:rgba(28,74,77,.5);opacity:0;pointer-events:none;transition:opacity .18s;z-index:70}
.mscrim.on{opacity:1;pointer-events:auto}
.modal{position:fixed;top:50%;left:50%;transform:translate(-50%,-48%) scale(.98);width:720px;max-width:94vw;background:#fff;border-radius:var(--z-radius);z-index:71;opacity:0;pointer-events:none;transition:opacity .18s,transform .18s;overflow:hidden}
.modal.on{opacity:1;pointer-events:auto;transform:translate(-50%,-50%) scale(1)}
.modal .mh{background:var(--z-dark);color:#fff;padding:30px 36px;position:relative}
.modal .mh .mt{font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--z-teal-light)}
.modal .mh h3{font-size:30px;font-weight:700;color:#fff;margin-top:10px;line-height:1.1}
.modal .mclose{position:absolute;top:22px;right:24px;background:rgba(255,255,255,.14);border:none;color:#fff;width:34px;height:34px;border-radius:var(--z-radius);font-size:18px;cursor:pointer}
.modal .mb{padding:28px 36px 32px}
.modal .msum{font-size:16px;line-height:1.6;color:var(--z-dark)}
.modal .msec{font-size:11px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:var(--z-teal);margin:22px 0 12px}
.modal ul{list-style:none;display:flex;flex-direction:column;gap:9px}
.modal li{position:relative;padding-left:18px;font-size:14px;line-height:1.5;color:var(--z-dark)}
.modal li::before{content:'\25CF';position:absolute;left:0;top:6px;font-size:6px;color:var(--z-teal)}
.modal .mcols{display:grid;grid-template-columns:1fr 1fr;gap:30px}
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

# ---- funnel (GESA-mirrored) ----
SEGMENTS=[("Intake","Discovery, requirements, approvals"),
          ("Design","Stories, solution design, wireframes"),
          ("Build","Development against the backlog"),
          ("Test","QA against acceptance criteria"),
          ("Release &amp; adoption","Deploy, change, training")]
PHASES=[
 ("We are here","The top of the funnel holds the interpretive work","Intake and design are where the manual, interpretive work concentrates. Nothing downstream is broken, it is starved, waiting on that work to reach it."),
 ("Enable intake","Discovery and requirements drafted for review","Intake opens. Structured, traceable requirements reach design faster, so the constraint moves to design."),
 ("Enable design","Stories, solution design and wireframes drafted for review","Design keeps pace with intake. More build-ready work reaches the sprint, so the constraint moves to build."),
 ("Enable build","AI-assisted development across the team","Build absorbs the higher volume. The pressure moves again, to test."),
 ("Enable test","Test scripts generated from acceptance criteria","Coverage stops inheriting gaps in the story. The last narrow point is getting the work adopted."),
 ("Enable release &amp; adoption","Go-live material, training, and throughput in view","The funnel is open end to end, from intake to a live, adopted platform."),
]
SEG_JSON=json.dumps([{"n":s[0],"d":s[1]} for s in SEGMENTS])
PH_JSON=json.dumps([{"k":p[0],"b":p[1],"note":p[2]} for p in PHASES])
def funnel_segs():
    bounds=[100,86,73,62,52,44]
    out=""
    for i,s in enumerate(SEGMENTS):
        top=bounds[i]; bot=bounds[i+1]
        clip=f"polygon({(100-top)/2:.1f}% 0,{(100+top)/2:.1f}% 0,{(100+bot)/2:.1f}% 100%,{(100-bot)/2:.1f}% 100%)"
        out+=f'<button class="fseg2" data-i="{i}" onclick="setPhase({i})" style="clip-path:{clip};-webkit-clip-path:{clip}"><div class="fsn">{s[0]}</div><div class="fst" id="fst{i}"></div></button>'
    return out

# ---- pipeline artifacts (rich) + human gate ----
A_FIND=('<div class="afind"><span class="fd r"></span>Cases are logged across three systems, and the originating branch is often lost.</div>'
        '<div class="afind"><span class="fd a"></span>No single owner for follow-up once the call ends.</div>'
        '<div class="afind"><span class="fd a"></span>Reporting can\'t break cases down by branch.</div>'
        '<div class="afind"><span class="fd n"></span>Security and sharing model are already sound.</div>'
        '<div class="acall"><b>Gap flagged:</b> no SLA on response time, and no way to measure it.</div>'
        '<div class="hgate"><span class="hgi">&#10003;</span>Drafted for review &mdash; <b>your BA confirms</b> before it becomes stories.</div>')
A_STORY=('<div class="astory"><span class="sk">US-118</span><span class="snm">Member case intake</span>'
         '<p><b>As a</b> branch rep, <b>I want</b> to log an issue in one screen <b>so that</b> nothing falls through.</p>'
         '<ul><li>One-screen capture of member, branch, type, description.</li><li>Branch is required on every case.</li><li>Submit routes the case to the branch queue.</li></ul></div>'
         '<div class="astory"><span class="sk">US-119</span><span class="snm">Route to owning branch</span>'
         '<p><b>As a</b> manager, <b>I want</b> new cases in my queue <b>so that</b> my team owns follow-up.</p>'
         '<ul><li>Case routes to the originating branch on submit.</li><li>Reassignment is logged.</li></ul></div>'
         '<div class="hgate"><span class="hgi">&#10003;</span><b>Your product owner grooms</b> and accepts before design.</div>')
A_DESIGN=('<div class="atbl">'
          '<div class="atr"><span class="al">UI</span><span class="ar">Lightning record page + quick action for one-screen intake</span></div>'
          '<div class="atr"><span class="al">Objects</span><span class="ar">Case + custom Branch__c lookup; SLA field on Case</span></div>'
          '<div class="atr"><span class="al">Automation</span><span class="ar">Record-triggered Flow routes to the branch queue; no Apex</span></div>'
          '<div class="atr"><span class="al">Sharing</span><span class="ar">Role hierarchy + branch-based sharing rule</span></div>'
          '<div class="atr"><span class="al">Integration</span><span class="ar">Platform event to core banking; idempotent, retried</span></div>'
          '<div class="atr"><span class="al">Reporting</span><span class="ar">Cases by branch, by type, by SLA status</span></div></div>'
          '<div class="acall"><b>Decision:</b> configuration over code &mdash; Flow-based routing keeps it admin-maintainable and auditable.</div>'
          '<div class="hgate"><span class="hgi">&#10003;</span><b>Your architect owns the design</b> &mdash; accept, change, or reject.</div>')
A_DIAG=('<div class="adiag"><svg viewBox="0 0 440 236" width="100%" preserveAspectRatio="xMidYMid meet">'
        '<g stroke="var(--z-slate)" stroke-width="1.5" fill="none">'
        '<line x1="220" y1="60" x2="220" y2="94"/><line x1="220" y1="138" x2="110" y2="172"/><line x1="200" y1="196" x2="240" y2="196"/></g>'
        '<g font-size="8" fill="var(--z-slate)"><text x="226" y="82">user action</text><text x="203" y="190">platform event</text></g>'
        '<g><rect x="90" y="16" width="260" height="44" rx="6" fill="var(--z-teal)"/>'
        '<text x="220" y="35" text-anchor="middle" fill="#fff" font-size="12" font-weight="700">Experience</text>'
        '<text x="220" y="50" text-anchor="middle" fill="#eafaf7" font-size="9">Lightning record page + quick action</text></g>'
        '<g><rect x="90" y="94" width="260" height="44" rx="6" fill="var(--z-dark)"/>'
        '<text x="220" y="113" text-anchor="middle" fill="#fff" font-size="12" font-weight="700">Automation</text>'
        '<text x="220" y="128" text-anchor="middle" fill="rgba(255,255,255,.78)" font-size="9">Record-triggered Flow &middot; routing + SLA</text></g>'
        '<g><rect x="20" y="172" width="180" height="48" rx="6" fill="#fff" stroke="var(--z-purple-lt)"/>'
        '<text x="110" y="192" text-anchor="middle" fill="var(--z-dark)" font-size="11" font-weight="700">Case + Branch__c</text>'
        '<text x="110" y="207" text-anchor="middle" fill="var(--z-slate)" font-size="8.5">data model</text></g>'
        '<g><rect x="240" y="172" width="180" height="48" rx="6" fill="#fff" stroke="var(--z-purple-lt)"/>'
        '<text x="330" y="192" text-anchor="middle" fill="var(--z-dark)" font-size="11" font-weight="700">Core banking</text>'
        '<text x="330" y="207" text-anchor="middle" fill="var(--z-slate)" font-size="8.5">system of record</text></g>'
        '</svg></div>'
        '<div class="acall"><b>Noted for build:</b> keep Branch as a lookup, not free text, so cases stay reportable by branch.</div>'
        '<div class="hgate"><span class="hgi">&#10003;</span><b>Your architect approves the design</b> before build starts.</div>')
A_WIRE=('<div class="awf"><div class="wt"><span class="wo">CASE</span><span class="wtt">New Member Case</span><span class="wlive">live mock</span></div>'
        '<div class="wpath">'
        '<span class="wch cur" onclick="wfPath(this)">New</span><span class="wch" onclick="wfPath(this)">In progress</span>'
        '<span class="wch" onclick="wfPath(this)">Escalated</span><span class="wch" onclick="wfPath(this)">Resolved</span>'
        '<span class="wch" onclick="wfPath(this)">Closed</span></div>'
        '<div class="wtabs"><span class="wtab on" onclick="wfTab(this,\'d\')">Details</span>'
        '<span class="wtab" onclick="wfTab(this,\'r\')">Related</span><span class="wtab" onclick="wfTab(this,\'a\')">Activity</span></div>'
        '<div class="wpane" id="wp-d"><div class="wff">'
        '<div class="wfi"><span>Subject</span><div class="bx"></div></div><div class="wfi"><span>Member</span><div class="bx"></div></div>'
        '<div class="wfi"><span>Case Type</span><div class="bx"></div></div><div class="wfi warn"><span>Branch <em>required</em></span><div class="bx"></div></div>'
        '<div class="wfi full"><span>Description</span><div class="bx" style="height:22px"></div></div></div></div>'
        '<div class="wpane" id="wp-r" style="display:none"><div class="wrel"><span>Member &middot; J. Rivera</span><span class="ws">3 open cases</span></div>'
        '<div class="wrel"><span>Account &middot; ****4821</span><span class="ws">Checking</span></div>'
        '<div class="wrel"><span>Branch &middot; Downtown</span><span class="ws">Queue owner</span></div></div>'
        '<div class="wpane" id="wp-a" style="display:none"><div class="wact"><b>Case created</b><span>by S. Chen &middot; just now</span></div>'
        '<div class="wact"><b>Auto-assigned</b><span>Downtown branch queue</span></div>'
        '<div class="wact"><b>SLA started</b><span>4h response target</span></div></div></div>'
        '<div class="whint">Click the path stages or the tabs &mdash; the mock is live.</div>'
        '<div class="hgate"><span class="hgi">&#10003;</span>Adjusted, not built from zero &mdash; <b>your team refines it</b> before build.</div>')
A_TEST=('<div class="atc"><b>TC-01</b><span>Create with all fields</span><span class="ex">Saved, routed to queue</span></div>'
        '<div class="atc"><b>TC-02</b><span>Submit with no branch</span><span class="ex">Blocked, error shown</span></div>'
        '<div class="atc"><b>TC-03</b><span>Duplicate member + subject</span><span class="ex">Warn, allow override</span></div>'
        '<div class="atc"><b>TC-04</b><span>SLA passes 4h</span><span class="ex">Case escalates</span></div>'
        '<div class="acov">14 cases: happy path, edge, and negative. ~92% coverage.</div>'
        '<div class="hgate"><span class="hgi">&#10003;</span><b>Your QA signs off</b> the suite before the release gate.</div>')
PIPE=[
 {"stage":"Discovery findings","frm":"Workshop notes","in":'"When a member calls the branch, the rep opens three systems to log it, and the branch is often lost."',"innote":True,"gen":["Reading workshop notes…","Clustering needs…","Flagging gaps & risks…","Tracing to the source…"],"art":A_FIND},
 {"stage":"User stories","frm":"Discovery findings","in":"3 issues and 1 gap, prioritized and traced to the source.","innote":False,"gen":["Splitting findings into stories…","Writing acceptance criteria…","Grooming the backlog…"],"art":A_STORY},
 {"stage":"Solution design","frm":"User stories","in":"2 build-ready stories with acceptance criteria.","innote":False,"gen":["Selecting components & patterns…","Designing the data model…","Documenting the decision…"],"art":A_DESIGN},
 {"stage":"Architecture diagram","frm":"Solution design","in":"The proposed design: objects, automation, sharing, integration.","innote":False,"gen":["Mapping components…","Drawing the layers…","Tracing the integration…"],"art":A_DIAG},
 {"stage":"Wireframe","frm":"Approved design","in":"A reviewed, build-ready design, one risk fixed.","innote":False,"gen":["Choosing Lightning components…","Laying out fields…","Rendering the live mock…"],"art":A_WIRE},
 {"stage":"Test cases","frm":"Wireframe + stories","in":"The Case screen and its acceptance criteria.","innote":False,"gen":["Deriving scenarios…","Writing expected results…","Covering edge & negative…"],"art":A_TEST},
]
PIPE_JSON=json.dumps(PIPE)

# ---- rolodex skills (with modal detail) ----
SKILLS=[
 ("Skill","Business Requirements Document","Turns discovery workshops and notes into a complete, traceable requirements document.",
  ["Translating discovery into a delivery backlog","Defining scope for a new build","Aligning business and technical teams on “done”"],
  ["A structured BRD with acceptance criteria","A requirement-to-objective traceability matrix"]),
 ("Skill","Story & Design Writer","Turns requirements into paired user stories and matching solution-design detail, in lockstep.",
  ["Detailing a feature from requirement to design","Keeping backlog and design aligned","Producing build-ready, traceable stories"],
  ["Build-ready user stories with acceptance criteria","An editable Salesforce wireframe"]),
 ("Skill","Solution Design","Translates requirements into a build-ready solution design, from blueprint to configuration detail.",
  ["Designing a platform build","A build-ready blueprint before Sprint 1","Documenting design decisions for sign-off"],
  ["A solution blueprint","Documented, defensible design decisions"]),
 ("Skill","QA Test Writer","Generates executable test cases directly from user stories: happy path, edge, and negative.",
  ["Building test coverage for a release","Covering edge cases in a critical feature","Standing up regression for launch"],
  ["A full test-case suite from the stories","Coverage across happy, edge, and negative"]),
 ("Skill","Data Model Advisor","Guides sound, defensible data-model decisions and reviews schemas for problems.",
  ["Designing the data model for a build","Reviewing a schema for scale","Making a defensible structural decision early"],
  ["A recommended data model","Flagged risks and over-customization"]),
 ("Skill","Deployment Runbook","Produces the operational playbook for go-live: cutover, rollback, hypercare, handover.",
  ["Planning a go-live weekend","Coordinating cutover and rollback","Setting up hypercare and handover"],
  ["A minute-by-minute cutover runbook","Rollback triggers and a hypercare model"]),
 ("Skill","Architecture Health Check","Reviews an existing or inherited environment and flags risks, tech debt, and constraints.",
  ["Assessing an inherited org","De-risking a modernization","Reviewing an org for tech debt"],
  ["A scored risk read","Prioritized remediation"]),
 ("Skill","Test Strategy & UAT Plan","Lays out how the solution is tested and validated before go-live.",
  ["Planning UAT for a launch","Defining go/no-go criteria","Structuring defect triage"],
  ["A test strategy and UAT plan","Entry/exit criteria and a go/no-go gate"]),
 ("Skill","Change & Enablement Plan","Builds the people side of change: stakeholders, comms, training, and a 90-day adoption plan.",
  ["Driving adoption of a new platform","Training client teams","Planning comms for a rollout"],
  ["A stakeholder and comms plan","A 90-day adoption plan"]),
 ("Skill","Discovery Session Planning","Plans the full discovery phase: sessions, sequencing, question banks, facilitator guides.",
  ["Planning discovery for a transformation","Sequencing workshops across teams","Building a diagnostic agenda"],
  ["A discovery agenda and schedule","Question banks and facilitator guides"]),
]
SKILLS_JSON=json.dumps([{"t":s[0],"n":s[1],"s":s[2],"u":s[3],"d":s[4]} for s in SKILLS])

# ---- flowing results curve ----
def smooth_path(pts):
    if len(pts)<2: return ""
    d=f"M{pts[0][0]:.1f},{pts[0][1]:.1f}"
    for i in range(len(pts)-1):
        p0=pts[i-1] if i>0 else pts[0]; p1=pts[i]; p2=pts[i+1]; p3=pts[i+2] if i+2<len(pts) else p2
        c1x=p1[0]+(p2[0]-p0[0])/6; c1y=p1[1]+(p2[1]-p0[1])/6
        c2x=p2[0]-(p3[0]-p1[0])/6; c2y=p2[1]-(p3[1]-p1[1])/6
        d+=f" C{c1x:.1f},{c1y:.1f} {c2x:.1f},{c2y:.1f} {p2[0]:.1f},{p2[1]:.1f}"
    return d
def res_chart():
    W,Hc=320,150
    xs=[16+i*(W-32)/4 for i in range(5)]
    def ypts(v): return [(xs[i],Hc-16-(v[i]/100)*(Hc-38)) for i in range(5)]
    thr=ypts([26,42,58,74,90])      # throughput up (teal)
    tim=ypts([90,73,56,40,26])      # time to production down (orange)
    lt=smooth_path(thr); li=smooth_path(tim)
    area=lt+f" L{thr[-1][0]:.1f},{Hc-8} L{thr[0][0]:.1f},{Hc-8} Z"
    dt="".join(f'<circle cx="{p[0]:.1f}" cy="{p[1]:.1f}" r="3.2" fill="var(--z-teal)"/>' for p in thr)
    di="".join(f'<circle cx="{p[0]:.1f}" cy="{p[1]:.1f}" r="3.2" fill="var(--z-orange)"/>' for p in tim)
    return (f'<svg viewBox="0 0 {W} {Hc}" width="100%" style="height:150px">'
            f'<path d="{area}" fill="var(--z-ice)"/>'
            f'<path d="{li}" fill="none" stroke="var(--z-orange)" stroke-width="2.5" stroke-linecap="round"/>'
            f'<path d="{lt}" fill="none" stroke="var(--z-teal)" stroke-width="2.5" stroke-linecap="round"/>{dt}{di}</svg>')

SL=[]
motif=('<div class="motif">'
 '<div class="mseg" style="width:100%">Intake</div><div class="marr">&darr;</div>'
 '<div class="mseg" style="width:84%">Design</div><div class="marr">&darr;</div>'
 '<div class="mseg d" style="width:68%">Build</div><div class="marr">&darr;</div>'
 '<div class="mseg" style="width:54%">Test</div><div class="marr">&darr;</div>'
 '<div class="mseg" style="width:42%">Release</div></div>')
# 0 cover
SL.append(f'''<div class="slide dark active" data-i="0"><div class="cover">
<div class="l"><img class="logo" src="{WHITE}" alt="Zennify" style="margin-bottom:auto">
<span class="eyebrow rv">AI-enabled services delivery</span>
<h1 class="rv">Your teams, delivering on an AI value chain.</h1>
<p class="sub rv">We reapply the skills, agents, and processes proven across our delivery work, and enable them inside your teams&rsquo; own implementation lifecycle, one part at a time.</p>
</div><div class="r">{motif}</div></div></div>''')
# 1 what changed
SL.append(f'''<div class="slide" data-i="1"><div class="pad">
<span class="eyebrow rv">What changed</span>
<h1 class="rv">AI moved from pilot to production inside delivery.</h1>
<p class="lead rv">The question for your teams is no longer whether to use AI on an implementation. It is whether each part of your delivery lifecycle is set up to use it well, on your data and under your controls.</p>
<div class="cols2 rv">
<div class="card out"><div class="ch">Point tools, in isolation</div><p>An assistant here, a script there, used by whoever knows about them. Effort goes up. Consistency across your teams does not.</p></div>
<div class="card acc"><div class="ch">Enabled across the lifecycle</div><p>Proven skills, agents, and processes enabled part by part inside your teams&rsquo; existing process, and measured on your platform.</p></div>
</div></div>{foot()}</div>''')
# 2 cost of waiting
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
# 3 POV
SL.append(f'''<div class="slide dark" data-i="3"><div class="pad">
<span class="eyebrow rv">How we work</span>
<h1 class="rv">We enable each part of your funnel. We don&rsquo;t replace your teams.</h1>
<p class="lead rv">This is not a rip-and-replace, or another tool for your people to learn on their own. We bring proven skills, agents, and processes, and enable them stage by stage inside your existing delivery lifecycle, on your platform and under your governance.</p>
<div class="beliefs rv">
<div class="belief"><span class="n">1</span><p>We enable your process. We don&rsquo;t replace it.</p></div>
<div class="belief"><span class="n">2</span><p>We start where the constraint is, and enable one part at a time.</p></div>
<div class="belief"><span class="n">3</span><p>Everything runs, and is measured, on your own platform.</p></div>
</div></div>{foot()}</div>''')
# 4 funnel (GESA mirror)
SL.append(f'''<div class="slide" data-i="4"><div class="pad">
<span class="eyebrow">How it scales</span>
<h1 style="font-size:31px">Relieve the top of the funnel. Then follow it down.</h1>
<p style="font-size:13px;color:var(--z-slate);margin-top:6px">Every stage is throttled by the one above it. Step through and watch the constraint move.</p>
<div class="enfun">
<div class="funcol"><div class="flabel">Requests in</div><div class="funnel2" id="funnel2">{funnel_segs()}</div><div class="flabel">Delivered value out</div></div>
<div><div class="fpeyebrow" id="fp-k"></div><div class="fphead" id="fp-b"></div><p class="fpnote" id="fp-note"></p>
<button class="enbtn" id="enbtn" onclick="nextPhase()">Enable next phase &rarr;</button></div>
</div></div>{foot()}</div>''')
# 5 human-in-the-loop
SL.append(f'''<div class="slide" data-i="5"><div class="pad">
<span class="eyebrow rv">Where AI fits</span>
<h1 class="rv">The machine assembles. Your people decide.</h1>
<div class="hcols rv">
<div class="hpanel ai"><div class="he">AI &middot; does the assembly</div>
<div class="hrow"><b>Connects</b><span>Transcripts, prior decisions, standards, and live org metadata into one context.</span></div>
<div class="hrow"><b>Drafts</b><span>Requirements, stories, acceptance criteria, design, and wireframes.</span></div>
<div class="hrow"><b>Challenges</b><span>Missing scenarios and design risk, flagged before a developer sees the ticket.</span></div>
<div class="hf">Volume work, in minutes, at consistent quality.</div></div>
<div class="handoff"><span class="ha">&rarr;</span><span class="hl">Hand-off</span></div>
<div class="hpanel"><div class="he">Your people &middot; stay in control</div>
<div class="hrow"><b>Validate the need</b><span>Your team confirms what the business asked for, source in hand.</span></div>
<div class="hrow"><b>Own the design</b><span>Accept, change, or reject. Feasibility stays with your technical group.</span></div>
<div class="hrow"><b>Release it</b><span>Nothing reaches a sprint without a human decision. Every gate is a person.</span></div>
<div class="hf">Judgement work, where it changes the outcome.</div></div>
</div>
<div class="shiftband rv"><div class="sb"><b>Today</b><p>Your teams produce every artifact from scratch.</p></div>
<div class="sarr">&rarr;</div>
<div class="sb now"><b>The shift</b><p>Your teams review, correct, and approve. Same people, same standards, judgement applied where it is worth the most.</p></div></div>
</div>{foot()}</div>''')
# 6 pipeline
SL.append(f'''<div class="slide" data-i="6"><div class="pad">
<span class="eyebrow">One part feeds the next</span>
<h1 style="font-size:28px">Step through it. The machine drafts; your people approve.</h1>
<div class="pipehdr" id="pipehdr"></div>
<div class="pipe2">
<div class="pin"><div class="pil">Input</div><div class="pifrom" id="pin-from"></div><div class="pibody" id="pin-body"></div>
<button class="pnext" id="pnext" onclick="pipeNext()"></button></div>
<div class="pout"><div class="pouth"><span id="pout-title">Output</span><span class="flag" id="pout-flag"></span></div>
<div class="poutb" id="pout-body"><div class="pstart">Step through the delivery pipeline. Each artifact is drafted, reviewed by your team, and feeds the next.</div></div></div>
</div></div>{foot()}</div>''')
# 7 results
SL.append(f'''<div class="slide" data-i="7"><div class="pad">
<span class="eyebrow rv">Measurable results</span>
<h1 class="rv">Results compound as the enablement cascades.</h1>
<div class="rescols rv">
<div class="reschart"><div class="rlegend"><span><i class="lt"></i>Throughput</span><span><i class="lo"></i>Time to production</span></div>{res_chart()}
<div class="rcx"><span>Intake</span><span>Design</span><span>Build</span><span>Test</span><span>Release</span></div></div>
<div class="restiles">
<div class="rtile"><b>More throughput</b><span>the same team ships more, sprint over sprint</span></div>
<div class="rtile"><b>Faster to production</b><span>time from intake to live keeps dropping</span></div>
<div class="rtile"><b>Less rework</b><span>each stage hands off cleaner work to the next</span></div>
</div></div>
<p class="resnote rv">These are outcomes that can be measured on your own delivery, using your own data, as each part of the funnel is enabled.</p>
</div>{foot()}</div>''')
# 8 offer + rolodex
SL.append(f'''<div class="slide" data-i="8"><div class="pad">
<span class="eyebrow rv">What we bring</span>
<h1 class="rv">A library of skills, ready to enable in your process.</h1>
<div class="offer rv">
<div><div class="subh">What we bring</div>
<ul class="olist"><li>The delivery value chain, enabled inside your teams&rsquo; existing process.</li><li>A working set of skills and agents, configured on your org.</li><li>Your teams enabled to run the motion, with us alongside.</li></ul>
<div class="roms">Browse the skills that power the funnel. Click a card to see what it does.</div></div>
<div class="rolo">
<button class="roarrow" onclick="roloStep(-1)">&#9650;</button>
<div class="rolodex" id="rolodex" onclick="openSkill()">
<div class="rolospindle"></div>
<div class="rolostack"><div class="b b2"></div><div class="b b1"></div></div>
<div class="rolofront" id="rolofront"><div class="rn" id="ro-n"></div><div class="rd" id="ro-d"></div></div>
</div>
<button class="roarrow" onclick="roloStep(1)">&#9660;</button>
<div class="rolohint" id="rolohint"></div></div>
</div></div>{foot()}</div>''')
# 9 fit
SL.append(f'''<div class="slide" data-i="9"><div class="pad">
<span class="eyebrow rv">Is this you?</span>
<h1 class="rv">Built for teams that deliver, again and again.</h1>
<div class="cols2 rv" style="margin-top:20px">
<div class="card acc"><div class="ch">Where this fits</div>
<ul class="olist"><li>You run implementations continuously, not as a one-off project.</li><li>Delivery leaders feel the cost of rework and inconsistency.</li><li>You&rsquo;re ready to measure outcomes on your own data.</li><li>You have governance and audit standards to meet.</li></ul></div>
<div class="card out"><div class="ch">Where it doesn&rsquo;t</div>
<ul class="olist"><li>You want a single AI feature or chatbot, not a delivery motion.</li><li>There&rsquo;s no appetite to change how delivery runs.</li><li>Measuring results isn&rsquo;t a priority yet.</li></ul></div>
</div></div>{foot()}</div>''')
# 10 next step
SL.append(f'''<div class="slide" data-i="10"><div class="pad">
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
SL.append(f'''<div class="slide dark close" data-i="11"><div class="pad" style="justify-content:center">
<img class="logo rv" src="{WHITE}" alt="Zennify" style="margin-bottom:26px">
<span class="eyebrow rv">AI-enabled services delivery</span>
<h1 class="rv">A delivery lifecycle that gets faster every time you run it.</h1>
<p class="lead rv">Let&rsquo;s start with the stage that costs you the most, prove it on your data, and enable the rest of the lifecycle together.</p>
<span class="cta rv">Map your accelerated delivery lifecycle</span>
</div>{foot()}</div>''')

N=len(SL)
dots="".join(f'<span class="dot {"on" if i==0 else ""}" onclick="go({i})"></span>' for i in range(N))
FLOW_SLIDE=6; ROLO_SLIDE=8

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
addEventListener('keydown',e=>{{if(e.key==='Escape'){{closeSkill();return;}}if(e.key==='ArrowRight'||e.key===' '){{e.preventDefault();next();}}if(e.key==='ArrowLeft')prev();}});
// funnel: constraint / starved / enabled
const SEG={SEG_JSON},PH={PH_JSON},NP=SEG.length;let phase=0;
function paintFunnel(){{
 for(let i=0;i<NP;i++){{
  const el=document.querySelectorAll('#funnel2 .fseg2')[i];const st=document.getElementById('fst'+i);
  el.classList.remove('enabled','starved','constraint');
  if(phase>=NP||i<phase){{el.classList.add('enabled');st.textContent='Enabled';}}
  else if(i===phase){{el.classList.add('constraint');st.textContent='Constraint';}}
  else{{el.classList.add('starved');st.textContent='Starved';}}
 }}
 const p=PH[Math.min(phase,PH.length-1)];
 document.getElementById('fp-k').textContent=p.k;document.getElementById('fp-b').innerHTML=p.b;document.getElementById('fp-note').innerHTML=p.note;
 document.getElementById('enbtn').textContent=phase>=NP?'↻ Reset':'Enable next phase →';
}}
function nextPhase(){{phase=phase>=NP?0:phase+1;paintFunnel();}}
function setPhase(i){{phase=i;paintFunnel();}}
paintFunnel();
// manual pipeline
const PIPE={PIPE_JSON};let pDone=0,pBusy=false,pTimers=[];
function clearP(){{pTimers.forEach(t=>clearTimeout(t));pTimers=[];}}
function renderPHdr(genIdx){{
 document.getElementById('pipehdr').innerHTML=PIPE.map((p,i)=>{{
  const cls=(i===genIdx)?'cur':(i<pDone?'done':'');const a=i<PIPE.length-1?'<span class=parrow>&rsaquo;</span>':'';
  return `<span class="ppill ${{cls}}"><span class=pd></span>${{p.stage}}</span>${{a}}`;}}).join('');
}}
function renderInput(i){{
 const p=PIPE[i];document.getElementById('pin-from').textContent='from '+p.frm;
 const bd=document.getElementById('pin-body');bd.className='pibody'+(p.innote?' note':'');bd.innerHTML=p.in;
 const btn=document.getElementById('pnext');btn.disabled=false;btn.textContent=(i===0?'▶ Generate ':'Generate next: ')+p.stage+' →';
}}
function resetPipe(){{clearP();pDone=0;pBusy=false;renderPHdr(0);renderInput(0);
 document.getElementById('pout-title').textContent='Output';document.getElementById('pout-flag').textContent='';
 document.getElementById('pout-body').innerHTML='<div class="pstart">Step through the delivery pipeline. Each artifact is drafted, reviewed by your team, and feeds the next.</div>';}}
function pipeNext(){{
 if(pBusy)return;
 if(pDone>=PIPE.length){{resetPipe();return;}}
 const s=pDone;const p=PIPE[s];pBusy=true;
 const btn=document.getElementById('pnext');btn.disabled=true;btn.textContent='Generating…';
 renderPHdr(s);  // highlight the step being generated, not the next
 document.getElementById('pout-title').textContent=p.stage;document.getElementById('pout-flag').textContent='';
 const body=document.getElementById('pout-body');
 body.innerHTML='<div class="pgen"><span class="spin"></span><span class="gtxt" id="pgt">'+p.gen[0]+'</span></div>';
 let g=0;const gt=document.getElementById('pgt');
 const tick=setInterval(()=>{{g++;if(g<p.gen.length)gt.textContent=p.gen[g];}},640);
 pTimers.push(setTimeout(()=>{{
  clearInterval(tick);body.innerHTML=p.art;document.getElementById('pout-flag').textContent='Drafted for review';
  pDone=s+1;renderPHdr(s);pBusy=false;   // keep the just-generated step highlighted
  if(pDone>=PIPE.length){{const b=document.getElementById('pnext');b.disabled=false;b.textContent='↻ Start over';
    document.getElementById('pin-from').textContent='complete';document.getElementById('pin-body').className='pibody';
    document.getElementById('pin-body').textContent='Notes became stories, design, a screen, and tests, each reviewed by your team along the way.';}}
  else renderInput(pDone);
 }},p.gen.length*640+300));
}}
// interactive wireframe (inside the pipeline artifact)
function wfPath(el){{el.parentNode.querySelectorAll('.wch').forEach(x=>x.classList.remove('cur'));el.classList.add('cur');}}
function wfTab(el,k){{el.parentNode.querySelectorAll('.wtab').forEach(x=>x.classList.remove('on'));el.classList.add('on');['d','r','a'].forEach(p=>{{const n=document.getElementById('wp-'+p);if(n)n.style.display=(p===k)?'':'none';}});}}
// rolodex + modal
const SKILLS={SKILLS_JSON};let roloInit=false,roloIdx=0;
function showRolo(i){{roloIdx=(i+SKILLS.length)%SKILLS.length;const s=SKILLS[roloIdx];
 document.getElementById('ro-n').textContent=s.n;document.getElementById('ro-d').textContent=s.s;
 document.getElementById('rolohint').textContent=(roloIdx+1)+' / '+SKILLS.length+'  ·  click for details';
 const f=document.getElementById('rolofront');f.classList.remove('flip');void f.offsetWidth;f.classList.add('flip');}}
function roloStep(d){{showRolo(roloIdx+d);}}
function openSkill(){{const s=SKILLS[roloIdx];
 document.getElementById('mo-n').textContent=s.n;
 document.getElementById('mo-s').textContent=s.s;
 document.getElementById('mo-u').innerHTML=s.u.map(x=>`<li>${{x}}</li>`).join('');
 document.getElementById('mo-d').innerHTML=s.d.map(x=>`<li>${{x}}</li>`).join('');
 document.getElementById('mscrim').classList.add('on');document.getElementById('modal').classList.add('on');}}
function closeSkill(){{document.getElementById('mscrim').classList.remove('on');document.getElementById('modal').classList.remove('on');}}
render();
"""

MODAL=f'''<div class="mscrim" id="mscrim" onclick="closeSkill()"></div>
<div class="modal" id="modal"><div class="mh"><h3 id="mo-n"></h3><button class="mclose" onclick="closeSkill()">&times;</button></div>
<div class="mb"><div class="msum" id="mo-s"></div>
<div class="mcols"><div><div class="msec">Use cases</div><ul id="mo-u"></ul></div><div><div class="msec">Deliverables</div><ul id="mo-d"></ul></div></div>
</div></div>'''

HTML=f'''<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Zennify &middot; AI-Enabled Services Delivery</title><style>{CSS}</style></head>
<body><div class="prog" id="prog"></div><div id="deck">{"".join(SL)}</div>{MODAL}
<div class="nav"><button onclick="prev()">&#8249;</button><div class="dots">{dots}</div><button onclick="next()">&#8250;</button><span class="count" id="count">1 / {N}</span></div>
<script>{JS}</script></body></html>'''
open("delivery.html","w").write(HTML)
print("wrote delivery.html",len(HTML),"bytes,",N,"slides")
