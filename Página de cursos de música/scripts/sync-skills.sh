#!/usr/bin/env bash
# Sincroniza skills desde .agents/skills/ hacia Cursor, Codex y Antigravity.
# Uso:
#   ./scripts/sync-skills.sh           # solo espejo local .cursor/skills
#   ./scripts/sync-skills.sh --global  # + ~/.codex/skills y ~/.gemini/skills

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CANON="$ROOT/.agents/skills"
CURSOR="$ROOT/.cursor/skills"
CODEX="${CODEX_HOME:-$HOME/.codex}/skills"
GEMINI="$HOME/.gemini/skills"

GLOBAL=false
if [[ "${1:-}" == "--global" ]]; then
  GLOBAL=true
fi

if [[ ! -d "$CANON" ]]; then
  echo "Error: no existe $CANON" >&2
  exit 1
fi

link_skill() {
  local name="$1"
  local dest_dir="$2"
  local src="$CANON/$name"

  if [[ ! -d "$src" ]]; then
    echo "  omitido (no existe): $name"
    return 0
  fi

  mkdir -p "$dest_dir"
  local dest="$dest_dir/$name"

  if [[ -e "$dest" && ! -L "$dest" ]]; then
    echo "  conflicto: $dest existe y no es symlink — no se sobrescribe" >&2
    return 1
  fi

  rm -f "$dest"
  ln -sf "$src" "$dest"
  echo "  ✓ $name → $dest"
}

echo "==> Fuente: $CANON"
echo ""
echo "==> Cursor (proyecto): $CURSOR"
shopt -s nullglob
for dir in "$CANON"/*/; do
  link_skill "$(basename "$dir")" "$CURSOR"
done

if [[ "$GLOBAL" == true ]]; then
  echo ""
  echo "==> Codex (global): $CODEX"
  for dir in "$CANON"/*/; do
    link_skill "$(basename "$dir")" "$CODEX"
  done

  echo ""
  echo "==> Antigravity / Gemini (global): $GEMINI"
  mkdir -p "$GEMINI"
  for dir in "$CANON"/*/; do
    link_skill "$(basename "$dir")" "$GEMINI"
  done
fi

echo ""
echo "Listo. Reinicia Cursor / Codex / Antigravity si no detectan skills nuevos."
echo "Manifest: $ROOT/skills.manifest.yaml"
