#!/bin/bash

API="https://protected-brushlands-52398.herokuapp.com"
URL_PATH="/tasks"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "task": {
      "task": "'"${TASK}"'",
      "dueDate": "'"${DUEDATE}"'",
<<<<<<< HEAD
      "isComplete": "'"${COMPLETE}"'",
      "owner": "'"${OWNER}"'"
=======
      "isComplete": "'"${COMPLETE}"'"
>>>>>>> working
    }
  }'

echo
