$(function() {
    var layer = layui.layer

    //以下都是插件的固定写法
    var $image = $('#image') //获取裁剪区域的img元素


    const options = { // 创建配置对象

        aspectRatio: 1, // 控制裁剪的宽高比，1/1

        preview: '.img-preview' // 指定预览区域
    }


    // 创建裁剪区域
    $image.cropper(options)





    $('#btnChooseImage').on('click', function() { // 为上传按钮绑定点击事件
        $('#file').click() //手动点击文件选择框
    })



    $('#file').on('change', function(e) { // 为文件选择框绑定 change 事件，用户选择图片时触发该事件

        var filelist = e.target.files // files为伪数组，获取用户选择的文件

        if (filelist.length === 0) { //files.length为用户选择图片的数量,如果为0表示用户没有选择图片
            return layer.msg('请选择照片！')
        }


        var file = e.target.files[0] // 拿到用户选择的文件

        console.log('图片文件', file);


        var imgURL = URL.createObjectURL(file) //因为img的src通过路径渲染图片，所以需要将文件，转化为路径

        console.log('转换成路径的图片文件' + imgURL);

        // 3. 重新初始化裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 为确定按钮，绑定点击事件
    $('#btnUpload').on('click', function() {
        // 1. 要拿到用户裁剪之后的头像
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
            // 2. 调用接口，把头像上传到服务器
        $.ajax({
            method: 'PATCH',
            url: 'my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.code !== 0) {
                    return layer.msg('更换头像失败！')
                }
                layer.msg('更换头像成功！')
                window.parent.getUserInfo() //window当前窗口，parent父亲，window.parent当前窗口的父窗口的getUserInfo()
            }
        })
    })
})

/*
url路径格式  需要发送请求后才能拿到图片：
<img src='./xx/logn.png'>



base64格式的字符串   不需要发送请求就能拿到图片，字符串本身就是图片,缺点是体积比较大：

    <img 
    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAjCAIAAABzZ
    z93AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAFB0lEQVR42qVX+0/bVRQ/POxWjMxtzKAMaOljpdA
    HDwus0ekY4gYYXEi2qXs6wUXkIYVtUB5jMhhsc2ZxJpqxF4IPHNDCpoBxi8qyGMuAaaK/7FcTf3Bt
    /QO839x6enoKP5l88u29t/ecc8/jnnMuZJqt5izbJlO2KdMiBnIqkGWxC4ip+Iqp+DfbmiMXxVisU1BCCkmLA
    LYb6cU+cYJl2cmBPArlJQ8hNwha3IP7ge5gh6W75Rnll25ALdEYyBCBG0CeQk7EPjQmVYvSUxvSdWFkxjraVCB/
    qL6SoxwIkWh3diD0qJzi+kqeU4QhdykSpVJTsKOwcEAzSHKmEz0B4IRaH30QvY7HREKFY2FxesvVpy/4Mi7Om147
    anqujIZJRIAgGdqdmQ7dg5aM0O+FysTaS9A+E9v1vdH7j2Hcbxz8w9ByOdP5MlVR0QyJWTTK0Gci0eC4x7S1SuUaA
    /cMuL8TMHqDEoaJv/VDDzPLDqIxFc2ENtTP9CDoeRr9GB0Cuher1A0j0DaLMHqCFPprD6UkKUUxI7WsZB1tRpZNxDe9
    rFrVdANaZygM40EGjA4hD+j9ZSGEMmhYKqfJsqe92hDf7IHj0wyGsSBDhM+QHct42tJ9q3p/gg9/W9c0ZBKu/u/amcy2j
    eVH4l2TcOxbipiWW6vrh6OFUZ5AFaIGTGzzwAe/Kji3pO6Y1uxsUCTlOjfs7opv8kLLNxSxzVNP7em2bqnQfx1k4ImYCkM
    /JR73wLkHiNj++eTD55/c3x/bNAnNtxhSdrWabQU5uQ79aICBXqRwIkZ7Sqn6LZXqjhkYWISzD0I4swTdd+HYNDTfDME1qa4Z
    1JXulyS5+QXRwjCthHLj8kkoy6Z1lq9tHIGBpQj0+sB9G1w3oWlq/Rt9Bsc2c3YoUO05+bovAww0pIGlV8wjct1oeXaNaxT6ly
    LQtwDuO8k7j5os+UglhNns+bovAgw07QErB6zcGR3Fj9dcgu570LcIpyOQVH3R4CgWaiG51Zan+zzAQH3EzUjumX3jS4dWV1
    +BBg+8NwXtP0DvIkOCy6sp2SvkybMLYRkjAYYIM9Jeg5ZEzeYK1ZFhqPeE0OCF1tvw/jycWgijZ/6xzh9TKxtliVGEDQcYqFN
    CmoklmSsxdzxx8COom0Coaq4nl9cl7RuIO3EPehYYkg5d2FRYbLHmZnzmZ6CFEGjKp5Vzzd6z8O64gndurN3doyvYrtQBS75m+
    2GV+w6cvE8Rc9KXUD+qLT2gHfIz0JwXSlfRJVTrKFn15iDUjq2r6jDnFmGUmszW1JIDce1zTB50++I672qv+xlo1xXOjSznsix
    MPSqub8qOt1Uts9A9z6C95megrIAyCpdEUpeXbUDFSoazIqFxArp8FJqrfgbeytF7x7jTNpl1leIvQ2Gpum4MOn0IzRU/Rdr532n
    KBZooseTTwk2TGxUsS67O+Yq69qsY9y/Q4RPQXH4kkfbJn9qeOcPWXUgeUTxZY0vjhTajYkCvjpLS8p5fv+d0TNvPsZ330wcfpX3
    6V2r7rGFHtdFehPVWfoHWMBqZqIG8giyCcDH0LsnZ/MxbH284tZByYk6/7XVzXhGNACkprBn1B23CqUeZDejVZBHL+vPwpaat5/9Rj
    sURFYzKKa0c61tXyimonxjQBlCOaS9LH1HL1DO6m72CmKLRT7zolol2afKZGWp4KAsMs2UvOL1h7A2xUtfEnnr/Asbvt92ZUS6sAAA
    AAElFTkSuQmCC" 
    
    alt="" />

*/