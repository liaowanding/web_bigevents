//基本资料.html


$(function() {

    //定义表单验证规则----------
    var form = layui.form
    form.verify({
            //定义一个叫nickname的表单验证规则，将nickname做为input的lay-verify的值，该input就可以使用该验证规则：<input lay-verify="nickname">       
            nickname: function(value) {
                if (value.length > 6) { return '昵称长度必须在1~6个字符之间' }
            }
        })
        //定义表单验证规则----------


    //初始化表单中用户的基本信息
    function initUserInfo() {

        $.ajax({
            method: 'GET',
            url: 'my/userinfo',
            success: function(res) {
                console.log(res);
                if (res.code !== 0) return layui.layer.msg(res.message)
                $('.layui-form [name=username]').val(res.data.username)
                $('.layui-form [name=nickname]').val(res.data.nickname)
                $('.layui-form [name=email]').val(res.data.email)
                $('.layui-form [name=id]').val(res.data.id)
                    //使用layui快速为表单赋值或取值，必须为表单添加lay-filter属性
                    //对象中属性的数据会添加给与属性名对应的name名的input
                    //form.val('formUserInfo', res.data) //为lay-filter属性的值为formUserInfo的表单添加数据
            }
        })

    }
    initUserInfo()







    $('#btnReset').on('click', function(e) {
        //正则表单默认重置行为，防止重置表单造成数据丢失
        e.preventDefault();
        //重新调用函数，重置表单中的数据
        initUserInfo()
    })





    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
        console.log($(this).serialize());
        $.ajax({
            method: 'PUT',
            url: 'my/userinfo',
            // data: {
            //     id: $('.layui-form [name=id]').val(),
            //     nickname: $('.layui-form [name=nickname]').val(),
            //     email: $('.layui-form [name=email]').val()
            // },
            data: $(this).serialize(), //该方法可以快速获取表单的数据
            success: function(res) {
                if (res.code !== 0) return layui.layer.msg(res.message)
                    //window指当前的页面，parent指这个页面的父页面，window.parent表示当前页面的父页面，当前页面是iframe标签
                    //这里会报跨域的错误，需要使用Open with Live Server打开登录页面
                window.parent.getUserInfo() //调用父页面的方法，重新渲染用户头像和昵称
            }
        })

    })


})