# Hermes Warmstart — 完整使用教学

> 从"收到需求"到"用户获得个性化 agent"的完整流程。

---

## 场景

你正在帮一个新用户部署 Hermes agent。用户第一次接触 AI agent，不知道如何描述自己的偏好。

---

## Step 1：5 题快速评估（1 分钟）

告诉用户：

> 「为了让我更好地适配你，请回答 5 道选择题。不需要想太久，选最接近的就好。」

运行：

```bash
python -m warmstart.prompt
```

或直接用代码：

```python
from warmstart import create_warmstart_prompt

# 让用户口头回答 5 题，你填入答案
answers = [0, 1, 0, 2, 0]
# → 计划型、关系型、创新型、稳定型、独立型

profile = create_warmstart_prompt(answers)
```

---

## Step 2：注入 Hermes System Prompt

生成的画像模块长这样：

```
## 用户画像（冷启动先验）

做事有一定计划性，但也接受灵活调整。沟通风格直接，喜欢简洁、直奔主题。
对新事物和新方法接受度高，愿意尝试有风险的方案。
情绪稳定，面对挫折时更关注如何解决问题本身。
做事有计划，喜欢结构和步骤。

### 对话适配指令
- 输出时先给结论，再给推导过程
- 保持简洁，减少寒暄和客套话
- 多提供新思路和替代方案，不局限于最常规的答案
- 直接给出分析和建议，不需要过多情绪缓冲
- 尊重用户的独立判断，不要频繁追问"你觉得呢"

### 画像说明
以上画像由快速评估生成，是初始先验，不是固定标签。
在对话过程中持续观察用户行为，当实际表现与画像不一致时，以实际表现为准。
此画像的置信度为中等，预计需要3-5轮对话修正到稳定状态。
```

**集成方式 A：写入 SOUL.md**

将上面的模块粘贴到 Hermes 的 SOUL.md 文件末尾。

**集成方式 B：写入 Memory**

```python
with open("memory.md", "w") as f:
    f.write(profile)
```

---

## Step 3：首次对话验证

问 agent 一个中性问题，观察回复风格是否匹配画像：

```
用户：「帮我做一个工作选择的分析」

期望（基于计划型+独立型画像）：
  → Agent 先给分析框架，再给结论
  → 简洁直接，不追问
  → 给出具体路径而非空泛建议
```

如果风格不匹配，检查 system prompt 是否正确注入。

---

## Step 4：持续修正画像（3-5 轮后）

对话 3-5 轮后，对照观察到的行为：

```
发现：用户每次做决定都会问"你觉得选哪个好" → 宜人性实际上比评估的高

修正：
  agreeableness: 0.2 → 0.7
  → agent 行为变化：多征求用户意见，保持双向沟通
```

---

## 进阶：激活命盘时间轴

当用户愿意提供生辰八字时：

```python
from warmstart import create_warmstart_prompt
from warmstart.profile import PersonalityProfile

profile = PersonalityProfile.from_scores({
    "conscientiousness": 0.6,
    "extraversion": 0.2,
    "openness": 1.0,
    "neuroticism": 0.35,
    "agreeableness": 0.35,
})

# 附加命盘壳（排盘算法集成中）
# profile.ziwei_profile = ziwei_engine.compute(1999, 12, 25, 6)
```

---

## 常见问题

**Q：用户不知道选哪个答案怎么办？**
A：选中间项（选项 3）。中间型画像不影响 agent 的适配速度——它只是说"这个维度我还不确定，表现为默认行为"。

**Q：画像会不会把 agent 限制死？**
A：不会。画像模块明确写了"当实际表现与画像不一致时，以实际表现为准"。画像是起点，不是终点。

**Q：多用户怎么办？**
A：每个用户独立的画像 profile。可以用 Hermes 的 profile 切换功能为不同用户维护不同画像。
