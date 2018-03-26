#!/bin/sh

api=http://localhost:3004/api
for q in flag/test3.powerUser flag/test3.colorScheme flag/test3.timeSorting flag/test2/userId/test2user
do
  echo "$q: $(curl -s $api/$q)"
done

