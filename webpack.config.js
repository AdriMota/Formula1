const path = require('path'); const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: './public/index.html',
    filename: 'index.html',
    inject: 'body'
})

module.exports = {
   //name: 'browser',
   // mode: 'development',
    entry: './src/index.js',
    output: {
        path: path.resolve('dist'),
        filename: 'index_bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
            {
                test: /\.csv$/, loader: 'csv-loader', options: {
                    dynamicTyping: true,
                    header: true,
                    skipEmptyLines: true
                }
            }
        ]
        
    },
    devServer: {
       // allowedHosts: 'all'
       hot: true
    },
    target: 'web',
    
    plugins: [HtmlWebpackPluginConfig]
}



/*
//"start": "webpack-dev-server"*/
