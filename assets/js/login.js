$(function() { //入口函数


    //点击去注册账号的链接
    $('#link_reg').on('click', function() {
        $('.login-box').hide() //隐藏注册账号的链接
        $('.reg-box').show() //显示登录账号的链接
    })


    //点击去登录账号的链接
    $('#link_login').on('click', function() {
        $('.login-box').show() //显示注册账号的链接
        $('.reg-box').hide() //隐藏登录账号的链接
    })




    //------------------------------------------



    //使用layui提供的form.verify()函数实现自定义表单校验
    //使用自定义表单校验范，在input标签的lay-verify添加自定义校验规：在input标签的lay-verify='pass'

    var form = layui.form //从layui中获取form，layui对象类似于$对象，只要导入了layui的js文件，就有layui对象
    form.verify({
        pass: [ //form.verufy()函数有两个种校验方式，一种是数组方式:form.verufy([校验规则，校验失败后的提示文字])
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        reurname: [/^[\S]{1,10}/, '账号名必须是1到10位的字母数字'],

        //为input添加了repwd校验规则，则value就能获取该input的表单值
        repwd: function(value) { //第二种函数方式校验方式，value：表单的值，校验两次密码是否一致

            //获取.reg-box里name=password的元素(密码框)
            var val = $('.reg-box [name=password]').val()

            //如果密码框的值不等于确认密码框中的值，证明两次密码不一致
            if (val !== value) {
                return '两次密码不一致'
            }

        }
    })







    //-----------------------------------------

    var layer = layui.layer //使用layui的提示弹出层


    //为表单添加submit事件监听表单的提交事件
    $('#form_reg').on('submit', function(e) {
        e.preventDefault(); //阻止表单的默认提交
        console.log(typeof $('#form_reg [name=username]').val());
        var data = {
            username: $('#form_reg [name=username]').val(), //获取form_reg 里name等于username的元素(账号)
            password: $('#form_reg [name=password]').val(), //获取form_reg里name等于password的元素(密码)
            repassword: $('#form_reg [name=repassword]').val() //获取form_reg里name等于repassword(确认密码)
        }
        $.post('api/reg', data, function(res) {

            if (res.code !== 0) return layer.msg(res.message) //如果res.code不等于0表示失败，弹出失败原因

            layer.msg(res.message) //如果等于0表示成功，弹出成功

            $('#form_reg input').val('') //清空注册表单中的input的value
            $('#link_login').click() //模拟人的点击，跳转到登录页面
        })
    })







    $('#form_login').on('submit', function(e) {
        // console.log($(this).serialize());
        e.preventDefault()

        $.ajax({
            url: 'api/login',
            method: 'POST',
            data: $(this).serialize(), //这里的this指的是监听的form表单，快速获取form表单中的数据
            success: function(res) {
                console.log(res);
                if (res.code !== 0) return layer.msg(res.message)
                console.log(res.token) //服务器会发送一个token用于访问有权限接口的身份认证

                localStorage.setItem('token', res.token) //将token存储到本地，下次访问需要权限的接口时将token做为Authorization请求头的值发送给服务器
                    //登录成功后跳转到后台登录页面
                location.href = './后台页面.html'
            }
        })

    })












})