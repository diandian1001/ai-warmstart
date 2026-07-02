"""
Hermes Warmstart — 量表定义模块

可扩展的量表接口：
  - 内置：大五人格 5题快速版
  - 预留：MBTI、DISC、紫微斗数等
"""

from dataclasses import dataclass, field
from typing import Protocol, runtime_checkable


# ============================================================
# 量表协议
# ============================================================

@runtime_checkable
class Scale(Protocol):
    """量表协议：任何量表需提供 questions 和解析方法"""

    @property
    def questions(self) -> list[dict]:
        """返回问题列表，每个问题含 id/name/question/options"""
        ...

    def parse_answers(self, answers: list[int]) -> dict:
        """将答案索引列表转为维度名→分数映射"""
        ...


# ============================================================
# 大五人格 5题快速版
# ============================================================

BIG_FIVE_QUESTIONS = [
    {
        "id": "conscientiousness",
        "name": "做事风格",
        "question": "面对一个新任务，你通常怎么做？",
        "options": [
            {"text": "先列计划、分步骤，确保每个环节都有数", "score": 1.0, "label": "计划型"},
            {"text": "大概有个方向就开始，边做边调整", "score": 0.3, "label": "灵活型"},
            {"text": "看情况，重要的事会先计划", "score": 0.6, "label": "中间型"},
        ],
    },
    {
        "id": "extraversion",
        "name": "沟通偏好",
        "question": "和别人沟通时，你更倾向于？",
        "options": [
            {"text": "直来直去，说重点就行", "score": 0.2, "label": "直接型"},
            {"text": "先寒暄几句，关系融洽了再谈正事", "score": 1.0, "label": "关系型"},
            {"text": "看对象，熟人就直说，不熟就多铺垫", "score": 0.6, "label": "中间型"},
        ],
    },
    {
        "id": "openness",
        "name": "思维方式",
        "question": "遇到一个难题，你倾向于？",
        "options": [
            {"text": "尝试全新的方法，哪怕冒险", "score": 1.0, "label": "创新型"},
            {"text": "用之前验证过的成熟方法", "score": 0.2, "label": "经验型"},
            {"text": "看问题的性质，新问题用新方法", "score": 0.6, "label": "中间型"},
        ],
    },
    {
        "id": "neuroticism",
        "name": "情绪反应",
        "question": "当事情进展不顺时，你通常？",
        "options": [
            {"text": "容易焦虑，需要有人肯定方向是对的", "score": 1.0, "label": "敏感型"},
            {"text": "不太受影响，直接分析问题在哪", "score": 0.2, "label": "稳定型"},
            {"text": "会短暂焦虑但能很快调整", "score": 0.6, "label": "中间型"},
        ],
    },
    {
        "id": "agreeableness",
        "name": "决策方式",
        "question": "做重要决定时，你更依赖？",
        "options": [
            {"text": "自己的判断和分析", "score": 0.2, "label": "独立型"},
            {"text": "多听几个人的意见再定", "score": 1.0, "label": "合作型"},
            {"text": "自己判断为主，但会参考信任的人的意见", "score": 0.6, "label": "中间型"},
        ],
    },
]


class BigFiveScale:
    """大五人格快量表"""

    @property
    def questions(self) -> list[dict]:
        return BIG_FIVE_QUESTIONS

    def parse_answers(self, answers: list[int]) -> dict:
        scores = {}
        for i, q in enumerate(BIG_FIVE_QUESTIONS):
            idx = answers[i]
            scores[q["id"]] = q["options"][idx]["score"]
        return scores


# ============================================================
# 维度标签（用于生成自然语言描述）
# ============================================================

DIMENSION_LABELS = {
    "conscientiousness": {
        "high": "做事有计划，喜欢结构和步骤。",
        "low": "做事灵活，边做边调整，不喜欢被固定流程束缚。",
        "mid": "做事有一定计划性，但也接受灵活调整。",
    },
    "extraversion": {
        "high": "沟通中注重关系建立，喜欢先建立融洽感再谈正事。",
        "low": "沟通风格直接，喜欢简洁、直奔主题。",
        "mid": "沟通风格会根据对象调整，熟人直接，陌生人多铺垫。",
    },
    "openness": {
        "high": "对新事物和新方法接受度高，愿意尝试有风险的方案。",
        "low": "偏好成熟、经过验证的方法，对风险保持谨慎。",
        "mid": "对创新持开放态度，但会根据具体情况判断是否采用。",
    },
    "neuroticism": {
        "high": "对挫折比较敏感，需要得到肯定和方向确认。",
        "low": "情绪稳定，面对挫折时更关注如何解决问题本身。",
        "mid": "会有短暂的情绪波动，但通常能较快恢复理性。",
    },
    "agreeableness": {
        "high": "习惯综合多方意见后再做决定，重视他人的看法。",
        "low": "决策时更依赖自己的判断，较少参考他人意见。",
        "mid": "有自己的判断，也会参考信任之人的意见。",
    },
}

DIMENSION_INSTRUCTIONS = {
    "conscientiousness": {
        "high": "输出时先给框架和步骤，再给具体内容",
        "low": "输出时先给结论，再给推导过程",
    },
    "extraversion": {
        "high": "适当加入回应性语言，在对话中建立连接感",
        "low": "保持简洁，减少寒暄和客套话",
    },
    "openness": {
        "high": "多提供新思路和替代方案，不局限于最常规的答案",
        "low": "优先给出已验证的成熟方案，减少不确定的选项",
    },
    "neuroticism": {
        "high": "反馈时先肯定再给建议，避免直接否定用户的判断",
        "low": "直接给出分析和建议，不需要过多情绪缓冲",
    },
    "agreeableness": {
        "high": "适时征求用户意见，保持双向沟通节奏",
        "low": "尊重用户的独立判断，不要频繁追问'你觉得呢'",
    },
}
