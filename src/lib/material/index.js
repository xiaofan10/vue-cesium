import { installRadarLineMaterialProperty } from './RadarLineMaterialProperty'
import { installRadarWaveMaterialProperty } from './RadarWaveMaterialProprety'
import { installEllipsoidTrailMaterialProperty } from './EllipsoidTrailMaterialProperty'
import { installCircleWaveMaterialProperty } from './CircleWaveMatreialProperty'
import { installRadarScanMaterialProperty } from './RadarScanMaterialProperty'
import { installWallDiffuseMaterialProperty } from './WallDiffuseMaterialProprety'
import { installWallDynamicMaterialProperty } from './WallDynamicMaterialProperty'
import { installPolylineLightMaterialProperty } from './PolylineLightMaterialProperty'
import { installCircleFadeMaterialProperty } from './CircleFadeMaterialProperty'

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
    // ellipse 雷达材质
    installRadarLineMaterialProperty(Cesium)
    // ellipse 波纹雷达材质
    installRadarWaveMaterialProperty(Cesium)
    // ellipse 雷达图
    installRadarScanMaterialProperty(Cesium)
    // ellipsoid 球体轨迹光效材质
    installEllipsoidTrailMaterialProperty(Cesium)
    // ellipse 水波纹材质
    installCircleWaveMaterialProperty(Cesium)
    // wall 泛光材质
    installWallDiffuseMaterialProperty(Cesium)
    // 动态强材质
    installWallDynamicMaterialProperty(Cesium)
    // polyline
    installPolylineLightMaterialProperty(Cesium)

    installCircleFadeMaterialProperty(Cesium)
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
}
