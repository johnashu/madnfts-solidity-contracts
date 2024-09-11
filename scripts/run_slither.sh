#!/bin/bash

# Create or clear the output file
>slither_output.md

# Write the initial markdown header
# echo "# Slither Analysis Results" >>slither_output.md
echo "" >>slither_output.md

# Find all .sol files in the contracts directory and its subdirectories
find contracts -name "*.sol" | while read -r file; do
  echo "## Analyzing $file" >>slither_output.md
  # echo "" >>slither_output.md
  # echo '```slither_output' >>slither_output.md
  slither "$file" \
    --checklist --markdown-root / \
    --config-file slither.config.json \
    >>slither_output.md 2>&1
  # echo '```' >>slither_output.md
  # echo "" >>slither_output.md
done

echo "Analysis complete. Results saved in slither_output.md"
