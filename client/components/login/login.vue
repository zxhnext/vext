<template>
    <nut-popup
        round
        closeable
        close-icon-position="top-right"
        :style="{ padding: '30px 20px' }"
        v-model="show"
    >
        <nut-textinput
            v-model="params.name"
            label="账号："
            placeholder="请输入用户名"
            :clearBtn="true"
            :disabled="false"
        />
        <nut-textinput
            v-model="params.password"
            placeholder="请输入密码"
            label="密码："
            type="password"
        />
        <nut-buttongroup>
            <nut-button @click="login">
                登录
            </nut-button>
            <nut-button @click="create">
                注册
            </nut-button>
        </nut-buttongroup>
    </nut-popup>
</template>
<script>
import { popup, textinput, buttongroup, button } from "@nutui/nutui";
export default {
    components: {
        [popup.name]: popup,
        [textinput.name]: textinput,
        [buttongroup.name]: buttongroup,
        [button.name]: button
    },
    data() {
        return {
            show: true,
            params: {
                name: "",
                password: ""
            }
        };
    },
    methods: {
        init() {
            this.show = true;
        },
        login() {
            this.$api.login(this.params).then(res => {
                localStorage.setItem("userinfo", JSON.stringify(res.data.user));
                localStorage.setItem("token", res.data.token);
            });
        },
        create() {
            this.$api.create(this.params);
        }
    }
};
</script>
<style lang="stylus" scoped>
.popup-bg /deep/
    z-index 9999
.popup-box /deep/
    z-index 10000
    .nut-textinput
        width 70vw
        margin .9375rem 0
</style>
