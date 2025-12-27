#! /usr/bin/env bash

for dir in apps/*; do
  [ -d "$dir" ] && (cd "$dir" && bun install --latest)
done

for dir in packages/*; do
  [ -d "$dir" ] && (cd "$dir" && bun install --latest)
done