# Design Guidelines: NSE-BSE BhavCopy Download Tool

## Design Approach
**System-Based Approach**: This is a utility-focused financial data tool requiring precision, clarity, and functional excellence. Drawing from Material Design principles with custom refinements for financial applications, prioritizing data readability and interaction efficiency over decorative elements.

**Key Principles**:
- Information clarity above all - every element serves a functional purpose
- Spatial efficiency - maximize utility within compact viewport
- Trust through precision - exact alignments, consistent patterns
- Professional restraint - no unnecessary flourishes

## Typography
**Font Stack**: Poppins (via Google Fonts CDN) for its excellent readability in data contexts

**Hierarchy**:
- **H1 (Main Title)**: 22px, weight 800, letter-spacing 0.2px - centered, commanding presence
- **Section Labels**: 15px, weight 700, letter-spacing 0.2px - for calendar headers, controls
- **Body/Interactive Elements**: 14-15px, weight 700 - buttons, date cells, primary interactions
- **Supporting Text**: 13px, weight 600 - secondary actions, quick select chip
- **Metadata/Footer**: 12px, weight 400 - contextual information, status messages, attribution
- **Micro Labels**: 11px, weight 700 - calendar day headers (SUN, MON, etc.)

## Layout System
**Spacing Primitives**: Tailwind units of **2, 4, 6, 8, 10, 12, 16, 18** (e.g., p-2, gap-4, mb-6, p-8)

**Container Strategy**:
- Single centered card: max-width 760px, centered both horizontally and vertically in viewport
- Internal card padding: 16-18px
- Component gaps: 10-12px between major sections
- Grid gaps: 8px for calendar cells (touch-friendly)

**Vertical Flow**:
- Header → Controls → Info Line → Calendar → Footer
- Consistent 10-12px spacing between sections
- Calendar internal padding: 8-10px

## Component Library

### Card Container
Rounded container (16px radius) with elevated appearance, subtle border, contains entire application

### Header Section
Centered title with minimal ornamentation, 2px top margin, 10px bottom

### Control Bar
Horizontal flex layout with 10px gaps, centered alignment, wrapping on mobile
- **Primary Action Button**: Gradient treatment, prominent with depth (shadow)
- **Secondary Buttons**: Outlined style, subtle background, border treatment
- **Status Tag**: Pill-shaped with border, muted background, small text

### Information Line
Centered, 13px text, minimum height 22px, subtle opacity (0.95), transitions smoothly on content change

### Calendar Component
**Top Navigation Bar**: 3-column grid (nav controls | title | quick action)
- **Nav Controls**: Left-aligned cluster of previous/today/next buttons (10px radius, icon-based)
- **Title**: Centered month/year display, bold
- **Quick Action**: Right-aligned pill button with dashed border, teal accent

**Day Headers**: 7-column grid, 11px uppercase abbreviated day names, centered, muted

**Date Grid**: 7×6 grid (42 cells), 8px gaps
- **Day Cells**: 46px height, 12px radius, centered content, 14px bold numerals
- **Visual States**:
  - Default: Subtle background with border
  - Hover: Slightly lighter background
  - Today: Outlined with accent color (2px inset)
  - Selected Start/End: Gradient fill, high contrast
  - Selected Middle: Translucent accent fill
  - Disabled (weekends/holidays/future): Muted, reduced opacity
  - Other Month: 58% opacity
- **Status Indicators**: 6px circular dots positioned bottom-left (8px from left, 6px from bottom)
  - Weekend dot: Gray/muted
  - Holiday dot: Red/alert

### Progress Indicator
Thin 3px bar at top of card, gradient animation, appears during download operations

### Footer
Centered, 12px muted text, subtle attribution with 8px top margin

## Component Behavior
- **Focus States**: Visible outline (3px) with accent color for keyboard navigation
- **Transitions**: 0.12-0.18s ease for backgrounds, shadows; 0.06s for transforms
- **Loading States**: Smooth width transition on progress bar (0.25s ease)
- **Hover Feedback**: Subtle background shifts, shadow elevation on buttons

## Animations
**Minimal & Purposeful**:
- Calendar month change: 0.14s fade-in only
- Button interactions: Transform (1px) on active state
- Progress bar: Smooth width transition
- No scroll animations, parallax, or decorative motion

## Accessibility
- Keyboard navigation throughout calendar grid
- ARIA live regions for dynamic content (selected dates, info line, calendar title)
- Focus-visible indicators distinct from hover
- Sufficient contrast ratios (light text on dark backgrounds)
- Semantic HTML structure with proper roles

## Images
**No Images Required**: This is a pure utility application. No hero section, no decorative imagery. The interface is entirely text, icons (arrows, symbols), and colored indicators (dots). The visual impact comes from gradient backgrounds, precise typography, and spatial relationships.