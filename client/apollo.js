import gql from 'graphql-tag' //引入graphql
const apollo = {
    getUsers: gql `
        query {
            getUsers {
                name
            }
        }

    `,
    createUsers: gql `
        mutation($name: String, $password: String) {
            createUsers(name: $name, password: $password) {
                name,
                password
            }
        }
    `
}

export default apollo
