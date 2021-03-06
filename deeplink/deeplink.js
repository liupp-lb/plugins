(function () {
  function DeepLink (params) {
    // params = {
    //   target: '',//requier, str/dom
    //   iosScheme: '',
    //   androidScheme: '',
    //   iosDownloadUrl: '',
    //   androidDownloadUrl: '',
    //   universalLink: '',
    // }
    this.params = params
    var _this = this
    var target = params.target instanceof Element ? params.target : document.querySelector(params.target)
    target.addEventListener('click', function () {
      _this.downloadIfNoApp()
    })
  }
  DeepLink.prototype = {
    constructor: DeepLink,
    isPlatform: function (platform) {
      var ug = navigator.userAgent
      var reg = new RegExp(platform, 'i')
      if (ug.search(reg) !== -1) {
        return true
      }
      return false
    },
    getIosVersion: function () {
      var ug = navigator.userAgent
      var version = ug.match(/iPhone OS \d+_\d+/)[0].match(/\d+_\d+/)[0]
      return parseInt(version)
    },
    downloadIfNoApp: function () {
      var startTime = Date.now()
      var isIos = this.isPlatform('iphone')
      var isAndroid = this.isPlatform('android')
      var universalLink = this.params.universalLink
      var endTime
      var schemeUrl = isIos ? this.params.iosScheme : this.params.androidScheme
      var directToUrl = isIos ? this.params.iosDownloadUrl : this.params.androidDownloadUrl
      var appT = 100

      function directIfNoApp () {
        setTimeout(function () {
          endTime = Date.now()
          if (endTime - startTime < 2000 + appT && directToUrl) {
            location.href = directToUrl
          }
        }, 2000)
      }
      // 跳转
      if (!schemeUrl) {
        location.href = directToUrl
        return
      } else {
        location.href = schemeUrl
      }

      if (isIos) {
        // ios9.0以上使用通用链接
        if (this.getIosVersion() >= 9 && universalLink) {
          location.href = universalLink
          return
        }
        directIfNoApp()
      } else if (isAndroid) {
        directIfNoApp()
      }
    }
  }
  window.DeepLink = DeepLink
})()
