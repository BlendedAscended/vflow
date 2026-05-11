#!/bin/bash
cd /Users/sandeepsingh/Desktop/Project26/Agents/vflow2.0
npm run dev &
DEV_PID=$!
sleep 15
curl -s http://localhost:3000 > /dev/null 2>&1 && echo "SUCCESS: Server responding on localhost:3000" || echo "FAIL: Server not responding"
kill $DEV_PID 2>/dev/null
wait $DEV_PID 2>/dev/null
echo "Dev server check complete"
