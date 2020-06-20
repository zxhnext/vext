<template>
    <div class="my">
        <img class="avatar" />
        <div class="name">树深时见鹿</div>
        <div class="follow">
            <span>关注我的人</span>
            <span>|</span>
            <span>我关注的人</span>
        </div>
        <nut-tab @tab-switch="tabSwitch">
            <nut-tab-panel tab-title="话题"> </nut-tab-panel>
            <nut-tab-panel tab-title="回答"></nut-tab-panel>
            <nut-tab-panel tab-title="提问">
                <questions />
            </nut-tab-panel>
        </nut-tab>
    </div>
</template>
<script>
import { avatar, tab, tabPanel } from "@nutui/nutui";
import questions from "./components/questions.vue";
export default {
    components: {
        questions,
        [avatar.name]: avatar,
        [tab.name]: tab,
        [tabPanel.name]: tabPanel
    },
    asyncData({ store }) {
        return store.dispatch("getQuestionLists");
    },
    methods: {
        tabSwitch: function(index, event) {
            console.log(index + "--" + event.target);
        }
    }
};
</script>
<style lang="stylus" scoped>
.my
    padding .625rem 0
    .avatar
        width 6.25rem
        height 6.25rem
        border-radius 50%
        background red
        margin-left 50%
        transform translateX(-50%)
    .name
        text-align center
    .follow
        display flex
        justify-content center
        span
            margin .625rem
</style>
