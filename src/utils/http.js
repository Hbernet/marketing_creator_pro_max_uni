import util from './util.js'
const http = {
  request: (params) => {
    // 请求参数处理
    if (Object.prototype.toString.call(params.data) == '[object Array]') {
      params.data = JSON.stringify(params.data)
    } else if (Object.prototype.toString.call(params.data) == '[object Number]') {
      params.data = params.data + ''
    }
    // 发起请求
    return new Promise((resolve, reject) => {
      uni.request({
        dataType: 'json',
        responseType: params.responseType == undefined ? 'text' : params.responseType,
        header: {
          authorization: uni.getStorageSync('TOKEN'),
          userid: uni.getStorageSync('ONE_ID')
        },
        url: (params.domain ? params.domain : import.meta.env.VITE_APP_BASE_API) + params.url,
        data: params.data,
        method: params.method == undefined ? 'POST' : params.method,
        success: (res) => {
          const responseData = res.data
          // 请求小程序码
          if (params.responseType === 'arraybuffer' && res.statusCode === 200) {
            return resolve(responseData)
          }
          // 200 请求成功
          if (responseData.code === 200) {
            resolve(responseData)
          }
          // 401 未登录
          if (responseData.code === 401) {
            // 跳回登录页
            uni.navigateTo({
              url: '/pages/login/index'
            })
            return
          }
          if (responseData.code !== 200) {
            uni.showToast({
              title: responseData.message,
              icon: 'none'
            })
            reject(responseData)
          }
        },
        fail: (err) => {
          uni.showToast({
            title: '请求失败'
          })
          reject(err)
        }
      })
    })
  },
  // 获取上传文件预签名url
  getPreSignUrl (data) {
    return http.request({
      url: '/file-deal/get_preSign_url',
      method: 'GET',
      data
    })
  },
  chooseVideoFn: ({res, code}) => {
    return new Promise((resolve) => {
      // 处理文件类型
      let _type = res.tempFile.type
      // #ifdef MP-WEIXIN
      _type = res.tempFilePath.split('.')[1]
      // #endif
      // #ifdef APP-PLUS
      _type = res.tempFilePath.substring(res.tempFilePath.lastIndexOf('.') + 1)
      // #endif
      const contentType = _type.indexOf('video/') > -1 ? _type : 'video/' + _type

      // 准备上传参数
      const getPreSignUrlParams = {
        code: code,
        filename: res.tempFile?.name || res.tempFilePath
      }
      
      const uploadFileParams = {
        res,
        resData: [],
        contentType
      }

      // #ifdef APP-PLUS
      util.plusIo(res.tempFilePath).then(appFileBuffer => {
        getPreSignUrlParams.filename = res.tempFilePath
        // 获取预签名URL并上传
        http.uploadWithPreSignUrl(getPreSignUrlParams, uploadFileParams, { data: appFileBuffer }, resolve)
      })
      // #endif

      // #ifdef H5
      uni.request({
        url: res.tempFilePath,
        method: 'GET',
        responseType: 'arraybuffer',
        success: (requestRes) => {
          http.uploadWithPreSignUrl(getPreSignUrlParams, uploadFileParams, requestRes, resolve)
        }
      })
      // #endif
      
      // #ifdef MP-WEIXIN
      uni.getFileSystemManager().readFile({
        filePath: res.tempFilePath,
        success: (requestRes) => {
          http.uploadWithPreSignUrl(getPreSignUrlParams, uploadFileParams, requestRes, resolve)
        }
      })
      // #endif
    })
  },
  // 新增辅助函数，处理预签名URL获取和上传
  uploadWithPreSignUrl(preSignParams, uploadParams, requestRes, resolve) {
    http.getPreSignUrl(preSignParams).then(({ data }) => {
      http.uploadFile(Object.assign(uploadParams, { data, requestRes }))
        .then(() => resolve(uploadParams.resData))
        .catch(err => {
          console.log(err)
          uni.showToast({
            title: '上传失败',
            icon: 'none'
          })
        })
    })
  },
  // 上传文件
  uploadFile (params) {
    const { data, requestRes, res, resData, contentType } = params
    return new Promise((resolve, reject) => {
      uni.request({
        url: data.preSignUrl,
        method: 'PUT',
        header: {
          'Content-Type': contentType
        },
        data: requestRes.data,
        success: function () {
          const fileInfo = {
            filePath: data.preSignUrl.split('?')[0]
          }
          resData.push(fileInfo)
          resolve(resData)
        },
        fail: reject
      })
    })
  }
}

export default http
