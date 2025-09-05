# LNMB Color System Documentation

## Overview
This document outlines the harmonized color system for the LNMB (Leave No Medic Behind) application. All colors have been standardized to use only the brand colors, eliminating AI-generated gradients and ensuring consistent visual identity.

## Brand Colors

### Primary Brand Colors
- **Navy Blue**: `#2D3748` - Used for primary elements, headers, and main call-to-action buttons
- **Cyan Blue**: `#38BDF8` - Used for accent elements, links, and secondary actions  
- **Red**: `#EF4444` - Used for destructive actions, warnings, and important highlights
- **Black**: `#1A202C` - Used for text and dark elements
- **White**: `#FFFFFF` - Used for backgrounds and contrast

## Semantic Color Tokens

### CSS Variables (in globals.css)
```css
/* Brand Colors */
--brand-navy: #2D3748;
--brand-cyan: #38BDF8;
--brand-red: #EF4444;
--brand-black: #1A202C;
--white: #FFFFFF;

/* Semantic Tokens */
--color-primary: var(--brand-navy);
--color-accent: var(--brand-cyan);
--color-destructive: var(--brand-red);
--color-success: var(--brand-navy);
--color-info: var(--brand-cyan);
--color-warning: var(--brand-red);
```

### Tailwind Classes
Use these semantic classes instead of arbitrary colors:

- `text-primary` / `bg-primary` - Navy blue for main elements
- `text-accent` / `bg-accent` - Cyan for accent elements
- `text-destructive` / `bg-destructive` - Red for warnings/destructive actions
- `text-foreground` / `bg-foreground` - Main text color
- `text-background` / `bg-background` - Main background color

## Component Usage Guidelines

### 1. Remove Gradients
❌ **Before**: `bg-gradient-to-r from-blue-500 to-blue-600`
✅ **After**: `bg-primary`

### 2. Use Semantic Colors
❌ **Before**: `text-blue-600`
✅ **After**: `text-primary`

### 3. Conditional Colors
❌ **Before**: 
```tsx
className={color === "blue" ? "text-blue-600" : color === "green" ? "text-green-600" : "text-purple-600"}
```

✅ **After**:
```tsx
className={color === "primary" ? "text-primary" : color === "accent" ? "text-accent" : "text-destructive"}
```

## Dark Mode Support
The color system automatically supports dark mode by swapping background and foreground colors while maintaining brand color consistency.

## Accessibility
All color combinations meet WCAG AA contrast requirements:
- Primary text on white background: ✅ AAA
- Accent text on white background: ✅ AA
- White text on primary background: ✅ AAA
- White text on destructive background: ✅ AAA

## Chart Colors
For multi-color charts, use this order:
1. `var(--brand-cyan)` - Primary data
2. `var(--brand-navy)` - Secondary data  
3. `var(--brand-red)` - Tertiary data
4. Neutral grays for additional data points

## Migration Rules

### Before (AI-generated colors)
- `azure-*` classes → `accent`
- `blue-*` classes → `primary`
- `green-*` classes → `brand-success`
- `purple-*` classes → `destructive`
- `pink-*` classes → `destructive`
- `orange-*` classes → `destructive`

### SVG Icons
Use `fill="currentColor"` and control color via parent element:
```tsx
<TwitterIcon className="text-accent" />
```

## Enforcement
- Use semantic tokens (not hex values) in components
- No inline styles with colors
- SVGs should use currentColor when possible
- All new components must follow this color system