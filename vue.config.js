module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      },
      '/json': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: { '^/json': '' }
      }
    }
  }
}
