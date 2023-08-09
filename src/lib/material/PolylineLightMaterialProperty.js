function installPolylineLightMaterialProperty(Cesium) {
  class PolylineLightMaterialProperty {
    constructor(options) {
      this._definitionChanged = new Cesium.Event()
      this._color = undefined
      this._image = options.image
      this._colorSubscription = undefined
      this.color = options.color || Cesium.Color.BLUE
      this.duration = options.duration || 1000
      this._time = undefined
      // this.init()
    }

    get isvarant() {
      return false
    }

    get definitionChanged() {
      return this._definitionChanged
    }

    getType(time) {
      return Cesium.Material?.PolylineLightMaterialType
    }

    getValue(time, result) {
      if (!Cesium.defined(result)) {
        result = {}
      }

      result.color = Cesium.Property.getValueOrClonedDefault(
        this._color,
        time,
        Cesium.Color.WHITE,
        result.color
      )

      result.image = this._image

      if (this._time === undefined) {
        this._time = time.secondsOfDay
      }

      result.time = ((time.secondsOfDay - this._time) * 1000) / this.duration

      return result
    }

    equals(other) {
      return (
        this === other ||
        (other instanceof PolylineLightMaterialProperty &&
          Cesium.Property.equals(this._color, other._color))
      )
    }

    init() {
      console.log(123123)
      Cesium.Material.PolylineLightMaterialSource = this.getShader()
      Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineLightMaterialType, {
        fabric: {
          type: Cesium.Material.PolylineLightMaterialType,
          uniforms: {
            color: this.color,
            image: this.image,
            time: this.time
          },
          source: Cesium.Material.PolylineLightMaterialSource
        },
        translucent: function () {
          return true
        }
      })
    }
    getShader() {
      return `czm_material czm_getMaterial(czm_materialInput materialInput)\n\
              {\n\
                  czm_material material = czm_getDefaultMaterial(materialInput);\n\
                  vec2 st = materialInput.st;\n\
                  \n\
                  if(texture(image, vec2(0.0, 0.0)).a == 1.0){\n\
                      discard;\n\
                  }else{\n\
                      material.alpha = texture(image, vec2(1.0 - fract(time - st.s), st.t)).a * color.a;\n\
                  }\n\
                  \n\
                  material.diffuse = max(color.rgb * material.alpha * 3.0, color.rgb);\n\
                  \n\
                  return material;\n\
              }\n\
              `
    }
  }
  Cesium.Material.PolylineLightMaterialProperty = 'PolylineLightMaterialProperty'
  Cesium.Material.PolylineLightMaterialType = 'PolylineLightMaterialType'
  Cesium.Scene.PolylineLightMaterialProperty = PolylineLightMaterialProperty
  Cesium.Material.PolylineLightMaterialSource = `czm_material czm_getMaterial(czm_materialInput materialInput)\n\
              {\n\
                  czm_material material = czm_getDefaultMaterial(materialInput);\n\
                  vec2 st = materialInput.st;\n\
                  \n\
                  if(texture(image, vec2(0.0, 0.0)).a == 1.0){\n\
                      discard;\n\
                  }else{\n\
                      material.alpha = texture(image, vec2(1.0 - fract(time - st.s), st.t)).a * color.a;\n\
                  }\n\
                  \n\
                  material.diffuse = max(color.rgb * material.alpha * 3.0, color.rgb);\n\
                  \n\
                  return material;\n\
              }\n\
              `
  Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineLightMaterialType, {
    fabric: {
      type: Cesium.Material.PolylineLightMaterialType,
      uniforms: {
        color: Cesium.Color.RED,
        image: './img/colors.png',
        time: 20
      },
      source: Cesium.Material.PolylineLightMaterialSource
    },
    translucent: function () {
      return true
    }
  })
}
export { installPolylineLightMaterialProperty }
