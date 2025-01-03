const unit = {
  // 读取本地文件
  plusIo: (filePath) => {
    return new Promise((resolve) => {
      plus.io.resolveLocalFileSystemURL(filePath, async function (entry) {
        entry.file(function (file) { // 读取文件
          const reader = new plus.io.FileReader()
          reader.readAsDataURL(file) // 以URL格式读取文件
          reader.onload = function () {
            const base64 = this.result.split(',')[1] // 获取base64字符串
            const buffer = uni.base64ToArrayBuffer(base64) // 转换为arrayBuffer格式
            resolve(buffer)
          }
        })
      })
    })
  },
}

export default unit