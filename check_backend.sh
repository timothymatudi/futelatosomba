#!/bin/bash

echo "=================================="
echo "  FUTELATOSOMBA BACKEND CHECKER"
echo "=================================="
echo ""

echo "Checking backend health..."
echo ""

# Check backend health
response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" https://futelatosomba.onrender.com/api/health 2>&1)
http_code=$(echo "$response" | grep "HTTP_STATUS" | cut -d: -f2)
body=$(echo "$response" | grep -v "HTTP_STATUS")

echo "Response:"
echo "$body"
echo ""
echo "HTTP Status Code: $http_code"
echo ""

if [ "$http_code" = "200" ]; then
    echo "✅ SUCCESS! Backend is running properly!"
    echo ""
    echo "Next steps:"
    echo "1. Visit frontend: https://futelatosomba-frontend-f1sgrgm90-timothy-s-projects-61ca8a51.vercel.app"
    echo "2. Try registering a new user"
    echo "3. Check Render logs for any errors"
elif [ "$http_code" = "502" ] || [ "$http_code" = "503" ]; then
    echo "⚠️  Backend is still starting up or has errors"
    echo ""
    echo "Possible issues:"
    echo "1. MongoDB connection failing - Check if IPs are whitelisted"
    echo "2. Missing environment variables - Check MONGO_DATABASE_URL"
    echo "3. Backend still deploying - Wait 1-2 more minutes"
    echo ""
    echo "Check Render logs: https://dashboard.render.com/web/srv-d4s0ibndiees73dh8bog/logs"
else
    echo "❌ Unexpected status code: $http_code"
    echo ""
    echo "Check Render logs: https://dashboard.render.com/web/srv-d4s0ibndiees73dh8bog/logs"
fi

echo ""
echo "=================================="
