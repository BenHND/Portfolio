<template>
  <div id="app">
   
    {{ projects }}

  </div>
</template>

<script>
export default {
  data () {
    return {
      projects: []
    }
  },
  mounted () {
    this.$http.get('http://hb-interactive.com/database.json').then((response) => {
      this.projects = response.data
    }, (response) => {
      console.log('error', response)
    })
  }
}
</script>

<style lang="scss">
  @import 'src/assets/scss/custom.scss';
</style>
