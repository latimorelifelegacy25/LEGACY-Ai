import React, { useState } from "react";

// ─── Brand ───────────────────────────────────────────────────────────────────
const B = { 
  navy: "#2C3E50", 
  slate: "#3D5166", 
  gold: "#C49A6C", 
  goldLight: "#D4AE86",
  goldDark: "#A07840", 
  cream: "#FAF7F2", 
  charcoal: "#1A2530", 
  green: "#2E6B3E", 
  red: "#8B1A1A" 
};

export interface CaseStudy {
  name: string;
  premium: string;
  result: string;
}

export interface Product {
  id: string;
  name: string;
  carrier: string;
  carrierShort: string;
  type: string;
  tag: string;
  color: string;
  surrenderYrs: number;
  issueAges: string;
  minPremium: string;
  freeWithdrawal: string;
  mgsv: string;
  surrenderSchedule: number[];
  indexes: string[];
  strategies: string[];
  riders: string[];
  incomeBenefit: boolean;
  liberFee: string;
  liberCost: number | null;
  wellbeingBenefit: boolean;
  keyPoints: string[];
  bestFor: string[];
  notFor: string[];
  excludedStates: string[];
  highlight: string;
  iavRate?: string;
  payoutTable?: string;
  incomeStart?: string;
  wellbeingDetail?: string;
  spousalContinuation?: boolean;
  rmdFriendly?: boolean;
  caseStudies?: CaseStudy[];
  bavBonus?: string;
  bavMultiplier?: string;
  payoutByAge?: Record<string, string>;
  payoutNote?: string;
  enhancedDB?: string;
  glwbRollUp?: string;
  lpaOptions?: string[];
  levelPayoutSingle?: Record<string, string>;
  levelPayoutJoint?: Record<string, string>;
  nursingMultiplier?: string;
  lpaReserve?: string;
  exampleRollup?: number[];
}

// ─── Product Database (from all 6 brochures) ─────────────────────────────────
const PRODUCTS: Product[] = [
  {
    id: "as5", name: "AssetShield 5", carrier: "American Equity", carrierShort: "AE",
    type: "Fixed Index Annuity", tag: "Accumulation", color: "#2563EB",
    surrenderYrs: 5, issueAges: "18–85", minPremium: "None specified",
    freeWithdrawal: "10% of contract value/yr (after yr 1)",
    mgsv: "87.5% of premium less withdrawals",
    surrenderSchedule: [9.2, 9, 8, 7, 6, 0, 0, 0, 0, 0, 0],
    indexes: ["BlackRock Adaptive US Equity 7%", "BNPP Patriot Technology", "Nasdaq Premier™", "NYSE® Premier", "S&P 500® Advantage 15% VT TCA", "S&P 500® Div Aristocrats® DRC 5%", "S&P 500®"],
    strategies: ["Cap Rate", "Participation Rate", "Performance Trigger"],
    riders: ["Performance Rate Rider (optional, fee — higher par rates)", "Enhanced Benefit Rider (auto ≤75, no fee: nursing care + terminal illness)", "Legacy Benefit (full CV to beneficiary, no surrender charge at death)", "Market Value Adjustment Rider"],
    incomeBenefit: false, liberFee: "N/A", liberCost: null,
    wellbeingBenefit: false,
    keyPoints: ["Principal protected from index declines", "Interest locked in annually — never lost", "Tax-deferred growth", "Shortest surrender period — most liquidity", "7 diversified index options", "Optional PRR boosts participation rates"],
    bestFor: ["Short 5-yr commitment", "Ages 18–85", "Repositioning CDs/savings", "Smart money concept", "Accumulation without income need"],
    notFor: ["Clients needing guaranteed lifetime income", "Long-term income planning"],
    excludedStates: ["CA", "OR"],
    highlight: "Shortest surrender period. Most flexibility.",
  },
  {
    id: "as7", name: "AssetShield 7", carrier: "American Equity", carrierShort: "AE",
    type: "Fixed Index Annuity", tag: "Accumulation", color: "#7C3AED",
    surrenderYrs: 7, issueAges: "18–85", minPremium: "None specified",
    freeWithdrawal: "10% of contract value/yr (after yr 1)",
    mgsv: "87.5% of premium less withdrawals",
    surrenderSchedule: [9.2, 9, 8, 7, 6, 4, 2, 0, 0, 0, 0],
    indexes: ["BlackRock Adaptive US Equity 7%", "BNPP Patriot Technology", "Nasdaq Premier™", "NYSE® Premier", "S&P 500® Advantage 15% VT TCA", "S&P 500® Div Aristocrats® DRC 5%", "S&P 500®"],
    strategies: ["Cap Rate", "Participation Rate", "Performance Trigger"],
    riders: ["Performance Rate Rider (optional, fee)", "Enhanced Benefit Rider (auto ≤75, no fee)", "Legacy Benefit", "Market Value Adjustment Rider"],
    incomeBenefit: false, liberFee: "N/A", liberCost: null,
    wellbeingBenefit: false,
    keyPoints: ["7-yr term = higher cap/par rates than 5-yr", "Same 7 index options as AssetShield 5", "Principal protected — zero floor", "Interest locked in annually", "Greater accumulation potential vs 5-yr"],
    bestFor: ["Medium 7-yr commitment", "Higher growth potential than 5-yr", "Ages 18–85", "Accumulation focus"],
    notFor: ["Clients needing income", "Clients needing <7yr surrender period"],
    excludedStates: ["CA", "OR"],
    highlight: "More growth potential. Same protection.",
  },
  {
    id: "is10", name: "IncomeShield 10", carrier: "American Equity", carrierShort: "AE",
    type: "FIA with Lifetime Income Benefit Rider", tag: "Income", color: "#059669",
    surrenderYrs: 10, issueAges: "40–80", minPremium: "None specified",
    freeWithdrawal: "10% of contract value/yr (after yr 1)",
    mgsv: "87.5% of premium less withdrawals",
    surrenderSchedule: [9.2, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
    indexes: ["BlackRock Adaptive U.S. Equity 5%", "Nasdaq Premier™", "NYSE® Premier", "S&P 500® Advantage 15% VT TCA", "S&P 500® Div Aristocrats® DRC 5%", "S&P 500®"],
    strategies: ["Cap Rate", "Participation Rate", "Performance Trigger"],
    riders: ["Lifetime Income Benefit Rider — INCLUDED, 1.20%/yr on IAV", "Enhanced Benefit Rider (auto ≤75, no fee)", "Legacy Benefit", "Spousal Continuation", "Market Value Adjustment Rider"],
    incomeBenefit: true, liberFee: "1.20%/yr on IAV", liberCost: 1.20,
    iavRate: "10% simple interest for up to 10 yrs",
    payoutTable: "6.24%–7.90% (single) based on yrs deferred (age 60 example)",
    incomeStart: "As early as 1 yr after issue",
    wellbeingBenefit: true,
    wellbeingDetail: "2-yr wait + 2 of 6 ADLs: 200% single / 150% joint, up to 5 yrs",
    spousalContinuation: true, rmdFriendly: true,
    keyPoints: ["10% IAV rate guaranteed for 10 yrs (simple interest)", "Income as soon as year 1", "Payout factor grows each yr deferred", "Wellbeing Benefit: doubles income if unable to perform 2 ADLs", "If contract value > IAV, higher value used", "Spousal continuation", "RMD friendly"],
    caseStudies: [
      { name: "Janet, 63", premium: "$100K", result: "At 68: IAV $150K → $11,145/yr (7.43% factor)" },
      { name: "Kevin & Kelsey, 55", premium: "$200K", result: "At 65: IAV $400K → $27,240/yr; health event → $40,860/yr Wellbeing (5 yrs)" }
    ],
    bestFor: ["Ages 40–80 wanting guaranteed income", "Clients who may defer 5–10 yrs", "Couples needing spousal protection", "Health-event income protection"],
    notFor: ["Pure accumulation", "Ages under 40 or over 80", "Clients wanting no rider fee"],
    excludedStates: [],
    highlight: "10% IAV rate. Income you can't outlive.",
  },
  {
    id: "es10", name: "EstateShield 10", carrier: "American Equity", carrierShort: "AE",
    type: "FIA with LIBR + Enhanced Death Benefit", tag: "Income + Legacy", color: "#B45309",
    surrenderYrs: 10, issueAges: "40–75", minPremium: "None specified",
    freeWithdrawal: "10% of total premiums paid/yr (after yr 1)",
    mgsv: "87.5% of premium less withdrawals",
    surrenderSchedule: [9.2, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
    indexes: ["BlackRock Adaptive U.S. Equity 5%", "S&P 500®", "S&P 500® Div Aristocrats® DRC 5%"],
    strategies: ["Monthly Point-to-Point", "Annual Point-to-Point", "Two-Year Point-to-Point", "Cap Rate", "Participation Rate"],
    riders: ["LIBR — AUTO-INCLUDED, NO FEE", "Enhanced Benefit Rider (auto, no fee)", "Enhanced Death Benefit Rider (auto via LIBR)", "Wellbeing Benefit (auto via LIBR, no fee)", "Market Value Adjustment Rider"],
    incomeBenefit: true, liberFee: "NO FEE", liberCost: 0,
    bavBonus: "35% BAV Bonus on all year-1 premiums",
    bavMultiplier: "Interest credited × BAV multiplier → grows income AND death benefit",
    payoutByAge: { "50-59": "4.5% / 4.0%", "60-69": "5.0% / 4.5%", "70-79": "5.5% / 5.0%", "80+": "6.0% / 5.5%" },
    payoutNote: "Single / Joint | Income starts after 10-yr anniversary",
    incomeStart: "After 10-yr anniversary",
    enhancedDB: "75% BAV lump sum OR 100% BAV paid over 5 years",
    wellbeingBenefit: true,
    wellbeingDetail: "10-yr wait + 2 of 6 ADLs: 200% single / 150% joint, up to 5 yrs",
    spousalContinuation: true,
    keyPoints: ["35% BAV Bonus on yr-1 premiums — immediate boost", "LIBR included at NO FEE (saves vs IncomeShield's 1.20%)", "Income can INCREASE — tied to BAV multiplier + positive index years", "Enhanced Death Benefit: 75% BAV lump sum or 100% BAV over 5 yrs", "Wellbeing Benefit included — no fee", "Income must wait 10 years (vs 1 yr on IncomeShield)"],
    bestFor: ["Legacy + income combination", "Clients with 10+ yr horizon", "Estate planning focus", "Clients wanting income growth potential", "Those wanting LIBR with no fee"],
    notFor: ["Clients needing income before yr 10", "Ages 76+", "Short-term needs"],
    excludedStates: [],
    highlight: "35% bonus. LIBR free. Legacy + income.",
  },
  {
    id: "ipp", name: "Income Pay Pro®", carrier: "North American Company", carrierShort: "NA",
    type: "FIA with Embedded GLWB Rider", tag: "Income + Flexibility", color: "#0F766E",
    surrenderYrs: 10, issueAges: "40–79", minPremium: "$20,000",
    freeWithdrawal: "10% of beginning-of-yr accumulation value (from yr 1)",
    mgsv: "87.5% of all premiums less surrenders",
    surrenderSchedule: [10, 10, 9, 9, 8, 8, 7, 6, 4, 2, 0],
    indexes: ["S&P 500®", "Fidelity Multifactor Yield 5% ER", "Goldman Sachs Equity TimeX", "S&P Multi-Asset Risk Control 5% ER", "Morgan Stanley Dynamic Global"],
    strategies: ["Monthly Point-to-Point (cap)", "Annual Point-to-Point (cap)", "Annual Point-to-Point (par rate)", "Two-Year Point-to-Point (par rate)", "Fixed Account"],
    riders: ["GLWB Rider — EMBEDDED, 1.15%/yr on GLWB value", "Nursing Home Multiplier (2x LPA up to 5 payments; 2-yr wait; 90-day confinement; not CA)", "LPA Reserve (bank unused LPA for lump sum/periodic use)", "Spousal Continuance"],
    incomeBenefit: true, liberFee: "1.15%/yr on GLWB value", liberCost: 1.15,
    glwbRollUp: "8% compounded for up to 10 years",
    lpaOptions: ["Level LPA — fixed for life", "Increasing LPA — lower start, grows by declared % (min 0.25%/yr guarantee)"],
    levelPayoutSingle: { "50-55": "5.80%", "56": "5.90%", "57": "6.00%", "58": "6.10%", "59": "6.20%", "60": "6.30%", "65": "6.80%", "70": "7.30%", "75": "7.80%", "80+": "8.30%" },
    levelPayoutJoint: { "50-55": "5.30%", "60": "5.80%", "65": "6.30%", "70": "6.80%", "75": "7.30%", "80+": "7.80%" },
    incomeStart: "Immediately (as early as issue, age 50+)",
    nursingMultiplier: "2x LPA for up to 5 annual payments (2-yr wait, 90-day confinement, not CA)",
    lpaReserve: "Bank unused LPA each year; available as lump sum anytime",
    wellbeingBenefit: false,
    spousalContinuation: true,
    keyPoints: ["8% compounded GLWB roll-up — highest of all 5 products", "Income available immediately at issue", "Level OR Increasing LPA options", "LPA Reserve: bank unused payments for future needs", "Nursing Home Multiplier: 2x income for up to 5 yrs", "Spousal continuance of GLWB", "GLWB value separate — not available as lump sum", "Charge: 1.15% of GLWB value (not accumulation)"],
    exampleRollup: [200000, 216000, 233280, 251942, 272098, 293866, 317375, 342765, 370186, 399801, 431785],
    bestFor: ["Highest roll-up rate seekers (8% compounded)", "Clients wanting income flexibility (level vs increasing)", "Nursing home income protection", "Ages 40–79 wanting immediate income option", "North American policyholders"],
    notFor: ["Oregon residents", "Ages 80+", "Clients wanting no rider fee", "Those needing >$0 min with <$20K to invest"],
    excludedStates: ["OR"],
    highlight: "8% compounded roll-up. Income flexibility built in.",
  }
];

// ─── Comparison dimensions ────────────────────────────────────────────────────
interface Dimension {
  key: keyof Product;
  label: string;
}

const DIMS: Dimension[] = [
  { key: "surrenderYrs", label: "Surrender Period" },
  { key: "issueAges", label: "Issue Ages" },
  { key: "minPremium", label: "Min Premium" },
  { key: "liberFee", label: "Income Rider Fee" },
  { key: "freeWithdrawal", label: "Free Withdrawal" },
  { key: "incomeBenefit", label: "Lifetime Income" },
  { key: "wellbeingBenefit", label: "Wellbeing/Nursing/Care Benefit" },
];

// ─── Client summary card data ─────────────────────────────────────────────────
interface Persona {
  icon: string;
  label: string;
  desc: string;
  recommend: string[];
  avoid: string[];
}

const PERSONAS: Persona[] = [
  { icon: "🏡", label: "New Retiree, Age 62–70", desc: "Wants guaranteed income now or soon", recommend: ["is10", "ipp"], avoid: ["es10"] },
  { icon: "🏛️", label: "Legacy Builder, Age 55–70", desc: "Income + estate maximization", recommend: ["es10", "is10"], avoid: ["as5", "as7"] },
  { icon: "💰", label: "Saver, Age 50–65", desc: "Protected growth, no income need yet", recommend: ["as7", "as5"], avoid: ["is10", "es10", "ipp"] },
  { icon: "🏥", label: "Health Concern, Any Age", desc: "Needs nursing/care income protection", recommend: ["ipp", "is10"], avoid: ["as5", "as7"] },
  { icon: "⏱️", label: "Short-Term, Age 18–60", desc: "5-yr commitment, max flexibility", recommend: ["as5"], avoid: ["es10", "is10", "ipp"] },
  { icon: "👫", label: "Married Couple, Age 55–70", desc: "Joint income, spousal protection", recommend: ["is10", "es10", "ipp"], avoid: ["as5", "as7"] },
];

// ─── Auxiliary components ─────────────────────────────────────────────────────
interface BadgeProps {
  text: string;
  color?: string;
  bg?: string;
}

function Badge({ text, color = "#2C3E50", bg }: BadgeProps) {
  return (
    <span 
      style={{
        fontSize: 10,
        padding: "3px 8px",
        borderRadius: 20,
        background: bg || `${color}22`,
        color,
        fontFamily: "var(--font-sans), system-ui",
        fontWeight: "bold",
        whiteSpace: "nowrap"
      }}
    >
      {text}
    </span>
  );
}

interface TagProps {
  text: string;
  color: string;
}

function Tag({ text, color }: TagProps) {
  return (
    <span 
      style={{
        fontSize: 10,
        padding: "2px 9px",
        borderRadius: 20,
        background: `${color}18`,
        color,
        border: `1.5px solid ${color}35`,
        fontFamily: "var(--font-sans), system-ui",
        letterSpacing: ".3px",
        fontWeight: "semibold"
      }}
    >
      {text}
    </span>
  );
}

interface CheckProps {
  val: string | boolean;
}

function Check({ val }: CheckProps) {
  if (val === true) return <span style={{ color: "#22c55e", fontSize: 15, fontWeight: "bold" }}>✓</span>;
  if (val === false) return <span style={{ color: "rgba(255,255,255,.2)", fontSize: 15 }}>—</span>;
  return <span style={{ fontSize: 11, color: "rgba(255,255,255,.8)", fontFamily: "var(--font-sans), system-ui" }}>{val}</span>;
}

// ─── Product Card ─────────────────────────────────────────────────────────────
interface ProductCardProps {
  p: Product;
  selected: string[];
  onSelect: (id: string) => void;
  mini?: boolean;
}

function ProductCard({ p, selected, onSelect, mini }: ProductCardProps) {
  const sel = selected.includes(p.id);
  return (
    <div 
      className="ph select-none transition-all duration-200" 
      onClick={() => onSelect(p.id)}
      style={{
        background: sel ? `${p.color}1c` : "rgba(255,255,255,.05)",
        border: `2px solid ${sel ? p.color : "rgba(255,255,255,.12)"}`,
        borderRadius: 14,
        padding: mini ? "12px 14px" : "18px 18px",
        cursor: "pointer",
        boxShadow: sel ? `0 0 12px ${p.color}25` : "none"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: mini ? 12 : 14, fontWeight: "bold", color: "white", fontFamily: "var(--font-display), var(--font-sans)", lineHeight: 1.25 }}>{p.name}</div>
          <div style={{ fontSize: 9.5, color: "rgba(255,255,255,.45)", fontFamily: "var(--font-sans), system-ui", marginTop: 2 }}>{p.carrier}</div>
        </div>
        <Tag text={p.tag} color={p.color} />
      </div>
      {!mini && (
        <div style={{ fontSize: 11, color: "rgba(255,255,255,.55)", fontFamily: "var(--font-sans), system-ui", marginBottom: 12, lineHeight: 1.5 }}>
          {p.highlight}
        </div>
      )}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <Badge text={`${p.surrenderYrs}-yr`} color={p.color} />
        <Badge text={`Ages ${p.issueAges}`} color="rgba(255,255,255,.6)" bg="rgba(255,255,255,.08)" />
        {p.incomeBenefit && <Badge text="Income ✓" color="#22c55e" bg="#22c55e20" />}
        {p.wellbeingBenefit && <Badge text="Wellbeing ✓" color="#f59e0b" bg="#f59e0b1c" />}
      </div>
    </div>
  );
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────
interface DetailPanelProps {
  p: Product;
}

function DetailPanel({ p }: DetailPanelProps) {
  const [tab, setTab] = useState<string>("overview");
  const tabs = [
    ["overview", "Overview"],
    ["income", "Income Calculations"],
    ["riders", "Riders & Guaranteed Benefits"],
    ["suitability", "Compliance & Suitability"]
  ];
  
  return (
    <div style={{ background: "rgba(255,255,255,.04)", border: `1.5px solid ${p.color}45`, borderRadius: 16, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${p.color}25, ${p.color}08)`, padding: "20px 22px", borderBottom: `1.5px solid ${p.color}25` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: "bold", color: "white", fontFamily: "var(--font-display), var(--font-sans)" }}>{p.name}</div>
            <div style={{ fontSize: 11.5, color: "rgba(255,255,255,.55)", fontFamily: "var(--font-sans), system-ui", marginTop: 2 }}>{p.carrier} · {p.type}</div>
          </div>
          <Tag text={p.tag} color={p.color} />
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
          {[`${p.surrenderYrs}-yr Surrender`, `Ages ${p.issueAges}`, `Min Premium: ${p.minPremium}`].map(t => (
            <span key={t} style={{ fontSize: 10, color: p.color, background: `${p.color}15`, padding: "3px 10px", borderRadius: 20, fontFamily: "var(--font-sans), system-ui", fontWeight: "medium" }}>{t}</span>
          ))}
          {p.excludedStates?.length > 0 && (
            <span style={{ fontSize: 10, color: "#f87171", background: "#f8717115", padding: "3px 10px", borderRadius: 20, fontFamily: "var(--font-sans), system-ui" }}>Not available in {p.excludedStates.join(", ")}</span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,.08)", background: "rgba(0,0,0,0.15)" }}>
        {tabs.filter(([t]) => t !== "income" || p.incomeBenefit).map(([t, label]) => (
          <button 
            key={t} 
            onClick={() => setTab(t)} 
            className="nb font-sans focus:outline-none transition-all duration-150"
            style={{
              flex: 1,
              padding: "12px 6px",
              background: "transparent",
              border: "none",
              color: tab === t ? p.color : "rgba(255,255,255,.45)",
              fontSize: 11.5,
              fontWeight: tab === t ? "bold" : "normal",
              cursor: "pointer",
              borderBottom: `3px solid ${tab === t ? p.color : "transparent"}`
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "18px 20px", maxHeight: 420, overflowY: "auto" }}>
        {tab === "overview" && (
          <div className="space-y-4">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                ["Free Penalty-Free Withdrawal", p.freeWithdrawal],
                ["Minimum Guaranteed Surrender Value (MGSV)", p.mgsv],
                ["Annual Income Rider Charge", p.liberFee || "None"],
                ["Surrender Period Length", `${p.surrenderYrs} fiscal years`],
              ].map(([k, v]) => (
                <div key={k} style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "10px 12px" }}>
                  <div style={{ fontSize: 9.5, color: "rgba(255,255,255,.4)", fontFamily: "var(--font-sans), system-ui", marginBottom: 3, fontWeight: "bold", uppercase: "true" } as any}>{k}</div>
                  <div style={{ fontSize: 12, color: "white", fontFamily: "var(--font-sans), system-ui", lineHeight: 1.45, fontWeight: "medium" }}>{v}</div>
                </div>
              ))}
            </div>

            <div>
              <div style={{ fontSize: 11.5, color: p.color, fontFamily: "var(--font-sans), system-ui", fontWeight: "bold", marginBottom: 8 }}>Surrender Deductions Schedule</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {p.surrenderSchedule.filter(v => v > 0).map((v, i) => (
                  <div key={i} style={{ background: `${p.color}1e`, borderRadius: 8, padding: "6px 10px", textAlign: "center", border: `1px solid ${p.color}25`, minWidth: 50 }}>
                    <div style={{ fontSize: 8.5, color: "rgba(255,255,255,.45)", fontFamily: "var(--font-sans), system-ui" }}>Year {i + 1}</div>
                    <div style={{ fontSize: 11.5, color: p.color, fontFamily: "var(--font-sans), system-ui", fontWeight: "bold" }}>{v}%</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11.5, color: p.color, fontFamily: "var(--font-sans), system-ui", fontWeight: "bold", marginBottom: 8 }}>External Market Indices Tracked</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {p.indexes.map(idx => (
                  <div key={idx} style={{ fontSize: 11, color: "rgba(255,255,255,.65)", fontFamily: "var(--font-sans), system-ui", padding: "6px 10px", background: "rgba(255,255,255,0.02)", borderRadius: 8, borderLeft: `3.5px solid ${p.color}` }}>
                    {idx}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "income" && p.incomeBenefit && (
          <div className="space-y-4">
            {p.iavRate && (
              <div style={{ background: `${p.color}12`, border: `1.5px solid ${p.color}26`, borderRadius: 12, padding: "14px 16px", textAlign: "center" }}>
                <div style={{ fontSize: 11.5, color: "rgba(255,255,255,.6)", fontFamily: "var(--font-sans), system-ui", fontWeight: "medium", marginBottom: 3 }}>Guaranteed Income Account Value (IAV) Rollup Rate</div>
                <div style={{ fontSize: 22, fontWeight: "bold", color: p.color, fontFamily: "var(--font-sans), system-ui" }}>{p.iavRate}</div>
              </div>
            )}
            {p.glwbRollUp && (
              <div style={{ background: `${p.color}12`, border: `1.5px solid ${p.color}26`, borderRadius: 12, padding: "14px 16px", textAlign: "center" }}>
                <div style={{ fontSize: 11.5, color: "rgba(255,255,255,.6)", fontFamily: "var(--font-sans), system-ui", fontWeight: "medium", marginBottom: 3 }}>Guaranteed Lifetime Withdrawal Benefit (GLWB) Compounded Rollup</div>
                <div style={{ fontSize: 22, fontWeight: "bold", color: p.color, fontFamily: "var(--font-sans), system-ui" }}>{p.glwbRollUp}</div>
              </div>
            )}
            {p.bavBonus && (
              <div style={{ background: `${p.color}12`, border: `1.5px solid ${p.color}26`, borderRadius: 12, padding: "14px 16px", textAlign: "center" }}>
                <div style={{ fontSize: 11.5, color: "rgba(255,255,255,.6)", fontFamily: "var(--font-sans), system-ui", fontWeight: "medium", marginBottom: 3 }}>Immediate Benefit Base (BAV) Bonus</div>
                <div style={{ fontSize: 22, fontWeight: "bold", color: p.color, fontFamily: "var(--font-sans), system-ui" }}>{p.bavBonus}</div>
              </div>
            )}

            <div>
              <div style={{ fontSize: 11.5, color: p.color, fontWeight: "bold", fontFamily: "var(--font-sans), system-ui", marginBottom: 4 }}>Earliest Payout Horizon</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.85)", fontFamily: "var(--font-sans), system-ui" }}>{p.incomeStart}</div>
            </div>

            {p.payoutByAge && (
              <div>
                <div style={{ fontSize: 11.5, color: p.color, fontWeight: "bold", fontFamily: "var(--font-sans), system-ui", marginBottom: 8 }}>Payout Rates (Single / Joint Contract Joint-Ages)</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {Object.entries(p.payoutByAge).map(([age, rate]) => (
                    <div key={age} style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "8px 12px", textAlign: "center", flex: "1 1 70px" }}>
                      <div style={{ fontSize: 8.5, color: "rgba(255,255,255,.45)", fontFamily: "var(--font-sans), system-ui", fontWeight: "bold" }}>Age {age}</div>
                      <div style={{ fontSize: 12, color: p.color, fontFamily: "var(--font-sans), system-ui", fontWeight: "bold" }}>{rate}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {p.lpaOptions && (
              <div>
                <div style={{ fontSize: 11.5, color: p.color, fontWeight: "bold", fontFamily: "var(--font-sans), system-ui", marginBottom: 6 }}>LPA Payout Options</div>
                {p.lpaOptions.map(o => (
                  <div key={o} style={{ fontSize: 11.5, color: "rgba(255,255,255,.7)", fontFamily: "var(--font-sans), system-ui", marginBottom: 5, paddingLeft: 10, borderLeft: `3px solid ${p.color}70` }}>
                    {o}
                  </div>
                ))}
              </div>
            )}

            {p.wellbeingBenefit && (
              <div style={{ background: "rgba(245,158,11,.08)", border: "1px solid rgba(245,158,11,.25)", borderRadius: 12, padding: "12px 14px" }}>
                <div style={{ fontSize: 11.5, color: "#f59e0b", fontWeight: "bold", fontFamily: "var(--font-sans), system-ui", marginBottom: 4 }}>⚡ Guaranteed Wellbeing Benefit Multiplier</div>
                <div style={{ fontSize: 11.5, color: "rgba(255,255,255,.7)", fontFamily: "var(--font-sans), system-ui", lineHeight: 1.5 }}>{p.wellbeingDetail}</div>
              </div>
            )}

            {p.nursingMultiplier && (
              <div style={{ background: "rgba(245,158,11,.08)", border: "1px solid rgba(245,158,11,.25)", borderRadius: 12, padding: "12px 14px" }}>
                <div style={{ fontSize: 11.5, color: "#f59e0b", fontWeight: "bold", fontFamily: "var(--font-sans), system-ui", marginBottom: 4 }}>🏥 Guaranteed Nursing Home Multiplier</div>
                <div style={{ fontSize: 11.5, color: "rgba(255,255,255,.7)", fontFamily: "var(--font-sans), system-ui", lineHeight: 1.5 }}>{p.nursingMultiplier}</div>
              </div>
            )}

            {p.enhancedDB && (
              <div style={{ background: `${p.color}08`, border: `1.5px solid ${p.color}25`, borderRadius: 12, padding: "12px 14px" }}>
                <div style={{ fontSize: 11.5, color: p.color, fontWeight: "bold", fontFamily: "var(--font-sans), system-ui", marginBottom: 4 }}>🏛️ Enhanced Death Benefit Guarantee</div>
                <div style={{ fontSize: 11.5, color: "rgba(255,255,255,.7)", fontFamily: "var(--font-sans), system-ui", lineHeight: 1.5 }}>{p.enhancedDB}</div>
              </div>
            )}

            {p.caseStudies && (
              <div className="space-y-2 mt-2">
                <div style={{ fontSize: 11.5, color: p.color, fontWeight: "bold", fontFamily: "var(--font-sans), system-ui" }}>Brochure Case Studies</div>
                {p.caseStudies.map(c => (
                  <div key={c.name} style={{ background: "rgba(255,255,255,.03)", borderRadius: 10, padding: "10px 12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ fontSize: 12, color: "white", fontWeight: "semibold", fontFamily: "var(--font-sans), system-ui" }}>{c.name} (Premium: {c.premium})</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,.55)", fontFamily: "var(--font-sans), system-ui", marginTop: 4, lineHeight: 1.4 }}>{c.result}</div>
                  </div>
                ))}
              </div>
            )}

            {p.exampleRollup && (
              <div>
                <div style={{ fontSize: 11.5, color: p.color, fontWeight: "bold", fontFamily: "var(--font-sans), system-ui", marginBottom: 8 }}>Compounded GLWB Rollup (Hypothetical $200,000 Premium)</div>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                  {p.exampleRollup.map((v, i) => (
                    <div key={i} style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 8, padding: "6px 10px", textAlign: "center", minWidth: 62 }}>
                      <div style={{ fontSize: 8.5, color: "rgba(255,255,255,.45)", fontFamily: "var(--font-sans), system-ui" }}>Year {i}</div>
                      <div style={{ fontSize: 11, color: p.color, fontFamily: "var(--font-sans), system-ui", fontWeight: "bold" }}>${(v / 1000).toFixed(0)}K</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "riders" && (
          <div className="space-y-2.5">
            {p.riders.map(r => {
              const isKey = r.includes("NO FEE") || r.includes("AUTO") || r.includes("INCLUDED") || r.includes("EMBEDDED");
              return (
                <div key={r} style={{ background: isKey ? `${p.color}10` : "rgba(255,255,255,.02)", border: `1px solid ${isKey ? p.color + "30" : "rgba(255,255,255,.06)"}`, borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ fontSize: 12, color: isKey ? "white" : "rgba(255,255,255,0.75)", fontFamily: "var(--font-sans), system-ui", lineHeight: 1.5, fontWeight: isKey ? "semibold" : "normal" }}>
                    {isKey && <span style={{ color: p.color, marginRight: 6, fontWeight: "bold" }}>[GUARANTEED]</span>}
                    {r}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === "suitability" && (
          <div className="space-y-4">
            <div>
              <div style={{ fontSize: 12, color: "#22c55e", fontWeight: "bold", fontFamily: "var(--font-sans), system-ui", marginBottom: 6 }}>✓ Optimal Investor Profile (Best For)</div>
              <div className="space-y-2">
                {p.bestFor.map(b => (
                  <div key={b} style={{ fontSize: 11.5, color: "rgba(255,255,255,.7)", fontFamily: "var(--font-sans), system-ui", padding: "6px 10px", background: "rgba(34,197,94,0.03)", borderRadius: 8, borderLeft: "3.5px solid #22c55e" }}>
                    {b}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, color: "#f87171", fontWeight: "bold", fontFamily: "var(--font-sans), system-ui", marginBottom: 6 }}>✗ Out-of-Scope / Non-Suitable Profiles</div>
              <div className="space-y-2">
                {p.notFor.map(n => (
                  <div key={n} style={{ fontSize: 11.5, color: "rgba(255,255,255,.7)", fontFamily: "var(--font-sans), system-ui", padding: "6px 10px", background: "rgba(248,113,113,0.03)", borderRadius: 8, borderLeft: "3.5px solid #f87171" }}>
                    {n}
                  </div>
                ))}
              </div>
            </div>

            {p.excludedStates?.length > 0 && (
              <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: 10, padding: "10px 12px" }}>
                <div style={{ fontSize: 11, color: "#f87171", fontWeight: "bold", fontFamily: "var(--font-sans), system-ui", marginBottom: 2 }}>State Availability Exclusions</div>
                <div style={{ fontSize: 11.5, color: "rgba(255,255,255,.7)", fontFamily: "var(--font-sans), system-ui" }}>
                  This product IS NOT available to sell in the following US territory coordinates: {p.excludedStates.join(", ")}.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Comparison Table ─────────────────────────────────────────────────────────
interface CompareTableProps {
  selected: string[];
}

function CompareTable({ selected }: CompareTableProps) {
  const prods = PRODUCTS.filter(p => selected.includes(p.id));
  if (prods.length < 2) {
    return (
      <div style={{ textAlign: "center", color: "rgba(255,255,255,.3)", fontSize: 12, fontFamily: "var(--font-sans), system-ui", padding: "40px 0" }}>
        Select 2 to 5 specialized annuity vehicles to build side-by-side matrices.
      </div>
    );
  }
  
  return (
    <div style={{ overflowX: "auto", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, background: "rgba(255,255,255,0.02)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.1)" }}>
            <td style={{ width: 150, padding: "12px 14px", fontSize: 10, color: "rgba(255,255,255,.45)", fontFamily: "var(--font-sans), system-ui", fontWeight: "bold", textTransform: "uppercase" }}>Feature Vector</td>
            {prods.map(p => (
              <td key={p.id} style={{ padding: "12px 14px", textAlign: "center", borderBottom: `3px solid ${p.color}`, verticalAlign: "middle" }}>
                <div style={{ fontSize: 12, color: p.color, fontWeight: "bold", fontFamily: "var(--font-display), var(--font-sans)" }}>{p.name}</div>
                <div style={{ fontSize: 9.5, color: "rgba(255,255,255,.35)", fontFamily: "var(--font-sans), system-ui", marginTop: 2 }}>{p.carrier}</div>
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {DIMS.map((d, di) => (
            <tr key={d.key} style={{ background: di % 2 === 0 ? "rgba(255,255,255,.01.5)" : "transparent", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <td style={{ padding: "10px 14px", fontSize: 11, color: "rgba(255,255,255,.5)", fontFamily: "var(--font-sans), system-ui", whiteSpace: "nowrap", fontWeight: "medium" }}>{d.label}</td>
              {prods.map(p => {
                const v = p[d.key];
                return (
                  <td key={p.id} style={{ padding: "10px 14px", textAlign: "center", borderLeft: "1px solid rgba(255,255,255,0.03)" }}>
                    {d.key === "surrenderYrs" ? (
                      <Badge text={`${v}-yr`} color={p.color} />
                    ) : d.key === "incomeBenefit" || d.key === "wellbeingBenefit" ? (
                      <Check val={v as string | boolean} />
                    ) : (
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,.8)", fontFamily: "var(--font-sans), system-ui" }}>{String(v)}</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
          <tr style={{ background: "rgba(255,255,255,.025)" }}>
            <td style={{ padding: "12px 14px", fontSize: 11, color: "rgba(255,255,255,.5)", fontFamily: "var(--font-sans), system-ui", fontWeight: "bold" }}>Core Pitch Angle</td>
            {prods.map(p => (
              <td key={p.id} style={{ padding: "12px 14px", textAlign: "center", borderLeft: "1px solid rgba(255,255,255,0.03)" }}>
                <span style={{ fontSize: 11, color: p.color, fontFamily: "var(--font-sans), system-ui", lineHeight: 1.4, display: "block", fontWeight: "semibold" }}>{p.highlight}</span>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// ─── Client Fit Matches ─────────────────────────────────────────────────────────
function ClientSummaries() {
  const [sel, setSel] = useState<number | null>(null);
  return (
    <div className="space-y-4">
      <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)", fontFamily: "var(--font-sans), system-ui" }}>
        Align client investment needs, age constraints, and health concerns with tailored recommendations and risk-compliance briefs.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 10 }}>
        {PERSONAS.map((p, i) => (
          <div 
            key={i} 
            className="ph shadow-sm hover:shadow" 
            onClick={() => setSel(sel === i ? null : i)}
            style={{
              background: sel === i ? "rgba(196,154,108,.12)" : "rgba(255,255,255,.04)",
              border: `1.5px solid ${sel === i ? B.gold : "rgba(255,255,255,.1)"}`,
              borderRadius: 14,
              padding: "16px 16px",
              cursor: "pointer",
              transition: "all .2s"
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 8 }}>{p.icon}</div>
            <div style={{ fontSize: 13, color: "white", fontWeight: "bold", fontFamily: "var(--font-display), var(--font-sans)", marginBottom: 4 }}>{p.label}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.45)", fontFamily: "var(--font-sans), system-ui", lineHeight: 1.4 }}>{p.desc}</div>
          </div>
        ))}
      </div>
      {sel !== null && (
        <div style={{ background: "rgba(196,154,108,.08)", border: `1.5px solid ${B.gold}45`, borderRadius: 16, padding: "18px 20px" }}>
          <div style={{ fontSize: 14, color: B.goldLight, fontWeight: "bold", fontFamily: "var(--font-display), var(--font-sans)", marginBottom: 12, display: "flex", itemsCenter: "center", gap: 6 } as any}>
            <span style={{ fontSize: 18 }}>{PERSONAS[sel].icon}</span> {PERSONAS[sel].label}
          </div>
          
          <div style={{ fontSize: 11.5, color: B.gold, fontWeight: "bold", fontFamily: "var(--font-sans), system-ui", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>✓ Core Match Recommendations</div>
          <div className="space-y-3">
            {PERSONAS[sel].recommend.map(id => {
              const p = PRODUCTS.find(pr => pr.id === id);
              return p ? (
                <div key={id} style={{ background: `${p.color}10`, border: `1px solid ${p.color}25`, borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ fontSize: 12.5, color: p.color, fontWeight: "bold", fontFamily: "var(--font-display), var(--font-sans)" }}>{p.name}</div>
                    <Tag text={p.tag} color={p.color} />
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,.55)", fontFamily: "var(--font-sans), system-ui", marginBottom: 6 }}>{p.highlight}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,.7)", fontFamily: "var(--font-sans), system-ui", lineHeight: 1.4, background: "rgba(0,0,0,0.15)", padding: "6px 10px", borderRadius: 6 }}>
                    <strong>Suitability Vector:</strong> {p.bestFor[0]} · {p.bestFor[1]}
                  </div>
                </div>
              ) : null;
            })}
          </div>

          <div style={{ fontSize: 11.5, color: "#f87171", fontWeight: "bold", fontFamily: "var(--font-sans), system-ui", marginBottom: 6, marginTop: 14, textTransform: "uppercase", letterSpacing: "0.5px" }}>✗ Avoids (Non-Insurable or Non-Suitable Vectors)</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {PERSONAS[sel].avoid.map(id => {
              const p = PRODUCTS.find(pr => pr.id === id);
              return p ? (
                <span key={id} style={{ fontSize: 11, color: "rgba(248,113,113,0.85)", background: "rgba(248,113,113,0.08)", padding: "4px 10px", borderRadius: 20, border: "1px solid rgba(248,113,113,0.15)", fontFamily: "var(--font-sans), system-ui" }}>
                  • {p.name}
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main AnnuityPlatform Component ──────────────────────────────────────────
export function AnnuityPlatform() {
  const [view, setView] = useState<string>("browse");
  const [selected, setSelected] = useState<string[]>([]);
  const [detail, setDetail] = useState<string | null>(null);

  function toggleSelect(id: string) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id].slice(-5));
  }
  
  function openDetail(id: string) {
    setDetail(id === detail ? null : id);
  }

  const NAV = [
    ["browse", "📋 Indexed Products"],
    ["compare", "⚖️ Comparison Matrix"],
    ["clients", "👥 Client Fit Selector"],
    ["summaries", "📄 Reference Sheets"]
  ];

  return (
    <div 
      style={{
        borderRadius: 16,
        padding: "20px 20px",
        background: `linear-gradient(160deg, ${B.charcoal}, ${B.navy} 65%, ${B.slate})`,
        border: `1.5px solid rgba(196,154,108,.25)`,
        color: "white"
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderBottom: "1.5px solid rgba(196,154,108,.18)", background: "rgba(0,0,0,.22)", borderRadius: 12, marginBottom: 14 }}>
        <div>
          <div style={{ color: "white", fontSize: 13.5, fontWeight: "bold", letterSpacing: ".3px", fontFamily: "var(--font-sans), system-ui" }}>Latimore Life & Legacy</div>
          <div style={{ color: B.gold, fontSize: 8.5, letterSpacing: "2.5px", textTransform: "uppercase", fontWeight: "bold", fontFamily: "var(--font-sans), system-ui" }}>Annuity Product Platform</div>
        </div>
        <div style={{ fontSize: 9.5, color: "rgba(255,255,255,.4)", fontFamily: "var(--font-sans), system-ui" }}>AE + North American Company · Broker Use Only</div>
      </div>

      {/* Nav */}
      <div style={{ display: "flex", gap: 5, padding: "4px 4px", background: "rgba(0,0,0,0.15)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", overflowX: "auto", marginBottom: 16 }}>
        {NAV.map(([v, label]) => (
          <button 
            key={v} 
            onClick={() => setView(v)} 
            className="nb focus:outline-none"
            style={{
              background: view === v ? "rgba(196,154,108,.2)" : "transparent",
              border: "none",
              color: view === v ? B.gold : "rgba(255,255,255,.55)",
              padding: "7px 14px",
              borderRadius: 8,
              fontSize: 11,
              fontWeight: view === v ? "bold" : "normal",
              cursor: "pointer",
              fontFamily: "var(--font-sans), system-ui",
              whiteSpace: "nowrap",
              transition: "all .15s"
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ margin: "0 auto", paddingBottom: 20 }}>
        {/* BROWSE */}
        {view === "browse" && (
          <div className="space-y-4">
            <div style={{ fontSize: 11.5, color: "rgba(255,255,255,.45)", fontFamily: "var(--font-sans), system-ui" }}>
              Click any premium index product card below to unlock full calculations, surrender profiles, and suitability benchmarks.
              {selected.length > 0 && (
                <button 
                  onClick={() => setView("compare")} 
                  style={{
                    marginLeft: 14,
                    background: B.gold,
                    border: "none",
                    borderRadius: 20,
                    padding: "4px 14px",
                    color: B.navy,
                    fontSize: 10.5,
                    fontWeight: "bold",
                    cursor: "pointer",
                    fontFamily: "var(--font-sans), system-ui",
                    boxShadow: "0 2px 6px rgba(196,154,108,0.25)"
                  }}
                >
                  Analyze Comparison Set ({selected.length}) →
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PRODUCTS.map(p => (
                <div key={p.id}>
                  <ProductCard p={p} selected={selected} onSelect={(id) => { toggleSelect(id); openDetail(id); }} />
                </div>
              ))}
            </div>
            
            {detail && <DetailPanel p={PRODUCTS.find(p => p.id === detail)!} />}
          </div>
        )}

        {/* COMPARE */}
        {view === "compare" && (
          <div className="space-y-4">
            <div style={{ fontSize: 11.5, color: "rgba(255,255,255,.45)", fontFamily: "var(--font-sans), system-ui" }}>Toggle products into your comparison set (up to 5 active vehicles).</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {PRODUCTS.map(p => <ProductCard key={p.id} p={p} selected={selected} onSelect={toggleSelect} mini />)}
            </div>
            <CompareTable selected={selected} />
          </div>
        )}

        {/* CLIENT FIT */}
        {view === "clients" && <ClientSummaries />}

        {/* Reference Sheets */}
        {view === "summaries" && (
          <div className="space-y-4 animate-fadeUp">
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.45)", fontFamily: "var(--font-sans), system-ui" }}>Professional product reference briefs for agent consultation and client compliance reviews.</div>
            {PRODUCTS.map(p => (
              <div key={p.id} style={{ background: "rgba(255,255,255,.04)", border: `1.5px solid ${p.color}35`, borderRadius: 16, padding: "18px 20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 14.5, color: "white", fontWeight: "bold", fontFamily: "var(--font-display), var(--font-sans)" }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-sans), system-ui", marginTop: 2 }}>{p.carrier} · {p.type}</div>
                  </div>
                  <Tag text={p.tag} color={p.color} />
                </div>
                
                <div style={{ fontSize: 11.5, color: p.color, fontFamily: "var(--font-sans), system-ui", fontStyle: "italic", marginBottom: 12 }}>{p.highlight}</div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                  {[
                    ["Surrender Length", `${p.surrenderYrs} yrs`],
                    ["Issue Ages", p.issueAges],
                    ["Min Premium Option", p.minPremium],
                    ["Annual Benefit Fee", p.liberFee || "None"],
                    ["Free Penalty-Free Roll", p.freeWithdrawal.split("(")[0].trim()],
                    ["Guaranteed Base (MGSV)", "87.5% baseline"],
                  ].map(([k, v]) => (
                    <div key={k} style={{ fontSize: 11, fontFamily: "var(--font-sans), system-ui" }}>
                      <span style={{ color: "rgba(255,255,255,.45)" }}>{k}: </span>
                      <span style={{ color: "white", fontWeight: "semibold" }}>{v}</span>
                    </div>
                  ))}
                </div>
                
                <div style={{ fontSize: 11, color: p.color, fontWeight: "bold", fontFamily: "var(--font-sans), system-ui", marginBottom: 6, uppercase: "true" } as any}>Promotional Value Pillars</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {p.keyPoints.slice(0, 4).map(k => (
                    <div key={k} style={{ fontSize: 11, color: "rgba(255,255,255,.7)", fontFamily: "var(--font-sans), system-ui", paddingLeft: 8, borderLeft: `2.5px solid ${p.color}60` }}>
                      {k}
                    </div>
                  ))}
                </div>
                
                {p.excludedStates?.length > 0 && (
                  <div style={{ marginTop: 10, fontSize: 10, color: "#f87171", fontFamily: "var(--font-sans), system-ui" }}>⚠ Exclusions: Not for solicitation in {p.excludedStates.join(", ")}.</div>
                )}
              </div>
            ))}
            
            <div style={{ marginTop: 20, padding: "14px 16px", background: "rgba(255,255,255,.03)", border: "1px solid rgba(196,154,108,0.2)", borderRadius: 12, fontSize: 10.5, color: "rgba(255,255,255,.4)", fontFamily: "var(--font-sans), system-ui", lineHeight: 1.75 }}>
              <strong style={{ color: B.goldLight }}>Compliance Warning & Disclosure:</strong> For broker/agent information only. Not for client pre-sale solicitation. Direct index performance does not correspond with credit yields under fixed indexed vehicles. Guarantees are strictly subject to individual carrier credit capacity. All rates fluctuate by broker allocation terms. Licensed with the Pennsylvania Insurance Department. Jackson M. Latimore Sr., PA Agent Lic. #1268820. Schuylkill County Office Center.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
