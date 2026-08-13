---
name: sdd-orchestrate
description: SDD 总控。按改动规模(blast-radius)判档,决定走轻档直接动手,还是把 discover-spec →(spec + 风格参考 → 外部设计工具)→ tech-spec(技术方案 + 落地计划,自带两道确认门)串成带 review gate 的流程,并做跨阶段对抗式评审。Use when the user wants to run the whole build pipeline end to end, or to decide how heavy a process a change deserves. 触发词:整个流程 / 端到端 / 一把跑完 / 这个改动要走多重 / 编排 / orchestrate / 全流程 / 帮我从头到尾。
---

# sdd-orchestrate · 三阶段总控

把需求→设计→技术串成一条带 gate 的流水线,并先判断"这个改动到底值不值得走完整流程"。核心价值是**右尺寸**:别用大流程碾小改动,也别让大改动裸奔。

## 启动

1. 读 `CONSTITUTION.md`(尤其第 6 条:右尺寸逃生口)。
2. 先 right-sizing 判档,再决定 phase mask。

## Right-sizing(借 ecc orch-pipeline)

按三个信号取**最高档**:

| 信号 | 轻 | 重 |
| --- | --- | --- |
| 改动文件数 | 几个 | 多模块 |
| 是否新增接口契约 | 否 | 是 |
| 设计是否模糊 | 清晰 | 模糊 / 全新 |

- **trivial 档**:三信号全轻 → 允许跳过派生文档,直接动手(给逃生口,别过度工程)。
- **standard 档**:中等 → spec → UI 出设计交外部工具 → `tech-spec`(深度按需收:做到「架构 + 复用清单 + 关键接口 + 任务计划」即可,ADR 与完整契约可略)。
- **large 档**:任一为重 → spec → 外部设计工具 → `tech-spec` 做满(ADR + 完整数据模型与契约);关键 gate 不可压缩。

`tech-spec` 自带两道用户确认门(技术方案确认 / 计划确认),编排时把它们当作本流水线的 gate,不要另起一道重复的门。

明确告诉用户判到哪档、为什么、将跑哪几段(phase mask)。

## 串流水线(gated pipeline)

按 phase mask 依次:`discover-spec` →(spec + 风格参考 → 外部 AI 设计工具)→ `tech-spec`(技术方案 + 落地计划,一步做完)→ 移交实现,每段之间:

- 产物落 `docs/sdd/<slug>/`,**停下请用户 review + 批准**(HARD-GATE,不可压缩)。
- 下游只接受上游已批准的产物为输入。
- **User Sovereignty**:你给推荐和判断,**决定权永远在用户**。不替用户拍板跨阶段的取舍。

## 对抗式评审(借 ecc GAN evaluator,可选)

每个阶段产物可过一道"严格挑刺"评审(bounded iterations + 通过阈值):设计阶段对照 spec 逐条挑、技术阶段对架构逐条质疑。挑出的问题回灌给对应阶段 skill 修,而不是放行。

## 结束

三段跑完、全部 gate 通过 → 移交实现流程。给用户一张总览:slug、走了哪几段、每段产物路径、还有哪些 `[NEEDS CLARIFICATION]` 未清。
