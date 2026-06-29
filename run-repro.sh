#!/bin/bash

# Reproduces the cypress-cucumber-preprocessor bug from issue #1161.
#
# The test triggers an unexpected cross-origin navigation (simulating what oauth2-proxy does
# when the session expires mid-test). This causes Cypress to reload the spec. With retries
# enabled, the preprocessor state machine or JsonFormatter crashes.
#
# Two observed crash modes:
#   1. "TypeError: Cannot destructure property 'message' of 'testStepResult' as it is undefined"
#      in JsonFormatter.getStepData - the testStepResult is undefined because testStepFinished
#      was never sent for the aborted attempt (browser context was reset before afterEach ran).
#
#   2. "Error: Unexpected state in afterSpecHandler: step-started"
#      The plugin state machine is left in "step-started" when afterSpecHandler fires, because
#      the spec reload interrupted the normal step-started -> step-finished -> test-finished flow.
#
# Run: bash run-repro.sh
# Expected: One of the two crash modes above is reproduced.

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Reproducing cypress-cucumber-preprocessor issue #1161...${NC}"
echo "See: https://github.com/badeball/cypress-cucumber-preprocessor/issues/1161"
echo "----------------------------------------"

output=$(npx cypress run 2>&1)
exit_code=$?
echo "$output"

if echo "$output" | grep -qE "Cannot destructure property.*testStepResult|JsonFormatter failed|Unexpected state in afterSpecHandler: step-started"; then
    echo ""
    echo -e "${RED}🐛 BUG REPRODUCED (issue #1161)${NC}"
    if echo "$output" | grep -q "Cannot destructure property"; then
        echo -e "${RED}   Mode 1: testStepResult undefined in JsonFormatter${NC}"
    fi
    if echo "$output" | grep -q "Unexpected state in afterSpecHandler: step-started"; then
        echo -e "${RED}   Mode 2: Unexpected state in afterSpecHandler${NC}"
    fi
    exit 1
else
    echo ""
    echo -e "${GREEN}✅ Bug NOT triggered in this run${NC}"
    exit 0
fi
