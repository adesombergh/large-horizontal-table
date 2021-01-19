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
      @mousedown="handleMouseDown($event, 'handleContentDrag')"
    >
      <slot :dragging="dragging" />
    </div>

    <div
      class="scroller__rail"
      :style="railStyle"
      :class="{'stick': shouldStick}"
      ref="rail"
      @click.self="railCLick"
    >
      <div
        class="scroller__handle"
        ref=handle
        :style="handleStyle"
        @mousedown="handleMouseDown($event, 'handleRailDrag')"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    vertical: {
      type: Boolean,
      default: true
    }
  },

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

      dragging: false,

      lastCoords: null,
      downTime: null,
      dragHandler: null
    }
  },

  created () {
    window.addEventListener('scroll', this.handleWindowScroll, false)
    window.addEventListener('resize', this.handleResize, false)
    document.documentElement.addEventListener('mousemove', this.handleMouseMove, false)
    document.documentElement.addEventListener('mouseup', this.handleMouseUp, true)
  },

  beforeDestroy () {
    window.removeEventListener('scroll', this.handleWindowScroll, false)
    window.removeEventListener('resize', this.handleResize, false)
    document.documentElement.removeEventListener('mousemove', this.handleMouseMove, false)
    document.documentElement.removeEventListener('mouseup', this.handleMouseUp, true)
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
      return this.containerBottom > window.innerHeight && this.containerTop <= window.innerHeight - 250
    },
    showLeftShadow () {
      return this.contentLeft >= 20
    },
    showRightShadow () {
      return (this.contentLeft <= this.contentWidth - this.containerWidth - 20)
    },
    customClasses () {
      return [
        { grabbing: this.dragging },
        { 'has-left-shadow': this.showLeftShadow },
        { 'has-right-shadow': this.showRightShadow }
      ]
    }
  },

  methods: {
    handleMouseDown (e, handler) {
      e.preventDefault()
      this.downTime = new Date()
      this.dragHandler = handler
      this.lastCoords = {
        x: e.clientX,
        y: e.clientY
      }
    },
    handleMouseUp (e) {
      if (!this.lastCoords) return
      e.preventDefault()
      e.stopPropagation()
      e.stopImmediatePropagation()
      this.dragging = false
      this.lastCoords = null
      this.dragHandler = null
    },
    handleMouseMove (e) {
      if (!this.lastCoords) return
      const DRAG_THRESHOLD = 50 // ms
      const deltaX = e.clientX - this.lastCoords.x
      const deltaY = e.clientY - this.lastCoords.y
      // MAKE SURE TO MOVE CONTENT if GRABBING FOR A CERTAIN AMOUNT OF TIME (DRAG_THRESHOLD)
      if (new Date() - this.downTime > DRAG_THRESHOLD) {
        this.dragging = true
        this.[this.dragHandler](deltaX, deltaY)
      }
      this.lastCoords = {
        x: e.clientX,
        y: e.clientY
      }
    },
    handleWindowScroll () {
      this.updateVariables()
    },
    handleContentScroll () {
      this.updateVariables()
    },
    railCLick (e) {
      this.$refs.content.scrollLeft = e.layerX / this.coefficient
    },
    handleContentDrag (deltaX, deltaY) {
      this.$refs.content.scrollLeft += -deltaX
      if (this.vertical) window.scrollBy(0, -deltaY)
    },
    handleRailDrag (deltaX) {
      this.$refs.content.scrollLeft += deltaX / this.coefficient
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
    background: linear-gradient(to top, rgba(255,255,255, 1), rgba(255,255,255, 1), rgba(255,255,255, 0.5));
    z-index: 5;

    &::before{
      content: '';
      position: absolute;
      height: 4rem;
      top: -100%;
      z-index: 2;
      width: 100%;
      opacity: 0;
      transition: opacity 200ms ease-in-out;
      pointer-events: none;
      left: 0;
      background: linear-gradient(to top, rgba(0,0,0, .08), rgba(0,0,0, 0));
    }

    &.stick {
      &::before {
        opacity: 1;
      }
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
