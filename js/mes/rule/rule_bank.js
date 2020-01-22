$(function () {
  var roles = 1;
  if (roles === 0) {
    $("#toolbar").remove();
    $('table').bootstrapTable({
      url: url + '/rule/getRules.action',
      method: 'post',
      pagination: true,
      search: true,
      dataType: 'json',
      toolbar: '#toolbar',
      striped: true,
      sidePagination: 'server',
      pageSize: '15',
      pageList: [10, 25, 50, 100],
      showRefresh: true,
      dataField: "data",
      mobileResponsive: true,
      contentType: "application/x-www-form-urlencoded",
      useRowAttrFunc: true,
      pageNumber: 1,
      responseHandler:function(res){
        res.total=res.count;
        return res;
      },
      queryParams:function(params){
        return{
          str1:params.limit,
          str2:(params.offset/params.limit)+1,
        }
      },
      columns: [{
        field: 'id',
        title: '规则编号',
        sortable: true,
      },{
        field: 'name',
        title: '规则名称',
        sortable: true,
      }, {
        field: 'descript',
        title: '描述',
        sortable: true,
      }, {
        field: 'feature',
        title: '特征',
        sortable: true,
      }, {
        field: 'createDate',
        title: '时间',
        sortable: true,
      }
      ]
    })
  }
  $('#ruleTable').bootstrapTable({
    url: url + '/rule/getRules.action',
    method: 'post',
    pagination: true,
    search: true,
    dataType: 'json',
    toolbar: '#toolbar',
    striped: true,
    sidePagination: 'server',
    pageSize: '15',
    pageList: [10, 25, 50, 100],
    showRefresh: true,
    contentType: "application/x-www-form-urlencoded",
    dataField: "data",
    mobileResponsive: true,
    useRowAttrFunc: true,
    pageNumber: 1,
    responseHandler:function(res){
      res.total=res.count;
      return res;
    },
    queryParams:function(params){
      return{
        str1:params.limit,
        str2:(params.offset/params.limit)+1,
      }
    },
    columns: [{
      field: 'id',
      title: '规则编号',
      sortable: true,
    },{
      field: 'name',
      title: '规则名称',
      sortable: true,
    }, {
      field: 'descript',
      title: '描述',
      sortable: true,
    }, {
      field: 'feature',
      title: '特征',
      sortable: true,
    }, {
      field: 'createDate',
      title: '时间',
      sortable: true,
    },{
      field: 'null',
      title: '操作',
      formatter: actionFormatter,
    }
    ]
  });

  //渲染按钮
  function actionFormatter(value, row, index) {
    let id = row.id;
    let result = "";
    result += "<button class='btn btn-xs btn-primary viewRule'  rule_id=" + id
    + " title='预览'><span class='glyphicon glyphicon-eye-open'></span></button>";
    result += "  <button class='btn btn-xs btn-success editRule' rule_id="+id+" title='修改'><span class='glyphicon glyphicon-pencil'></span></button>";
    result += "  <button class='btn btn-xs btn-danger deleteRule' rule_id=" + id
    + " title='删除'><span class='glyphicon glyphicon-remove'></span></button>";
    return result;
  }

});

$(document).on('click','.editRule',function () {
  let ruleName=$(this).parent().prev().prev().prev().prev().prev().text();
  let ruleDescript=$(this).parent().prev().prev().prev().prev().text();
  let ruleFeature=$(this).parent().prev().prev().prev().text();
  let id = $(this).attr("rule_id").toString();
  // alert(id);
  window.location.href="editRule.html?id="+id;
});

//获取url中参数
function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  query = window.atob(query)
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return (false);
}

//需要删除的规则id
let deleteRuleId;
//删除要素
$(document).on('click', '.deleteRule', function () {
  let deletePrompt = $("#delete-prompt");
  //首先清空模态框的提示信息
  deletePrompt.empty();
  deleteRuleId = $(this).attr("rule_id");
  $("#delete-modal").modal({
    backdrop: 'static',
  });
  //回显需要删除的规则的名称
  let RuleName = $(this).parent().prev().prev().prev().prev().text();
  //提示信息
  deletePrompt.append("您是否要删除规则:" + RuleName);
});

//删除模态框确认按钮绑定事件
$(document).on('click', "#delete-confirm-button", function () {
  $.ajax({
    url: url + '/rule/delRules.action',
    method: 'post',
    dataType: "json",
    data: {
      str1: deleteRuleId.toString()
    },
    success: function (result) {
      if (result.code === 0) {
        swal(
          '删除成功!',
          result.msg,
          'success'
          );
        $("#delete-modal").modal("hide");
        //刷新表格
        $("#ruleTable").bootstrapTable('refresh');
      } else if (result.code === 1) {
        swal(
          '删除失败!',
          result.msg,
          'error'
          );
        $("#delete-modal").modal("hide");
      }
    },
    error: function () {
      swal(
        '删除失败!',
        '网络错误',
        'error'
        );
    }
  });
});

//预览
$(document).on('click', ".viewRule", function () {
  let rule_id = $(this).attr("rule_id");
  $.ajax({
    url: url + '/rule/getRuleStep.action',
    type: 'post',
    dataType: 'json',
    data: {
      str1: rule_id.toString()
    },
    success: function (result) {
      if (result.code === 0) {
        let stepInformationDiv = $("<div></div>");
        let information = result.data;
        let stepArray = information.steps;
        $.each(stepArray, function (index, item) {
          stepInformationDiv.append("<h3>第" + (index + 1) + "步</h3>");
          let stepInformation = $("<h5 class='text-left'></h5>");
          stepInformation.append(" <h5>" + "类型：" + item.type + "</h5>");
          stepInformation.append(" <h5>"+ item.note + "</h5>");
          let divRow = $("<div class='row'></div>");
          divRow.append("<div class='col-md-2'>" + "操作：" + "</div>");
          divRow.append("<div class='col-md-10'>" + item.show + "</div>");
          stepInformation.append(divRow);
          stepInformationDiv.append(stepInformation);
        });
        swal({
          title: '预览',
          html: stepInformationDiv[0],
        });
      } else {
        swal(
          '预览',
          result.msg,
          'error'
          );
      }
    },
    error: function () {
      swal(
        '预览',
        '网络错误，预览失败',
        'error'
        );
    }
  })
});