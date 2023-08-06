export default class Material {
  constructor(Cesium) {
    this.Cesium = Cesium
    this._installMaterial(Cesium)
  }

  // 获得渐变材质
  getLinearGradintMaterial(colors, options = {}) {
    if (!colors) return
    const Cesium = this.Cesium
    const canvas = document.createElement('canvas')
    const { width = 1, height = 100, materialOptions = {} } = options
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    // 创建渐变色
    const position = [
      [0, 0],
      [0, height]
    ]
    const linearGradient = ctx.createLinearGradient(...position.flat())
    if (Array.isArray(colors)) {
      colors.forEach((color) => {
        if (Array.isArray(color)) {
          linearGradient.addColorStop(...color.flat())
        }
      })
    }
    ctx.fillStyle = linearGradient
    ctx.fillRect(0, 0, 1, 100)
    return canvas.toDataURL('image/png')
    // return new Cesium.ImageMaterialProperty({
    //   image: canvas,
    //   transparent: true,
    //   // repeat: new Cesium.Cartesian2(200,1),
    //   ...materialOptions
    // })
  }

  _installMaterial(Cesium) {
    this._installWaveCircleMaterial(Cesium)
    this._installDynamicWallMaterialProperty(Cesium)
    // 雷达
    this._installRadarLineMaterial(Cesium)
  }

  _installDynamicWallMaterialProperty(Cesium) {
    /**
     * @description:动态立体墙材质
     * @date: 2022-02-11
     */

    //动态墙材质
    function DynamicWallMaterialProperty(options) {
      // 默认参数设置
      this._definitionChanged = new Cesium.Event()
      this._color = undefined
      this._colorSubscription = undefined
      this.color = options.color
      this.duration = options.duration
      this.trailImage = options.trailImage
      this._time = new Date().getTime()
      this.viewer = options.viewer
    }
    Object.defineProperties(DynamicWallMaterialProperty.prototype, {
      isConstant: {
        get: function () {
          return false
        }
      },
      definitionChanged: {
        get: function () {
          return this._definitionChanged
        }
      },
      color: Cesium.createPropertyDescriptor('color')
    })
    DynamicWallMaterialProperty.prototype.getType = function (time) {
      return 'DynamicWall'
    }
    DynamicWallMaterialProperty.prototype.getValue = function (time, result) {
      if (!Cesium.defined(result)) {
        result = {}
      }
      result.color = Cesium.Property.getValueOrClonedDefault(
        this._color,
        time,
        Cesium.Color.WHITE,
        result.color
      )
      if (this.trailImage) {
        result.image = this.trailImage
      } else {
        result.image = Cesium.Material.DynamicWallImage
      }

      if (this.duration) {
        result.time = ((new Date().getTime() - this._time) % this.duration) / this.duration
      }
      // this.viewer.scene.requestRender()
      // Cesium.Scene.requestRender()
      return result
    }
    DynamicWallMaterialProperty.prototype.equals = function (other) {
      return (
        this === other ||
        (other instanceof DynamicWallMaterialProperty &&
          Cesium.Property.equals(this._color, other._color))
      )
    }
    Cesium.Scene.DynamicWallMaterialProperty = DynamicWallMaterialProperty
    Cesium.Material.DynamicWallType = 'DynamicWall'
    const image = this.getLinearGradintMaterial([
      [0, '#000'],
      [0.5, '#f0f'],
      [1, '#0f0']
    ])
    console.log(image)
    Cesium.Material.DynamicWallImage = '/img/mark.png'
    //  './img/sky.jpg'

    Cesium.Material.DynamicWallSource =
      'czm_material czm_getMaterial(czm_materialInput materialInput)\n\
      {\n\
      czm_material material = czm_getDefaultMaterial(materialInput);\n\
      vec2 st = materialInput.st;\n\
      vec4 colorImage = texture(image, vec2(fract(st.t - time), st.t));\n\
      vec4 fragColor;\n\
      fragColor.rgb = color.rgb / 1.0;\n\
      fragColor = czm_gammaCorrect(fragColor);\n\
      material.alpha = colorImage.a * color.a;\n\
      material.diffuse = color.rgb;\n\
      material.emission = fragColor.rgb;\n\
      return material;\n\
      }'
    Cesium.Material._materialCache.addMaterial(Cesium.Material.DynamicWallType, {
      fabric: {
        type: Cesium.Material.DynamicWallType,
        uniforms: {
          color: new Cesium.Color(1.0, 1.0, 1.0, 1),
          image: Cesium.Material.DynamicWallImage,
          time: 0
        },
        source: Cesium.Material.DynamicWallSource
      },
      translucent: function (material) {
        return true
      }
    })
  }

  // 波动圆材质
  _installWaveCircleMaterial(Cesium) {
    var _self = this,
      Color = Cesium.Color,
      defaultValue = Cesium.defaultValue,
      defineProperties = Object.defineProperties,
      Event = Cesium.Event,
      Property = Cesium.Property,
      Material = Cesium.Material

    // 波动圆
    function _getDynamicCircleShader(options) {
      if (options && options.get) {
        return 'uniform vec4 color;\n\
              uniform float duration;\n\
              uniform float count;\n\
              uniform float gradient;\n\
              \n\
              czm_material czm_getMaterial(czm_materialInput materialInput)\n\
              {\n\
                  czm_material material = czm_getDefaultMaterial(materialInput);\n\
                  material.diffuse = 1.5 * color.rgb;\n\
                  vec2 st = materialInput.st;\n\
                  vec3 str = materialInput.str;\n\
                  float dis = distance(st, vec2(0.5, 0.5));\n\
                  float per = fract(czm_frameNumber / duration);\n\
                  if(abs(str.z) > 0.001){\n\
                      discard;\n\
                  }\n\
                  if(dis > 0.5){\n\
                      discard;\n\
                  } else {\n\
                      float perDis = 0.5 / count;\n\
                      float disNum;\n\
                      float bl = .0;\n\
                      for (int i = 0; i <= 10; i++) {\n\
                          if (float(i) <= count) {\n\
                              disNum = perDis * float(i) - dis + per / count;\n\
                              if (disNum > 0.0) {\n\
                                  if (disNum < perDis) {\n\
                                      bl = 1.0 - disNum / perDis;\n\
                                  } else if (disNum - perDis < perDis) {\n\
                                      bl = 1.0 - abs(1.0 - disNum / perDis);\n\
                                  }\n\
                                  material.alpha = pow(bl, gradient);\n\
                              }\n\
                          }\n\
                      }\n\
                  }\n\
                  return material;\n\
              }\n\
              '
      }
    }

    function CircleWaveMaterialProperty(options) {
      options = options || {}
      this._definitionChanged = new Event()
      this._color = undefined
      this._colorSubscription = undefined
      this._duration = undefined
      this._durationSubscription = undefined
      this.color = defaultValue(options.color, Color.fromBytes(0, 255, 255, 255))
      this.duration = defaultValue(options.duration, 45)
      this.count = Math.max(defaultValue(options.count, 2), 1)
      this.gradient = defaultValue(options.gradient, 0.1)
      if (this.gradient < 0) {
        this.gradient = 0
      } else if (this.gradient > 1) {
        this.gradient = 1
      }
    }

    defineProperties(CircleWaveMaterialProperty.prototype, {
      isConstant: {
        get: function () {
          return false
        }
      },
      definitionChanged: {
        get: function () {
          return this._definitionChanged
        }
      }
    })

    CircleWaveMaterialProperty.prototype.getType = function () {
      return Material.CircleWaveType
    }
    CircleWaveMaterialProperty.prototype.getValue = function (time, result) {
      if (!result) {
        result = {}
      }
      result.color = Property.getValueOrUndefined(this._color, time)
      result.duration = this._duration
      result.count = this.count
      result.gradient = this.gradient
      return result
    }
    CircleWaveMaterialProperty.prototype.equals = function (other) {
      return (
        this === other ||
        (other instanceof CircleWaveMaterialProperty &&
          Cesium.Property.equals(this._color, other._color))
      )
    }

    defineProperties(CircleWaveMaterialProperty.prototype, {
      color: Cesium.createPropertyDescriptor('color'),
      duration: Cesium.createPropertyDescriptor('duration')
    })

    Cesium.Scene.CircleWaveMaterialProperty = CircleWaveMaterialProperty
    Material.CircleWaveType = 'CircleWave'
    Material._materialCache.addMaterial(Material.CircleWaveType, {
      fabric: {
        type: Material.CircleWaveType,
        uniforms: {
          color: new Color(1.0, 0.0, 0.0, 0.7),
          duration: 45,
          count: 1,
          gradient: 0.1
        },
        source: _getDynamicCircleShader({
          get: true
        })
      },

      translucent: function () {
        return true
      }
    })
  }

  // 雷达扫描
  _installRadarLineMaterial(Cesium) {
    /*
     * @Description: 雷达线效果（参考开源代码）
     * @Version: 1.0
     * @Author: Julian
     * @Date: 2022-03-04 19:27:08
     * @LastEditors: Julian
     * @LastEditTime: 2022-03-04 19:29:58
     */
    class RadarLineMaterialProperty {
      constructor(options) {
        this._definitionChanged = new Cesium.Event()
        this._color = undefined
        this._speed = undefined
        this.color = options.color
        this.speed = options.speed
      }

      get isConstant() {
        return false
      }

      get definitionChanged() {
        return this._definitionChanged
      }

      getType(time) {
        return Cesium.Material.RadarLineMaterialType
      }

      getValue(time, result) {
        if (!Cesium.defined(result)) {
          result = {}
        }

        result.color = Cesium.Property.getValueOrDefault(
          this._color,
          time,
          Cesium.Color.RED,
          result.color
        )
        result.speed = Cesium.Property.getValueOrDefault(this._speed, time, 10, result.speed)
        return result
      }

      equals(other) {
        return (
          this === other ||
          (other instanceof RadarLineMaterialProperty &&
            Cesium.Property.equals(this._color, other._color) &&
            Cesium.Property.equals(this._speed, other._speed))
        )
      }
    }

    Object.defineProperties(RadarLineMaterialProperty.prototype, {
      color: Cesium.createPropertyDescriptor('color'),
      speed: Cesium.createPropertyDescriptor('speed')
    })

    Cesium.Scene.RadarLineMaterialProperty = RadarLineMaterialProperty
    Cesium.Material.RadarLineMaterialProperty = 'RadarLineMaterialProperty'
    Cesium.Material.RadarLineMaterialType = 'RadarLineMaterialType'
    Cesium.Material.RadarLineMaterialSource = `
      uniform vec4 color;
      uniform float speed;

      czm_material czm_getMaterial(czm_materialInput materialInput){
      czm_material material = czm_getDefaultMaterial(materialInput);
      vec2 st = materialInput.st * 2.0 - 1.0;
      float t = czm_frameNumber * speed / 1000.0 ;
      vec3 col = vec3(0.0);
      vec2 p = vec2(sin(t), cos(t));
      float d = length(st - dot(p, st) * p);
      if (dot(st, p) < 0.) {
          d = length(st);
      }

      col = .006 / d * color.rgb;

      if(distance(st,vec2(0)) >  0.99 ){
          col =color.rgb;
      }

      material.alpha  = pow(length(col),2.0);
      material.diffuse = col * 3.0 ;
      return material;
      }
   `

    Cesium.Material._materialCache.addMaterial(Cesium.Material.RadarLineMaterialType, {
      fabric: {
        type: Cesium.Material.RadarLineMaterialType,
        uniforms: {
          color: new Cesium.Color(1.0, 0.0, 0.0, 1.0),
          speed: 10.0
        },
        source: Cesium.Material.RadarLineMaterialSource
      },
      translucent: function (material) {
        return true
      }
    })
  }
}
