#!/bin/bash
# wait-for-it.sh

host="$1"
shift
cmd="$@"

until nc -z "$host" 5432; do
  echo "Waiting for $host..."
  sleep 1
done

exec $cmd
