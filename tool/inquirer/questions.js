module.exports = async function getQuestions() {
    return {
        /**
         * 询问 使用什么 NETWORK_ENV
         */
        network_env_list: {
            type: 'list',
            name: 'network_env',
            choices: [
                { name: 'test', value: 'test' },
                { name: 'pre', value: 'pre' },
                { name: 'prod', value: 'prod' }
            ],
            message: `【单选】选择 NETWORK_ENV？`
        },
    }
}