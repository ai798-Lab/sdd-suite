#!/usr/bin/env node
// 校验 spec.md 是否满足 discover-spec 的硬规则。
// 用法: node validate-spec.mjs <path-to-spec.md>
// 退出码: 0 = 通过(可有 warning); 1 = 硬失败; 2 = 文件读不到。
//
// v2:不再只查 3 件事。新增 AC 六要素齐、EARS 句式、Mode B 差异化非空、阻塞型未决项。
// 起因:PaycheckCity dogfood 发现旧脚本对"差异化空白 + 缺 EARS"的残废 spec 仍 exit 0。
import { readFileSync } from 'node:fs';

const path = process.argv[2];
if (!path) { console.error('用法: node validate-spec.mjs <path-to-spec.md>'); process.exit(2); }
let text;
try { text = readFileSync(path, 'utf8'); }
catch { console.error(`读不到文件: ${path}`); process.exit(2); }

const errors = [];
const warnings = [];
const lines = text.split('\n');

// --- 1. 至少一条 AC-NNN ---
if (!/AC-\d{2,}/.test(text)) errors.push('缺少验收标准:未发现任何 AC-NNN 编号的验收标准。');

// --- 2. out-of-scope 段 ---
if (!/(out of scope|out-of-scope|不做|超出范围|范围之外)/i.test(text)) {
  errors.push('缺少 Out of scope 段:必须明确这版不做什么。');
}

// --- 把文档切成 AC 定义块,逐块查六要素 ---
const isAcDef = (ln) => /AC-\d{2,}/.test(ln) && (/^#{1,6}\s/.test(ln) || /^\s*[-*]?\s*\*{0,2}AC-\d/.test(ln));
const isTopHeader = (ln) => /^#{1,3}\s/.test(ln) && !/AC-\d/.test(ln);
const acStarts = [];
lines.forEach((ln, i) => { if (isAcDef(ln)) acStarts.push(i); });

const ANCHORS = [
  ['起始条件', /起始条件|前置条件|起始状态/],
  ['触发', /触发/],
  ['预期产出', /预期产出|预期|产出/],
  ['禁止副作用', /禁止副作用|禁止|副作用/],
  ['验证方法', /验证方法|验证/],
  ['优先级', /优先级|P[012]\b/],
];

acStarts.forEach((start, idx) => {
  let end = lines.length;
  for (let j = start + 1; j < lines.length; j++) {
    if (isAcDef(lines[j]) || isTopHeader(lines[j])) { end = j; break; }
  }
  const block = lines.slice(start, end).join('\n');
  const acId = (lines[start].match(/AC-\d{2,}/) || ['AC-??'])[0];
  const missing = ANCHORS.filter(([, re]) => !re.test(block)).map(([n]) => n);
  if (missing.length) errors.push(`${acId} 缺要素: ${missing.join(' / ')}(六要素必须齐)。`);
  // 阻塞型:验证方法里塞了未决项 → 验收口径不稳
  if (/验证方法[\s\S]*?\[NEEDS CLARIFICATION/.test(block)) {
    warnings.push(`${acId} 的验证方法里有 [NEEDS CLARIFICATION],会让验收口径不稳定,进 design 前应定。`);
  }
});

// --- 3. EARS 句式(warning) ---
if (!/\b(WHEN|IF|WHILE)\b[^\n]*\bSHALL\b/i.test(text)) {
  warnings.push('未发现 EARS 句式(WHEN/IF/WHILE … SHALL):AC 散文够清也建议至少压几条成 EARS 可验证句。');
}

// --- 4. Mode B:复刻范围在场则差异化点必须非空、非全占位 ---
if (/复刻范围/.test(text)) {
  // 定位差异化段
  const dStart = lines.findIndex((ln) => /^#{1,6}\s/.test(ln) && /差异化/.test(ln));
  if (dStart === -1) {
    errors.push('Mode B 缺「## 差异化点」段(检测到复刻范围但无差异化点)。');
  } else {
    let dEnd = lines.length;
    for (let j = dStart + 1; j < lines.length; j++) {
      if (/^#{1,3}\s/.test(lines[j])) { dEnd = j; break; }
    }
    const content = lines.slice(dStart + 1, dEnd).filter((l) => l.trim() && !/^[#>|\-\s]*$/.test(l));
    const allPlaceholder = content.length > 0 && content.every((l) => /\[NEEDS CLARIFICATION/.test(l));
    if (content.length === 0) errors.push('Mode B 差异化点整段为空:Mode B 的立项理由不能留白。');
    else if (allPlaceholder) errors.push('Mode B 差异化点整段全是 [NEEDS CLARIFICATION] 占位:至少要有 1 条落地条目或 [ASSUMPTION]。');
  }
}

// --- 5. 未决项盘点(warning + BLOCKER 提醒) ---
const needs = text.match(/\[NEEDS CLARIFICATION[^\]]*\]/gi) || [];
if (needs.length) warnings.push(`残留 ${needs.length} 个 [NEEDS CLARIFICATION];其中阻塞型(改变产品方向/验收口径)进 HARD-GATE 前必须清零。`);
if (/^#{1,3}\s.*BLOCKER/im.test(text)) warnings.push('检测到 BLOCKER 段:这些是阻塞型未决项,用户未拍板不得进 design-spec。');

// --- 6. 空词(warning) ---
const vague = text.match(/(correctly|securely|优雅地|快速地|高效地)/gi) || [];
if (vague.length) warnings.push(`检测到 ${vague.length} 处不可验证空词(${[...new Set(vague)].join(', ')}),拆成可测条件。`);

// --- 7. 具体性(拒绝假大空)---
// 真实样例的标记:代码围栏 / `示例:` 行 / [ILLUSTRATIVE-EXAMPLE]
const fencedBlocks = Math.floor((text.match(/```/g) || []).length / 2);
const exampleLines = (text.match(/^\s*[-*]?\s*\*{0,2}示例\*{0,2}\s*[:：]/gm) || []).length;
const illustrative = (text.match(/\[ILLUSTRATIVE-EXAMPLE/gi) || []).length;
const concreteCount = fencedBlocks + exampleLines + illustrative;
const p0Count = (text.match(/^#{1,6}.*\(P0\)/gm) || []).length;
if (concreteCount === 0) {
  errors.push('假大空:全文没有任何真实样例(代码围栏 / `示例:` 行 / [ILLUSTRATIVE-EXAMPLE])。每个核心主张要有真实文案/数据/页面样例锚住,不能只有抽象 AC。');
} else if (p0Count > 0 && concreteCount < p0Count) {
  warnings.push(`具体性偏弱:真实样例 ${concreteCount} 处 < P0 AC ${p0Count} 条。每条核心价值 AC 应附 ≥1 条真实样例(\`示例:\` 行)。`);
}

// --- 8. 品牌与产品体系段(warning)---
if (!/(品牌|定位陈述|产品体系|positioning)/i.test(text)) {
  warnings.push('缺「品牌与产品体系」段:spec 不能只描述功能,要含定位/命名/声音/系统主线(见 references/brand-system.md)。');
}

// --- 9. website 形态的 SEO/GEO(warning)---
const looksWebsite = /(网站|内容站|落地页|landing\s?page|website|官网|建站|在线\w*站)/i.test(text);
const hasSeoGeo = /\bSEO\b/i.test(text) || /\bGEO\b/i.test(text) || /关键词|搜索意图/.test(text);
if (looksWebsite && !hasSeoGeo) {
  warnings.push('疑似 website 形态但无 SEO/GEO 段:网站类"被找到"是立项级,需真实关键词簇 + 真实标题/meta(见 references/product-form-strategy.md)。');
}

// --- 10. 页面与功能清单(warning)---
if (!/(页面与功能|页面清单|页面列表|屏清单|page inventory|有哪些页)/i.test(text)) {
  warnings.push('缺「页面与功能清单」段:设计工具需要它(有哪些页 + 每页功能 + 状态),见 SKILL.md 必含段 5。');
}

// --- 11. 技术可行性初判(warning)---
// 只查「这一步该有的」:段在不在 + 有没有逐功能给难度量级。
// 架构 / 选型 / 真实链接是 tech-spec 的活,这里不要,要了就是逼 spec 越界。
const FEASIBILITY = /(技术可行性初判|可行性初判|技术可行性|技术预判)/;
const isFeasHeader = (ln) => FEASIBILITY.test(ln) && (/^#{1,6}\s/.test(ln) || /^\s*\*{2}[^*]+\*{2}\s*$/.test(ln));
const feasStart = lines.findIndex(isFeasHeader);
if (feasStart === -1) {
  warnings.push('缺「技术可行性初判」段:每个功能要一句话说清靠什么实现、有没有现成轮子、难度量级,用来挡下做不了或做不起的功能(见 SKILL.md 必含段 8)。');
} else {
  const level = (lines[feasStart].match(/^#+/) || ['###'])[0].length;
  let feasEnd = lines.length;
  for (let j = feasStart + 1; j < lines.length; j++) {
    const m = lines[j].match(/^(#{1,6})\s/);
    if (m && m[1].length <= level) { feasEnd = j; break; }
  }
  const body = lines.slice(feasStart + 1, feasEnd);
  const content = body.filter((l) => l.trim() && !/^[#>|\-\s:]*$/.test(l));
  const hasGrade = /(难度|量级|复杂度|工作量|人天|简单|中等|复杂|现成|轮子|自己写)/.test(body.join('\n'));
  if (content.length === 0) {
    warnings.push('「技术可行性初判」段是空的:哪怕一句"全靠现成轮子,难度低"也要写,否则做不了的功能会一路漏到 tech-spec。');
  } else if (!hasGrade) {
    warnings.push('「技术可行性初判」没看到难度量级:逐个功能给"靠什么实现 + 有没有现成轮子 + 难度(低/中/高)",别只写一句"技术上没问题"。');
  }
}

warnings.forEach((w) => console.log(`⚠️  ${w}`));
if (errors.length) {
  errors.forEach((e) => console.error(`❌ ${e}`));
  console.error(`\nspec 未通过硬规则校验(${errors.length} 项)。`);
  process.exit(1);
}
console.log('✅ spec 通过硬规则校验' + (warnings.length ? `(${warnings.length} 条 warning,见上)` : '') + '。');
process.exit(0);
