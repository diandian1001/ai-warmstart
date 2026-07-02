"""
Hermes Warmstart — 交互式评估 + System Prompt 注入

用于终端交互：运行 5 道题，生成可直接注入 Hermes 的 system prompt 模块。
"""

from .profile import PersonalityProfile, create_profile, create_warmstart_prompt
from .scales import BigFiveScale, BIG_FIVE_QUESTIONS


def interactive_quiz() -> PersonalityProfile:
    """终端交互式 5 题评估"""
    questions = BIG_FIVE_QUESTIONS

    print("\n" + "=" * 50)
    print("  Agent 画像快速评估（5题）")
    print("=" * 50)
    print("请根据实际情况选择最接近的一项。\n")

    answers = []
    for i, q in enumerate(questions, 1):
        print(f"\n[{i}/5] {q['question']}")
        for j, opt in enumerate(q['options']):
            print(f"  {j+1}. {opt['text']}")
        while True:
            try:
                choice = input("  你的选择 (1/2/3): ").strip()
                idx = int(choice) - 1
                if 0 <= idx <= 2:
                    answers.append(idx)
                    break
            except ValueError:
                pass
            print("  请输入 1、2 或 3")

    profile = create_profile(answers)
    return profile


def generate_hermes_system_prompt_block(answers: list[int]) -> str:
    """生成可直接粘贴到 Hermes system prompt 的画像模块"""
    profile = create_profile(answers)
    return profile.to_system_prompt_block()


# ============================================================
# CLI 入口
# ============================================================

def main():
    """命令行入口：交互 → 生成 → 打印"""
    import json
    print("=" * 60)
    print("  Hermes Warmstart — Agent 冷启动画像生成器")
    print("  底：大五人格快速量表 | 壳：紫微斗数命盘（预留）")
    print("=" * 60)

    profile = interactive_quiz()

    print("\n" + "=" * 60)
    print("  生成结果")
    print("=" * 60)
    print(f"\n【画像分数】{json.dumps(profile.to_dict(), ensure_ascii=False)}")
    print(f"\n【自然语言画像】\n{profile.describe()}")
    print(f"\n【Agent行为指令】\n{profile.to_agent_instructions()}")
    print(f"\n【完整 System Prompt 模块】\n{profile.to_system_prompt_block()}")

    print("\n" + "=" * 60)
    print("  使用方法")
    print("=" * 60)
    print("""
  将上面的「完整 System Prompt 模块」复制到 Hermes 的
  system prompt 或 SOUL.md 中即可。新用户首次对话就能获得
  个性化的 agent 适配。

  进阶：如果用户提供生辰八字，可在画像基础上叠加命盘时间轴，
  获得大限/流年驱动的动态画像（此功能待开发）。
""")


if __name__ == "__main__":
    main()
