<template>
    <nut-tabbar @tab-switch="tabSwitch" :tabbar-list="tabList" :bottom="true">
    </nut-tabbar>
</template>
<script>
import { tabbar } from "@nutui/nutui";
export default {
    components: {
        [tabbar.name]: tabbar
    },
    data() {
        return {
            tabList: [
                {
                    tabTitle: "首页",
                    curr: true,
                    icon:
                        "http://img13.360buyimg.com/uba/jfs/t1/29316/38/1115/3203/5c0f3d61E35d0c7da/9e557f2cb5c9dab6.jpg",
                    activeIcon:
                        "http://img20.360buyimg.com/uba/jfs/t1/9996/36/8646/4833/5c0f3d61E7c1b7e0f/c98ad61124172e93.jpg",
                    push: "/"
                },
                {
                    tabTitle: "我的",
                    curr: false,
                    icon:
                        "http://img20.360buyimg.com/uba/jfs/t1/20004/20/1045/3620/5c0f3d61Eaaec1670/9e59db63983b7b9f.jpg",
                    activeIcon:
                        "http://img14.360buyimg.com/uba/jfs/t1/23967/14/1072/6714/5c0f3d61E0ad8991e/8f741953f6e38f15.jpg",
                    push: "/my"
                }
            ]
        };
    },
    methods: {
        tabSwitch: function(value, index) {
            this.tabList.map((val, ind) => {
                val.curr = ind === index ? true : false;
            });
            this.$router.push(value.push);
        }
    }
};
</script>
<style lang="stylus" scoped></style>
