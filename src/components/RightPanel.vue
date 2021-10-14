<template>
  <div ref="rightPanel" :class="{show:show}" class="rightPanel-container">
    <div class="rightPanel-background" />
    <div class="rightPanel">
    <el-popover
    ref="popover"
    placement="top"
    width="10"
        trigger="manual"
    v-model="tipvisible"
    :content="tipcontent">
  </el-popover>
      <div class="handle-button" ref="cartButton" :style="{'top':buttonTop+'px'}" v-popover:popover>
        <i  @click="show=!show" :class="show?'el-icon-close':'el-icon-shopping-cart-full'" />
      </div>
      <div class="rightPanel-items">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import { addClass, removeClass } from '@/utils'
import Bus from '../store/bus.js';
import { mapState } from 'vuex'

export default {
  name: 'RightPanel',
  props: {
    clickNotClose: {
      default: false,
      type: Boolean
    },
    buttonTop: {
      default: 250,
      type: Number
    }
  },
  data() {
    return {
      tipvisible:false,
      tipcontent:"+1",
      show: false
    }
  },
   computed: {
        ...mapState({
            nowcart: state =>state.nowcart
        }),

    },
  watch: {
    show(value) {
      console.log("触发 close cart 事件")
      if (value && !this.clickNotClose) {
        this.addEventClick()
      }
      if (value) {
        addClass(document.body, 'showRightPanel')
      } else {
        removeClass(document.body, 'showRightPanel')
      }
    }
  },
  mounted() {
    this.insertToBody()
        Bus.$on('addcart',(arg)=> {
          this.tipcontent="+"+arg['name']+"到   \n"+this.nowcart
          this.tipvisible=true
          setTimeout(() => {
        this.tipvisible=false
      }, 1500)
  })
  },
  beforeDestroy() {
    const elx = this.$refs.rightPanel
    elx.remove()
  },
  methods: {
    addEventClick() {
      window.addEventListener('click', this.closeSidebar)
    },
    closeSidebar(evt) {
      console.log(evt.target)
      const parent = evt.target.closest('.rightPanel')
            console.log(parent)

      if (!parent) {
        this.show = false
        window.removeEventListener('click', this.closeSidebar)
      }
    },
    insertToBody() {
      const elx = this.$refs.rightPanel
      const body = document.querySelector('body')
      body.insertBefore(elx, body.firstChild)
    }
  }
}
</script>

<style>
.showRightPanel {
  overflow: hidden;
  position: relative;
  width: calc(100% - 15px);
}
</style>

<style lang="scss" scoped>
.rightPanel-background {
  position: fixed;
  top: 0;
  left: 0;
  opacity: 0;
  transition: opacity .3s cubic-bezier(.7, .3, .1, 1);
  background: rgba(0, 0, 0, .2);
  z-index: -1;
}

.rightPanel {
  width: 100%;
  max-width: 260px;
  height: 100vh;
  position: fixed;
  top: 0;
  right: 0;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, .05);
  transition: all .25s cubic-bezier(.7, .3, .1, 1);
  transform: translate(100%);
  background: #fff;
  z-index: 2006;
}

.show {
  transition: all .3s cubic-bezier(.7, .3, .1, 1);

  .rightPanel-background {
    z-index: 2005;
    opacity: 1;
    width: 100%;
    height: 100%;
  }

  .rightPanel {
    transform: translate(0);
  }
}

.handle-button {
  width: 48px;
  height: 48px;
  position: absolute;
  left: -48px;
  text-align: center;
  font-size: 24px;
  border-radius: 6px 0 0 6px !important;
  z-index: 0;
  pointer-events: auto;
  cursor: pointer;
  color: #fff;
  background-color: rgb(24, 144, 255);
  line-height: 48px;
  i {
    font-size: 24px;
    line-height: 48px;
  }
}
</style>
