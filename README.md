# GigShield — AI-Powered Parametric Income Insurance for India's Gig Delivery Workers
### Guidewire DEVTrails 2026 | Phase 1 Submission

---

## Problem Statement

India's **12+ million platform-based delivery partners** (Zomato, Swiggy, Zepto, Amazon, Blinkit) earn an average of ₹15,000–₹25,000/month with zero income protection. A single extreme weather event, sudden curfew, or environmental disruption can wipe out 20–30% of their weekly earnings overnight — with no safety net whatsoever.

Traditional insurance is inaccessible to gig workers: it's annual, expensive, requires paperwork, and never pays out fast enough to matter. **GigShield** changes that.

---

## Our Solution

**GigShield** is an AI-enabled parametric insurance platform that automatically detects external disruptions and instantly pays out lost income — no claim forms, no human adjudicators, no delays.

> **"If the weather shuts down your city, your payout arrives before the rain stops."**

### Persona Focus

**Food Delivery Partners on Zomato & Swiggy** — chosen because:
- Highest exposure to weather disruptions (outdoor, motorcycle-based)
- Operate in dense urban zones with measurable, hyperlocal risk data
- Weekly earnings cycle matches our pricing model perfectly
- Largest segment: ~5 million active partners in India

---

## Core Features

### 1. Optimised Onboarding
- 3-step mobile-first registration: Phone number → Platform verification (Zomato/Swiggy partner ID) → Zone selection
- AI risk profiling during onboarding using delivery zone, historical earnings data, and local weather risk index
- Policy activated instantly — no waiting period

### 2. Weekly Premium Model

| Coverage Tier | Weekly Premium | Max Weekly Payout | Trigger Threshold |
|---|---|---|---|
| Basic Shield | ₹29/week | ₹500 | Red alert weather (≥3hrs) |
| Standard Shield | ₹59/week | ₹1,200 | Orange alert (≥2hrs) |
| Pro Shield | ₹99/week | ₹2,500 | Yellow alert (≥1.5hrs) |

**Premium Formula:**
```
Weekly Premium = BasePremium × ZoneRiskMultiplier × EarningsExposureFactor × (1 - SafetyDiscountFactor)
```
- `ZoneRiskMultiplier`: 0.8–1.6 based on historical flood/heat/AQI data for that pin code
- `EarningsExposureFactor`: Derived from platform earnings data (higher earnings = higher coverage)
- `SafetyDiscountFactor`: Up to 20% discount for zones with low historical claims

### 3. Parametric Triggers (Automated, No Claims Needed)

Coverage triggers automatically when verified external data crosses defined thresholds:

| Trigger Type | Data Source | Threshold | Payout |
|---|---|---|---|
| Extreme Rain / Flood | IMD API + OpenWeatherMap | Red alert ≥ 3 continuous hours | 100% of tier payout |
| Extreme Heat | IMD Heat Wave API | >45°C for ≥ 2hrs in operative zone | 80% of tier payout |
| Severe AQI / Pollution | CPCB AQI API | AQI > 400 (Severe+) for ≥ 2hrs | 70% of tier payout |
| Curfew / Section 144 | Government notification APIs + News NLP | Active curfew in delivery zone | 100% of tier payout |
| Platform Outage | Platform heartbeat monitoring | Zomato/Swiggy API downtime > 45 min | 60% of tier payout |

> No claim filing. The system watches the data, triggers the condition, and processes the payout automatically.

### 4. Instant Payout Processing
- Payouts via UPI (GPay/PhonePe) within **90 seconds** of trigger confirmation
- Razorpay sandbox for Phase 2 demo
- Full audit trail stored in Guidewire ClaimCenter schema

### 5. Analytics Dashboard

**Worker View:**
- Weekly coverage status (active/inactive)
- Earnings protected this month
- Payout history and trigger events
- Weather risk forecast for the next 48 hours in their zone

**Admin / Insurer View:**
- Live trigger monitoring map (city-wide)
- Weekly loss ratio per zone
- Fraud risk heatmap
- Predictive model: next week's likely payout volume based on weather forecast

---

## AI/ML Integration

### Dynamic Premium Calculation
- **Model:** Gradient Boosted Decision Tree (XGBoost)
- **Inputs:** Zone-level historical weather events, claim frequency, earnings volatility, seasonal patterns
- **Output:** Per-worker, per-week adjusted premium
- **Retraining:** Weekly on new claims + weather data

### Fraud Detection (Rule-Based + ML)
- Anomaly detection flags unusual claim patterns before payout
- Duplicate claim prevention via device fingerprinting + Aadhaar-linked UPI ID
- Behavioral analysis: claim frequency vs. historical work pattern

### NLP for Social Disruptions
- Monitors local news, district collector announcements, and traffic APIs
- Extracts curfew / strike / market closure signals to auto-trigger social disruption payouts

---

## Adversarial Defense & Anti-Spoofing Strategy

*This section was added in response to the Phase 1 Market Crash Scenario: a coordinated syndicate of 500 delivery workers used GPS-spoofing apps to fake presence in red-alert weather zones, draining the liquidity pool through mass false parametric claims.*

### Why Simple GPS Verification Is Not Enough

Our system is **parametric** — it does not rely on the worker's GPS location to trigger a claim. The trigger is based on **verified external data** (IMD, CPCB, government APIs), not self-reported location. This fundamentally eliminates the GPS-spoofing attack vector described in the threat report.

However, we have layered additional defenses below.

---

### 1. The Differentiation — Genuine Worker vs. Bad Actor

Our AI system uses a **multi-signal behavioral trust score** to distinguish genuine stranded workers from fraudulent claimants:

| Signal | Genuine Stranded Worker | GPS Spoofer at Home |
|---|---|---|
| Platform activity pre-disruption | Active orders in disruption zone in the last 2 hours | No recent platform activity in claimed zone |
| Device accelerometer / motion data | Movement patterns consistent with being outdoors (walking, riding) | Stationary — no motion detected |
| Network cell tower triangulation | Cell tower signature matches claimed disruption zone | Cell tower maps to residential area far from zone |
| Platform last-known location (at order acceptance) | Last accepted order pickup/drop matches disruption zone | Last order from different zone or no activity |
| Trigger correlation | Worker's zone is independently confirmed in red-alert | Worker's claimed zone is NOT in any active alert zone |

**The key insight:** Our parametric trigger fires on the *zone*, not the *individual worker's GPS*. A bad actor can spoof their GPS, but they cannot forge an IMD weather alert for a zone that isn't actually experiencing a disruption.

---

### 2. The Data — Detecting a Coordinated Fraud Ring

Beyond individual signals, coordinated rings exhibit patterns that stand out statistically:

**Ring Detection Data Points:**

- **Temporal clustering:** If 50+ claims are triggered within the same 10-minute window from the same residential pin code, this is flagged as a coordinated event — genuine stranded workers are geographically distributed across the disruption zone, not clustered in one address cluster
- **Device ID network analysis:** Multiple accounts sharing the same device, IMEI, or Wi-Fi network fingerprint are cross-referenced and flagged
- **Telegram/group communication metadata (passive):** Sudden spike in new policy activations in a specific zone 24–48 hours before a predicted weather event is a pre-fraud signal (fraudsters subscribe before a known incoming storm)
- **Earnings-to-claim ratio anomaly:** Workers who file for maximum payout but have low historical earnings (suggesting a fabricated profile) are flagged for manual review
- **Zone saturation rate:** If claims from a single 1km² zone exceed 3× the historical baseline during a trigger event, the entire zone batch is held for secondary verification
- **Velocity check:** A single user attempting to activate a policy and file a claim in the same hour is automatically held

**Response:** Flagged batches are held for a maximum of 4 hours while a lightweight secondary verification runs. Genuine workers are paid within this window. Confirmed fraud rings are permanently blacklisted from the platform.

---

### 3. The UX Balance — Protecting Honest Workers

The single biggest risk of anti-fraud measures is **wrongly penalizing honest gig workers** who may experience real network drops, GPS glitches, or data delays in bad weather. Our approach:

**Three-tier flagging system:**

| Flag Level | Meaning | Action |
|---|---|---|
| 🟢 Auto-Approve | All signals consistent, no anomalies | Payout in 90 seconds |
| 🟡 Soft Hold | 1-2 minor anomalies (e.g., cell tower mismatch due to network congestion) | Payout held for max 2 hours; worker notified via SMS with simple 1-tap confirmation ("Confirm you were working in [Zone X] today?") |
| 🔴 Hard Hold | Multiple strong fraud signals | Payout held; worker given 24-hour window to submit a single piece of evidence (e.g., screenshot of last Zomato order receipt from the zone) |

**Worker-friendly principles:**
- Workers are never accused of fraud — the message always reads: *"We're verifying your claim due to high claim volume in your zone. You'll hear from us within 2 hours."*
- Network drops in bad weather automatically expand the GPS tolerance radius from 500m to 2km, reducing false flags from poor connectivity
- A worker who has **3+ months of clean claim history** receives a Trust Badge — their claims are auto-approved and bypassed from secondary checks entirely
- Appeals take under 10 minutes via in-app chat with a human reviewer

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React Native (mobile-first, Android priority) |
| Backend | Node.js + Express |
| Database | PostgreSQL + Redis (session/trigger cache) |
| AI/ML | Python (XGBoost, scikit-learn), served via FastAPI |
| Insurance Core | Guidewire PolicyCenter (product model), ClaimCenter (STP claims) |
| Weather Data | IMD API, OpenWeatherMap, CPCB AQI |
| Payments | Razorpay (sandbox/test mode for Phase 2) |
| Fraud Detection | Custom rule engine + ML anomaly detection |
| Notifications | Firebase Cloud Messaging + Twilio SMS |

---

## Workflow — End-to-End User Journey

```
[Worker Opens App]
        ↓
[Onboarding: Phone → Partner ID → Zone → Risk Profile Generated]
        ↓
[Weekly Policy Activated: ₹29–₹99 debited via UPI auto-debit]
        ↓
[AI monitors: IMD + CPCB + News APIs every 5 minutes]
        ↓
[Disruption Threshold Crossed in Worker's Zone]
        ↓
[Fraud Engine: Behavioral Trust Score calculated in < 3 seconds]
        ↓
    [Score: Clean] ──────────────────────→ [Auto payout via UPI in 90s]
        ↓
    [Score: Soft Hold] ──→ [SMS confirmation tap] ──→ [Payout in < 2hrs]
        ↓
    [Score: Hard Hold] ──→ [Evidence request] ──→ [Human review 24hrs]
```

---

## Why Web vs. Mobile

**We chose Mobile (React Native)** because:
- Delivery partners work exclusively on smartphones — no desktop access
- UPI payments are natively mobile
- Push notifications for real-time trigger alerts require mobile
- GPS, accelerometer, and cell tower data (used for fraud detection) are only accessible on mobile

---

## Phase 1 Scope (Current Submission)

- [x] Problem definition and persona selection (Zomato/Swiggy food delivery)
- [x] Weekly premium model defined with parametric triggers
- [x] AI/ML architecture planned (dynamic pricing + fraud detection)
- [x] Adversarial defense and anti-spoofing strategy documented
- [x] Tech stack selected
- [x] Core workflow mapped end-to-end
- [ ] Working prototype (Phase 2)

---

## Repository Structure (Planned)

```
gigshield/
├── README.md                  ← This file
├── frontend/                  ← React Native mobile app
├── backend/                   ← Node.js API server
├── ml-engine/                 ← Python ML models (premium + fraud)
├── guidewire-integration/     ← PolicyCenter & ClaimCenter schemas
├── mock-data/                 ← Simulated weather/AQI trigger data
└── docs/                      ← Architecture diagrams, pitch deck
```

---

## Team

**GigShield Team — DEVTrails 2026**

> Built for the 12 million delivery partners who keep India fed — and who deserve a safety net as fast as the deliveries they make.

---

*Guidewire DEVTrails 2026 | Phase 1 | Deadline: March 20, 2026*
