-- Quant Library seed data
-- Run this in the Supabase SQL editor (or via `supabase db reset` if using the CLI).

-- ---------------------------------------------------------------------------
-- Promote an existing user to admin (after you sign up once in the UI).
-- Replace the email below with your real email.
-- ---------------------------------------------------------------------------
-- update public.profiles p
-- set role = 'admin'
-- from auth.users u
-- where p.id = u.id
--   and u.email = 'you@example.com';

-- ---------------------------------------------------------------------------
-- Sample published library items
-- ---------------------------------------------------------------------------

insert into public.library_items (
  id, title, slug, content_type, difficulty, tags, abstract, body_md, code_snippet, author_name, source_url, publish_status
) values
(
  gen_random_uuid(),
  'Black–Scholes (European Call) — Derivation Sketch',
  'black-scholes-european-call-derivation',
  'proof',
  'intermediate',
  array['options','stochastic-calculus','pricing'],
  'A compact derivation of the Black–Scholes PDE and the closed-form European call price.',
  E'## Setup\nWe assume a geometric Brownian motion:\n\n$$dS_t = \\mu S_t\\,dt + \\sigma S_t\\,dW_t$$\n\nUsing a self-financing hedged portfolio and Itô''s lemma, we obtain the Black–Scholes PDE.\n\n## Closed-form\nFor a European call:\n\n$$C = S_0\\,\\Phi(d_1) - K e^{-rT}\\,\\Phi(d_2)$$\n\nwhere\n\n$$d_1 = \\frac{\\ln(S_0/K) + (r + \\tfrac{1}{2}\\sigma^2)T}{\\sigma\\sqrt{T}},\\quad d_2 = d_1 - \\sigma\\sqrt{T}$$\n',
  null,
  'Quant Library',
  'https://en.wikipedia.org/wiki/Black%E2%80%93Scholes_model',
  'published'
),
(
  gen_random_uuid(),
  'Mean-Variance Portfolio Optimization (Markowitz)',
  'mean-variance-portfolio-optimization-markowitz',
  'formula',
  'beginner',
  array['portfolio','optimization','risk'],
  'The classic quadratic program for mean-variance optimization, with the closed-form unconstrained solution.',
  E'## Problem\nMinimize variance for a target return:\n\n$$\\min_w\\; w^\\top \\Sigma w \\quad \\text{s.t.}\\quad \\mu^\\top w = \\mu_* ,\\; \\mathbf{1}^\\top w = 1$$\n\n## Unconstrained (no constraints)\nIf unconstrained with risk aversion \\(\\lambda\\):\n\n$$\\max_w\\; \\mu^\\top w - \\tfrac{\\lambda}{2} w^\\top \\Sigma w \\implies w^* = \\tfrac{1}{\\lambda}\\Sigma^{-1}\\mu$$\n',
  null,
  'Quant Library',
  null,
  'published'
),
(
  gen_random_uuid(),
  'Simple Momentum Strategy (Crossing Moving Averages)',
  'simple-momentum-strategy-moving-average-crossover',
  'strategy',
  'beginner',
  array['momentum','trading','time-series'],
  'A minimal moving-average crossover strategy with clear entry/exit rules.',
  E'## Rules\n- Compute fast MA \\(m_f\\) and slow MA \\(m_s\\)\n- **Long** when \\(m_f > m_s\\), **flat** otherwise\n\n## Notes\nThis is a teaching example; in production you''d include transaction costs, slippage, and robust validation.\n',
  E'// Pseudocode\nif MA(price, fast) > MA(price, slow):\n  position = 1\nelse:\n  position = 0\n',
  'Quant Library',
  null,
  'published'
);

