# LNMB Charity Run Registration & T-shirt Purchase Flow

## Product Requirements Document

### Executive Summary

This document defines the user experience flow for the LNMB charity run registration system, which combines event registration with t-shirt purchase. The system collects student status, personal details, emergency contact information, and liability acknowledgment before processing payment through Jenga Payment Gateway.

### Current System Analysis

- **Framework**: Next.js with Convex backend
- **Payment Gateway**: Jenga PGW integration
- **Authentication**: None (anonymous purchases)
- **Data Storage**: Convex tables (orders, payments)
- **Current Products**: Polo (KES 1,500), Round Neck (KES 1,200)

### Pricing Structure

| Product            | Student Price | Non-Student Price |
| ------------------ | ------------- | ----------------- |
| Round Neck T-shirt | KES 600       | KES 1,000         |
| Polo T-shirt       | KES 1,000     | KES 1,500         |

_Note: Current system shows fixed prices (Polo: 1,500, Round: 1,200). Implementation will need price adjustment based on student status._

## Core UX Principles

1. **Progressive Disclosure** - Break complex form into digestible steps
2. **Immediate Feedback** - Show price changes and validation errors instantly
3. **Mobile-First Design** - Optimize for mobile input patterns
4. **Trust Building** - Clear explanations for sensitive information collection
5. **Error Prevention** - Validate inputs at appropriate moments
6. **Recovery Support** - Save progress in localStorage, allow editing
7. **Transparency** - Show exactly what user is committing to at each step

## User Flow Design

### Step 1: Product Selection & Pricing

**Location**: `/shop` page - Enhanced product selection

**Data Captured:**

- T-shirt variant selection (polo/round)
- Size selection (S, M, L, XL)
- Quantity selection
- Student status toggle (YES/NO)
- University selection (if student) — via a searchable combobox with a manual fallback (hybrid approach)

**UI Elements:**

- Student status toggle with immediate price update
- University combobox (searchable, typeahead) using the shadcn/ui Command + Popover pattern (lazy-load the canonical Kenyan universities list). Provide a clear "My university isn't listed" fallback that opens a small free-text entry.
  - When a user selects from the list store the canonical name; when they use the free-text fallback flag the value as user-entered (see Data & storage).
- Size selection buttons (pill-style for mobile)
- Live price calculator showing: Base price → Student discount → Final total
- "Proceed to Registration" button

**Validation:**

- Variant and size must be selected
- If student = YES, university must be selected
- Quantity minimum = 1

**Schema Mapping:**

```typescript
{
  tshirtType: "polo" | "round",
  tshirtSize: "small" | "medium" | "large" | "extra-large",
  quantity: number,
  student: "yes" | "no",
  university?: string, // canonical name or `Other: <text>` when free-text
  universityUserEntered?: boolean, // true when user typed their university (manual)
  totalAmount: calculated_price
}
```

### Step 2: Personal & Registration Details

**Location**: `/shop/register` (new page)

**Data Captured:**

- Full name
- Email address
- Phone number (Kenya format: 7XXXXXXXX)
- Medical conditions (optional but encouraged)
- Preferred pickup point
- Next of kin name
- Next of kin phone number
- Graduation year (if student)
- Registration number (if student)

**UI Design:**

- Grouped sections: "Your Details", "Emergency Contact", "Student Info" (if applicable)
- Phone input with Kenya flag and +254 prefix
- Medical conditions with helper text: "Any medical conditions we should know about? (Optional but recommended for safety)"
- Pickup point dropdown/radio buttons

**Validation:**

- Required: name, email, phone, next of kin name, next of kin phone
- Email format validation
- Kenya phone number format validation
- If student, graduation year is required

**Schema Mapping:**

```typescript
{
  name: string,
  email: string,
  phone: string,
  medicalCondition: string, // Recommended; allow "None"
  pickUp?: string,
  nameOfKin: string,
  kinNumber: string,
  graduationYear?: string, // If student
  regNumber?: string // If student
}
```

### Step 3: Event Attendance & Liability

**Location**: Same page as Step 2, separate section

**Data Captured:**

- Event attendance confirmation
- Liability waiver acknowledgment

**UI Elements:**

- "Will you attend the charity run?" - Radio buttons (Yes/No)
- Liability checkbox with modal for full terms
- Helper text explaining why attendance matters (logistics, safety)

**Schema Mapping:**

```typescript
{
  attending: "attending" | "notattending",
  confirm: "yes" // Must be yes to proceed
}
```

### Step 4: Order Review & Confirmation

**Location**: `/shop/review` (new page)

**Purpose**: Build trust before payment redirect

**Display Elements:**

- Order summary with itemized breakdown
- Student discount applied (if applicable)
- Contact information with "Edit" links
- Pickup details
- Terms acknowledged checkmark
- Final total amount

**Actions:**

- "Edit Order" - return to previous steps
- "Proceed to Secure Payment" - create order and redirect

### Step 5: Payment Processing

**Location**: Current `/checkout` flow (enhanced)

**Process Flow:**

1. Create order record in Convex with status = "pending"
2. Generate Jenga payment form with pre-filled data
3. Redirect to Jenga PGW
4. Handle return URL with payment status
5. Update order status via webhook

**Schema Usage**: Current order schema is maintained, leveraging existing Jenga integration.

## Data Capture Strategy

### Frontend (Client-Side)

- **localStorage**: Save form progress for recovery
- **React State**: Immediate validation and price calculations
- **Cart Context**: Current cart system can be enhanced for this flow

### Backend (Convex)

- **Orders Table**: Final order storage (existing schema compatible)
- **Payments Table**: Jenga transaction tracking (existing)

### External (Jenga PGW)

- **Payment Processing**: Card details, transaction status
- **Webhook Integration**: Authoritative payment confirmation

## Implementation Checklist

### Phase 1: Enhanced Product Selection

- [ ] Add student toggle to products page
- [ ] Implement dynamic pricing based on student status
- [ ] Add university combobox (shadcn Command + Popover) with lazy-loaded canonical Kenyan list, plus a "My university isn't listed" manual fallback
- [ ] Persist a small metadata flag (`universityUserEntered`) with orders when the user types their university
- [ ] Update cart context to handle student pricing
- [ ] Add price breakdown display

### Phase 2: Registration Flow

- [ ] Create registration page with personal details form
- [ ] Implement form validation with mobile-optimized inputs
- [ ] Add localStorage form progress saving
- [ ] Create liability waiver modal
- [ ] Implement step-by-step progress indicator

### Phase 3: Review & Integration

- [ ] Build order review/confirmation page
- [ ] Enhance checkout flow to pre-fill from registration
- [ ] Update Convex mutations to handle new flow
- [ ] Test end-to-end with Jenga integration

### Phase 4: UX Enhancements

- [ ] Add mobile-specific input optimizations
- [ ] Implement error recovery flows
- [ ] Add order status tracking
- [ ] Create admin view for order management

## Success Metrics

- **Completion Rate**: Percentage who complete payment after starting
- **Drop-off Points**: Identify where users abandon the flow
- **Validation Errors**: Track most common input mistakes
- **Mobile vs Desktop**: Performance comparison across devices
- **Student vs Non-Student**: Conversion rate comparison

## Risk Mitigation

- **Data Loss**: localStorage backup at each step
- **Payment Failures**: Clear error messages with retry options
- **Validation Issues**: Real-time feedback prevents form submission errors
- **Mobile UX**: Touch-friendly inputs with appropriate keyboards
- **University List**: Maintain updated list of Kenya universities

## Canonical university list (source & usage)

We will ship a curated canonical list of Kenyan universities and training institutions for the combobox. This list is the primary client-side dataset used by the shadcn Command + Popover combobox and should include KMTC (Kenya Medical Training College) and other diploma/technical institutions to account for users on medical/diploma tracks.

Recommended location: `src/data/universities.json` (lazy-load this file when the student toggle is enabled to keep initial bundle small).

Source (example seeder used to curate the list):

```
University of Nairobi
Moi University
Kenyatta University
Egerton University
Kenya Methodist University
Maseno University
Jomo Kenyatta University of Agriculture and Technology
Mount Kenya University
Uzima University
Masinde Muliro University of Science and Technology
Kisii University
The Aga Khan University
Pwani University
Technical University of Mombasa
Technical University of Kenya
KMTC
The Eldoret National Polytechnic
Kisii National Polytechnic
Kisiwa Technical Training Institute
The Kisumu National Polytechnic
The Kabete National Polytechnic
Nairobi Technical Training Institute
St. Joseph's Nyabondo Medical Training College
The Nyeri National Polytechnic
Rift Valley Technical Training Institute
Thika Technical Training Institute
Kabarak University
United States International University-Africa
```

Implementation notes:

- Include common aliases in the client-side normalization table (e.g., "UoN" → "University of Nairobi", "KMTC" → "Kenya Medical Training College").
- Offer a "My university isn't listed" manual fallback; when used, persist the value as `Other: <raw input>` in the `university` field and set `universityUserEntered` to `true`.
- Maintain the JSON file in the repo so it can be updated easily; consider adding a small script to regenerate it from a seed source if needed.
- Admin reconciliation: periodically review `Other:` entries and map frequent values to canonical names.

This flow respects the existing schema while significantly improving user experience through progressive disclosure and mobile optimization.

## Implementation & tracking

This section is a lightweight delivery tracker and developer handoff for the work described above. Use it to scope PRs against milestones, mark status, and record acceptance criteria (AC) for each task. I will not open PRs unless you ask — you will create PRs and use this page for reference.

### Milestones

- Phase 1 — Combobox & pricing (student toggle, combobox, pricing rules)
- Phase 2 — Registration form (graduation year, medical, NOK, pickup)
- Phase 3 — Review & checkout integration (create pending order, Jenga redirect, webhook)
- Phase 4 — Admin & reconciliation (Other: mapping UI, reports)

### Task tracker (minimal)

| Task                                                              | Owner | ETA | Status      | Acceptance Criteria (AC)                                                                                                                          |
| ----------------------------------------------------------------- | ----: | --: | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Canonical universities JSON (`src/data/universities.json`)        |   you |   — | Done        | File contains curated list incl. KMTC; lazy-loadable                                                                                              |
| Combobox UI in `order-form.tsx` (shadcn Command + Popover)        |       |     | Done        | Loads lazily; typeahead matches; selecting sets `university` and `universityUserEntered=false`; manual fallback sets `universityUserEntered=true` |
| Student toggle & pricing in `products.tsx` & `cart-context.tsx`   |       |     | Done        | Student toggle updates price real-time; cart stores student flag per item                                                                         |
| Persist order to Convex with `university` normalization           |       |     | Done        | Server re-normalizes incoming university; stores canonical or `Other: <text>`                                                                     |
| Graduation year & registration number in `order-form.tsx`         |       |     | Done        | Graduation year required when student=yes; saved to `graduationYear`                                                                              |
| Review page & checkout integration (`/shop/review` + `/checkout`) |       |     | Existing    | Creates pending Convex order before redirect; return + webhook reconcile status                                                                   |
| Admin reconciliation UI                                           |       |     | Not started | Lists `Other:` values and allows mapping to canonical names                                                                                       |

Notes:

- Update the "Status" column directly when you start / finish tasks. Include a short note in this file with links to PRs or issues if helpful.

### File-level mapping (quick)

- `src/data/universities.json` — canonical list (created)
- `src/components/shop/order-form.tsx` — Add combobox, graduationYear, universityUserEntered flag, client normalization
- `src/components/shop/products.tsx` — Expose student toggle and per-item student flag (update price display)
- `src/components/shop/cart-context.tsx` — Persist student flag per cart item if items differ by student status
- `convex/orders.ts` — Add server-side normalization helper in mutation that creates orders (re-run normalization before insert)
- `docs/user-flow-prd.md` — This PRD and tracker (update statuses)

### Acceptance criteria (examples)

- Combobox AC
  - Loads `src/data/universities.json` only when student toggle is enabled (lazy-load)
  - Fuzzy/typeahead search returns relevant matches; keyboard navigation supported
  - Selecting a canonical item sets `university` to the canonical name and `universityUserEntered=false`
  - If user clicks "My university isn't listed", a small free-text input appears; submitting it sets `university` = `Other: <raw input>` and `universityUserEntered=true`

- Pricing AC
  - When student=yes, product prices show student price and cart total reflects student pricing
  - Quantity updates and size selections reflect in final total

- Server AC
  - Convex mutation re-runs normalization; if a canonical match is found, save canonical name; otherwise save `Other: <text>`
  - Order record created with `paid=false` and `orderReference` before redirecting to Jenga

### Test / QA checklist

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
