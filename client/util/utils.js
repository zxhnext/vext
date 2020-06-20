const utils = {}

/**
 * 客户端  ssr环境判断
 * **/
utils.isClient = function() {
    return (typeof window !== 'undefined' && typeof document !== 'undefined')
}

export default utils