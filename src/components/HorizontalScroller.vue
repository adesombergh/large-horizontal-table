<template>
  <div
    class="scroller"
    ref="container"
    :class="customClasses"
  >
    <div
      class="scroller__content"
      ref="content"
      @scroll="handleContentScroll"
      v-dragged.prevent="onContentDrag"
    >
      <slot />
    </div>

    <div
      class="scroller__rail"
      :style="railStyle"
      ref="rail"
      @click.self="railCLick"
    >
      <div
        v-dragged.prevent="onHandleDragged"
        class="scroller__handle"
        ref=handle
        :style="handleStyle"
      />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // CONSTANTS
      contentWidth: 0,
      viewportSize: 0,
      containerWidth: 0,
      containerLeft: 0,

      // VARIABLES
      containerTop: 0,
      containerBottom: 0,
      contentLeft: 0,

      grabbing: false
    }
  },

  created () {
    window.addEventListener('scroll', this.handleWindowScroll, false)
    window.addEventListener('resize', this.handleResize, false)
  },

  beforeDestroy () {
    window.removeEventListener('scroll', this.handleWindowScroll, false)
    window.removeEventListener('resize', this.handleResize, false)
  },

  mounted () {
    this.$nextTick(() => {
      this.updateConstants()
      this.updateVariables()
    })
  },

  computed: {
    handleStyle () {
      const handleWidth = this.coefficient * this.containerWidth
      const handleLeft = this.coefficient * this.contentLeft
      return `width: ${handleWidth}px; left: ${handleLeft}px`
    },
    railStyle () {
      return this.shouldStick
        ? `position: fixed; left: ${this.containerLeft}px; width: ${this.containerWidth}px`
        : null
    },
    coefficient () {
      return this.containerWidth / this.contentWidth
    },
    shouldStick () {
      return this.containerBottom > window.innerHeight && this.containerTop <= window.innerHeight
    },
    showLeftShadow () {
      return this.contentLeft >= 20
    },
    showRightShadow () {
      return (this.contentLeft <= this.contentWidth - this.containerWidth - 20)
    },
    customClasses () {
      return [
        { grabbing: this.grabbing },
        { 'has-left-shadow': this.showLeftShadow },
        { 'has-right-shadow': this.showRightShadow }
      ]
    }
  },

  methods: {
    handleWindowScroll () {
      this.updateVariables()
    },
    handleContentScroll () {
      this.updateVariables()
    },
    railCLick (e) {
      this.$refs.content.scrollLeft = e.layerX / this.coefficient
    },
    onHandleDragged ({ deltaX }) {
      if (deltaX !== undefined) {
        this.$refs.content.scrollLeft += deltaX / this.coefficient
        this.grabbing = true
      } else {
        this.grabbing = false
      }
    },
    onContentDrag ({ deltaX, deltaY }) {
      if (deltaX !== undefined && deltaY !== undefined) {
        this.$refs.content.scrollLeft += -deltaX
        window.scrollBy(0, -deltaY)
        this.grabbing = true
      } else {
        this.grabbing = false
      }
    },

    handleResize () {
      this.updateConstants()
      this.updateVariables()
    },

    updateConstants () {
      // Should change only on resize
      this.contentWidth = this.$refs.content.children[0].clientWidth
      this.viewportSize = window.innerHeight
      const containerRect = this.$refs.container.getBoundingClientRect()
      this.containerWidth = containerRect.width
      this.containerLeft = containerRect.left
    },

    updateVariables () {
      const containerRect = this.$refs.container.getBoundingClientRect()
      this.containerTop = containerRect.top
      this.containerBottom = containerRect.bottom

      this.contentLeft = this.$refs.content.scrollLeft
    }
  }
}
</script>

<style lang="scss" scoped>
.scroller {
  position: relative;
  padding-bottom: 60px;

  &__content {
    overflow-x: auto;
    cursor: grab;
    .grabbing & {
      cursor: grabbing;
    }

    // HIDE DEFAULT SCROLLBARs (CHROME, SAFARI, FIREFOX)
    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }

  &__rail {
    position: absolute;
    height: 60px;
    bottom: 0;
    left: 0;
    width: 100%;
    cursor: pointer;
    background-color: rgba(white, 1);
    z-index: 5;

    &.sticky {
      position: fixed;
    }
  }

  &__handle {
    position: absolute;
    display: block;
    top: 2px;
    left: 0;
    background-color: rgba(teal, .8);
    border-radius: 5rem;
    height: 18px;
    min-width: 40px;
    cursor: grab;

    .grabbing & {
      cursor: grabbing;
    }
    &:hover {
      background-color: teal;
    }
  }

  // Left and right drop shadows, shows content is overflowing
  &::before,
  &::after{
    content: '';
    position: absolute;
    width: 4rem;
    top: 0;
    z-index: 2;
    height: 100%;
    opacity: 0;
    transition: opacity 200ms ease-in-out;
    pointer-events: none;
  }
  &::before {
    left: 0;
    background: linear-gradient(to right, rgba(0,0,0, .08), rgba(0,0,0, 0));
  }
  &::after {
    right: 0rem;
    background: linear-gradient(to left, rgba(0,0,0, .08), rgba(0,0,0, 0));
  }
  &.has-left-shadow::before {
    opacity: 1;
  }
  &.has-right-shadow::after {
    opacity: 1;
  }
}
</style>
