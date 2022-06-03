$(function() {

    //  请求体(formData格式)：
    //  title：文章标题
    //  cate_id：所属分类id
    //  content：文章内容
    //  cover_img:文章封面
    //  state：文件状态




    var form = layui.form


    //定义文章状态，当用户点击存为草稿按钮时，将该变量修改为'存为草稿'，如果用户点击发布则不修改
    var art_state = '已发布'



    initEditor() // 初始化文本编辑器

    getitem() //文章类别

    function getitem() {

        $.ajax({
            method: 'GET',
            url: 'my/cate/list',
            success: function(res) {

                if (res.code !== 0) return alert(res.message)
                var itemStr = template('itme', res)
                $('[name=cate_id]').html(itemStr)
                form.render()
            }
        })

    }



    //以下都是插件的固定写法
    var $image = $('#image') //获取裁剪区域的img元素

    const options = { // 创建配置对象

        aspectRatio: 1, // 控制裁剪的宽高比，1/1

        preview: '.img-preview' // 指定预览区域
    }


    // 创建裁剪区域
    $image.cropper(options)


    $('#btnChooseImage').on('click', function() {

        $('#coverFile').click()

    })




    $('#coverFile').on('change', function(e) { //监听文件选择框的change事件

        var files = e.target.files //获取文件选择框所选文件

        if (files.length === 0) { //判断是否选择了文件
            return alert('请选择需要上传的文件')
        }

        var newURL = URL.createObjectURL(files[0]) //将文件创建为对应的URL地址(因为图片容器是通过url地址展示图片)


        //将新的图片替换掉裁剪区旧的图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域  
    })


    $('#btndraft').on('click', function() { //为存为草稿添加点击事件

        art_state = '存为草稿'
    })






    $('#form-pub').on('submit', function(e) { //监听表单的提交事件

        e.preventDefault(); //阻止表单的默认提交行为

        //接口文档要求请求体为 FormData 格式
        var fd = new FormData($(this)[0]) //将form表单对象转换为dom对象传递给formData

        fd.append('state', art_state) //将文件状态存储到state里


        $image
            .cropper('getCroppedCanvas', { //将裁剪后的图片，输出为一个文件对象
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // blob为图片文件

                fd.append('cover_img', blob) //将图片文件存储到cover_img里

                fd.forEach((value, key) => { //键名与需要传递的键名相同

                    console.log('键名为:' + key, '值为：' + value); //可以看到fd里已经存储了需要传递给服务器的参数
                })


                getpub(fd) //toBlob当change事件执行完才会调用，所以只能在这里发起请求，在外面发起请求时并没有cover_img参数
            })



        console.log('我比$image.toBlob()更先调用');

        //getpub(fd) 这里调用并没有cover_img发送给服务器

    })



    function getpub(fd) {

        $.ajax({
            method: 'POST',
            url: 'my/article/add',
            data: fd,
            //向服务器提交的是FormData格式的数据，必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                console.log(res);
            }
        })
    }








})