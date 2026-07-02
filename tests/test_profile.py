"""
Hermes Warmstart — 完整测试套件
"""
import sys
import os
import json
import pytest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from warmstart import (
    PersonalityProfile, create_profile, create_warmstart_prompt,
    BigFiveScale, BIG_FIVE_QUESTIONS,
)
from warmstart.scales import DIMENSION_LABELS, DIMENSION_INSTRUCTIONS


# ============================================================
# 量表结构
# ============================================================

class TestScaleStructure:
    """量表定义完整性"""

    def test_five_questions(self):
        assert len(BIG_FIVE_QUESTIONS) == 5

    def test_each_question_has_three_options(self):
        for q in BIG_FIVE_QUESTIONS:
            assert len(q["options"]) == 3, f"{q['id']} 选项数不对"

    def test_each_question_has_score_range(self):
        for q in BIG_FIVE_QUESTIONS:
            scores = [o["score"] for o in q["options"]]
            assert any(s >= 0.9 for s in scores), f"{q['id']} 缺少高分区"
            assert any(s <= 0.3 for s in scores), f"{q['id']} 缺少低分区"

    def test_bigfive_scale_interface(self):
        scale = BigFiveScale()
        assert len(scale.questions) == 5
        result = scale.parse_answers([0, 1, 2, 0, 1])
        assert "conscientiousness" in result
        assert result["conscientiousness"] == 1.0


# ============================================================
# Profile 生成
# ============================================================

class TestProfileGeneration:
    """画像生成正确性"""

    def test_from_answers_extreme_high(self):
        p = PersonalityProfile.from_answers([0, 0, 0, 0, 0])
        assert p.conscientiousness == 1.0
        assert p.openness == 1.0

    def test_from_answers_extreme_low(self):
        p = PersonalityProfile.from_answers([1, 1, 1, 1, 1])
        assert p.conscientiousness == 0.3
        assert p.extraversion == 1.0
        assert p.openness == 0.2
        assert p.neuroticism == 0.2
        assert p.agreeableness == 1.0

    def test_from_scores_with_defaults(self):
        p = PersonalityProfile.from_scores({"conscientiousness": 0.8})
        assert p.conscientiousness == 0.8
        assert p.openness == 0.5  # default

    def test_from_answers_default_scale(self):
        p = PersonalityProfile.from_answers([2, 2, 2, 2, 2])
        assert p.conscientiousness == 0.6
        assert p.agreeableness == 0.6

    def test_create_profile_shortcut(self):
        p = create_profile([0, 1, 2, 0, 1])
        assert isinstance(p, PersonalityProfile)


# ============================================================
# describe() 输出
# ============================================================

class TestDescribe:
    """自然语言描述生成"""

    def test_describe_non_empty(self):
        for answers in [[0,0,0,0,0], [1,1,1,1,1], [2,2,2,2,2], [0,1,2,1,0]]:
            desc = create_profile(answers).describe()
            assert len(desc) > 10, f"describe too short for {answers}"

    def test_conscientiousness_high(self):
        p = PersonalityProfile(conscientiousness=1.0)
        assert "结构" in p.describe()

    def test_extraversion_low(self):
        p = PersonalityProfile(extraversion=0.2)
        assert "简洁" in p.describe()

    def test_neuroticism_mid(self):
        p = PersonalityProfile(neuroticism=0.6)
        assert "短暂" in p.describe()


# ============================================================
# Agent 指令
# ============================================================

class TestAgentInstructions:
    """行为指令生成"""

    def test_five_instructions_always(self):
        for answers in [[0,0,0,0,0], [2,2,2,2,2], [0,1,2,1,0]]:
            inst = create_profile(answers).to_agent_instructions()
            lines = inst.split("\n")
            assert len(lines) == 5, f"expected 5, got {len(lines)} for {answers}"

    def test_high_conscientiousness_instruction(self):
        p = PersonalityProfile(conscientiousness=1.0)
        assert "框架" in p.to_agent_instructions()

    def test_low_conscientiousness_instruction(self):
        p = PersonalityProfile(conscientiousness=0.3)
        assert "结论" in p.to_agent_instructions()


# ============================================================
# System Prompt 模块
# ============================================================

class TestSystemPrompt:
    """System Prompt 生成完整性"""

    def test_contains_required_sections(self):
        p = PersonalityProfile()
        block = p.to_system_prompt_block()
        assert "用户画像" in block
        assert "适配指令" in block
        assert "冷启动先验" in block

    def test_create_warmstart_prompt_no_memory(self):
        prompt = create_warmstart_prompt([2, 2, 2, 2, 2])
        assert "新用户" in prompt

    def test_create_warmstart_prompt_with_memory(self):
        prompt = create_warmstart_prompt([2, 2, 2, 2, 2], memory_text="用户会Python。")
        assert "用户会Python" in prompt
        assert "勿从记忆重复推断" in prompt


# ============================================================
# 序列化
# ============================================================

class TestSerialization:
    """to_dict / json 兼容"""

    def test_to_dict_round_trip(self):
        p = PersonalityProfile(conscientiousness=0.8, openness=1.0, neuroticism=0.2)
        d = p.to_dict()
        assert d["conscientiousness"] == 0.8
        assert d["openness"] == 1.0
        json.dumps(d)  # 不抛异常


# ============================================================
# 穷举：所有答案组合不崩
# ============================================================

class TestExhaustive:
    """穷举测试"""

    def test_all_243_combinations(self):
        from itertools import product
        for combo in product([0, 1, 2], repeat=5):
            p = create_profile(list(combo))
            desc = p.describe()
            inst = p.to_agent_instructions()
            block = p.to_system_prompt_block()
            assert len(desc) > 10
            assert len(inst.split("\n")) == 5
            assert "画像" in block


# ============================================================
# 指令标签完整性
# ============================================================

class TestLabelCompleteness:
    """确保每个维度都有 high/mid/low 标签"""

    DIMS = ["conscientiousness", "extraversion", "openness", "neuroticism", "agreeableness"]

    def test_all_dimensions_in_labels(self):
        for dim in self.DIMS:
            assert dim in DIMENSION_LABELS, f"{dim} missing from DIMENSION_LABELS"

    def test_all_dimensions_in_instructions(self):
        for dim in self.DIMS:
            assert dim in DIMENSION_INSTRUCTIONS, f"{dim} missing from DIMENSION_INSTRUCTIONS"

    def test_all_labels_have_high_mid_low(self):
        for dim in self.DIMS:
            labels = DIMENSION_LABELS[dim]
            assert "high" in labels
            assert "mid" in labels
            assert "low" in labels

    def test_all_instructions_have_high_low(self):
        for dim in self.DIMS:
            inst = DIMENSION_INSTRUCTIONS[dim]
            assert "high" in inst
            assert "low" in inst
