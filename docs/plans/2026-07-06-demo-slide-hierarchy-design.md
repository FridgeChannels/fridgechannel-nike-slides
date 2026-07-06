# Demo Slide Hierarchy Design

## Purpose

Turn `gift-challenge.html` from a long-form proposal page into a slide-like demo show. Each viewport should communicate one idea, use a predictable title hierarchy, and preserve generous presentation spacing.

## Information hierarchy

- Chapter label: the exact matching Overview item (`01` through `05`).
- Slide label: a decimal number inside the chapter (`02.1`, `02.2`, etc.).
- Slide title: the dominant statement on the page.
- Content heading: a supporting heading within the slide.
- Step label: use `Step 1`, `Step 2`, etc.; never reuse bare `01`, `02`, or `03`.

The title scale is:

- Opening title: `clamp(3.5rem, 7vw, 6.5rem)`
- Slide title: `clamp(2.75rem, 5vw, 4.75rem)`
- Content heading: `clamp(1.65rem, 2.6vw, 2.25rem)`
- Card/step heading: `1.1rem`
- Body: `1rem`

## Slide rhythm

Every `.demo-slide` uses `min-height: 100svh`, a centered `1180px` content area, and vertical padding of `clamp(72px, 10vh, 112px)`. Slides should not expose the following slide's title in the same viewport. Content that cannot fit comfortably must become another slide rather than shrinking typography.

## Slide map

1. Opening
2. Overview
3. `01.1` Immediate measurable win
4. `01.2` Strategic North Star
5. `02.1` Physical touchpoint / product specs
6. `02.2` Place and tap
7. `02.3` Customer journey
8. `03.1` Configure coupons
9. `03.2` Assign segments
10. `03.3` Build the interaction
11. `04.1` Dashboard overview
12. `04.2` Touchpoint and funnel
13. `04.3` Package options
14. `04.4` ROAS calculator
15. `05.1` Align and design
16. `05.2` Build and deliver
17. `05.3` Launch and review
18. FAQ
19. Questions

## Responsive behavior

Desktop layouts may use two columns. Below 900px, slides stack vertically and use content-driven height while retaining at least one viewport of stage space. Tables may scroll horizontally. All slide labels remain visible and text sizes follow the same semantic scale.
