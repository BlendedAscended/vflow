# VerbaFlow Master Design System Reference

Complete knowledge base for all design matrices, patterns, and implementation strategies.

## Quick Reference by Product

| Product | Framework | Reason |
|---------|-----------|--------|
| TrustOneServices | Enterprise Authority | Healthcare compliance, high trust signal needed |
| PriorZap | Enterprise Authority | Insurance authorization, regulatory environment |
| Samurai Dashboard | Developer Dark Mode | Technical resume generation tool |
| Galaxy CLI | Developer Dark Mode | Developer command-line interface |
| RalphFree | Developer Dark Mode | API fallback tool for engineers |
| Aqwa | Consumer Conversion | Mobile fish identification app |
| Gibby | Consumer Conversion | Restaurant ordering platform |
| Galaxy Products | Consumer Conversion | Storefront, e-commerce focus |

## Design Matrix Comparison

### Enterprise Authority
- **Audience:** Compliance officers, healthcare admins, finance teams, legal
- **Primary Goal:** Reduce risk, ensure security, maintain predictability
- **Color:** Monochrome (white + slate)
- **Psychological Hook:** Halo Effect (organized = trustworthy)
- **Best Patterns:** Data tables, status indicators, modal workflows

### Developer Dark Mode
- **Audience:** Engineers, developers, technical power-users
- **Primary Goal:** Speed, power, futuristic capability
- **Color:** Dark with neon accents
- **Psychological Hook:** Aesthetic Usability Effect (beautiful = advanced)
- **Best Patterns:** Code blocks, glassmorphism, glowing borders, terminal-style data

### Consumer Conversion
- **Audience:** End users, creators, consumers, mobile-first users
- **Primary Goal:** Engagement, delight, conversion
- **Color:** Warm (cream, off-white) + vibrant accents
- **Psychological Hook:** Fitts Law + Zeigarnik Effect (easy + progress = completion)
- **Best Patterns:** Large buttons, progress indicators, device mockups, asymmetrical cards

## Color Palettes Expanded

### Enterprise Authority Colors
```
Background: #FFFFFF
Text: #1F2937 (slate)
Borders: #E5E7EB (light gray)
Secure Status: #14B8A6 (teal)
Alert Status: #EF4444 (red)
Info: #3B82F6 (blue)
Success: #10B981 (green)
Subtle Shadow: rgba(0, 0, 0, 0.1)
```

### Developer Dark Mode Colors
```
Background: #0F172A (deep charcoal) or #000000
Text: #F3F4F6 (light gray)
Borders: rgba(255, 255, 255, 0.1)
Accent Purple: #A78BFA
Accent Cyan: #06B6D4
Accent Green: #10B981
Glow Shadow: rgba(0, 0, 0, 0.5)
```

### Consumer Conversion Colors
```
Background: #FAFAF9 (off-white)
Text: #1F2937 (dark gray)
Primary: #FF8C42 (orange) or #0EA5E9 (blue)
Secondary: #FEF3C7 (cream)
Success: #10B981
Card Shadow: rgba(0, 0, 0, 0.08)
Hover Lift: transform: translateY(-2px)
```

## Typography Stacks

### Enterprise
- Display: Inter Bold, 32px, line-height 1.2
- Body: Inter Regular, 16px, line-height 1.5
- Code: JetBrains Mono, 14px

### Developer Dark
- Display: Outfit Bold, 36px, line-height 1.1
- Marketing: Inter Regular, 16px, line-height 1.5
- Code: Fira Code, 14px

### Consumer
- Display: Satoshi Bold, 40px, line-height 1.2
- Body: Inter Regular, 16px, line-height 1.6
- Accent: Satoshi Medium, 14px

## Component Specifications

### Cards (All Frameworks)

**Enterprise:**
- Padding: 24px
- Border: 1px #E5E7EB
- Border-radius: 12px
- Shadow: 0 1px 3px rgba(0,0,0,0.1)
- Gap (children): 12px

**Developer Dark:**
- Padding: 24px
- Border: 1px rgba(255,255,255,0.1)
- Border-radius: 16px
- Shadow: 0 8px 32px rgba(0,0,0,0.5)
- Backdrop-filter: blur(16px)
- Gap (children): 16px

**Consumer:**
- Padding: 20px
- Border: none
- Border-radius: 24px
- Shadow: 0 4px 12px rgba(0,0,0,0.08)
- Gap (children): 16px

### Buttons

**Enterprise Primary:**
- Background: #3B82F6
- Color: #FFFFFF
- Padding: 12px 24px
- Border-radius: 6px
- Hover: darken 10%

**Developer Dark Primary:**
- Background: linear-gradient(90deg, #A78BFA, #06B6D4)
- Color: #FFFFFF
- Padding: 12px 28px
- Border-radius: 8px
- Glow on hover: box-shadow glow effect

**Consumer Primary:**
- Background: linear-gradient(90deg, #FF6B6B, #FF8E53)
- Color: #FFFFFF
- Padding: 16px 32px
- Border-radius: 50px
- Hover: lift + glow

### Status Indicators

**Enterprise:**
- Secure: #14B8A6 badge with checkmark
- Alert: #EF4444 badge with exclamation
- Info: #3B82F6 badge with info icon
- Size: 8px padding, 12px font, 6px border-radius

**Developer Dark:**
- Secure: Teal glow border + checkmark
- Alert: Red glow border + warning
- Processing: Cyan pulsing border
- Size: Prominent, glowing effect

**Consumer:**
- Progress: Animated gradient fill
- Complete: Checkmark + celebration animation
- Error: Inline error message + red highlight
- Size: Large, prominent, animated

## Spacing System (All Frameworks)

```
xs: 4px    (icon padding, tight spacing)
sm: 8px    (internal padding)
md: 12px   (card gaps, button padding)
lg: 16px   (section spacing)
xl: 24px   (major card padding)
2xl: 32px  (layout padding, major gaps)
3xl: 40px  (page sections)
4xl: 48px  (hero spacing)
```

## Animation Timings (All Frameworks)

```
Quick: 150ms (hover effects, icon changes)
Normal: 200-300ms (button presses, transitions)
Slow: 400-500ms (entrance animations, modals)
```

Easing: `ease` for general use, `ease-out` for exits

## Accessibility Checklist

- [ ] Color contrast ratio 4.5:1 minimum
- [ ] Focus states visible on all interactive elements
- [ ] Keyboard navigation complete (Tab, Enter, Escape)
- [ ] Screen reader labels on buttons and form fields
- [ ] Touch targets minimum 48x48px (mobile)
- [ ] No information conveyed by color alone
- [ ] Alt text on all images

## When to Break the Rules

You can deviate from the matrices if:
1. **New product category emerges** that doesn't fit Enterprise/Developer/Consumer (unlikely, but possible)
2. **Regulatory requirement** mandates a specific visual language (rare)
3. **Major rebrand** across all VerbaFlow products (document it and update all products)

Otherwise: Follow the matrix for consistency and user familiarity.
