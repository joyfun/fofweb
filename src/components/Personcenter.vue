
<template>
    <div class="row no-gutters">
      <div class="col-sm-6">.col-sm-6 .col-md-8
          <div class="col-sm-4">1</div>
          <div class="col-sm-8">2</div>
      </div>
    </div>
</template>

<script>
import { mapState,mapMutations } from 'vuex'

export default {
    computed: {
        ...mapState({
            tags: state => state.tab.tablist
        })
    },
    data(){
        return{

        }
    },
     methods: {
      ...mapMutations({
          close : 'closeTab'
      })
    }
}
</script>
<style lang="scss" scoped>


</style>