@echo off
echo Starting Browser Tools MCP Servers...
echo.
echo Starting browser-tools-server on port 3025...
cd /d "d:\tmp\browser-tools-mcp-main\browser-tools-mcp-main\browser-tools-server"
start "Browser Tools Server" cmd /k "npm start"
echo.
echo Waiting 5 seconds before starting MCP server...
timeout /t 5 /nobreak
echo.
echo Starting browser-tools-mcp...
cd /d "d:\tmp\browser-tools-mcp-main\browser-tools-mcp-main\browser-tools-mcp"
start "Browser Tools MCP" cmd /k "npm start"
echo.
echo Both servers are starting in separate windows.
echo Check the opened command prompt windows for server status.
pause