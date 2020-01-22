let ruleArray = [];

let attr_set_table = $("#attr_set_table");

let stepsData = [];
let stepsjson={};
let editFlag;

//整个流程模板的json数组
let stepsJson = [];

let templateId;

var processIdAndNameMap = new Map();

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
        //console.log(stepsJson);
      });
    },

  }).disableSelection();
//单品编号
templateId = getQueryString("id");
  //console.log(templateId);//330-486
  //if (templateId !== null) {
    //获取processIdAndNameMap

    $.ajax({
      url: url + "/dataDict/getDict.action",
      dataType: 'json',
      method: 'post',
      async: false,
      data: {
        str1: "step",
        str2: 0,
        str3: 0
      },
      success: function (result) {
        if (result.code === 0) {
          stepsData = result.data;
          var data = result.data;
          if (data.length > 0) {
            $.each(data, function (index, item) {
              processIdAndNameMap.set(item.id, item.name);
            });
          }
        }
      }
    });
    //}
    
//获取单品流程链
$.ajax({
  url:url + "/product/getFlowStep.action",
  method: 'post',
  dataType: 'json',
  data: {
    str1: templateId,
  },
  success: function (result) {
    stepsjson=result;
    //console.log("........stepsjson.................");
    //console.log(stepsjson);
    stepsjson= JSON.parse(JSON.stringify(stepsjson).replace(/json_step/g,"steps"));
    //console.log(stepsjson);
    if (result.code === 0) {
          //将编辑的flag设置为true;
          editFlag = true;
          //获取到json数据
          var data = stepsjson.data.steps;
          //设置工序序列
          //processIdAndNameMap=getProcessIdAndNameMap();
         // console.log(getProcessIdAndNameMap());
         $.each(data, function (index, item) {
            //console.log(processIdAndNameMap.get("1"));
            $("#start_span").append("        <span class=\"sortable procedure_span\">\n"
              + "          <span class=\"agile-detail\">\n"
              + "            <span class=\"icon-font text-center-span\">&#xe631;</span>\n"
              + "            <a class=\"btn btn-success  font-middle procedure-a\" json='"+ JSON.stringify(item) +"'>"+ processIdAndNameMap.get(item.stepNum) +"</a>\n"
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
  //}
});


//导入已存在模板
$(document).on('click','#import_template',function(){
  $("#import-template-modal").modal({
    backdrop: 'static',
  });
  $('#existing-process-table').bootstrapTable({
    url:url + "/template/getTemp.action",
    method: 'post',
    pagination: true,
    search: false,
    dataType:'json',
    queryParams:function(params){
      return{
        str1:15,
        str2:0
      }
    },
      //toolbar:'#toolbar',
      contentType: "application/x-www-form-urlencoded",
      striped:true,
      sidePagination:'client',
      pageSize:'15',
      pageList: [10, 25, 50, 100],
      showRefresh:false,
      dataField: "data",
      mobileResponsive:true,
      useRowAttrFunc: true,
      columns:[{
        field: 'name',
        title: '模板名称',
        sortable: true,
      },{
        field:'descript',
        title:'描述',
        sortable:true,
      },{
        field:'null',
        title:'操作',
        formatter:actionFormatter,
      }
      ]
    })

     //渲染按钮
     function actionFormatter(value,row, index) {
      let id = row.id;
      delete row.ability;
      delete row.createDate;
      let result = "";
      result += "<button class='btn btn-xs btn-primary selectButton' product_id="+id+" title='选择'><span>选择</span></button>";
      return result;
    }
  });
  //选择模板
  /*
  1.获取当前的模板id 
  */
  var selected_process_id;
  $(document).on('click','.selectButton',function(){
    selected_process_id=$(this).attr("product_id");
    //调接口，关闭模态框
    $.ajax({
      url:url+"/template/getTempById.action",
      dataType:"json",
      type:'post',
      data:{
        str1:selected_process_id
      },
      success: function (result) {
        $("#procedure_span").empty();

        $("#procedure_span").append("<span class=\"sortable\" id=\"start_span\">"
          +"<a class=\"btn btn-success font-middle\">&#xe61a;</a></span>"
          +"<span class=\"sortable\" id=\"end_span\">"
          +"<span class=\"agile-detail\">"
          +"<span class=\"icon-font text-center-span\">&#xe631;</span>"
          +"<span class=\"btn btn-danger font-middle icon-font\">&#xe660;</span></span></span>");
        if (result.code === 0) {
          //console.log("..........result.data...........");
          //console.log(result.data);
          //将选择的模板属性显示在页面上
          let data=result.data.json_step;
          $.each(data, function (index, item) {

            $("#start_span").append("        <span class=\"sortable procedure_span\">\n"
              + "          <span class=\"agile-detail\">\n"
              + "            <span class=\"icon-font text-center-span\">&#xe631;</span>\n"
              + "            <a class=\"btn btn-success  font-middle procedure-a\" json='"+ JSON.stringify(item) +"'>"+ processIdAndNameMap.get(item.stepNum) +"</a>\n"
              //+ "            <a class=\"btn btn-success btn-rounded font-middle procedure-a\" json='"+ JSON.stringify(item) +"'>"+ item.stepNum +"</a>\n"
              + "          </span>\n"
              + "        </span>");
          });
           //绑定该模板到该单品
           //console.log("........绑定该模板到该单品result.data..........");
           //console.log(result);
           stepsjson=result;
          // console.log(stepsjson);
          stepsjson= JSON.parse(JSON.stringify(stepsjson).replace(/json_step/g,"steps"));
           //console.log(stepsjson);
          //  $.ajax({
          //   url:url+"/product/setFlow.action",
          //   dataType:"json",
          //   type:'post',
          //   data:{
          //     str1:templateId,
          //     str2:JSON.stringify(stepsjson.data),
          //     str3:selected_process_id
          //   },
          //   success: function (result) {}
          // });
          $("#import-template-modal").modal("hide");
          $("#existing-process-table").bootstrapTable('refresh');
        }else if(result.code===1){

          swal(
            '设置失败!',
            result.msg,
            'error'
            );
        }
      },
      error: function () {
        $("#import-template-modal").modal("hide");
        swal(
          '添加失败!',
          '网络错误',
          'error'
          );
      }
    })


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
        + "            <a class=\"btn btn-success  icon-font\" json='{\"stepNum\": \"\", \"attr\": []}'>新增</a>\n"
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
        + "            <a class=\"btn btn-danger  icon-font\">&#xe660;</a>\n"
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
        + "            <a class=\"btn btn-success  icon-font\">&#xe61a;</a>\n"
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
  // console.log("...............stepJson................");
  //console.log(stepJson);
  currentStepNum = stepJson.stepNum;
  currentAttr = stepJson.attr;
  //console.log(currentStepNum);
  //console.log(currentAttr);
  //获取规则库
  $.ajax({
    url: url + "/rule/getSimpleRules.action",
    dataType: 'json',
    method: 'post',
    success: function (result) {
      if (result.code === 0) {
        ruleArray = result.data;

        stepsData = result.data;
        let data = result.data;
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


  // console.log(result.data);
  // if (result.code === 0) {
  //   stepsData = result.data;
  //   let data = result.data;

  //   let procedure_name = $("#procedure_name");
  //   let procedure_description = $("#procedure_description");
  //   procedure_description.text(data[0].descript);
  //   procedure_name.empty();
  //   for (let i = 0; i < data.length; i++) {
  //     procedure_name.append(
  //       "<option value='" + data[i].id + "'>" + data[i].name
  //       + "</option>");
  //   }
  //       //如果当前的工序num不为空则显示出来
  //       if (currentStepNum !== "") {
  //         for (let i = 0; i < data.length; i++) {
  //           if (data[i].id === currentStepNum) {
  //             procedure_name.val(currentStepNum);
  //             procedure_description.text(data[i].descript);
  //           }
  //         }
  //       }
        //进行表格初始化
        if (currentAttr !== []) {
          $('table').bootstrapTable('destroy');
          initTable(currentAttr);
        }else {
          $('table').bootstrapTable('destroy');
          initTable([]);
        }
        $("#addModal").modal({
          backdrop: 'static'
        });


      });

let ruleId;
$(document).on('click', '#insert_button', function () {
  ruleId = ruleArray[0].id;
  attr_set_table.bootstrapTable('insertRow', {
    index: 0,
    row: {
      showed: 'true',
      name: '属性名',
      descript: '描述',
      origin: '规则录入',
      value: 'isRule:' + ruleId,
    }
  });
});

//是否显示属性值绑定事件
$(document).on('click', '.is_show', function () {
  //获取到编辑的行的index
  let index = $(this).attr("index");
  let value = $(this).prop("checked").toString();
  attr_set_table.bootstrapTable('updateCell', {
    index: index,       //行索引
    field: "showed",       //列名
    value: value        //cell值
  })
});

$(document).on('change', '.origin_select', function () {
  let index = $(this).attr("index");
  let value = $(this).val();
  if (value === "用户录入") {
    attr_set_table.bootstrapTable('updateCell', {
      index: index,       //行索引
      field: "value",       //列名
      value: ""        //cell值
    })
  } else if (value === "规则录入") {
    attr_set_table.bootstrapTable('updateCell', {
      index: index,       //行索引
      field: "value",       //列名
      value: "isRule:"        //cell值
    })
  }
  attr_set_table.bootstrapTable('updateCell', {
    index: index,       //行索引
    field: "origin",       //列名
    value: value        //cell值
  })
});

$(document).on('change', '.rule_select', function () {
  let index = $(this).attr("index");
  let value = "isRule:";
  value += $(this).val();
  attr_set_table.bootstrapTable('updateCell', {
    index: index,       //行索引
    field: "value",       //列名
    value: value        //cell值
  })
});

$(document).on('click', '.refresh_rule', function () {
  console.log(ruleId);
  updateRule();
  let rule_select = $(this).prev().prev();
  rule_select.empty();
  if (ruleArray.length > 0) {
    $.each(ruleArray, function (arrayIndex, arrayItem) {
      if (ruleId.toString() === arrayItem.id) {
        rule_select.append(
          "<option value ='" + arrayItem.id + "' selected='selected'>"
          + arrayItem.name + "</option>");
      } else {
       rule_select.append(
        "<option value ='" + arrayItem.id + "'>" + arrayItem.name
        + "</option>");
     }
   })
  }
  let index = rule_select.attr("index");
  let value = "isRule:";
  value += rule_select.val();
  attr_set_table.bootstrapTable('updateCell', {
    index: index,       //行索引
    field: "value",       //列名
    value: value        //cell值
  })
});

$(document).on('change', '#procedure_name', function () {
  let value = $(this).val();
  $.each(stepsData, function (index, item) {
    if (value === item.id) {
      $("#procedure_description").text(item.descript);
    }
  });
});

$(document).on('click', '#getTableData', function () {
  alert(JSON.stringify(attr_set_table.bootstrapTable('getData')));
});

$(document).on('click', '#save_confirm_button', function () {
  //获取到表格的json数据
  //需要templateId、stepsjson、currentStepNum、tableJson
  let tableJson = attr_set_table.bootstrapTable('getData');
  var data=stepsjson.data.steps;
  $.each(data, function (index, item) {
    if(currentStepNum==data[index].stepNum){
      stepsjson.data.steps[index].attr=tableJson;
    }
  });
  // console.log(tableJson);
  $.ajax({
    url:  url + "/product/saveFPSAttrs.action",
    method: 'POST',
    data: {
      str1: templateId,
      str2: JSON.stringify(stepsjson.data),
      str3: currentStepNum,
      str4: JSON.stringify(tableJson)
    },
    dataType: 'json',
    success: function (result) {
      if (result.code === 0) {

        $('table').bootstrapTable('destroy');
        initTable(tableJson);
        swal(
          '保存成功!',
          '',
          'success'
          ).then(function(isConfirm){
            location.reload();
          });
      } else if (result.code === 1) {
        swal(
          '保存失败!',
          result.msg,
          'error'
          );
      }
    },
    error: function () {
      swal(
        '保存失败!',
        '网络错误',
        'error'
        );
    }
  })
  
  $("#addModal").modal('hide');
  
});

function initTable(data) {
  attr_set_table.bootstrapTable({
    data: data,
    toolbar: '#toolbar',
    clickEdit: true,
    showToggle: true,
    pagination: true,       //显示分页条
    showColumns: true,
    showPaginationSwitch: true,     //显示切换分页按钮
    showRefresh: true,      //显示刷新按钮
    //clickToSelect: true,  //点击row选中radio或CheckBox
    columns: [{
      field: 'showed',
      title: '显示',
      sortable: true,
      formatter: showFormatter,
    }, {
      field: 'name',
      title: '属性名',
      sortable: true,
    }, {
      field: 'descript',
      title: '描述',
      sortable: true,
    }, {
      field: 'origin',
      title: '来源',
      formatter: originFormatter,
    }, {
      field: 'value',
      title: '值',
      formatter: valueFormatter,
    }, {
      field: 'null',
      title: '操作',
      formatter: operatorFormatter,
    }
    ],
    onClickCell: function (field, value, row, $element) {
      let childNode = $element.children(
        ":first")[0];
      if (childNode === undefined) {
        $element.attr('contenteditable', true);
        $element.blur(function () {
          let index = $element.parent().data('index');
          let tdValue = $element.html();
          saveData(index, field, tdValue);
        })
      }
    }
  });
}

function showFormatter(value, row, index) {
  if (value === undefined) {
    return "<input class='is_show' index=" + index + " type='checkbox'>";
  }
  if (value === "true") {
    return "<input type='checkbox' index=" + index
    + " class='is_show' checked='checked'>";
  } else if (value === "false") {
    return "<input class='is_show' index=" + index + " type='checkbox'>";
  }
}

function valueFormatter(value, row, index) {
  let sliceValue = (value.toString()).slice(0, 7);
  let ruleId = (value.toString()).substring(7);
  let div = $("<div class='form-inline select_div'></div>");
  let select = $("<select style='display: inline-block' class='form-control rule_select' index=" + index
    + "></select>");
  if (sliceValue === "isRule:") {
    if (ruleArray.length > 0) {
      $.each(ruleArray, function (arrayIndex, arrayItem) {
        if (ruleId === arrayItem.id) {
          select.append(
            "<option value ='" + arrayItem.id + "' selected='selected'>"
            + arrayItem.name + "</option>");
        } else {
          select.append(
            "<option value ='" + arrayItem.id + "'>" + arrayItem.name
            + "</option>");
        }
      })
    }
    div.append(select);
    div.append("  <button title='点击添加' class='btn btn-success btn-xs add_rule'>...</button>")
    div.append(" <button title='点击刷新' class='btn btn-warning btn-xs refresh_rule'><i class='fa fa-refresh'></i></button>")
    return div.prop("outerHTML");
  } else {
    return value;
  }
}


$(document).on('click', '.add_rule', function () {
  window.open('add_rule.html');
});

function originFormatter(value, row, index) {
  let result = "";
  if (value === "用户录入") {
    result = "<select class='form-control origin_select' index=" + index
    + "><option value='用户录入' selected='selected'>用户录入</option><option value='规则录入'>规则录入</option></select>";
    return result;
  } else if (value === "规则录入") {
    result = "<select class='form-control origin_select' index=" + index
    + "><option value='用户录入'>用户录入</option><option value='规则录入' selected='selected'>规则录入</option></select>";
    return result;
  }
}

function operatorFormatter(value, row, index) {
  let result = "";
  result += "<button class='btn btn-xs btn-danger deleteButton' index='" + index + "' title='删除'>删除</button>";
  return result;
}

function saveData(index, field, value) {
  attr_set_table.bootstrapTable('updateCell', {
    index: index,       //行索引
    field: field,       //列名
    value: value        //cell值
  })
}

$(document).on('click', '.deleteButton', function () {
  let index = parseInt($(this).attr("index"));
  //弹出模态提示框
  swal({
    title: '您是否要删除?',
    text: "",
    type: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
  }).then(function (isConfirm) {
    if (isConfirm) {
      //获取当前表格数据
      let tableJson = attr_set_table.bootstrapTable('getData');
      //移除当前行
      tableJson.splice(index, 1);
      $('table').bootstrapTable('destroy');
      initTable(tableJson);
    }
  });
});
//保存模板
$(document).on('click', '#save_all_button', function () {
  stepsJson = [];
  // $.each($(".procedure-a"), function (index, item) {
  //   stepsJson.push(JSON.parse($(item).attr("json")));
  // });

  // let process_template_name = $("#process_template_name");
  // let process_template_description = $("#process_template_description");
  // console.log(templateId);
  // console.log(stepsjson.data);
  // console.log(selected_process_id);
  if(selected_process_id == "undefined" || selected_process_id == null || selected_process_id == ""){
    selected_process_id="";
  }
  // console.log(stepsjson.data);
  // console.log(selected_process_id);
  $.ajax({
    url:url+"/product/setFlow.action",
    dataType:"json",
    type:'post',
    data:{
      str1:templateId,
      str2:JSON.stringify(stepsjson.data),
      str3:selected_process_id
    },
    success: function (result) {
      if (result.code === 0) {
        swal(
          '保存成功!',
          '',
          'success'
          );
      } else if (result.code === 1) {
        swal(
          '保存失败!',
          result.msg,
          'error'
          );
      }
    },
    error: function () {
      swal(
        '保存失败!',
        '网络错误',
        'error'
        );
    }
  });
  // $.ajax({
  //   url:  url + "/template/updateTemp.action",
  //   method: 'POST',
  //   data: {
  //     str1: templateId,
  //     str2: process_template_name.val(),
  //     str3: process_template_description.val(),
  //     str4: stepsJson
  //   },
  //   dataType: 'json',
  //   success: function (result) {
  //     if (result.code === 0) {
  //       swal(
  //         '保存成功!',
  //         '',
  //         'success'
  //         );
  //     } else if (result.code === 1) {
  //       swal(
  //         '保存失败!',
  //         result.msg,
  //         'error'
  //         );
  //     }
  //   },
  //   error: function () {
  //     swal(
  //       '保存失败!',
  //       '网络错误',
  //       'error'
  //       );
  //   }
  // })

});

function updateRule(){
  $.ajax({
    url: url + "/rule/getSimpleRules.action",
    dataType: 'json',
    async:false,
    method: 'post',
    success: function (result) {
      if (result.code === 0) {
        ruleArray = result.data;
      }
    }
  });
}



//获取url参数
function getQueryString(name) {
  let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
  let r = window.location.search.substr(1).match(reg);
  if(r!=null)return  unescape(r[2]); return null;
}
