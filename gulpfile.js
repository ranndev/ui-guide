const path = require('path');
const resolvePlugin = require('rollup-plugin-node-resolve');
const commonPlugin = require('rollup-plugin-commonjs');
const registerCleanTask = require('./tasks/clean');
const registerBuildTask = require('./tasks/build');

const config = {
  dist: path.resolve(__dirname, 'dist'),
  src: path.relative(__dirname, 'src'),
  name: 'ui-guide',
  commonRollupOptions: () => ({
    input: './src/ui-guide.ts',
    plugins: [resolvePlugin(), commonPlugin()],
    external: ['popper.js'],
  }),
};

registerCleanTask(config);
registerBuildTask(config);
