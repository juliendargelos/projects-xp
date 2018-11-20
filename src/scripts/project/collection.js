class Collection extends Array {
  load() {
    return new Promise((resolve, reject) => {
      var count = 0
      this.forEach(project => {
        project.load()
          .then(() => { if(++count >= this.length) resolve() })
          .catch(reject)
      })
    })
  }
}

export default Collection