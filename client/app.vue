<template>
    <div id="app">
        <Header />
        <Footer />
        <transition name="fade" mode="out-in">
            <keep-alive>
                <router-view />
            </keep-alive>
        </transition>
    </div>
</template>

<script>
// import Header from './layout/header.vue'
// import Footer from './layout/footer.vue'

export default {
    // apollo: {
    //     // 不要预取
    //     prefetch: false
    // },
    metaInfo: {
        title: "app vue",
    },
    data() {
        return {
            val2: 22,
        };
    },
    components: {
        // Header,
        // Footer,
    },
    methods: {},
};
</script>

<style lang="stylus" scoped>
#app {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  #cover {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #999;
    opacity: 0.2;
    z-index: -1;
  }

  #loading {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(255, 255, 255, 0.3);
    z-index: 99;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
