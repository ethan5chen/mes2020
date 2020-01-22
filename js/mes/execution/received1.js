let roles = getQueryVariable("roles");
let workNum = sessionStorage.getItem("workNum");
console.log(workNum);
console.log(roles);

var state = "进行中";//默认状态是进行中
let tableData;
let tableName="doing_table";
$(function(){
  ajaxData();
})
function ajaxData() {
  $.ajax({
    url: url + "/doing/getReceiveTasks.action",
    // url: mockUrl + "/getReceiveTasks",
    method: 'post',
    data: {
      str1: workNum,
      str2: state
    },
    dataType: 'json',
    success: function (result) {
      if (result.code === 0) {
        tableData = result.data;
        initTable(tableData,tableName);
        //判断权限
        // if (roles === 0) {
        //   initTableWithoutAuthority(tableData);
        // } else {
        //   initTableWithAuthority(tableData);
        // }
      }
    }
  });
}
$("#navigation a").click(function (e) {
  $("#secondary_module").attr("style","display:none;");
  // e.preventDefault();
  // $(this).tab("show");
  console.log($(this).index("a"));
  if ($(this).index("a") == 0) {
    state = "进行中";
    tableName="doing_table";
    // console.log(state);
  } else if ($(this).index("a") == 1) {
    state = "已完成";
    tableName= "done_table";
    // console.log(state);
  } else
  alert("选项卡错误");
  ajaxData();
});


function initTable(tableData, tableName) {
  console.log(state);
  $('#' + tableName).bootstrapTable({
    data: tableData,
    dataType: 'json',
    contentType: "application/x-www-form-urlencoded",
    mobileResponsive: true,
    useRowAttrFunc: true,
    columns: [{
      field: 'productId',
      title: '订单号',
      sortable: true,
    }, {
      field: 'orderName',
      title: '订单名',
      sortable: true,
    }, {
      field: 'stepName',
      title: '工序名',
      sortable: true,
    }, {
      field: 'progress',
      title: '进度',
      sortable: true,
    }, {
      field: 'null',
      title: '操作',
      formatter: actionFormatter,
    }
    ]
  });
  //渲染按钮
  function actionFormatter(value, row, index) {
    console.log(row);
    let result = "";
    let jobNum = row.jobNum;
    let orderName=row.orderName;
    let stepNum = row.stepId;
    let stepName = row.stepName;
    let stepDesc = row.stepDesc;
    let dwsId=row.dwsId;
    result += "<button class='btn btn-xs btn-primary taskDetail'    jobNum='" + jobNum + "' stepNum='" + stepNum + "' dwsId='"+dwsId+"' title='        任务详情'><span>任务详情</span></button>";
    result += "<button class='btn btn-xs btn-warning      check-input' stepNum='" + stepNum + "' stepDesc='" + stepDesc + "' orderName='" + orderName + "' stepName='" + stepName + "' dwsId='"+dwsId+"' title='查看录入'><span>查看录入</span></          button>";
    if (state == "进行中")
      result += "<button class='btn btn-xs btn-success input-result' stepNum='" + stepNum + "' stepDesc='" + stepDesc + "' jobNum='" + jobNum
    + "' stepName='" + stepName + "' dwsId='"+dwsId+"' title='录入结果'><span>录入结果</span></button>";
    return result;
  }
}

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
  var dwsId = $(this).attr('dwsId');
  $("#detailModal").modal({
    backdrop: 'static'
  });
  $.ajax({
    url: url + "/doing/getRecProDetail.action",
    method: 'post',
    data: {
      str1: dwsId
    },
    dataType: 'json',
    success: function (result) {
      if (result.code === 0) {
        let data = result.data;
        
        //获取工序名称
        let stepName = data.stepName;
        // let do_workName = data.do_workName;
        //获取备注
        let commit = data.commit;
        // let getJobNum = data.jobNum; 
        let productId = data.productId; 
        let orderName = data.orderName; 
        let results = data.results; 
        let equip = data.equip; 
        let descript = data.descript; 
        // $('#jobNum').text(getJobNum); //任务号
        $('#stepName').text(stepName);  //工序名
        $('#description').text(descript); //工序描述
        // $('#operator').text(do_workName); //操作人员
        $('#commit').text(commit); //任务备注
        $('#productId').text(productId);  //订单号
        $('#orderName').text(orderName); //订单名称：
        $('#results').text(results); //生产结果：
        $('#equip').text(equip); //设备名称：

        let environ=data.environ;
        let materials=data.materials;
        
        table_collection.append( "              <div id="+ "orderPanel" +" class=\" \">\n"
          + "                <div class=\"form-group\">\n"
          + "                  <label style=\"margin-bottom: 10px;margin-top: 5px\">分配物料：</label>\n"
          + "                  <table id='materials'></table>\n"
          + "                </div>\n"
          + "                <div class=\"form-group\" >\n"
          + "                  <label style=\"margin-bottom: 10px;margin-top: 5px\">加工环境：</label>\n"
          + "                  <table id=\"environ\" class=\"table table-bordered table-hover \"><tr><th>环境名</th><th>环境描述</th></tr></table>\n"
          + "                </div>\n"
          + "            </div>");

        $.each(environ, function(index, item) {
          $("#environ").append("<tr><td>"+item.name+"</td><td>"+item.descript+"</td></tr>");
        });

        $('#materials').bootstrapTable({
          data: materials,
          dataType:'json',
          striped:true,
          pageSize:'15',
          pageList: [10, 25, 50, 100],
          contentType: "application/x-www-form-urlencoded",
          mobileResponsive:true,
          useRowAttrFunc: true,
          columns:[{
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
          },{
            field:'name',
            title:'物料名',
            sortable:true,
          },{
            field:'amount',
            title:'分配总数量',
            sortable:true,
          },{
            field:'leftover',
            title:'剩余数量',
            sortable:true,
          }]
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

// $('#' + orderNum).bootstrapTable({
//   data: item.materials,
//   dataType: 'json',
//   striped: true,
//   pageSize: '15',
//   pageList: [10, 25, 50, 100],
//   contentType: "application/x-www-form-urlencoded",
//   mobileResponsive: true,
//   useRowAttrFunc: true,
//   columns: [{
//     field: 'productId',
//     title: '订单号',
//     sortable: true,
//   }, {
//     field: 'orderName',
//     title: '订单名',
//     sortable: true,
//   }, {
//     field: 'stepName',
//     title: '工序名',
//     sortable: true,
//   }, {
//     field: 'progress',
//     title: '进度',
//     sortable: true,
//   }, {
//     field: 'null',
//     title: '操作',
//     formatter: actionFormatter,
//   }
//   ]
// });




function emptyTorn() {
  $("#operator_finish").empty();
  $("#operator_torn").empty();
}

let data;
let result;
let finishMap = new Map();
let enteringStepNum;
//打开录入结果模态框并显示
$(document).on('click', '.input-result', function () {
  //清空$('#nav-tabs')
  $('#nav-tabs').empty();
  $("#tab-content").empty();
  //获取任务号，工序号
  let jobNum = $(this).attr('jobNum');
  let stepName = $(this).attr('stepName');
  let stepDesc = $(this).attr('stepDesc');
  enteringStepNum = $(this).attr('stepNum');
  var dwsId=$(this).attr('dwsId');
  $("#input-button").attr('dwsId',dwsId)
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
      str1: dwsId,
    },
    success: function (result) {
      if (result.code === 0) {
        data = result.data;
        // 首先将任务号 工序名，描述填入span中
        $('#orderNum').text(data.productId);
        $('#inputOrderName').text(data.ordername);
        $('#inputStepName').text(data.stepName);
        $('#inputDescription').text(data.stepDec);
        console.log(data);
        //首先获取到选项卡按钮集合
        let nav_tabs = $('#nav-tabs');
        //获取item的orderNum作为选项卡的id
        console.log(data);
        let orderNum = data.productId;
        finishMap.set(orderNum, data.finish);
        console.log(finishMap);
          //首先创建选项卡内容的div
          let tab_pane;
          tab_pane = $("<div   id='" + orderNum + "' class=\"tab-pane active\"></div>");
          //创建一个panel-body
          let panel_body = $("<div class=\"panel-body\"></div>");
          // let nextRow = $("                <div class=\"row\">\n"
          //   + "                  <div class=\"col-md-4 text-center\">\n"
          //   + "                    <label>订单号:</label>\n"
          //   + "                    <span>" + orderNum + "</span>\n"
          //   + "                  </div>\n"
          //   + "                  <div class=\"col-md-4 text-center\">\n"
          //   + "                    <label>工序名:</label>\n"
          //   + "                    <span>" + data.stepName + "</span>\n"
          //   + "                  </div>\n"
          //   + "                  <div class=\"col-md-4 text-center\">\n"
          //   + "                    <label>工序描述:</label>\n"
          //   + "                    <span>" + data.stepDec + "</span>\n"
          //   + "                  </div>\n"
          //   + "                </div>\n"
          //   + "                <hr>");
          // panel_body.append(nextRow);
          //创建完成row
          let finishId = orderNum + "_finish";
          let finishRow = $("                <div class=\"row\">\n"
            + "\n"
            + "                  <div class=\"col-md-12\">\n"
            + "                    <h1>完成数量：</h1>\n"
            + "                    <br>\n"
            + "                  </div>\n"
            + "                  <div class=\"col-md-12\">\n"
            + "                    <form class=\"form-horizontal\" id='" + finishId + "'>\n"
            + "                    </form>\n"
            + "                  </div>\n"
            + "                </div>");
          panel_body.append(finishRow);
          //创建破损row
          let tornId = orderNum + "_torn";
          let tornRow = $("                <div class=\"row\">\n"
            + "                  <div class=\"col-md-12\">\n"
            + "                    <h1>破损数量：</h1>\n"
            + "                    <br>\n"
            + "                  </div>\n"
            + "                  <div class=\"col-md-6\">\n"
            + "                    <form class=\"form-horizontal\" id='" + tornId + "'></form>\n"
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
            + "                  <form class=\"form-horizontal\" id='" + backId + "'></form>\n"
            + "                </div>\n"
            + "                <div class=\"col-md-6\">\n"
            + "                  <form class=\"form-horizontal\" id='" + questionId + "'></form>\n"
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
          // if (index === 0) {
          //   nav_tabs.append("<li class=\"active\"><a data-toggle=\"tab\" href='" + '#' + orderNum + "' aria-expanded=\"true\">订单号: " + orderNum + "</a>\n"
          //     + "</li>");
          // } else {
            nav_tabs.append("<li class=\"active\><a data-toggle=\"tab\" href='" + '#' + orderNum + "' aria-expanded=\"false\"></a>\n"
              + "</li>");
          //获取到finish字段数组
          let finish = data.finish;
          //遍历finish数组
          $.each(finish, function (finishIndex, finishItem) {
            let semiFinishId = finishItem.id + "_semiFinished_" + orderNum;
            $('#' + finishId).append("                      <div class=\"form-group\">\n"
              + "                        <label for=''" + semiFinishId + "'\n"
              + "                               class='control-label col-md-2 text-left'>" + finishItem.name + "：</label>\n"
              + "                        <div class=\"col-md-7\">\n"
              + "                          <input finishId='" + finishItem.id + "'  id='" + semiFinishId + "' class=\"form-control finish-input\" type=\"number\" value='" + 0 + "' min='0' required/>\n"
              + "                        </div>\n"
              + "                      </div>");
          });


          //获取到ques数组

          let question = data.ques;
          let singleSelect = $("<select class='form-control question-select'></select>");
          $.each(question, function (questionIndex, questionItem) {
            singleSelect.append("<option  value=" + questionItem.id + ">" + questionItem.name + "</option>");
          });



          let selectFormDiv = $("<div class='form-group'></div>");
          let selectLabel = $("<label class='col-md-4'>问题类型选择：</label>");
          let divCol8 = $("<div class='col-md-8'></div>");
          divCol8.append(singleSelect);
          selectFormDiv.append(selectLabel).append(divCol8);


          //获取到torn_back数组
          let torn_back = data.torn_back;
          $.each(torn_back, function (torn_backIndex, torn_backItem) {
            let torn_id = torn_backItem.id + "_torn_" + orderNum;
            let back_id = torn_backItem.id + "_back_" + orderNum;
            $('#' + tornId).append("                      <div class=\"form-group\">\n"
              + "                        <label for='" + torn_id + "' class=\"col-md-3 control-label\">" + torn_backItem.name + "：</label>\n"
              + "                        <div class=\"col-md-9\">\n"
              + "                          <input torn_backId='" + torn_backItem.id + "' origin='" + torn_backItem.origin + "'  id='" + torn_id + "' type=\"number\" class=\"form-control torn-input\" value='" + 0 + "'min='0' required/>\n"
              + "                        </div>\n"
              + "                      </div>");
            $('#' + backId).append("                      <div class=\"form-group\">\n"
              + "                        <label for='" + back_id + "' class=\"col-md-3 control-label\">" + torn_backItem.name + "：</label>\n"
              + "                        <div class=\"col-md-9\">\n"
              + "                          <input torn_backId='" + torn_backItem.id + "' origin='" + torn_backItem.origin + "'  id='" + back_id + "' type=\"number\" class=\"form-control back-input\" value='" + 0 + "' min='0'required/>\n"
              + "                        </div>\n"
              + "                      </div>");
            $('#' + questionId).append(selectFormDiv.clone());
          });

        }
      }
    });
});

// 打开录入查看模态框并显示
$(document).on('click', '.check-input', function () {
  $("#cheak_input").bootstrapTable('destroy');
  var orderName = $(this).attr('orderName');
  var dwsId=$(this).attr('dwsId');
  $(".cheak_input_title").text('工单' + orderName + '的录入详情：');
  // $("#cheak_input").empty();
  $("#secondary_module").show();

  $("#cheak_input").bootstrapTable({
    url: url + '/doing/getSubmitRecord.action',
    dataType: 'json',
    method: 'post',
    dataField: "data",
    striped: true,
    pagination: true,
    pageSize: '5',
    pageList: [10, 25, 50, 100],
    contentType: "application/x-www-form-urlencoded",
    mobileResponsive: true,
    useRowAttrFunc: true,
    queryParams: function (params) {
      return {
        str1: dwsId,
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



  function cheakformatter(value, row, index) {
    var times = row.times;
    var normals = row.normals;
    var backs = row.backs;
    var torns = row.torns;
    var result = "";
    result += "<button class='btn btn-xs btn-primary checkButton' dwsId='" + dwsId + "'  times='" + times + "' normals=" + normals + " backs=" + backs + " torns=" + torns + " title='录入详情'><span>录入详情</span></button>";
    return result;
  }
});

$(document).on('click', '.checkButton', function () {
  var jobNum = $(this).attr("jobNum");
  var dwsId = $(this).attr("dwsId");
  var times = $(this).attr("times");
  var normals = $(this).attr("normals");
  var backs = $(this).attr("backs");
  var torns = $(this).attr("torns");
  $.ajax({
    url: url + '/doing/getSRDetail.action',
    method: 'post',
    dataType: 'json',
    data: {
      str1: dwsId,
      str2: times,
      str3: normals,
      str4: backs,
      str5: torns
    },
    success: function (result) {
      $('#checkInputModalFinish').bootstrapTable("destroy");
      $('#checkInputModalTorn').bootstrapTable("destroy");
      $('#checkInputModalBack').bootstrapTable("destroy");
      $('#checkInputModal').modal({
        backdrop: 'static'
      });
      console.log(result.data);
      var data = result.data;
      $('#checkInputModalProductId').text(data.productId);
      $('#checkInputModalStepName').text(data.stepName);
      $('#checkInputModalOrderName').text(data.orderName);
      $('#checkInputModalFinish').bootstrapTable({
        data: data.finish,
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
      if((data.torn.length)>0){
        $('#checkInputModalTorn').bootstrapTable({
          data: data.torn,
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
        $('#checkInputModalTornCommit').text(data.tornCommit);
      }else{
        $('#checkInputModalTornCommit').parent().remove();
      }

      if((data.back.length)>0){
        $('#checkInputModalBack').bootstrapTable({
          data: data.back,
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
        $('#checkInputModalBackCommit').text(data.backCommit);
      }else{
        $('#checkInputModalBackCommit').parent().remove();
      }

    }
  });
});

//删除录入详情div按钮
$(document).on('click', '#del-a', function () {
  $("#secondary_module").hide();
});

//录入确认按钮
$(document).on('click', '#input-button', function () {

  var dwsId=$(this).attr('dwsId');
  let json = {};
  let isFinishZreo = [];
  let isTornZreo = [];
  let isBackZreo = [];
  let submitFlag = true;
  let greaterThanZeroFlag = true;
  //修改data（已经有了finishmap的关系）
  console.log(data);
    //计算比例关系逻辑
    //获取材料的剩余数量和id的MAP
    // console.log(data);
    var leftMats = new Map();
    $.each(data.torn_back, function (leftMatsIndex, leftMatsItem) {
      leftMats.set(leftMatsItem.id, leftMatsItem.leftover);
    });
    // console.log(leftMats);
    //不可完成数量
    var breakNum = new Map();
    var nounNum = new Map();
    //获取已经完成破损和退换的数量
    $.each(data.finish, function (verifyIndex, verifyItem) {
      // console.log(verifyItem);
      var formulas = $.parseJSON(verifyItem.formulas);;
      //用户填写的实际分配数量和实际分配比率数量
      var finishNum = $("#" + verifyItem.id + "_semiFinished_" + data.productId).val();
      var finishRate = verifyItem.rates;
      var RatioFinishNum = parseInt(finishNum) / parseInt(finishRate);
      // console.log(finishNum);
      var Ratio = 0;
      var maxRatio = 0;
      var CanFinishNum = 10000000000;
      var maxCanFinishNum = 0;
      console.log(formulas);
      for (var i = 0; i < formulas.length; i++) {
        //获取当前材料最的最大比率
        var Num = parseInt($("#" + formulas[i].num + "_torn_" + data.productId).val()) + parseInt($("#" + formulas[i].num + "_back_" + data.productId).val());
        var Rate = parseInt(formulas[i].rates);
        maxRatio = Math.max(Ratio, Num / Rate);
        Ratio = maxRatio;
        breakNum.set(verifyItem.id, maxRatio * finishRate);

        //找出比如AB两种材料在生成两种半成品的公式中相对大的那个值
        var max = 0;
        if (nounNum.get(formulas[i].num) == null) {
          max = Math.max(0, (Rate * parseInt(finishNum)) / parseInt(finishRate));
        } else {
          max = Math.max(nounNum.get(formulas[i].num), (Rate * parseInt(finishNum)) / parseInt(finishRate));
        }
        nounNum.set(formulas[i].num, max);
        console.log(nounNum);
        //获取当前材料的可分配的数量
        // console.log(parseInt(leftMats.get(formulas[i].num))/Rate);
        maxCanFinishNum = Math.min(CanFinishNum, parseInt(leftMats.get(formulas[i].num)) / Rate);
        CanFinishNum = maxCanFinishNum;
        // console.log(maxCanFinishNum);
      }
      //比较如果可完成最大数量-材料最大比率<=用户实际分配的数量  则说明用户分配的实际数额大，分配失败
      // console.log(maxCanFinishNum-maxRatio);
      // console.log(RatioFinishNum);
      if ((maxCanFinishNum - maxRatio) < RatioFinishNum) {
        swal(
          '提交失败',
          '提交数量超出最大值!',
          'error'
          );
        submitFlag = false;
      } else {
        submitFlag = true;
      }

    });
    let resultJson = {};
    resultJson.productId = data.productId;
    resultJson.stepId = enteringStepNum;
    resultJson.tornCommit = $('#' + data.productId + ' .letter_of_presentation_broken').val();
    resultJson.backCommit = $('#' + data.productId + ' .letter_of_presentation_repair').val();
    var finish = [];
    var mats = [];
    var finishIndexI = 0;
    console.log(0);
    console.log($('#' + data.productId + ' .finish-input'));
    $.each($('#' + data.productId + ' .finish-input'), function (finishIndex, finishItem) {
      console.log(3);
      let finishJson = {};
      finishJson.id = data.finish[finishIndex].id;
      if (($(finishItem).val()) <= '0') {
        swal(
          '提交失败',
          '输入数量错误!',
          'error'
          );
        greaterThanZeroFlag = false;
      }
      finishJson.num = $(finishItem).val();
      finishJson.break = (breakNum.get($(finishItem).attr("finishid"))).toString();
      isFinishZreo[finishIndex] = parseInt($(finishItem).val()) > 0;
      if (isFinishZreo[finishIndex]) {
        finish[finishIndexI] = finishJson;
        finishIndexI++;
      }
    });
    console.log(finish);
    resultJson.finish = finish;
    //将mats数据塞进去，还要塞使用的数量（要从完成数量中获取再根据比率计算）
    console.log($('#' + data.productId + ' .torn-input'));
    $.each($('#' + data.productId + ' .torn-input'), function (tornIndex, tornItem) {
      console.log(4);
      let matsJson = {};
      matsJson.id = $(tornItem).attr("torn_backid");
      matsJson.origin = $(tornItem).attr("origin");
      if (($(tornItem).val()) < '0') {
        swal(
          '提交失败',
          '输入数量不能为负!',
          'error'
          );
        greaterThanZeroFlag = false;
      }
      matsJson.torn = $(tornItem).val();
      console.log((nounNum));
      console.log(($(tornItem).attr("torn_backid")));
      console.log((nounNum.get($(tornItem).attr("torn_backid"))));
      matsJson.used = (nounNum.get($(tornItem).attr("torn_backid"))).toString();
      matsJson.back = $($('#' + data.productId + ' .back-input')[tornIndex]).val();
      if (($($('#' + data.productId + ' .back-input')[tornIndex]).val()) < '0') {
        swal(
          '提交失败',
          '输入数量不能为负!',
          'error'
          );
        greaterThanZeroFlag = false;
      }
      matsJson.quesId = $($('.question-select')[tornIndex]).val();
      mats[tornIndex] = matsJson;

    });
    console.log(2);
    resultJson.mats = mats;
    json.result = resultJson;
    console.log("not ajax");

    if (submitFlag && greaterThanZeroFlag) {
      submit(dwsId, json);
      // $("#underway_table").bootstrapTable('refresh');
    }
    
  });

function submit( dwsId, json) {
  console.log(dwsId);
  console.log(json);
  $.ajax({
    url: url + "/doing/addResult.action",
    method: 'POST',
    // async:false,
    dataType: 'json',
    data: {
      str1: dwsId,
      str2: JSON.stringify(json),
    },
    success: function (result) {
      if (result.code === 0) {
        swal(
          '录入成功!',
          '',
          'success'
          ).then(
            //页面刷新
            function(){
              location.reload();
            });;
        // alert("111");

        // console.log("ajax");
        $('#inputResultModal').modal('hide');
      } else {
        swal(
          '录入失败!',
          result.msg,
          'error'
          );
        $('#inputResultModal').modal('hide');
      }
    },
    error: function () {
      swal(
        '录入失败!',
        '网络错误!',
        'error'
        );
      $('#inputResultModal').modal('hide');
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
  //获取问题描述和任务号
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
            + "                <label class=\"control-label col-md-3\">" + finishItem.name + "：</label>\n"
            + "                <div class=\"col-md-7\">\n"
            + "                  <input class=\"form-control operator_finish_input\" type=\"number\" value=\"0\">\n"
            + "                </div>\n"
            + "              </div>");
          $("#operator_finish").append(finishItem1);
        });
        let torn = data.back;
        $.each(torn, function (tornIndex, tornItem) {
          $("#operator_torn").append("<div class=\"form-group\">\n"
            + "                <label class=\"control-label col-md-3\">" + tornItem.name + "：</label>\n"
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
    if (parseInt($(item).val()) > 0) {
      finish.push(finishJson);
    }
  });
  $.each($('#operator_torn .operator_torn_input'), function (index, item) {
    let tornJson = {};
    tornJson.id = (operatorResult.back)[index].id;
    tornJson.origin = (operatorResult.back)[index].origin;
    tornJson.num = $(item).val();
    if (parseInt($(item).val()) > 0) {
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



