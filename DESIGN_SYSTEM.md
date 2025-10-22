# Visual Design Styling Guide

*Based on "Visual design rules you can safely follow every time" by Anthony Hobday*

This guide provides safe, proven visual design rules that can be applied consistently across all projects to create professional, polished interfaces.

## Color and Contrast

### Color Selection
- **Use near-black and near-white** instead of pure black (#000000) and pure white (#ffffff)
  - Near-black: `#1a1a1a` or `#212121`
  - Near-white: `#fafafa` or `#f8f8f8`
- **Saturate neutrals** with a hint of color for more sophisticated grays
  - Add slight blue, green, or warm tone to grays
  - Avoid mixing warm and cool colors in neutral saturations

### Contrast Rules
- **Use high contrast** for important elements that need attention
- **Ensure distinct brightness values** in color palettes
- **Lower icon contrast** when icons are paired with text to avoid visual competition
- **Container borders** must contrast sufficiently with their background

### Container Color Limits
- Keep container background colors within specific brightness ranges
- Avoid extreme darks or lights for content containers

## Typography

### Text Sizing and Spacing
- **Body text minimum**: 16px or larger for readability
- **Adjust letter spacing** based on text size:
  - Larger text: tighter letter spacing
  - Smaller text: looser letter spacing
- **Line height scaling**: Adjust line height proportionally to text size
- **Line length**: Aim for approximately 70 characters per line

### Typeface Selection
- **Maximum two typefaces** per design
- Choose typefaces that complement each other
- Maintain consistency throughout the interface

## Layout and Spacing

### Alignment Principles
- **Be deliberate** about every design element placement
- **Use optical alignment** over mathematical alignment when it looks better
- **Align everything with something else** - no orphaned elements
- **Use mathematically related measurements** (e.g., multiples of 4, 8, or 16px)

### Grid System
- **Use 12-column horizontal grid** as a foundation
- Maintain consistent grid spacing throughout layouts

### Visual Weight and Arrangement
- **Arrange elements by visual weight** - heavier elements draw more attention
- **Space between high-contrast points** to avoid visual tension
- **Outer padding ≥ inner padding** - container outer padding should equal or exceed inner padding

### Button Design
- **Button padding ratio**: Make horizontal padding twice the vertical padding
  - Example: If vertical padding is 8px, horizontal should be 16px

## Depth and Shadows

### Shadow Techniques
- **Drop shadow rule**: Blur values should be double their distance values
  - Example: 2px distance = 4px blur, 4px distance = 8px blur
- **Avoid shadows in dark interfaces** - they often don't work well
- **Stick to one depth technique** consistently throughout the design

### Layering
- **Lighter elements appear closer** - use lighter colors for foreground elements
- **Consistent depth hierarchy** - maintain logical layering throughout

## Composition

### Visual Balance
- **Simple on complex rule**: Place simple elements on complex backgrounds and vice versa
- **Avoid multiple hard visual divides** in a single layout - one strong divider is usually enough

### Corner and Border Treatment
- **Nest corners properly** - ensure corner radii work harmoniously together
- **Container border contrast** - borders must be visible against their background

## Implementation Guidelines

### CSS Custom Properties Example
```css
:root {
  /* Near-black and near-white */
  --color-near-black: #1a1a1a;
  --color-near-white: #fafafa;

  /* Saturated neutrals */
  --color-neutral-100: #f8f9fa;
  --color-neutral-200: #e9ecef;
  --color-neutral-500: #6c757d;
  --color-neutral-800: #343a40;

  /* Spacing scale (multiples of 8) */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;

  /* Typography */
  --font-size-body: 16px;
  --line-height-body: 1.5;
  --line-length-optimal: 70ch;
}
```

### Button Implementation
```css
.button {
  padding: 8px 16px; /* 2:1 ratio horizontal:vertical */
  /* Add other button styles */
}
```

### Shadow Implementation
```css
.card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 2px distance, 4px blur */
}

.elevated {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 4px distance, 8px blur */
}
```

## Quick Checklist

When reviewing any design, check:

- [ ] Using near-black/near-white instead of pure black/white
- [ ] Text is 16px or larger
- [ ] Line length around 70 characters
- [ ] Maximum two typefaces used
- [ ] All elements aligned with something else
- [ ] Measurements use mathematical relationships
- [ ] Button padding follows 2:1 horizontal:vertical ratio
- [ ] Shadow blur is 2x distance value
- [ ] Simple elements on complex backgrounds (or vice versa)
- [ ] Consistent depth technique throughout
- [ ] Sufficient contrast for all text and UI elements

## Notes for Implementation

- These rules provide a safe foundation - they can be broken intentionally with good reason
- Always consider accessibility when implementing these guidelines
- Test designs across different devices and screen sizes
- These principles work particularly well for web interfaces and digital products

---

*This guide is based on research-backed design principles that consistently produce professional results across various design contexts.*