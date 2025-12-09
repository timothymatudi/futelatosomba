#!/bin/bash

# Start futelatosomba web application

echo "Starting futelatosomba..."

# Start backend
cd /data/data/com.termux/files/home/futelatosomba/backend
npm start > /tmp/backend.log 2>&1 &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend on port 3001
cd /data/data/com.termux/files/home/futelatosomba/frontend/futelatosomba-react-app
PORT=3001 npm start > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!

# Wait for frontend to compile
sleep 15

# Get device IP
DEVICE_IP=$(ifconfig 2>/dev/null | grep -A 1 "wlan0" | grep "inet " | awk '{print $2}')

echo ""
echo "============================================"
echo "  futelatosomba is now running!"
echo "============================================"
echo "Backend:  http://$DEVICE_IP:3000"
echo "Frontend: http://$DEVICE_IP:3001"
echo ""
echo "Opening browser..."
echo ""

# Open browser
am start -a android.intent.action.VIEW -d http://$DEVICE_IP:3001

echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "To stop: kill $BACKEND_PID $FRONTEND_PID"
