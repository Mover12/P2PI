const path = require('path');

module.exports = (env) => {
    return {
        mode: 'production',
        entry: {
            client: path.resolve(__dirname, 'src', 'index.js')
        },
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: 'server.[contenthash].js',
            clean: true
        }
    }
};