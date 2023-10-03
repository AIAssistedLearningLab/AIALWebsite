#!/bin/bash

bundle install;
git worktree add ../_site built;

bundle exec jekyll build --config _config.yml,_vhost_config.yml -d ../_site;

cd ../_site || exit;
git add -A;
git commit -m "Update site";
git push;
cd - || exit;

git worktree remove ../_site;
