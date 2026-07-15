# Warmstart

[![License: MIT](https://img.shields.io/badge/License-MIT-7c5cfc.svg)](https://opensource.org/licenses/MIT)
[![Live Demo](https://img.shields.io/badge/Live_Demo-试用-f59e0b.svg)](https://diandian1001.github.io/ai-warmstart/)
[![Stars](https://img.shields.io/github/stars/diandian1001/ai-warmstart?style=social)](https://github.com/diandian1001/ai-warmstart)

**生成你的 AI 协作画像**——一段结构化文本，记录你的沟通偏好和工作风格。粘贴到任何 AI 工具（ChatGPT、Claude、Cursor、Hermes…），AI 马上知道怎么跟你配合。

---

## 快速开始

1. 打开 **[diandian1001.github.io/ai-warmstart](https://diandian1001.github.io/ai-warmstart/)**
2. 选择**专业模式**（默认推荐），生成简洁的 AI 协作画像
3. 选择主要使用场景，回答 5 个通用偏好 + 4 个场景专项问题（约 3 分钟）
4. 复制生成的文本 → 粘贴到 AI 工具的 system prompt

> 🎭 **实验模式**包含可选 MBTI 和紫微斗数内容，仅供娱乐性自我探索，有明确标注，不影响专业模式。

---

## 示例输出

### 你回答的内容（专业模式，研究场景）：
- 回复语言：中英混合
- 反馈风格：直接指出问题
- 回复长度：适中
- 任务聚焦：帮我理清优先级
- AI 角色：思考伙伴
- 学习方式：问题驱动
- 研究瓶颈：信息太多，不知道哪个可信
- 输出格式：结构化报告

### 你得到的结果（可直接粘贴到任何 AI）：

```
# AI 画像 · 研究与学习

## 通用偏好
- 回复语言：中英混合
- 反馈风格：直接纠正型
- 回复长度：适中型
- 任务聚焦：辅助排序型
- AI 角色：伙伴型

## 学习方式
问题驱动型

## 研究瓶颈
信息过载

## 呈现形式
结构化报告

## AI帮法
搜集整理
---
由 Warmstart v0.7.0 生成
```

→ 粘贴到 ChatGPT Custom Instructions、Claude Project Knowledge、Cursor `.cursorrules` 或 Hermes `SOUL.md`。

---

## 收集什么

| 类别 | 题数 | 说明 |
|------|------|------|
| 场景选择 | 1 | 决定后续问什么维度 |
| 通用偏好 | 5 | 语言、反馈风格、回复长度、任务聚焦、AI 角色 |
| 场景维度 | 4 | 根据场景不同（写作风格/技术水平/研究方式等） |

**专业模式**（默认）：仅以上内容，不需要任何个人信息。

**实验模式**（主动选择）：额外提供可选 MBTI 和出生信息用于紫微斗数。明确标注仅供娱乐，不影响专业画像维度。

---

## 支持哪些 AI

Warmstart 生成的是纯文本，不绑定任何平台：

| 工具 | 粘贴位置 |
|------|---------|
| ChatGPT | Custom Instructions |
| Claude | System Prompt 或 Project Knowledge |
| Cursor / Windsurf | `.cursorrules` / `.windsurfrules` |
| Hermes | `SOUL.md` |
| 任何 AI | 对话开头或 system prompt |

---

## 方法说明

详见 [docs/profile-dimensions.md](docs/profile-dimensions.md)，包含每个偏好维度的详细说明：
- 测量什么
- 为什么影响 AI 协作
- 如何转换成系统提示词
- 有什么局限

> ⚠️ 这不是心理测验或人格测评工具，而是结构化的 AI 偏好收集工具。

---

## Python 包说明

仓库中的 `warmstart/` Python 包为旧版实现（v0.6），基于 5 题量表设计，不支持当前网页版的专业/实验模式拆分。**网页版（`index.html`）是当前主版本。** Python 包保留用于参考和向后兼容，后续计划同步模式逻辑。

---

## 隐私

**所有数据完全在浏览器本地处理。** 不会上传到任何服务器。不使用 Cookie、第三方 API 或分析工具。localStorage 仅用于保存中文/英文界面语言偏好。问卷答案、出生信息、MBTI、生成结果均只保存在当前页面内存中，关闭页面后数据消失。

详见 [PRIVACY.md](PRIVACY.md)。

---

## 许可

MIT © 2026 Diandian

---

[English](README.md)
