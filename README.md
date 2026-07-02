# Warmstart

AI agent 冷启动用户画像工具。通过场景选择 + 快速量表，生成结构化用户画像，注入 agent 的 system prompt，让 agent 在首轮对话中具备基本的用户适配能力。

支持 Hermes · Claude · Cursor · OpenCode · Windsurf · ChatGPT 及任何接受 system prompt 的 AI 工具。

[![Python 3.9+](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/tests-52%20passed-brightgreen.svg)](tests/)

---

## 解决什么问题

大多数 AI agent 在首次对话时对用户一无所知，需要 3-5 轮对话才能逐步适配。Warmstart 通过预设画像，给 agent 一个方向性的起点。

| | 无画像 | 使用 Warmstart |
|---|---|---|
| 首轮适配 | 无 | 有基础画像 |
| 用户信息来源 | 对话中逐步采集 | 场景选择 + 量表快速获取 |
| 画像结构 | 扁平文本 | 5 维度结构化 |

注意：Warmstart 提供的是**初始先验**，不是精确画像。agent 在后续对话中应持续修正。

---

## 快速开始

### 网页版（无需安装）

打开 https://diandian1001.github.io/hermes-warmstart/ ，选择场景、回答 4 题、复制画像。

### Python 包

```bash
pip install git+https://github.com/diandian1001/warmstart.git
```

```bash
# 交互式评估
python -m warmstart.prompt

# 自动写入配置文件
python -m warmstart.prompt --auto

# 写入指定文件
python -m warmstart.prompt --output CLAUDE.md

# 查看支持的平台
python -m warmstart.prompt --list-platforms
```

```python
from warmstart import create_warmstart_prompt

answers = [0, 1, 2, 0, 1]
module = create_warmstart_prompt(answers)
# → 返回可注入 system prompt 的文本模块
```

---

## 支持的平台

| 平台 | 自动检测 | 配置文件 |
|------|---------|---------|
| Hermes Agent | ✅ | `~/.hermes/SOUL.md` |
| Claude Desktop / Code | ✅ | `~/CLAUDE.md` |
| Cursor | ✅ | `.cursorrules` |
| OpenCode | ✅ | `~/.opencode/AGENTS.md` |
| Windsurf | ✅ | `.windsurfrules` |
| ChatGPT | ✅ | `~/.chatgpt/custom_instructions.md` |
| 其他 | — | `--output <文件路径>` |

---

## 设计理念

Warmstart 基于大五人格模型的 5 题快速版，将用户偏好映射为 agent 可执行的行为指令。

5 个维度及其对应的 agent 行为差异：

| 维度 | 高分 | 低分 | Agent 差异 |
|------|------|------|-----------|
| 尽责性 | 计划型 | 灵活型 | 先给框架 vs 先给结论 |
| 外向性 | 关系型 | 直接型 | 建立连接 vs 简洁高效 |
| 开放性 | 创新型 | 经验型 | 多样方案 vs 成熟方法 |
| 情绪敏感度 | 敏感型 | 稳定型 | 先共情 vs 直接分析 |
| 宜人性 | 合作型 | 独立型 | 征求意见 vs 尊重判断 |

命盘时间轴功能（紫微斗数排盘）正在开发中，届时将在量表画像基础上叠加时间维度。

---

## 项目结构

```
warmstart/
├── warmstart/
│   ├── __init__.py
│   ├── profile.py       # 画像引擎
│   ├── scales.py        # 量表定义（大五 + 可扩展接口）
│   └── prompt.py        # CLI + 平台检测
├── tests/
│   └── test_profile.py
├── examples/
│   └── walkthrough.md
├── templates/
│   └── system_prompt_template.txt
├── docs/
│   └── ziwei-reference.md
├── web/
│   └── index.html       # 网页版
├── CONTRIBUTING.md
├── LICENSE
└── pyproject.toml
```

---

## 扩展

实现 `Scale` 协议即可添加新量表：

```python
from warmstart import Scale, PersonalityProfile

class MyScale(Scale):
    @property
    def questions(self) -> list[dict]:
        return [...]

    def parse_answers(self, answers: list[int]) -> dict:
        ...

profile = PersonalityProfile.from_answers(answers, scale=MyScale())
```

---

## FAQ

**Q: 5 道题够准吗？**
A: 不够。这是初始先验，不是最终画像。agent 应在后续对话中持续修正。目的是给 agent 一个方向，而不是精确画像。

**Q: 能替代完整的大五人格量表吗？**
A: 不能。5 题版追求低门槛和速度，准确度有限。

**Q: 不输入生辰八字能用吗？**
A: 能。命盘是可选的第二层，量表画像本身已足够。

**Q: 支持哪些 AI？**
A: 任何接受 system prompt 的 AI。已内置 6 个平台的自动检测，其他用 `--output` 手动指定。

---

## 许可

MIT © 2026 Diandian
