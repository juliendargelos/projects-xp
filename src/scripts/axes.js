import Transformation from './transformation'
import vert from '../shaders/axes.vert'
import frag from '../shaders/axes.frag'

class Axes {
  constructor({length = 1, arrowLength = 0.057, arrowWidth = 0.462, width = 4, display = true} = {}) {
    this._length = length
    this._arrowLength = arrowLength
    this._arrowWidth = arrowWidth
    this.width = width
    this.display = display

    this.updatePosition()
  }

  get length() {
    return this._length
  }

  set length(v) {
    this._length = v
    this.updatePosition()
  }

  get arrowLength() {
    return this._arrowLength
  }

  set arrowLength(v) {
    this._arrowLength = v
    this.updatePosition()
  }

  get arrowWidth() {
    return this._arrowWidth
  }

  set arrowWidth(v) {
    this._arrowWidth = v
    this.updatePosition()
  }

  bind(regl) {
    const draw = regl({
      vert,
      frag,
      primitive: 'lines',
      lineWidth: () => this.width,
      count: 18,
      attributes: {
        position: () => this.position
      }
    })

    this.draw = (...args) => this.display && draw(...args)

    return this
  }

  updatePosition() {
    const l = this.length
    const a = this.arrowLength
    const w = this.arrowWidth

    this.position = [
      0,     0, 0,    0,
      l,     0, 0,    0,
      l,     0, 0,    0,
      l - a, 0, -a*w, 0,
      l,     0, 0,    0,
      l - a, 0, a*w,  0,

      0,        0,     0,        1,
      0,        l,     0,        1,
      0,        l,     0,        1,
      -a*w*0.5, l - a, a*w*0.5,  1,
      0,        l,     0,        1,
      a*w*0.5,  l - a, -a*w*0.5, 1,

      0,    0, 0,     2,
      0,    0, l,     2,
      0,    0, l,     2,
      -a*w, 0, l - a, 2,
      0,    0, l,     2,
      a*w,  0, l - a, 2
    ]
  }

  expose(gui) {
    gui.add(this, 'display')
    gui.add(this, 'length', 0.01, 3, 0.001)
    gui.add(this, 'width', 0.1, 10, 0.001)
    gui.add(this, 'arrowLength', 0.01, 3, 0.001).name('arrow length')
    gui.add(this, 'arrowWidth', 0.01, 3, 0.001).name('arrow width')
  }
}

export default Axes