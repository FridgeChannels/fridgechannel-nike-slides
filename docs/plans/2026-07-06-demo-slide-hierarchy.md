# Demo Slide Hierarchy Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild the proposal page as a consistent slide-like demo with a clear chapter, slide, and content-title hierarchy.

**Architecture:** Introduce shared slide and typography classes in `gift-challenge.html`, then reorganize existing content into viewport-sized slide frames without changing its data-binding API. Reuse the current pricing Shadow DOM, adding scoped slide styles after it is mounted.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, local Node HTTP server, in-app browser verification.

---

### Task 1: Add the slide design system

**Files:**
- Modify: `gift-challenge.html`

**Steps:**
1. Add shared chapter-label, slide-label, slide-title, content-title, and spacing tokens.
2. Add `.demo-slide` and `.slide-inner` layout primitives.
3. Add responsive rules for stacked mobile layouts.
4. Run `git diff --check -- gift-challenge.html`.

### Task 2: Split chapters 01 and 02 into slides

**Files:**
- Modify: `gift-challenge.html`

**Steps:**
1. Make each Goal block an independent slide (`01.1`, `01.2`).
2. Split the physical product specification and place/tap story (`02.1`, `02.2`).
3. Make the customer journey its own slide (`02.3`).
4. Replace internal bare numeric labels with descriptive step labels.

### Task 3: Split configuration and results into slides

**Files:**
- Modify: `gift-challenge.html`

**Steps:**
1. Promote each configuration step to a slide (`03.1`–`03.3`).
2. Promote each dashboard step to a slide (`04.1`–`04.2`).
3. Preserve existing images, links, and data attributes.
4. Confirm all slide titles use the shared scale.

### Task 4: Paginate pricing and collaboration

**Files:**
- Modify: `gift-challenge.html`

**Steps:**
1. Apply scoped Shadow DOM slide styles to package options and calculator (`04.3`, `04.4`).
2. Group the collaboration timeline into three slide-sized phases (`05.1`–`05.3`).
3. Keep FAQ and Questions as standalone closing slides.

### Task 5: Verify the final presentation

**Files:**
- Verify: `gift-challenge.html`

**Steps:**
1. Reload `http://localhost:4173/gift-challenge.html`.
2. Collect each slide label, heading level, computed title size, and height.
3. Verify chapter labels match Overview verbatim.
4. Check browser console errors.
5. Inspect representative screenshots for Goal, experience, configuration, results, and collaboration slides.
