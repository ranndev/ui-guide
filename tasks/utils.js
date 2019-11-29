/**
 * @param {string} filename
 */
function taskName(filename) {
  return filename.replace(process.cwd() + '/tasks/', '').replace(/\.js$/, '');
}

module.exports = { taskName: taskName };
