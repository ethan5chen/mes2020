
let roles=getQueryVariable("roles");
$(function () {
  $("#addForm").validate();
  if(roles === 0){
    $("#toolbar").remove();
    $('table').bootstrapTable({
      url:url + "/dataDict/getDict.action",
      method: 'post',
      pagination: true,
      search: true,
      dataType:'json',
      toolbar:'#toolbar',
      contentType: "application/x-www-form-urlencoded",
      striped:true,
      sidePagination:'server',
      pageNumber: 1,
      responseHandler:function(res){
        res.total=res.count;
        return res;
      },
      queryParams:function(params){
        return{
          str1:"technology",
          str2:params.limit,
          str3:(params.offset/params.limit)+1,
        }
      },
      pageSize:'15',
      pageList: [10, 25, 50, 100],
      showRefresh:true,
      dataField: "data",
      mobileResponsive:true,
      useRowAttrFunc: true,
      columns:[{
        field:'wnName',
        title:'生成名词名',
        sortable:true,
      },{
        field:'stepName',
        title:'工序名',
        sortable:true,
      },{
        field:'etName',
        title:'机器类型名',
        sortable:true,
      },{
        field:'param',
        title:'工艺参数',
        sortable:true,
      }
      ]
    })

  }
  else
    $('table').bootstrapTable({
      url:url + "/dataDict/getDict.action",
      method: 'post',
      pagination: true,
      search: true,
      dataType:'json',
      toolbar:'#toolbar',
      striped:true,
      pageSize:'15',
      pageList: [10, 25, 50, 100],
      showRefresh:true,
      dataField: "data",
      contentType: "application/x-www-form-urlencoded",
      mobileResponsive:true,
      useRowAttrFunc: true,
      sidePagination:'server',
      pageNumber: 1,
      responseHandler:function(res){
        res.total=res.count;
        return res;
      },
      queryParams:function(params){
        return{
          str1:"technology",
          str2:params.limit,
          str3:(params.offset/params.limit)+1,
        }
      },
      columns:[{
        field:'wnName',
        title:'生成名词名',
        sortable:true,
      },{
        field:'stepName',
        title:'工序名',
        sortable:true,
      },{
        field:'etName',
        title:'机器类型名',
        sortable:true,
      },{
        field:'param',
        title:'工艺参数',
        sortable:true,
      },{
        field:'null',
        title:'操作',
        formatter:actionFormatter,
      }
      ]
    });

  //模糊搜索
  $(document).on('click',"#searchButton",function () {
    let searchIn=$("#search-input").val();
    $('#table').bootstrapTable('destroy')
    $('#table').bootstrapTable({
      url: url+"/dataDict/getBlurDict.action",
      method: 'post',
      pagination: true,
      search: false,
      dataType:'json',
      toolbar:'#toolbar',
      striped:true,
      pageSize:'15',
      pageList: [10, 25, 50, 100],
      showRefresh:false,
      dataField: "data",
      contentType: "application/x-www-form-urlencoded",
      mobileResponsive:true,
      useRowAttrFunc: true,
      sidePagination:'server',
      pageNumber: 1,
      responseHandler:function(res){
        res.total=res.count;
        return res;
      },
      queryParams:function(params){
        return{
          str1:"workType",
          str2:params.limit,
          str3:(params.offset/params.limit)+1,
          str4:searchIn
        }
      },
      columns:[{
        field: 'name',
        title: '名称',
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
    });
    $("#search-input").val("");
  });

  //渲染按钮
  function actionFormatter(value,row, index) {
    let id = row.id;
    delete row.ability;
    delete row.createDate;
    let result = "";
    result += "<button class='btn btn-xs btn-primary editButton' row='"+JSON.stringify(row)+"' role_id="+id+" title='修改'><span>修改</span></button>";
    result += "<button class='btn btn-xs btn-danger deleteButton' useFlag="+row.isUsed+" role_id="+id+" title='删除'><span>删除</span></button>";
    return result;
  }

});

//获取url中的参数
function getQueryVariable(variable)
{
  var query = window.location.search.substring(1);
  query=window.atob(query);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if(pair[0] === variable){return pair[1];}
  }
  return(false);
}
//生产要素下拉框
function getNoun(wnId){
  $('#'+wnId).empty();
  $.ajax({
    url:url+"/dataDict/getDict.action",
    type: 'POST',
    dataType: 'json',
    data: {
      str1:'noun',
      str2:0,
      str3:0,
    },
    success:function(result){
      data=result.data;
      $.each(data, function(index, val) {
        $('#'+wnId).append("<option value="+val.id+">"+val.name+"</option>");
      });
    }
  });
}
//生成设备下拉框
function getEquipType(etId){
  $('#'+etId).empty();
  $.ajax({
    url:url+"/dataDict/getDict.action",
    type: 'POST',
    dataType: 'json',
    data: {
      str1:'equipType',
      str2:0,
      str3:0,
    },
    success:function(result){
      data=result.data;
      $.each(data, function(index, val) {
        $('#'+etId).append("<option value="+val.id+">"+val.name+"</option>");
      });
    }
  });
}

//生成工序下拉框
function getStep(stepId){
  $('#'+stepId).empty();
  $.ajax({
    url:url+"/dataDict/getDict.action",
    type: 'POST',
    dataType: 'json',
    data: {
      str1:'step',
      str2:0,
      str3:0,
    },
    success:function(result){
      data=result.data;
      $.each(data, function(index, val) {
        $('#'+stepId).append("<option value="+val.id+">"+val.name+"</option>");
      });
    }
  });
}

//添加
function add(){
  if($("#addForm").valid())
    $.ajax({
      url:url+"/dataDict/addTechnology.action",
      dataType:"json",
      data:{
        str1:$("#wnId").val(),
        str2:$("#stepId").val(),
        str3:$("#etId").val(),
        str4:$("#param").val()
      },
      success: function (result) {
        if (result.code === 0) {
          $("#addModal").modal("hide");
          swal(
            '添加成功!',
            result.msg,
            'success'
            );
          $("#table").bootstrapTable('refresh');
        }else if(result.code===1){
          swal(
            '添加失败!',
            result.msg,
            'error'
            );
        }
      },
      error: function () {
        swal(
          '添加失败!',
          '网络错误',
          'error'
          );
      }
    })
}


//需要删除的属性id
let deleteRoleId;
//删除属性
$(document).on('click','.deleteButton',function () {
  let deletePrompt=$("#delete-prompt");
  //首先清空模态框的提示信息
  deletePrompt.empty();
  deleteRoleId=$(this).attr("role_id");
  $("#delete-modal").modal({
    backdrop: 'static',
  });
  //回显需要删除的属性的名称
  let roleName=$(this).parent().prev().prev().prev().prev().text();
  //提示信息
  deletePrompt.append("您是否要删除工艺参数:"+roleName);
});

//删除模态框确认按钮绑定事件
$(document).on('click',"#delete-confirm-button",function () {
  let useFlag=$(".deleteButton[role_id="+deleteRoleId+"]");
  if (useFlag.attr("useFlag") === "true"){
    swal(
      '该角色已使用,无法删除!',
      '',
      'error'
      );
    $("#delete-modal").modal("hide");
  }else {
    $.ajax({
      url: url+"/dataDict/delDict",
      dataType: "json",
      data: {
        //method: "delRoles",
        str1:"technology",
        str2: deleteRoleId,
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
          $("#table").bootstrapTable('refresh');
        }else if (result.code===1){
          swal(
            '删除失败!',
            result.msg,
            'error'
            );
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
  }
});


//添加模态框
$(document).on('click',"#add-a",function () {
  $("#addModal").modal({
    backdrop:'static'
  });
  //清空输入框
  $("#wnId").val("");
  $("#stepId").val("");
  $("#etId").val("");
  $("#param").val("");
  var wnId="wnId";
  getNoun(wnId);
  var stepId="stepId";
  getStep(stepId);
  var etId="etId";
  getEquipType(etId);
});


//修改角色的id
let editRoleId;
//编辑角色
$(document).on('click','.editButton',function () {
  editRoleId=$(this).attr("role_id");
  var row=$(this).attr("row");
  row=$.parseJSON(row);
  $("#updateModal").modal({
    backdrop:'static'
  });
  var wnId="newWnId";
  getNoun(wnId);
  var stepId="newStepId";
  getStep(stepId);
  var etId="newEtId";
  getEquipType(etId);
  //回显角色信息
  setTimeout(function(){
    $("#newWnId").val(row.wnId);
    $("#newStepId").val(row.stepId);
    $("#newEtId").val(row.etId);
    $("#newParam").val(row.param);
  },100);
  
});

//编辑模态框保存按钮绑定事件
$(document).on('click','#edit-save-button',function () {
  if($("#updateForm").validate().form()){
    $.ajax({
      url:url+"/dataDict/updateTechnology.action",
      dataType:"json",
      type:'post',
      data:{
        //method:"updateRoles",
        strId:editRoleId,
        str1:$("#newWnId option:selected").val(),
        str2:$("#newStepId option:selected").val(),
        str3:$("#newEtId option:selected").val(),
        str4:$("#newParam").val(),
        
      },
      success:function(result){
        if (result.code === 0) {
          swal(
            '修改成功!',
            result.msg,
            'success'
            );
          $("#updateModal").modal("hide");
          $("#table").bootstrapTable('refresh');
        }else if (result.code === 1) {
          swal(
            '修改失败!',
            result.msg,
            'error'
            );
        }
      },
      error:function () {
        swal(
          '修改失败!',
          '网络错误',
          'error'
          );
      }
    });
  }
});



























