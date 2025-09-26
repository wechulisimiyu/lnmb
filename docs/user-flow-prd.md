# LNMB Charity Run Registration & T-shirt Purchase Flow

## Product Requirements Document (Updated)

### Executive Summary

This document defines the user experience flow for the LNMB charity run registration system. It has been updated to reflect a deliberate implementation decision: we will use a mobile-first, multi-step form driven from a single authoritative component (`OrderForm`) on the `/shop` page. The product selection step will visually display T-shirt options, and pricing will reflect the PRD's student and non-student prices.

Key changes in this update:

- The shop experience is a progressive, multi-step flow (product selection → registration details → attendance & waiver → review → payment).
- The `OrderForm` component is the single source of truth for the purchase/registration flow (this replaces ad-hoc product-only components for the canonical purchase path).
- T-shirt selection is visual and mobile-optimized (image-first cards with pill-size selectors and live pricing updates).
- Draft saving to `localStorage` is used for recovery between steps.

### Current System Analysis

- **Framework**: Next.js with Convex backend
- **Payment Gateway**: Jenga PGW integration
- **Authentication**: None (anonymous purchases)
- **Data Storage**: Convex tables (orders, payments)
- **Current Products**: Polo, Round Neck (see Pricing Structure below)

### Pricing Structure (authoritative)

The PRD pricing is the canonical source. The front-end must display prices using these values and apply student discounts instantly in the UI:

| Product            | Student Price | Non-Student Price |
| ------------------ | ------------- | ----------------- |
| Round Neck T-shirt | KES 600       | KES 1,000         |
| Polo T-shirt       | KES 1,000     | KES 1,500         |

Front-end components MUST derive price from the selected variant and the student flag (no hard-coded display price elsewhere). The cart and checkout calculations must match the front-end display exactly.

## Core UX Principles (no change)

1. Progressive Disclosure — Break complex form into digestible steps
2. Immediate Feedback — Show price changes and validation errors instantly
3. Mobile-First Design — Optimize for mobile input patterns (touch targets, proper keyboards)
4. Trust Building — Clear explanations for sensitive information collection
5. Error Prevention — Validate inputs at appropriate moments
6. Recovery Support — Save progress in localStorage, allow editing
7. Transparency — Show exactly what user is committing to at each step

## Multi-step User Flow Design (explicit)

We will implement a single multi-step flow exposed at `/shop` and supporting routes for deep linking and step-specific navigation. The authoritative implementation will live inside `src/components/shop/order-form.tsx` and the `/shop` page will render this component. This keeps the UI consistent on mobile and desktop.

Top-level steps (mobile-first layout):

- Step 1 — Product Selection & Pricing (visual)
- Step 2 — Personal & Registration Details
- Step 3 — Event Attendance & Liability
- Step 4 — Order Review & Confirmation
- Step 5 — Payment Processing (existing `/checkout` flow is re-used)

### Step 1: Product Selection & Pricing (visual, mobile-first)

Location: embedded in `OrderForm` on `/shop` (the canonical UI)

Data captured:

- T-shirt variant selection (visual cards with images — Polo / Round)
- Size selection (S, M, L, XL) — pill buttons
- Quantity selection (1–3) — number input or steppers on mobile
- Student status toggle (YES/NO)
- University selection (if student) — searchable combobox (lazy-loaded JSON) with manual fallback

UI and behavior requirements:

- Show t-shirt cards with photos and short descriptions. Cards must include both student and non-student unit prices and highlight the applied price when student toggle changes.
- Student toggle immediately recalculates unit price and order total.
- A small price breakdown is visible: Unit price → Quantity → Discount (if student) → Total.
- University combobox uses the existing shadcn/ui Command + Popover pattern and lazy-loads `src/data/universities.json` only when student = YES. Provide a "My university isn't listed" option that reveals a small free-text input.
- Touch targets, spacing, and font sizes must be optimized for mobile.

Validation (client-side at step-level):

- Must select tshirtType and tshirtSize before advancing.
- If student = YES, university must be selected or manual entry provided.
- Quantity must be >= 1 and <= 3.

Schema mapping (step output):

```ts
{
  tshirtType: "polo" | "round",
  tshirtSize: "small" | "medium" | "large" | "extra-large",
  quantity: number,
  student: "yes" | "no",
  university?: string, // canonical or `Other: <text>` when manual
  universityUserEntered?: boolean,
  unitPrice: number,
  totalAmount: number
}
```

### Step 2: Personal & Registration Details

Location: second step inside `OrderForm` (or `/shop/register` for deep linking)

Data captured and UI notes: as previously described in the PRD. Use grouped sections and mobile-optimized inputs. Graduation year and registration number fields are required only when student = YES.

Validation: as described originally (name, email, phone, NOK required; phone format enforcement; email regex).

### Step 3: Event Attendance & Liability

Location: step 3 inside `OrderForm`

Collect attending flag and liability confirmation (must be accepted to proceed to payment). Provide a modal containing the full waiver text.

### Step 4: Order Review & Confirmation

Location: final step inside `OrderForm` or accessible as `/shop/review` for a confirm-only view

Show an itemized summary with unit price, quantity, student discount label (when applicable), contact details, pickup point, and final total. Offer inline "Edit" buttons that navigate back to the appropriate step. Confirming here will create the `pendingOrder` payload used by `/checkout`.

### Step 5: Payment Processing

Location: the existing `/checkout` page will continue to handle payment creation and redirect to Jenga PGW. Implementation notes:

1. The review step must persist the `pendingOrder` object to `localStorage` under `pendingOrder` (same schema currently expected by `/checkout`).
2. The `/checkout` page will create the Convex order and payment record exactly as today and then redirect to the gateway.

## Data Capture Strategy (updated)

Frontend:

- Save draft progress to `localStorage` (key: `orderFormDraft`) on every step change and on significant input changes. This provides recovery on accidental navigation.
- Use React state for immediate validation and price calculations.
- Lazy-load `src/data/universities.json` when student toggle is first enabled.

Backend (Convex):

- Keep existing orders/payments tables and ensure server-side normalization of `university` (if a canonical match is found, store canonical; otherwise store `Other: <text>` and flag `universityUserEntered=true`).

External (Jenga PGW): unchanged — continue to use the same integration.

## Implementation Decision (explicit)

- The authoritative purchase flow is implemented inside `src/components/shop/order-form.tsx`. The `/shop` page will render this component as the canonical buying experience (mobile-first, multi-step). This simplifies testing, avoids duplication of student/university logic, and ensures a single place to maintain pricing rules and UX.
- If a separate visual product catalog is desired, it should delegate pricing and student logic to shared helpers or the `OrderForm` component rather than duplicating behavior.

## Implementation Checklist (updated)

### Phase 1 — Multi-step OrderForm (priority)

- [x] Use `OrderForm` as the canonical flow on `/shop` (rendered in the page)
- [ ] Implement Step 1: Visual product selection with images, size pills, quantity steppers, and live pricing
- [ ] Implement Step 2: Personal & registration fields (mobile-optimized)
- [ ] Implement Step 3: Attendance & liability with modal for full terms
- [ ] Implement Step 4: Review screen and persist `pendingOrder` to `localStorage`
- [ ] Draft saving to `localStorage` (key: `orderFormDraft`) and auto-restore
- [ ] Use PRD pricing constants throughout components

### Phase 2 — Checkout integration and server-side

- [ ] Ensure `/checkout` consumes `pendingOrder` and continues to create Convex order + payment
- [ ] Server-side normalization of universities before insertion into Convex orders

### Phase 3 — UX polish & analytics

- [ ] Mobile-specific optimizations (keyboard types, larger touch targets)
- [ ] Add analytics events (step start/complete, university selection source)
- [ ] QA end-to-end with Jenga PGW

## Acceptance criteria (updated)

Combobox & University selection

- Loads `src/data/universities.json` only when student toggle is enabled
- Fuzzy/typeahead search returns relevant matches; keyboard navigation supported
- Selecting a canonical item sets `university` to the canonical name and `universityUserEntered=false`
- Manual fallback sets `university` = `Other: <raw input>` and `universityUserEntered=true`

Visual product selection & pricing

- T-shirt cards show images, description, and both student/non-student prices
- When student = YES the UI highlights the applied student price instantly and the price breakdown updates
- Unit price, quantity, and total match the final amount sent to `/checkout`

Server-side

- Convex mutation normalizes `university` and stores canonical or `Other: <text>` with `universityUserEntered` flag
- Order record is created with `paid=false` and `orderReference` before redirecting to Jenga

## Test / QA checklist (condensed)

- Unit tests for normalization and pricing calculations
- Manual tests for mobile flow: step progression, draft recovery, review, and payment redirect
- Ensure `/checkout` still works with the persisted `pendingOrder` object

## Rollout notes

- Deploy Phase 1 to staging and test Jenga integration with test keys. Feature-flag the experience if you need an easy rollback.

---

End of updated PRD: this file now mandates the multi-step, mobile-first, visual OrderForm flow as the canonical shop experience. Use this PRD as the source of truth for UI/implementation changes related to the shop flow.

- Unit tests
  - Normalization function: exact, fuzzy, and non-match behaviors
- Integration / manual tests
  - Student selected & matched to canonical — verify `universityUserEntered=false`
  - Student selected & manual entry — verify `university` saved as `Other: ...` and `universityUserEntered=true`
  - Non-student flow — prices reflect non-student rates
  - Payment flow: pending order created → Jenga redirect → webhook updates paid=true
  - Mobile UX: combobox works on small screens; keyboard interactions OK

### Suggested analytics & events

- `registration.step_start` — payload: { step }
- `registration.university_selected` — payload: { university, source: 'canonical'|'manual' }
- `registration.step_complete` — payload: { step }
- `checkout.started` / `checkout.completed` / `checkout.failed` — payload: { orderReference, amount }

### Rollout notes

- Deploy Phase 1 to staging first and test Jenga flows using dev keys.
- If possible, feature flag the new student pricing UI so you can toggle it if something goes wrong.

---

Update status: `src/data/universities.json` has been created and canonical list is Done (see Task tracker above).
