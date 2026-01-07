import { createClient } from '@supabase/supabase-js'
import { TOPICS } from './libraryTopics.mjs'

function required(name) {
  const v = process.env[name]
  if (!v) throw new Error(`Missing env var: ${name}`)
  return v
}

function mdBullets(lines) {
  return lines.map((s) => `- ${s}`).join('\n')
}

function baseGlobal() {
  return {
    costs: [
      'Transaction costs: model spread + fees + commissions + taxes as a function of volatility and liquidity.',
      'Financing/borrow: model funding basis, borrow availability, and recall risk; assume terms worsen in stress.',
      'Execution impact: impact is nonlinear in size; assume worse impact in drawdowns and liquidity shocks.',
      'Capital limits: model margin, concentration limits, and liquidation constraints; assume limits bind in stress.',
    ],
    regime: [
      'Volatility dependence: specify how the approach behaves as vol rises/falls and during vol-of-vol spikes.',
      'Liquidity dependence: specify how execution/impact changes with liquidity; assume liquidity vanishes when you need it.',
      'Macro sensitivity: specify which macro shocks (rates, policy, FX, energy) can flip the outcome.',
      'Crowding sensitivity: specify how popularity changes expected returns, correlations, and crash risk.',
    ],
    antiMarketing: [
      'Anti-marketing: If you’re looking for guaranteed profits, leave.',
      'This library exists to explain failure.',
    ],
    versioning: [
      'Versioning: v1 worked historically in a narrow regime; v2 breaks as structure/crowding shifts; v3 is constrained, modified, or abandoned.',
    ],
  }
}

function isStrategy(t) {
  return t.kind === 'strategy'
}

function isProof(t) {
  return t.kind === 'proof'
}

function isCemetery(t) {
  return t.slug.startsWith('cemetery-')
}

function strategyPipelineBullets() {
  return [
    '**Research pipeline:** Idea → Hypothesis → Signal → Backtest → Risk → Post‑Mortem.',
    'Data issues: define data provenance, corporate actions, stale prints, and latency; assume vendor revisions.',
    'Slippage: model state-dependent slippage; assume worse fills during volatility spikes and news.',
    'Capacity: estimate impact vs AUM; assume edge decays with AUM and crowding.',
    'Decay curves: track half-life of signal; assume faster decay after publication and adoption.',
  ]
}

function proofRiskBullets(title) {
  return [
    `Assumptions are the point: list them explicitly and map each to a market violation for **${title}**.`,
    'Market violation mapping: frictions (costs/impact), discrete trading, jumps, constraints, and funding breaks usually fail first.',
    'Identify the first assumption to fail in practice and how it degrades the decision (risk limits, hedges, or sizing).',
  ]
}

function cemeteryBullets(title) {
  if (title.includes('Intraday Mean Reversion')) {
    return {
      name: 'US Equity Intraday Mean Reversion',
      era: '2003–2007',
      worked: 'Fragmentation + predictable dealer/institutional flow + weaker competition; microstructure edges were large vs costs.',
      died: 'HFT competition, tick/fee structure changes, faster arbitrage, and crowding; impact rose, alpha half-life collapsed.',
      replaced: 'More granular execution alpha, order-book models, and slower horizon signals with explicit capacity control.',
    }
  }
  if (title.includes('Short Volatility Carry')) {
    return {
      name: 'Short Volatility Carry',
      era: '2012–2017',
      worked: 'Central-bank backstop + abundant liquidity; VRP harvested with manageable drawdowns most of the time.',
      died: 'Convexity trap + crowded exposure; crash risk realized (e.g., Feb 2018) and margin/vol control feedback amplified losses.',
      replaced: 'Structured convexity hedges, dynamic risk limits, and smaller VRP exposure with explicit crash hedging.',
    }
  }
  if (title.includes('G10 FX Carry')) {
    return {
      name: 'G10 FX Carry',
      era: '2002–2007',
      worked: 'Stable growth and risk-on; high-yielders appreciated or didn’t crash often; funding was easy.',
      died: 'Crash risk in risk-off; funding stress and correlated unwinds; carry becomes short volatility with brutal tails.',
      replaced: 'Carry with defensive overlays, regime filters, options hedges, and position caps tied to liquidity/vol.',
    }
  }
  if (title.includes('Low-Vol Crowd')) {
    return {
      name: 'Equity Low-Vol Crowding',
      era: '2011–2016',
      worked: 'QE era preference for defensives; low-vol got bid, and benchmark constraints reinforced the trade.',
      died: 'Crowding + valuation compression; factor crash when rates/flows reversed; liquidity in “safe” names vanished.',
      replaced: 'Quality/low-vol with valuation and rates sensitivity controls; diversified defensive baskets with turnover caps.',
    }
  }
  return {
    name: title.replace('Alpha Cemetery: ', ''),
    era: 'Unknown',
    worked: 'It aligned with a temporary market structure + behavioral pattern.',
    died: 'Competition + crowding + cost/impact + regime shift.',
    replaced: 'A constrained variant or a different signal family.',
  }
}

function generateEntry(t) {
  const G = baseGlobal()

  const useCase = []
  const hidden = []
  const failures = []
  const regimes = []
  const why = []

  // Topic-specific defaults (minimal, but decision- and failure-oriented)
  useCase.push(`Use when **${t.title}** directly changes a decision boundary (risk limit, hedge ratio, sizing, or execution policy).`)
  useCase.push('Use only if the expected edge survives conservative costs, impact, and financing/borrow terms.')
  if (isStrategy(t)) useCase.push(...strategyPipelineBullets())

  hidden.push(`Hidden assumption: your inputs for **${t.title}** are stable enough to estimate before the market changes.`)
  hidden.push('Hidden assumption: your backtest and live implementation match (no leakage, no survivorship, same fills).')
  if (isProof(t)) hidden.push(...proofRiskBullets(t.title))
  hidden.push(...G.regime)

  failures.push('Failure mode: the edge is smaller than modeled costs/impact → “alpha” turns into fee/impact transfer.')
  failures.push('Failure mode: correlations rise and liquidity falls together → diversification fails and liquidation costs spike.')
  failures.push(...G.versioning)

  regimes.push('Breaks in crisis or transition regimes where volatility jumps, liquidity vanishes, and correlations converge.')
  regimes.push('Breaks under macro discontinuities (rates/policy shocks) and crowded unwinds where constraints bind.')

  why.push('Funds use it when it improves risk-adjusted outcomes after costs and when it fits operational constraints.')
  why.push('Funds avoid it when it is capacity-limited, too crowded, too fragile to regime shifts, or dominated by tail risk.')
  why.push(...G.antiMarketing)

  // Alpha cemetery: enforce required fields
  if (isCemetery(t)) {
    const cem = cemeteryBullets(`Alpha Cemetery: ${t.title.replace('Alpha Cemetery: ', '')}`)
    useCase.unshift(`**Dead alpha record** — name: ${cem.name}; era: ${cem.era}.`)
    hidden.unshift(`Why it worked: ${cem.worked}`)
    failures.unshift(`Why it died: ${cem.died}`)
    why.unshift(`What replaced it (if anything): ${cem.replaced}`)
  }

  // Required global cost modeling
  useCase.push(...G.costs)

  const body =
    `## Use Case\n${mdBullets(useCase)}\n\n` +
    `## Hidden Assumptions\n${mdBullets(hidden)}\n\n` +
    `## Failure Modes\n${mdBullets(failures)}\n\n` +
    `## Market Regimes Where It Breaks\n${mdBullets(regimes)}\n\n` +
    `## Why Funds Actually Use / Avoid It\n${mdBullets(why)}\n`

  const tags = Array.from(new Set([...(t.tags ?? []), 'failure-focused', 'regime-aware', 'costs', 'constraints']))

  return {
    title: t.title,
    slug: t.slug,
    content_type: t.kind, // must be one of: algorithm|formula|proof|paper|code|strategy
    difficulty: t.level,
    tags,
    abstract:
      `Decision-oriented notes on ${t.title}: when to use it, how it fails, and why real funds use or avoid it under costs, constraints, and regime shifts.`,
    body_md: body,
    code_snippet: null,
    author_name: 'Quant Library',
    source_url: null,
    publish_status: 'published',
  }
}

async function main() {
  const url = required('SUPABASE_URL')
  const serviceKey = required('SUPABASE_SERVICE_ROLE_KEY')

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const rows = TOPICS.map((t) => generateEntry(t))

  // Validate allowed enums early
  const allowedContent = new Set(['algorithm', 'formula', 'proof', 'paper', 'code', 'strategy'])
  const allowedDifficulty = new Set(['beginner', 'intermediate', 'advanced'])
  for (const r of rows) {
    if (!allowedContent.has(r.content_type)) throw new Error(`Invalid content_type for ${r.slug}: ${r.content_type}`)
    if (!allowedDifficulty.has(r.difficulty)) throw new Error(`Invalid difficulty for ${r.slug}: ${r.difficulty}`)
  }

  const { error } = await supabase.from('library_items').upsert(rows, { onConflict: 'slug' })
  if (error) throw error
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

