# 参考库 · 9 个大师级 AI-Skill 仓库

本套件的方法来源。给学员对照学习用,不是让你全装,而是知道"哪个长处来自哪里、想深挖去哪看"。
评级:强 / 中 / 弱 / 无,指对"需求 · 设计 · 技术"三阶段的覆盖。

| 仓库 | 物种 | 需求 / 设计 / 技术 | 最该学的一点 |
| --- | --- | --- | --- |
| [obra/superpowers](https://github.com/obra/superpowers) ★226k | 真 skill 工厂 | 中 / 弱 / 中 | SDD 文件链 + HARD-GATE;`description` 铁律(只写 when,不剧透 workflow) |
| [pbakaus/impeccable](https://github.com/pbakaus/impeccable) ★38k | 真 skill 工厂 | 弱 / 强 / 弱 | design-brief 整链:NL→闭词表→9 段 DESIGN.md;init 强制 interview mode |
| [garrytan/gstack](https://github.com/garrytan/gstack) | 真 skill 工厂 | 强 / 强 / 强 | office-hours 六逼问;plan-eng-review 四段 + pre-emit 验证门 |
| [nexu-io/open-design](https://github.com/nexu-io/open-design) ★64k | 真 skill 工厂 | 中 / 强 / 弱 | 三轴正交 + craft.requires 按需注入;anti-slop linter + checklist |
| [affaan-m/ecc](https://github.com/affaan-m/ecc) ★214k | 真 skill 工厂 | 强 / 中 / 强 | intent-driven AC-NNN 六要素;orch-pipeline 右尺寸;GAN 对抗 evaluator |
| [refoundai/lenny-skills](https://github.com/refoundai/lenny-skills) ★1k | 内容库 | 强 / 中 / 弱 | PM 方法论矩阵(writing-prds/working-backwards);固定六段式骨架 |
| [dontbesilent2025/dbskill](https://github.com/dontbesilent2025/dbskill) | 真 skill 工厂(中文) | 中 / 无 / 弱 | 升档闸门;问题说明书五约束;纯路由 + 中文别名 |
| [bergside/design-md-chrome](https://github.com/bergside/design-md-chrome) | 生成器工具 | 弱 / 强 / 无 | 四段纯函数管线 + node assert 当 CI 硬门;信号→打分→置信度→证据 |
| [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) | 素材清单 | 无 / 强而窄 / 无 | token-ref 散文写法(单一真相源);73 份逆向 DESIGN.md 当 few-shot 素材 |

## 三种物种,别混着学

- **真 skill 工厂**(6 个):能 clone 即用、带流程纪律。骨架与纪律从这里偷。
- **内容库 / 素材清单**(2 个,lenny / awesome-design-md):静态 .md,偷内容与范式,别指望它跑。
- **生成器工具**(1 个,design-md-chrome):产 SKILL.md 的工具,偷它的工程骨架。

## 集体盲区 = 本套件的差异化

设计有 4 个强 repo、需求有 3 个,但"为用户从零产出系统架构方案"几乎无人做透。
所以本套件的 **tech-spec 是原创为主**,以 SDD 方法论补九家的共同空洞。

> v0.3 更新:`design-spec` 已移除:设计交给外部 AI 设计工具(Claude Design / Open Design / Codex Product Design),给它 `spec + 风格参考` 即可。上面那几个设计 repo(impeccable / open-design / awesome-design-md)现作为"设计工具背后的方法论"参考保留,它们的反 slop / 闭词表思路已 folded 进 README 的设计交接步。
