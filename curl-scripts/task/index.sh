#!/bin/sh

API="https://protected-brushlands-52398.herokuapp.com"
URL_PATH="/tasks"

curl "${API}${URL_PATH}" \
  --include \
  --request GET \
  --header "Authorization: Bearer ${TOKEN}"

echo
