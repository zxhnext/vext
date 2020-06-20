import createApp from "./create-app"
import config from '../config/webpack.config'

const {
    app,
    router,
    // store
} = createApp({
    ssr: false,
})


if (config.isPWA && 'production' === process.env.NODE_ENV) {
    if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
            navigator.serviceWorker
                .register('/service-worker.js')
                .then(registration => {
                    console.log("service-worker registed", registration)
                })
                .catch(error => {
                    console.log("service-worker register error", error)
                })
        })
    }
}


// bus.$on('auth', () => {
//   router.push('/login')
// })

router.onReady(() => {
    app.$mount("#app")
})
