import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

export default {
  mode: 'development',
  // mode: 'production',
  entry: './index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'index.js',
    path: resolve(dirname(fileURLToPath(import.meta.url)), 'dist'),
  },
  target: 'node',
  devtool: 'inline-source-map',
};