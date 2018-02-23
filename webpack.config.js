const path = require("path");
const webpack = require("webpack");
const I18nPlugin = require("i18n-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

var development = process.env.NODE_ENV !== "production";
var languages = [];

process.traceDeprecation = true;

module.exports = {
    context: __dirname,
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "bundle.js"
    },
    devtool: development ? "inline-source-map" : false,
    entry: "./app/index.js",
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            ["babel-preset-react"], // ['presetName',{optionName:value}]
                            ["babel-preset-env"],
                            ["stage-0"]
                        ],
                        plugins: [
                            "react-html-attrs",
                            "transform-decorators-legacy",
                            "transform-class-properties",
                            "transform-react-jsx",
                            "transform-react-constant-elements"
                        ]
                    }
                }

            },
            // {
            //     test: require.resolve('react'),
            //     use: {
            //         loader: 'imports-loader',
            //         options: {
            //             shim: 'es5-shim/es5-shim',
            //             sham: 'es5-shim/es5-sham',
            //         },
            //     }
            // },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
                    // publicPath: development ? "http://localhost:8080" : "http://46.51.144.173"
                })
            },
            {
                test: /\.(scss)$/,
                use: [{
                    loader: 'style-loader', // inject CSS to page
                }, {
                    loader: 'css-loader',
                    options: {
                        modules: true,
                        importLoaders: 1,
                        sourceMap: true,
                        localIdentName: '[name]__[local]__[hash:base64:5]',
                    },
                    // translates CSS into CommonJS modules
                }, {
                    loader: 'postcss-loader', // Run post css actions
                    options: {
                        plugins: function () { // post css plugins, can be exported to postcss.config.js
                            return [
                                require('precss'),
                                require('autoprefixer')
                            ];
                        }
                    }
                }, {
                    loader: 'sass-loader' // compiles Sass to CSS
                }]
            },
            {
                test: /\.(png|gif|jpg|jpeg|webp)$/,
                use: [
                    // {
                    //     loader: "url-loader",
                    //     options: {
                    //         limit: 50000,
                    //         mimetype: "application/octet-stream",
                    //         fallback: "file-loader"
                    //     }
                    // },
                    {
                        loader: "file-loader",
                        options: {
                            name: "assets/images/[name].[ext]?[hash]",
                            publicPath: "/build/"
                        }
                    }

                ]
            },
            {
                test: /\.(eot|woff(2)?|ttf|svg)$/,
                use: [
                    // {
                    //     loader: "url-loader",
                    //     options: {
                    //         limit: 10000,
                    //         mimetype: "application/octet-stream",
                    //         fallback: "file-loader"
                    //     }
                    // },
                    {
                        loader: "file-loader",
                        options: {
                            name:"assets/fonts/[name].[ext]?[hash]",
                            publicPath: "/build/"
                        }
                    }
                ]
            },
            {
                test: /\.json$/,
                use: "json-loader"
            }
        ]
    },
    resolve: {
        extensions: [" ", ".js", ".jsx"],
        alias: {
            "assets": path.resolve(__dirname, "assets"),
            "config": path.resolve(__dirname, "config"),
            "app": path.resolve(__dirname, "app")
        }
    },
    devServer: {
        contentBase: "./",
        compress: true,
        historyApiFallback: true,
        port: 8081
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
        }),
        new ExtractTextPlugin({
            filename:"assets/css/[name].css",
            allChunks: true
        }),
        // new webpack.optimize.DedupePlugin(), WARNING in DedupePlugin: This plugin was removed from webpack. Remove it from your configuration.
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({mangle: false, sourcemap: false}),
        new I18nPlugin(languages),
        new CompressionPlugin(),
        new CleanWebpackPlugin(["build"])
    ],
    externals: {
        "api": JSON.stringify(development ? require("./config/development/api.json") : require("./config/production/api.json"))
    }
};
