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

每次写业务代码麻溜溜的，想不到封装个组件会这么懵逼。好不容易都解决了，趁热打铁记录一下解决的方案。那么，都在哪些方面遇到问题呢?
1. vue全局api的使用
2. 异步组件的封装与测试
3. 打包配置
4. 文档编写， vuepress的使用/部署


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

### `Vm.$watch()`


## 异步组件的封装与测试
异步组件可以通过`Promise`来封装


也可以转换思路，巧妙利用callback来处理异步更新
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

异步组件测试， 通过`simple-mock`mock异步操作
```javascript
simple.mock(localVue.prototype,'$amapLoader',() => Promise.resolve(mockAMap))
```

几种等待异步更新的方法
```javascript
Vue.nextTick() // 必须是vue内部的异步更新，如:trigger('click')，在下一个hook完成更新
async()=>{ await Promise() } 
await flushPromises()
```




## 开发踩坑

设置全局变量
```javascript
global.AMap=xxx
```

利用hook事件钩子将事件监听和销毁放在一起，增加代码可读性
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
