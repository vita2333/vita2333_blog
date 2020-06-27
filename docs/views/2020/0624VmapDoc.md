---
title: Vue第三方Api封装(vue+amap2.0 JS API)
date: 2020-06-24
isComment: true
tags:
 - vue
 - vmap
categories: 
 - 前端
---

:::tip 组件介绍
此次封装的是vue+高德地图amap2.0组件         
项目见[此处](https://github.com/vita2333/vmap)           
参考了[vue-amap](https://github.com/ElemeFE/vue-amap) (该项目只支持JS API 1.x版本)
:::

每次写业务代码麻溜溜的,想不到封装个组件会这么懵逼.好不容易都解决了,趁热打铁记录一下解决的方案.

都在哪些方面遇到问题呢?
1. vue全局api的使用
2. 异步组件的封装与测试
3. 打包配置
4. 文档编写, vuepress的使用/部署


<!-- more -->

## Vue Api的使用
### `Vm.$attrs`传递属性          
> $attrs: 默认情况下父作用域的不被认作 props 的 attribute 绑定 (attribute bindings) 将会“回退”且作为普通的 HTML attribute 应用在子组件的根元素上。当撰写包裹一个目标元素或另一个组件的组件时，这可能不会总是符合预期行为。通过设置 inheritAttrs 到 false，这些默认行为将会被去掉。而通过 (同样是 2.4 新增的) 实例 property $attrs 可以让这些 attribute 生效，且可以通过 v-bind 显性的绑定到非根元素上。

### `Vm.$listners`传递事件     
> $listeners: 包含了父作用域中的 (不含 .native 修饰器的) v-on 事件监听器。它可以通过 v-on="$listeners" 传入内部组件——在创建更高层次的组件时非常有用。


以 _ 或 $ 开头的 property 不会被 Vue 实例代理，因为它们可能和 Vue 内置的 property、API 方法冲突。你可以使用例如 vm.$data._property 的方式访问这些 property。

### `Vm.$watch()`


## 异步组件的封装与测试
异步组件可以通过`Promise`来封装


也可以转换思路,巧妙利用callback来处理异步更新
```javascript
   function getMap(callback) {
        const checkForMap = () => {
          if (this.map) {
            callback(this.map)
          } else {
            setTimeout(checkForMap, 50)
          }
        }

        checkForMap()
   }
```

异步组件测试, 通过`simple-mock`mock异步操作
```javascript
simple.mock(localVue.prototype, '$amapLoader', () => Promise.resolve(mockAMap))
```

几种等待异步更新的方法
```javascript
Vue.nextTick() // 必须是vue内部的异步更新,如:trigger('click'),在下一个hook完成更新
async()=>{ await Promise() } 
await flushPromises()
```




## 开发踩坑
发布dist/到专属分支
```shell script
yarn run build
git commit -m 'update gh-pages'
git subtree add --prefix .vuepress/dist gh-pages 
git subtree push --prefix dist origin gh-pages     
```
设置全局变量
```javascript
global.AMap=xxx
```

利用hook事件钩子将事件监听和销毁放在一起,增加代码可读性
```javascript
export default {
    mounted(){
        this.map=xxxx
    },
    destroyed(){
        this.map.destroy()
    }
}
```
替换为
```javascript
export default {
    mounted(){
        this.map=xxxx
        this.$once('hook:destroyed',()=>{
              this.map.destroy()
        })
    },
}
```

函数式组件
```javascript
export default { 
    functional: true
}
```
或者
```html
<template functional>
    <div>xxxxx</div>
</template>
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
