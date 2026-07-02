"""
Hermes Warmstart — 画像引擎

核心能力：
  1. 从量表答案生成 PersonalityProfile
  2. 将画像翻译为 agent 可执行的行为指令
  3. 生成可注入 system prompt 的完整模块
"""

from dataclasses import dataclass, field
from typing import Optional

from .scales import BigFiveScale, DIMENSION_LABELS, DIMENSION_INSTRUCTIONS


@dataclass
class PersonalityProfile:
    """5维人格画像 + 可选的命盘时间轴"""

    conscientiousness: float = 0.5
    extraversion: float = 0.5
    openness: float = 0.5
    neuroticism: float = 0.5
    agreeableness: float = 0.5
    ziwei_profile: Optional[dict] = None

    # -------------------------------------------------------
    # 自然语言描述
    # -------------------------------------------------------

    def describe(self) -> str:
        parts = []
        for dim, key in [
            ("conscientiousness", self.conscientiousness),
            ("extraversion", self.extraversion),
            ("openness", self.openness),
            ("neuroticism", self.neuroticism),
            ("agreeableness", self.agreeableness),
        ]:
            labels = DIMENSION_LABELS[dim]
            if key >= 0.7:
                parts.append(labels["high"])
            elif key <= 0.3:
                parts.append(labels["low"])
            else:
                parts.append(labels["mid"])
        return "".join(parts)

    # -------------------------------------------------------
    # Agent 行为指令
    # -------------------------------------------------------

    def _pick_instruction(self, dim: str, value: float) -> str:
        inst = DIMENSION_INSTRUCTIONS[dim]
        if value >= 0.7:
            return f"- {inst['high']}"
        return f"- {inst['low']}"

    def to_agent_instructions(self) -> str:
        lines = []
        for dim in ["conscientiousness", "extraversion", "openness", "neuroticism", "agreeableness"]:
            lines.append(self._pick_instruction(dim, getattr(self, dim)))
        return "\n".join(lines)

    # -------------------------------------------------------
    # System Prompt 模块
    # -------------------------------------------------------

    def to_system_prompt_block(self) -> str:
        return f"""## 用户画像（冷启动先验）

{self.describe()}

### 对话适配指令
{self.to_agent_instructions()}

### 画像说明
以上画像由快速评估生成，是初始先验，不是固定标签。
在对话过程中持续观察用户行为，当实际表现与画像不一致时，以实际表现为准。
此画像的置信度为中等，预计需要3-5轮对话修正到稳定状态。
"""

    # -------------------------------------------------------
    # 序列化
    # -------------------------------------------------------

    def to_dict(self) -> dict:
        return {
            "conscientiousness": round(self.conscientiousness, 2),
            "extraversion": round(self.extraversion, 2),
            "openness": round(self.openness, 2),
            "neuroticism": round(self.neuroticism, 2),
            "agreeableness": round(self.agreeableness, 2),
        }

    @classmethod
    def from_answers(cls, answers: list[int], scale=None) -> "PersonalityProfile":
        """从量表答案生成画像"""
        if scale is None:
            scale = BigFiveScale()
        scores = scale.parse_answers(answers)
        return cls(**scores)

    @classmethod
    def from_scores(cls, scores: dict, **kwargs) -> "PersonalityProfile":
        """从分数字典生成画像（缺失维度用默认值 0.5）"""
        defaults = {
            "conscientiousness": 0.5,
            "extraversion": 0.5,
            "openness": 0.5,
            "neuroticism": 0.5,
            "agreeableness": 0.5,
        }
        defaults.update(scores)
        defaults.update(kwargs)
        return cls(**defaults)


# ============================================================
# 工厂函数
# ============================================================

def create_profile(answers: list[int]) -> PersonalityProfile:
    """5题 → 画像（最简调用）"""
    return PersonalityProfile.from_answers(answers)


def create_warmstart_prompt(answers: list[int], memory_text: str = "") -> str:
    """端到端：5题 → system prompt 模块 + 可选记忆"""
    profile = create_profile(answers)
    base = profile.to_system_prompt_block()

    if memory_text:
        memory_block = f"""## 对话记忆（仅记录事件和修正项）
{memory_text}

注意：以上记忆用于补充事件背景，用户的行为偏好已在画像中定义，勿从记忆重复推断。"""
    else:
        memory_block = "## 对话记忆\n（新用户，尚无对话历史）"

    return base + "\n" + memory_block
