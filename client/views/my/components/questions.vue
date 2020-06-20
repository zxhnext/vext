<template>
    <div class="questions">
        <nut-textinput
            class="mt15"
            v-model="params.title"
            placeholder="请输入您的问题"
            maxlength="20"
        />
        <nut-textbox class="mt15" :maxNum="100" :placeText="'请详细描述您的问题'" v-model="params.description"> </nut-textbox>
        <nut-button 
            class="mt15"
            block 
            shape="circle"
            @click="createQuestions"
        >
            提交
        </nut-button>
    </div>
</template>
<script>
import { textinput, textbox, button } from '@nutui/nutui';
export default {
    components: {
        [textinput.name]: textinput,
        [textbox.name]: textbox,
        [button.name]: button
    },
    data() {
        return {
            params: {
                title: '',
                description: ''
            }
        }
    },
    methods: {
        createQuestions() {
            this.$api.createQuestions(this.params)
        }
    }
}
</script>
<style lang="stylus" scoped>
.mt15
    margin-top .9375rem
</style>