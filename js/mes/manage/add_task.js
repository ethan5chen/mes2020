let process_name;
let process_descript;
let process_id;
let wtId;

let taskArray = [];
let workType = [];

let originNumMap = new Map();

$(function () {
  process_id = getQueryString("id");
  process_name = decodeURI(getQueryString("name"));
  process_descript = decodeURI(getQueryString("descript"));

  $("#add_jobNum").text((new Date()).valueOf());
  $("#add_stepName").text(process_name);
  $("#add_description").text(process_descript);

  //获取工种信息
  $.ajax({
    url: url + '/product/getWorkTypeByStep.action',
    method: 'post',
    dataType: 'json',
    data: {
      str1: process_id
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
                  $('table').bootstrapTable({
                    url: url + "/product/getMatByStep_workType.action",
                    method: 'post',
                    pagination: true,
                    dataType: 'json',
                    striped: true,
                    sidePagination: 'client',
                    pageSize: '15',
                    pageList: [10, 25, 50, 100],
                    dataField: "data",
                    contentType: "application/x-www-form-urlencoded",
                    mobileResponsive: true,
                    useRowAttrFunc: true,
                    onCheck: onCheck,
                    onUncheck: unCheck,
                    checkboxHeader: false,
                    queryParams: function () {
                      return {
                        str1: process_id,
                        str2: $("#workType").val(),
                      }
                    },
                    columns: [
                    {
                      checkbox: true,
                    }, {
                      field: 'matName',
                      title: '物料名',
                      sortable: true,
                    }, {
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
                    }, {
                      field: 'orderNum',
                      title: '订单号',
                      sortable: true,
                    }, {
                      field: 'goodsNum',
                      title: '单品号',
                      sortable: true,
                    }, {
                      field: 'goodsName',
                      title: '单品名',
                      sortable: true,
                    }, {
                      field: 'canNum',
                      title: '可分配数量',
                      sortable: true,
                    }
                    ]
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

});

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
      //console.log("result......................");
      //console.log(result);
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
  let table = $('table');
  //更新表格
  table.bootstrapTable('refresh');

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

// 点击分配按钮触发事件
$(document).on('click', '#assign_btn', function () {
  // 最终需要提交的json数据
  let commitJson = {};
  commitJson.wtId = $("#workType").val();
  commitJson.comments = $("#add_commit").val();
  let jsonArray = [];
  for (let i = 0; i < taskArray.length; i++) {
    let flag = true;
    let itemJson = {};
    for (let j = 0; j < jsonArray.length; j++) {
      if (jsonArray[j].productId === taskArray[i].productId) {
        flag = false;
        let blendJson = {};
        blendJson.origin = taskArray[i].origin;
        blendJson.matId = taskArray[i].matId;
        blendJson.matName = taskArray[i].matName;
        blendJson.subMan = "无";
        blendJson.canNum = taskArray[i].canNum;
        blendJson.num = "";
        jsonArray[j].materials.push(blendJson);
      }
    }
    if (flag) {
      itemJson.productId = taskArray[i].productId;
      itemJson.orderNum = taskArray[i].orderNum;
      itemJson.goodsNum = taskArray[i].goodsNum;
      itemJson.goodsName = taskArray[i].goodsName;
      itemJson.results = "";
      let materialsArray = [];
      let materialsJson = {};
      materialsJson.origin = taskArray[i].origin;
      materialsJson.matId = taskArray[i].matId;
      materialsJson.matName = taskArray[i].matName;
      materialsJson.subMan = "无";
      materialsJson.canNum = taskArray[i].canNum;
      materialsJson.num = "";
      materialsArray.push(materialsJson);
      itemJson.materials = materialsArray;
      jsonArray.push(itemJson);
    }
  }
  commitJson.tasks = jsonArray;
  //console.log(".........commitJson.............");
  //console.log(commitJson);
  // 发送请求获取封装好的数据
  $.ajax({
    url:'https://www.easy-mock.com/mock/5d14258323814619b952ba12/product/product/getSelDetail.action',
    // url: url + '/product/getSelDetail.action',
    method: 'post',
    dataType: 'json',
    data: {
      str1: JSON.stringify(commitJson)
    },
    success: function (result) {
      console.log(JSON.stringify(result));
      if (result.code === 0) {
        let returnJson = result.data;
        let originNumJson = returnJson.origin;
        for (let i = 0; i < originNumJson.length; i++) {
          originNumMap.set(originNumJson[i].id,originNumJson[i].num);
        }
        // 解析json数据
        let comments = returnJson.comments;
        wtId = returnJson.wtId;
        let table_collection = $('#table_collection');
        // 清除模态框里的内容
        table_collection.empty();
        // 打开分配模态框
        $("#assignModal").modal({
          backdrop: 'static'
        });
        // 填充数据
        $("#jobNum").text($("#add_jobNum").text());
        $("#stepName").text($("#add_stepName").text());
        $("#description").text($("#add_description").text());
        $("#assign_wt").text($("#workType :selected").text());
        $("#operator").text($("#add_operator :selected").text());
        $("#commit").text(comments);
        let tasksArray = JSON.parse(JSON.stringify(returnJson.tasks));
        //console.log(result);
        for (let i = 0; i < tasksArray.length; i++) {
          let orderNum = tasksArray[i].orderNum;
          let goodsNum = tasksArray[i].goodsNum;
          let goodsName = tasksArray[i].goodsName;
          let productId = tasksArray[i].productId;
          //console.log(tasksArray[i].results);
          let results = tasksArray[i].results;
          //将数据变成表格添加到table集合中
          table_collection.append(
            "            <div class=\"task-panel panel panel-default\">\n"
            + "              <div class=\"panel-heading\">\n"
            + "                <h4 class=\"panel-title\">\n"
            + "                  <a data-toggle=\"collapse\" href='" + "#"
            + productId + "'>\n"
            + "                    <span>订单号：</span>\n"
            + "                    <span class=\"submitOrderNum margin-right-20\">"
            + orderNum + "</span>\n"
            + "                    <span>单品号：</span>\n"
            + "                    <span class=\"submitGoodsNum margin-right-20\">"
            + goodsNum + "</span>\n"
            + "                    <span>单品名：</span>\n"
            + "                    <span class=\"goodsName margin-right-20\">"
            + goodsName + "</span>\n"
            + "                  </a>\n"
            + "                </h4>\n"
            + "              </div>\n"
            + "              <div id=" + productId
            + " class=\"product_panel panel-collapse collapse\">\n"
            + "                <div class=\"form-group\">\n"
            + "                  <label style=\"margin-bottom: 10px;margin-top: 5px\">物料分配：</label>\n"
            + "                  <table class='assign_table' id=" + orderNum
            + "></table>\n"
            + "                </div>\n"
            + "                <div class=\"form-group\">\n"
            + "                  <label style=\"margin-bottom: 0\">生产结果：</label>\n"
            + "           <select style='margin-top: 5px;margin-bottom: 0;height: 70px' id='select_"+ orderNum +"' class='form-control resultSelect' multiple>\n"
            + "</select>\n"
            + "                </div>\n"
            + "              </div>\n"
            + "            </div>");
          for (let j = 0; j < results.length; j++) {
            $("#select_" + orderNum).append("<option value='"+ results[j].matId +"'>"+ results[j].matName +"</option>")
          }
          $('#' + orderNum).bootstrapTable({
            data: tasksArray[i].materials,
            dataType: 'json',
            striped: true,
            pageSize: '15',
            pageList: [10, 25, 50, 100],
            contentType: "application/x-www-form-urlencoded",
            mobileResponsive: true,
            useRowAttrFunc: true,
            columns: [{
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
            }, {
              field: 'matName',
              title: '物料名',
              sortable: true,
            }, {
              field: 'subMan',
              title: '提交人',
              sortable: true,
              formatter: subManFormatter
            }, {
              field: 'canNum',
              title: '可分配数量',
              sortable: true,
            }, {
              field: 'num',
              title: '分配数量',
              sortable: true,
              formatter: numFormatter
            }]
          });
        }
      }
    }
  });

});

// 分配数量格式化
function numFormatter(value, row, index) {
  if (row.subMan === "无") {
    return "<input type='number' index="+ index +" class='form-control num_input'  value='0' rowId="+ row.matId +" required/>";
  } else {
    return value;
  }
}

// 提交人格式化
function subManFormatter(value, row, index) {
  if (value !== "无" && value.length > 0) {
    let select = $("<select jsonValue='" + JSON.stringify(value)
      + "' class='subman_select form-control' index='" + index
      + "' ></select>");
    for (let i = 0; i < value.length; i++) {
      if (value[i].selected === true) {
        select.append("<option selected='selected' value='" + value[i].workNum
          + "' canNum='" + value[i].canNum + "'>" + value[i].name
          + "</option>");
      } else {
        select.append("<option value='" + value[i].id + "' canNum='"
          + value[i].canNum + "'>" + value[i].name + "</option>");
      }
    }
    return select.prop("outerHTML");
  } else {
    return value;
  }
}

$(document).on('focus', '.num_input', function () {
  let rowId = $(this).attr("rowId");
  let index = $(this).attr("index");
  let originNum = originNumMap.get(rowId);
  $(this).parents('table').bootstrapTable('updateCell', {
    index: index,       //行索引
    field: "canNum",       //列名
    value: originNum,
    // 防止刷新
    reinit: false
  });
  $(this).parent().prev().html(originNum);
});

$(document).on('change', '.num_input', function () {
  let rowId = $(this).attr("rowId");
  let originNum = originNumMap.get(rowId);
  originNumMap.set(rowId,originNum-$(this).val());
});

// 当提交人发生变化时触发可分配和分配数量的变化
$(document).on('change', '.subman_select', function () {
  let workNum = $(this).val();
  // 首先获取到该单选框的父表格元素
  // 获取到人员的可分配数量
  let canNum = $(this).children(':selected').attr("canNum");
  let index = $(this).attr("index");
  // 获取到jsonValue值
  let jsonValue = JSON.parse($(this).attr("jsonValue"));
  for (let i = 0; i < jsonValue.length; i++) {
    jsonValue[i].selected = (jsonValue[i].id === workNum);
  }
  $(this).parents('table').bootstrapTable('updateCell', {
    index: index,       //行索引
    field: "num",       //列名
    value: canNum,
    // 防止刷新
    reinit: false
  });
  $(this).parents('table').bootstrapTable('updateCell', {
    index: index,       //行索引
    field: "canNum",       //列名
    value: canNum,
    // 防止刷新
    reinit: false
  });
  $(this).parents('table').bootstrapTable('updateCell', {
    index: index,       //行索引
    field: "subMan",       //列名
    value: jsonValue,
  });
});

$(document).on('click', '#submit_btn', function () {
  // 首先获取到工单号，工序id，工种id，操作员工号，备注，分配员工号
  let jobNum = $('#jobNum').text();
  let comments = $('#commit').text();
  let processId = process_id;
  let workTypeId = wtId;
  //操作人工号
  let operator = $("#add_operator").val();
  //console.log("operatorNum:"+operator);
  // 分配人 工号
  let assignId = sessionStorage.getItem("workNum");
  // 需要提交的json数据
  let commitJson = {};
  let tasks = [];
  let taskPanel = $('.task-panel');
  let taskLength = taskPanel.length;
  // 获取到表格的元素集
  let tableCollection = $('.assign_table');
  let subman_select_time = 0;
  let num_input_time = 0;
  for (let i = 0; i < taskLength; i++) {
    let taskItem = {};
    taskItem.orderNum = $($('.submitOrderNum')[i]).text();
    taskItem.goodsNum = $($('.submitGoodsNum')[i]).text();
    taskItem.id = $($('.product_panel')[i]).attr('id');
    if (($($('.resultSelect')[i]).val()) === null) {
      swal(
        '提交失败',
        '请选择生产结果!',
        'error'
        );
      return;
    }
    taskItem.results = ($($('.resultSelect')[i]).val()).toString();
    let materials = [];
    let tableJson = $(tableCollection[i]).bootstrapTable('getData');
    for (let j = 0; j < tableJson.length; j++) {
      let tableItemJson = {};
      tableItemJson.origin = tableJson[j].origin;
      tableItemJson.id = tableJson[j].matId;
      if (tableJson[j].subMan !== '无' && tableJson[j].subMan.length > 0) {
        tableItemJson.subMan = $($('.subman_select')[subman_select_time]).val();
        subman_select_time ++;
        tableItemJson.num = tableJson[j].num;
      } else {
        tableItemJson.subMan = '无';
        let num = $($('.num_input')[num_input_time]).val();
        if (parseInt(num) > parseInt(tableJson[j].canNum)) {
          swal(
            '提交失败',
            '分配数量不能大于可分配数量!',
            'error'
            );
          return;
        }
        tableItemJson.num = num;
        num_input_time ++;
      }
      materials.push(tableItemJson);
    }
    taskItem.materials = materials;
    tasks.push(taskItem);
  }
  commitJson.tasks = tasks;
  $.ajax({
    url: url + '/product/addTask.action',
    method: 'post',
    dataType: 'json',
    data: {
      str1: jobNum,
      str2: processId,
      str3: workTypeId,
      str4: operator,
      str5: comments,
      str6: assignId,
      str7: JSON.stringify(commitJson)
    },
    success: function(result) {
      if (result.code === 0) {
        swal(
          '提交成功',
          '',
          'success'
          );
        $("#assignModal").modal('hide');
        location.reload();
      } else {
        swal(
          '提交失败',
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
