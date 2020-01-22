//创建存放工种编号和名称对应的map
let workTypeMap = new Map();
//创建存放原材料编号和名称对应的map
let originMap = new Map();
//创建存放半成品编号和名称对应的map
let halfMap = new Map();
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
      str2: "material"
    },
    dataType: 'json',
    success: function (result) {
      let data = result.data;
      let types = data.types;
      let origin = data.origin;
      let half = data.half;
      //将types对应关系存入全局map中
      $.each(types, function (index, item) {
        workTypeMap.set(item.id, item.name);
        //将workTypeMap转换为select中的值
        $("#work_type_selection_select").append(
          "<option value='" + item.id + "'>" + item.name + "</option>");
      });
      //将origin对应关系存入全局map中
      $.each(origin, function (index, item) {
        originMap.set(item.id, item.name);
        //将originMap转换为select中的值
        $("#origin_selection_select").append(
          "<option value='" + item.id + "'>" + item.name + "</option>");
      });
      //将half对应关系存入全局map中
      $.each(half, function (index, item) {
        halfMap.set(item.id, item.name);
        //将halfMap转换为select中的值
        $("#half_selection_select").append(
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
          title: '工种名称',
          sortable: true,
          formatter: workTypeNameFormatter
        }, {
          field: 'value',
          title: '物料',
          sortable: true,
          formatter: materialFormatter
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

//添加的工种的编号
let workTypeNum;
//添加的原材料的编号
let originNum;
//添加的半成品的编号
let halfNum;
//右移绑定函数
$(document).on('click', '#right_shift', function () {
  //获取选中的工种
  let work_type_selection_select = $('#work_type_selection_select');
  workTypeNum = work_type_selection_select.val();
  let workTypeName = $('#work_type_selection_select option:selected').text();
  $('#work_type_result').append(
    "        <div class=\"alert alert-success alert-dismissable\">\n"
    + "          <span class=\"select_result_span\">\n"
    + "            " + workTypeName + "\n"
    + "          </span>\n"
    + "        </div>");
  //获取选中的原材料的值
  let origin_selection_select = $(
    '#origin_selection_select option:selected');
  originNum = $('#origin_selection_select').val();
  $.each(origin_selection_select, function (index, item) {
    $('#material_result').append(
      "        <div class=\"alert alert-warning alert-dismissable\">\n"
      + "          <span class=\"select_result_span\">\n"
      + "            " + item.text + "\n"
      + "          </span>\n"
      + "        </div>");
  });

  //获取选中的半成品的值
  let half_selection_select = $(
    '#half_selection_select option:selected');
  halfNum = $('#half_selection_select').val();
  $.each(half_selection_select, function (index, item) {
    $('#material_result').append(
      "        <div class=\"alert alert-warning alert-dismissable\">\n"
      + "          <span class=\"select_result_span\">\n"
      + "            " + item.text + "\n"
      + "          </span>\n"
      + "        </div>");
  });
});

//添加按钮绑定函数
$(document).on('click', '#add_btn', function () {
  let material_result = $('#material_result');
  let work_type_result = $('#work_type_result');
  let addRowJson = {};
  addRowJson.num = workTypeNum;
  let valueArray= [];
  if(originNum == "" || originNum == null || originNum == undefined){
  }else{
    for (let i = 0; i < originNum.length; i++) {
      let singleValueJson = {};
      singleValueJson.num = originNum[i];
      singleValueJson.origin = "origin";
      valueArray.push(singleValueJson);
    }
  }
  
  //console.log(halfNum);
  if(halfNum == "" || halfNum == null || halfNum == undefined){
  }else{
    for (let i = 0; i < halfNum.length; i++) {
      let singleValueJson = {};
      singleValueJson.num = halfNum[i];
      singleValueJson.origin = "half";
      valueArray.push(singleValueJson);
    }
  }
  
  addRowJson.value = valueArray;
  tableJson = JSON.parse(tableJson);
  for (let i = 0; i < tableJson.length; i++) {
    if (workTypeNum === tableJson[i].num){
      swal(
        '添加失败!',
        '已存在该工种物料绑定,请删除后再次添加',
        'error'
        );
      tableJson = JSON.stringify(tableJson);
      material_result.empty();
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
    material_result.empty();
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
    method: 'post',
    dataType: 'json',
    data: {
      str1: process_num,
      str2: "material",
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
      title: '物料',
      sortable: true,
      formatter: materialFormatter
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

function materialFormatter(value, row, index){
  //value是一个数组
  //最后结果应该是一个材料名字字符串
  let result = [];
  for (let i = 0; i < value.length; i++) {
    if (value[i].origin === "origin") {
      result.push(originMap.get(parseInt(value[i].num)));
    }
    if (value[i].origin === "half") {
      result.push(halfMap.get(parseInt(value[i].num)));
    }
  }
  return result.toString();
}



//重置按钮
$(document).on('click', '#reset_btn', function () {
  $("#material_result").empty();
  $("#work_type_result").empty();
  workTypeNum = null ;
  originNum = null;
  halfNum = null;
});

