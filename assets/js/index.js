//后台页面.html

$(function() {
    getUserInfo()
    var layer = layui.layer
    $('#btnLogout').on('click', function() { //为退出按钮添加点击事件
        //confirm('提示消息'，{icon:提示框左上角图标，title：提示框头部提示消息}，回调函数)，当用户点击确定时执行回调函数  

        layer.confirm('确认退出登录？', { icon: 3, title: '提示' }, function(index) {
            //当用户确认退出时，清空本地token，并跳转到登录页面
            localStorage.removeItem('token')

            location.href = './登录注册页面.html'

            layer.close(index) //layer自带的关闭弹出层
        })

    })
})

function getUserInfo() {

    $.ajax({
        method: 'GET',
        url: 'my/userinfo', //因为发起请求前进行了路径拼接所以这里不需要使用完整路径

        //headers请求头配置对象，将token做为Authorization的值发送给服务器,如果没有则发送空字符串''，在baseAPI统一设置了，所以这里不需要设置了
        // headers: { 
        //     Authorization: localStorage.getItem('token') || ''
        // },

        success: function(res) {
            console.log(res);
            if (res.code !== 0) return layui.layer.msg('获取用户信息失败')
            renderAvatar(res.data) //渲染用户的头像
        },
        // 为了防止用户在地址栏直接填入后台地址不用登录就能访问后台，如果请求失败则强制打开登录页面
        //因为每次请求有权限的接口都需要使用complete，太过于麻烦，直接添加到baseAPI文件里
        // complete: function(res) { //这个res是xhr对象，不论请求成功或失败都会调用该函数
        //     console.log(res);
        //     if (res.responseJSON.code == 1 && res.responseJSON.message == "身份认证失败！") {
        //         localStorage.removeItem('token')
        //         alert('xxxxxxxx')
        //         location.href = './登录注册页面.html'
        //     }
        // }
    })

}

function renderAvatar(user) {

    //如果有nickname则将渲染为用户名称，如果没有则将username渲染为用户名称
    var name = user.nickname || user.username

    $('#welcome').html('欢迎&nbsp;&nbsp' + name) //空格最&nbsp;
    if (user.user_pic) { //如果有图片头像则渲染图片头像
        $('.text-avatar').hide() //隐藏文本头像
        $('.layui-nav-img').attr('src', user.user_pic).show() //为图片头像设置图片url路径并显示图片头像
    } else { //如果没有图片头像则渲染文字头像
        $('.layui-nav-img').hide() //隐藏图片头像
        var first = name[0].toUpperCase() //可以使用数组下标的形式获取第一个字符串，并转换成大写
        $('.text-avatar').html(first).show()
    }

}