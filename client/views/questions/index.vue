<template>
    <div class="question">
        <div v-for="item of questionLists" :key="item._id">
            {{ item.title }}
        </div>
        <nut-button @click="createUser">点我注册</nut-button>
    </div>
</template>
<script>
import { button } from "@nutui/nutui";
import { mapState, mapActions } from "vuex";
import apollo from "../../apollo.js";
export default {
    asyncData({ store }) {
        return store.dispatch("getQuestionLists");
    },
    components: {
        [button.name]: button,
    },
    computed: {
        ...mapState(["questionLists"]),
    },
    created() {
        this.getGraphQlData();
        if (!this.questionLists.length) {
            this.getQuestionLists();
        }
    },
    methods: {
        ...mapActions(["getQuestionLists"]),
        getGraphQlData() {
            this.$apollo
                .query({
                    query: apollo.getUsers,
                    // 不要预取
                    // prefetch: false,
                    // 不要预取任何查询
                    // $prefetch: false
                    // variables: {
                    //     code: this.$route.params.code
                    // },
                    // client: "api" //如果请求不同的路径用client标识选的路径
                })
                .then((response) => {
                    console.log("response", response);
                })
                .catch((error) => {
                    console.log("error", error);
                });
        },
        createUser() {
            this.$apollo
                .mutate({
                    mutation: apollo.createUsers,
                    variables: { name: "aseee", password: "12455" },
                    // client: "api" //如果请求不同的路径用client标识选的路径
                })
                .then((response) => {
                    console.log("response", response);
                })
                .catch((error) => {
                    console.log("error", error);
                });
        },
    },
};
</script>
<style lang="stylus" scoped>
.question
    padding 30px
</style>
