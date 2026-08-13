# UI/UX Design Guide

This guide defines the visual foundation for the Client Project Tracker frontend. It is intentionally practical: it provides the design decisions needed to build a clear, accessible project-management interface while retaining a creative-agency personality.

> **Living design guide:** This palette and its usage rules are the current baseline, not a permanent constraint. They may change during future iterations as usability feedback, accessibility checks, product needs, or the visual direction evolve. Any revision should preserve clear semantic status/priority meaning and sufficient color contrast.

## Brand assets

- Horizontal wordmark: `frontend/public/branding/client-project-tracker-logo.png`
- Icon/favicon: `frontend/public/branding/client-project-tracker-icon.png`

Use the horizontal wordmark at a restrained size in the application header and sign-in screen. Use the icon as the browser favicon and wherever a compact brand mark is needed. Do not stretch, recolor, crop, or place the logo on a low-contrast surface.

## Design direction

The interface should feel:

- Professional and trustworthy
- Modern and focused
- Warm enough for a creative agency
- Calm during long work sessions
- Clear at a glance, especially for project status and priority

The workspace should be visually quiet. Brand colors are used to guide attention rather than fill every surface.

## Brand palette

The original brand palette is based on the following colors:

| Name | Hex | Intended role | Rationale |
| --- | --- | --- | --- |
| Royal Blue | `#05299E` | Primary headings, navigation, strong actions | Trust, stability, competence |
| Indigo | `#5E4AE3` | Primary buttons, links, selected states | Focus, modern technology, creativity |
| Lavender | `#947BD3` | Secondary accents and decoration | Approachability and creative character |
| Peach | `#F0A7A0` | Soft highlight surfaces only | Warmth and human character |
| Pink | `#F26CA7` | Small decorative or emphasis accents | Energy and creative momentum |

## Neutral workspace palette

Use neutrals for the majority of the screen. This keeps project information readable and prevents visual fatigue.

| Role | Hex |
| --- | --- |
| Page background | `#F8FAFC` |
| Card / panel background | `#FFFFFF` |
| Primary text | `#172033` |
| Secondary text | `#64748B` |
| Borders / dividers | `#E2E8F0` |

## Color usage rules

- Use Royal Blue or Indigo for the primary call to action, never both on the same control.
- Use white text on Royal Blue. Check contrast before using white on any lighter brand color.
- Use dark text on Lavender, Peach, and Pink backgrounds.
- Do not use brand Pink or Peach to communicate errors, warnings, or priority levels.
- Avoid large saturated color blocks behind dense project data.
- Prefer light tinted backgrounds and a colored text/icon treatment for secondary emphasis.

## Semantic colors

Status and priority colors communicate meaning. They must remain distinct from decorative brand colors.

### Project status

| Status | Foreground | Soft background | Meaning |
| --- | --- | --- | --- |
| Planning | `#2563EB` | `#DBEAFE` | Direction and preparation |
| In Progress | `#5E4AE3` | `#EDE9FE` | Active focus and momentum |
| On Hold | `#B45309` | `#FEF3C7` | Caution and attention needed |
| Completed | `#15803D` | `#DCFCE7` | Completion and positive progress |

### Priority

| Priority | Foreground | Soft background | Meaning |
| --- | --- | --- | --- |
| Low | `#475569` | `#F1F5F9` | Low urgency |
| Medium | `#C2410C` | `#FFEDD5` | Needs attention without duplicating the amber On Hold status |
| High | `#B91C1C` | `#FEE2E2` | Urgent or higher delivery risk |

## Typography

Use a clean system sans-serif stack for performance and readability:

```css
font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

Use clear hierarchy:

- Page title: large, Royal Blue or dark text
- Project name: strong and prominent
- Client name: smaller supporting label
- Description and dates: secondary text
- Badge labels: compact, medium-to-bold weight

## Layout principles

- Use a pale neutral page background with white project cards.
- Keep card padding generous and use visible but subtle borders.
- Make the project name the strongest element inside each card.
- Group status and priority badges together.
- Keep creation metadata above a consistently labelled **Schedule** and clearly separated actions in each card footer.
- Group search, filters, and sorting inside one quiet control panel so users understand they work together.
- Use a subtle indigo-tinted control panel for browsing tools and a narrow semantic status accent on each project card; reserve stronger text color for the client, project name, and schedule hierarchy.
- Treat status and priority as related metadata: both use the same soft-filled, subtly bordered pill component. Semantic color and the label distinguish the concepts; consistent widths and centered, compact semibold text keep card rows aligned predictably.
- On narrow screens, stack card content and keep actions comfortably tappable.
- Use one primary action per screen. For the projects page, this will be **New Project**.

## CRAP principles in the interface

The project list applies the CRAP principles of visual design:

| Principle | Application |
| --- | --- |
| Contrast | Royal Blue and Indigo establish hierarchy; the browsing panel has a subtle indigo tint; semantic badge colors and a narrow status accent make project state scannable without turning every card into a colored surface. |
| Repetition | Cards, badges, buttons, spacing, borders, labelled schedules, and metadata formatting repeat predictably across every project. |
| Alignment | Headers, control fields, card content, footer details, and actions use consistent left/right alignment on larger screens and stack intentionally on small screens. |
| Proximity | Search, filters, and sorting are one control group; client/project identity, status/priority, and schedule/actions are grouped by their relationship so users can scan each record quickly. |

## Required experience states

Every data-dependent screen must explain its state clearly:

| State | User-facing message |
| --- | --- |
| Loading | `Loading projects…` |
| Empty | `No projects found.` |
| API failure | `Unable to load projects. Please try again.` |
| Save failure | `Unable to save project. Please review the highlighted fields.` |

Do not expose raw browser, Django, or network exceptions to users.

## Accessibility baseline

- Meet readable color contrast; do not rely on color alone to communicate status or priority.
- Use real buttons for actions and real form labels for inputs.
- Preserve visible keyboard focus states.
- Keep touch targets comfortably sized.
- Use concise, descriptive labels such as `Edit Corporate Website Redesign` where context is needed.
- Ensure error messages are tied to their relevant fields.

## Applied interface pattern

The project-list screen applies this guide:

```text
Pale neutral page background
  ↓
Royal Blue page heading + Indigo primary action
  ↓
White Project cards with subtle borders
  ↓
Semantic status and priority badges
  ↓
Readable dates and clearly placed actions
```

Future revisions should extend this guide rather than introduce unrelated colors or interaction patterns.
