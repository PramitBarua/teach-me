# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this workspace is

This is a **teaching workspace** for learning AWS Solutions Architect Associate (SAA-C03), powered by the [`teach` skill](https://github.com/mattpocock/skills) (`mattpocock/skills`). It is not a software project — there is no build, test, or lint step.

## Invoking the teach skill

Use `/teach` to start or continue a learning session. The skill is already installed (`skills-lock.json`).

## Workspace layout

| Path | Purpose |
|---|---|
| `MISSION.md` | Why the user is learning this — grounds all teaching decisions |
| `NOTES.md` | User preferences and working notes for the teacher |
| `RESOURCES.md` | Curated high-trust sources; never use parametric knowledge when a source is available |
| `GLOSSARY.md` | Canonical AWS terminology for this workspace — all lessons must adhere to it |
| `lessons/*.html` | Self-contained HTML lessons, numbered `0001-<slug>.html` |
| `reference/*.html` | Printable cheat sheets and quick-reference docs |
| `learning-records/*.md` | ADR-style records of what has been learned, numbered `0001-<slug>.md` |
| `assets/` | Shared CSS, quiz widgets, and other reusable components linked by lessons |

## Teaching rules (from SKILL.md)

- **Check `MISSION.md` first.** Every lesson must be tied to the mission. If it is missing or vague, interview the user before writing anything.
- **Zone of proximal development.** Read `learning-records/` to find the right difficulty level — neither too easy nor out of reach.
- **Knowledge before skills.** Explain the concept, then make the user practice it interactively in the same lesson.
- **Lessons are short HTML files.** One tightly-scoped thing per lesson. Open the file in a browser after writing it (`xdg-open lessons/NNNN-slug.html`).
- **Reuse assets.** Read `assets/` before writing a lesson. Add new reusable components there; never inline code that a second lesson would duplicate.
- **Cite everything.** Lessons link to entries in `RESOURCES.md`. If a resource is missing, add it there first.
- **Fluency ≠ mastery.** Design for storage strength via retrieval practice, spacing, and interleaving — not just reading.
- **Quizzes:** all answer options must be the same length to avoid giving formatting clues.
- **Learning records** are written only when the user demonstrates genuine understanding, corrects a misconception, or discloses prior knowledge — not merely when material is covered.
- **Glossary grows with understanding.** Add a term only once the user can use it correctly.

## Format conventions

- Lessons: `lessons/NNNN-<dash-case>.html` — beautiful, Tufte-inspired HTML; links to assets via relative paths
- Reference docs: `reference/<name>.html` — designed for printing
- Learning records: `learning-records/NNNN-<dash-case>.md` — single paragraph, ADR style
