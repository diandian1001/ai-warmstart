---
name: hermes-warmstart
description: Use when setting up a new Hermes agent for a user, or when an agent needs faster user adaptation. Run a 5-quick-question personality profile, inject it into the system prompt, and make the agent adapt from round 1 instead of discovering the user over 3-5 rounds of trial dialogue.
version: 0.1.0
author: Diandian & Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [agent, warmstart, personality, onboarding, prompt-engineering]
    related_skills: [hermes-persona-setup, hermes-memory-setup]
---

# Hermes Warmstart — Agent 冷启动画像

## Overview

5 道选择题 → 结构化人格画像 → 注入 system prompt → Agent 第 1 轮即个性化适配。

传统 agent 需要 3-5 轮对话才能了解用户偏好。Warmstart 用量表先验替代这段试探期，让首次对话就有针对性。

设计理念：「以量表为底（大五人格），以命盘为壳（紫微斗数时间轴）」。

## When to Use

- 为新用户部署 Hermes agent
- Agent 回复风格与用户不匹配，需要重新校准
- 多人共用同一个 agent，需要快速切换用户画像
- 用户说「这个 agent 不太懂我」

**Don't use for:**
- 已有大量对话历史的用户（memory 已足够丰富）
- 只需要一次性任务的 agent
- 用户拒绝做评估

## Steps

### Step 1：运行 5 题评估

运行交互式评估或直接用代码生成：

```bash
cd hermes-warmstart && python -m warmstart.prompt
```

完成标准：输出包含「画像分数」和「Agent行为指令」两部分。

### Step 2：将画像注入 Hermes system prompt

两种方式：

**A）注入 SOUL.md**（推荐，影响所有对话）

将生成的「完整 System Prompt 模块」粘贴到 SOUL.md 中。位置建议：在 agent 角色定义之后、对话规则之前。

**B）注入 Memory.md**（影响当前会话）

```bash
python -c "from warmstart import create_warmstart_prompt; print(create_warmstart_prompt([0,1,2,0,1]))" > memory.md
```

完成标准：下一轮对话中 agent 的回复风格明显改变（如：直接型用户收到简洁回复，计划型用户收到框架化输出）。

### Step 3：验证适配效果

用同一个中性问题测试两轮：

```
第一轮（warmstart 已注入）→ 观察 agent 回复风格
第二轮（不注入，基线）     → 对比差异
```

完成标准：warmstart 版本的回复在格式、情绪、信息量上更匹配用户偏好。

### Step 4：持续修正（3-5 轮后）

对比画像和用户实际行为，调整维度分数：

```python
from warmstart import PersonalityProfile

# 更新某个维度
profile = PersonalityProfile.from_scores({
    "agreeableness": 0.7,  # 从 0.2 调高，用户实际更爱征求意见
})
```

完成标准：画像与实际行为偏差 ≤ 0.2 在所有维度上。

## Common Pitfalls

1. **把画像当永久标签。** 画像是先验，对话观察的优先级高于先验。发现偏差时立即调整分数，不要坚持「评估说他是 X」。
2. **一个画像覆盖所有用户。** 多人共用 agent 时需要为每个人维护独立画像。
3. **依赖用户自我报告。** 5 题评估是起点。如果用户的回答被 ta 的「理想自我」扭曲，后续对话中的实际行为更有参考价值。
4. **忘记告诉用户画像是暂时的。** 画像模块中已包含「在对话过程中持续观察……以实际表现为准」的说明，确保它被注入。
5. **混淆量表画像和记忆内容。** 画像负责「用户是什么样的人」，memory 负责「用户经历过什么」。两者互补，勿交叉覆盖。

## Verification Checklist

- [ ] 5 题评估已完成，画像模块已生成
- [ ] 画像已注入 system prompt（SOUL.md 或 memory.md）
- [ ] 下一轮对话的 agent 回复风格与画像一致
- [ ] 用户确认「这个 agent 比之前更懂我」或类似反馈
- [ ] 3-5 轮后检查是否需要修正画像
- [ ] 如有命盘数据，时间轴层已附加（可选）
