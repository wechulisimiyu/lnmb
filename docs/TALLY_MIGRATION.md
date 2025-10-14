# Order Form Migration: Custom Form to Tally Popup

## Overview
The order form has been migrated from a custom multi-step React component to a Tally popup form integration.

## Changes Made

### New Component: `/src/components/shop/tally-order-form.tsx`
A simplified React component that:
- Loads the Tally widget script
- Displays a button that triggers a Tally popup form
- Shows order information (pricing, features) before opening the form

### Updated: `/src/app/register/page.tsx`
- Replaced `OrderForm` with `TallyOrderForm`
- Maintains the same page structure (ShopHero + form component)

## Architecture Differences

### Before (Custom Form)
1. User fills multi-step form in React app
2. Form data saved to `localStorage.pendingOrder`
3. User redirected to `/checkout` page
4. Checkout page reads from localStorage
5. Payment processed through internal checkout flow

### After (Tally Form)
1. User clicks button to open Tally popup
2. User fills form directly in Tally modal
3. Tally handles form submission and data collection
4. Tally can handle payment processing or redirect
5. Internal checkout page may not be needed (depends on Tally configuration)

## Configuration Required

### Tally Form ID
The component currently uses a placeholder form ID: `woJ22M`

**Action needed:** Update the form ID in `/src/components/shop/tally-order-form.tsx` line 53:
```typescript
win.Tally.openPopup("YOUR_ACTUAL_FORM_ID", {
  layout: "modal",
  width: 700,
});
```

### Tally Form Setup
Ensure your Tally form includes all required fields:
- T-shirt type (Round Neck)
- T-shirt size (XS, S, M, L, XL, XXL, XXXL)
- Quantity
- Student status (Yes/No)
- University (if student)
- Personal details (name, email, phone)
- Next of kin information
- Medical conditions
- Pickup preferences
- Event attendance
- Terms confirmation

### Payment Integration
Configure Tally to either:
1. Process payments directly (recommended)
2. Redirect to `/checkout` with order data if you want to keep using the internal checkout flow

## Benefits of Tally Integration

1. **Reduced Code Complexity**: Eliminated 1374 lines of custom form code
2. **Easier Maintenance**: Form updates handled in Tally dashboard, no code changes needed
3. **Better UX**: Tally provides optimized form experience with built-in features
4. **Form Analytics**: Tally provides form submission analytics and insights
5. **Mobile Optimized**: Tally forms are responsive and mobile-friendly

## Deprecated Components

### `/src/components/shop/order-form.tsx`
- Still exists in the codebase (1374 lines)
- No longer imported or used
- Can be safely deleted in future cleanup
- Keep temporarily in case rollback is needed

### `/src/app/checkout/page.tsx`
- Still exists and functional
- May not be needed if Tally handles full checkout flow
- Could be repurposed for order confirmation/status

## Testing Checklist

- [ ] Update Tally form ID with actual order form
- [ ] Test popup opens correctly when button clicked
- [ ] Verify Tally form includes all required fields
- [ ] Test form submission flow end-to-end
- [ ] Configure payment processing in Tally
- [ ] Test on mobile devices
- [ ] Update navigation if checkout page is removed
- [ ] Test student discount flow
- [ ] Verify email notifications work

## Rollback Plan

If needed to revert to custom form:
1. Change import in `/src/app/register/page.tsx` back to `OrderForm`
2. Delete `/src/components/shop/tally-order-form.tsx`
3. Original OrderForm component is preserved and functional
