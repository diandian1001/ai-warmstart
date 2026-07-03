// ============================================================
// 生成画像（集成命盘 + 术语解释 + MBTI解释）
// ============================================================
function buildPrompt(){
  const qs = SCENE_Q[sceneId];
  const scene = SCENARIOS.find(s=>s.id===sceneId);
  const sceneLabel = scene?scene.label:'未选择';

  // 出生信息
  let birthLine = [];
  if(birth.year) birthLine.push(birth.year+'年');
  if(birth.month) birthLine.push(birth.month+'月');
  if(birth.day) birthLine.push(birth.day+'日');
  if(birth.hour && birth.hour!=='0') birthLine.push(BIRTH_FIELDS.find(f=>f.id==='hour').options[parseInt(birth.hour)]);
  if(birth.gender) birthLine.push('· '+birth.gender);
  const birthStr = birthLine.length?birthLine.join(''):'未填写';
  const hasBirth = birth.year && birth.month && birth.day && birth.hour && birth.gender;

  // 命盘计算
  let ziweiBlock = '';
  if(hasBirth) {
    try {
      const chart = calculateZiwei(
        parseInt(birth.year),
        parseInt(birth.month),
        parseInt(birth.day),
        parseInt(birth.hour),
        birth.gender === '男' ? 'male' : 'female'
      );
      if(chart) {
        const mingExplain = {
          '子': '北方水位，冷静理性，善于分析',
          '丑': '东北土位，稳重踏实，务实保守',
          '寅': '东北木位，开拓进取，有领导力',
          '卯': '东方木位，温和细腻，善解人意',
          '辰': '东南土位，变化多端，适应力强',
          '巳': '南方火位，热情主动，有行动力',
          '午': '南方火位，光明磊落，有影响力',
          '未': '西南土位，温和包容，有耐心',
          '申': '西方金位，果断干练，有决断力',
          '酉': '西方金位，精致细腻，追求完美',
          '戌': '西北土位，忠诚可靠，有责任感',
          '亥': '北方水位，智慧深沉，有洞察力',
        };
        const juExplain = {
          '水二局': '水局：智慧型，善于变通和适应',
          '木三局': '木局：成长型，善于学习和创新',
          '金四局': '金局：执行型，善于坚持和完成',
          '土五局': '土局：稳定型，善于积累和沉淀',
          '火六局': '火局：行动型，善于推动和变革',
        };
        const starExplain = {
          '紫微': '帝星，统御力强，需要辅弼配合',
          '天机': '智星，善于谋略和变化',
          '太阳': '光星，光明博爱，有影响力',
          '武曲': '财星，刚毅果断，执行力强',
          '天同': '福星，温和协调，有亲和力',
          '廉贞': '情绪星，情感丰富，需要调节',
          '天府': '库星，稳重保守，善于积累',
          '太阴': '月星，温柔细腻，有洞察力',
          '贪狼': '欲星，有才华和魅力，需要节制',
          '巨门': '口星，善于表达，但要注意是非',
          '天相': '印星，善于协调，有辅佐力',
          '天梁': '荫星，有长辈缘，善于解厄',
          '七杀': '将星，刚烈果断，有行动力',
          '破军': '变星，善于突破和创新',
        };

        ziweiBlock = `## 命盘快照

> 以下内容基于紫微斗数生成，帮你理解当前的人生阶段和性格基调。

**基本信息：**
- 农历：${chart.lunar}
- 命宫：${chart.ming_gong}宫 — ${mingExplain[chart.ming_gong] || ''}
- 身宫：${chart.shen_gong}宫 — ${mingExplain[chart.shen_gong] || ''}
- 五行局：${chart.wuxing_ju} — ${juExplain[chart.wuxing_ju] || ''}
- 当前大限：${chart.current_da_xian ? chart.current_da_xian.age_range + ' · ' + chart.current_da_xian.gong + '宫' : '未计算'}

**命宫解读：** 你的命宫在${chart.ming_gong}宫，说明你的核心性格特点是${mingExplain[chart.ming_gong] || '需要结合具体星曜分析'}。当前大限在${chart.current_da_xian ? chart.current_da_xian.gong + '宫' : '未知'}，意味着这个阶段你的人生课题与${chart.current_da_xian ? chart.current_da_xian.gong + '宫相关' : '需要更多信息判断'}。

**主星分布：**
`;
        for(const [name, info] of Object.entries(chart.palaces)) {
          if(info.main_star) {
            const stars = info.main_star.split('/');
            const explain = stars.map(s => starExplain[s] || s).join(' + ');
            ziweiBlock += `- ${name}宫（${info.ganzhi}）：${info.main_star} — ${explain}\n`;
          }
        }
        ziweiBlock += '\n';
      }
    } catch(e) {
      console.error('命盘计算失败:', e);
    }
  }

  // 通用维度
  let universal = [];
  UNIVERSAL_Q.forEach((q,i)=>{
    const a = universalAnswers[i];
    if(a===undefined||a===null||a===-1) universal.push({badge:q.badge,val:'未填写'});
    else universal.push({badge:q.badge,val:q.opts[a].v});
  });

  // 场景维度
  let dims = [];
  qs.forEach((q,i)=>{
    const a = sceneAnswers[i];
    if(a===undefined||a===null||a===-1) dims.push({badge:q.badge,val:'未填写'});
    else if(typeof a==='string') dims.push({badge:q.badge,val:a});
    else dims.push({badge:q.badge,val:q.opts[a].v});
  });

  // MBTI映射
  let mbtiTraits = [];
  if(birth.mbti && MBTI_MAP[birth.mbti]){
    const m = MBTI_MAP[birth.mbti];
    mbtiTraits = [m.e, m.i||m.s, m.t||m.f, m.j||m.p];
  }

  // 组装
  let prompt = `# AI 画像 · ${sceneLabel}

## 用户背景
- 出生信息：${birthStr}
- 使用场景：${sceneLabel}

`;

  // 命盘快照（优先级最高）
  if(ziweiBlock) prompt += ziweiBlock;

  // 通用维度
  prompt += `## 通用偏好\n`;
  universal.forEach(u=>{
    prompt += `- ${u.badge}：${u.val}\n`;
  });
  prompt += '\n';

  // 场景维度
  dims.forEach(d=>{
    prompt += `## ${d.badge}\n${d.val}\n\n`;
  });

  // MBTI补充（含解释）
  if(mbtiTraits.length){
    const mbtiExplain = {
      'I': '内向型 (Introversion)：从独处中获得能量，喜欢深度思考',
      'E': '外向型 (Extraversion)：从社交中获得能量，喜欢互动交流',
      'N': '直觉型 (iNtuition)：关注可能性和抽象概念，善于联想',
      'S': '实感型 (Sensing)：关注具体事实和细节，脚踏实地',
      'T': '思考型 (Thinking)：基于逻辑和客观分析做决定',
      'F': '感受型 (Feeling)：基于价值观和他人感受做决定',
      'J': '判断型 (Judging)：喜欢有计划、有条理的生活方式',
      'P': '感知型 (Perceiving)：喜欢灵活、随性的生活方式',
    };

    prompt += `## MBTI 补充参考

> MBTI（迈尔斯-布里格斯类型指标）是一种性格分类工具，将人的性格分为16种类型。
> 每种类型由4个维度组成：能量来源(I/E)、信息获取(N/S)、决策方式(T/F)、生活方式(J/P)。

**类型：** ${birth.mbti}

**维度解读：**
`;
    for(const trait of mbtiTraits) {
      const key = trait.charAt(0);
      if(mbtiExplain[key]) {
        prompt += `- ${mbtiExplain[key]}\n`;
      }
    }
    prompt += `
> ⚠️ 以上为性格背景参考，优先级低于场景维度的回答。
> 如果场景回答与 MBTI 推断有冲突，以场景回答为准。

`;
  }

  prompt += `---
> 本画像由 Warmstart v0.6.2 生成，复制到任何 AI 的 system prompt 中即可生效。
> 如果 AI 不理解命盘术语或 MBTI 类型，可以参考上方的解读说明。
`;
  return prompt;
}
