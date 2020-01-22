let roles = 1;
let taskArray = [];

$(function () {
  $("#addForm").validate();
  if(roles === 0){
    $("#toolbar").remove();
    $('#table').bootstrapTable({
      url: url + '/product/getBacks.action',
      method: 'post',
      pagination: true,
      search: true,
      dataType:'json',
      toolbar:'#toolbar',
      contentType: "application/x-www-form-urlencoded",
      striped:true,
      sidePagination:'server',
      pageNumber: 1,
      responseHandler:function(res){
        res.total=res.count;
        return res;
      },
      queryParams:function(params){
        return{
          str1: params.limit,
          str2: (params.offset/params.limit)+1,
        }
      },
      pageSize:'15',
      pageList: [10, 25, 50, 100],
      showRefresh:true,
      dataField: "data",
      mobileResponsive:true,
      useRowAttrFunc: true,
      columns:[{
        field:'orderNum',
        title:'订单号',
        sortable:true,
      },{
        field: 'goodsNum',
        title: '单品号',
        sortable: true,
      },{
        field:'stepName',
        title:'工序名称',
        sortable:true,
      },{
        field:'workName',
        title:'操作员姓名',
        sortable:true,
      },{
        field:'backName',
        title:'退换物品名',
        sortable:true,
      },{
        field:'backNum',
        title:'数量',
        sortable:true,
      },{
        field:'quesName',
        title:'问题名',
        sortable:true,
      },{
        field:'backStepName',
        title:'退换工序名',
        sortable:true,
      }
      ]
    })

  }
  else
    $('#table').bootstrapTable({
      // url:'https://easy-mock.com/mock/5d14258323814619b952ba12/product/product/getBacks.action',
      url: url + '/product/getBacks.action',
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
      //服务器查询将服务器返回的输出修改成table需要的格式
      responseHandler:function(res){
        res.total=res.count;
        return res;
      },
      //设置分页逻辑，根据接口将值传给后台
      queryParams:function(params){
        return{
          str1: params.limit,
          str2: (params.offset/params.limit)+1,
        }
      },
      columns:[{
        field:'orderNum',
        title:'订单号',
        sortable:true,
      },{
        field: 'goodsNum',
        title: '单品号',
        sortable: true,
      },{
        field:'stepName',
        title:'工序名称',
        sortable:true,
      },{
        field:'workName',
        title:'操作员姓名',
        sortable:true,
      },{
        field:'backName',
        title:'退换物品名',
        sortable:true,
      },{
        field:'backNum',
        title:'数量',
        sortable:true,
      },{
        field:'quesName',
        title:'问题名',
        sortable:true,
      },{
        field:'backStepName',
        title:'退换工序名',
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
    let result = "";
    result += "<button row='"+ JSON.stringify(row) +"' class='btn btn-xs btn-primary operate' title='操作'><span>操作</span></button>";
    return result;
  }

});


function initTableAndResults(productId, workType) {
  $.ajax({
    url: url + '/product/getBackData.action',
    method: 'post',
    dataType: 'json',
    data: {
      str1: productId,
      str2: workType
    },
    success: function(result) {
      initBackTable(result.data.materials);
      let resultSelect = $('#result');
      resultSelect.empty();
      // 将result加入多选框中
      let results = result.data.results;
      for (let i = 0; i < results.length; i++) {
        resultSelect.append("<option value='"+ results[i].matId +"'>"+ results[i].matName +"</option>");
      }
    }
  });
}

let goodsNum;
let returnId;
let backStepNum;
let productId;
let orderNum;
// 点击操作按钮事件
$(document).on('click', '.operate', function () {
  let rowJson = JSON.parse($(this).attr("row"));
  // console.log(rowJson);
  quesId=rowJson.quesId;
  // 获取单品表id
  productId = rowJson.productId;
  // 获取退换工序id
  backStepNum = rowJson.backStepNum;
  // 获取退换记录id
  returnId = rowJson.id;
  // 获取单品id
  goodsNum = rowJson.goodsNum;
  // 获取订单id
  orderNum = rowJson.orderNum;
  // 清空元素
  $('#process').empty();
  $('#workType').empty();
  $('#add_operator').empty();
  $('#process_instruction').val('');
  $('#handBackTable').bootstrapTable('destroy');
  // 打开模态框
  $('#operateModal').modal({
    backdrop: 'static'
  });
  // 填充数据
  $('#jobNum').text((new Date()).valueOf());
  $('#handback_thing').text(rowJson.backName);
  $('#problem_name').text(rowJson.quesName);
  $('#problem_description').text(rowJson.quesDesc);
  $('#handback_instruction').text(rowJson.backCommit);
  //获取工种信息
  $.ajax({
    url: url + '/product/getStepByQues.action',
    method: 'post',
    dataType: 'json',
    data: {
      str1: productId,
      str2: quesId
    },
    success:function(result){
      if(result.code===0){
        $.map(result.data, function (value, index) {
          $("#process").append(
            "<option value='" + value.id + "'>" + value.name + "</option>");
          if (index === 0) {
            $.ajax({
              url: url + '/product/getWorkTypeByStep.action',
              method: 'post',
              dataType: 'json',
              data: {
                str1: value.id
                // str1: rowJson.stepNum
              },
              success: function (result) {
                if (result.code === 0) {
                  workType = $.map(result.data, function (value, index) {
                    $("#workType").append(
                      "<option value='" + value.id + "'>" + value.name + "</option>");
                    if (index === 0) {
                      $.ajax({
                        url: url + '/staff/getStaffByWorkType.action',
                        method: 'post',
                        dataType: 'json',
                        data: {
                          str1: value.id
                        },
                        success: function (result) {
                          if (result.code === 0) {
                            $.map(result.data, function (value, index) {
                              $("#add_operator").append(
                                "<option value='" + value.workNum + "'>" + value.name
                                + "</option>");
                              return [value];
                            });
                            // 初始化表格和结果集
                            initTableAndResults(productId, $("#workType").val());
                          }
                        }
                      });
                    }
                    return [value];
                  });
                }

              }
            });

          }
          return [value];
        });
      }
    }
  });

  // $.ajax({
  //   url: url + '/product/getWorkTypeByStep.action',
  //   method: 'post',
  //   dataType: 'json',
  //   data: {
  //     str1: rowJson.stepNum
  //   },
  //   success: function (result) {
  //     if (result.code === 0) {
  //       workType = $.map(result.data, function (value, index) {
  //         $("#workType").append(
  //             "<option value='" + value.id + "'>" + value.name + "</option>");
  //         if (index === 0) {
  //           $.ajax({
  //             url: url + '/staff/getStaffByWorkType.action',
  //             method: 'post',
  //             dataType: 'json',
  //             data: {
  //               str1: value.id
  //             },
  //             success: function (result) {
  //               if (result.code === 0) {
  //                 $.map(result.data, function (value, index) {
  //                   $("#add_operator").append(
  //                       "<option value='" + value.workNum + "'>" + value.name
  //                       + "</option>");
  //                   return [value];
  //                 });
  //                 // 初始化表格和结果集
  //                 initTableAndResults(productId, $("#workType").val());
  //               }
  //             }
  //           });
  //         }
  //         return [value];
  //       });
  //     }

  //   }
  // });

});

// 生成退换分配数据的表格
function initBackTable(materials) {
  $('#handBackTable').bootstrapTable({
    data: materials,
    method: 'post',
    pagination: true,
    dataType: 'json',
    striped: true,
    sidePagination: 'client',
    pageSize: '15',
    pageList: [10, 25, 50, 100],
    contentType: "application/x-www-form-urlencoded",
    mobileResponsive: true,
    useRowAttrFunc: true,
    onCheck: onCheck,
    onUncheck: unCheck,
    checkboxHeader: false,
    columns: [
    {
      checkbox: true,
    }, {
      field: 'matId',
      title: '物料id',
      sortable: true,
    }, {
      field: 'matName',
      title: '物料名',
      sortable: true,
    }, {
      field: 'canNum',
      title: '可分配数量',
      sortable: true,
    } ,{
      field: 'num',
      title: '分配数量',
      sortable: true,
      formatter: numFormatter
    }
    ]
  });
}

// 分配数量格式化
function numFormatter(value, row, index) {
  return "<input type='number' id='"+ row.matId +"' class='form-control num_input' value='0' required/>";
}

//根据工序选择工种
$(document).on('change', '#process', function () {
  let workType = [];
  //获取工种
  let processValue = $("#process").val();
  $("#workType").empty();
  $.ajax({
    url: url + '/product/getWorkTypeByStep.action',
    method: 'post',
    dataType: 'json',
    data: {
      str1: processValue
    },
    success: function (result) {
      if (result.code === 0) {
        workType = $.map(result.data, function (value, index) {
          $("#workType").append(
            "<option value='" + value.id + "'>" + value.name
            + "</option>");
          return [value];
        });
      }
      taskArray = [];
      let operator = [];
      //获取工种
      let workTypeValue = $("#workType").val();
      $("#add_operator").empty();
      $.ajax({
        url: url + '/staff/getStaffByWorkType.action',
        method: 'post',
        dataType: 'json',
        data: {
          str1: workTypeValue
        },
        success: function (result) {
          if (result.code === 0) {
            operator = $.map(result.data, function (value, index) {
              $("#add_operator").append(
                "<option value='" + value.workNum + "'>" + value.name
                + "</option>");
              return [value];
            });
          }
        }
      });
      //更新表格
      $('#handBackTable').bootstrapTable('destroy');
      initTableAndResults(productId, workTypeValue);
    }
  });

});


//根据工种更新表格
$(document).on('change', '#workType', function () {
  taskArray = [];
  let operator = [];
  //获取工种
  let workTypeValue = $("#workType").val();
  $("#add_operator").empty();
  $.ajax({
    url: url + '/staff/getStaffByWorkType.action',
    method: 'post',
    dataType: 'json',
    data: {
      str1: workTypeValue
    },
    success: function (result) {
      if (result.code === 0) {
        operator = $.map(result.data, function (value, index) {
          $("#add_operator").append(
            "<option value='" + value.workNum + "'>" + value.name
            + "</option>");
          return [value];
        });
      }
    }
  });
  //更新表格
  $('#handBackTable').bootstrapTable('destroy');
  initTableAndResults(productId, workTypeValue);

});


// 选中一行
function onCheck(row) {
  taskArray.push(row);
}
// 取消选中
function unCheck(row) {
  for (let i = 0; i < taskArray.length; i++) {
    if (taskArray[i] == row) {
      taskArray.splice(i, 1);
    }
  }
}

$(document).on('click', '#submit_btn', function () {
  // 获取到相应参数
  let jobNum = $('#jobNum').text();
  let workTypeValue = $("#workType").val();
  let operator = $('#add_operator').val();
  let process_instruction = $('#process_instruction').val();
  let assignId = sessionStorage.getItem("workNum");
  // 提交的json
  let commitJson = {};
  commitJson.id = returnId;
  commitJson.remark = process_instruction;
  let taskJson = {};
  taskJson.goodsNum = goodsNum;
  taskJson.orderNum = orderNum;
  taskJson.id = productId;
  let result = $('#result').val();
  if (result === null) {
    swal(
      '提交失败！',
      '请选择完成物品！',
      'error'
      );
    return;
  }
  taskJson.results = result.toString();
  let materials = [];
  let numInput = $('.num_input');
  for (let i = 0; i < taskArray.length; i++) {
    let materialItemJson = {};
    materialItemJson.id = taskArray[i].matId;
    let canNum = parseInt(taskArray[i].canNum);
    for (let j = 0; j < numInput.length; j++) {
      if ($(numInput[j]).attr('id') === (materialItemJson.id).toString()) {
        if (canNum < parseInt($(numInput[j]).val())) {
          swal(
            '提交失败！',
            '分配数量不能超过可分配数量！',
            'error'
            );  
          return;
        } else if(parseInt($(numInput[j]).val())<=0){
          swal(
            '提交失败！',
            '分配数量不能小于0！',
            'error'
            );  
          return;
        }else {
          materialItemJson.num = $(numInput[j]).val();
          materials.push(materialItemJson);
          break;
        }
      }
    }

  }
  taskJson.materials = materials;
  commitJson.tasks=taskJson;
  $.ajax({
    url: url + '/product/addBackTask.action',
    method: 'post',
    dataType: 'json',
    data: {
      str1: jobNum,
      str2: backStepNum,
      str3: workTypeValue,
      str4: operator,
      str5: process_instruction,
      str6: assignId,
      str7: JSON.stringify(commitJson)
    },
    success: function (result) {
      if (result.code === 0) {
        swal(
          '提交成功！',
          '',
          'success'
          );
        $('#operateModal').modal('hide');
      }
    }
  });
});




