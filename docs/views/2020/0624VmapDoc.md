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
:::

每次写业务代码麻溜溜的，想不到封装个组件会这么懵逼。好不容易都解决了，趁热打铁记录一下解决的方案。那么，都在哪些方面遇到问题呢?
1. vue全局api的使用
2. 异步组件的封装与测试
3. 打包配置

<!-- more -->

## Vue Api的使用
### `Vm.$attrs`传递属性          
> $attrs: 默认情况下父作用域的不被认作 props 的 attribute 绑定 (attribute bindings) 将会“回退”且作为普通的 HTML attribute 应用在子组件的根元素上。当撰写包裹一个目标元素或另一个组件的组件时，这可能不会总是符合预期行为。通过设置 inheritAttrs 到 false，这些默认行为将会被去掉。而通过 (同样是 2.4 新增的) 实例 property $attrs 可以让这些 attribute 生效，且可以通过 v-bind 显性的绑定到非根元素上。

#### 示例      
amap官方写法：
```javascript
var map = new AMap.Map('map', {
  viewMode: '3D',
  center: [116.397083, 39.874531],
  layers: [AMap.createDefaultLayer()],  // layers 字段为空或者不赋值将会自动创建默认底图。
  zoom: 12,
})
```
封装`<vmap>`：
```vue
<vmap viewMode="3D" :center="[116.397083, 39.874531]" :zoom="12" ></vmap>
```
`Vmap.vue`的实现，通过$attrs传值，省去维护Prop的工作量：
```vue
<template>
	<div ref="map">
		<slot></slot>
	</div>
</template>

<script>
export default {
  name:'Vmap',
  mounted() {
      const map=new AMap.map(this.$refs.map,this.$attrs)
      console.log('map===== ' + map) 
  }
}
</script>
```


### `Vm.$listners`传递事件     
> $listeners: 包含了父作用域中的 (不含 .native 修饰器的) v-on 事件监听器。它可以通过 v-on="$listeners" 传入内部组件——在创建更高层次的组件时非常有用。

官方写法：
```javascript
map.on('complete', function(){
    // 地图图块加载完成后触发
});
```
转换为vue写法，将事件通过`@`调用：
```vue
<template>
	<vmap  @complete="onComplete" ></vmap>
</template>

<script>
  export default {
    methods: {
      onComplete: () => {
        console.log('地图加载完成')
      },
    },
  }
</script>
```
在组件中绑定事件
```javascript

  export default {
    name: 'Vmap',
    mounted() {
      if (Object.keys(this.$listeners).length > 0) {
        for (const eventName in this.$listeners) {
          this.mapComponent.on(eventName, this.$listeners[eventName])
        }
      }
    },
  }
```

### `Vm.$watch()`实现数据绑定
前面通过`$attrs`实现了配置项的传递，在地图初始化时将`$attrs`作为参数传入到了`new AMap.Map()`中，实现了地图的初始化参数设置。可是这些参数并不一定是不变的，比如：用户缩放地图大小(zoom值)，这时候就需要调用`map.setZoom()`改变地图的zoom值。

官方写法：
```javascript
map.setZoom(10)
```
通过`$watch()`转换
```javascript
export default {
  mounted(){
    const unwatchFn = this.$watch(() => {
      return this.$attrs.zoom
    }, (now) => {
      this.mapComponent.setZoom(now)
    })
    // destory时解除watch
    this.$once('hook:destroy', () => {
      unwatchFn()
    })
  }
}
```
这样当`<vmap :zoom="zoom">`中zoom发生改变，就可以控制地图的缩放了。

## 异步组件的封装与测试
### 异步加载第三方Api

### 父子组件的异步参数通信
父子组件的通信，有三种方式：
1. prop
2. vm.$parent 和 vm.$children
3. provide 和 inject
这里我们父子组件如下：
```vue
<vmap>
    <vmap-marker></vmap-marker>
    <vmap-auto-complete></vmap-auto-complete>
    <vmap-xxx></vmap-xxx>
</vmap>
```
所有地图子组件需要接收`<vmap>`的`map`，才能进行后续的处理。考虑到方便性和灵活性，这里采用第三种`provide`和`inject`方法。**因为`provide`不是响应式的，所以传递的必须是异步函数。**
```javascript
export default {
    name:'Vmap',
    mounted(){
      AMapLoader.load().then(AMap=>{
        this.map = new AMap.Map(this.$attrs)  
      })
    },
    provide(){
      getMap: this.getMap
    }
}
```
`getMap()`可以通过`Promise`封装：
```javascript
    async function getMap() {
      return new Promise((resolve, reject) => {
        function checkForMap() {
          if (this.map) resolve(this.map)
          else setTimeout(checkForMap, 50)
        }

        checkForMap()
      })
    }
```
子组件调用
```javascript
    this.getMap().then(map=>{
      
    })
```
也可以转换思路，利用callback来处理异步更新：
```javascript
   function getMap(callback) {
        const checkForMap = () => {
          if (this.map) {
            callback(this.map)
          } else {
            setTimeout(checkForMap,50)
          }
        }

        checkForMap()
   }
```
子组件调用
```javascript
    this.getMap(map=>{
    
    })
```

### 异步组件测试
通过`simple-mock`mock异步操作
```javascript
simple.mock(localVue.prototype,'$amapLoader',() => Promise.resolve(mockAMap))
```

几种等待异步更新的方法
```javascript
Vue.nextTick() // 必须是vue内部的异步更新，如:trigger('click')，在下一个hook完成更新
async()=>{ await Promise() } 
await flushPromises()
```

## 打包配置
通过`vue cli3`的`build`命令来打包
`build/build-libs-js`：
```javascript
const { run } = require('runjs')
const glob = require('glob')

const list = {}

glob.sync('./packages/*.*').forEach(path => {
  const chunk = path.split('packages/')[1].split('/index')[0]

  list[chunk] = {
    input: `packages/${ chunk }`,
    output: chunk.split('.')[0],
  }
})

Object.keys(list).forEach(i => {
  const { input, output } = list[i]
  run(
    `vue-cli-service build  --target lib --no-clean  --name ${ output } --dest lib ${ input }`,
  )
})
```
`package.json`:
```json
  "scripts": {
    "libs:build": "node ./build/build-libs.js",
  }
```

:::tip 项目参考
[vue-amap](https://github.com/ElemeFE/vue-amap) 
:::
