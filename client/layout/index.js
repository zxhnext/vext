// import Vue from "vue ";
function changeStr(str) {
    // 首字母大写
    return str.charAt(0).toUpperCase() + str.slice(1);
}
// 找到所有vue文件
const requireComponent = require.context('./', false, /\.vue$/)
const install = (Vue) => {
    requireComponent.keys().forEach((fileName) => {
        let config = requireComponent(fileName);
        let componentName = changeStr(
            fileName.replace(/^\.\//, "").replace(/\.\w+$/, "")
        );
        Vue.component(componentName, config.default || config);
    });
};
export default {
    install,
}
