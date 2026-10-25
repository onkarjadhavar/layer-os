# TRIWIZATHON'26 — Master Engineering & Design Rules

This project operates under an automated, multi-skill software engineering and design workflow. 
**You (the assistant) MUST apply these rules on EVERY turn automatically, without requiring the user to invoke any skill names.**

---

## 🧭 Automated 4-Phase Development Workflow

Whenever the user asks to build, modify, or add features to this project, execute through these 4 phases:

```
Phase 1: Architecture & Scope  ───► Superpowers (Brainstorming + Planning)
Phase 2: Design Specification  ───► Web-Design + Taste-Skill + Hallmark (DESIGN.md first)
Phase 3: Plan Execution & Lean ───► Executing-Plans + Ponytail + TDD + FreeLLMAPI
Phase 4: Quality & Audit       ───► Verification-before-completion + Ponytail Review
```

---

### Phase 1: Planning & Scope (Superpowers)
* **Never jump blindly into code.** For any new feature or project setup, understand requirements first.
* Ask focused clarifying questions in one concise message to establish:
  1. Primary user journey / goal
  2. Concrete content & data (real numbers, real names, avoid lorem ipsum)
  3. Tone & vibe
* Produce a bite-sized, step-by-step implementation plan before modifying/creating files.
* Track multi-step progress with an explicit task checklist artifact.

---

### Phase 2: Design First (Web-Design + Taste-Skill + Hallmark)
* **Spec First, Code Second:** For any web page, UI component, or app screen, create or update `DESIGN.md` in the project root before writing HTML/CSS/JS.
* **Anti-Slop Hard Floor (Hallmark & Taste-Skill):**
  * All colors and typography must use CSS variables/tokens declared at `:root`.
  * **No generic AI tells:** No centered 3-line headline with an eyebrow badge; no random purple-to-blue gradients; no cards inside cards; no emoji as icons; no decorative status dots.
  * Curate distinctive font pairs (e.g., from Google Fonts like Instrument Serif + Geist, Syne + Onest, or Cabinet Grotesk + Literata).
  * Lead with substance: real photography (Wikimedia/Unsplash open license) or real UI product mockups, not empty placeholder gray boxes.
  * Enforce full responsiveness (mobile viewport < 600px, tablet, and 1280px+ desktop).

---

### Phase 3: Disciplined Plan Execution (Executing-Plans + Ponytail + TDD + FreeLLMAPI)
* **Execute the Plan Step-by-Step (`executing-plans`):**
  * Announce at start: *"I'm using the executing-plans skill to implement this plan."*
  * For each task in the plan: mark as `in_progress`, implement the task, run verifications as specified, and mark as `completed`.
  * **STOP immediately when blocked:** If a blocker occurs (missing dependency, test failure, ambiguous instruction), STOP and ask rather than guessing.
  * Never force through blockers; return to plan review if fundamental rethinking is needed.
* **Lazy Senior Dev Mode (`ponytail`):** The best code is the code never written. Solve the whole problem with the least new code.
* **YAGNI (You Aren't Gonna Need It):** Skip unrequested abstractions, extra wrappers, premature microservices, or complex state management libraries if standard Web APIs (HTML5/Vanilla JS/CSS or lightweight framework) solve it cleanly.
* **Standard Library / Existing Patterns First:** Never install a heavy npm package for something standard JavaScript or CSS already provides natively.
* If a shortcut is taken for speed, leave an inline code comment: `// shortcut: <limit>, <when to upgrade>`.
* For critical logic or data handling, write a quick self-check or unit test.
* **Zero-Cost LLM Inference (`freellmapi`):**
  * If the application needs AI features (smart search, chatbots, summaries, evaluations, mock content), route via FreeLLMAPI (`http://localhost:3001/v1` or OpenAI-compatible client) to leverage 34 free provider tiers (~7.4B free tokens/mo) without burning paid API credits.
  * Use multi-model failover (`auto`) to avoid rate limits during local testing and development.

---

### Phase 4: Quality & Audit
* **Evidence Before Assertions:** Before declaring a feature complete, test it (run local dev server, run build check, or run browser inspection).
* Verify responsive layouts, keyboard accessibility (`:focus-visible`), and ensure no console errors.
* Follow `finishing-a-development-branch` when all tasks are complete and verified.
* Provide a brief senior developer review summary at the end of each major milestone: what was built, what was intentionally omitted, and any risks to note.
