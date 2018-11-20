import Regl from 'regl'
import Stats from 'stats.js'

import GUI from './gui'
import Camera from './camera'
import Staff from './staff'
import Axes from './axes'

class Application {
  constructor(container = document.body) {
    this._container = container
    this._width = 0
    this._height = 0
    this._aspect = 0
    this.time = 0
    this.date = 0
    this.resolution = [0, 0]
    this.unit = [0, 0]
    this.mouse = [0, 0]
    this.dragOrigin = [0, 0]
    this.frame = null
    this.rotate = true
    this.rotation = [0, 0]
    this.rotating = 1
    this.guiKeywordIndex = 0
    this.stepDelta = 1

    this.stats = new Stats()
    this.camera = new Camera({position: [-3.5, 2.8, 3.2]})
    this.staff = new Staff()
    this.axes = new Axes({display: false})
    this.gui = new GUI({enabled: this.constructor.guiEnabled}, [
      this,
      this.axes,
      this.camera,
      this.staff
    ])

    this.listeners = {
      resize: this.resize.bind(this),
      keydown: this.keydown.bind(this),
      dragstart: this.dragstart.bind(this),
      dragend: this.dragend.bind(this),
      drag: this.drag.bind(this),
      mousemove: this.mousemove.bind(this),
      mousewheel: this.mousewheel.bind(this)
    }

    this.initialize()
  }

  get container() {
    return this._container
  }

  set container(v) {
    const initialized = this.initialized
    const playing = this.playing
    this.destroy({stop: false})
    this._container = v

    if(initialized) {
      this.initialize({destroy: false})
      if(playing) this.play()
    }
  }

  get width() {
    return this._width
  }

  get height() {
    return this._height
  }

  get aspect() {
    return this._aspect
  }

  set aspect(v) {
    this._aspect = this.camera.aspect = v
  }

  get statsEnabled() {
    return !!(this.stats && this.stats.dom.parentNode)
  }

  set statsEnabled(v) {
    if(!!v !== this.statsEnabled) {
      if(v) this.container.appendChild(this.stats.dom)
      else this.stats.dom.parentNode.removeChild(this.stats.dom)
    }
  }

  get playing() {
    return !!this.frame
  }

  get initialized() {
    return !!this.regl
  }

  initialize({destroy = true} = {}) {
    if(destroy) this.destroy()

    this.regl = Regl({container: this.container})
    this.camera.bind(this.regl)
    this.staff.bind(this.regl)
    this.axes.bind(this.regl)
    this.gui.enabled = this.constructor.guiEnabled
    this.statsEnabled = this.constructor.statsEnabled

    this.setup = this.regl({
      context: {
        aspect: () => this.aspect,
        resolution: () => this.resolution,
        unit: () => this.unit,
        time: () => this.time,
        mouse: () => this.mouse,
      },
      uniforms: {
        aspect: this.regl.context('aspect'),
        resolution: this.regl.context('resolution'),
        unit: this.regl.context('unit'),
        time: this.regl.context('time'),
        mouse: this.regl.context('mouse'),
      }
    })

    this.resize()

    this.container.addEventListener('keydown', this.listeners.keydown)
    this.container.addEventListener('mousemove', this.listeners.mousemove)
    this.container.addEventListener('mousewheel', this.listeners.mousewheel)
    this.container.addEventListener('mousedown', this.listeners.dragstart)
    window.addEventListener('resize', this.listeners.resize)
  }

  destroy({stop = true} = {}) {
    if(this.initialized) {
      if(stop) this.stop()
      else this.pause()
      this.gui.disable()
      this.regl.destroy()
      this.regl = null
      this.statsEnabled = false
      this.container.removeEventListener('keydown', this.listeners.keydown)
      this.container.removeEventListener('mousemove', this.listeners.mousemove)
      this.container.removeEventListener('mousewheel', this.listeners.mousewheel)
      this.container.removeEventListener('mousedown', this.listeners.dragstart)
      window.removeEventListener('resize', this.listeners.resize)
    }

    return this
  }

  expose(gui) {
    gui.add(this, 'rotate')
    gui.add(this, 'statsEnabled').name('stats').listen()
    gui.add(this, 'stepDelta', 1, 1000, 1).name('step delta')
    gui.add(this, 'time').listen()
    gui.add(this, 'play')
    gui.add(this, 'pause')
    gui.add(this, 'start')
    gui.add(this, 'stop')
    gui.add({step: () => this.step(this.stepDelta)}, 'step')
    gui.add(this, 'draw')
  }

  draw() {
    this.clear().setup(() => {
      this.camera.draw(() => {
        this.staff.draw()
        this.axes.draw()
      })
    })

    return this
  }

  progress() {
    var date = Date.now()

    if(date !== this.date) {
      this.tick(date - this.date)
      this.date = date
    }

    return this
  }

  tick(delta = 1) {
    this.time += delta

    if(Math.abs(this.staff.transformation.rotation[0] - this.rotation[0]) > 0.003) {
      this.staff.transformation.rotation[0] += (this.rotation[0] - this.staff.transformation.rotation[0])*0.005*delta
      this.rotating = 0
    }

    if(Math.abs(this.staff.transformation.rotation[1] - this.rotation[1]) > 0.003) {
      this.staff.transformation.rotation[1] += (this.rotation[1] - this.staff.transformation.rotation[1])*0.005*delta
      this.rotating = 0
    }
    
    if(this.rotate) {
      this.staff.transformation.rotation[1] += delta*0.0005*Math.pow(this.rotating, 2)

      if(this.rotating) this.rotation[1] = this.staff.transformation.rotation[1]
      if(this.rotating !== 1) this.rotating = Math.min(1, this.rotating + delta*0.001)
    }

    return this
  }

  step(delta = 1) {
    this.tick(delta).draw()
    return this
  }

  clear() {
    this.regl.clear({color: [1, 1, 1, 255], depth: 1})
    return this
  }

  resetDate() {
    this.date = Date.now()
    return this
  }

  resetTime() {
    this.time = 0
    return this
  }

  play() {
    this.pause().resetDate().frame = this.regl.frame(() => {
      this.stats.begin()
      this.progress().draw()
      this.stats.end()
    })
    return this
  }

  pause() {
    if(this.playing) {
      this.frame.cancel()
      this.frame = null
    }

    return this
  }

  start() {
    return this.stop().play()
  }

  stop() {
    return this.pause().resetTime().draw()
  }

  mousemove({clientX, clientY}) {
    this.mouse[0] = clientX/this.width
    this.mouse[1] = clientY/this.height
    return this
  }

  resize() {
    const clientX = this.mouse[0]*this.width
    const clientY = this.mouse[1]*this.height

    this._width = this.container.offsetWidth
    this._height = this.container.offsetHeight
    this.aspect = this.width/this.height
    this.resolution = [this.width, this.height]
    this.unit = [1/this.width, 1/this.height]

    return this.mousemove({clientX, clientY}).draw()
  }

  keydown({target, key}) {
    if(target === this.container && key === this.constructor.guiKeyword[this.guiKeywordIndex]) {
      if(++this.guiKeywordIndex >= this.constructor.guiKeyword.length) this.gui.toggle()
      else return
    }

    if(this.guiKeywordIndex !== 0) this.guiKeywordIndex = 0
  }

  dragstart({target, clientX, clientY}) {
    if(target.tagName === 'CANVAS') {
      this.dragOrigin[0] = clientX
      this.dragOrigin[1] = clientY
      window.addEventListener('mousemove', this.listeners.drag)
      window.addEventListener('mouseup', this.listeners.dragend)
    }
  }

  dragend() {
    window.removeEventListener('mousemove', this.listeners.drag)
    window.removeEventListener('mouseup', this.listeners.dragend)
  }

  drag({clientX, clientY}) {
    this.rotation[0] = this.staff.transformation.rotation[0] - (this.dragOrigin[1] - clientY)*.05
    this.rotation[1] = this.staff.transformation.rotation[1] - (this.dragOrigin[0] - clientX)*.05
    this.dragOrigin[0] = clientX
    this.dragOrigin[1] = clientY
  }

  mousewheel({deltaY}) {
    this.camera.position[1] += deltaY*0.01
    console.log(deltaY)
  }
  
  static guiEnabled = true
  static statsEnabled = true
  static guiKeyword = 'super'
}

export default Application