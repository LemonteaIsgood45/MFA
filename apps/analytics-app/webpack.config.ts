import path from "path";
import dotenv from "dotenv";
import HtmlWebpackPlugin from "html-webpack-plugin";
import webpack from "webpack";
import type { Configuration } from "webpack";
import "webpack-dev-server";

dotenv.config();

const { ModuleFederationPlugin } = webpack.container;
const { DefinePlugin } = webpack;

const isProd = process.env.NODE_ENV === "production";
const backendUrl = process.env.BACKEND_URL ?? "http://localhost:4000";

const config: Configuration = {
  mode: isProd ? "production" : "development",
  entry: "./src/index.ts",
  devServer: {
    port: 5002,
    host: "0.0.0.0",
    allowedHosts: "all", 
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
    },
  },
  output: {
    publicPath: "auto",
    path: path.resolve(process.cwd(), "dist"),
    clean: true,
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      "@": path.resolve(process.cwd(), "src"),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "analyticsApp",
      filename: "remoteEntry.js",
      exposes: {
        "./Dashboard": "./src/components/Dashboard",
      },
      shared: {
        react: {
          singleton: true,
          strictVersion: true,
          requiredVersion: "^18.3.1",
        },
        "react-dom": {
          singleton: true,
          strictVersion: true,
          requiredVersion: "^18.3.1",
        },
        zustand: {
          singleton: true,
          requiredVersion: "^4.5.4",
        },
        "@mfa/shared-store": {
          singleton: true,
          strictVersion: false,
          requiredVersion: "*",
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new DefinePlugin({
      "process.env.BACKEND_URL": JSON.stringify(backendUrl),
    }),
  ],
};

export default config;