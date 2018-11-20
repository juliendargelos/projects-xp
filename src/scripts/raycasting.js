import vert from '../shaders/raycasting.vert'
import frag from '../shaders/raycasting.frag'

class Raycasting {
  constructor({staff, easing = 0.1}) {
    this.staff = staff
    this.mouse = [0, 0]
    this.easing = easing
    this.display = false
    this.displayOffset = 0
    this.hover = false
  }

  get transformation() {
    return this.staff.transformation
  }

  bind(regl) {
    this.framebuffer = regl.framebuffer(1, 1)

    const draw = regl({
      vert,
      frag,
      // primitive: 'points',
      count: 6,
      // framebuffer: ({viewportWidth, viewportHeight}) => {
      //   this.framebuffer.resize(viewportWidth, viewportHeight)
      //   return this.framebuffer
      // },
      context: {
        raycastingMouse: () => this.mouse
      },
      uniforms: {
        transformation: () => this.transformation.matrix,
        raycasting_mouse: regl.context('raycastingMouse'),
        offset: regl.prop('offset'),
        display: regl.prop('display')
      },
      blend: {
        enable: true,
        func: {
          srcRGB: 'src alpha',
          srcAlpha: 1,
          dstRGB: 'one minus src alpha',
          dstAlpha: 1
        },
        equation: {
          rgb: 'add',
          alpha: 'add'
        },
        color: [0, 0, 0, 0]
      },
      attributes: {
        position: () => this.position
      }
    })

    this.draw = (props, block) => {
      if(typeof props === 'function') {
        block = props
        props = {}
      }

      draw(props, context => {
        if(context.framebufferWidth !== this.framebuffer.width || context.framebufferHeight !== this.framebuffer.height) {
          this.framebuffer({
            width: context.framebufferWidth,
            height: context.framebufferHeight
          })
        }
        else {
          regl.clear({color: [0, 0, 0, 0], depth: 1, framebuffer: this.framebuffer})
          this.framebuffer.use(() => draw({offset: 0, display: false}))

          const color = regl.read({
            x: context.mouse[0]*this.framebuffer.width,
            y: (1 - context.mouse[1])*this.framebuffer.height - 1,
            width: 1,
            height: 1,
            framebuffer: this.framebuffer
          })

          var [previousX, previousY] = this.mouse

          if(color[3] !== 0) {
            if(!this.hover) {
              this.hover = true
              previousX = 1
              previousY = -1
            }

            const x = ((color[0]/255 - 0.25)*2 - 0.5)*2
            const y = (color[1]*2/255 - 0.5)*2

            this.mouse[0] += (x - previousX)*this.easing
            this.mouse[1] += (y - previousY)*this.easing
          }
          else {
            if(this.hover) this.hover = false
            this.mouse[0] += (1 - previousX)*this.easing
            this.mouse[1] += (-1 - previousY)*this.easing
          }
        }

        if(typeof block === 'function') block(context)
        if(this.display) draw({offset: this.displayOffset, display: true})
      })
    }

    return this
  }

  expose(gui) {
    gui.add(this, 'easing', 0.001, 1, 0.001)
    gui.add(this, 'display')
    gui.add(this, 'displayOffset', -0.5, 0.5, 0.001).name('display offset')
  }

  updatePosition() {
    const [x1, y1] = this.staff.position.slice(0, 2)
    const [x2, y2] = this.staff.position.slice(-2)

    this.position = [
      x1, y1,
      x2, y1,
      x2, y2,
      x2, y2,
      x1, y2,
      x1, y1
    ]
  }
}

export default Raycasting