
let stepsData = [];

let taskArray = [];

let productId;

let returnId;

let goodsNum;

let orderNum;

let stepNum;

let processIdAndNameMap = new Map();

$(document).ready(function (){

  productId = getQueryString("id");

  returnId = getQueryString("returnId");

  goodsNum = getQueryString("goodsNum");

  orderNum = getQueryString("orderNum");

  if (productId !== null) {

    $.ajax({
      url: url + "/dataDict/getDict.action",
      dataType: 'json',
      async: false,
      method: 'post',
      data: {
        str1: "step",
        str2: 0,
        str3: 0
      },
      success: function (result) {
        if (result.code === 0) {
          stepsData = result.data;
          let data = result.data;
          if (data.length > 0) {
            $.each(data, function (index, item) {
              processIdAndNameMap.set(item.id, item.name);
            });
          }
        }
      }
    });

    $.ajax({
      url: url + "/product/getFlowStep.action",
      method: 'post',
      dataType: 'json',
      data: {
        str1: productId
      },
      success: function (result) {
        if (result.code === 0) {
          //将编辑的flag设置为true;
          editFlag = true;
          //获取到json数据
          let data = result.data;
          //设置工序序列
          $.each(data.steps, function (index, item) {
            $("#start_span").append("        <span class=\"sortable procedure_span\">\n"
                + "          <span class=\"agile-detail\">\n"
                + "            <span class=\"icon-font text-center-span\">&#xe631;</span>\n"
                + "            <a class=\"btn btn-success  font-middle procedure-a\" stepNum='"+ item.stepNum +"'>"+ processIdAndNameMap.get(item.stepNum) +"</a>\n"
                + "          </span>\n"
                + "        </span>");
          });


        } else if (result.code === 1) {
          swal(
              '获取数据失败!',
              result.msg,
              'error'
          );
        }
      },
      error: function () {
        swal(
            '获取数据失败!',
            '网络错误',
            'error'
        );
      }
    })
  }


});


// 点击操作按钮事件
$(document).on('click', '.procedure-a', function () {
  // 获取单品表id
  // 清空元素
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
  // 获取工序id
  stepNum = $(this).attr('stepNum');
  //获取工种信息
  $.ajax({
    url: url + '/product/getWorkTypeByStep.action',
    method: 'post',
    dataType: 'json',
    data: {
      str1: stepNum
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

});

function initBackTable(materials) {
  $('#handBackTable').bootstrapTable({
    data: materials,
    method: 'get',
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

// 分配数量格式化
function numFormatter(value, row, index) {
  return "<input type='number' id='"+ row.matId +"' class='form-control num_input' value='0' required/>";
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
  //console.log(commitJson);
  $.ajax({
    url: url + '/product/addTornTask.action',
    method: 'post',
    dataType: 'json',
    data: {
      str1: jobNum,
      str2: stepNum,
      str3: workTypeValue,
      str4: operator,
      str5: process_instruction,
      str6: assignId,
      str7: JSON.stringify(commitJson)
    },
    success: function (result) {
      //alert(JSON.stringify(taskJson));
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
