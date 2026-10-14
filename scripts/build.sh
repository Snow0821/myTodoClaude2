#!/bin/sh
# Wrap the Artifact page body (app.html) in a full HTML document for static hosting (Vercel).
set -e
cd "$(dirname "$0")/.."
mkdir -p public
{
  printf '%s\n' '<!doctype html>' '<html lang="ko">' '<head>' \
    '<meta charset="utf-8">' \
    '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">' \
    '<style>body{margin:0}[hidden]{display:none!important}img{max-width:100%}</style>' \
    '</head>' '<body>'
  cat app.html
  printf '%s\n' '</body>' '</html>'
} > public/index.html
echo "built public/index.html"
