---
description: 用 gen-plan 单独重排计划(技术方案已存在时)
argument-hint: [项目 slug,留空用当前 docs/sdd]
---
用 gen-plan skill 单独重排开发计划。前提是技术方案已经有了(正常流程里排期由 tech-spec 一步做完,这条命令只用于推倒重排:范围砍了 / 加了人手 / 某条并行线切错了 / 想换一种批次划分)。

读已批准的 `spec.md` 与 `plan.md` 里已有的技术方案段(当作既定约束,不许改写),重新拆出独立可验证的原子任务 `tasks.md` + 并行 `[P]` / 串行编排,只覆盖 `plan.md` 的执行计划段。用自带的 `validate-plan.mjs` 自检,停在 HARD-GATE 等我 review。

$ARGUMENTS
