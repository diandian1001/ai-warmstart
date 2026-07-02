"""
Hermes Warmstart — Agent 冷启动画像系统

以量表为底（心理学量表），以命盘为壳（紫微斗数），
为 AI agent 提供结构化用户画像先验，让新用户首次对话就能获得个性化适配。

Quickstart:
    from warmstart import create_profile, create_warmstart_prompt

    # 5 题答案 [0/1/2]
    answers = [0, 1, 0, 2, 0]
    profile = create_profile(answers)

    # 生成 system prompt 模块
    prompt = create_warmstart_prompt(answers, memory_text="用户擅长数据分析。")

    # 或交互式
    import warmstart.prompt
    warmstart.prompt.main()
"""

from .profile import PersonalityProfile, create_profile, create_warmstart_prompt
from .scales import BigFiveScale, BIG_FIVE_QUESTIONS

__version__ = "0.1.0"
__all__ = [
    "PersonalityProfile",
    "create_profile",
    "create_warmstart_prompt",
    "BigFiveScale",
    "BIG_FIVE_QUESTIONS",
]
