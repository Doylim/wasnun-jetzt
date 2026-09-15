#!/bin/bash
# Vercel „Ignored Build Step": entscheidet, ob ein Push ein Deployment braucht.
#   exit 0 = Build überspringen   exit 1 = bauen
#
# Warum: Jedes Deployment speichert seine Funktionen. Auf dem Hobby-Tarif sind
# dafür 10 GB „Functions Storage" frei, und am 15.09.2026 war das Limit voll —
# fight-evolution-web hatte 138 gespeicherte Deployments, ein Viertel davon
# reine Protokoll-Pushes, dazu 26 Dependabot-Vorschauen.
#
# Aufruf in vercel.json:
#   "ignoreCommand": "bash scripts/vercel-build-noetig.sh protokolle docs '*.md'"
# Die Argumente sind Pfade, deren Änderung KEIN Deployment auslöst. Nur Pfade
# eintragen, die zur Laufzeit garantiert nicht gelesen werden.
#
# Vorlage: C:\Projekte\_fundament\templates\vercel\vercel-build-noetig.sh
# Kopien in den Projekten bei Änderungen von hier aus nachziehen.

ZWEIG="${VERCEL_GIT_COMMIT_REF:-}"
ZIEL="${VERCEL_GIT_COMMIT_SHA:-HEAD}"

# 1. Dependabot-Branches nie deployen. Geprüft wird per GitHub Actions (ci.yml).
if [[ "$ZWEIG" == dependabot/* ]]; then
  echo "Übersprungen: Dependabot-Branch $ZWEIG (Prüfung läuft in GitHub Actions)."
  exit 0
fi

# 2. Verglichen wird mit dem zuletzt erfolgreich deployten Stand dieses Zweigs,
#    NICHT nur mit dem letzten Commit. Sonst würde ein Push „Code + Protokoll"
#    übersprungen, weil der letzte Commit nur Doku ist.
VORHER="${VERCEL_GIT_PREVIOUS_SHA:-}"
if [ -z "$VORHER" ]; then
  echo "Bauen: kein vorheriges Deployment auf $ZWEIG bekannt."
  exit 1
fi

# Vercel klont flach. Fehlt der alte Commit, nachladen; klappt das nicht,
# lieber bauen als ein nötiges Deployment verpassen.
if ! git cat-file -e "${VORHER}^{commit}" 2>/dev/null; then
  git fetch --quiet --depth=100 origin "$ZWEIG" 2>/dev/null
  if ! git cat-file -e "${VORHER}^{commit}" 2>/dev/null; then
    echo "Bauen: Vergleichsstand $VORHER nicht im Klon."
    exit 1
  fi
fi

# .claude/ (verteilte Regeln, trifft sonst alle Projekte gleichzeitig) und
# .github/ (Workflows) gehören nie zur ausgelieferten Seite.
AUSNAHMEN=()
for pfad in .claude .github "$@"; do
  AUSNAHMEN+=(":(exclude,glob)$pfad" ":(exclude,glob)$pfad/**" ":(exclude,glob)**/$pfad")
done

GEAENDERT=$(git diff --name-only "$VORHER" "$ZIEL" -- . "${AUSNAHMEN[@]}")
STATUS=$?
if [ $STATUS -ne 0 ]; then
  echo "Bauen: git diff fehlgeschlagen (Status $STATUS)."
  exit 1
fi

if [ -z "$GEAENDERT" ]; then
  echo "Übersprungen: seit $VORHER nur Doku geändert."
  exit 0
fi

echo "Bauen: geänderte Dateien seit $VORHER:"
echo "$GEAENDERT" | head -20
exit 1
