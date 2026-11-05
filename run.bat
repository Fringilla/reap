@echo off
start json-server data/events.json
start npm run dev
rem npx vite --host --port 3000
rem npm run dev -- --host --port 3000
