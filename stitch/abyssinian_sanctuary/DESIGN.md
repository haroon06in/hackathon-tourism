# Design System: High-End Editorial Hospitality

## 1. Overview & Creative North Star: "The Lakeside Curated Living"
This design system moves away from the rigid, boxed layouts of traditional booking platforms and toward a "Curated Living" editorial experience. Our Creative North Star is **The Organic Gallery**. We treat the UI not as a digital interface, but as a series of layered, natural elements—like stones resting in a lake or fine linens draped over mahogany.

To achieve this, we lean into **intentional asymmetry**. We break the grid by allowing high-resolution imagery to bleed off-screen or overlap with typography. We avoid the "template" look by using exaggerated typographic scales and tonal depth rather than structural lines. The result is a digital experience that feels as quiet, premium, and grounded as a morning at Kuriftu.

---

## 2. Colors & The "No-Line" Rule
Our palette is a direct reflection of the Ethiopian landscape: the deep greens of the highlands (`primary`), the scorched earth and timber (`secondary`), and the shimmering Rift Valley lakes (`tertiary`).

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to define sections. High-end hospitality is about flow, not boundaries. 
- **Transition through Tone:** Separate a "Hero" section from a "Room Gallery" by shifting from `surface` (#fcf9f4) to `surface-container-low` (#f6f3ee).
- **The "Glass & Gradient" Rule:** For floating navigation or primary booking CTAs, use Glassmorphism. Apply a `surface` color at 70% opacity with a `backdrop-blur` of 12px.
- **Signature Textures:** For the main "Book Now" actions, apply a subtle linear gradient from `primary` (#163422) to `primary-container` (#2d4b37). This creates a "silken" depth that flat color cannot replicate.

---

## 3. Typography: Elegant & Grounded
We pair a sophisticated Serif for storytelling with a high-performance Sans-Serif for utility.

*   **Display & Headline (Noto Serif):** Used for "The Narrative." These should be set with generous tracking or even slightly tight leading to create an "Editorial Cover" feel. `display-lg` (3.5rem) should be reserved for emotive, single-word headers (e.g., "Serenity").
*   **Title & Body (Manrope):** Used for "The Service." Manrope provides a grounded, contemporary contrast to the serif. It remains highly legible at `body-md` (0.875rem) for amenity lists and fine print.
*   **Hierarchy Note:** Always lead with Noto Serif to establish the "Premium" tone, then transition to Manrope for the "Hospitality" details.

---

## 4. Elevation & Depth: Tonal Layering
In this system, shadows are a last resort. We convey hierarchy through physical stacking.

*   **The Layering Principle:** Treat the screen like a desk. A `surface-container-lowest` card (#ffffff) sitting on a `surface-container` (#f0ede8) background creates a natural lift.
*   **Ambient Shadows:** If an element must float (like a floating action button for "Inquiry"), use a shadow with a 24px blur, 4% opacity, using a tint of `on-surface` (#1c1c19). It should feel like a soft shadow cast by sunlight, not a digital effect.
*   **The "Ghost Border" Fallback:** If a container requires definition against a similar background, use the `outline-variant` (#c2c8c0) at **15% opacity**. Anything higher is too aggressive for the Kuriftu brand.

---

## 5. Components

### Buttons & Interaction
*   **Primary Button:** Uses `primary` background with `on-primary` text. Shape: `md` (0.75rem). Transition: On hover, shift to `primary-container`.
*   **Secondary/Text Button:** Uses `on-surface` with no background. Forbid the use of boxes; use `label-md` with 2px underline from `secondary-fixed`.

### Input Fields & Booking
*   **Input Fields:** Use `surface-container-high` backgrounds with a bottom-only `outline` (#727972) at 20% opacity. 
*   **The "Natural" Checkbox:** Use `primary` for the checked state. Roundness should be `sm` (0.25rem) to feel softer than a sharp square but more "built" than a circle.

### Cards & Content Discovery
*   **Forbid Dividers:** Do not use horizontal lines between list items. Use the **Spacing Scale** `8` (2.75rem) or `10` (3.5rem) to create separation through "breathing room."
*   **Image-First Cards:** Cards should have an `xl` (1.5rem) corner radius. Imagery should take up 70% of the card area, with typography nested in a `surface-container-lowest` overlay at the bottom.

### Additional Signature Components
*   **The "Lakeside" Carousel:** A horizontal scroll component where the active image is `xl` rounded, while inactive images are `md` rounded and slightly desaturated.
*   **Experience Chips:** Use `secondary-container` (#fdc796) with `on-secondary-container` (#79512a) for tags like "Spa," "Dining," or "Boating."

---

## 6. Do's and Don'ts

### Do
*   **Do** use the Spacing Scale `20` (7rem) for vertical padding between major story sections. Luxury requires "wasted" space.
*   **Do** overlap elements. Place a small `title-sm` caption so it slightly overlaps the edge of a large lake photograph.
*   **Do** use `tertiary` (#00324a) sparingly—only for water-related features or deep-night themes.

### Don't
*   **Don't** use pure black (#000000). Always use `on-surface` (#1c1c19) to maintain the organic, earthy warmth.
*   **Don't** use "pill" buttons (9999px) for everything. Stick to `md` (0.75rem) or `lg` (1rem) to keep the "grounded" architectural feel.
*   **Don't** cram information. If a room description is long, hide it behind a "Discover More" progressive disclosure.