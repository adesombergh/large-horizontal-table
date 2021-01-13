console.log('PAPAPAPAPPAPAPAPA', process.env.NODE_ENV)
module.exports = {
  outputDir: 'pages',
  publicPath: process.env.NODE_ENV === 'production'
    ? '/large-horizontal-table/'
    : '/'
}
