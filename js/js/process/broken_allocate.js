
let ruleArray = [];

let attr_set_table = $("#attr_set_table");

let stepsData = [];

let editFlag;

let roles = 1;

let taskArray = [];

//整个流程模板的json数组
let stepsJson = [];

let templateId;

let processIdAndNameMap = new Map();

$(document).ready(function (){

  $(".sortable-list").sortable({
    connectWith: ".connectList",
    opacity: 0.5,
    items: ".sortable",
    revert: 200,
    remove: function (event, ui) {
      $("#dunk > :not('#dunk_span')").remove();
    },
    create: function (event, ui) {
      $("#add_procedure").sortable("disable");
    },
    receive: function (event, ui) {
      $("#add_procedure").sortable("disable");
      $("#start_procedure").sortable("disable");
      $("#end_procedure").sortable("disable");
      ui.item.find("a").removeClass("icon-font").addClass(
        "font-middle").addClass("procedure-a");
    },
    sort: function (event, ui) {
      $("#add_procedure").sortable("disable");
      $("#start_procedure").sortable("disable");
      $("#end_procedure").sortable("disable");
    },
    start: function (event, ui) {
      $("#add_procedure").sortable("disable");
      $("#start_procedure").sortable("disable");
      $("#end_procedure").sortable("disable");
    },
    stop: function (event, ui) {
      $("#add_procedure").sortable("disable");
      $("#start_procedure").sortable("disable");
      $("#end_procedure").sortable("disable");
      stepsJson = [];
      $.each($(".procedure-a"), function (index, item) {
        stepsJson.push(JSON.parse($(item).attr("json")));
      });
    },

  }).disableSelection();

  //templateId = getQueryString("id");
  templateId=1;
  if (templateId !== null) {

 

    $.ajax({
      url: url + "/product/getTemp.action",
      method: 'post',
      dataType: 'json',
      // data: {
      //   str1: "01"
      // },
      success: function (result) {
        //console.log(result.steps);
        if (result.code === 0) {
          //将编辑的flag设置为true;
          editFlag = true;
          //获取到json数据
          let data = result.steps;
          $("#process_template_name").val(data.name);
          $("#process_template_description").val(data.descript);
          //设置工序序列
          $.each(data, function (index, item) {
            //console.log(item);
            $("#procedure_span").append("        <span class=\"sortable procedure_span\">\n"
              + "          <span class=\"agile-detail\">\n"
              + "            <span class=\"icon-font text-center-span\">&#xe631;</span>\n"
              //+ "            <a class=\"btn btn-success btn-rounded font-middle procedure-a\" json='"+ JSON.stringify(item) +"'>"+ processIdAndNameMap.get(item.stepNum) +"</a>\n"
              + "            <a class=\"btn btn-success btn-rounded font-middle procedure-a\" json='"+ JSON.stringify(item) +"'>"+ item.stepNum +"</a>\n"
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



  $("#add_procedure").sortable({
    connectWith: ".connectList",
    opacity: 0.5,
    items: ".sortable",
    revert: 200,
    remove: function (event, ui) {
      $("#dunk > :not('#dunk_span')").remove();
      $("#add_procedure").append("        <span class=\"sortable\">\n"
        + "          <span class=\"agile-detail\">\n"
        + "            <span class=\"icon-font text-center-span\">&#xe631;</span>\n"
        + "            <a class=\"btn btn-success btn-rounded icon-font\" json='{\"stepNum\": \"\", \"attr\": []}'>新增</a>\n"
        + "          </span>\n"
        + "        </span>");

    },
    receive: function () {
    }
  }).disableSelection();

  $("#end_procedure").sortable({
    connectWith: ".connectList",
    opacity: 0.5,
    items: ".sortable",
    revert: 200,
    remove: function (event, ui) {
      $("#dunk > :not('#dunk_span')").remove();
      $("#end_procedure").append("        <span class=\"sortable\">\n"
        + "          <span class=\"agile-detail\">\n"
        + "            <a class=\"btn btn-danger btn-rounded icon-font\">&#xe660;</a>\n"
        + "          </span>\n"
        + "        </span>");

    },
    receive: function () {
    }
  }).disableSelection();

  $("#start_procedure").sortable({
    connectWith: ".connectList",
    opacity: 0.5,
    items: ".sortable",
    revert: 200,
    remove: function (event, ui) {
      $("#dunk > :not('#dunk_span')").remove();
      $("#start_procedure").append("        <span class=\"sortable\">\n"
        + "          <span class=\"agile-detail\">\n"
        + "            <a class=\"btn btn-success btn-rounded icon-font\">&#xe61a;</a>\n"
        + "            <span class=\"icon-font text-center-span\">&#xe631;</span>\n"
        + "          </span>\n"
        + "        </span>");

    },
    receive: function (event, ui) {

    }
  }).disableSelection();



  let add_procedure = $("#add_procedure");

  add_procedure.mouseover(function () {
    $("#add_procedure").sortable("enable");
  });

  add_procedure.mouseleave(function () {
    $("#add_procedure").sortable("disable");
  });

  let start_procedure = $("#start_procedure");

  start_procedure.mouseover(function () {
    $("#start_procedure").sortable("enable");
  });

  start_procedure.mouseleave(function () {
    $("#start_procedure").sortable("disable");
  });

  let end_procedure = $("#end_procedure");

  end_procedure.mouseover(function () {
    $("#end_procedure").sortable("enable");
  });

  end_procedure.mouseleave(function () {
    $("#end_procedure").sortable("disable");
  });

//当前打开的工序的json数据中的相应字段
let currentStepNum = "";
let currentAttr = [];
//当前点击的工序
let currentStepButton;
//工序绑定事件
$(document).on('click', '.procedure-a', function () {
  currentStepButton = $(this);
  let stepJson = JSON.parse($(this).attr("json"));
  currentStepNum = stepJson.stepNum;
  currentAttr = stepJson.attr;
  //console.log(currentStepNum);
  //console.log(currentAttr);
  //获取规则库
  $.ajax({
    url: url + "/product/getRules.action",
    dataType: 'json',
    method: 'post',
    success: function (result) {
      if (result.code === 0) {
        ruleArray = result.data;
      }
    }
  });
  //获取工序库
  $.ajax({
    url: url + "/product/getTemp.action",
    dataType: 'json',
    method: 'post',
    // data: {
    //   str1: "step",
    //   str2: 0,
    //   str3: 0
    // },
    success: function (result) {
      //console.log(result.steps);
      if (result.code === 0) {
        stepsData = result.steps;
        let data = result.steps;

        let procedure_name = $("#procedure_name");
        let procedure_description = $("#procedure_description");
        procedure_description.text(data[0].descript);
        procedure_name.empty();
        for (let i = 0; i < data.length; i++) {
          procedure_name.append(
            "<option value='" + data[i].id + "'>" + data[i].name
            + "</option>");
        }
        //如果当前的工序num不为空则显示出来
        if (currentStepNum !== "") {
          for (let i = 0; i < data.length; i++) {
            if (data[i].id === currentStepNum) {
              procedure_name.val(currentStepNum);
              procedure_description.text(data[i].descript);
            }
          }
        }
        //进行表格初始化
        if (currentAttr !== []) {
          $('table').bootstrapTable('destroy');
          initTable(currentAttr);
        }else {
          $('table').bootstrapTable('destroy');
          initTable([]);
        }
      }
    }
  });
  $("#operateModal").modal({
    backdrop: 'static'
  });

});


function initTableAndResults(productId, workType) {
  $.ajax({
    url: url + 'AutoFlow/product/getBackData.action',
    method: 'get',
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
    url: url + 'AutoFlow/product/getWorkTypeByStep.action',
    method: 'get',
    dataType: 'json',
    data: {
      str1: rowJson.stepNum
    },
    success: function (result) {
      if (result.code === 0) {
        workType = $.map(result.data, function (value, index) {
          $("#workType").append(
              "<option value='" + value.id + "'>" + value.name + "</option>");
          if (index === 0) {
            $.ajax({
              url: url + 'AutoFlow/staff/getStaffByWorkType.action',
              method: 'get',
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

// 生成退换分配数据的表格
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

// 分配数量格式化
function numFormatter(value, row, index) {
  return "<input type='number' id='"+ row.matId +"' class='form-control num_input' value='0' required/>";
}




$(document).on('change', '#workType', function () {
  taskArray = [];
  let operator = [];
  //获取工种
  let workTypeValue = $("#workType").val();
  $("#add_operator").empty();
  $.ajax({
    url: url + 'AutoFlow/staff/getStaffByWorkType.action',
    method: 'get',
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
  let assignId = '01';
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
      if ($(numInput[j]).attr('id') === materialItemJson.id) {
        if (canNum < parseInt($(numInput[j]).val())) {
          swal(
              '提交失败！',
              '分配数量不能超过可分配数量！',
              'error'
          );
          return;
        } else {
          materialItemJson.num = $(numInput[j]).val();
          materials.push(materialItemJson);
          break;
        }
      }
    }

  }
  taskJson.materials = materials;
  $.ajax({
    url: url + 'AutoFlow/product/addBackTask.action',
    method: 'post',
    dataType: 'json',
    data: {
      str1: jobNum,
      str2: backStepNum,
      str3: workTypeValue,
      str4: operator,
      str5: process_instruction,
      str6: assignId,
      str7: JSON.stringify(taskJson)
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























