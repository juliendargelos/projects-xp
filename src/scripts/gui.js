import dat from 'dat.gui'

class GUI {
  constructor({enabled}, models) {
    this.datGUI = null
    this.visibleTimeout = null
    this.opened = true
    this.visible = true
    this.models = models
    this.enabled = enabled
  }

  get container() {
    return this.datGUI ? this.datGUI.domElement : null
  }

  get enabled() {
    return !!this.datGUI
  }

  set enabled(v) {
    if(!!v === this.enabled) return

    if(v) {
      this.datGUI = new dat.GUI({hideable: false})
      this.container.parentNode.style.zIndex = 2
      this.initialize()
    }
    else {
      this.datGUI.destroy()
      this.datGUI = null
    }
  }

  get disabled() {
    return !this.enabled
  }

  set disabled(v) {
    this.enabled = !v
  }

  get visible() {
    return this._visible
  }

  set visible(v) {
    v = !!v
    if(v === this.visible) return
    this._visible = v

    if(this.enabled) {
      clearTimeout(this.visibleTimeout)
      this.container.style.transition = `transform ${this.constructor.transitionDuration/1000}s ease-${v ? 'out' : 'in'}`
      this.container.style.transform = `translateX(${v ? 0 : 'calc(100% + 15px)'})`

      this.visibleTimeout = setTimeout(() => { this.container.style.transition = null }, this.constructor.transitionDuration)
    }
  }

  get hidden() {
    return !this.visible
  }

  set hidden(v) {
    this.visible = !v
  }

  get opened() {
    return this._opened
  }

  set opened(v) {
    this._opened = !!v
    if(this.enabled) this.datGUI[v ? 'open' : 'close']()
  }

  get closed() {
    return !this.opened
  }

  set closed(v) {
    this.opened = !v
  }

  disable() {
    this.disabled = true
    return this
  }

  enable() {
    this.enabled = true
    return this
  }

  show() {
    this.visible = true
    return this
  }

  hide() {
    this.hidden = true
    return this
  }

  open() {
    this.opened = true
    return this
  }

  close() {
    this.closed = true
    return this
  }

  toggle() {
    this[this.visible ? 'hide' : 'show']()
  }

  initialize() {
    this.visible = this.visible
    this.opened = this.opened

    this.models.forEach(model => {
      if(typeof model.expose === 'function') model.expose(this.folder(model))
    })

    return this
  }

  folder(model) {
    var folder = this.datGUI.addFolder(model.constructor.name.replace(/([^A-Z])([A-Z]+)/g, '$1 $2').toLowerCase())
    if(this.opened) folder.open()
    return folder
  }

  static transitionDuration = 200
}

export default GUI