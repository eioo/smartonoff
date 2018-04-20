#!/bin/bash


pause() {
  read -n1 -rsp $'Press any key to close terminal...\n'
}

BASEDIR=$(dirname "$0")
SCRIPT="/app.js"

node "$BASEDIR$SCRIPT"

pause
