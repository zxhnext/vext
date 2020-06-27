const axios = require("axios")
describe("node接口", function () {
    it("test接口测试", function (done) {
        axios.get('http://0.0.0.0:3333/questions')
            .then(function (response) {
                if (response.data) {
                    console.log('response.data', response.data)
                    done()
                } else {
                    done(new Error("数据请求格式错误"))
                }
            })
            .catch(function (error) {
                done(error)
            })
    }).timeout(1000000)
})

// 高级写法
// const superagent = require("superagent")
// const app = require("../server")
// function request(){
//     return superagent(app.listen())
// }
// request()
// .get("/questions")
// .expect("Content-Type",/json/)
// .expect(200)
// .end(function(err,res){
//     if(res.data){
//         console.log('res', res.data)
//         done()
//     }else{
//         done(err)
//     }
// })
