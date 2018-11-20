import * as glMatrix from 'gl-matrix'

class Transformation {
  constructor({rotation = [0, 0, 0], translation = [0, 0, 0], scale = [1, 1, 1], origin = [0, 0, 0]} = {}) {
    this.set({rotation, translation, scale, origin})
  }

  get rotation() {
    return this._rotation
  }

  set rotation(v) {
    this.setVector('rotation', v).update()
  }

  get translation() {
    return this._translation
  }

  set translation(v) {
    this.setVector('translation', v).update()
  }

  get scale() {
    return this._scale
  }

  set scale(v) {
    this.setVector('scale', v).update()
  }

  get origin() {
    return this._origin
  }

  set origin(v) {
    this.setVector('origin', v).update()
  }

  expose(gui) {
    const rotation = gui.addFolder('rotation')
    rotation.open()
    rotation.add(this.rotation, '0', -Math.PI, Math.PI, 0.001).name('x').listen()
    rotation.add(this.rotation, '1', -Math.PI, Math.PI, 0.001).name('y').listen()
    rotation.add(this.rotation, '2', -Math.PI, Math.PI, 0.001).name('z').listen()

    const translation = gui.addFolder('translation')
    translation.open()
    translation.add(this.translation, '0', -20, 20, 0.001).name('x').listen()
    translation.add(this.translation, '1', -20, 20, 0.001).name('y').listen()
    translation.add(this.translation, '2', -20, 20, 0.001).name('z').listen()

    const scale = gui.addFolder('scale')
    scale.open()
    scale.add(this.scale, '0', -20, 20, 0.001).name('x').listen()
    scale.add(this.scale, '1', -20, 20, 0.001).name('y').listen()
    scale.add(this.scale, '2', -20, 20, 0.001).name('z').listen()

    const origin = gui.addFolder('origin')
    origin.open()
    origin.add(this.origin, '0', -20, 20, 0.001).name('x').listen()
    origin.add(this.origin, '1', -20, 20, 0.001).name('y').listen()
    origin.add(this.origin, '2', -20, 20, 0.001).name('z').listen()
  }

  setVector(name, vector) {
    this[`_${name}`] = new Proxy(Array.prototype.slice.call(vector), {
      set: (vector, component, value) => {
        vector[component] = value
        this.update()
        return true
      }
    })

    return this
  }

  set({rotation = null, translation = null, scale = null, origin = null}) {
    if(rotation !== null) this.setVector('rotation', rotation)
    if(translation !== null) this.setVector('translation', translation)
    if(scale !== null) this.setVector('scale', scale)
    if(origin !== null) this.setVector('origin', origin)

    return this.update()
  }

  update() {
    var rotation = glMatrix.quat.fromEuler([], ...this.rotation.map(rotation => rotation/Math.PI*180))

    this.matrix = glMatrix.mat4.fromRotationTranslationScaleOrigin([], rotation, this.translation, this.scale, this.origin)

    return this
  }
}

export default Transformation