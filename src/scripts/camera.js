import * as glMatrix from 'gl-matrix'

class Camera {
  constructor({position = [0, 0, 0], target = [0, 0, 0], near = 0.00001, far = 100000, fov = Math.PI/4, aspect = 1} = {}) {
    this.set({position, target, fov, far, near, aspect})
  }

  get position() {
    return this._position
  }

  set position(v) {
    this.setVector('position', v).updateView()
  }

  get target() {
    return this._target
  }

  set target(v) {
    this.setVector('target', v).updateView()
  }

  get near() {
    return this._near
  }

  set near(v) {
    this._near = v
    this.updateProjection()
  }

  get far() {
    return this._far
  }

  set far(v) {
    this._far = v
    this.updateProjection()
  }

  get fov() {
    return this._fov
  }

  set fov(v) {
    this._fov = v
    this.updateProjection()
  }

  get aspect() {
    return this._aspect
  }

  set aspect(v) {
    this._aspect = v
    this.updateProjection()
  }

  bind(regl) {
    this.draw = regl({
      context: {
        projection: () => this.projection,
        view: () => this.view
      },

      uniforms: {
        view: regl.context('view'),
        projection: regl.context('projection')
      }
    })

    return this
  }

  expose(gui) {
    const position = gui.addFolder('position')
    position.open()
    position.add(this.position, '0', -10, 10).name('x').listen()
    position.add(this.position, '1', -10, 10).name('y').listen()
    position.add(this.position, '2', -10, 10).name('z').listen()

    const target = gui.addFolder('target')
    target.open()
    target.add(this.target, '0', -10, 10).name('x').listen()
    target.add(this.target, '1', -10, 10).name('y').listen()
    target.add(this.target, '2', -10, 10).name('z').listen()

    return this
  }

  setVector(name, vector, update) {
    this[`_${name}`] = new Proxy(Array.prototype.slice.call(vector), {
      set: (vector, component, value) => {
        vector[component] = value
        this.updateView()
        return true
      }
    })

    return this
  }

  set({position = null, target = null, fov = null, far = null, near = null, aspect = null}) {
    if(position !== null) this.setVector('position', position)
    if(target !== null) this.setVector('target', target)
    if(fov !== null) this._fov = fov
    if(far !== null) this._far = far
    if(near !== null) this._near = near
    if(aspect !== null) this._aspect = aspect
    return this.update()
  }

  update() {
    return this.updateProjection().updateView()
  }

  updateProjection() {
    this.projection = glMatrix.mat4.perspective([], this.fov, this.aspect, this.near, this.far)
    return this
  }

  updateView() {
    this.view = glMatrix.mat4.lookAt([], this.position, this.target, [0, 1, 0])
    return this
  }
}

export default Camera