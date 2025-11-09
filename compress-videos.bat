@echo off
REM Video Compression Script for WebM Files (Windows)
REM This script compresses all .webm files in public\videos\ directory

echo Checking for FFmpeg...

where ffmpeg >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Error: FFmpeg is not installed or not in PATH.
    echo Please install FFmpeg from https://ffmpeg.org/download.html
    echo Make sure to add FFmpeg to your system PATH.
    pause
    exit /b 1
)

echo FFmpeg found!
echo.

REM Create backup directory
set BACKUP_DIR=public\videos\backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set BACKUP_DIR=%BACKUP_DIR: =0%
mkdir "%BACKUP_DIR%" 2>nul

echo Creating backup of original videos...
copy "public\videos\*.webm" "%BACKUP_DIR%\" >nul 2>&1
echo Backup created in: %BACKUP_DIR%
echo.

REM Compression settings
set BITRATE=2500k
set CRF=32
set PRESET=slow

echo Starting compression...
echo.

REM Count total files
set COUNT=0
for %%f in (public\videos\*.webm) do set /a COUNT+=1

set CURRENT=0
for %%f in (public\videos\*.webm) do (
    set /a CURRENT+=1
    set "filename=%%~nxf"
    set "temp_file=%%f.compressed"
    
    echo [%CURRENT%/%COUNT%] Compressing: %filename%
    
    REM Two-pass encoding
    REM Pass 1: Analyze
    ffmpeg -i "%%f" -c:v libvpx-vp9 -b:v %BITRATE% -crf %CRF% -pass 1 -an -f null NUL 2>nul
    
    REM Pass 2: Encode
    ffmpeg -i "%%f" -c:v libvpx-vp9 -b:v %BITRATE% -crf %CRF% -pass 2 -preset %PRESET% -c:a libopus -b:a 128k -y "%temp_file%" 2>nul
    
    if exist "%temp_file%" (
        REM Replace original
        move /y "%temp_file%" "%%f" >nul
        echo   Compressed successfully
    ) else (
        echo   Failed to compress
    )
    
    REM Clean up pass log files
    del /q ffmpeg2pass-*.log 2>nul
    
    echo.
)

echo Compression complete!
echo Original videos backed up in: %BACKUP_DIR%
echo.
echo Next steps:
echo 1. Test the compressed videos in your browser
echo 2. If quality is acceptable, you can delete the backup folder
echo 3. If quality is too low, restore from backup and adjust CRF/BITRATE settings
pause

