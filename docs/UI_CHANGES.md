# Visual Changes: Order Form UI

## Before (Old Multi-Step Form)
The previous OrderForm was a complex multi-step wizard with:
- Step 1: Product Selection (t-shirt type, size, quantity, student status)
- Step 2: Personal Details (name, email, phone, next of kin, medical info)
- Step 3: Attendance & Liability (event attendance, terms confirmation)
- Step 4: Review & Confirm
- Navigation buttons between steps
- Form validation at each step
- Progress indicator
- Total of 1374 lines of code

## After (Tally Popup Button)

### Visual Layout
```
┌─────────────────────────────────────────────────────────────┐
│  [Badge: Get a T-Shirt or 2]                                │
│                                                               │
│  Your purchase is your participation in the run, and the     │
│  funds raised go towards the Leave No Medic Behind kitty.    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Order Your T-shirt                                          │
│  Click the button below to open our order form and reserve   │
│  your spot for the event                                     │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  [Light Blue Background]                            │    │
│  │                                                      │    │
│  │  What's Included:                                   │    │
│  │  ✓ Premium quality t-shirt in your size            │    │
│  │  ✓ Event participation (optional)                  │    │
│  │  ✓ Student discounts available                     │    │
│  │                                                      │    │
│  │  Pricing:                                           │    │
│  │  Regular: KES 1,500                                 │    │
│  │  Student: KES 850                                   │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  [🛒 Shopping Cart Icon] Open Order Form           │    │
│  │         [Large Blue Button - Full Width]            │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  Secure payment processing • Fast checkout                   │
└─────────────────────────────────────────────────────────────┘
```

### Component Breakdown

**Card Component:**
- Centered with max-width of 4xl
- White background with shadow
- Rounded corners

**Header Section:**
- Title: "Order Your T-shirt" (2xl/3xl responsive)
- Subtitle: Instructions text in gray

**Content Section:**
1. **Information Box** (Light blue background):
   - Features list with checkmarks
   - Pricing details
   - Rounded corners with padding

2. **Call-to-Action Button**:
   - Full width, large size (h-14)
   - Blue primary color
   - Shopping cart icon
   - Text: "Open Order Form"
   - Large text (text-lg)

3. **Footer Text**:
   - Centered, small, gray
   - "Secure payment processing • Fast checkout"

### User Interaction Flow

1. **User lands on /register page**
   - Sees ShopHero badge and description
   - Sees the order information card

2. **User clicks "Open Order Form" button**
   - Tally script loads (if not already loaded)
   - Modal popup appears overlaying the page
   - Form opens at 700px width, centered

3. **User fills Tally form**
   - All form fields handled by Tally
   - Form submission handled by Tally
   - Payment processed through Tally or redirect

4. **After submission**
   - Depends on Tally configuration
   - Could show success message
   - Could redirect to confirmation page

### Color Scheme
- Primary button: Blue (theme primary color)
- Info box background: `bg-blue-50` (light blue)
- Text colors:
  - Headings: `text-slate-900` (dark)
  - Descriptions: `text-slate-600` or `text-gray-600` (medium)
  - Features: `text-gray-700` (slightly darker gray)

### Responsive Behavior
- Title scales: `text-2xl sm:text-3xl`
- Card adapts to screen width with max-width constraint
- Button remains full width on all screen sizes
- All text and spacing responsive

### Accessibility
- Button has clear label and icon
- Semantic HTML structure
- Card component follows proper heading hierarchy
- High contrast text colors

## Key Differences

| Aspect | Before | After |
|--------|--------|-------|
| Lines of Code | 1,374 | 117 |
| User Steps | 4 steps | 1 click |
| Validation | Client-side React | Tally handles |
| Payment | Internal checkout page | Tally integration |
| Maintenance | Code changes needed | Update in Tally dashboard |
| Mobile UX | Custom responsive | Tally optimized |

## Benefits for Users

1. **Simpler Interface**: One button click vs multi-step form
2. **Faster Loading**: Minimal JavaScript, Tally loads on demand
3. **Better Mobile Experience**: Tally's mobile-optimized popup
4. **Clearer Pricing**: Upfront display before opening form
5. **Less Intimidating**: No visible form fields until user is ready
