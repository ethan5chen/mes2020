let id=getParam("id");
// console.log(id);
$(document).ready(function(){
  $.ajax({
    url: url + '/rule/getRuleCon.action',
    dataType:'json',
    type:'post',
    data:{
      str1: id
    },
    success:function (result) {
      console.log(result);
      if (result.code === 0) {
        $("#name").val(result.data.name);
        $("#feature").val(result.data.feature);
        $("#descript").val(result.data.descript);
        let stepArray=result.data.steps;
        if (stepArray!==null&&stepArray!==undefined){
          $.each(stepArray,function (index,item) {
            //遍历数据增加面板
            $("#step-div").append("      <div class='panel panel-primary "+item.type+"'>\n"
                + "        <div class=\"panel-heading\">"+item.type+"</div>\n"
                + "        <div class=\"panel-body\">\n"
                + "          <h5 class=\"note\">"+"描述: "+item.note+"</h5>\n"
                + "          <h5 style='display:none' class='value'>" + item.value + "</h5>"
                + "          <h5 class='showValue'>" +item.show+ "</h5>\n"
                + "        </div>\n"
                + "      </div>");
          });
          saveValueToSession();
          getFactors();
        }

      }else if (result.code === 1) {
        swal(
            "获取参数失败！",
            "",
            "error"
        );
      }
    },
    error:function () {
      swal(
          '网络错误',
          '',
          'error'
      );
    }
  });

});

//获取url中的参数
function getParam(paramName) {
  paramValue = "", isFound = !1;
  if (this.location.search.indexOf("?") == 0 && this.location.search.indexOf("=") > 1) {
    arrSource = unescape(this.location.search).substring(1, this.location.search.length).split("&"), i = 0;
    while (i < arrSource.length && !isFound) arrSource[i].indexOf("=") > 0 && arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase() && (paramValue = arrSource[i].split("=")[1], isFound = !0), i++
  }
  return paramValue == "" && (paramValue = null), paramValue
}

//功能型的模态框
$(document).on('click', "#function", function () {
  $("#function-modal").modal({
    backdrop: 'static'
  });
});

//选择型的模态框
$(document).on('click', "#selection", function () {
  $("#select-panel-body").empty();
  $("#condition-panel-body").empty();
  $("#sort-panel-body").empty();
  $("#selection-modal").modal({
    backdrop: 'static'
  });
});

//公式型的模态框
$(document).on('click',"#formula",function () {
  //首先清空模态框的信息
  $("#description").val();
  $("#formula-div").empty();
  //打开模态框
  $("#formula-modal").modal({
    backdrop: 'static'
  });
});

//点击选取操作时绑定事件
$(document).on('click', "#select-div", function () {
  //清除样式
  $(".panel").removeClass("panel-success").addClass("panel-default");
  $(this).children(".panel").removeClass("panel-default").addClass(
      "panel-success");
  let value_btn = $("#value-btn");
  let logic_btn = $("#logic-btn");
  let relation_btn = $("#relation-btn");
  let sort_btn = $("#sort-btn");
  //激活按钮
  value_btn.attr("disabled", false);
  logic_btn.attr("disabled", false);
  relation_btn.attr("disabled", false);
  sort_btn.attr("disabled", false);
  //禁用按钮
  value_btn.attr("disabled", true);
  logic_btn.attr("disabled", true);
  relation_btn.attr("disabled", true);
  sort_btn.attr("disabled", true);
});

//点击条件操作时绑定事件
$(document).on('click', "#condition-div", function () {
  //清除样式
  $(".panel").removeClass("panel-success").addClass("panel-default");
  $(this).children(".panel").removeClass("panel-default").addClass(
      "panel-success");
  let value_btn = $("#value-btn");
  let logic_btn = $("#logic-btn");
  let relation_btn = $("#relation-btn");
  let sort_btn = $("#sort-btn");
  //激活按钮
  value_btn.attr("disabled", false);
  logic_btn.attr("disabled", false);
  relation_btn.attr("disabled", false);
  sort_btn.attr("disabled", false);
  //禁用按钮
  sort_btn.attr("disabled", true);
});

//点击排序操作时绑定事件
$(document).on('click', "#sort-div", function () {
  //清除样式
  $(".panel").removeClass("panel-success").addClass("panel-default");
  $(this).children(".panel").removeClass("panel-default").addClass(
      "panel-success");
  let value_btn = $("#value-btn");
  let logic_btn = $("#logic-btn");
  let relation_btn = $("#relation-btn");
  let sort_btn = $("#sort-btn");
  //激活按钮
  value_btn.attr("disabled", false);
  logic_btn.attr("disabled", false);
  relation_btn.attr("disabled", false);
  sort_btn.attr("disabled", false);
  //禁用按钮
  value_btn.attr("disabled", true);
  logic_btn.attr("disabled", true);
  relation_btn.attr("disabled", true);
});

//元素按钮绑定事件
$(document).on('click', "#element-btn", function () {
  //点击元素按钮时发送ajax请求获取数据
  $.ajax({
    url: url + '/rule/getIndexs.action',
    type: 'post',
    dataType: 'json',
    success: function (result) {
      if (result.code === 0) {
        //成功时将数据遍历构建单选框
        let select = $(
            "<select class=\"selectpicker bla bla bli element_select where_element\" "
            + "data-live-search=\"true\" style='width: 150px;height: 35px'></select>  ");
        $.each(result.data, function (index, item) {
          let option = $(
              "<option value=" + item.id + "-" + item.nameEn + "-t"+"></option>");
          option.append(item.nameCh);
          select.append(option);
        });
        $(".panel-success").children(".panel-body").append(select);
        $('.selectpicker').selectpicker({
          'selectedText': 'cat'
        });
      }
    }
  });
});

//绑定属性按钮事件
$(document).on('click', "#attribute-btn", function () {
  //属性的多选框
  let attr_select = $(
      "  <select class=\"selectpicker bla bla bli attr_select where_element\" multiple data-live-search=\"true\"></select>");
  let id = ($('.element_select').selectpicker('val')).split("-", 2)[0];
  $.ajax({
    url: url + '/rule/getAttrs.action',
    type: 'GET',
    dataType: 'json',
    data: {
      str1: id
    },
    success: function (result) {
      if (result.code === 0) {
        $.each(result.data, function (index, item) {
          let option = $(
              "<option value=" + item.id + "-" + item.nameEn + "></option>");
          option.append(item.nameCh);
          attr_select.append(option);
        });
        $(".panel-success").children(".panel-body").append(attr_select);
        $('.selectpicker').selectpicker({
          'selectedText': 'cat'
        });
      }
    }
  });
});

//绑定值按钮事件
$(document).on('click', "#value-btn", function () {
  $(".panel-success").children(".panel-body")
  .append(
      "<input type=\"text\"  class=\"form-control value_input where_element\" style='width: 200px;display: inline'>");
});

//绑定关系运算按钮事件
$(document).on('click', "#relation-btn", function () {
  let select = $(
      "<select class=\"selectpicker bla bla bli relation-select where_element\"></select>  ");
  select.append("<option value='='>=</option>");
  select.append("<option value='!='>!=</option>");
  select.append("<option value='>'></option>");
  select.append("<option value='>='>>=</option>");
  select.append("<option value='<'><</option>");
  select.append("<option value='<='><=</option>");
  $(".panel-success").children(".panel-body").append(select);
  $('.selectpicker').selectpicker({
    'selectedText': 'cat'
  });
});

//绑定逻辑运算按钮事件
$(document).on('click', "#logic-btn", function () {
  let select = $(
      "<select class=\"selectpicker bla bla bli where_element\"></select>  ");
  select.append("<option value='and'>and(与)</option>");
  select.append("<option value='or'>or(或)</option>");
  select.append("<option value='not'>not(非)</option>");
  $(".panel-success").children(".panel-body").append(select);
  $('.selectpicker').selectpicker({
    'selectedText': 'cat'
  });
});

//排序按钮绑定事件
$(document).on('click', "#sort-btn", function () {
  let select = $(
      "<select class=\"selectpicker bla bla bli sort-select where_element\"></select>  ");
  select.append("<option value='asc'>正序</option>");
  select.append("<option value='desc'>倒序</option>");
  $(".panel-success").children(".panel-body").append(select);
  $('.selectpicker').selectpicker({
    'selectedText': 'cat'
  });
});

//使用的表
let allTable;

//选择型保存按钮触发
$(document).on('click', "#select-save-button", function () {
  //首先选中select panel下面的filter-option pull-left
  //这里拼接的是select中文翻译语句
  let selectChinaString="选取===>";
  let hasSelectedChinaName=$("#select-panel-body").find(".filter-option");
  $.each(hasSelectedChinaName,function (index, item) {
    if (index % 2 === 0) {
      //拼接要素string
      selectChinaString+=((item.innerHTML)+":");
      // alert(item.innerHTML);
    }else {
      let reg = new RegExp(', ',"g");
      let innerHtml = (item.innerHTML).replace(reg,"、");
      //拼接属性的String
      if (hasSelectedChinaName.length === (index + 1)) {
        selectChinaString+=innerHtml;
      }else {
        selectChinaString+=(innerHtml+",");
      }
    }
  });

  //首先解析select部分
  //select部分的元素
  let element_select = $('#select-panel-body .selectpicker.element_select');
  let attr_select = $('#select-panel-body .selectpicker.attr_select');
  //拼接查询语句
  let selectString = "select ";
  let afterFrom = " from ";
  $.each(element_select, function (index, item) {
    let replaceIndex = index;
    let attr_item = item.nextSibling.nextSibling;
    let str = [];
    for (i = 0; i < attr_item.length; i++) {
      if (attr_item.options[i].selected) {
        str.push(item.value + "." + (attr_item[i].value).split("-")[1]);
      }
    }
    //遍历获取到的属性值数组
    $.each(str, function (index, item) {
      let attr_value = item.split("-", 2)[1];
      if ((index + 1) === str.length && (replaceIndex + 1)
          === element_select.length) {
        selectString += attr_value;
      } else {
        selectString += attr_value + ",";
      }
    });
    let itemValue = item.value;
    if ((index + 1) === element_select.length) {
      afterFrom += (itemValue.split("-", 2)[1]);
    } else {
      afterFrom += (itemValue.split("-", 2)[1] + ",");
    }
  });
  allTable=afterFrom.split(" from ",2)[1];
  allTable=allTable.trim();
  selectString += afterFrom;
  //select拼接结束
  //开始解析where部分
  //获取condition下面所有的子元素
  let condition_all_children = $('#condition-panel-body').children(
      ".where_element:not(div)");
  let whereString = "";
  let whereChinaString="";
  if (condition_all_children.length>0){
    whereString=" where ";
    whereChinaString="    条件为:   ";
  }
  // 条件语句中文翻译语句


  //遍历所有子元素
  $.each(condition_all_children, function (index, item) {
    //if ()
    let where_element_value = item.value;
    //给数值加上单引号
    if (item.tagName === 'INPUT') {
      whereChinaString+=where_element_value;
      where_element_value = "'" + where_element_value + "'";
    }
    let tableFlag = "";
    // 如果有"-"则split字符串
    if ((where_element_value).indexOf("-") !== -1) {
      if (where_element_value.split("-")[2] === "t"){
        tableFlag = "t";
      }
      if ((where_element_value).indexOf("'") === -1) {
        where_element_value = where_element_value.split("-")[1];
      }
    }
    if (tableFlag === "t") {
      whereChinaString+=((item.options[item.selectedIndex].text)+"的");
      whereString += (where_element_value + ".");
    } else {
      if (item.tagName!=='INPUT') {
        if (item.options[item.selectedIndex].text==="and(与)"){
          whereChinaString+="  而且  ";
        }else if(item.options[item.selectedIndex].text==="or(或)"){
          whereChinaString+="  或者  ";
        }else if (item.options[item.selectedIndex].text === "not(非)") {
          whereChinaString+="  不是  ";
        }else {
          whereChinaString+=item.options[item.selectedIndex].text;
        }
      }
      whereString += (where_element_value + " ");
    }
    if (index === condition_all_children.length) {
      whereChinaString+="";
    }
  });
  //排序的中文翻译语句

  //首先选中select panel下面的filter-option pull-left

  //这里拼接的是select中文翻译语句

  let orderChinaString="";
  hasSelectedChinaName=$("#sort-panel-body").find(".filter-option");
  if (hasSelectedChinaName.length > 0) {
    orderChinaString="   通过:   ";
  }
  $.each(hasSelectedChinaName,function (index, item) {
    if ((index + 1) === hasSelectedChinaName.length) {
      orderChinaString+=(item.innerHTML+"排序");
    }else if (index === 0) {
      orderChinaString+=item.innerHTML+"的";
    }else {
      orderChinaString+=item.innerHTML;
    }
  });

  // 开始解析order部分
  element_select = $('#sort-panel-body .selectpicker.element_select');
  let orderString = "";
  //当排序操作面板中没有任何元素时不添加order by语句
  if (element_select.length > 0) {
    orderString=" order by ";
  }
  $.each(element_select, function (index, item) {
    //获取元素的属性
    let attr_item = item.nextSibling.nextSibling;
    let str = [];
    //遍历属性select
    for (i = 0; i < attr_item.length; i++) {
      //将被选中的option的value值加入数组中
      if (attr_item.options[i].selected) {
        str.push(item.value + "." + (attr_item[i].value).split("-")[1]);
      }
    }
    //获取属性值
    $.each(str, function (index, item) {
      let tableName = item.split("-", 2)[1];
      let attrName = item.split(".", 2)[1];
      orderString += tableName + "." + attrName;
    });
  });
  //获取排序的规则
  let order_select = $('#sort-panel-body .selectpicker.sort-select');
  orderString += " ";
  $.each(order_select, function (index, item) {
    orderString += item.value;
  });
  //最终拼接的选择型语句(value)
  let completeString = selectString + whereString + orderString;
  //获取描述语句
  let note =$("#functionDescription2").val();
  //获取上文中所获取的属性值
  let attr_str = [];
  let all_select = $('.element_select');
  //遍历所有被选中的元素的select并加入数组

  $.each(all_select, function (index, item) {
    //当是偶数才是select不然是div，则不遍历
    if (index % 2 === 0) {
      //item的下下个兄弟元素就是属性
      let all_attr_item = item.nextSibling.nextSibling;
      //遍历select
      for (j = 0; j < item.length; j++) {
        //当某个option本选中时
        if (item.options[j].selected) {
          //再遍历该属性(item)下面的元素
          for (i = 0; i < all_attr_item.length; i++) {
            //如果属性的元素被选中了，将内容存入数组中去
            if (all_attr_item.options[i].selected) {
              attr_str.push(item.options[j].innerHTML + "."
                  + all_attr_item.options[i].innerHTML
                  + "~" + (item.options[j].value).split("-")[1] + "."
                  + (all_attr_item.options[i].value).split("-")[1]);
            }
          }
        }
      }
    }
  });
  //对数组进行去重
  attr_str=Array.from(new Set(attr_str));
  //将原来session中的数据清除
  sessionStorage.removeItem("attr_array");
  //将array存入session中
  sessionStorage.setItem("attr_array",JSON.stringify(attr_str));
  // 将attr_str存入session中
  let attr_session_array=JSON.parse(sessionStorage.getItem("attr_array"));
  //清空attribute-select类中的option
  $(".attribute-select").empty();
  //遍历session域中数组并添加option元素
  $.each(attr_session_array,function (index, item) {
    $(".attribute-select").append("<option value='"+item.split("~")[1]+"'>"+item.split("~")[0]+"</option>");
  });
  //拼接完语句后关闭模态框
  $("#selection-modal").modal('hide');
  let completeChinaString=(selectChinaString+whereChinaString+orderChinaString);
  //加入提示信息面板
  $("#step-div").append("      <div class=\"panel panel-primary\">\n"
      + "        <div class=\"panel-heading\">选择型</div>\n"
      + "        <div class=\"panel-body\">\n"
      + "          <h5 class=\"note\">"+"描述: "+note+"</h5>\n"
      + "          <h5 style='display:none' class=\"value\">" + completeString + "</h5>"
      + "          <h5 style='display:none' class='showValue'>" +completeChinaString+ "</h5>\n"
      + "          <h5>" +selectChinaString+ "</h5>\n"
      + "          <h5>" +whereChinaString+ "</h5>\n"
      + "          <h5>" +orderChinaString+ "</h5>\n"
      + "        </div>\n"
      + "      </div>");
});

//功能型保存按钮触发
$(document).on('click',"#function-save-button",function () {
  //拼接功能语句
  let functionValue="";
  let functionChinaString="";
  let groupString="分组依据为: "+$("#group-select :selected").text();
  functionValue+="group="+$("#group-select").val()+",";
  functionValue+=$("#function-select").val()+"=";
  let functionString="    功能为: "+$("#function-select :selected").text();
  functionValue+=$("#operating-select").val();
  let operatingString="    运算属性为: "+$("#operating-select :selected").text();
  functionChinaString=(groupString+functionString+operatingString);
  //关闭功能模态框
  $("#function-modal").modal('hide');
  //加入提示信息面板
  $("#step-div").append("      <div class=\"panel panel-primary\">\n"
      + "        <div class=\"panel-heading\">功能型</div>\n"
      + "        <div class=\"panel-body\">\n"
      + "          <h5 class=\"note\">" + "描述: "+$("#functionDescription1").val() + "</h5>\n"
      + "          <h5 class=\"value\" style='display: none'>" + functionValue + "</h5>\n"
      + "          <h5 style='display: none' class=\"showValue\">" + functionChinaString + "</h5>\n"
      + "          <h5>" + groupString + "</h5>\n"
      + "          <h5>" + functionString + "</h5>\n"
      + "          <h5>" + operatingString + "</h5>\n"
      + "        </div>\n"
      + "      </div>");
});

//数值按钮触发
$(document).on('click',"#alert-text",function () {
  //关闭公式模态框
  $("#formula-modal").modal('hide');
  swal({
    title: '请输入',
    input: 'text',
    showCancelButton: true,
    inputValidator: function(value) {
      return new Promise(function(resolve, reject) {
        if (value) {
          resolve();
        } else {
          reject('请输入一个数值');
        }
      });
    }
  }).then(function(result) {
    //打开公式模态框
    $("#formula-modal").modal({
      backdrop:'static'
    });
    //当取消的时候不讲值添加进去
    if (result!==false&&result!==null) {
      result = parseFloat(result);
      if (result % 1 === 0){
        result = result.toFixed(1);
      }
      $("#formula-div").append("<span resultValue='"+result+"'>" + result + "</span>");
    }
  })
});

//给属性绑定事件
$(document).on('click',"#attr-button",function () {
  let attr_session_array=JSON.parse(sessionStorage.getItem("attr_array"));
  let attribute_select=$("<select id='attr_select_alert'></select>");
  $.each(attr_session_array,function (index, item) {
    attribute_select.append("<option value='"+item.split("~")[1]+"'>"+item.split("~")[0]+"</option>");
  });
  //使用sweetAlert弹出框显示
  swal({
    title: '请选择属性',
    //在弹出框创建html元素
    html:attribute_select[0].outerHTML,
    showCancelButton: true,
    confirmButtonText: 'OK'
  }).then(function(isConfirm) {
    //如果确定则将值添加进公式值
    if (isConfirm) {
      let attr_value=$("#attr_select_alert option:selected").text();
      let attr_sql_value=$("#attr_select_alert").val();
      $("#formula-div").append("<span resultValue='"+attr_sql_value+"'>"+attr_value+"</span>");
    }
  });
});

//给左括号绑定事件
$(document).on('click',"#left-bracket",function () {
  $("#formula-div").append("<span resultValue='('>"+"("+"</span>");
});

//给右括号绑定事件
$(document).on('click',"#right-bracket",function () {
  $("#formula-div").append("<span resultValue=')'>"+")"+"</span>");
});

//给+绑定事件
$(document).on('click',"#add-button",function () {
  $("#formula-div").append("<span resultValue='+'>"+"+"+"</span>");
});

//给-绑定事件
$(document).on('click',"#minus-button",function () {
  $("#formula-div").append("<span resultValue='-'>"+"-"+"</span>");
});

//给乘法绑定事件
$(document).on('click',"#multiple-button",function () {
  $("#formula-div").append("<span resultValue='*'>"+"*"+"</span>");
});

//给除法绑定事件
$(document).on('click',"#divice-button",function () {
  $("#formula-div").append("<span resultValue='/'>"+"/"+"</span>");
});

//给回退按钮绑定事件
$(document).on('click',"#back-button",function () {
  $("#formula-div span:last").remove();
});

//给清空绑定事件
$(document).on('click',"#empty-all-button",function () {
  $("#formula-div").empty();
});

//给公式型保存按钮绑定事件
$(document).on('click',"#formula-save-button",function () {
  //拼接公式的值
  let formulaValueString="";
  let formulaChinaString="";
  let formulaValue=$("#formula-div span");
  $.each(formulaValue,function (index, item) {
    formulaChinaString+=($(item).text());
    formulaValueString+=($(item).attr("resultValue"));
  });
  //关闭模态框
  $("#formula-modal").modal('hide');
  //添加提示信息面板
  $("#step-div").append("      <div class=\"panel panel-primary\">\n"
      + "        <div class=\"panel-heading\">公式型</div>\n"
      + "        <div class=\"panel-body\">\n"
      + "          <h5 class=\"note\">" + "描述: "+$("#description").val() + "</h5>\n"
      + "          <h5 class=\"value\" style='display: none'>" + formulaValueString + "</h5>\n"
      + "          <h5 class=\"showValue\">" + formulaChinaString + "</h5>\n"
      + "        </div>\n"
      + "      </div>");
});


//保存规则按钮绑定事件
$(document).on('click',"#save-button",function () {
  //生成当前时间戳
  let currentTimeValue=new Date().getTime();
  //创建需要返回的value的json数据
  let json={};
  //添加时间戳字段
  json.num=currentTimeValue;
  //设置步骤的数组
  let stepArray=[];
  //获取所有步骤
  let allStep=$("#step-div .panel-primary");
  //遍历步骤并生成json数据放入数组中
  $.each(allStep,function (index, item) {
    let stepJson={};
    stepJson.type=$(item).children(":first").text();
    stepJson.note=$(item).find(".note").text();
    stepJson.value=$(item).find(".value").text();
    stepJson.show=$(item).find(".showValue").text();
    stepArray.push(stepJson);
  });
  //创建的json的step字段
  json.steps=stepArray;
  //发送ajax请求添加规则
  if ($("#addSaveForm").validate().form()) {
    $.ajax({
      url: url + '/rule/updateRules.action',
      type:'post',
      dataType:'json',
      data:{
        str1:$("#name").val(),
        str2:$("#feature").val(),
        str3:$("#descript").val(),
        // factorNames:allTable,
        str4:JSON.stringify(json),
        str5:id
      },
      success:function (result) {
        //如果成功提示成功信息
        if (result.code === 0) {
          swal({
            title: '修改成功!',
            confirmButtonText: '确定'
          }).then(function(isConfirm) {
            if (isConfirm) {
              window.location.href="rule_bank.html";
            }
          });
        }else {
          swal(
              '修改失败!',
              result.msg,
              'error'
          )
        }
      },
      error: function () {
        swal(
            '修改失败!',
            '网络错误',
            'error'
        )
      }
    })
  }
});

//回退绑定事件
$(document).on('click',"#delete-btn",function () {
  //获取最后一个
  //如果是input
  let lastAttr=$(".panel-success").find(".where_element:last");
  if (lastAttr[0].tagName === 'INPUT') {
    lastAttr.remove();
  }else {
    $(".panel-success").find(".where_element:last").remove();
    $(".panel-success").find(".where_element:last").remove();
  }
});

//删除步骤绑定事件
$(document).on('click',"#delete-step-btn",function () {
  $("#step-div").children(":last").remove();
  saveValueToSession();
  getFactors();
});

//获取最后一个的选择面板的值并将table.attr存入session中
function saveValueToSession() {
  //获取最后一个选择型的面板
  let stepDiv=$("#step-div").children(".选择型:last");
  //获取value值
  let value=stepDiv.find(".value").text();
  let subValue=value.substring(value.indexOf("select ")+7,value.indexOf(" from"));
  let valueArray=[];
  //将截取的字符串再次分割(包含,的)
  if (subValue.indexOf(",")!==-1){
    valueArray=subValue.split(",");
  }else {
    valueArray.push(subValue);
  }


  let show=stepDiv.find(".showValue").text();


  let subShow;
  //如果包含条件为则截取选取和条件之间地语句
  if(show.indexOf(" 条件为: ")!==-1){
    subShow=show.substring(show.indexOf("选取:")+9,show.indexOf(" 条件为:   "));
  }else if (show.indexOf(" 条件为: ")===-1&&show.indexOf(" 通过: ")!==-1) {
    subShow=show.substring(show.indexOf("选取:")+9,show.indexOf(" 通过:   "));
  }else if (show.indexOf(" 条件为: ") === -1 && show.indexOf(" 通过: ") === -1) {
    subShow=show.substring(show.indexOf("选取:")+9,show.length);
  }
  let showArray=[];
  if (subShow.indexOf("和")!==-1){
    showArray=subShow.split("和");
  }else {
    showArray.push(subShow);
  }
  let jointString;
  let attrNameString="";
  let jointShowValueArray=[];
  if (showArray !== null && showArray !== undefined) {
    $.each(showArray,function (index, item) {
      let tableName=item.split("的",2)[0];
      attrNameString=item.split("的",2)[1];
      if (attrNameString.indexOf(",") !== -1) {
        //如果存在多个
        let attrName=attrNameString.split(",");
        $.each(attrName,function (attrNameIndex, attrNameItem) {
          attrNameItem="."+attrNameItem;
          jointString=tableName+attrNameItem;
          jointShowValueArray.push(jointString);
        })
      }else {
        jointString=tableName+"."+attrNameString;
        jointShowValueArray.push(jointString);
      }
    });
  }

  //新建一个session数组
  let attr_array=[];

  for (let i = 0;i<jointShowValueArray.length;i++){
    attr_array[i]=jointShowValueArray[i]+"~"+valueArray[i];
  }
  sessionStorage.removeItem("attr_array");
  sessionStorage.setItem("attr_array",JSON.stringify(attr_array));
  //清空attribute-select类中的option
  $(".attribute-select").empty();
  //遍历session域中数组并添加option元素
  $.each(attr_array,function (index, item) {
    $(".attribute-select").append("<option value='"+item.split("~")[1]+"'>"+item.split("~")[0]+"</option>");
  });
}

//获取表的序列
function getFactors() {
  //获取所有选择型面板
  let selectPanel=$("#step-div").children(".选择型");
  //遍历
  $.each(selectPanel,function (index, item) {
    let value=$(item).find(".value").text();
    let table;
    if (value.indexOf(" where ") !== -1) {
      if (index === 0) {
        table=value.substring(value.indexOf("from ")+6,value.indexOf(" where"));
        allTable=table;
      }else if ((index !== 0)) {
        table=","+value.substring(value.indexOf("from ")+6,value.indexOf(" where"));
        allTable+=table;
      }
    }else {
      if(index===0){
        table=value.substring(value.indexOf("from ")+6,value.length);
        allTable=table;
      }else if (index !== 0) {
        table=","+value.substring(value.indexOf("from ")+6,value.length);
        allTable+=table;
      }

    }
  });
}


