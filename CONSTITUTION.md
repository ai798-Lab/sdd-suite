# SDD Constitution · 不可协商的规则

每个 SDD skill 启动时必须先读本文件并遵守。建议同时用 SessionStart hook 注入为常驻 context,
或在每个项目根放一份副本 `docs/sdd/CONSTITUTION.md`。下游产物违反任一条 = 必须打回,不得继续。

## 1 · 分层铁律(防 AI 提前跳阶段)

- **需求阶段(discover-spec)** 写 WHAT / WHY + 页面与功能(功能,非 UI 视觉)+ 跨切面决策 + **技术方案建议**(架构方向 / 复用现成 GitHub / API 选型,到"知道搭在谁肩膀上"为止)。**不写**:UI 视觉(配色/布局/组件)、完整代码、锁死的实现细节。
- **设计**:不在本套件内手写。交给外部 AI 设计工具:`spec.md + 风格参考 → Claude Design / Open Design / Codex Product Design → 设计稿`。
- **技术阶段(tech-spec,可选·复杂项目)** 把 discover-spec 的技术建议**深化**为可执行蓝图:架构决策(ADR)、数据模型、接口契约、原子任务。solo / 简单项目可跳过,直接 `spec → coding agent`。

> 边界(v0.3):一份够厚的 `spec.md` 是中心。设计交外部工具、开发交 coding agent、深度技术蓝图(tech-spec)只在复杂项目才做。需求阶段给技术方向建议,但不写代码 / 不锁实现 / 不碰 UI 视觉。

一旦看到越界内容(需求里出现 UI 配色/布局/组件、或完整代码),停下并打回。

## 2 · 强制引用(唯一合法输入)

- 外部设计工具、coding agent、`tech-spec` 的唯一合法输入都是已批准的 `spec.md`(及可选的设计稿)。无 `spec.md` 则拒绝开工,先回 discover-spec。
- `tech-spec` 接力 `spec.md` 的「核心技术实现方案」段去深化,不从零另起。
- 每份派生产物在文首用一行声明来源:`> source: docs/sdd/<slug>/spec.md`。
- commit 时引用对应 spec 段落 ID。

## 3 · 未决项必须暴露,不许静默假设

- 任何不确定点写成 `[NEEDS CLARIFICATION: 具体问题]`,逼自己暴露而非猜。
- 从现状 / 代码反推业务真值时,标 `[ASSUMPTION: ...]`,不当事实写入。

## 4 · 阶段间必停 review(HARD-GATE)

- 每个阶段产物落盘后,**停下**,显式请用户 review 并批准,才进下一阶段。
- 不允许一口气从需求冲到代码。这是硬门,不可压缩。

## 5 · 禁止擅自加抽象(Phase -1 gate)

- 新增任何抽象层 / 框架 / 依赖,必须在 `plan.md` 写一段书面 justification。
- 三问:Simplicity(能不能更简单?)/ Anti-Abstraction(这层抽象现在真需要吗?)/ Integration-First(先打通端到端再优化?)。
- 默认走最简方案,YAGNI。

## 6 · 右尺寸逃生口(别过度工程)

- 不是所有任务都值得走完整三段。**改几个文件、无新接口契约、设计不模糊**的小改动,允许跳过派生文档直接动手。
- SDD 对一次性脚本 / 探索性原型是过度工程,给逃生口。
- 由 `sdd-orchestrate` 按 blast-radius(改动文件数 / 是否新增契约 / 设计是否模糊,取最高档)判档,或用户显式声明"轻档"。
