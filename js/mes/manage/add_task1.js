let process_name;
let process_descript;
let process_id;
let wtId;
let productIdAndOrderName=new Map();
let taskArray = [];
let workType = [];
let matIdAndMatName;
let originNumMap = new Map();

$(function () {
  process_id = getQueryString("id");
  process_name = decodeURI(getQueryString("name"));
  process_descript = decodeURI(getQueryString("descript"));

  $("#add_jobNum").text((new Date()).valueOf());
  $("#add_stepName").text(process_name);
  $("#add_description").text(process_descript);
  
  $.ajax({
    url: url + '/product/getDoingPro.action',
    // url:"https://7c76e079-bf30-4b24-9401-7a15aa4b6a99.mock.pstmn.io/getPro",
    method: 'post',
    dataType: 'json',
    async:false, 
    success:function(result){
      console.log(result);
      if (result.code === 0) {
        productIdAndOrderName.clear();
        $("#order").empty();
        $("#order").append("<option value=''>请选择</option>");
        $.map(result.data, function (value, index) {
          productIdAndOrderName.set(value.productId,value.orderName);
          $("#order").append(
            "<option value='" + value.productId + "'>" + value.orderName + "</option>");
        });
      }
    }
  });


});

$(document).on('change', '#order', function () {
  console.log("orderchange!");
  $.ajax({
    url: url + '/product/getWorkTypeByStep.action',
    method: 'post',
    dataType: 'json',
    data: {
      str1: process_id,
      str2: $("#order").val(),
    },
    success: function (result) {
      if (result.code === 0) {
        $("#workType").empty();
        $("#workType").append('<option value="">请选择</option>');
        $.map(result.data, function (value, index) {
          $("#workType").append(
            "<option value='" + value.id + "'>" + value.name + "</option>");
        })
      }

    }
  });

});

$(document).on('change', '#workType', function () {
  console.log("worktypechange!");
  taskArray = [];
  let operator = [];
  //获取工种
  let workTypeValue = $("#workType").val();
  $("#add_operator").empty();
  $("#add_operator").append('<option value="">请选择</option>');
  $.ajax({
    url: url + '/staff/getStaffByWorkType.action',
    method: 'post',
    dataType: 'json',
    data: {
      str1: workTypeValue
    },
    success: function (result) {
      if (result.code === 0) {
       $.map(result.data, function (value, index) {
        $("#add_operator").append(
          "<option value='" + value.workNum + "'>" + value.name
          + "</option>");
      });
     }
   }
 });
  //更新表格
  $('table').bootstrapTable('destroy');
  $('table').bootstrapTable({
    url: url + "/product/getMatByStep_workType.action",
    // url:"https://7c76e079-bf30-4b24-9401-7a15aa4b6a99.mock.pstmn.io/getMat",
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
        str3: $("#order").val(),
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
      field: 'canNum',
      title: '可分配数量',
      sortable: true,
    }
    ]
  });
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
  // 需要提交的json数据
  let commitJson = {};
  $("#equip").empty();
  $("#results").empty();
  commitJson.wtId = $("#workType").val();
  commitJson.results="";
  commitJson.productId = $("#order").val();
  commitJson.orderName = productIdAndOrderName.get($("#order").val());
  // commitJson.comments = $("#add_commit").val();

  let jsonArray = [];
  if(taskArray.length<1){
    return;
  }
  // console.log(taskArray);
  $.each(taskArray, function(index, item) {
    var itemJson={};
    itemJson.origin=item.origin;
    itemJson.matId=item.matId;
    itemJson.matName=item.matName;
    itemJson.canNum=item.canNum;
    itemJson.subMan="无";
    itemJson.num="";
    jsonArray.push(itemJson);
  });
  commitJson.materials=jsonArray;
  // console.log(jsonArray);
  // console.log(commitJson);
  var orderNumProductId="";
  // 发送请求获取封装好的数据
  $.ajax({
    // url:'https://19a79d25-5b14-4ed9-9c85-7d19aa33f96b.mock.pstmn.io/1',
    url: url + '/product/getSelDetail.action',
    method: 'post',
    dataType: 'json',
    data: {
      str1: JSON.stringify(commitJson),
      str2:process_id,
    },
    success:function(result){
      if(result.code===0){
        console.log(result.data);
        var returnJson=result.data;
        let equip=returnJson.equip;
        
        // 解析json数据
        // let comments = returnJson.comments;
        wtId = returnJson.wtId;
        let table = $('#subTable');
        // 清除模态框里的内容
        table.bootstrapTable('destroy');
        // 打开分配模态框
        console.log("click");
        $("#assignModal").modal({
          backdrop: 'static'
        });
        // 填充数据
        $("#jobNum").text($("#add_jobNum").text());
        $("#stepName").text($("#add_stepName").text());
        $("#description").text($("#add_description").text());
        $("#assign_wt").text($("#workType :selected").text());
        $("#operator").text($("#add_operator :selected").text());
        $("#commit").text($("#add_commit").val());
        $("#orderNum").text(returnJson.productId);
        $("#orderName").text(returnJson.orderName);
        let materials = returnJson.materials;
        let results=returnJson.results;
        matIdAndMatName=new Map();
        // console.log(tasksArray);
        // orderNumProductId=tasksArray[i].productId;
          //console.log(tasksArray[i].results);
          // let wage=tasksArray[i].useToWage;
          
          //追加设备下拉框
          console.log(equip);
          if(equip==0){
            $("#equip").parent().remove();
          }else{
            for (let n = 0; n < equip.length; n++) {
              $("#equip").append("<option value='"+ equip[n].id +"'>"+ equip[n].name +"</option>")
            }
          }

          $.each(results, function(index, value) {
            matIdAndMatName.set(value.matId,value.matName);
            $("#results").append("<option value='" + value.matId + "'>" + value.matName + "</option>");
          });
          //追加工资计算下拉框
          // for (let m = 0; m < wage.length; m++) {
          //   $("#wage_" + orderNum).append("<option value='"+ wage[m].id +"'>"+ wage[m].name +"</option>")
          // }
          
          // for (let j = 0; j < results.length; j++) {
          //   $("#select_" + orderNum).append("<option value='"+ results[j].matId +"'>"+ results[j].matName +"</option>")
          // }
          // for(var k=0;k<tasksArray[i].materials.length;k++){
          //   tasksArray[i].materials[k].orderNum=orderNum;
          // }
          let originNumJson = materials;
          for (let i = 0; i < originNumJson.length; i++) {
            originNumMap.set(originNumJson[i].matId,originNumJson[i].canNum);
          }

          console.log(materials);
          table.bootstrapTable({
            data: materials,
            dataType: 'json',
            striped: true,
            pageSize: '5',
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
    });
});

// 分配数量格式化
function numFormatter(value, row, index) {
  console.log(row);
  console.log(value);
  if (row.subMan === "无") {
    return "<input type='number' index="+ index +" class='form-control num_input'  value='"+value+"' rowId="+ row.matId +" required/>";
  } else {
    return value;
  }
}
//提交人列格式化 onclick='selectSubman("+JSON.stringify(value)+");'onclick='selectSubman(" + JSON.stringify(value)+","+index.toString()+","+id.toString()+");'
function subManFormatter(value, row, index) {
  var subManName="";
  var id="";
  console.log(row);
  // console.log(value);
  if (value !== "无" && value.length > 0) {
    for(var i=0;i<value.length;i++){
      if(value[i].selected){
        subManName=subManName+value[i].name+" ";
        id=id+value[i].neId;
      }
    }
    if(subManName==""){
      subManName="请选择提交人"
    }
    // console.log(subManName.length);
    if(subManName.length>9){
      subManName=subManName.substring(0,8);
      subManName=subManName+"..."
    }
    return $("<a id='"+id+"'  href='javascript:void(0);'class='subman_select_"+index+" subman_select ' jsonValue='" + JSON.stringify(value)+"' orderNum='" + row.productId+"'  index='" + index+"'>"+subManName+"</a>").prop("outerHTML");
    // return select.prop("outerHTML");
  } else {
    return value;
  }
}

//对表格操作逻辑
$(document).on('blur', '.num_input', function () {
  console.log("blur");
  //失去焦点后 获取当前的输入值，然后改变这行数据的值
  // console.log(originNumMap);
  // let rowId = $(this).attr("rowId");
  let index = $(this).attr("index");
  // console.log(rowId);
  console.log($(this).val());

  console.log(index);
  $(this).attr("value",$(this).val());
  // let originNum = originNumMap.get(rowId);
  $(this).parents('table').bootstrapTable('updateCell', {
    index: index,       //行索引
    field: "num",       //列名
    value: $(this).val(),
    // 防止刷新
    reinit: false
  });
  // $(this).parents('table').bootstrapTable('updateCell', {
  //   index: index,       //行索引
  //   field: "canNum",       //列名
  //   value: "22222",
  //   // 防止刷新
  //   reinit: false
  // });
  // $(this).parent().prev().val(12121212);
  // $(this).parent().prev().text(343434);
  // console.log($(this).parent().prev());
  console.log($(this).parents('table').bootstrapTable("getData"));
  // $(this).parent().prev().html(originNum);
});

$(document).on('click', '.subman_select', function () {
 $("#selectSubMan").empty();
 $("#selectModal").modal({
  backdrop:'static',
});
 // console.log(JSON.parse($(this).attr("jsonValue")));
  //将字符串转json
  var jsonValue=JSON.parse($(this).attr("jsonValue"));
  $.each(jsonValue, function(index, val) {
    if(val.selected){
      $("#selectSubMan").append('<option selected itemValue='+JSON.stringify(val)+'>'+val.name+'（可分配:'+val.canNum+')</option>');
    }else{
      $("#selectSubMan").append('<option  itemValue='+JSON.stringify(val)+'>'+val.name+'（可分配:'+val.canNum+')</option>');
    }
  });
  // 首先获取到该单选框的父表格元素
  // 获取到人员的可分配数量
  let canNum="0";
  let index = $(this).attr("index");
  console.log($(this).attr("orderNum"));
  let orderNum=$(this).attr("orderNum");
  $("#submitSubMan").attr("index",index);
  $("#submitSubMan").attr("orderNum",orderNum);
  // 获取到jsonValue值
  for (let i = 0; i < jsonValue.length; i++) {
    if(jsonValue[i].selected){
      canNum=parseInt(jsonValue[i].canNum)+parseInt(canNum);
      canNum=canNum.toString();
    }
  }
  console.log(index);
  $(this).parents('table').bootstrapTable('updateCell', {
    index: index,       //行索引
    field: "num",       //列名 分配数量
    value: canNum,
    // 防止刷新
    reinit: false
  });
  // $(this).parents('table').bootstrapTable('updateCell', {
  //   index: index,       //行索引
  //   field: "canNum",    //列名 可分配数量
  //   value: canNum,
  //   // 防止刷新
  //   reinit: false
  // });
  $(this).parents('table').bootstrapTable('updateCell', {
    index: index,       //行索引
    field: "subMan",    //列名 提交人
    value: jsonValue,
    // reinit: false
  });
});

$(document).on('click','#submitSubMan',function(){
  var tableindex=$('#submitSubMan').attr("index");
  var orderNum=$('#submitSubMan').attr("orderNum");
  // console.log("tableindex:"+tableindex);
  var jsonValue=[];
  var selected_Subman=[];
  // console.log($("#selectSubMan").children('option'));
  //获取选中的下拉框的jobNum
  // console.log($("#selectSubMan option:selected"));
  $.each($("#selectSubMan option:selected"), function(index, item) {
    var itemValue=JSON.parse($(item).attr('itemValue'));
    selected_Subman[index]=itemValue.neId;
  });
  //
  $.each($("#selectSubMan").children('option'), function(index, item) {
    var jsonValueItem={};
    // console.log($(item).attr('itemValue'));
    var itemValue=JSON.parse($(item).attr('itemValue'));
    // console.log(itemValue);
    jsonValueItem.neId=itemValue.neId;
    jsonValueItem.canNum=itemValue.canNum;
    jsonValueItem.id=itemValue.id;
    jsonValueItem.name=itemValue.name;
    //若选中
    // console.log((selected_jobNum).indexOf(itemValue.jobNum));
    // console.log(itemValue.jobNum);
    // console.log(selected_jobNum);
    if(((selected_Subman).indexOf(itemValue.neId))>=0){
      jsonValueItem.selected=true;
    }else{
      jsonValueItem.selected=false;
    }
    jsonValueItem.workNum=itemValue.workNum;
    jsonValue[index]=jsonValueItem;
  });
  jsonValue=JSON.stringify(jsonValue);
  // console.log(jsonValue);
  $(".subman_select_"+tableindex).attr("jsonValue",jsonValue);
  $(".subman_select_"+tableindex).trigger("click");
  // selectSubman(jsonValue,tableindex,submitSubManId);
  $("#selectModal").modal("hide");
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
  var resultArray=[];

  commitJson.productId=$("#orderNum").text();
  commitJson.orderName=$("#orderName").text();
  commitJson.wtId=$("#workType").val();
  //results
  var result="";
  var ind=$("#results").val().length-1;
  $.each($("#results").val(), function(index, item) {
    if(index==ind){
      result=result+item;
    }else{
      result=result+item+",";
    }
  });
  commitJson.results=result;
  //设备equip
  // commitJson.equip=$("#equip").val();
  if($("#equip").val()){
    commitJson.equip=$("#equip").val();
  }else{
    commitJson.equip="0";
  }
  // var equipArray=[];
  // $.each($("#equip").val(), function(index, item) {
  //   var equipJson={};
  //   equipJson.matId=item;
  //   equipJson.matName=matIdAndMatName.get(item);
  //   equipArray.push(resultJson);
  // });
  // commitJson.equip=equipArray;
  // console.log(equipArray);

  var materialsArry=$("#subTable").bootstrapTable('getData');
  var materialJson=[];
  $.each(materialsArry, function(index, item) {
    if(item.origin=="origin"){
      var materialItem={};
      materialItem.neId="";
      materialItem.origin="origin";
      materialItem.id=item.matId;
      materialItem.num=item.num;
      materialItem.subMan="无";
      materialJson.push(materialItem);
    }else if(item.origin=="half"){
      var matId=item.matId;
      $.each(item.subMan, function(index, item) {
        if(item.selected){
          var materialItem={};
          console.log(item);
          materialItem.origin="half";
          materialItem.num=item.canNum;
          materialItem.id=matId;
          materialItem.neId=item.neId;
          materialItem.subMan=item.workNum;
          materialJson.push(materialItem);
        }
      });
    }
    
  });
  console.log(materialJson);
  commitJson.materials=materialJson;

  console.log(commitJson);
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
          ).then(
          function(){
            location.reload();
          });
        $("#assignModal").modal('hide');
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









