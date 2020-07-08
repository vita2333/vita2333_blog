---
title: Vuepress使用踩坑
date: 2020-06-29
isComment: true
tags:
 - vue
 - vuepress
categories: 
 - todo
---

## 开发踩坑
发布dist/到专属分支
```shell script
yarn run build
git commit -m 'update gh-pages'
git subtree add --prefix .vuepress/dist gh-pages 
git subtree push --prefix dist origin gh-pages     
```

vuepress基于markdown写vue,所以有没有空行,是否顶格差别很大!!!
这样写出不来
```markdown
<DemoBlock title="测试" desc="基础文档展示">
  <base-demo/>

  <template slot="codeDesc">
   按钮实体
  </template>

  <div v-highlight slot="code" lang="vue">
   <<< @/examples/views/BaseDemo.vue
  </div>
</DemoBlock>
```
必须写成
```markdown
<DemoBlock title="测试" desc="基础文档展示">
  <base-demo/>

  <template slot="codeDesc">
   按钮实体
  </template>

  <div v-highlight slot="code" lang="vue">

   <<< @/examples/views/BaseDemo.vue
   
  </div>
</DemoBlock>
```
坑了我一个下午!!!
