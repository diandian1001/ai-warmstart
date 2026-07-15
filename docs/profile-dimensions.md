# Profile Dimensions

This document explains each preference dimension used in Warmstart's Professional Mode — what it measures, why it matters for AI collaboration, how it's converted into system prompt language, and its limitations.

> This tool is **not** a psychological test or personality assessment. It is a structured preference collection tool for AI system prompts.

---

## General Dimensions (asked for all scenarios)

### 1. Response Language

| Aspect | Detail |
|--------|--------|
| **What it measures** | The language(s) you prefer AI to use in responses |
| **Why it matters** | Mismatched language wastes time. Specifying upfront avoids the AI defaulting to English or mixing languages unpredictably. |
| **How it becomes a prompt** | `- Language: Simplified Chinese` — direct instruction, no interpretation needed |
| **Limitations** | Language preference only affects the AI's output language, not its knowledge base or cultural context |

### 2. Feedback Style

| Aspect | Detail |
|--------|--------|
| **What it measures** | How directly you want AI to point out problems in your ideas |
| **Why it matters** | Some people need direct correction to work efficiently; others find it demotivating. Mismatched feedback style erodes trust. |
| **How it becomes a prompt** | `- Feedback Style: Direct correction` or `Appreciate then correct` — tells AI how to frame criticism |
| **Limitations** | This describes a preference, not a personality trait. Your feedback preference may vary by context (work vs. personal). |

### 3. Response Length

| Aspect | Detail |
|--------|--------|
| **What it measures** | How detailed you want AI responses to be |
| **Why it matters** | Overly long responses waste reading time; overly short responses omit needed detail. |
| **How it becomes a prompt** | `- Response Length: Concise` or `Detailed` — gives AI a target depth |
| **Limitations** | "Adaptive" is hard for AI to execute consistently. You may still need to adjust in-conversation with "more detail" or "shorter". |

### 4. Task Focus

| Aspect | Detail |
|--------|--------|
| **What it measures** | How you want AI to handle multitasking situations |
| **Why it matters** | When you have 5 open threads, the AI's behavior can either help you focus or add to the chaos. |
| **How it becomes a prompt** | `- Task Focus: Focus enforcer` — tells AI to actively warn when you're spreading too thin |
| **Limitations** | AI can't actually see your other open tasks. It can only respond based on what you tell it in the current conversation. |

### 5. AI Role

| Aspect | Detail |
|--------|--------|
| **What it measures** | The relationship dynamic you want with AI |
| **Why it matters** | The same information delivered as a "tool output" vs "coach advice" vs "partner dialogue" feels completely different. |
| **How it becomes a prompt** | `- AI Role: Thinking partner` — frames the AI's conversational stance |
| **Limitations** | Role is a communication framing, not a capability. A "coach" AI has the same knowledge as a "tool" AI. |

---

## Scenario-Specific Dimensions

### Writing Scenario

| Dimension | What it measures | Why it matters |
|-----------|-----------------|----------------|
| Writing Style | Your natural writing approach | AI can match your style for seamless collaboration |
| Writing Block | Where you typically get stuck | AI can focus help on your specific bottleneck |
| Target Reader | Who typically reads your output | Different audiences need different tones and depth |
| AI Help | How AI should participate in writing | From full drafts to outline-only — sets clear expectations |

### Research Scenario

| Dimension | What it measures | Why it matters |
|-----------|-----------------|----------------|
| Learning Style | How you absorb new information | AI can structure explanations to match |
| Research Bottleneck | Where your research process breaks | AI can target help at the bottleneck |
| Output Format | Preferred deliverable structure | Saves reformatting time |
| AI Help | Research collaboration mode | Source collection vs. dialogue partner |

### Coding Scenario

| Dimension | What it measures | Why it matters |
|-----------|-----------------|----------------|
| Skill Level | Your programming experience | AI adjusts explanation depth and code complexity |
| Coding Style | Development workflow | AI matches your iteration pattern |
| Problem Solving | How you approach technical issues | AI complements your natural approach |
| AI Help | Code collaboration mode | Full code vs. code review vs. architecture discussion |

### Planning Scenario | Creative Scenario | Daily Scenario

*(Same structure: 4 dimensions per scenario, each measuring a specific collaboration preference with defined prompt conversion and limitations.)*

---

## How Dimensions Convert to Prompts

Each dimension follows a simple conversion rule:

```
User selects option → Value is stored → Value becomes a prompt line
```

Example:
- User selects "Direct correction" for Feedback Style
- Stored as: `"Direct correction"`
- Becomes: `- Feedback Style: Direct correction`

**No inference or interpretation is added.** The prompt says exactly what the user selected.

---

## What This Tool Is NOT

1. **Not a personality test.** These questions measure stated preferences for AI interaction, not underlying personality traits.
2. **Not a psychological assessment.** No clinical validity is claimed. These dimensions are designed for AI prompt optimization, not diagnosis.
3. **Not a substitute for iteration.** The generated profile is a starting point. You should adjust it based on actual experience with each AI tool.
4. **Not comprehensive.** There are many dimensions of AI collaboration not covered here (e.g., creativity tolerance, humor preference, citation style). This tool covers the most commonly reported friction points.

---

## Experimental Mode Disclaimer

In Experimental Mode, MBTI type and Zi Wei Dou Shu (Chinese astrology) content may be added to the profile. These are provided **for entertainment and self-exploration only**. They do not constitute or replace:
- Scientific personality measurement
- Psychological assessment or diagnosis
- Career or life decision guidance
- Any form of professional advice

If astrology content conflicts with your stated preferences in other sections, **always prioritize your stated preferences**.
