# 核心技术实现方案 · 站在现成轮子上,不凭空编

很多用户是小白,光给功能不给"怎么搭"等于把他扔半路。这一段要回答:**这东西技术上怎么搭、搭在谁的肩膀上、哪些买现成的不自己写。**

## 三条铁规

1. **不造轮子(最重要)**:任何功能,先问"有没有现成的能站上去"——开源项目 / 托管服务 / 平台原生能力。自研只留给"现成的都不满足"的核心差异化。
2. **真搜再写**:技术选型必须**真的去 WebSearch + GitHub 查当下情况**再写,给真实项目名 + 可点链接 + 选它的理由(star / 近期维护 / license)。**没搜过、凭记忆、编一个不存在的库 = 假大空技术,打回。** 知识有截止,新东西尤其要查。
3. **到"小白能照着搭"为止,不写完整代码**:给架构 + 选型 + 关键集成点,不贴整页实现代码(那是 build)。

## spec 的「核心技术实现方案」段,写四块

### 1 · 架构(一段话 + 一张文字架构图)

用最主流稳妥的默认,除非需求逼你换。文字架构图举例(按真实需求改):

```
[ 浏览器 ]
   │
[ 前端 + SSR ]  ← 框架(如 Next.js,SEO/GEO 需要 SSR 就用它)
   │
[ 后端 API / Server Actions ]
   │
[ 托管数据库 ]   [ 对象存储 ]   [ 外部 API 服务 ]
                                  ├ auth
                                  ├ 支付
                                  └ AI/TTS/生图…
```

给小白一句"为什么这么搭":如"要做 SEO/GEO,页面得能被爬到,所以用能服务端渲染的框架,而不是纯前端 SPA"。

### 2 · 复用的 GitHub 项目(真实名 + 链接 + 为什么)

对每个非核心功能,找一个现成的能站上去的开源项目 / 模板。**写成:项目名 · 链接 · star/维护情况 · license · 用它来干嘛 · 为什么是它**。
逆向无真人时也要真搜,样例用 `[ILLUSTRATIVE-EXAMPLE]` 标但必须是真实存在的项目。

反例(假大空技术):"用一个开源的认证库" ❌ → 没名字没链接没理由,等于没说。

### 3 · API / 托管服务选型(按功能列,真实服务 + 链接 + 定价量级)

凡是"买现成比自研划算"的能力,列候选 + 推荐 + 为什么 + 定价量级 + 链接。**下面是常见能力的真实服务锚点,用时务必再核实当下最新与定价**(它们会变):

| 能力 | 真实候选(用时核实最新) | 选型提示 |
| --- | --- | --- |
| 认证 Auth | Clerk / Supabase Auth / Auth.js(NextAuth) / WorkOS | 要快用 Clerk;已用 Supabase 就 Supabase Auth;要省钱自托管用 Auth.js |
| 支付 | Stripe / Paddle / Lemon Squeezy | 海外个人怕税务合规 → Paddle/LS 当 Merchant-of-Record 替你交税 |
| 邮件 | Resend / Postmark / SendGrid | 事务邮件 Resend/Postmark 送达率好、DX 好 |
| 数据库 | 托管 Postgres(Neon / Supabase) / PlanetScale | 默认 Postgres;serverless 选 Neon |
| 对象存储 | S3 / Cloudflare R2 / 平台 Blob | R2 出网免费、省钱 |
| LLM | 走统一网关(provider/model 字符串)按需切 | 别硬绑单一 provider |
| TTS 语音 | ElevenLabs / OpenAI TTS / Cartesia / Azure Speech | 拟真音色 ElevenLabs;便宜大规模看 Azure/OpenAI |
| 生图 | Replicate / fal.ai / OpenAI Images / Stability | 跑开源模型用 Replicate/fal;要快接 OpenAI |
| 搜索/向量 | Algolia / Typesense / pgvector / Pinecone | 小规模 pgvector 省一个服务 |
| 分析 | PostHog / Plausible / Umami | 要产品分析+埋点 PostHog;只要隐私友好 PV 用 Plausible |

> 这张表是**锚点不是答案**:用时按本产品的真实需求 + 当下最新情况去搜、去选、给链接。别照抄。

### 4 · 不造轮子说明 + 自研边界

一句话说清:**哪些买现成 / 用开源,哪些必须自研(且只有核心差异化才自研)**。例:"认证/支付/邮件/存储全用现成服务;唯一自研的是 [核心差异化逻辑],因为现成的都给不了。"

## 反模式

- ❌ "用现代技术栈 / 微服务 / 上 K8s" → 假大空 + 过度设计(小白产品别一上来分布式)。
- ❌ 编一个不存在或已废弃的库 / 把记忆当现状 → 没真搜。
- ❌ 给每个功能都自研 → 造轮子,违背第一条。
- ❌ 只写技术名词不写为什么选 / 不给链接 → 小白照不着搭。
