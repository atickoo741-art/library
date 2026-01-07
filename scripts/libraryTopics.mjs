// Quant Library topics (exact list) + required Alpha Cemetery entries.

export const TOPICS = [
  // 1) PROBABILITY & STOCHASTIC PROCESSES
  { slug: 'prob-random-variables-distributions', title: 'Random Variables & Distributions', kind: 'formula', level: 'beginner', tags: ['probability','stochastic'] },
  { slug: 'prob-law-of-large-numbers', title: 'Law of Large Numbers', kind: 'proof', level: 'beginner', tags: ['probability','estimation'] },
  { slug: 'prob-central-limit-theorem', title: 'Central Limit Theorem', kind: 'proof', level: 'beginner', tags: ['probability','risk'] },
  { slug: 'prob-martingales', title: 'Martingales', kind: 'proof', level: 'intermediate', tags: ['stochastic-processes','no-arbitrage'] },
  { slug: 'prob-brownian-motion', title: 'Brownian Motion', kind: 'proof', level: 'intermediate', tags: ['stochastic-processes','volatility'] },
  { slug: 'prob-geometric-brownian-motion', title: 'Geometric Brownian Motion', kind: 'formula', level: 'intermediate', tags: ['stochastic-processes','equities'] },
  { slug: 'prob-itos-lemma', title: 'Ito’s Lemma', kind: 'proof', level: 'intermediate', tags: ['stochastic-calculus','hedging'] },
  { slug: 'prob-stochastic-differential-equations', title: 'Stochastic Differential Equations', kind: 'algorithm', level: 'advanced', tags: ['stochastic-calculus','modeling'] },
  { slug: 'prob-fokker-planck-equation', title: 'Fokker–Planck Equation', kind: 'proof', level: 'advanced', tags: ['stochastic-processes','tails'] },
  { slug: 'prob-markov-chains', title: 'Markov Chains', kind: 'algorithm', level: 'intermediate', tags: ['regimes','modeling'] },
  { slug: 'prob-hidden-markov-models', title: 'Hidden Markov Models', kind: 'algorithm', level: 'advanced', tags: ['regimes','inference'] },

  // 2) LINEAR ALGEBRA FOR QUANTS
  { slug: 'la-vector-spaces-inner-products', title: 'Vector Spaces & Inner Products', kind: 'formula', level: 'beginner', tags: ['linear-algebra','portfolio'] },
  { slug: 'la-eigenvalues-eigenvectors', title: 'Eigenvalues & Eigenvectors', kind: 'algorithm', level: 'intermediate', tags: ['linear-algebra','correlation'] },
  { slug: 'la-matrix-decompositions', title: 'Matrix Decompositions (LU, QR, SVD)', kind: 'algorithm', level: 'intermediate', tags: ['linear-algebra','numerics'] },
  { slug: 'la-covariance-correlation', title: 'Covariance & Correlation Matrices', kind: 'formula', level: 'beginner', tags: ['risk','covariance'] },
  { slug: 'la-pca', title: 'Principal Component Analysis (PCA)', kind: 'algorithm', level: 'intermediate', tags: ['pca','factors'] },
  { slug: 'la-numerical-stability-conditioning', title: 'Numerical Stability & Conditioning', kind: 'algorithm', level: 'advanced', tags: ['numerics','stability'] },

  // 3) ASSET PRICING THEORY
  { slug: 'ap-time-value-of-money', title: 'Time Value of Money', kind: 'formula', level: 'beginner', tags: ['asset-pricing','rates'] },
  { slug: 'ap-no-arbitrage-principle', title: 'No-Arbitrage Principle', kind: 'proof', level: 'beginner', tags: ['asset-pricing','no-arbitrage'] },
  { slug: 'ap-risk-neutral-pricing', title: 'Risk-Neutral Pricing', kind: 'proof', level: 'intermediate', tags: ['asset-pricing','derivatives'] },
  { slug: 'ap-state-price-densities', title: 'State Price Densities', kind: 'formula', level: 'advanced', tags: ['asset-pricing','derivatives'] },
  { slug: 'ap-stochastic-discount-factor', title: 'Stochastic Discount Factor', kind: 'formula', level: 'advanced', tags: ['asset-pricing','macro'] },
  { slug: 'ap-capm', title: 'CAPM', kind: 'proof', level: 'beginner', tags: ['asset-pricing','factors'] },
  { slug: 'ap-apt', title: 'Arbitrage Pricing Theory (APT)', kind: 'proof', level: 'intermediate', tags: ['asset-pricing','factors'] },
  { slug: 'ap-consumption-based-asset-pricing', title: 'Consumption-Based Asset Pricing', kind: 'proof', level: 'advanced', tags: ['asset-pricing','macro'] },

  // 4) OPTIONS & DERIVATIVES
  { slug: 'opt-black-scholes-formula', title: 'Black–Scholes Formula', kind: 'formula', level: 'intermediate', tags: ['options','pricing'] },
  { slug: 'opt-black-scholes-pde', title: 'Black–Scholes PDE', kind: 'proof', level: 'advanced', tags: ['options','pricing'] },
  { slug: 'opt-option-greeks', title: 'Option Greeks', kind: 'formula', level: 'intermediate', tags: ['options','risk'] },
  { slug: 'opt-implied-volatility', title: 'Implied Volatility', kind: 'formula', level: 'intermediate', tags: ['options','volatility'] },
  { slug: 'opt-volatility-smile-skew', title: 'Volatility Smile & Skew', kind: 'formula', level: 'advanced', tags: ['options','volatility'] },
  { slug: 'opt-binomial-trinomial-trees', title: 'Binomial & Trinomial Trees', kind: 'algorithm', level: 'intermediate', tags: ['options','numerics'] },
  { slug: 'opt-monte-carlo-option-pricing', title: 'Monte Carlo Option Pricing', kind: 'algorithm', level: 'intermediate', tags: ['options','simulation'] },
  { slug: 'opt-american-vs-european-options', title: 'American vs European Options', kind: 'proof', level: 'intermediate', tags: ['options','exercise'] },
  { slug: 'opt-exotic-options', title: 'Exotic Options', kind: 'proof', level: 'advanced', tags: ['options','path-dependence'] },
  { slug: 'opt-interest-rate-derivatives', title: 'Interest Rate Derivatives', kind: 'proof', level: 'advanced', tags: ['rates','derivatives'] },
  { slug: 'opt-credit-default-swaps', title: 'Credit Default Swaps (CDS)', kind: 'proof', level: 'advanced', tags: ['credit','derivatives'] },

  // 5) STATISTICAL ARBITRAGE
  { slug: 'statarb-mean-reversion', title: 'Mean Reversion', kind: 'strategy', level: 'beginner', tags: ['stat-arb','mean-reversion'] },
  { slug: 'statarb-z-score-trading', title: 'Z-Score Trading', kind: 'strategy', level: 'beginner', tags: ['stat-arb','signals'] },
  { slug: 'statarb-pairs-trading', title: 'Pairs Trading', kind: 'strategy', level: 'intermediate', tags: ['stat-arb','pairs'] },
  { slug: 'statarb-cointegration', title: 'Cointegration (Engle–Granger, Johansen)', kind: 'proof', level: 'advanced', tags: ['stat-arb','cointegration'] },
  { slug: 'statarb-kalman-filter-pairs', title: 'Kalman Filter for Pairs Trading', kind: 'algorithm', level: 'advanced', tags: ['stat-arb','state-space'] },

  // 6) MOMENTUM & TREND
  { slug: 'mom-time-series-momentum', title: 'Time-Series Momentum', kind: 'strategy', level: 'intermediate', tags: ['momentum','trend'] },
  { slug: 'mom-cross-sectional-momentum', title: 'Cross-Sectional Momentum', kind: 'strategy', level: 'intermediate', tags: ['momentum','cross-sectional'] },
  { slug: 'mom-moving-average-crossovers', title: 'Moving Average Crossovers', kind: 'strategy', level: 'beginner', tags: ['momentum','trend'] },
  { slug: 'mom-breakout-strategies', title: 'Breakout Strategies', kind: 'strategy', level: 'intermediate', tags: ['momentum','trend'] },
  { slug: 'mom-volatility-adjusted-momentum', title: 'Volatility-Adjusted Momentum', kind: 'strategy', level: 'intermediate', tags: ['momentum','volatility'] },

  // 7) VOLATILITY STRATEGIES
  { slug: 'vol-volatility-targeting', title: 'Volatility Targeting', kind: 'strategy', level: 'intermediate', tags: ['volatility','portfolio'] },
  { slug: 'vol-variance-risk-premium', title: 'Variance Risk Premium', kind: 'strategy', level: 'advanced', tags: ['volatility','options'] },
  { slug: 'vol-straddles-strangles', title: 'Straddles & Strangles', kind: 'strategy', level: 'intermediate', tags: ['volatility','options'] },
  { slug: 'vol-vix-based-strategies', title: 'VIX-Based Strategies', kind: 'strategy', level: 'advanced', tags: ['volatility','vix'] },
  { slug: 'vol-volatility-carry', title: 'Volatility Carry', kind: 'strategy', level: 'advanced', tags: ['volatility','carry'] },

  // 8) FACTOR INVESTING
  { slug: 'factor-value', title: 'Value Factor', kind: 'strategy', level: 'intermediate', tags: ['factors','equities'] },
  { slug: 'factor-size', title: 'Size Factor', kind: 'strategy', level: 'intermediate', tags: ['factors','equities'] },
  { slug: 'factor-momentum', title: 'Momentum Factor', kind: 'strategy', level: 'intermediate', tags: ['factors','momentum'] },
  { slug: 'factor-quality', title: 'Quality Factor', kind: 'strategy', level: 'intermediate', tags: ['factors','equities'] },
  { slug: 'factor-low-vol', title: 'Low Volatility Factor', kind: 'strategy', level: 'intermediate', tags: ['factors','volatility'] },
  { slug: 'factor-ff-3', title: 'Fama–French 3-Factor Model', kind: 'proof', level: 'intermediate', tags: ['factors','models'] },
  { slug: 'factor-ff-5', title: 'Fama–French 5-Factor Model', kind: 'proof', level: 'advanced', tags: ['factors','models'] },
  { slug: 'factor-neutralization', title: 'Factor Neutralization', kind: 'algorithm', level: 'intermediate', tags: ['factors','risk'] },

  // 9) PORTFOLIO CONSTRUCTION
  { slug: 'pc-mean-variance-optimization', title: 'Mean–Variance Optimization', kind: 'algorithm', level: 'intermediate', tags: ['portfolio','optimization'] },
  { slug: 'pc-efficient-frontier', title: 'Efficient Frontier', kind: 'formula', level: 'beginner', tags: ['portfolio','optimization'] },
  { slug: 'pc-risk-parity', title: 'Risk Parity', kind: 'strategy', level: 'intermediate', tags: ['portfolio','risk'] },
  { slug: 'pc-maximum-sharpe', title: 'Maximum Sharpe Portfolio', kind: 'algorithm', level: 'intermediate', tags: ['portfolio','optimization'] },
  { slug: 'pc-minimum-variance', title: 'Minimum Variance Portfolio', kind: 'algorithm', level: 'intermediate', tags: ['portfolio','optimization'] },
  { slug: 'pc-black-litterman', title: 'Black–Litterman Model', kind: 'algorithm', level: 'advanced', tags: ['portfolio','bayesian'] },
  { slug: 'pc-cvar-optimization', title: 'CVaR Optimization', kind: 'algorithm', level: 'advanced', tags: ['portfolio','risk'] },
  { slug: 'pc-transaction-cost-modeling', title: 'Transaction Cost Modeling', kind: 'algorithm', level: 'advanced', tags: ['execution','costs'] },
  { slug: 'pc-rebalancing-strategies', title: 'Rebalancing Strategies', kind: 'strategy', level: 'intermediate', tags: ['portfolio','execution'] },

  // 10) RISK MANAGEMENT
  { slug: 'risk-var', title: 'Value at Risk (VaR)', kind: 'formula', level: 'beginner', tags: ['risk','tails'] },
  { slug: 'risk-cvar', title: 'Conditional Value at Risk (CVaR)', kind: 'formula', level: 'intermediate', tags: ['risk','tails'] },
  { slug: 'risk-drawdown-analysis', title: 'Drawdown Analysis', kind: 'algorithm', level: 'beginner', tags: ['risk','path-dependence'] },
  { slug: 'risk-stress-testing', title: 'Stress Testing', kind: 'algorithm', level: 'intermediate', tags: ['risk','scenarios'] },
  { slug: 'risk-scenario-analysis', title: 'Scenario Analysis', kind: 'algorithm', level: 'intermediate', tags: ['risk','scenarios'] },
  { slug: 'risk-tail-risk', title: 'Tail Risk', kind: 'proof', level: 'intermediate', tags: ['risk','tails'] },
  { slug: 'risk-correlation-breakdown', title: 'Correlation Breakdown', kind: 'proof', level: 'intermediate', tags: ['risk','correlation'] },
  { slug: 'risk-kelly-criterion', title: 'Kelly Criterion', kind: 'formula', level: 'advanced', tags: ['risk','sizing'] },
  { slug: 'risk-position-sizing-algorithms', title: 'Position Sizing Algorithms', kind: 'algorithm', level: 'intermediate', tags: ['risk','sizing'] },

  // 11) MACHINE LEARNING FOR QUANTS
  { slug: 'ml-linear-regression', title: 'Linear Regression', kind: 'algorithm', level: 'beginner', tags: ['ml','forecasting'] },
  { slug: 'ml-logistic-regression', title: 'Logistic Regression', kind: 'algorithm', level: 'beginner', tags: ['ml','classification'] },
  { slug: 'ml-ridge-lasso-elastic-net', title: 'Ridge / Lasso / Elastic Net', kind: 'algorithm', level: 'intermediate', tags: ['ml','regularization'] },
  { slug: 'ml-knn', title: 'k-Nearest Neighbors', kind: 'algorithm', level: 'beginner', tags: ['ml','classification'] },
  { slug: 'ml-svm', title: 'Support Vector Machines', kind: 'algorithm', level: 'intermediate', tags: ['ml','classification'] },
  { slug: 'ml-decision-trees', title: 'Decision Trees', kind: 'algorithm', level: 'beginner', tags: ['ml','models'] },
  { slug: 'ml-random-forest', title: 'Random Forests', kind: 'algorithm', level: 'intermediate', tags: ['ml','models'] },
  { slug: 'ml-gradient-boosting', title: 'Gradient Boosting', kind: 'algorithm', level: 'intermediate', tags: ['ml','models'] },
  { slug: 'ml-arima-sarima', title: 'ARIMA / SARIMA', kind: 'algorithm', level: 'intermediate', tags: ['time-series','forecasting'] },
  { slug: 'ml-garch-egarch', title: 'GARCH / EGARCH', kind: 'algorithm', level: 'advanced', tags: ['time-series','volatility'] },
  { slug: 'ml-state-space-models', title: 'State Space Models', kind: 'algorithm', level: 'advanced', tags: ['time-series','state-space'] },
  { slug: 'ml-lstm-financial', title: 'LSTM for Financial Time Series', kind: 'algorithm', level: 'advanced', tags: ['ml','time-series'] },
  { slug: 'ml-regime-detection-models', title: 'Regime Detection Models', kind: 'algorithm', level: 'advanced', tags: ['ml','regimes'] },

  // 12) BACKTESTING & IMPLEMENTATION
  { slug: 'bt-lookahead-bias', title: 'Lookahead Bias', kind: 'proof', level: 'beginner', tags: ['backtesting','bias'] },
  { slug: 'bt-survivorship-bias', title: 'Survivorship Bias', kind: 'proof', level: 'beginner', tags: ['backtesting','bias'] },
  { slug: 'bt-overfitting', title: 'Overfitting', kind: 'proof', level: 'beginner', tags: ['backtesting','overfitting'] },
  { slug: 'bt-walk-forward-analysis', title: 'Walk-Forward Analysis', kind: 'algorithm', level: 'intermediate', tags: ['backtesting','validation'] },
  { slug: 'bt-slippage', title: 'Slippage', kind: 'algorithm', level: 'beginner', tags: ['execution','costs'] },
  { slug: 'bt-transaction-costs', title: 'Transaction Costs', kind: 'algorithm', level: 'beginner', tags: ['execution','costs'] },
  { slug: 'bt-capacity-constraints', title: 'Capacity Constraints', kind: 'proof', level: 'intermediate', tags: ['capacity','impact'] },
  { slug: 'bt-execution-algorithms', title: 'Execution Algorithms (VWAP, TWAP)', kind: 'algorithm', level: 'intermediate', tags: ['execution','microstructure'] },

  // 13) PROOFS & THEORY
  { slug: 'th-proof-itos-lemma', title: 'Proof of Ito’s Lemma', kind: 'proof', level: 'advanced', tags: ['theory','stochastic-calculus'] },
  { slug: 'th-proof-black-scholes-pde', title: 'Proof of Black–Scholes PDE', kind: 'proof', level: 'advanced', tags: ['theory','options'] },
  { slug: 'th-proof-no-arbitrage-pricing', title: 'Proof of No-Arbitrage Pricing', kind: 'proof', level: 'intermediate', tags: ['theory','asset-pricing'] },
  { slug: 'th-capm-proof-outline', title: 'CAPM Proof Outline', kind: 'proof', level: 'intermediate', tags: ['theory','factors'] },
  { slug: 'th-cointegration-proof-sketch', title: 'Cointegration Proof Sketch', kind: 'proof', level: 'advanced', tags: ['theory','stat-arb'] },
  { slug: 'th-monte-carlo-convergence', title: 'Monte Carlo Convergence', kind: 'proof', level: 'intermediate', tags: ['theory','simulation'] },
  { slug: 'th-bias-variance-tradeoff', title: 'Bias–Variance Tradeoff', kind: 'proof', level: 'beginner', tags: ['theory','ml'] },

  // 14) META / RESEARCH SYSTEMS
  { slug: 'meta-alpha-decay', title: 'Alpha Decay', kind: 'proof', level: 'intermediate', tags: ['research','decay'] },
  { slug: 'meta-strategy-crowding', title: 'Strategy Crowding', kind: 'proof', level: 'intermediate', tags: ['research','crowding'] },
  { slug: 'meta-signal-combination-ensembles', title: 'Signal Combination & Ensembles', kind: 'algorithm', level: 'intermediate', tags: ['research','ensembles'] },
  { slug: 'meta-quant-research-pipelines', title: 'Quant Research Pipelines', kind: 'algorithm', level: 'intermediate', tags: ['research','process'] },
  { slug: 'meta-model-risk', title: 'Model Risk', kind: 'proof', level: 'intermediate', tags: ['research','model-risk'] },
  { slug: 'meta-why-most-alphas-die', title: 'Why Most Alphas Die', kind: 'proof', level: 'intermediate', tags: ['research','failure'] },

  // DEAD ALPHAS (Alpha Cemetery)
  { slug: 'cemetery-us-equity-mean-reversion-2003-2007', title: 'Alpha Cemetery: US Equity Intraday Mean Reversion (2003–2007)', kind: 'strategy', level: 'intermediate', tags: ['alpha-cemetery','stat-arb','microstructure'] },
  { slug: 'cemetery-volatility-carry-pre-2018', title: 'Alpha Cemetery: Short Volatility Carry (2012–2017)', kind: 'strategy', level: 'advanced', tags: ['alpha-cemetery','volatility','carry'] },
  { slug: 'cemetery-fx-carry-g10-2000s', title: 'Alpha Cemetery: G10 FX Carry (2002–2007)', kind: 'strategy', level: 'advanced', tags: ['alpha-cemetery','fx','carry'] },
  { slug: 'cemetery-low-vol-equities-2011-2016', title: 'Alpha Cemetery: Equity Low-Vol Crowd (2011–2016)', kind: 'strategy', level: 'intermediate', tags: ['alpha-cemetery','factors','crowding'] },
]

