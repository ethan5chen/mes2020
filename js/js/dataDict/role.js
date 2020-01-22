
let roles=getQueryVariable("roles");
$(function () {
  $("#addForm").validate();
  if(roles === 0){
    $("#toolbar").remove();
    $('#table').bootstrapTable({
      url:url + "/dataDict/getDict.action",
      method: 'post',
      pagination: true,
      search: false,
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
          str1:"role",
          str2:params.limit,
          str3:(params.offset/params.limit)+1,
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
        title: '名称',
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
    $('#table').bootstrapTable({
      url:url + "/dataDict/getDict.action",
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
          str1:"role",
          str2:params.limit,
          str3:(params.offset/params.limit)+1,
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
            str1:"role",
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
    result += "<button class='btn btn-xs btn-primary editButton' role_id="+id+" title='修改'><span>修改</span></button>";
    result += "<button class='btn btn-xs btn-danger deleteButton' useFlag="+row.isUsed+" role_id="+id+" title='删除'><span>删除</span></button>";
    result += "<button class='btn btn-xs btn-success set_up' role_id="+id+" title='设置'><span>设置权限</span></button>";
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


//添加
function add(){
  if($("#addForm").valid())
    $.ajax({
      url:url+"/dataDict/addDict.action",
      dataType:"json",
      data:{
        //method:"addRoles",
        str1:"role",
        str2:$("#name").val(),
        str3:$("#descript").val(),
        str4:"",
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
  let roleName=$(this).parent().prev().prev().text();
  //提示信息
  deletePrompt.append("您是否要删除角色:"+roleName);
});

//设置权限
var permission_setting_id;
$(document).on('click','.set_up',function(){
  permission_setting_id=$(this).attr("role_id");
  //console.log(permission_setting_id);
  $("#permission-setting-modal").modal({
    backdrop:'static',
  });
  //回显权限
  //判断是否有设置权限 若没有则字符串处理，若有则回显
  $.ajax({
    url:url+"/dataDict/getAbility.action",
    dataType:"json",
    type:'post',
    data:{
      str1:permission_setting_id
    },
    success: function (result) {
      //console.log(result);
      //重置复选框
      //console.log($("input"));
      $.each($("input"),function(index,item){
        item.checked=false;
      });
      //console.log(permission_setting_id);
      //console.log(result.data);
      var data=result.data;
      var isNullFlag=(!(data == "" || data == null || data == undefined));
      //console.log(isNullFlag);
        //如果result.data不为空，则回显，否则
        if(isNullFlag){
            //回显权限
            //先将获取的权限字符串拆开  1>1_0+2>1_1+4>1_0+7>1_1^2_0
            var data_splited=data.split("+");
            $.each(data_splited,function(index,item){
              if(item.substr(0, 1)<7){
                var item_value=item;//1>1_0
                $("#modal"+item_value.substr(0, 1)+"").prop("checked",true);
                $("input[name='radio"+item_value.substr(0, 1)+"']").each(function(index) {
                  var get_item_value=$("input[name='radio"+item_value.substr(0, 1)+"']").get(index).value;
                  if ( get_item_value == item_value) {
                    $("input[name='radio"+item_value.substr(0, 1)+"']").get(index).checked = true;
                  }
                });
              }else{
                //1>1_1+2>1_1+3>1_1+4>1_1+5>1_1+6>1_1+7>1_1^2_1^3_1^4_1^5_1^6_1^7_1^8_1^9_1^10_1^11_1^12_1
                $("#modal7").prop("checked",true);
                var item_splited_7=item.substr(2).split("^");
                // console.log(item_splited_7);
                $.each(item_splited_7,function(index,item){
                  var item_value=item;
                  $("#modal7-"+item_value.split("_")[0]+"").prop("checked",true);
                  $("input[name='radio7-"+item_value.split("_")[0]+"']").each(function(index) {
                    var get_item_value=$("input[name='radio7-"+item_value.split("_")[0]+"']").get(index).value;
                    console.log(get_item_value);
                    if ( get_item_value == item_value) {
                      // $("input[name='radio7-"+item_value.substr(0, 1)+"']").get(index).checked = true;
                      $("input[name='radio7-"+item_value.split("_")[0]+"']").get(index).checked = true;
                    }
                  });
                });
                
              }
            });

          }else if(result.code===1){
            swal(
              '获取权限失败!',
              result.msg,
              'error'
              );
          }
        },
        error: function () {
          swal(
            '获取权限失败!',
            '网络错误',
            'error'
            );
        }
      })
});
//
//权限设置

$(document).on('click',"#permission-setting-button",function(){
  //字符串处理
  var radioName;
  var permission_setting_parameter="";
  var permission_setting_parameter_all="";
  for(var i=1;i<7;i++){
    if($("#modal"+i+"").prop("checked")){
      radioName="radio"+i;
      permission_setting_parameter=$('input:radio[name='+radioName+']:checked').val();
      permission_setting_parameter_all+=permission_setting_parameter+"\+";
    }
  }
  if($("#modal7").prop("checked")){
    permission_setting_parameter_all=permission_setting_parameter_all+"7>";
    for(var i=1;i<13;i++){
      if($("#modal7-"+i+"").prop("checked")){
        radioName="radio7-"+i;
        permission_setting_parameter=$('input:radio[name='+radioName+']:checked').val();
        permission_setting_parameter_all+=permission_setting_parameter+"^";
      }
    }
  }
  permission_setting_parameter_all=permission_setting_parameter_all.substring(0,permission_setting_parameter_all.length-1);
  // console.log(permission_setting_parameter_all);
  $.ajax({
    url:url+"/dataDict/setAbility.action",
    dataType:"json",
    type:'post',
    data:{
      str1:permission_setting_id,
      str2:permission_setting_parameter_all
    },
    success: function (result) {
      if (result.code === 0) {
        $("#permission-setting-modal").modal("hide");
        swal(
          '设置成功!',
          result.msg,
          'success'
          );
      }else if(result.code===1){
        swal(
          '设置失败!',
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
      url: url+"/dataDict/delDict.action",
      dataType: "json",
      data: {
        //method: "delRoles",
        str1:"role",
        str2: deleteRoleId
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
      url:url+"/dataDict/updateDict.action",
      dataType:"json",
      data:{
        //method:"updateRoles",
        strId:editRoleId,
        str1:"role",
        str2:$("#newName").val(),
        str3:$("#newDescript").val(),
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


