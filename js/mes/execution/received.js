let roles = getQueryVariable("roles");
let workNum = sessionStorage.getItem("workNum");
$(function () {
  $("#addForm").validate();
  //首先发送ajax请求获取列表数据
  $.ajax({
    url: url + "/doing/getTasks.action",
    method: 'GET',
    data: {
      str1: 'doing',
      str2: workNum
    },
    dataType: 'json',
    success: function (result) {
      if (result.code === 0) {
        let data = result.data;
        //判断权限
        if (roles === 0) {
          //初始化列表
          initTableWithoutAuthority(data);
        } else {
          initTableWithAuthority(data);
        }
      }
    }
  });
});

let stepNum;
let do_workName;
//查看任务详情
$(document).on('click', '.taskDetail', function () {
  let table_collection = $('#table_collection');
  table_collection.empty();
  //将原先内容清空
  $('#stepName').text("");
  $('#description').text("");
  $('#operator').text("");
  $('#commit').text("");
  // 获取工单编号和工序编号
  let jobNum = $(this).attr('jobNum');
  stepNum = $(this).attr('stepNum');
  $("#detailModal").modal({
    backdrop: 'static'
  });
  $.ajax({
    url: url + "/product/getTaskDetail.action",
    method: 'GET',
    data: {
      str1: stepNum,
      str2: jobNum
    },
    dataType: 'json',
    success: function (result) {
      if (result.code === 0) {
        let data = result.data;
        //获取工序名称
        let stepName = data.stepName;
        //获取描述
        let description = data.descript;
        //获取操作员名字
        do_workName = data.do_workName;
        //获取备注
        let commit = data.commit;
        $('#stepName').text(stepName);
        $('#description').text(description);
        $('#operator').text(do_workName);
        $('#commit').text(commit);
        //获取tasks数组
        let tasks = data.tasks;
        //获取table集合的div
        $.each(tasks, function (index, item) {
          //获取到订单号作为id
          let orderNum = item.orderNum;
          //获取加工环境
          let environ=item.environ;
          let orderPanel = "panel_" + orderNum;
          //将数据变成表格添加到table集合中
          table_collection.append(
            "            <div class=\"panel panel-default\">\n"
            + "              <div class=\"panel-heading\">\n"
            + "                <h4 class=\"panel-title\">\n"
            + "                  <a data-toggle=\"collapse\" href='" + "#"
            + orderPanel + "'>\n"
            + "                    <span>订单号：</span>\n"
            + "                    <span class=\"orderNum margin-right-20\">"
            + orderNum + "</span>\n"
            + "                    <span>单品号：</span>\n"
            + "                    <span class=\"goodsNum margin-right-20\">"
            + item.goodsNum + "</span>\n"
            + "                    <span>单品名：</span>\n"
            + "                    <span class=\"goodsName margin-right-20\">"
            + item.goodsName + "</span>\n"
            + "                  </a>\n"
            + "                </h4>\n"
            + "              </div>\n"
            + "              <div id=" + orderPanel
            + " class=\"panel-collapse collapse\">\n"
            + "                <div>&nbsp</div>"
            + "                <div class=\"form-group\">\n"
            + "                  <label style=\"margin-bottom: 0\">用到的设备：</label>\n"
            + "                  <span class=\"equip\">"+ item.equip +"</span>\n"
            + "                </div>\n"
            + "                <div class=\"form-group\">\n"
            + "                  <label style=\"margin-bottom: 10px;margin-top: 5px\">分配物料：</label>\n"
            + "                  <table id=" + item.orderNum + "></table>\n"
            + "                </div>\n"
            + "                <div class=\"form-group\">\n"
            + "                  <label style=\"margin-bottom: 0\">生产结果：</label>\n"
            + "                  <span class=\"resluts\">" + item.results
            + "</span>\n"
            + "                </div>\n"
            + "                <div class=\"form-group\" >\n"
            + "                  <label style=\"margin-bottom: 10px;margin-top: 5px\">加工环境：</label>\n"
            + "                  <table id=\"environ\" class=\"table table-bordered table-hover\"><tr><th>环境名</th><th>环境描述</th></tr></table>\n"
            + "                </div>\n"
            + "              </div>\n"
            + "            </div>");

          $.each(environ, function(index, item) {
            $("#environ").append("<tr><td>"+item.name+"</td><td>"+item.descript+"</td></tr>");
          });
          $('#' + orderNum).bootstrapTable({
            data: item.materials,
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
              field: 'name',
              title: '物料名',
              sortable: true,
            }, {
              field: 'subMan',
              title: '提交人',
              sortable: true,
            },{
              field: 'num',
              title: '分配数量',
              sortable: true,
            }]
          });
        });
      } else {
        swal(
          '操作失败!',
          result.msg,
          'error'
          );
      }
    },
    error: function () {
      swal(
        '操作失败',
        '网络错误!',
        'error'
        );
    }
  });

});

//获取url中的参数
function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  query = window.atob(query);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] === variable) {
      return pair[1];
    }
  }
  return (false);
}

//无权限初始化table
function initTableWithoutAuthority(data) {
  //初始化待领取工单列表
  $('#underway_table').bootstrapTable({
    data: data.normal,
    pagination: true,
    search: true,
    dataType: 'json',
    toolbar: '#toolbar',
    contentType: "application/x-www-form-urlencoded",
    striped: true,
    sidePagination: 'client',
    pageSize: '15',
    pageList: [10, 25, 50, 100],
    showRefresh: true,
    mobileResponsive: true,
    useRowAttrFunc: true,
    columns: [{
      field: 'jobNum',
      title: '工单号',
      sortable: true,
    }, {
      field: 'stepName',
      title: '工序名',
      sortable: true,
    }, {
      field: 'stepDesc',
      title: '描述',
      sortable: true,
    }, {
      field: 'assTime',
      title: '分配时间',
      sortable: true,
    }, {
      field: 'recTime',
      title: '领取时间',
      sortable: true,
    }
    ]
  });

  //初始化返修工单列表
  $('#return_repair_table').bootstrapTable({
    data: data.back,
    pagination: true,
    search: true,
    dataType: 'json',
    toolbar: '#toolbar',
    contentType: "application/x-www-form-urlencoded",
    striped: true,
    sidePagination: 'client',
    pageSize: '15',
    pageList: [10, 25, 50, 100],
    showRefresh: true,
    mobileResponsive: true,
    useRowAttrFunc: true,
    columns: [{
      field: 'jobNum',
      title: '工单号',
      sortable: true,
    }, {
      field: 'backName',
      title: '返修物品',
      sortable: true,
    }, {
      field: 'backNum',
      title: '数量',
      sortable: true,
    }, {
      field: 'assTime',
      title: '分配时间',
      sortable: true,
    }, {
      field: 'recTime',
      title: '领取时间',
      sortable: true,
    }, {
      field: 'condition',
      title: '情况说明',
      sortable: true,
    }, {
      field: 'deal',
      title: '处理说明',
      sortable: true,
    }
    ]
  });

}

//有权限初始化table
function initTableWithAuthority(data) {
  $('#underway_table').bootstrapTable({
    data: data.normal,
    pagination: true,
    search: true,
    dataType: 'json',
    toolbar: '#toolbar',
    striped: true,
    sidePagination: 'client',
    pageSize: '15',
    pageList: [10, 25, 50, 100],
    showRefresh: true,
    uniqueId: 'jobNum',
    contentType: "application/x-www-form-urlencoded",
    mobileResponsive: true,
    useRowAttrFunc: true,
    columns: [{
      field: 'jobNum',
      title: '工单号',
      sortable: true,
    }, {
      field: 'stepName',
      title: '工序名',
      sortable: true,
    }, {
      field: 'stepDesc',
      title: '描述',
      sortable: true,
    }, {
      field: 'assTime',
      title: '分配时间',
      sortable: true,
    }, {
      field: 'recTime',
      title: '领取时间',
      sortable: true,
    }, {
      field: 'null',
      title: '操作',
      formatter: actionFormatterForReceived,
    }
    ]
  });

  $('#return_repair_table').bootstrapTable({
    data: data.back,
    pagination: true,
    search: true,
    dataType: 'json',
    toolbar: '#toolbar',
    striped: true,
    sidePagination: 'client',
    pageSize: '15',
    pageList: [10, 25, 50, 100],
    showRefresh: true,
    contentType: "application/x-www-form-urlencoded",
    mobileResponsive: true,
    useRowAttrFunc: true,
    columns: [{
      field: 'jobNum',
      title: '工单号',
      sortable: true,
    }, {
      field: 'backName',
      title: '返修物品',
      sortable: true,
    }, {
      field: 'backNum',
      title: '数量',
      sortable: true,
    }, {
      field: 'assTime',
      title: '分配时间',
      sortable: true,
    }, {
      field: 'recTime',
      title: '领取时间',
      sortable: true,
    }, {
      field: 'condition',
      title: '情况说明',
      sortable: true,
    }, {
      field: 'deal',
      title: '处理说明',
      sortable: true,
    }, {
      field: 'null',
      title: '操作',
      formatter: actionFormatterForRepair,
    }
    ]
  });

}

//渲染按钮
function actionFormatterForRepair(value, row, index) {
  let jobNum = row.jobNum;
  let descript = row.deal;
  let stepNum = row.backStepNum;
  let result = "";
  result += "<button class='btn btn-xs btn-success back-input-result' stepNum='"+ stepNum +"' descript='"+ descript +"' jobNum='"
  + jobNum + "' title='录入结果'><span>录入结果</span></button>";
  return result;
}

function emptyTorn(){
  $("#operator_finish").empty();
  $("#operator_torn").empty();
}
//渲染按钮
function actionFormatterForReceived(value, row, index) {
  //工单编号
  let jobNum = row.jobNum;
  //工序编号
  let stepNum = row.stepNum;
  //工序名
  let stepName = row.stepName;
  //描述
  let stepDesc = row.stepDesc;
  let result = "";
  result += "<button class='btn btn-xs btn-primary taskDetail' jobNum='"
  + jobNum + "' stepNum='" + stepNum
  + "' title='任务详情'><span>任务详情</span></button>";
  result += "<button class='btn btn-xs btn-success input-result' stepNum='"
  + stepNum + "' stepDesc='" + stepDesc + "' jobNum='" + jobNum
  + "' stepName='" + stepName + "' title='录入结果'><span>录入结果</span></button>";
  result += "<button class='btn btn-xs btn-warning check-input' stepNum='"
  + stepNum + "' stepDesc='" + stepDesc + "' jobNum='" + jobNum
  + "' stepName='" + stepName + "' title='查看录入'><span>查看录入</span></button>";
  return result;
}


let data;
let result;
let finishMap=new Map();
let enteringStepNum;
//打开录入结果模态框并显示
$(document).on('click', '.input-result', function () {
  //清空$('#nav-tabs')
  $('#nav-tabs').empty();
  $("#tab-content").empty();
  //获取工单号，工序号
  let jobNum = $(this).attr('jobNum');
  let stepName = $(this).attr('stepName');
  let stepDesc = $(this).attr('stepDesc');
  enteringStepNum = $(this).attr('stepNum');
  //打开模态框
  $('#inputResultModal').modal({
    backdrop: 'static'
  });
  $.ajax({
    // url:'https://www.easy-mock.com/mock/5d14258323814619b952ba12/product/test222',
    url: url + '/doing/getResultPageData.action', 
    method: 'post',
    dataType: 'json',
    data: {
      str1: enteringStepNum,
      str2: jobNum,
      str3: 'normal'
    },
    success: function (result) {
      // 首先将工单号 工序名，描述填入span中
      $('#orderNum').text(jobNum);
      $('#inputStepName').text(stepName);
      $('#inputDescription').text(stepDesc);
      if (result.code === 0) {
        data = result.data;
        console.log(data);
        //首先获取到选项卡按钮集合
        let nav_tabs = $('#nav-tabs');
        $.each(data, function (index, item) {
          //获取item的orderNum作为选项卡的id
          console.log(item);
          let orderNum = item.orderNum;
          finishMap.set(orderNum,item.finish);
          console.log(finishMap);
          //首先创建选项卡内容的div
          let tab_pane;
          if (index === 0) {
            tab_pane = $("<div id='"+ orderNum +"' class=\"tab-pane active\"></div>");
          } else {
            tab_pane = $("<div id='"+ orderNum +"' class=\"tab-pane\"></div>");
          }
          //创建一个panel-body
          let panel_body = $("<div class=\"panel-body\"></div>");
          let nextRow = $("                <div class=\"row\">\n"
            + "                  <div class=\"col-md-4 text-center\">\n"
            + "                    <label>订单号:</label>\n"
            + "                    <span>"+ orderNum +"</span>\n"
            + "                  </div>\n"
            + "                  <div class=\"col-md-4 text-center\">\n"
            + "                    <label>单品号:</label>\n"
            + "                    <span>"+ item.goodsNum +"</span>\n"
            + "                  </div>\n"
            + "                  <div class=\"col-md-4 text-center\">\n"
            + "                    <label>单品名:</label>\n"
            + "                    <span>"+ item.goodsName +"</span>\n"
            + "                  </div>\n"
            + "                </div>\n"
            + "                <hr>");
          panel_body.append(nextRow);
          //创建完成row
          let finishId = orderNum+"_finish";
          let finishRow = $("                <div class=\"row\">\n"
            + "\n"
            + "                  <div class=\"col-md-12\">\n"
            + "                    <h1>完成数量：</h1>\n"
            + "                    <br>\n"
            + "                  </div>\n"
            + "                  <div class=\"col-md-12\">\n"
            + "                    <form class=\"form-horizontal\" id='"+ finishId +"'>\n"
            + "                    </form>\n"
            + "                  </div>\n"
            + "                </div>");
          panel_body.append(finishRow);
          //创建破损row
          let tornId = orderNum+"_torn";
          let tornRow = $("                <div class=\"row\">\n"
            + "                  <div class=\"col-md-12\">\n"
            + "                    <h1>破损数量：</h1>\n"
            + "                    <br>\n"
            + "                  </div>\n"
            + "                  <div class=\"col-md-6\">\n"
            + "                    <form class=\"form-horizontal\" id='"+ tornId +"'></form>\n"
            + "                  </div>\n"
            + "                  <div class=\"col-md-6\">\n"
            + "                     <textarea class=\"form-control letter_of_presentation_broken\"\n"
            + "                               placeholder=\"情况说明\"\n"
            + "                               rows=\"5\"></textarea>\n"
            + "                  </div>\n"
            + "                </div>");
          panel_body.append(tornRow);
          let backId = orderNum + "_back";
          let questionId = orderNum + "_question";
          let backRow = $("                <div class=\"col-md-12\">\n"
            + "                  <h1>退换数量：</h1>\n"
            + "                  <br>\n"
            + "                </div>\n"
            + "                <div class=\"col-md-6 text-left\">\n"
            + "                  <form class=\"form-horizontal\" id='"+ backId +"'></form>\n"
            + "                </div>\n"
            + "                <div class=\"col-md-6\">\n"
            + "                  <form class=\"form-horizontal\" id='"+ questionId +"'></form>\n"
            + "                </div>\n"
            + "                <div class=\"row\">\n"
            + "                  <div class=\"col-md-12\">\n"
            + "            <textarea class=\"form-control letter_of_presentation_repair\" placeholder=\"情况说明\"\n"
            + "                      rows=\"5\"></textarea>\n"
            + "                  </div>\n"
            + "                </div>");
          panel_body.append(backRow);
          tab_pane.append(panel_body);
          $("#tab-content").append(tab_pane);
          //加入选项卡按钮 第一个默认打开
          if (index === 0) {
            nav_tabs.append("<li class=\"active\"><a data-toggle=\"tab\" href='"+ '#'+orderNum +"' aria-expanded=\"true\">订单号: "+ orderNum +"</a>\n"
              + "</li>");
          } else {
            nav_tabs.append("<li><a data-toggle=\"tab\" href='"+ '#'+orderNum +"' aria-expanded=\"false\">订单号: "+ orderNum +"</a>\n"
              + "</li>");
          }
          //获取到finish字段数组
          let finish = item.finish;
          //遍历finish数组
          $.each(finish, function (finishIndex, finishItem) {
            let semiFinishId = finishItem.id + "_semiFinished_" + orderNum;
            $('#'+finishId).append("                      <div class=\"form-group\">\n"
              + "                        <label for=''"+ semiFinishId + "'\n"
              + "                               class='control-label col-md-2 text-left'>"+ finishItem.name +"：</label>\n"
              + "                        <div class=\"col-md-7\">\n"
              + "                          <input finishId='"+ finishItem.id +"'  id='"+ semiFinishId +"' class=\"form-control finish-input\" type=\"number\" value='"+ 0 + "' min='0' required/>\n"
              + "                        </div>\n"
              + "                      </div>");
          });


          //获取到ques数组

          let question = item.ques;
          let singleSelect = $("<select class='form-control question-select'></select>");
          $.each(question, function (questionIndex, questionItem) {
            singleSelect.append("<option  value="+questionItem.id+">"+ questionItem.name +"</option>");
          });



          let selectFormDiv = $("<div class='form-group'></div>");
          let selectLabel = $("<label class='col-md-4'>问题类型选择：</label>");
          let divCol8 = $("<div class='col-md-8'></div>");
          divCol8.append(singleSelect);
          selectFormDiv.append(selectLabel).append(divCol8);


          //获取到torn_back数组
          let torn_back = item.torn_back;
          $.each(torn_back,function (torn_backIndex, torn_backItem) {
            let torn_id = torn_backItem.id + "_torn_" + orderNum;
            let back_id = torn_backItem.id + "_back_" + orderNum;
            $('#'+tornId).append("                      <div class=\"form-group\">\n"
              + "                        <label for='"+ torn_id +"' class=\"col-md-3 control-label\">"+ torn_backItem.name +"：</label>\n"
              + "                        <div class=\"col-md-9\">\n"
              + "                          <input torn_backId='"+ torn_backItem.id +"' origin='"+ torn_backItem.origin +"'  id='"+ torn_id +"' type=\"number\" class=\"form-control torn-input\" value='"+ 0 + "'min='0' required/>\n"
              + "                        </div>\n"
              + "                      </div>");
            $('#'+backId).append("                      <div class=\"form-group\">\n"
              + "                        <label for='"+ back_id +"' class=\"col-md-3 control-label\">"+ torn_backItem.name +"：</label>\n"
              + "                        <div class=\"col-md-9\">\n"
              + "                          <input torn_backId='"+ torn_backItem.id +"' origin='"+ torn_backItem.origin +"'  id='"+ back_id +"' type=\"number\" class=\"form-control back-input\" value='"+ 0 + "' min='0'required/>\n"
              + "                        </div>\n"
              + "                      </div>");
            $('#'+questionId).append(selectFormDiv.clone());
          });

        });
}
}
});
});

// 打开录入查看模态框并显示
$(document).on('click', '.check-input', function () {
  $("#cheak_input").bootstrapTable('destroy');
  var jobNum = $(this).attr('jobNum');
  $(".cheak_input_title").text('工单'+jobNum+'的录入详情：');
  // $("#cheak_input").empty();
  $("#secondary_module").show();
  $("#cheak_input").bootstrapTable({
    url: url + '/doing/getSubmitRecord.action',
    dataType: 'json',
    dataField: "data",
    striped: true,
    pagination: true,
    pageSize: '5',
    pageList: [10, 25, 50, 100],
    contentType: "application/x-www-form-urlencoded",
    mobileResponsive: true,
    useRowAttrFunc: true,
    queryParams:function(params){
      return{
        str1:jobNum,
      }
    },
    columns: [{
      field: 'times',
      title: '提交时间',
      sortable: true,
    }, {
      field: 'normals',
      title: '正常提交',
      sortable: true,
    }, {
      field: 'backs',
      title: '退换提交',
      sortable: true,
    }, {
      field: 'torns',
      title: '破损提交',
      sortable: true,
    }, {
      field: 'null',
      title: '操作',
      formatter: cheakformatter,
    }]
  });



  function cheakformatter(value,row,index){
    var times=row.times;
    var normals=row.normals;
    var backs=row.backs;
    var torns=row.torns;
    var result = "";
    result+="<button class='btn btn-xs btn-primary checkButton' jobNum="+jobNum+" times='"+times+"' normals="+normals+" backs="+backs+" torns="+torns+" title='录入详情'><span>录入详情</span></button>";
    return result;
  }
});

$(document).on('click', '.checkButton', function () {
  var jobNum=$(this).attr("jobNum");
  var times=$(this).attr("times");
  var normals=$(this).attr("normals");
  var backs=$(this).attr("backs");
  var torns=$(this).attr("torns");
  $.ajax({
    url: url + '/doing/getSRDetail.action',
    method: 'post',
    dataType: 'json',
    data: {
      str1: jobNum,
      str2:times,
      str3:normals,
      str4:backs,
      str5:torns
    },
    success:function(result){
      $("#checkInputModalTableCollection").empty();
      $('#checkInputModal').modal({
        backdrop: 'static'
      });
      // console.log(result.data);
      var data= result.data;
      $.each(data, function(index, val) {
        var orderPanel = "panel_" + index;
        $("#checkInputModalTableCollection").append(
          "            <div class=\"panel panel-default\">\n"
          + "              <div class=\"panel-heading\">\n"
          + "                <h4 class=\"panel-title\">\n"
          + "                  <a data-toggle=\"collapse\" href='" + "#"
          + orderPanel + "'>\n"
          + "                    <span>订单号：</span>\n"
          + "                    <span class=\"orderNum margin-right-20\">"
          + data[index].orderNum + "</span>\n"
          + "                    <span>单品号：</span>\n"
          + "                    <span class=\"goodsNum margin-right-20\">"
          + data[index].goodsNum + "</span>\n"
          + "                    <span>单品名：</span>\n"
          + "                    <span class=\"goodsName margin-right-20\">"
          + data[index].goodsName + "</span>\n"
          + "                  </a>\n"
          + "                </h4>\n"
          + "              </div>\n"
          + "              <div id=" + orderPanel
          + " class=\"panel-collapse collapse\">\n"
          + "                <div class=\"form-group\">\n"
          + "                  <label style=\"margin-bottom: 10px;margin-top: 5px\">完成情况：</label>\n"
          + "                  <table id=\"finishState_"+index+"\"></table>\n"
          + "                </div>\n"
          + "                <div class=\"form-group\">\n"
          + "                  <label style=\"margin-bottom: 10px;margin-top: 5px\">破损情况：</label>\n"
          + "                  <table id=\"tornState_"+index+"\"></table>\n"
          + "                  <label id=\"tornCommit_"+index+"\"style=\"margin-bottom: 10px;margin-top: 5px\">破损说明：</label>\n"
          + "                </div>\n"
          + "                <div class=\"form-group\">\n"
          + "                  <label style=\"margin-bottom: 10px;margin-top: 5px\">退换情况：</label>\n"
          + "                  <table id=\"backState_"+index+"\"></table>\n"
          + "                  <label id=\"backCommit_"+index+"\"style=\"margin-bottom: 10px;margin-top: 5px\">退换说明：</label>\n"
          + "                </div>\n"
          + "              </div>\n"
          + "            </div>");
        $('#finishState_'+index).bootstrapTable({
          data: data[index].finish,
          dataType: 'json',
          striped: true,
          pageSize: '15',
          pageList: [10, 25, 50, 100],
          contentType: "application/x-www-form-urlencoded",
          mobileResponsive: true,
          useRowAttrFunc: true,
          columns: [{
            field: 'name',
            title: '物料名',
            sortable: true,
          }, {
            field: 'num',
            title: '提交数量',
            sortable: true,
          }]
        });
        if((data[index].torn.length)>0){
          $('#tornState_'+index).bootstrapTable({
            data: data[index].torn,
            dataType: 'json',
            striped: true,
            pageSize: '15',
            pageList: [10, 25, 50, 100],
            contentType: "application/x-www-form-urlencoded",
            mobileResponsive: true,
            useRowAttrFunc: true,
            columns: [{
              field: 'name',
              title: '物料名',
              sortable: true,
            }, {
              field: 'num',
              title: '提交数量',
              sortable: true,
            }]
          });
          $('#tornCommit_'+index).text("破损说明："+data[0].tornCommit);
        }else{
          $('#tornState_'+index).parent().remove();
        }

        if((data[index].back.length)>0){
          $('#backState_'+index).bootstrapTable({
            data: data[index].back,
            dataType: 'json',
            striped: true,
            pageSize: '15',
            pageList: [10, 25, 50, 100],
            contentType: "application/x-www-form-urlencoded",
            mobileResponsive: true,
            useRowAttrFunc: true,
            columns: [{
              field: 'name',
              title: '物料名',
              sortable: true,
            }, {
              field: 'num',
              title: '提交数量',
              sortable: true,
            }, {
              field: 'quesName',
              title: '问题名',
              sortable: true,
            }]
          });
          $('#backCommit_'+index).text("退换说明："+data[0].backCommit);
        }else{
          $('#backState_'+index).parent().remove();
        }
      });
}
});
});

//删除录入详情div按钮
$(document).on('click', '#del-a', function () {
  $("#secondary_module").hide();
});
//打开录入查看模态框并显示
// $(document).on('click', '.check-input', function () {
//   var jobNum = $(this).attr('jobNum');
//   $("#checkInputModalTableCollection").empty();
//   $('#checkInputModal').modal({
//     backdrop: 'static'
//   });
//   $.ajax({
//     url: url + '/doing/getSubmitRecord.action',
//     method: 'GET',
//     dataType: 'json',
//     data: {
//       str1: jobNum,
//     },
//     success:function(result){
//       var data=result.data;
//       console.log(data);
//       $.each(data, function(index, item) {
//         $.ajax({
//           url: url + '/doing/getSRDetail.action',
//           method: 'post',
//           dataType: 'json',
//           data: {
//             str1: jobNum,
//             str2:item.times,
//             str3:item.normals,
//             str4:item.backs,
//             str5:item.torns
//           },
//           success:function(result){
//             var data=result.data;
//             console.log(data);
//             var inputTime=item.times;
//             let orderPanel = "panel_" + index;
//             $("#checkInputModalTableCollection").append(
//               "            <div class=\"panel panel-default\">\n"
//               + "              <div class=\"panel-heading\">\n"
//               + "                <h4 class=\"panel-title\">\n"
//               + "                  <a data-toggle=\"collapse\" href='" + "#"
//               + orderPanel + "'>\n"
//               + "                    <span>订单号：</span>\n"
//               + "                    <span class=\"orderNum margin-right-20\">"
//               + data[0].orderNum + "</span>\n"
//               + "                    <span>单品号：</span>\n"
//               + "                    <span class=\"goodsNum margin-right-20\">"
//               + data[0].goodsNum + "</span>\n"
//               + "                    <span>单品名：</span>\n"
//               + "                    <span class=\"goodsName margin-right-20\">"
//               + data[0].goodsName + "</span>\n"
//               + "                    <span>录入时间：</span>\n"
//               + "                    <span class=\"orderNum margin-right-20\">"
//               + inputTime + "</span>\n"
//               + "                  </a>\n"
//               + "                </h4>\n"
//               + "              </div>\n"
//               + "              <div id=" + orderPanel
//               + " class=\"panel-collapse collapse\">\n"
//               + "                <div class=\"form-group\">\n"
//               + "                  <label style=\"margin-bottom: 10px;margin-top: 5px\">完成情况：</label>\n"
//               + "                  <table id=\"finishState_"+index+"\"></table>\n"
//               + "                </div>\n"
//               + "                <div class=\"form-group\">\n"
//               + "                  <label style=\"margin-bottom: 10px;margin-top: 5px\">破损情况：</label>\n"
//               + "                  <table id=\"tornState_"+index+"\"></table>\n"
//               + "                  <label id=\"tornCommit_"+index+"\"style=\"margin-bottom: 10px;margin-top: 5px\">破损说明：</label>\n"
//               + "                </div>\n"
//               + "                <div class=\"form-group\">\n"
//               + "                  <label style=\"margin-bottom: 10px;margin-top: 5px\">退换情况：</label>\n"
//               + "                  <table id=\"backState_"+index+"\"></table>\n"
//               + "                  <label id=\"backCommit_"+index+"\"style=\"margin-bottom: 10px;margin-top: 5px\">退换说明：</label>\n"
//               + "                </div>\n"
//               + "              </div>\n"
//               + "            </div>");
//             $('#finishState_'+index).bootstrapTable({
//               data: data[0].finish,
//               dataType: 'json',
//               striped: true,
//               pageSize: '15',
//               pageList: [10, 25, 50, 100],
//               contentType: "application/x-www-form-urlencoded",
//               mobileResponsive: true,
//               useRowAttrFunc: true,
//               columns: [{
//                 field: 'name',
//                 title: '物料名',
//                 sortable: true,
//               }, {
//                 field: 'num',
//                 title: '提交数量',
//                 sortable: true,
//               }]
//             });
//             if((data[0].torn.length)>0){
//               $('#tornState_'+index).bootstrapTable({
//                 data: data[0].torn,
//                 dataType: 'json',
//                 striped: true,
//                 pageSize: '15',
//                 pageList: [10, 25, 50, 100],
//                 contentType: "application/x-www-form-urlencoded",
//                 mobileResponsive: true,
//                 useRowAttrFunc: true,
//                 columns: [{
//                   field: 'name',
//                   title: '物料名',
//                   sortable: true,
//                 }, {
//                   field: 'num',
//                   title: '提交数量',
//                   sortable: true,
//                 }]
//               });
//               $('#tornCommit_'+index).text("破损说明："+data[0].tornCommit);
//             }else{
//               $('#tornState_'+index).parent().remove();
//             }

//             if((data[0].back.length)>0){
//               $('#backState_'+index).bootstrapTable({
//                 data: data[0].back,
//                 dataType: 'json',
//                 striped: true,
//                 pageSize: '15',
//                 pageList: [10, 25, 50, 100],
//                 contentType: "application/x-www-form-urlencoded",
//                 mobileResponsive: true,
//                 useRowAttrFunc: true,
//                 columns: [{
//                   field: 'name',
//                   title: '物料名',
//                   sortable: true,
//                 }, {
//                   field: 'num',
//                   title: '提交数量',
//                   sortable: true,
//                 }, {
//                   field: 'quesName',
//                   title: '问题名',
//                   sortable: true,
//                 }]
//               });
//               $('#backCommit_'+index).text("退换说明："+data[0].backCommit);
//             }else{
//               $('#backState_'+index).parent().remove();
//             }
//           }
//         });

// });
// }
// });
// });

//录入确认按钮
$(document).on('click', '#input-button', function () {
  let json = {};
  let result = [];
  let isFinishZreo=[];
  let isTornZreo=[];
  let isBackZreo=[];
  let submitFlag=true;
  let greaterThanZeroFlag=true;
  //修改data（已经有了finishmap的关系）
  console.log(data);
  $.each(data, function (index, item) {
    //计算比例关系逻辑
    //获取材料的剩余数量和id的MAP
    // console.log(data);
    var leftMats=new Map();
    $.each(item.torn_back, function(leftMatsIndex, leftMatsItem) {
      leftMats.set(leftMatsItem.id,leftMatsItem.leftover);
    });
    // console.log(leftMats);
    //不可完成数量
    var breakNum=new Map();
    var nounNum=new Map();
    //获取已经完成破损和退换的数量
    $.each(item.finish, function(verifyIndex, verifyItem) {
      // console.log(verifyItem);
      var formulas=$.parseJSON(verifyItem.formulas);;
      //用户填写的实际分配数量和实际分配比率数量
      var finishNum=$("#"+verifyItem.id+"_semiFinished_"+item.orderNum).val();
      var finishRate=verifyItem.rates;
      var RatioFinishNum=parseInt(finishNum)/parseInt(finishRate);
      // console.log(finishNum);
      var Ratio=0;
      var maxRatio=0;
      var CanFinishNum=10000000000;
      var maxCanFinishNum=0;
      console.log(formulas);
      for(var i=0;i<formulas.length;i++){
        //获取当前材料最的最大比率
        var Num=parseInt($("#"+formulas[i].num+"_torn_"+item.orderNum).val())+parseInt($("#"+formulas[i].num+"_back_"+item.orderNum).val());
        var Rate=parseInt(formulas[i].rates);
        maxRatio=Math.max(Ratio,Num/Rate);
        Ratio=maxRatio;
        breakNum.set(verifyItem.id,maxRatio*finishRate);

        //找出比如AB两种材料在生成两种半成品的公式中相对大的那个值
        var max=0;
        if(nounNum.get(formulas[i].num)==null){
          max=Math.max(0,(Rate*parseInt(finishNum))/parseInt(finishRate));
        }else{
          max=Math.max(nounNum.get(formulas[i].num),(Rate*parseInt(finishNum))/parseInt(finishRate));
        }
        nounNum.set(formulas[i].num,max);
        console.log(nounNum);
        //获取当前材料的可分配的数量
        // console.log(parseInt(leftMats.get(formulas[i].num))/Rate);
        maxCanFinishNum=Math.min(CanFinishNum,parseInt(leftMats.get(formulas[i].num))/Rate);
        CanFinishNum=maxCanFinishNum;
        // console.log(maxCanFinishNum);
      }
      //比较如果可完成最大数量-材料最大比率<=用户实际分配的数量  则说明用户分配的实际数额大，分配失败
      // console.log(maxCanFinishNum-maxRatio);
      // console.log(RatioFinishNum);
      if((maxCanFinishNum-maxRatio)<RatioFinishNum){
        swal(
          '提交失败',
          '提交数量超出最大值!',
          'error'
          );
        submitFlag=false;
      }else{
        submitFlag=true;
      }
      
    });
    let resultJson = {};
    resultJson.productId = item.productId;
    resultJson.orderNum = item.orderNum;
    resultJson.goodsNum = item.goodsNum;
    resultJson.goodsName = item.goodsName;
    resultJson.tornCommit = $('#'+item.orderNum+' .letter_of_presentation_broken').val();
    resultJson.backCommit = $('#'+item.orderNum+' .letter_of_presentation_repair').val();
    var finish = [];
    var mats=[];
    var finishIndexI=0;
    console.log(0);
    console.log($('#'+item.orderNum+' .finish-input'));
    $.each($('#'+item.orderNum+' .finish-input'),function (finishIndex, finishItem) {
      console.log(3);
      let finishJson = {};
      finishJson.id = item.finish[finishIndex].id;
      if(($(finishItem).val())<='0'){
        swal(
          '提交失败',
          '输入数量错误!',
          'error'
          );
        greaterThanZeroFlag=false;
      }
      finishJson.num = $(finishItem).val();
      finishJson.break=(breakNum.get($(finishItem).attr("finishid"))).toString();
      isFinishZreo[finishIndex]=parseInt($(finishItem).val()) > 0;
      if (isFinishZreo[finishIndex]){
        finish[finishIndexI] = finishJson;
        finishIndexI++;
      } 
    });
    console.log(1);
    resultJson.finish = finish;
    //将mats数据塞进去，还要塞使用的数量（要从完成数量中获取再根据比率计算）
    console.log($('#'+item.orderNum+' .torn-input'));
    $.each($('#'+item.orderNum+' .torn-input'), function (tornIndex, tornItem) {
      console.log(4);
      let matsJson = {};
      matsJson.id = $(tornItem).attr("torn_backid");
      matsJson.origin = $(tornItem).attr("origin");
      if(($(tornItem).val())<'0'){
        swal(
          '提交失败',
          '输入数量不能为负!',
          'error'
          );
        greaterThanZeroFlag=false;
      }
      matsJson.torn=$(tornItem).val();
      console.log((nounNum));
      console.log(($(tornItem).attr("torn_backid")));
      console.log((nounNum.get($(tornItem).attr("torn_backid"))));
      matsJson.used=(nounNum.get($(tornItem).attr("torn_backid"))).toString();
      matsJson.back=$($('#'+item.orderNum+' .back-input')[tornIndex]).val();
      if(($($('#'+item.orderNum+' .back-input')[tornIndex]).val())<'0'){
        swal(
          '提交失败',
          '输入数量不能为负!',
          'error'
          );
        greaterThanZeroFlag=false;
      }
      matsJson.quesId=$($('.question-select')[tornIndex]).val();
      mats[tornIndex]=matsJson;
      
    });
    console.log(2);
    resultJson.mats=mats;
    
    result[index] = resultJson;
  });
json.result = result;
console.log("not ajax");

  // console.log(submitFlag);
  if(submitFlag&&greaterThanZeroFlag){
    submit(enteringStepNum,workNum,json);
    $("#underway_table").bootstrapTable('refresh');
  }
});

function submit(enteringStepNum,workNum,json){
  // console.log(enteringStepNum);
  // console.log(workNum);
  // console.log(json);
  $.ajax({
    url: url + "/doing/addResult.action",
    method: 'POST',
        // async:false,
        dataType: 'json',
        data: {
          str1: $('#orderNum').text(),
          str2: enteringStepNum,
          str3: workNum,
          str4: JSON.stringify(json),
          str5: 'normal'
        },
        success: function (result) {
          if (result.code === 0) {
            swal(
              '录入成功!',
              '',
              'success'
              );
            // console.log("ajax");
            // $('#inputResultModal').modal('hide');
          } else {
            swal(
              '录入失败!',
              result.msg,
              'error'
              );
            // $('#inputResultModal').modal('hide');
          }
        },
        error: function () {
          swal(
            '录入失败!',
            '网络错误!',
            'error'
            );
          // $('#inputResultModal').modal('hide');
        }
      });
}

let operatorResult;

let operatorStepNum;
//返修录入结果
$(document).on('click', '.back-input-result', function () {
  $("#operateModal").modal({
    backdrop: 'static'
  });
  //获取问题描述和工单号
  let jobNum = $(this).attr("jobNum");
  $("#operator_order_num").text(jobNum);
  $("#operator_description").text($(this).attr("descript"));
  operatorStepNum = $(this).attr("stepNum");
  //发送请求获取返修录入结果模板
  $.ajax({
    url: url + '/doing/getResultPageData.action',
    method: 'GET',
    dataType: 'json',
    data: {
      str1: operatorStepNum,
      str2: jobNum,
      str3: 'back'
    },
    success: function (result) {
      if (result.code === 0) {
        let data = result.data;
        operatorResult = data;
        //获取到finish数组
        let finish = data.finish;
        $.each(finish, function (finishIndex, finishItem) {
          let finishItem1 = $("<div class=\"form-group\">\n"
            + "                <label class=\"control-label col-md-3\">"+ finishItem.name +"：</label>\n"
            + "                <div class=\"col-md-7\">\n"
            + "                  <input class=\"form-control operator_finish_input\" type=\"number\" value=\"0\">\n"
            + "                </div>\n"
            + "              </div>");
          $("#operator_finish").append(finishItem1);
        });
        let torn = data.back;
        $.each(torn, function (tornIndex, tornItem) {
          $("#operator_torn").append("<div class=\"form-group\">\n"
            + "                <label class=\"control-label col-md-3\">"+ tornItem.name +"：</label>\n"
            + "                <div class=\"col-md-7\">\n"
            + "                  <input class=\"form-control operator_torn_input\" type=\"number\" value=\"0\"/>\n"
            + "                </div>\n"
            + "              </div>");
        });
      }
    }
  })
});

$(document).on('click', '#operator_confirm', function () {
  //清空
  let tornCommit = $("#tornCommit");
  let result = {};
  let json = {};
  result.productId = operatorResult.productId;
  result.orderId = operatorResult.orderId;
  result.orderNum = operatorResult.orderNum;
  result.goodsNum = operatorResult.goodsNum;
  result.goodsName = operatorResult.goodsName;
  let finish = [];
  let torn = [];
  $.each($('#operator_finish .operator_finish_input'), function (index, item) {
    let finishJson = {};
    finishJson.id = (operatorResult.finish)[index].id;
    finishJson.num = $(item).val();
    if (parseInt($(item).val()) > 0){
      finish.push(finishJson);
    }
  });
  $.each($('#operator_torn .operator_torn_input'), function (index, item) {
    let tornJson = {};
    tornJson.id = (operatorResult.back)[index].id;
    tornJson.origin = (operatorResult.back)[index].origin;
    tornJson.num = $(item).val();
    if (parseInt($(item).val()) > 0){
      torn.push(tornJson);
    }
  });
  result.finish = finish;
  result.torn = torn;
  result.tornCommit = tornCommit.val();
  json.result = result;
  $.ajax({
    url: url + "/doing/addResult.action",
    method: 'POST',
    dataType: 'json',
    data: {
      str1: $('#operator_order_num').text(),
      str2: operatorStepNum,
      str3: workNum,
      str4: JSON.stringify(json),
      str5: 'back'
    },
    success: function (result) {
      if (result.code === 0) {
        swal(
          '录入成功!',
          '',
          'success'
          );
        $("#operator_finish").empty();
        $("#operator_torn").empty();
        $('#operateModal').modal('hide');
      } else {
        swal(
          '录入失败!',
          result.msg,
          'error'
          );
        $('#operateModal').modal('hide');
      }
    },
    error: function () {
      swal(
        '录入失败!',
        '网络错误!',
        'error'
        );
      $('#operateModal').modal('hide');
    }
  });

});



