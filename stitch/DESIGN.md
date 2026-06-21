---
name: Signal Desk Canary
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#271901'
  on-tertiary-container: '#98805d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#fcdeb5'
  tertiary-fixed-dim: '#dec29a'
  on-tertiary-fixed: '#271901'
  on-tertiary-fixed-variant: '#574425'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-padding: 24px
  gutter: 16px
  component-gap: 8px
  stack-sm: 4px
  stack-md: 12px
---

## Brand & Style

The design system is engineered for high-utility status monitoring, prioritizing clarity, density, and professional reliability. The aesthetic follows a **Modern Corporate** approach with a **Utility-First** philosophy, stripping away decorative marketing elements in favor of information hierarchy and rapid data scanning.

The target audience consists of SREs, DevOps engineers, and system administrators who require a "calm" interface during high-stress incidents. The emotional response is one of controlled precision and absolute transparency. Visual weight is distributed through structured grids and subtle tonal shifts rather than bold splashes of color, ensuring that status indicators remain the primary focal point of the experience.

## Colors

The color palette is built on a foundation of Slate grays to provide a neutral, low-strain background for long-term monitoring. 

- **Foundation:** We use `Slate 900` (#0F172A) for primary text and brand elements to ensure high contrast, while `Slate 50` (#F8FAFC) serves as the primary workspace background.
- **Status Indicators:** The system utilizes a semantic "Traffic Light" system. Emerald-500 represents operational health, Amber-500 denotes latency or warnings, and Rose-500 signifies downtime.
- **Accents:** Borders and dividers utilize `Slate 200` to maintain structure without creating visual noise. Secondary text is relegated to `Slate 500`.

## Typography

This design system utilizes **Inter** for all UI elements to maximize legibility in dense layouts. A secondary typeface, **JetBrains Mono**, is introduced for technical labels, IDs, and timestamps to provide a distinct visual "node" for technical data.

Scale is purposefully tight. Most interface text sits between 12px and 14px to allow for high data density. Headlines are restrained, using weight rather than massive scale to denote hierarchy. Tight letter-spacing is applied to larger headers to maintain the professional, compact aesthetic.

## Layout & Spacing

The layout utilizes a **Fluid Grid** system based on a 4px baseline. This ensures all components align perfectly on a consistent rhythm.

- **Desktop:** 12-column grid with 16px gutters. Sidebars are fixed at 240px to maximize the dashboard workspace.
- **Density:** We favor `compact` vertical spacing. Lists and table rows should maintain a height of 32px to 40px.
- **Responsive:** On mobile, the layout collapses into a single-column stack. Container padding reduces from 24px to 16px to conserve horizontal real estate. 
- **Alignment:** All technical data (timestamps, status codes) should be tabular-numeral aligned to ensure vertical scanning is effortless.

## Elevation & Depth

To maintain a "flat" utility look, this design system avoids heavy shadows. Depth is communicated primarily through **Tonal Layers** and extremely subtle outlines.

1. **Surface Level 0 (Background):** Slate 50.
2. **Surface Level 1 (Cards/Panels):** White with a 1px border of Slate 200.
3. **Elevated State (Modals/Popovers):** White with a soft, 8px blur shadow at 5% opacity and a Slate 300 border.

Interaction states (hover/active) should be represented by a subtle background shift (e.g., White to Slate 50) rather than a change in elevation or shadow depth.

## Shapes

The shape language is **Soft (0.25rem)**. This provides a professional, modern feel that avoids the clinical harshness of sharp corners while remaining more space-efficient than fully rounded "pill" designs.

- **Buttons & Inputs:** 4px radius.
- **Cards & Containers:** 6px to 8px radius.
- **Status Dots:** Perfect circles (50% radius) to distinguish them instantly from structural UI elements.

## Components

### Buttons
Primary buttons use Slate 900 with white text. Secondary buttons use a white background with a Slate 200 border. Ghost buttons are used for low-priority actions in dense toolbars.

### Status Chips
Small, high-contrast badges. OK status uses an Emerald-100 background with Emerald-700 text. Warning uses Amber-100 with Amber-700 text. Error uses Rose-100 with Rose-700 text.

### Data Tables
The core of the system. Rows must have a hover state (Slate 50) and 1px bottom borders. Column headers are uppercase JetBrains Mono at 11px.

### Input Fields
Strictly rectangular with a 4px radius. Default border is Slate 200, shifting to Slate 900 on focus. No inner shadows; use a clean 1px solid stroke.

### Uptime Graphs (Sparklines)
Simplified line charts without axes, used within table rows. Lines should be 1.5px thick, using the semantic color of the current status.

### Health Monoliths
Large blocks of color representing service health, grouped in grids. These should be 24x24px squares with a 2px radius, colored according to status.