# Privacy

> Last updated: 2026-07

## Summary

Warmstart processes all your data **entirely in your browser**. Nothing is uploaded, stored, or transmitted to any server.

## What Data Is Collected

The tool asks you questions about your AI usage preferences, and optionally:
- Birth date/time/gender (Experimental Mode only)
- MBTI type (Experimental Mode only)

## How Data Is Processed

| Question | Answer |
|----------|--------|
| Is data uploaded to a server? | **No.** All processing happens in your browser's JavaScript engine. |
| Is data stored after you close the page? | **No.** All data is held in temporary JavaScript variables. When you close or refresh the page, it is gone. |
| Is `localStorage` used? | **No.** The current version provides a Chinese-only interface and does not use `localStorage`, `sessionStorage`, or IndexedDB. Questionnaire answers, birth information, MBTI type, and generated profiles are held only in page memory and disappear when the page is refreshed or closed. |
| Are cookies used? | **No.** |
| Are third-party APIs called? | **No.** The Zi Wei Dou Shu calculation (`ziwei.js`) is a local JavaScript function. No external API is called. |
| Is there any analytics or logging? | **No.** There is no Google Analytics, no tracking pixel, no error logging service. |
| Is data shared with anyone? | **No.** Since nothing leaves your browser, there is nothing to share. |
| What happens when I click "Copy"? | The generated profile text is copied to your clipboard using the standard browser clipboard API. From that point, you control where it goes. |

## The Generated Profile

The profile text you copy is plain text. It contains only the preferences you selected and (in Experimental Mode) the astrology/MBTI content you opted into. Once copied, you are responsible for where you paste it.

## GitHub Pages Hosting

This site is hosted on GitHub Pages. GitHub may collect standard server access logs (IP address, timestamp, requested URL) as part of their infrastructure. See [GitHub's Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement) for details.

## Children

This tool is not directed at children under 13, and we do not knowingly collect information from children.

## Changes

If this privacy description changes, the update will be reflected in this file and in the repository's commit history.

## Contact

For privacy questions, open an issue at [github.com/diandian1001/ai-warmstart](https://github.com/diandian1001/ai-warmstart).
