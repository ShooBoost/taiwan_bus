#!/usr/bin/env sh

# 發生錯誤時執行終止指令
set -e

# 打包編譯
npm run build

# 移動到打包資料夾下
cd dist

# 一個複製 index檔 作為 404檔
# 避免 vue router 在 history mode 下 github page url 失效
cp index.html ./404.html


git init
git add -A
git commit -m 'deploy'

# 部署到 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# 部署到 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages
# 以這個專案來講就要改成這樣以下這樣，下面是走 ssh 模式
# git push -f git@github.com:ShooBoost/taiwan_bus.git master:gh-pages
# 除此之外，也可以改走 HTTPS 模式
git push -f https://github.com/ShooBoost/taiwan_bus master:gh-pages

cd -
