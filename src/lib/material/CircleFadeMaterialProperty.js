function installCircleFadeMaterialProperty(Cesium) {
  class CircleFadeMaterialProperty {
    constructor(options) {
      this._definitionChanged = new Cesium.Event()
      this._color = undefined
      this._colorSubscription = undefined
      this.color = Cesium.defaultValue(options.color, new Cesium.Color(0, 0, 0, 0))
      this._duration = options.duration || 1e3
      this._time = undefined
      this.init()
    }

    getShader() {
      return `
        uniform vec4 color;
        uniform float speed;
        czm_material czm_getMaterial(czm_materialInput materialInput)\n
        {\n
            czm_material material = czm_getDefaultMaterial(materialInput);\n
            material.diffuse = 1.5 * color.rgb;\n
            vec2 st = materialInput.st;\n
            float dis = distance(st, vec2(0.5, 0.5));\n
            float per = fract(time);\n
            if(dis > per * 0.5){\n
                //material.alpha = 0.0;\n
                discard;\n
            }else {\n
                material.alpha = color.a  * dis / per / 2.0;\n
            }\n
            return material;\n
        }`
    }

    get isConstant() {
      return false
    }

    get definitionChanged() {
      return this._definitionChanged
    }

    getType() {
      return Cesium.Material.CircleFadeMaterialType
    }

    getValue(time, result) {
      if (!result) {
        result = {}
      }

      result.color = Cesium.Property.getValueOrClonedDefault(
        this._color,
        time,
        // new Cesium.Color(0, 0, 0, 0),
        result.color
      )

      if (this._time === undefined) {
        this._time = new Date().getTime()
      }

      result.time = (new Date().getTime() - this._time) / this._duration
      console.log(result.time)
      return result
    }

    equals(other) {
      return (
        other instanceof CircleFadeMaterialProperty &&
        Cesium.Property.equals(this._color, other._color)
      )
    }

    init() {
      Cesium.Material.CircleFadeMaterialType = 'CircleFadeMaterialType'

      Cesium.Material._materialCache.addMaterial(Cesium.Material.CircleFadeMaterialType, {
        fabric: {
          type: Cesium.Material.CircleFadeMaterialType,
          uniforms: {
            color: this.color,
            time: this.time
          },
          source: this.getShader()
        },
        translucent: function () {
          return !0
        }
      })
    }
  }

  Cesium.Scene.CircleFadeMaterialProperty = CircleFadeMaterialProperty
}

export { installCircleFadeMaterialProperty }
