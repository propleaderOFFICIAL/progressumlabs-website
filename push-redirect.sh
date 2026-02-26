#!/usr/bin/env bash
# Push veloce: imposta il flag redirect (opzionale), commit e push.
# Uso: ./push-redirect.sh [true|false]
#      true  = redirect attivo (vai ad Avantir), poi push
#      false = redirect spento (mostra sito Progressum), poi push
#      Senza argomento = pusha solo le modifiche già fatte a index.html

cd "$(dirname "$0")"

if [[ "$1" == "true" || "$1" == "false" ]]; then
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s/REDIRECT_ENABLED=true/REDIRECT_ENABLED=$1/g; s/REDIRECT_ENABLED=false/REDIRECT_ENABLED=$1/g" index.html
  else
    sed -i "s/REDIRECT_ENABLED=true/REDIRECT_ENABLED=$1/g; s/REDIRECT_ENABLED=false/REDIRECT_ENABLED=$1/g" index.html
  fi
  echo "Redirect impostato a: $1"
fi

git add index.html
if git diff --staged --quiet; then
  echo "Nessuna modifica da committare."
else
  VAL=$(grep -o 'REDIRECT_ENABLED=\(true\|false\)' index.html | head -1 | cut -d= -f2)
  git commit -m "Redirect: REDIRECT_ENABLED=$VAL"
fi
git push

echo "Fatto."
