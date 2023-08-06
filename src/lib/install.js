import Material from './material/index'

// 注入材质
const INSTALL_CESIUM_EXTEND = (Cesium) => {
    new Material(Cesium)
    return Cesium
}

export default INSTALL_CESIUM_EXTEND