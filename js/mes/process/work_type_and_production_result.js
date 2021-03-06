//创建存放生产结果编号和名称对应的map
let halfResultMap = new Map();
//创建存放工种编号和名称对应的map
let workTypeMap = new Map();
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
      str2: "result"
    },
    dataType: 'json',
    success: function (result) {
      console.log(result);
      let data = result.data;
      let half = data.half;
      let types = data.types;
      //将types对应关系存入全局map中
      $.each(types, function (index, item) {
        workTypeMap.set(item.id, item.name);
        //将workTypeMap转换为select中的值
        $("#work_type_selection_select").append(
            "<option value='" + item.id + "'>" + item.name + "</option>");
      });
      //将half对应关系存入全局map中
      $.each(half, function (index, item) {
        halfResultMap.set(item.id, item.name);
        //将workTypeMap转换为select中的值
        $("#production_result_selection_select").append(
            "<option value='" + item.id + "'>" + item.name + "</option>");
      });
      //将表格的json数据存入全局变量
      tableJson = JSON.stringify(data.table);
      //alert(tableJson);
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
          title: '工种名称',
          sortable: true,
          formatter: workTypeNameFormatter
        }, {
          field: 'value',
          title: '生产结果',
          sortable: true,
          formatter: productionResultFormatter
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

//添加的生产结果(半成品)的编号
let halfNum;
//添加的工种的编号
let workTypeNum;
//右移绑定函数
$(document).on('click', '#right_shift', function () {
  //获取选中的工序
  let work_type_selection_select = $('#work_type_selection_select');
  workTypeNum = work_type_selection_select.val();
  let workTypeName = $('#work_type_selection_select option:selected').text();
  $('#work_type_result').append(
      "        <div class=\"alert alert-success alert-dismissable\">\n"
      + "          <span class=\"select_result_span\">\n"
      + "            " + workTypeName + "\n"
      + "          </span>\n"
      + "        </div>");
  //获取选中的半成品的值
  let production_result_selection_select = $(
      '#production_result_selection_select option:selected');
  halfNum = $('#production_result_selection_select').val();
  $.each(production_result_selection_select, function (index, item) {
    $('#production_result_result').append(
        "        <div class=\"alert alert-warning alert-dismissable\">\n"
        + "          <span class=\"select_result_span\">\n"
        + "            " + item.text + "\n"
        + "          </span>\n"
        + "        </div>");
  });
});

//添加按钮绑定函数
$(document).on('click', '#add_btn', function () {
  let production_result_result = $('#production_result_result');
  let work_type_result = $('#work_type_result');
  let addRowJson = {};
  addRowJson.num = workTypeNum;
  addRowJson.value = halfNum.toString();
  tableJson = JSON.parse(tableJson);
  for (let i = 0; i < tableJson.length; i++) {
    if (workTypeNum === tableJson[i].num){
      swal(
          '添加失败!',
          '已存在该工种生产结果绑定,请删除后再次添加',
          'error'
      );
      tableJson = JSON.stringify(tableJson);
      production_result_result.empty();
      work_type_result.empty();
      return;
    }
  }
  tableJson.push(addRowJson);
  tableJson = JSON.stringify(tableJson);
  //重新刷新表格
  $("table").bootstrapTable('destroy');
  initTable(tableJson);
  //将结果panel中清空
  production_result_result.empty();
  work_type_result.empty();
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
      str2: "result",
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
      title: '工种名称',
      sortable: true,
      formatter: workTypeNameFormatter
    }, {
      field: 'value',
      title: '生产结果',
      sortable: true,
      formatter: productionResultFormatter
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

function workTypeNameFormatter(value, row, index){
  return workTypeMap.get(parseInt(value));
}

function productionResultFormatter(value, row, index){
  let valueArray = value.split(",");
  $.each(valueArray, function (arrayIndex, arrayItem) {
    value = value.replace(arrayItem,halfResultMap.get(parseInt(arrayItem)));
  });
  return value;
}

//重置按钮
$(document).on('click', '#reset_btn', function () {
  $("#production_result_result").empty();
  $("#work_type_result").empty();
  workTypeNum = null ;
  halfNum = null;
});