#!/bin/bash
pause() {
  read -n1 -rsp $'Press any key to close terminal...\n'
}

cd "$(dirname "$0")"
cd ..

/opt/nodejs/lib/node_modules/yarn/bin/yarn run server
pause