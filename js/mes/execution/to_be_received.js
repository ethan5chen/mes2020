let roles=getQueryVariable("roles");
let workNum = sessionStorage.getItem("workNum");
$(function () {
  $("#addForm").validate();
    //首先发送ajax请求获取列表数据
    $.ajax({
      url: url + "/doing/getWaitTasks.action",
      method: 'GET',
      data: {
        // str1: 'waiting',
        str1: workNum
      },
      dataType: 'json',
      success: function (result) {
        if (result.code === 0) {
          let data = result.data;
          //判断权限
          if(roles === 0) {
            //初始化列表
            initTableWithoutAuthority(data);
          } else {
            initTableWithAuthority(data);
          }
        }
      }
    });
  });

//查看任务详情
$(document).on('click', '.taskDetail', function () {
  let table_collection = $('#table_collection');
  table_collection.empty();
  //将原先内容清空
  $('#stepName').text("");
  $('#description').text("");
  $('#operator').text("");
  $('#commit').text("");
  // 获取工单编号和工序编号
  let jobNum = $(this).attr('jobNum');
  let stepNum = $(this).attr('stepNum');
  $("#detailModal").modal({
    backdrop:'static'
  });
  $.ajax({
    url: url + "/product/getTaskDetail.action",
    method: 'GET',
    data: {
      str1: stepNum,
      str2: jobNum
    },
    dataType: 'json',
    success: function (result) {
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
        }else {
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

//获取url中的参数
function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  query=window.atob(query);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if(pair[0] === variable){return pair[1];}
  }
  return(false);
}


//无权限初始化table
function initTableWithoutAuthority(data) {
  //初始化待领取工单列表
  $('#to_be_received_table').bootstrapTable({
    data: data.normal,
    pagination: true,
    search: true,
    dataType:'json',
    toolbar:'#toolbar',
    contentType: "application/x-www-form-urlencoded",
    striped:true,
    sidePagination:'client',
    pageSize:'15',
    pageList: [10, 25, 50, 100],
    showRefresh:true,
    mobileResponsive:true,
    useRowAttrFunc: true,
    columns:[{
      field:'assTime',
      title:'分配时间',
      sortable:true,
    },{
      field:'type',
      title:'任务类型',
      sortable:true,
    },/*{
      field: 'jobNum',
      title: '工单号',
      sortable: true,
    },*/{
      field:'stepName',
      title:'工序名',
      sortable:true,
    },{
      field:'stepDesc',
      title:'描述',
      sortable:true,
    }
    ]
  });

  //初始化返修工单列表
  $('#return_repair_table').bootstrapTable({
    data: data.back,
    pagination: true,
    search: true,
    dataType:'json',
    toolbar:'#toolbar',
    contentType: "application/x-www-form-urlencoded",
    striped:true,
    sidePagination:'client',
    pageSize:'15',
    pageList: [10, 25, 50, 100],
    showRefresh:true,
    mobileResponsive:true,
    useRowAttrFunc: true,
    columns:[{
      field: 'jobNum',
      title: '工单号',
      sortable: true,
    },{
      field:'backName',
      title:'返修物品',
      sortable:true,
    },{
      field:'backNum',
      title:'数量',
      sortable:true,
    },{
      field:'assTime',
      title:'分配时间',
      sortable:true,
    },{
      field:'condition',
      title:'情况说明',
      sortable:true,
    },{
      field:'deal',
      title:'处理说明',
      sortable:true,
    }
    ]
  });

}

//有权限初始化table
function initTableWithAuthority(data){
  $('#to_be_received_table').bootstrapTable({
    data: data.normal,
    pagination: true,
    search: true,
    dataType: 'json',
    toolbar: '#toolbar',
    striped:true,
    sidePagination:'client',
    pageSize:'15',
    pageList: [10, 25, 50, 100],
    showRefresh:true,
    uniqueId: 'jobNum',
    contentType: "application/x-www-form-urlencoded",
    mobileResponsive:true,
    useRowAttrFunc: true,
    columns:[{
      field:'assTime',
      title:'分配时间',
      sortable:true,
    },{
      field:'type',
      title:'任务类型',
      sortable:true,
    },/*{
      field: 'jobNum',
      title: '工单号',
      sortable: true,
    },*/{
      field:'stepName',
      title:'工序名',
      sortable:true,
    },{
      field:'stepDesc',
      title:'描述',
      sortable:true,
    },{
      field:'null',
      title:'操作',
      formatter: actionFormatterForReceived,
    }
    ]
  });

  $('#return_repair_table').bootstrapTable({
    data: data.back,
    pagination: true,
    search: true,
    dataType:'json',
    toolbar:'#toolbar',
    striped: true,
    sidePagination:'client',
    pageSize:'15',
    pageList: [10, 25, 50, 100],
    showRefresh:true,
    contentType: "application/x-www-form-urlencoded",
    mobileResponsive:true,
    useRowAttrFunc: true,
    columns:[{
      field: 'jobNum',
      title: '工单号',
      sortable: true,
    },{
      field:'backName',
      title:'返修物品',
      sortable:true,
    },{
      field:'backNum',
      title:'数量',
      sortable:true,
    },{
      field:'assTime',
      title:'分配时间',
      sortable:true,
    },{
      field:'condition',
      title:'情况说明',
      sortable:true,
    },{
      field:'deal',
      title:'处理说明',
      sortable:true,
    },{
      field:'null',
      title:'操作',
      formatter:actionFormatterForRepair,
    }
    ]
  });

}

//渲染按钮
function actionFormatterForRepair(value,row, index) {
  let jobNum = row.jobNum;
  let result = "";
  result += "<button class='btn btn-xs btn-success back-receive' jobNum='"+ jobNum +"' title='领取任务'><span>领取任务</span></button>";
  return result;
}

//渲染按钮
function actionFormatterForReceived(value,row, index) {
  //工单编号
  let jobNum = row.jobNum;
  //工序编号
  let stepNum = row.stepNum;
  let result = "";
  result += "<button class='btn btn-xs btn-primary taskDetail' jobNum='"+ jobNum +"' stepNum='"+ stepNum +"' title='查看详情'><span>查看详情</span></button>";
  result += "<button class='btn btn-xs btn-success normal-receive' jobNum='"+ jobNum +"' title='领取任务'><span>领取任务</span></button>";
  return result;
}

//普通工单领取
$(document).on('click', '.normal-receive', function () {
  let jobNum = $(this).attr('jobNum');
  swal({
    title: '您是否要领取该任务?',
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
        url: url + "/doing/receiveTask.action",
        method: 'POST',
        data: {
          str1: 'normal',
          str2: jobNum
        },
        dataType: 'json',
        success: function (result) {
          if (result.code === 0) {
            $.ajax({
              url: url + "/doing/getWaitTasks.action",
              method: 'GET',
              data: {
                // str1: 'waiting',
                str1: workNum
              },
              dataType: 'json',
              success: function (result) {
                if (result.code === 0) {
                  let data = result.data;
                  //判断权限
                  if(roles === 0) {
                    //初始化列表
                    $('#to_be_received_table').bootstrapTable('destroy');
                    $('#return_repair_table').bootstrapTable('destroy');
                    initTableWithoutAuthority(data);
                  } else {
                    $('#to_be_received_table').bootstrapTable('destroy');
                    $('#return_repair_table').bootstrapTable('destroy');
                    initTableWithAuthority(data);
                  }
                }
              }
            });
            swal(
              '领取成功!',
              '',
              'success'
              );
          } else {
            swal(
              '领取失败!',
              result.msg,
              'error'
              );
          }
        },
        error: function() {
          swal(
            '领取失败',
            '网络错误!',
            'error'
            );
        }
      });
    }
  });
});

//返修工单领取
$(document).on('click', '.back-receive', function () {
  let jobNum = $(this).attr('jobNum');
  swal({
    title: '您是否要领取该任务?',
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
        url: url + "/doing/receiveTask.action",
        method: 'POST',
        data: {
          str1: 'back',
          str2: jobNum
        },
        dataType: 'json',
        success: function (result) {
          if (result.code === 0) {
            $.ajax({
              url: url + "/doing/getWaitTasks.action",
              method: 'GET',
              data: {
                // str1: 'waiting',
                str1: workNum
              },
              dataType: 'json',
              success: function (result) {
                if (result.code === 0) {
                  let data = result.data;
                  //判断权限
                  if(roles === 0) {
                    //初始化列表
                    $('#to_be_received_table').bootstrapTable('destroy');
                    $('#return_repair_table').bootstrapTable('destroy');
                    initTableWithoutAuthority(data);
                  } else {
                    $('#to_be_received_table').bootstrapTable('destroy');
                    $('#return_repair_table').bootstrapTable('destroy');
                    initTableWithAuthority(data);
                  }
                }
              }
            });
            swal(
              '领取成功!',
              '',
              'success'
              );
          } else {
            swal(
              '领取失败!',
              result.msg,
              'error'
              );
          }
        },
        error: function() {
          swal(
            '领取失败',
            '网络错误!',
            'error'
            );
        }
      });
    }
  });
});
