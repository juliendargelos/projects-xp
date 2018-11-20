import Collection from './project/collection'
import vert from '../shaders/project.vert'
import frag from '../shaders/project.frag'

class Project {
  constructor({name, description, date, image}) {
    this.name = name
    this.description = description
    this.date = date
    this.image = image
    this.texture = null
  }

  bind(regl) {
    this.draw = regl({
      vert,
      frag,
      count: 6,
      framebuffer: (_, {image}) => (this.texture = regl.framebuffer(image.width, image.height)),
      attributes: {
        position: regl.buffer([
          -1, -1,
           1, -1,
          -1,  1,
          -1,  1,
           1, -1,
           1,  1
        ])
      },
      uniforms: {
        image: (_, {image}) => regl.texture(image)
      }
    })

    return this
  }

  load() {
    return new Promise((resolve, reject) => {
      var image = new Image()
      image.onload = () => {
        this.draw({image})
        resolve()
      }
      image.onerror = reject
      image.src = this.image
    })
  }

  static Collection = Collection
}

export default Project