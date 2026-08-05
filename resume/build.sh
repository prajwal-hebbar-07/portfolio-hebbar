#!/bin/sh
# Regenerate the downloadable resume PDF from resume.html (Chrome headless).
set -e
cd "$(dirname "$0")"
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="../public/Prajwal Hebbar - Resume.pdf" resume.html
echo "wrote public/Prajwal Hebbar - Resume.pdf"
