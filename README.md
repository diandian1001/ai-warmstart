# Hermes Warmstart

**让 AI Agent 第一次见你就像认识你十年。**

5 道选择题 → 结构化人格画像 → 注入 Agent system prompt → 第 1 轮对话即个性化适配。

不再需要 3-5 轮"试探性对话"让 agent 慢慢学会你是什么样的人。

---

## 问题

AI Agent 冷启动时的核心痛点：

| | 传统 Agent | Warmstart Agent |
|---|---|---|
| 第 1 轮画像覆盖度 | 0-20%（几乎不认识你） | 100%（5 维全有） |
| 达到完全适配需要的轮数 | 3-5 轮 | 第 1 轮 |
| 画像修正方式 | 在扁平文本中追加描述 | 结构化维度数值调整 |

---

## 快速开始

### 安装

```bash
git clone https://github.com/diandian1001/hermes-warmstart.git
cd hermes-warmstart
pip install -e .
```

### 3 行代码生成画像

```python
from warmstart import create_warmstart_prompt

# 5 题答案（每题选 0/1/2）
answers = [0, 1, 2, 0, 1]

# 生成可直接注入 Hermes system prompt 的模块
prompt = create_warmstart_prompt(answers)
print(prompt)
```

### 终端交互式评估

```bash
python -m warmstart.prompt
```

按提示回答 5 道题，自动生成画像。

### 集成到 Hermes

将生成的画像模块粘贴到 Hermes 的 system prompt 或 SOUL.md 中。详见 [Walkthrough](examples/walkthrough.md)。

---

## 设计理念

**"以量表为底，以命盘为壳"**

- **底层：心理学量表**（大五人格快速版）→ 提供可量化的用户画像
- **外壳：紫微斗数命盘** → 提供时间维度的动态变化预测（预留接口）

5 个维度 → 5 条 agent 行为指令：

| 维度 | 高分 | 低分 | Agent 行为差异 |
|------|------|------|---------------|
| 尽责性 | 计划型 | 灵活型 | 先框架 vs 先结论 |
| 外向性 | 关系型 | 直接型 | 建立连接 vs 简洁高效 |
| 开放性 | 创新型 | 经验型 | 多样方案 vs 成熟方法 |
| 情绪稳定性 | 敏感型 | 稳定型 | 先共情 vs 直接分析 |
| 宜人性 | 合作型 | 独立型 | 征求意见 vs 尊重判断 |

---

## 架构

```
┌─────────────────────┐
│  用户输入（5 道题）    │
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│  warmstart/profile   │  ← 人格画像引擎
│  PersonalityProfile  │
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│  warmstart/prompt    │  ← System Prompt 生成
│  to_system_prompt()  │
└─────────┬───────────┘
          ▼
┌─────────────────────────────────────┐
│          Hermes Agent                │
│  ┌─────────────────────────────┐   │
│  │  System Prompt               │   │
│  │  + 用户画像（结构化先验）      │   │
│  │  + 对话记忆（仅事件+修正）     │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## 项目结构

```
hermes-warmstart/
├── warmstart/
│   ├── __init__.py      # 公开 API
│   ├── profile.py       # 画像引擎
│   ├── scales.py        # 量表定义（大五 + 可扩展接口）
│   └── prompt.py        # 交互式评估 + CLI
├── tests/
│   └── test_profile.py  # 25 项测试（含 243 种答案穷举）
├── examples/
│   ├── walkthrough.md   # 完整使用教学
│   └── demo.py          # 演示脚本
├── templates/
│   └── system_prompt_template.txt
├── SKILL.md             # Hermes 一键集成 skill
├── README.md
├── LICENSE
└── pyproject.toml
```

---

## 扩展

### 添加新量表

实现 `Scale` 协议即可：

```python
from warmstart.scales import Scale

class MyScale:
    @property
    def questions(self) -> list[dict]:
        return [...]

    def parse_answers(self, answers: list[int]) -> dict:
        return {"dim1": 0.8, "dim2": 0.3, ...}
```

### 命盘时间轴（开发中）

当用户提供生辰八字时，可在量表画像上叠加命盘时间维度：

- 命宫 → 人格基调
- 大限/流年 → 当前人生阶段 → 预测行为变化方向
- 迁移宫 → 对外交互模式

---

## FAQ

**Q: 5 道题够准吗？**
A: 这是初始先验，不是最终画像。agent 会在后续对话中持续修正。5 道题的目的是让 agent 从 0% 覆盖直接跳到有方向的猜测，比随机好得多。

**Q: 能和大五人格完整量表（50 题）比吗？**
A: 不能。但 5 题版的目的是速度（1 分钟）和低门槛——新用户首次使用 agent 时不会愿意做 50 道题。

**Q: 不输入生辰八字能用吗？**
A: 完全能。命盘是可选的第二层，量表画像本身已经足够用于冷启动。

**Q: 为什么用紫微斗数而不是占星？**
A: 紫微斗数提供的是离散化的命运结构（12 宫 × 14 主星），天然适合作为结构化数据注入 agent。占星的复杂度和模糊性更高，不适合作为机器先验。

---

## 许可

MIT © 2026 Diandian
