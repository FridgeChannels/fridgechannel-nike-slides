# FridgeChannel Brand Proposal Template

用途：作为同一套页面展示方式下，为不同品牌快速替换文案与视觉素材的 proposal 内容模板。

使用方式：保留页面结构、模块顺序、交互方式和展示形式；替换 `{...}` 占位符、品牌相关案例、内容支柱、CTA、产品线、视觉素材和 ROI 参数。

---

## Global Variables

| Field | Current Nike Example | Replace With |
| --- | --- | --- |
| `{BRAND}` | Nike | Target brand name |
| `{BRAND_ACCENT}` | Nike Volt / Nike Orange | Target brand accent colors |
| `{PROPOSAL_TITLE}` | Pilot Proposal | Proposal type |
| `{BRAND_CHANNEL_NAME}` | Nike Family Channel | Brand-specific FridgeChannel name |
| `{PRIMARY_AUDIENCE}` | US sports families | Target household audience |
| `{PILOT_HOUSEHOLDS}` | 100 households minimum | Pilot household count |
| `{PILOT_DURATION}` | 4 weeks minimum | Pilot duration |
| `{HERO_IMAGE}` | `pics/hero_pic.png` | Brand hero visual |
| `{DEVICE_RENDERING_IMAGE}` | `pics/visual_pic.png` | Brand device rendering |
| `{DASHBOARD_IMAGE}` | `pics/dashboard_pic.jpeg` | Brand dashboard / analytics visual |

---

# Page Structure

## 1. Hero

### Visual Slot

Use `{HERO_IMAGE}` in the hero image area.

Current image:

`pics/hero_pic.png`

### Hero Headline

Current copy:

```text
FridgeChannel
× Nike
Pilot Proposal
```

Template:

```text
FridgeChannel
× {BRAND}
{PROPOSAL_TITLE}
```

---

## 2. Opportunity

### Section Label

Current copy:

```text
01 // The Opportunity
```

Template:

```text
01 // The Opportunity
```

### Section Headline

Current copy:

```text
Only FridgeChannel does all three.
```

Template:

```text
Only FridgeChannel does all three.
```

### Opportunity Card 1

Number:

```text
0
```

Title:

```text
Algorithm & Ad-Blockers
```

Current body:

```text
No Meta algorithm changes, no Google policy shifts, no AI summaries. A hardware-based touchpoint that Nike fully controls.
```

Template body:

```text
No Meta algorithm changes, no Google policy shifts, no AI summaries. A hardware-based touchpoint that {BRAND} fully controls.
```

### Opportunity Card 2

Number:

```text
25+
```

Title:

```text
Daily Family Impressions
```

Current body:

```text
US households open the fridge 20-40 times daily. 25,000+ annualized impressions per household without disrupting daily life.
```

Template body:

```text
US households open the fridge 20-40 times daily. 25,000+ annualized impressions per household without disrupting daily life.
```

### Opportunity Card 3

Number:

```text
3x
```

Title:

```text
Cross-Generational Reach
```

Current body:

```text
Unlike a phone, a fridge is a shared interface. Reach younger household members, purchase decision-makers, and the broader family in one high-frequency environment.

```

Template body:

```text
Unlike a phone, a fridge is a shared interface. Reach the {YOUNGER_AUDIENCE}, the {BUYER_AUDIENCE}, and the {EXTENDED_HOUSEHOLD_AUDIENCE} in one go.
```

Nike replacement variables:

```text
{YOUNGER_AUDIENCE} = kid picking sports
{BUYER_AUDIENCE} = parent buying gear
{EXTENDED_HOUSEHOLD_AUDIENCE} = grandparent
```

---

## 3. Solution

### Section Label

Current copy:

```text
02 // The Solution
```

Template:

```text
02 // The Solution
```

### Section Headline

Current copy:

```text
Nike Family Channel Solution
```

Template:

```text
{BRAND_CHANNEL_NAME} Solution
```

---

## 3.1 Device / Hardware

### Visual Slot

Use `{DEVICE_RENDERING_IMAGE}` in the device rendering area.

Current image:

`pics/visual_pic.png`

### Eyebrow

Current copy:

```text
DEVICE // HARDWARE
```

Template:

```text
DEVICE // HARDWARE
```

### Headline

Current copy:

```text
Exclusive Nike Touchpoint
```

Template:

```text
Exclusive {BRAND} Touchpoint
```

### Feature 1

Current copy:

```text
Custom Nike ID: Deep integration of industrial design, UI, and brand identity.
```

Template:

```text
Custom {BRAND} ID: Deep integration of industrial design, UI, and brand identity.
```

### Feature 2

Current copy:

```text
High-Frequency Context: Dominate 25+ daily household interactions at the fridge.
```

Template:

```text
High-Frequency Context: Dominate 25+ daily household interactions at the fridge.
```

### Feature 3

Current copy:

```text
Zero-Friction Setup: Magnetic installation, rapid deployment into target households.
```

Template:

```text
Zero-Friction Setup: Magnetic installation, rapid deployment into target households.
```

---

## 3.2 Content Engine

### Eyebrow

Current copy:

```text
CONTENT // CONTENT
```

Template:

```text
CONTENT // CONTENT
```

### Headline

Current copy:

```text
Brand Content & Consumer Engagement
```

Template:

```text
Brand Content & Consumer Engagement
```

### Content Pillar Cards

Replace these with categories that fit the target brand.

| Current Nike Pillar | Current Example Copy | Template |
| --- | --- | --- |
| Basketball Culture | Hoop challenges, finals countdown, youth confidence tips | `{CONTENT_PILLAR_1}` / `{CONTENT_EXAMPLES_1}` |
| Running & Weather | Local running index, best training days, easy run reminders | `{CONTENT_PILLAR_2}` / `{CONTENT_EXAMPLES_2}` |
| Home Training | 5-min family challenges, parent-child drills, evening stretching | `{CONTENT_PILLAR_3}` / `{CONTENT_EXAMPLES_3}` |
| Nike Product Stories | Pegasus, Vomero, Air Max series heritage | `{CONTENT_PILLAR_4}` / `{CONTENT_EXAMPLES_4}` |
| Athlete Moments | Mindset shorts, game day reminders, new signings | `{CONTENT_PILLAR_5}` / `{CONTENT_EXAMPLES_5}` |
| Seasonal Campaigns | Back to School, Holiday gifting, Marathon season specials | `{CONTENT_PILLAR_6}` / `{CONTENT_EXAMPLES_6}` |
| Commerce CTA | Explore Basketball, Join Nike Membership, Open Nike App | `{COMMERCE_CTA_TITLE}` / `{COMMERCE_CTA_EXAMPLES}` |

### Playback Visual Card

Current title:

```text
[Visual: Playback Sample]
```

Current button symbol:

```text
▶
```

Current caption:

```text
Feel the motion, rhythm, and CTA loop
```

Template:

```text
[Visual: Playback Sample]
Feel the motion, rhythm, and CTA loop
```

Optional replacement:

```text
[Visual: {BRAND} Playback Sample]
Feel the motion, rhythm, and CTA loop
```

---

## 3.3 Data / Insights

### Visual Slot

Use `{DASHBOARD_IMAGE}` in the dashboard visual area.

Current image:

`pics/dashboard_pic.jpeg`

### Eyebrow

Current copy:

```text
INSIGHTS // DATA
```

Template:

```text
INSIGHTS // DATA
```

### Headline

Current copy:

```text
Full-Funnel Behavioral Insights
```

Template:

```text
Full-Funnel Behavioral Insights
```

### Insight Cards

Current cards:

```text
Installation & Activation Rate
Playback & CTA Engagement
Product / Campaign Heat Analysis
Consideration & Purchase Intent Tracking
```

Template:

```text
Installation & Activation Rate
Playback & CTA Engagement
Product / Campaign Heat Analysis
Consideration & Purchase Intent Tracking
```

Brand-specific option:

```text
Installation & Activation Rate
Playback & CTA Engagement
{BRAND_CATEGORY} / Campaign Heat Analysis
Consideration & Purchase Intent Tracking
```

---

## 4. ROI & Pilot

### Section Label

Current copy:

```text
03 // The ROI & Pilot
```

Template:

```text
03 // The ROI & Pilot
```

---

## 4.1 Calculator Input Area

### Initial Guide

Current copy:

```text
Enter parameters (min 4 weeks / 100 households) to unlock ROI estimation
```

Template:

```text
Enter parameters (min {MIN_PILOT_DURATION} / {MIN_PILOT_HOUSEHOLDS}) to unlock ROI estimation
```

Nike defaults:

```text
{MIN_PILOT_DURATION} = 4 weeks
{MIN_PILOT_HOUSEHOLDS} = 100 households
```

### Input Labels

Current copy:

```text
Pilot Duration (4 weeks min)
Pilot Households (100 min)
Calculate Pricing & ROI
```

Template:

```text
Pilot Duration ({MIN_WEEKS} weeks min)
Pilot Households ({MIN_HOUSEHOLDS} min)
Calculate Pricing & ROI
```

### Input Placeholders

Current copy:

```text
Min 4 weeks
Min 100 households
```

Template:

```text
Min {MIN_WEEKS} weeks
Min {MIN_HOUSEHOLDS} households
```

---

## 4.2 Pricing Results

### Pricing Header

Current copy:

```text
Pricing
```

Template:

```text
Pricing
```

### Total Investment Box

Current copy:

```text
ESTIMATED TOTAL INVESTMENT
$190,000
```

Template:

```text
ESTIMATED TOTAL INVESTMENT
{ESTIMATED_TOTAL_INVESTMENT}
```

The amount is generated by calculator logic.

### Cost Breakdown

Current copy:

```text
HARDWARE FEES
$150,000
($1,500 / unit × 100 units)

+

CONTENT & OPS
$40,000
($5,000 / week × 8 weeks)
```

Template:

```text
HARDWARE FEES
{HARDWARE_TOTAL}
({HARDWARE_UNIT_PRICE} / unit × {HOUSEHOLDS} units)

+

CONTENT & OPS
{OPS_TOTAL}
({OPS_PER_WEEK} / week × {PILOT_DURATION} weeks)
```

### Included Services

Current label:

```text
INCLUDED SERVICES
```

Current body:

```text
Exclusive Nike device industrial design, production & deployment, 60+ content modules, daily operations, weekly insights reports
```

Template body:

```text
Exclusive {BRAND} device industrial design, production & deployment, {CONTENT_MODULE_COUNT}+ content modules, daily operations, weekly insights reports
```

Nike defaults:

```text
{CONTENT_MODULE_COUNT} = 60
```

---

## 4.3 Return Dashboard

### Return Header

Current copy:

```text
Return
```

Template:

```text
Return
```

### Dashboard Header

Current copy:

```text
Estimated pilot value
100 households · 4 weeks
```

Template:

```text
Estimated pilot value
{HOUSEHOLDS} households · {PILOT_DURATION} weeks
```

### Total Pilot Value

Current copy:

```text
Total pilot value
$19,630
```

Template:

```text
Total pilot value
{TOTAL_PILOT_VALUE}
```

### Value Composition Legend

Current copy:

```text
Revenue $5,280
Pipeline $4,410
LTV $5,850
Media $2,100
Brand $1,990
```

Template:

```text
Revenue {REVENUE_VALUE}
Pipeline {PIPELINE_VALUE}
LTV {LTV_VALUE}
Media {MEDIA_VALUE}
Brand {BRAND_VALUE}
```

### Proof Metric Cards

Current copy:

```text
Direct revenue
$5,280
44 orders
```

Template:

```text
Direct revenue
{REVENUE_VALUE}
{ORDERS} orders
```

Current copy:

```text
Brand awareness lift
+5.2%
Kantar-projected
```

Template:

```text
Brand awareness lift
{BRAND_AWARENESS_LIFT}
{AWARENESS_MODEL_SOURCE}
```

Nike defaults:

```text
{BRAND_AWARENESS_LIFT} = +5.2%
{AWARENESS_MODEL_SOURCE} = Kantar-projected
```

Current copy:

```text
Scale @ 5,000 HH
$12.7M
annualized
```

Template:

```text
Scale @ {SCALE_HOUSEHOLDS} HH
{SCALE_VALUE}
annualized
```

Nike defaults:

```text
{SCALE_HOUSEHOLDS} = 5,000
```

### Conversion Path

Current label:

```text
Conversion path
```

Current path:

```text
70k impressions
7% →
4,900 views
3% →
147 leads
30% →
44 orders
30% →
13 retained
```

Template:

```text
{IMPRESSIONS} impressions
{VIEW_RATE} →
{VIEWS} views
{LEAD_RATE} →
{LEADS} leads
{ORDER_RATE} →
{ORDERS} orders
{RETENTION_RATE} →
{RETAINED_CUSTOMERS} retained
```

Nike defaults:

```text
{VIEW_RATE} = 7%
{LEAD_RATE} = 3%
{ORDER_RATE} = 30%
{RETENTION_RATE} = 30%
```

### Calculation Methodology

Current label:

```text
How we calculate
```

Current formulas:

```text
Revenue = orders × AOV = 44 × $120 = $5,280
Pipeline = leads × per-lead value = 147 × $30 = $4,410
LTV captured = retained × CLV = 13 × $450 = $5,850
Media value = impressions × CPM ÷ 1,000 = 70,000 × $30 ÷ 1,000 = $2,100
Brand equity = awareness lift × audience value = $1,990
```

Template formulas:

```text
Revenue = orders × AOV = {ORDERS} × {AOV} = {REVENUE_VALUE}
Pipeline = leads × per-lead value = {LEADS} × {PER_LEAD_VALUE} = {PIPELINE_VALUE}
LTV captured = retained × CLV = {RETAINED_CUSTOMERS} × {CLV} = {LTV_VALUE}
Media value = impressions × CPM ÷ 1,000 = {IMPRESSIONS} × {CPM} ÷ 1,000 = {MEDIA_VALUE}
Brand equity = awareness lift × audience value = {BRAND_VALUE}
```

Current assumptions:

```text
AOV $120 · CLV $450 (Nike 3-yr) · CPM $30 (IAB Connected Home 2025) · Brand lift via Kantar projection model. All inputs replaceable in Pricing Calculator.
```

Template assumptions:

```text
AOV {AOV} · CLV {CLV} ({BRAND} {CLV_PERIOD}) · CPM {CPM} ({CPM_SOURCE}) · Brand lift via {AWARENESS_MODEL_SOURCE}. All inputs replaceable in Pricing Calculator.
```

Nike defaults:

```text
{AOV} = $120
{CLV} = $450
{CLV_PERIOD} = 3-yr
{CPM} = $30
{CPM_SOURCE} = IAB Connected Home 2025
{AWARENESS_MODEL_SOURCE} = Kantar projection model
```

---

## 5. Footer CTA

### CTA Headline

Current copy:

```text
SECURE THE SURFACE.
```

Template:

```text
SECURE THE SURFACE.
```

Optional brand-specific version:

```text
SECURE THE {CATEGORY_SURFACE}.
```

### CTA Body

Current copy:

```text
45-minute working session to align on the pilot scope.
```

Template:

```text
45-minute working session to align on the pilot scope.
```

### CTA Button

Current copy:

```text
Schedule Alignment
```

Template:

```text
Schedule Alignment
```

---

# Replacement Checklist By Brand

## Must Replace

```text
{BRAND}
{BRAND_CHANNEL_NAME}
{PRIMARY_AUDIENCE}
{HERO_IMAGE}
{DEVICE_RENDERING_IMAGE}
{DASHBOARD_IMAGE}
{CONTENT_PILLAR_1-6}
{CONTENT_EXAMPLES_1-6}
{COMMERCE_CTA_EXAMPLES}
{AOV}
{CLV}
{CPM}
{BRAND_AWARENESS_LIFT}
```

## Usually Keep

```text
Only FridgeChannel does all three.
01 // The Opportunity
02 // The Solution
03 // The ROI & Pilot
Algorithm & Ad-Blockers
Daily Family Impressions
Cross-Generational Reach
DEVICE // HARDWARE
CONTENT // CONTENT
INSIGHTS // DATA
Full-Funnel Behavioral Insights
Pricing
Return
Conversion path
How we calculate
SECURE THE SURFACE.
Schedule Alignment
```

## Brand-Specific Fields To Rework Carefully

```text
Opportunity Card 3 audience wording
Device headline
Product / campaign heat analysis wording
Content pillars
Commerce CTA destinations
Included services count
ROI assumptions
Brand awareness source
Scale scenario
```

---

# Current Nike Copy Snapshot

This section preserves the exact active Nike page copy in reading order.

## Hero

```text
FridgeChannel
× Nike
Pilot Proposal
```

## The Opportunity

```text
01 // The Opportunity
Only FridgeChannel does all three.

0
Algorithm & Ad-Blockers
No Meta algorithm changes, no Google policy shifts, no AI summaries. A hardware-based touchpoint that Nike fully controls.

25+
Daily Family Impressions
US households open the fridge 20-40 times daily. 25,000+ annualized impressions per household without disrupting daily life.

3x
Cross-Generational Reach
Unlike a phone, a fridge is a shared interface. Reach younger household members, purchase decision-makers, and the broader family in one high-frequency environment.

```

## The Solution

```text
02 // The Solution
Nike Family Channel Solution

DEVICE // HARDWARE
Exclusive Nike Touchpoint
Custom Nike ID: Deep integration of industrial design, UI, and brand identity.
High-Frequency Context: Dominate 25+ daily household interactions at the fridge.
Zero-Friction Setup: Magnetic installation, rapid deployment into target households.

CONTENT // CONTENT
Brand Content & Consumer Engagement
Basketball Culture
Hoop challenges, finals countdown, youth confidence tips
Running & Weather
Local running index, best training days, easy run reminders
Home Training
5-min family challenges, parent-child drills, evening stretching
Nike Product Stories
Pegasus, Vomero, Air Max series heritage
Athlete Moments
Mindset shorts, game day reminders, new signings
Seasonal Campaigns
Back to School, Holiday gifting, Marathon season specials
Commerce CTA
Explore Basketball, Join Nike Membership, Open Nike App
[Visual: Playback Sample]
▶
Feel the motion, rhythm, and CTA loop

INSIGHTS // DATA
Full-Funnel Behavioral Insights
Installation & Activation Rate
Playback & CTA Engagement
Product / Campaign Heat Analysis
Consideration & Purchase Intent Tracking
```

## ROI & Pilot

```text
03 // The ROI & Pilot

Enter parameters (min 4 weeks / 100 households) to unlock ROI estimation

Pilot Duration (4 weeks min)
Min 4 weeks
Pilot Households (100 min)
Min 100 households
Calculate Pricing & ROI

Pricing
ESTIMATED TOTAL INVESTMENT
$190,000
HARDWARE FEES
$150,000
($1,500 / unit × 100 units)
CONTENT & OPS
$40,000
($5,000 / week × 8 weeks)
INCLUDED SERVICES
Exclusive Nike device industrial design, production & deployment, 60+ content modules, daily operations, weekly insights reports

Return
Estimated pilot value
100 households · 4 weeks
Total pilot value
$19,630
Revenue $5,280
Pipeline $4,410
LTV $5,850
Media $2,100
Brand $1,990

Direct revenue
$5,280
44 orders
Brand awareness lift
+5.2%
Kantar-projected
Scale @ 5,000 HH
$12.7M
annualized

Conversion path
70k impressions
7% →
4,900 views
3% →
147 leads
30% →
44 orders
30% →
13 retained

How we calculate
Revenue = orders × AOV = 44 × $120 = $5,280
Pipeline = leads × per-lead value = 147 × $30 = $4,410
LTV captured = retained × CLV = 13 × $450 = $5,850
Media value = impressions × CPM ÷ 1,000 = 70,000 × $30 ÷ 1,000 = $2,100
Brand equity = awareness lift × audience value = $1,990
AOV $120 · CLV $450 (Nike 3-yr) · CPM $30 (IAB Connected Home 2025) · Brand lift via Kantar projection model. All inputs replaceable in Pricing Calculator.
```

## Footer CTA

```text
SECURE THE SURFACE.
45-minute working session to align on the pilot scope.
Schedule Alignment
```
