<template>
	<child-component v-model:value="value"></child-component>
</template>
<script>
  export default {
    emits: ['update:value', 'otherEmit'],
    setup(props, { emit }) {
      emit('update:value')
      emit('otherEmit')
    },
  }
</script>
