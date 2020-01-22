let roles = 1;
let process_name;
let process_descript;
let process_id;
$(function () {
  process_id = getQueryString("id");
  process_name = decodeURI(getQueryString("name"));
  process_descript = decodeURI(getQueryString("descript"));
  $("#addForm").validate();
  if(roles === 0){
    $("#toolbar").remove();
    $('table').bootstrapTable({
      url: url + "/product/getTasksByStepId.action",
      method: 'post',
      pagination: true,
      search: true,
      dataType:'json',
      toolbar:'#toolbar',
      contentType: "application/x-www-form-urlencoded",
      striped:true,
      clickToSelect: true,
      sidePagination:'server',
      pageNumber: 1,
      responseHandler:function(res){
        res.total=res.count;
        return res;
      },
      queryParams:function(params){
        return{
          str1: process_id,
          str2:params.limit,
          str3:(params.offset/params.limit)+1,
        }
      },
      pageSize:'15',
      pageList: [10, 25, 50, 100],
      showRefresh:true,
      dataField: "data",
      mobileResponsive:true,
      useRowAttrFunc: true,
      columns:[{
        field: 'jobNum',
        title: '任务号',
        sortable: true,
      },{
        field: 'productId',
        title: '订单号',
        sortable: true,
      },{
        field: 'orderName',
        title: '订单名称',
        sortable: true,
      },{
        field: 'assignTime',
        title: '分配时间',
        sortable: true,
      },{
        field:'do_workName',
        title:'操作员',
        sortable:true,
      },{
        field:'status',
        title:'状态',
        sortable:true,
      }
      ]
    })

  }
  else
    $('table').bootstrapTable({
      url: url + "/product/getTasksByStepId.action",
      method: 'post',
      pagination: true,
      search: true,
      dataType:'json',
      toolbar:'#toolbar',
      striped:true,
      pageSize:'15',
      pageList: [10, 25, 50, 100],
      showRefresh:true,
      dataField: "data",
      contentType: "application/x-www-form-urlencoded",
      mobileResponsive:true,
      useRowAttrFunc: true,
      sidePagination:'server',
      pageNumber: 1,
      responseHandler:function(res){
        res.total=res.count;
        return res;
      },
      queryParams:function(params){
        return{
          str1: process_id,
          str2:params.limit,
          str3:(params.offset/params.limit)+1,
        }
      },
      columns:[{
        field: 'jobNum',
        title: '任务号',
        sortable: true,
      },{
        field: 'productId',
        title: '订单号',
        sortable: true,
      },{
        field: 'orderName',
        title: '订单名称',
        sortable: true,
      },{
        field: 'assignTime',
        title: '分配时间',
        sortable: true,
      },{
        field:'do_workName',
        title:'操作员',
        sortable:true,
      },{
        field:'status',
        title:'状态',
        sortable:true,
      },{
        field:'null',
        title:'操作',
        formatter:actionFormatter,
      }
      ]
    });

  //渲染按钮
  function actionFormatter(value,row, index) {
    let jobNum = row.jobNum;
    let result = "";
    result += "<button class='btn btn-md btn-primary detailButton' jobNum='"+ jobNum +"' title='详情'>详情</span></button>";
    result += "<button class='btn btn-md btn-danger deleteButton' jobNum='"+ jobNum +"' title='删除'>删除</button>";
    return result;
  }

});

//查看任务详情
$(document).on('click', '.detailButton', function () {
  let table_collection = $('#table_collection');
  table_collection.empty();
  //将原先内容清空
  $('#stepName').text("");
  $('#description').text("");
  $('#operator').text("");
  $('#commit').text("");
  $('#jobNum').text("");
  // 获取工单编号和工序编号
  let jobNum = $(this).attr('jobNum');
  $("#detailModal").modal({
    backdrop:'static'
  });
  $.ajax({
    url: url + "/product/getTaskDetail.action",
    // url: mockUrl + "/getTaskDetail",
    method: 'post',
    data: {
      str1: process_id,
      str2: jobNum
    },
    dataType: 'json',
    success: function (result) {
      console.log(result);
      if (result.code === 0) {
        let data = result.data;
        
        //获取工序名称
        let stepName = data.stepName;
        //获取描述
        let description = data.descript;
        //获取操作员名字
        let do_workName = data.do_workName;
        //获取备注
        let commit = data.commit;
        //获取工单号
        let getJobNum = data.jobNum; 
        let productId = data.productId; 
        let orderName = data.orderName; 
        let results = data.results; 
        let equip = data.equip; 
        let descript = data.descript; 
        $('#jobNum').text(getJobNum); //任务号
        $('#stepName').text(stepName);  //工序名
        $('#description').text(descript); //工序描述
        $('#operator').text(do_workName); //操作人员
        $('#commit').text(commit); //任务备注
        $('#productId').text(productId);  //订单号
        $('#orderName').text(orderName); //订单名称：
        $('#results').text(results); //生产结果：
        $('#equip').text(equip); //设备名称：
       
        let environ=data.environ;
        let materials=data.materials;
        
        table_collection.append( "              <div id="+ "orderPanel" +" class=\" \">\n"
          + "                <div class=\"form-group\">\n"
          + "                  <label style=\"margin-bottom: 10px;margin-top: 5px\">分配物料：</label>\n"
          + "                  <table id='materials'></table>\n"
          + "                </div>\n"
          + "                <div class=\"form-group\" >\n"
          + "                  <label style=\"margin-bottom: 10px;margin-top: 5px\">加工环境：</label>\n"
          + "                  <table id=\"environ\" class=\"table table-bordered table-hover \"><tr><th>环境名</th><th>环境描述</th></tr></table>\n"
          + "                </div>\n"
          + "            </div>");

          $.each(environ, function(index, item) {
            $("#environ").append("<tr><td>"+item.name+"</td><td>"+item.descript+"</td></tr>");
          });

          $('#materials').bootstrapTable({
            data: materials,
            dataType:'json',
            striped:true,
            pageSize:'15',
            pageList: [10, 25, 50, 100],
            contentType: "application/x-www-form-urlencoded",
            mobileResponsive:true,
            useRowAttrFunc: true,
            columns:[{
              field: 'origin',
              title: '物料来源',
              formatter:function change_formatter(value,row,index){
                let result="";
                if(row.origin=="origin"){
                  result="原材料";
                }else if(row.origin=="half"){
                  result="半成品";
                }else if(row.origin=="end"){
                  result="成品";
                }
                return result;
              }
            },{
              field:'name',
              title:'物料名',
              sortable:true,
            },{
              field:'subMan',
              title:'提交人',
              sortable:true,
          },{
            field:'num',
            title:'分配数量',
            sortable:true,
          }]
        });
      } else {
        swal(
          '操作失败!',
          result.msg,
          'error'
          );
      }
    },
    error: function() {
      swal(
        '操作失败',
        '网络错误!',
        'error'
        );
    }
  });


});

//新增按钮绑定事件
$(document).on('click','#add-a', function () {
  //获取工序信息
  let process_name_param = encodeURI(encodeURI(process_name));
  let process_descript_param = encodeURI(encodeURI(process_descript));
  window.location.href = 'add_task.html?id=' + process_id + '&name=' + process_name_param + '&descript=' + process_descript_param;
});

//工单删除
$(document).on('click', '.deleteButton', function () {
  let jobNum = $(this).attr('jobNum');
  swal({
    title: '您是否要删除该工单?',
    text: "",
    type: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    confirmButtonText: '确定',
    cancelButtonColor: '#d33',
    cancelButtonText: "取消",
  }).then(function (isConfirm) {
    if (isConfirm) {
      $.ajax({
        url: url + "/product/delTask.action",
        method: 'POST',
        data: {
          str1: jobNum
        },
        dataType: 'json',
        success: function (result) {
          if (result.code === 0) {
            swal(
              '删除成功!',
              '',
              'success'
              );
          } else {
            swal(
              '删除失败!',
              result.msg,
              'error'
              );
          }
        },
        error: function() {
          swal(
            '删除失败',
            '网络错误!',
            'error'
            );
        }
      });
    }
  });
});

