#!/usr/bin/env bash
# sdd-suite 跨平台命令分发安装器
# 把 aliases/*.md(ohspec / design / techspec / genplan)铺到本机各 coding agent 的
# "用户手动触发命令"目录,格式不兼容的做转换。
#
# 探测逻辑参考 goalkeeper:command -v 检测 bin + 查配置目录是否存在。
# 用法:bash install-commands.sh [--dry-run]
set -uo pipefail   # best-effort:单个 agent 失败只跳过它,不中断其余

SRC_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ALIASES="$SRC_DIR/aliases"          # 源:Claude Code 格式 md(frontmatter: description / argument-hint + $ARGUMENTS)
SKILLS="$SRC_DIR/skills"            # 源:SKILL.md 套件(discover-spec / gen-plan / tech-spec ...)
NS="sdd"                            # 命名空间前缀
DRY=0; [[ "${1:-}" == "--dry-run" ]] && DRY=1

say()  { printf '\033[1m%s\033[0m\n' "$*"; }
do_cp(){ if [[ $DRY -eq 1 ]]; then echo "  [dry] cp $1 -> $2"; else mkdir -p "$(dirname "$2")"; cp "$1" "$2"; echo "  ok   $2"; fi; }
have(){ command -v "$1" >/dev/null 2>&1; }

# ---- 1. Claude Code:原生兼容,直接铺,带命名空间子目录 ----
if have claude || [[ -d "$HOME/.claude" ]]; then
  say "[claude] ~/.claude/commands/$NS/  (md+frontmatter 原样复用)"
  for f in "$ALIASES"/*.md; do do_cp "$f" "$HOME/.claude/commands/$NS/$(basename "$f")"; done
fi

# ---- 2. opencode:md+frontmatter 兼容,但 frontmatter 字段语义不同(agent/model/subtask),
#         argument-hint 不被识别;占位符同样是 $ARGUMENTS。直接复用源文件即可工作,
#         argument-hint 字段被忽略不报错。目录用复数 commands/(也接受单数 command/)。----
if [[ -d "$HOME/.config/opencode" ]] || [[ -d "$HOME/.opencode" ]] || have opencode; then
  say "[opencode] ~/.config/opencode/commands/$NS/  (md 复用,argument-hint 被忽略)"
  for f in "$ALIASES"/*.md; do do_cp "$f" "$HOME/.config/opencode/commands/$NS/$(basename "$f")"; done
fi

# ---- 3. Codex:custom prompts 已 deprecated,但仍可用 ~/.codex/prompts/*.md;
#         frontmatter 字段一致(description / argument-hint),占位符 $ARGUMENTS 一致 → 源文件可直接复用。
#         注意:Codex prompts 不支持子目录命名空间,文件名即命令名(/prompts:ohspec),
#         所以加 sdd- 前缀防冲突。官方推荐改走 skills,本脚本两条腿都铺。----
if have codex || [[ -d "$HOME/.codex" ]]; then
  say "[codex] ~/.codex/prompts/sdd-*.md  (deprecated 但可用;无子目录,文件名前缀防冲突)"
  for f in "$ALIASES"/*.md; do do_cp "$f" "$HOME/.codex/prompts/${NS}-$(basename "$f")"; done
  # 推荐路径:把整套 SKILL.md 软链到 ~/.codex/skills/(Codex 自动发现)
  if [[ -d "$SKILLS" ]]; then
    say "[codex] ~/.codex/skills/  (推荐:软链 SKILL.md 套件,自动发现)"
    [[ $DRY -eq 0 ]] && mkdir -p "$HOME/.codex/skills"
    for d in "$SKILLS"/*/; do n=$(basename "$d"); t="$HOME/.codex/skills/$n";
      if [[ $DRY -eq 1 ]]; then echo "  [dry] ln -s $d $t"; else ln -sfn "$d" "$t"; echo "  ln   $t"; fi; done
  fi
fi

# ---- 4. Kimi Code:无独立 custom command;唯一载体是 skills,/skill:<name> 触发。
#         不兼容 aliases 的 frontmatter(它要 name+description),需转换:
#         为每个 alias 生成一个 SKILL.md 包装(name/description + 调用对应 sdd-suite skill)。
#         Kimi 默认读 ~/.kimi/skills/(brand 组)。----
if have kimi || [[ -d "$HOME/.kimi" ]]; then
  say "[kimi] ~/.kimi/skills/sdd-*/SKILL.md  (不兼容,转换为 /skill: 包装)"
  for f in "$ALIASES"/*.md; do
    base=$(basename "$f" .md); name="${NS}-${base}"; out="$HOME/.kimi/skills/$name/SKILL.md"
    desc=$(grep -m1 '^description:' "$f" | sed 's/^description: *//')
    body=$(awk 'f{print} /^---$/{c++; if(c==2)f=1}' "$f")   # 取 frontmatter 之后正文
    if [[ $DRY -eq 1 ]]; then echo "  [dry] gen $out"; else
      mkdir -p "$(dirname "$out")"
      { printf -- '---\nname: %s\ndescription: %s\n---\n\n%s\n' "$name" "$desc" "$body"; } > "$out"
      echo "  gen  $out"; fi
  done
fi

# ---- 5. pi:custom command 用 prompt template(~/.pi/agent/prompts/*.md),
#         但占位符语法不同:pi 用 {{var}},不是 $ARGUMENTS,且无 frontmatter。
#         需转换:剥掉 frontmatter,把 $ARGUMENTS 换成 {{input}}。/<name> 触发。----
if have pi || [[ -d "$HOME/.pi" ]]; then
  say "[pi] ~/.pi/agent/prompts/sdd-*.md  (不兼容,转换:去 frontmatter + \$ARGUMENTS→{{input}})"
  for f in "$ALIASES"/*.md; do
    base=$(basename "$f" .md); out="$HOME/.pi/agent/prompts/${NS}-${base}.md"
    body=$(awk 'f{print} /^---$/{c++; if(c==2)f=1}' "$f" | sed 's/\$ARGUMENTS/{{input}}/g')
    if [[ $DRY -eq 1 ]]; then echo "  [dry] gen $out"; else
      mkdir -p "$(dirname "$out")"; printf '%s\n' "$body" > "$out"; echo "  gen  $out"; fi
  done
fi

# ---- 6. Kiro:无 CLI 装在本机(kiro 未在 PATH)。机制=steering 文件 inclusion: manual → 出现在 / 菜单。
#         放 .kiro/steering/<name>.md,frontmatter 需 inclusion: manual。这是项目级目录,
#         全局没有标准位置 → 仅当检测到 ~/.kiro 时提示,实际安装留给用户在项目内执行。----
if [[ -d "$HOME/.kiro" ]] || have kiro; then
  say "[kiro] (检测到 ~/.kiro)steering 文件机制:.kiro/steering/<name>.md + frontmatter inclusion: manual"
  echo "  注意:Kiro steering 是项目级(.kiro/steering/),无全局命令目录,需在各项目内安装。"
  echo "  转换:加 frontmatter 'inclusion: manual',\$ARGUMENTS 在 steering 里不展开(steering 是注入上下文,不带参数)。"
fi

# ---- 7. ZCode(GLM 桌面 harness):本机未装 CLI(~/.zcode 不存在)。
#         读 AGENTS.md 作长期指令,/ 命令可"保存固定 prompt"但磁盘格式/目录官方未公开文档。
#         结论:暂无可靠的文件级分发路径,跳过,提示用户在 ZCode 内手动 "保存命令"。----
if [[ -d "$HOME/.zcode" ]]; then
  say "[zcode] (检测到 ~/.zcode)命令磁盘格式未公开,跳过文件分发;请在 ZCode 内手动保存为 / 命令。"
fi

say "完成。"
