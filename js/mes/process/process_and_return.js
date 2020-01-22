//创建存放工序编号和名称对应的map
let processMap = new Map();
//创建存放返修问题编号和名称对应的map
let returnMap = new Map();
//存放当前table的json数据
let tableJson;
let process_num = getQueryString("id");
//界面渲染后
$(function () {
  $.ajax({
    url: url + "/template/getRelation.action",
    method: 'post',
    data: {
      str1: process_num,
      str2: "back"
    },
    dataType: 'json',
    success: function (result) {
      console.log(result);
      let data = result.data;
      let steps = data.steps;
      let question = data.ques;
      //将steps对应关系存入全局map中
      $.each(steps, function (index, item) {
        processMap.set(item.id, item.name);
        //将stepsMap转换为select中的值
        $("#process_selection_select").append(
            "<option value='" + item.id + "'>" + item.name + "</option>");
      });
      //将ques对应关系存入全局map中
      $.each(question, function (index, item) {
        returnMap.set(item.id, item.name);
        //将returnMap转换为select中的值
        $("#return_selection_select").append(
            "<option value='" + item.id + "'>" + item.name + "</option>");
      });
      //将表格的json数据存入全局变量
      tableJson = JSON.stringify(data.table);
      //增加表格
      $('table').bootstrapTable({
        data: data.table,
        pagination: true,
        uniqueId: 'num',
        search: true,
        dataType: 'json',
        striped: true,
        sidePagination: 'client',
        pageSize: '15',
        pageList: [10, 25, 50, 100],
        showRefresh: true,
        dataField: "data",
        contentType: "application/x-www-form-urlencoded",
        mobileResponsive: true,
        useRowAttrFunc: true,
        columns: [{
          field: 'num',
          title: '返修工序',
          sortable: true,
          formatter: processNameFormatter
        }, {
          field: 'value',
          title: '问题',
          sortable: true,
          formatter: returnNameFormatter
        }, {
          field: 'null',
          title: '操作',
          formatter: actionFormatter
        }
        ]
      });
    }
  });

});

//添加的工序的编号
let processNum;
//添加的返修问题的编号
let returnNum;
//右移绑定函数
$(document).on('click', '#right_shift', function () {
  //获取选中的工序
  let process_selection_select = $('#process_selection_select');
  processNum = process_selection_select.val();
  let processName = $('#process_selection_select option:selected').text();
  $('#process_result').append(
      "        <div class=\"alert alert-success alert-dismissable\">\n"
      + "          <span class=\"select_result_span\">\n"
      + "            " + processName + "\n"
      + "          </span>\n"
      + "        </div>");
  //获取选中的返修问题的值
  let return_selection_select = $(
      '#return_selection_select option:selected');
  returnNum = $('#return_selection_select').val();
  $.each(return_selection_select, function (index, item) {
    $('#return_result').append(
        "        <div class=\"alert alert-warning alert-dismissable\">\n"
        + "          <span class=\"select_result_span\">\n"
        + "            " + item.text + "\n"
        + "          </span>\n"
        + "        </div>");
  });
});

//添加按钮绑定函数
$(document).on('click', '#add_btn', function () {
  let process_result = $('#process_result');
  let return_result = $('#return_result');
  let addRowJson = {};
  addRowJson.num = processNum;
  //alert(returnNum);
  addRowJson.value = returnNum.toString();
  tableJson = JSON.parse(tableJson);
  for (let i = 0; i < tableJson.length; i++) {
    if (processNum === tableJson[i].num){
      swal(
          '添加失败!',
          '已存在该工序返修绑定,请删除后再次添加',
          'error'
      );
      tableJson = JSON.stringify(tableJson);
      process_result.empty();
      return_result.empty();
      return;
    }
  }
  tableJson.push(addRowJson);
  tableJson = JSON.stringify(tableJson);
  //重新刷新表格
  $("table").bootstrapTable('destroy');
  initTable(tableJson);
  //将结果panel中清空
  process_result.empty();
  return_result.empty();
  //提示弹框
  swal(
      '添加成功!',
      '',
      'success'
  );
});

//删除绑定按钮
$(document).on('click', '.deleteButton', function () {
  let num = $(this).attr("num");
  //弹出模态提示框
  swal({
    title: '您是否要删除?',
    text: "",
    type: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    confirmButtonText: '确定',
    cancelButtonColor: '#d33',
    cancelButtonText: "取消",
  }).then(function (isConfirm) {
    if (isConfirm) {
      $("table").bootstrapTable('destroy');
      tableJson = JSON.parse(tableJson);
      for (let i = 0; i < tableJson.length; i++) {
        if (tableJson[i].num === num) {
          tableJson.splice(i, 1);
        }
      }
      tableJson = JSON.stringify(tableJson);
      initTable(tableJson);
    }
  });
});

//保存按钮绑定事件
$(document).on('click', '#save-btn', function () {
  $.ajax({
    url: url + "/template/saveRelation.action",
    method: 'POST',
    dataType: 'json',
    data: {
      str1: process_num,
      str2: "back",
      str3: tableJson
    },
    success: function (result) {
      if (result.code === 0) {
        swal(
            '保存成功!',
            '',
            'success'
        );
      } else {
        swal(
            '保存失败!',
            '',
            'error'
        );
      }
    }
  })
});

function initTable(data) {
  data = JSON.parse(data);
  $('table').bootstrapTable({
    data: data,
    pagination: true,
    uniqueId: 'num',
    search: true,
    dataType: 'json',
    striped: true,
    sidePagination: 'client',
    pageSize: '15',
    pageList: [10, 25, 50, 100],
    showRefresh: true,
    dataField: "data",
    contentType: "application/x-www-form-urlencoded",
    mobileResponsive: true,
    useRowAttrFunc: true,
    columns: [{
      field: 'num',
      title: '返修工序',
      sortable: true,
      formatter: processNameFormatter
    }, {
      field: 'value',
      title: '问题',
      sortable: true,
      formatter: returnNameFormatter
    }, {
      field: 'null',
      title: '操作',
      formatter: actionFormatter
    }
    ]
  });
}

//渲染按钮
function actionFormatter(value, row, index) {
  let num = row.num;
  let result = "";
  result += "<button class='btn btn-md btn-danger btn-rounded deleteButton' num="+ num +" title='删除'><span>删 除</span></button>";
  return result;
}

function processNameFormatter(value, row, index){
  return processMap.get(parseInt(value));
}

function returnNameFormatter(value, row, index){
  let valueArray = value.split(",");
  $.each(valueArray, function (arrayIndex, arrayItem) {
    value = value.replace(arrayItem,
        returnMap.get(parseInt(arrayItem)));
  });
  return value;
}

//重置按钮
$(document).on('click', '#reset_btn', function () {
  $("#process_result").empty();
  $("#return_result").empty();
  returnNum = null ;
  processNum = null;
});