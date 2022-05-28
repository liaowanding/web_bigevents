 //发起jQuery的get post ajax请求前会先调用$.ajaxPrefilter函数，其中options是调用Ajax时传递的配置对象
 $.ajaxPrefilter(function(options) {

     //console.log(options.url)
     options.url = 'http://www.liulongbin.top:3008/' + options.url //拼接一个根路径，以后每次发起请求时就不用写根路径了

     //url里包含/my/则返回1，如果url没有/my/则返回-1，如果请求的url地址是/my/表示请求的是有权限的接口，则同意配置请求头
     if (options.url.indexOf('/my/') !== -1) {
         options.headers = {
             Authorization: localStorage.getItem('token') || ''
         }
     }
     //因为jQuery发起请求前ajaxPrefilter函数会拿到发起请求时的配置对象，为配置对象挂载complete回调函数，与在ajax挂载complete回调是一样的
     options.complete = function(res) { //这个res是xhr对象，不论请求成功或失败都会调用该函数
         console.log(res);
         if (res.responseJSON.code == 1 && res.responseJSON.message == "身份认证失败！") {
             localStorage.removeItem('token')
             alert('xxxxxxxx')
             location.href = './登录注册页面.html'
         }
     }
 })