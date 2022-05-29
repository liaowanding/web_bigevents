//重置密码.html


$('.layui-form').on('submit', function(e) { //监听form表单的提交
    e.preventDefault(); //阻止表单的默认提交

    //已经在input中使用了校验规则，在这里就不用判断了
    //  if ($('.layui-form [name=newPwd]').val() !== $('.layui-form [name=estimatePwd]').val()) return layui.layer.msg('两次密码不一致')


    console.log($('.layui-form [name=oldPwd]').val());
    console.log($('.layui-form [name=newPwd]').val());
    $.ajax({
        method: 'PATCH',
        url: 'my/updatepwd',
        data: {
            old_pwd: $('.layui-form [name=oldPwd]').val(),
            new_pwd: $('.layui-form [name=newPwd]').val(),
            re_pwd: $('.layui-form [name=estimatePwd]').val()
        },
        success: function(res) {

            if (res.code !== 0) return layui.layer.msg(res.message)
                //  $('.layui-form input').val('') //清空.layui-form 表单下的input的val
            layui.layer.msg(res.message)
            $('.layui-form')[0].reset() //使用form表单原生的reset方法重置表单实现清空表单数据
        }
    })

})


$('#pwdRecover').on('click', function(e) {
    e.preventDefault() //阻止清空表单数据
    $('.layui-form')[0].reset() //使用form表单原生的reset方法重置表单实现清空表单数据

})


//创建了三个自定义input校验规则，名字为pwd estimate samePwd
var form = layui.form
form.verify({

    pwd: [/^[\S]{6,12}$/, '密码必须6到12位'],

    //value是使用该验证规则的input里的value值
    estimate: function(value) {
        if (value !== $('.layui-form [name=newPwd]').val()) return '两次密码输入不一致'
    },

    //value是使用该验证规则的input里的value值
    samePwd: function(value) {

        if (value === $('.layui-form [name=oldPwd]').val()) return '新密码不能与旧密码相同'
    }
})