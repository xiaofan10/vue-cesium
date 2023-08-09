function installWallDynamicMaterialProperty(Cesium) {
  var Color = Cesium.Color,
    defaultValue = Cesium.defaultValue,
    defined = Cesium.defined,
    defineProperties = Object.defineProperties,
    Event = Cesium.Event,
    createPropertyDescriptor = Cesium.createPropertyDescriptor,
    Property = Cesium.Property,
    Material = Cesium.Material,
    MaterialType = 'wallType' + parseInt(Math.random() * 1000)

  function _getDirectionWallShader(options) {
    if (options && options.get) {
      var materail =
        'czm_material czm_getMaterial(czm_materialInput materialInput)\n\
                  {\n\
                  czm_material material = czm_getDefaultMaterial(materialInput);\n\
                  vec2 st = materialInput.st;\n\
                  \n '
      if (options.freely == 'vertical') {
        //（由下到上）

        materail +=
          'vec4 colorImage = texture(image, vec2(fract(float(' +
          options.count +
          ')*st.t ' +
          options.direction +
          ' time), fract(st.s)));\n '
      } else {
        //（逆时针）

        materail +=
          'vec4 colorImage = texture(image, vec2(fract(float(' +
          options.count +
          ')*st.s ' +
          options.direction +
          ' time), fract(st.t)));\n '
      }
      //泛光
      materail +=
        'vec4 fragColor;\n\
                  fragColor.rgb = (colorImage.rgb+color.rgb) / 1.0;\n\
                  fragColor = czm_gammaCorrect(fragColor);\n '

      materail +=
        ' material.diffuse = colorImage.rgb;\n\
                  material.alpha = colorImage.a;\n\
                  material.emission = fragColor.rgb;\n\
                  \n\
                  return material;\n\
                  }\n\
                  '

      return materail
    }
  }

  const WallDynamicMaterialProperty = function (options) {
    options = defaultValue(options, defaultValue.EMPTY_OBJECT)
    this._definitionChanged = new Event()
    this._color = undefined
    this._colorSubscription = undefined
    this.color = options.color || Color.BLUE
    this.duration = options.duration || 3000
    this._time = new Date().getTime()
  }

  defineProperties(WallDynamicMaterialProperty.prototype, {
    isvarant: {
      get: function () {
        return false
      }
    },
    definitionChanged: {
      get: function () {
        return this._definitionChanged
      }
    },
    color: createPropertyDescriptor('color')
  })
  WallDynamicMaterialProperty.prototype.getType = function () {
    return MaterialType
  }
  WallDynamicMaterialProperty.prototype.getValue = function (time, result) {
    if (!defined(result)) {
      result = {}
    }
    result.color = Property.getValueOrClonedDefault(this._color, time, Color.WHITE, result.color)
    result.image = './img/color2.png'

    result.time = ((new Date().getTime() - this._time) % this.duration) / this.duration
    return result
  }
  WallDynamicMaterialProperty.prototype.equals = function (other) {
    return (
      this === other ||
      (other instanceof WallDynamicMaterialProperty && Property.equals(this._color, other._color))
    )
  }
  //动态墙
  Material._materialCache.addMaterial(MaterialType, {
    fabric: {
      type: MaterialType,
      uniforms: {
        color: new Color(1.0, 0.0, 0.0, 1),
        image: './img/color3.png',
        time: 0
      },
      source: _getDirectionWallShader({
        get: true,
        count: 0,
        freely: 'cross',
        direction: '+'
      })
    },
    translucent: function () {
      return true
    }
  })
  Cesium.Scene.WallDynamicMaterialProperty = WallDynamicMaterialProperty
}

export { installWallDynamicMaterialProperty }
