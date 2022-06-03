//文章类别.html
$(function() {

    var layer = layui.layer

    var form = layui.form


    gettest()

    function gettest() {
        $.ajax({

            method: 'GET',
            url: 'my/cate/list',
            success: function(res) {
                console.log(res);
                if (res.code !== 0) return layui.layer.msg(res.message)

                var htmlStr = template('test', res)
                console.log(htmlStr);
                $('tbody').html(htmlStr)
            }

        })

    }


    //删除按钮
    $('tbody').on('click', '.btnRemove', function() { //为body里未来类名为btnRemove的按钮(删除按钮)添加点击事件

        //本质是删除数据，然后重新渲染到页面，并不是直接删除页面元素
        //$(this).parents('tr').remove() //parents:获取祖先元素，remove()：删除， 删除当前被点击按钮的tr祖先元素

        var id = $(this).parents('tr').children('td').eq(0).html()
        layer.confirm('确认删除此分类吗？', { icon: 3, title: ' ' }, function(index) { //传入一个参数，可以通过该参数关闭该提示框

            console.log(id);
            $.ajax({
                method: 'DELETE',
                url: 'my/cate/del?id=' + id, //id做为url地址的参数传递给服务器
                success: function(res) {
                    console.log(res);
                    if (res.code !== 0) return layer.msg(res.message)
                    gettest()
                }
            })

            layer.close(index)
        })


    })



    //修改按钮
    var indexSet = null
    $('tbody').on('click', '.btnSet', function() {


        var obj = {
            cate_name: $(this).parents('tr').children('td').eq(1).html(),
            cate_alias: $(this).parents('tr').children('td').eq(2).html()
        }
        var htmlset = template('textSet', obj)

        indexSet = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: htmlset
        })
    })




    //提交
    $('body').on('submit', '.inputSet', function(e) { //监听表单提交

        console.log(11);
        e.preventDefault(); //阻止表单的默认提交

        $.ajax({
            method: 'PUT',
            url: 'my/cate/info',
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);

            }
        })

    })

    $('body').on('click', '#cancelSet', function() {
        layer.close(indexSet)
    })












    //添加类别按钮
    var index = null
    $('#btnAdd').on('click', function() {


        index = layer.open({ //使用layui.layer.open创建一个弹出层，弹出层会返回一个值，可以使用layui.layer.close(弹出层的返回值)来关闭该弹出层
            type: 1, //1表示页面层，0表示信息层会有一个确定按钮
            area: ['500px', '250px'], //设置弹出层的宽高
            title: '添加文章分类', //弹出层的title
            content: $('#textAdd').html() //直接获取id为textAdd模板的html结构
        })


    })





    //提交
    $('body').on('submit', '.inputAdd', function(e) { //监听表单提交

        e.preventDefault(); //阻止表单的默认提交

        $.ajax({
            method: 'POST',
            url: 'my/cate/add',
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if (res.code !== 0) return layer.msg(res.message)
                gettest()
                layer.close(index)
            }
        })

    })




    //取消提交  
    //虽然能获取script的html结构，但不能为script绑定事件，既然不能绑定事件也就不能进行事件代理
    //$('#textAdd').on('click', '#cancel', function() { alert(11) }) 
    $('body').on('click', '#cancel', function() { //使用事件代理，因为取消按钮和它的父亲form表单都是动态创建的，可以为根元素body绑定

        layer.close(index) //关闭返回值为index的弹出层
    })

































})