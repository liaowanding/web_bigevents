$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    var q = {
        pagenum: 1, //页码值，表示获取第几页的数据，默认为第一页的数据(必选)
        pagesize: 2, //每页显示几条数据，默认每页显示两条数据(必选)
        cate_id: '', //文章分类的ID(可选)
        state: '', //文章的发布状态(可选)
    }

    getlist(q)

    function getlist(obj) { //获取文章

        $.ajax({
            method: 'GET',
            url: 'my/article/list',
            // data: {
            //     pagenum: 1, 
            //     pagesize: 2, 
            //     cate_id: '', 
            //     state: '', 
            // },
            data: obj,
            success: function(res) {
                console.log(res);
                if (res.code !== 0) return layer.msg(res.message)
                var listStr = template('testlib', res)

                $('tbody').html(listStr)

                renderPage(res.total, obj) //当渲染完文章后就渲染分页，将数据的条数传递过去，让数据总条数 / 每页显示条数 = 页数 

            }
        })

    }

    //'8'.padStart(2,0) //结果为：08  ，指定字符的长度为2，如果长度不够，则在字符前补零




    template.defaults.imports.timeFitlter = function(value) {
        const date = new Date(value);
        let y = date.getFullYear();
        let m = (date.getMonth() + 1).toString().padStart(2, 0);
        let d = date.getDate().toString().padStart(2, 0);

        let hh = date.getHours().toString().padStart(2, 0);
        let mm = date.getMinutes().toString().padStart(2, 0);
        let ss = date.getSeconds().toString().padStart(2, 0);
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
    }



    //    报错使用这个，还未找到原因 template.dafaults.imports.timeFitlter = function(value) {
    //     }



    //不报错， template.defaults.imports.timeFitlter = function(value) {
    // }







    initCate()

    function initCate() { //初始化文章分类
        $.ajax({
            method: 'GET',
            url: 'my/cate/list',
            success: function(res) {
                console.log(res);
                if (res.code !== 0) return layer.msg(res.message)

                var initStr = template('tpl-table', res)
                console.log(initStr);
                //因为请求是异步，所以layui先将空的选择框渲染到页面，后续请求完毕将元素插入选择框时，并不能被layui监听到，所以导致渲染失败
                $('[name=cate_id]').html(initStr)
                form.render() //调用form.render重新渲染页面
            }
        })
    }




    $('#form-ser').on('submit', function(e) { //监听文章筛选表单的提交

        e.preventDefault();
        console.log($('[name=cate_id]').val());
        console.log($('[name=state]').val());

        //select标签的valu值就是 select标签里被选中的option标签的value值

        //修改请求时文章的分类，和文章的状态，然后重新发起获取文章的请求

        //$('[name=cate_id]')：name属性为cate_id的select标签的value值


        var liste = {
            pagenum: 1,
            pagesize: 2,
            cate_id: $('[name=cate_id]').val(),
            state: $('[name=state]').val(),
        }

        getlist(liste) //重新获取文章
    })






    function renderPage(index, q) {

        laypage.render({

            elem: 'pageBox', //id选择器，不用加#号

            count: index, //数据总条数，从服务器获得

            limit: q.pagesize, //每页的数据条数，layui会根据每页的数据条数自动计算出页数

            curr: q.pagenum, //设置默认第几页被选中

            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], //控制页面的排版，其中limit为下拉选择框，prev表示上一页，next表示下一页，page为页码，这几个为默认值,这里的顺序也会影响页面中页码的排序

            limits: [2, 3, 5, 10], //控制limit下拉框的选项值,默认值为[10,20,30,40,50],控制每页显示几条数据

            jump: function(obj, first) { //触发jump回调的两种方式：当页码被切换时(被点击)/下拉框选择时，laypage.render()被调用时(调用getlist()函数时)

                console.log(obj.curr) //通过obj.curr可以获取被点击的页码值

                console.log(obj.limit); //获取下拉框里选择的每页显示几条数据

                q.pagesize = obj.limit //将参数对象中的每页显示几条数据，换成下拉选择的数量，重新发起获取文章的请求，会出现死循环 

                q.pagenum = obj.curr //将参数对象中的页码值换成当前点击的页码值，重新发起获取文章的请求

                //getlist(q)     //在这里不能直接调用getlist(q)重新发起获取文章的请求，会出现死循环 

                if (!first) { //如果是点击页码调用的jump函数，则first为undefined，如果是laypage.render调用的则first为true

                    getlist(q)
                }
            }
        })



    }


    $('body').on('click', '.remove-table', function() { //如果需要为多个元素添加一个事件，使用id有点不妥
        var leng = $('.remove-table').length //当点击删除按钮时，获取页面上删除按钮的个数，如果为1则表示该条数据被删除后，则该页面已经没有数据了
        const id = $(this).parents('tr').attr('data-id')

        //console.log(id);

        layer.confirm('此操作将永久删除该文章，是否继续？', { icon: 3, title: ' ' }, function(index) { //确定删除文章前如果删除按钮的个数为1，则确定删除后删除按钮的个数就为0了
            $.ajax({
                method: 'DELETE',
                url: 'my/article/info?id=' + id,
                success: function(res) {
                    if (res.code !== 0) return layer.msg(res.message)
                        //当点击第四页时，在145行会将对象q的页码值改为4，然后将第四页的数据删除完，调用getlist(q),请求对象q的页码值还是为4，此时请求的4页码值数据为空

                    //需要判断当前页码没有数据时，发送请求时让页码值减一，该方法只能适用于页码显示两条数据

                    if (leng === 1) { //如果删除按钮的个数为1表示，则表示页面上已经没有数据了

                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1 //如果页码值为1则让其一直为1，如果不为1则让页码值-1
                        getlist(q)
                    }
                }
            })

            layer.close(index)

        })



    })







})