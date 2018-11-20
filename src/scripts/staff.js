import Transformation from './transformation'
import Raycasting from './raycasting'
import vert from '../shaders/staff.vert'
import frag from '../shaders/staff.frag'

class Staff {
  constructor({size = 20, definition = 200} = {}) {
    this._size = size
    this._definition = definition
    this.transformation = new Transformation({rotation: [0, 0, 0]})
    this.raycasting = new Raycasting({staff: this})
    this.primitive = 'lines'
    this.width = 2
    this.deviation = 10
    this.baseDeviation = 0
    this.color = false

    this.updatePosition()
  }

  get size() {
    return this._size
  }

  set size(v) {
    this._size = v
    this.updatePosition()
  }

  get definition() {
    return this._definition
  }

  set definition(v) {
    this._definition = v
    this.updatePosition()
  }

  bind(regl) {
    const draw = regl({
      vert,
      frag,
      primitive: () => this.primitive,
      count: regl.context('count'),
      lineWidth: () => this.width,
      context: {
        transformation: () => this.transformation.matrix,
        size: () => this.size,
        count: () => this.count,
        position: () => this.position,
      },
      uniforms: {
        transformation: regl.context('transformation'),
        size: regl.context('size'),
        raycasting_mouse: regl.context('raycastingMouse'),
        width: () => this.width,
        deviation: () => this.deviation,
        base_deviation: () => this.baseDeviation,
        color: () => this.color,
      },
      attributes: {
        position: regl.context('position')
      }
    })

    this.draw = (...args) => this.raycasting.draw(() => draw(...args))

    this.raycasting.bind(regl)

    return this
  }

  expose(gui) {
    gui.add(this, 'size', 5, 999, 1)
    gui.add(this, 'definition', 5, 999, 1)
    gui.add(this, 'width', 0.01, 10, 0.001)
    gui.add(this, 'deviation', 0, 40, 0.001)
    gui.add(this, 'baseDeviation', 0, 1, 0.001).name('base deviation')
    gui.add(this, 'color')
    gui.add(this, 'primitive', ['lines', 'points'])

    const raycasting = gui.addFolder('raycasting')
    raycasting.open()
    this.raycasting.expose(raycasting)

    const transformation = gui.addFolder('transformation')
    transformation.open()
    this.transformation.expose(transformation)
  }

  updatePosition() {
    const vertexXMaximum = this.definition/2
    const verticesPerLine = this.definition*2
    const coordinatesPerLine = verticesPerLine*2

    this.count = this.size*verticesPerLine

    var x = index => Math.round(index%coordinatesPerLine/4)/vertexXMaximum*2 - 2
    var z = index => Math.floor(index/coordinatesPerLine)/this.size - 0.5

    this.position = new Array(this.size*coordinatesPerLine).fill().map((_, index) => index%2 === 0 ? x(index) : z(index))

    this.raycasting.updatePosition()
  }
}

export default Staff