# sdd-suite

> 一套帮你把"我想做个 X"逼成一份 **AI 照着能干、不跑偏**的 `spec.md` 的 Claude Code / Codex skill 套件。
> 核心就一件事:把模糊想法,变成一份**厚到能直接交给设计工具出 UI、交给 coding agent 写代码**的需求方案文件。

集 9 个开源 AI-skill 仓库之长 + 原创补齐它们的共同盲区(技术架构方案)。出处见 [`reference-library.md`](reference-library.md)。

---

## 它解决什么(说人话)

AI 写代码、AI 出设计稿,已经不是瓶颈了。**瓶颈是你没想清楚要什么**:你给一句模糊的话,工具就凭空脑补细节,然后越跑越偏,等你发现已经返工一大片。

这套东西不替你写代码、不替你出图,它做的是**前面那一步**:逼你(在它帮助下)把脑子里那团模糊想法,变成一份具体到"换一个零上下文的工具/agent 照着做也不跑偏"的 `spec.md`。

一句话:**它把"想清楚"这件事文件化了。一份 spec.md,就是后面所有工具的唯一输入。**

## 它怎么工作

主流程就四步:

```
想法
 │
 ▼  sdd-router  判断你在哪一步、送进对的门
 │
 ① discover-spec ─────────► spec.md        需求:做什么、给谁、凭什么算做完
 │                            ⏸ 你 review、点头
 │
 ② 设计 ── spec + 参考 design.md + 风格偏好 ─► Codex Product Design / Open Design ─► design.md + 设计稿
 │
 ③ tech-spec ─────────────► 技术方案 + 落地计划   一步做完,中间两道确认门
 │                            自主调研选型 / 架构 / 数据模型 / 接口契约 / 四维自检
 │                            ⏸ 门 1:大白话讲清方案,你点头
 │                            tasks.md + plan.md(原子任务 + 并行编排)
 │                            ⏸ 门 2:讲清几批、哪些能同时开、每步产出什么,你点头
 │
 ④ 开发 ── 全部文件 ─► coding agent / worktree 并行执行

 旁挂:gen-plan  方案不变、只想重排计划时才调
```

**关键:顺序不能颠倒。** 需求定了才知道要设计什么;设计定了才知道要几个接口、什么数据模型;技术方案定了才知道任务怎么拆、什么能并行。先定技术栈再画页面,一定返工。

**为什么第三步不再拆成两趟**:任务怎么切、什么能并行,完全由技术方案决定。分成两个 skill 跑,中间要重读一遍上下文,还容易排出跟方案对不上的任务。合成一步,靠两道确认门保证你不被架空。

## 写完 spec 之后,下一步怎么接

### 出设计稿(每个 web/App 项目都要)

两条路,差别只在一个输入:**有没有参考**。执行工具与产出相同。

```
路径 A(推荐)  spec.md + 参考 design.md + 你的风格偏好
路径 B         spec.md + 你的风格偏好 + 一个设计 skill
   │
   ▼  Codex Product Design 插件 / Open Design(+ 本地 coding agent)
design.md + 设计稿
```

**DESIGN.md 是现在的事实标准**:一份描述配色 / 字体 / 间距 / 圆角 / 动效的 markdown,Claude Code、Codex、Cursor 都能直接读。

参考 design.md 从哪来:
- 货架上挑:[awesome-design-md](https://github.com/VoltAgent/awesome-design-md)(按行业分类,免费)、[getdesign.md](https://getdesign.md/)(300+ 站点带设计理由)
- 自己扒一份:[designmd.me](https://designmd.me/)(粘 URL 抽真实 computed style)、[design-md-chrome](https://github.com/bergside/design-md-chrome)(Chrome 扩展,免费)

路径 B 的设计 skill 三选一:[frontend-design](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md)(先想再写,Anthropic 官方)、[UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)(84 风格 / 192 配色)、[Impeccable](https://github.com/pbakaus/impeccable)(59 条反模式 lint)。

找真实参考:[Mobbin](https://mobbin.com/)(60 万+ 真实产品截屏,有 MCP 可让 agent 直接检索)。

- **为什么不在 suite 里手写 design.md**:AI 设计工具直接生成真实视觉,比手写 token 表强;spec 已经给了它们要的一切(页面与功能清单 + 品牌 + 真实文案),你只需再补参考与偏好。视觉品味是 spec 不该管、也管不了的。
- **拿到产出后,对照这张反 AI-slop 清单过一眼**(命中就让工具重做或自己调):
  - AI 默认靛蓝 / 紫渐变(`#6366f1` 一类)、SaaS 模板味的蓝→青渐变
  - 纯黑 `#000` 做正文、字号层级糊成一团
  - 无意义 emoji 当装饰、假指标(无来源的 "10x")、千篇一律三卡片 + 渐变大标题
  - 所有东西等距、没主次、没呼吸

### 出技术方案与开发计划(设计稿之后,一步做完)

```
spec.md + 设计稿
   │
   ▼  tech-spec
技术选型矩阵 + ADR + data-model.md + contracts/ + 四维自检
   ⏸ 确认门 1 · 大白话讲清方案,你点头才继续
tasks.md  ← 原子任务:每条一个动作 + 精确文件路径 + 能跑的完成判据 + 回指 AC
plan.md   ← 并行 [P] / 串行编排 + 批次 gate + 关键路径
   ⏸ 确认门 2 · 讲清几批、哪些能同时开、每步产出什么,你点头才交开发
```

tech-spec 做四件 spec 不做的事:

- **自主调研、自主选型**:逐个功能去 GitHub 搜现成项目、去 WebSearch 搜托管服务,按「最近提交 / issue 活跃度 / star / license / 换不换得掉」五条判据筛,**直接给结论和理由,不把候选原样丢给你挑**。用户是小白这件事被写死进 skill 里:技术判断是它的活。
- **落成数据模型与接口契约**:契约先行,前后端才能真并行。
- **四维闸门自检**(上线门槛 / 成本曲线 / 体验与性能 / 稳定性,见 `skills/tech-spec/references/tech-eval-checklist.md`):**这是 skill 自己过的闸,不是给你的判断题**,你只在门 1 看到翻译成人话的结论。
- **排期**:把方案切成文件边界不重叠的原子任务,排成批次。切分铁律只有一条:**两条任务改的文件完全不相交才准并行**。

**两道确认门是这一步的骨架:**

| 门 | 什么时候 | 给你看什么 | 你要做什么 |
| --- | --- | --- | --- |
| 门 1 · 技术方案 | 方案定稿、四维自检全过 | 解决什么问题 / 为什么这么选(每条一句大白话)/ 零用户与一千日活两档月成本 / 有什么风险和取舍 | 点头,或指出「这条我不放心」 |
| 门 2 · 落地计划 | tasks + plan 出来、机器自检通过 | 总共几批几个任务、关键路径多长 / 哪些能同时开工 / 每步做完你能亲自验到什么 | 点头,才移交开发 |

产出能**直接喂并行执行**:每条 `[P]` 开一棵 git worktree,多个 agent 同时跑,批次间做 gate。移交前跑 `validate-plan.mjs` 机器自检:每条任务有文件路径 + 完成判据 + AC 回指、无 placeholder、同批 `[P]` 文件不重叠、有集成冒烟收尾、spec 每条 AC 都被覆盖。六项不过就打回重拆。

### 计划要推倒重排(旁挂,不在主流程)

方案没变、只是范围砍了 / 加了人手 / 某条并行线切错了,用 `gen-plan` 单独重排:它只重写 `tasks.md` 和 `plan.md` 的执行计划段,不动 tech-spec 定下的架构与契约。**正常流程不需要单独跑它。**

### 开发

把 `spec.md` + 设计稿 + `plan.md` / `data-model.md` / `contracts/` / `tasks.md` 一起交给 coding agent(Claude Code 等),按批次照着实现。spec 里的可验收 AC 就是验收清单。

## 套件构成

| skill | 干什么 | 产出 |
| --- | --- | --- |
| `discover-spec` ★ | **主角**。把想法逼成可落地的 spec | `spec.md`(下方详解) |
| `sdd-router` | 入口。判断你在第几步,送进对的门 | 路由到对的 skill |
| `tech-spec` | **主流程第三步**。设计稿之后一步做完技术方案与排期:自主调研选型 + 架构 + 数据模型 + 接口契约 + 四维自检 +(门 1)+ 原子任务与并行编排 +(门 2) | `plan.md` / `data-model.md` / `contracts/` / `tasks.md` |
| `gen-plan` | 旁挂的重排工具。方案不变、只想重新拆任务或换批次划分时单独用 | 重写 `tasks.md` + `plan.md` 执行计划段 |
| `sdd-orchestrate` | 总控:右尺寸判档 + 串成带门流程 | 一条 gated pipeline |
| `CONSTITUTION.md` | 常驻铁律:暴露而非假设 / 必停 review / 拒绝假大空 / 不擅自抽象 | 常驻约束 |

> 设计阶段不再有对应 skill,它交给外部 AI 设计工具(见上)。

## spec.md 长什么样(结构详解)

discover-spec 的产出不是一篇散文需求,是一份**结构化、可验收**的契约。九段,每段都有明确职责和"不许假大空"的硬规则:

| # | 段 | 写什么 | 硬规则 |
| --- | --- | --- | --- |
| 1 | 背景 / 问题 | 具体的谁、在什么真实场景、现在怎么凑合 | 要一个具体的人 + 真实瞬间,不是"大家都需要" |
| 2 | 战略立项 | 核心赌注、最窄切入、护城河、为什么是现在、**放弃阈值(kill-criteria)**、写码前最便宜的证伪动作 | 专家视角,但每条要落地,不许空话 |
| 3 | 产品形态 & 分发 | 按形态路由;**website 强制 SEO + GEO** | 带真实关键词簇 + 真实标题/meta + 可被 AI 引用的答案块 |
| 4 | 品牌与产品体系 | 定位陈述、2 到 3 个命名候选、品牌声音、系统主线 | 每块带真实样例(含"品牌腔 vs 通用腔"对比),不是功能汤 |
| 5 | 页面与功能清单 | 有哪些页 + 每页功能 + 状态(空/加载/付费/错误)+ 对应 AC | 写**功能与内容**,不写 UI 视觉(那是设计工具的活)。**这是设计工具的直接输入** |
| 6 | 跨切面决策 | 多语言 / 平台 / 账号 / 支付 / 隐私 / 未成年人… | 每条:决定 + 理由 + `[已确认]`/`[待确认]`。主动给建议并和用户确认,不静默跳过 |
| 7 | 验收标准 AC | 每条 AC 六要素 + 真实样例 + EARS | 见下 |
| 8 | 核心技术实现方案 | 架构 + **复用的 GitHub 项目(真实链接)** + API 服务选型 + 不造轮子说明 | 真去搜过再写、引真实可点链接;到"小白照着能搭"为止,不写完整代码 |
| 9 | Out of scope / BLOCKER / 未决项 | 明确不做什么、阻塞型未决、普通未决 | 改产品方向的列 BLOCKER,HARD-GATE 前清零 |

> 复刻已验证产品 / 竞品驱动加 feature 时,额外多两段:`复刻范围` + `差异化点`(竞品洞察逐条映射,一条不丢)。

**一条 AC 的样子(六要素 + EARS):**
```
### AC-001 · 测完即给一句"行为预测" (P0)
- 起始条件:用户答完测评
- 触发:提交答卷
- 预期产出:WHEN 提交 THE SYSTEM SHALL 生成结果卡,首行是引用其具体分数的行为预测
- 禁止副作用:不输出与分数无关的通用鸡汤
- 验证方法:两份不同档案各测一次,断言两张卡的预测句可区分
- 示例:Conscientiousness 42 的卡首行 = "You start strong and bail at the messy middle."
- 优先级:P0
```

> **总判据:一个零上下文的工具/agent 照着这份 spec 做,也不会跑偏。** 做不到 = 还不够具体,回炉。
> 还配一个 `validate-spec.mjs` 脚本,机械检查:AC 六要素齐、有真实样例(拒绝假大空)、有页面清单、有技术方案且带真实链接、未决项盘点。

## 安装

### 方式一 · Claude Code 插件(推荐)
```
/plugin marketplace add Sin10874/sdd-suite
/plugin install sdd-suite@sdd-suite
```

### 方式二 · Codex CLI
Codex 原生读 `SKILL.md`(无需 `openai.yaml`)。把 skills 软链到 Codex 全局 skills 目录:
```bash
git clone git@github.com:Sin10874/sdd-suite.git
mkdir -p ~/.codex/skills
for s in sdd-suite/skills/*/; do ln -s "$(pwd)/$s" ~/.codex/skills/"$(basename "$s")"; done
```
新开一个 Codex 会话,skill 按 description 自动匹配加载。也支持**项目级**:把 skills 放进项目的 `.agents/skills/`。官方文档:[developers.openai.com/codex/skills](https://developers.openai.com/codex/skills)

### 方式三 · 手动软链(任意读 ~/.claude/skills 的 agent)
```bash
git clone git@github.com:Sin10874/sdd-suite.git
for s in sdd-suite/skills/*/; do ln -s "$(pwd)/$s" ~/.claude/skills/"$(basename "$s")"; done
```

> 三种装法装的是同一批 `SKILL.md`,纯 markdown,不绑定某个 agent。

## 快速开始

装好后,在任意项目里。**装了 plugin,每个 skill 自动就是一条 slash 命令**(带 `sdd-suite:` 前缀,不用自己封装):
```
/sdd-suite:discover-spec 一个给独立开发者记账的工具    # ① 从零 idea     → spec.md
/sdd-suite:discover-spec 复刻 Truity 做个在线测试站     # ① 对标已验证产品 → spec.md
/sdd-suite:tech-spec                                   # ③ 设计稿之后    → 技术方案 + tasks.md + plan.md
/sdd-suite:gen-plan                                    # 旁挂:只重排计划
```
- 也可以**不打命令**,直接说"帮我写个 X 的 spec",`discover-spec` 会按 description 自动触发。
- 嫌前缀长、或想在 Codex / opencode / Kimi / pi 上也能调起?见下方「短名命令 · 一键装到各 agent」。
- 流程:`discover-spec` 逼问 + 给建议 → 落成 `spec.md` 停下等你 review;点头(web/App 先去外部设计工具出稿)后 `tech-spec` 一步做完技术方案与计划,中间两道确认门,门 2 点头后交给 coding agent / worktree 开干。

## 更新(已经装过旧版的)

v0.5 的变化:**排期职责从 `gen-plan` 并进 `tech-spec`**,一步出技术方案 + 计划,中间加两道用户确认门;`tech-spec` 的调研 pass 硬化成「自主选型、不给用户出技术选择题」;`gen-plan` 保留,降为独立重排工具。按你的装法升级:

- **plugin 装法**:`/plugin update sdd-suite`,再 `/reload-plugins`(或重开会话)。
- **软链装法**:`cd sdd-suite && git pull`。这次没有新增 skill 目录,已软链的直接生效,不用补软链。
- **验证**:说"出技术方案"或"帮我排开发计划",都应该调起 `tech-spec`(而不是 gen-plan),并在方案定稿后停下来用大白话跟你确认。

## 短名命令 · 一键装到各 agent(跨平台)

plugin 的命令强制带 `sdd-suite:` 前缀。想要短命令、或想在 **Codex / opencode / Kimi / pi** 上也能一句话调起,跑这个跨平台安装器:

```bash
bash install-commands.sh            # 检测本机装了哪些 agent,把命令铺到各自目录
bash install-commands.sh --dry-run  # 先看会写哪些文件,不实际改动
```

它检测本机 agent,把 `aliases/` 的四个命令(`ohspec` / `design` / `techspec` / `genplan`)铺到各家正确的目录(格式不兼容的自动转换):

| Agent | 调用 | 怎么铺 |
|---|---|---|
| Claude Code | `/sdd:ohspec` | md 原样 → `~/.claude/commands/sdd/` |
| opencode | `/sdd:ohspec` | md 原样 → `~/.config/opencode/commands/sdd/` |
| Codex | `/prompts:sdd-ohspec` | md → `~/.codex/prompts/`(已 deprecated)+ SKILL.md 软链到 `skills/`(官方推荐) |
| Kimi | `/skill:sdd-ohspec` | 转成 `SKILL.md` → `~/.kimi/skills/` |
| pi | `/sdd-ohspec` | 转格式(`$ARGUMENTS`→`{{input}}`)→ `~/.pi/agent/prompts/` |
| Kiro | 项目内 | steering 文件,需在各项目 `.kiro/steering/` 内装 |
| ZCode | 不适用 | 命令磁盘格式未公开,在 ZCode 内手动保存 |

诚实:**Kimi / pi / Kiro 的命令机制跟 Claude Code 不兼容**,脚本做了格式转换;ZCode 无法文件级分发。命令只是触发对应 skill 的薄壳,对应 skill 没装时用不了。

## 设计思路

为什么收敛成"一份厚 spec + 外部工具",而不是搭一条三段流水线?几个有意识的取舍:

**1 · 一份 spec.md 是中心,不是流水线第一节。**
早期版本是"需求→设计→技术"三段各写一份文件。但实践下来:设计稿现在由 AI 设计工具直接生成(给它 spec + 风格参考即可),代码由 coding agent 直接写。**手写一份 markdown 设计文档、一份技术文档,是夹在中间的弱环节**,工具做得更好。所以把力气全压在 spec 上,让它厚到下游工具不用猜。

**2 · 文件化,而非对话记忆。**
对话会丢、不可 diff、不可审计。`spec.md` 是落盘的契约:能 review、能版本控制、关掉重开不丢、能被任意工具/agent 重新加载。下游对接的是文件,不是聊天记录。

**3 · 拒绝假大空,这套里最关键的一条。**
一份抽象的 spec(只写"生成得体的文案""做好 SEO")等于**把所有具体决策的真空留给下游工具**,它会用默认值和套路填满,出来就是千篇一律的 AI 味。所以每个核心主张都必须有**真实样例**锚住:真文案、真样例数据、真页面内容、真 GitHub 项目链接。反过来也禁"具体的假":不许编一个精确的假数字冒充已核实事实,未实测的标 `[UNVERIFIED-NUMBER]`。具体,是为了约束下游不跑偏。

**4 · 暴露而非假设。**
AI 最危险的失败模式是"自信地脑补一个细节然后当真往下做"。规则反过来:不确定的写成 `[NEEDS CLARIFICATION]`,从现状反推的标 `[ASSUMPTION]`,逼它把不知道的摆到台面上。

**5 · 一道硬门:spec 落盘后停下,等你点头。**
不是三道门,就一道,但这一道不可压缩。spec 是后面一切的源头,源头错了下游全错。所以写完必须你 review 批准,才往设计/开发走。

**6 · 右尺寸,流程是手段不是目的。**
改几个文件的小事,别上这套。`sdd-orchestrate` 按 blast-radius 判档,小事给逃生口直接动手。

**7 · 决定权永远在你。**
skill 给推荐、把最脆弱的假设指给你看,但取舍由你拍板。

## 诚实的局限与适用场景

**适合:**
- solo dev / 独立开发者 / 用 AI 写代码的人,把模糊想法逼成"能交给设计工具和 coding agent"的一份文件。
- 0→1 新产品、复刻已验证产品、给已有产品加功能。

**不适合(别硬用):**
- 一次性脚本 / 纯探索原型:过度工程,直接动手。
- 大型既有代码库里的小修小补:不值当。
- 需要正式合规审计的企业 PRD 流程:这是个人取向的工具,不是企业级文档系统。

**大胆承认的局限:**
- **这是个人作品**,集开源之长 + 原创,**没有大规模实战验证**。别当圣经。
- **`discover-spec` 是被深度打磨过的那一个**;`tech-spec` 在 v0.5 才吸收排期职责、硬化调研 pass、加上两道确认门,**实战验证还少**,用的时候多盯一眼产出,尤其盯它给的选型有没有真链接、真 star、真最近提交。
- **两道确认门只能挡住"你被架空",挡不住"它查错了"**。门 1 给的是大白话结论,你看不出技术对错很正常;真正的兜底是 skill 自己的调研判据与四维自检,以及你在门 1 追问那句"这条你查的链接给我看看"。
- **设计这一环依赖外部工具的质量**(Claude Design / Open Design 等)。suite 只保证把 spec 喂好,出来好不好看,看工具 + 你给的风格参考。
- **gate 靠你**:它会停下来请你 review,但你不 review、催它往下冲,它也会冲。纪律最终在人。

## License

MIT
