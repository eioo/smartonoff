#!/bin/bash
pause() {
  read -n1 -rsp $'Press any key to close terminal...\n'
}

npm start
pause