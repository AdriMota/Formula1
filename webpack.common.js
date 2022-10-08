const path = require('path');
 const HtmlWebpackPlugin = require('html-webpack-plugin');

 module.exports = {
   entry: {
     app: './src/index.js',
   },
   plugins: [
     new HtmlWebpackPlugin({
       title: 'Production',
     }),
   ],
   output: {
     path: path.resolve('dist'),
        filename: 'index_bundle.js'
   },
   module: {
    rules: [

      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        }
      },

      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: "postcss-loader",
            options: {
              plugins: () => [
                require("autoprefixer")()
              ],
            },
          },
          'sass-loader',
        ]
      }
    ]
  },
 };