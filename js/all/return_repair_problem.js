
let roles=getQueryVariable("roles");
$(function () {
  $("#addForm").validate();
  if(roles === 0){
    $("#toolbar").remove();
    $('table').bootstrapTable({
      url:url2 + "/dataDict/getDict.action",
      method: 'post',
      pagination: true,
      search: false,
      dataType:'json',
      toolbar:'#toolbar',
      contentType: "application/x-www-form-urlencoded",
      striped:true,
      sidePagination:'client',
      queryParams:function(params){
        return{
          //method:"getRoles",
          str1:"ques",
          str2:15,
          str3:0
        }
      },
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
      }
      ]
    })

  }
  else
    $('table').bootstrapTable({
      url:url2 + "/dataDict/getDict.action",
      method: 'post',
      pagination: true,
      search: false,
      dataType:'json',
      toolbar:'#toolbar',
      striped:true,
      sidePagination:'client',
      pageSize:'15',
      pageList: [10, 25, 50, 100],
      showRefresh:false,
      dataField: "data",
      contentType: "application/x-www-form-urlencoded",
      mobileResponsive:true,
      useRowAttrFunc: true,
      queryParams:function(params){
        return{
          //method:"getRoles",
          str1:"ques",
          str2:15,
          str3:0
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

  //渲染按钮
  function actionFormatter(value,row, index) {
    let id = row.id;
    delete row.ability;
    delete row.createDate;
    let result = "";
    result += "<button class='btn btn-xs btn-primary editButton' role_id="+id+" title='修改'><span>修改</span></button>";
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

//模糊搜索
$(document).on('click',"#searchButton",function () {
  let searchIn=$("#search-input").val();
   var opt = {
    url: url2 +"/dataDict/getBlurDict.action",
    silent: true,
    query:{
      str1:"ques",
      str2:15,
      str3:0,
      str4:searchIn
    }
  };
  $("#table").bootstrapTable('refresh', opt);
  //console.log(searchIn);
  $("#search-input").val("");
});

//添加
function add(){
  if($("#addForm").valid())
    $.ajax({
      url:url2 + "/dataDict/addDict.action",
      dataType:"json",
      data:{
        //method:"addRoles",
        str1:"ques",
        str2:$("#name").val(),
        str3:$("#descript").val(),
        str4:""
        
      },
      success: function (result) {
        //console.log(result);
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
  let roleName=$(this).parent().prev().prev().text();
  //提示信息
  deletePrompt.append("您是否要删除返修问题:"+roleName);
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
      url: url2 + "/dataDict/delDict.action",
      //type: "post",
      dataType: "json",
      data: {
        //method: "delRoles",
        str1:"ques",
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
    backdrop: ''
  });
  //清空输入框
  $("#name").val("");
  $("#descript").val("");
});


//修改角色的id
let editRoleId;
//编辑角色
$(document).on('click','.editButton',function () {
  editRoleId=$(this).attr("role_id");
  $("#updateModal").modal({
    backdrop:'static'
  });
  //回显角色信息
  let roleName=$(this).parent().prev().prev().text();
  $("#newName").val(roleName);
  let roleDescription=$(this).parent().prev().text();
  $("#newDescript").val(roleDescription);
  let roleType=$(this).parent().prev().text();
  $("#newType").val(roleType);
});

//编辑模态框保存按钮绑定事件
$(document).on('click','#edit-save-button',function () {
  if($("#updateForm").validate().form()){
    $.ajax({
      url:url2 + "/dataDict/updateDict.action",
      dataType:"json",
      data:{
        //method:"updateRoles",
        str1:"ques",
        str2:$("#newName").val(),
        str3:$("#newDescript").val(),
        str4:"",
        str5:editRoleId
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

