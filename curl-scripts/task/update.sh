#!/bin/bash

API="https://protected-brushlands-52398.herokuapp.com"
URL_PATH="/tasks"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
--header "Authorization: Bearer ${TOKEN}" \
--data '{
    "task": {
      "task": "'"${TASK}"'",
      "dueDate": "'"${DUEDATE}"'",
      "isComplete": "'"${COMPLETE}"'"
    }
  }'

echo
