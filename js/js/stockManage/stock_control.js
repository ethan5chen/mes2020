
let roles=getQueryVariable("roles");
$(function () {
  $("#addForm").validate();
  if(roles === 0){
    $("#toolbar").remove();
    $('#table').bootstrapTable({
      url: url+"/restore/getRestore.action",
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
        var selectInfo=$("#selectInfo option:selected").val();
        //console.log(selectInfo);
        return{
          str1:selectInfo,
          str2:params.limit,
          str3:(params.offset/params.limit)+1,
        }
      },
      pageSize:'4',
      pageList: [10, 25, 50, 100],
      showRefresh:false,
      dataField: "data",
      mobileResponsive:true,
      useRowAttrFunc: true,
      columns:[{
        field: 'id',
        title: 'ID',
        sortable: true,
      },{
        field:'name',
        title:'名称',
        sortable:true,
      },{
        field:'num',
        title:'总数量',
        sortable:true,
      }
      ]
    })

  }
  else
    $('#table').bootstrapTable({
      url: url+"/restore/getRestore.action",
      method: 'post',
      pagination: true,
      search: false,
      dataType:'json',
      toolbar:'#toolbar',
      striped:true,
      pageSize:'4',
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
        var selectInfo=$("#selectInfo option:selected").val();
        console.log(params);
        return{
          str1:selectInfo,
          str2:params.limit,
          str3:(params.offset/params.limit)+1,
        }
      },
      columns:[{
        field: 'id',
        title: 'ID',
        sortable: true,
      },{
        field:'name',
        title:'名称',
        sortable:true,
      },{
        field:'num',
        title:'总数量',
        sortable:true,
      }
      ]
    });


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
//属性设置
function Set(id) {
  window.location.href="permission_set.html?id="+id
}

//模糊搜索
$(document).on('click',"#searchButton",function () {
  let searchIn=$("#search-input").val();
  var opt = {
    url: url+"/restore/getBlurRestore.action",
    silent: true,
    query:{
      str1:$("#selectInfo option:selected").val(),
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

    //获取经办人id

  $.ajax({
    url:url+"/restore/addRestore.action",
    dataType:"json",
    data:{
      str1:$("#original_material_name option:selected").val(),
      str2:$("#operator option:selected").val(),
      str3:$("#quantity").val(),
      str4:$("#remark").val()
    },
    success: function (result) {
        //console.log("2:"+result.data);
        if (result.code === 0) {
          $("#addModal").modal("hide");
          $("#original_material_name").empty();
          $("#operator").empty();
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


//add模块取消按钮触发 清空select菜单时间
function cancel(){
  $("#original_material_name").empty();
  $("#operator").empty();
}

// //删除模态框确认按钮绑定事件
// $(document).on('click',"#delete-confirm-button",function () {
//   let useFlag=$(".deleteButton[role_id="+deleteRoleId+"]");
//   if (useFlag.attr("useFlag") === "true"){
//     swal(
//       '该角色已使用,无法删除!',
//       '',
//       'error'
//       );
//     $("#delete-modal").modal("hide");
//   }else {
//     $.ajax({
//       url: url,
//       dataType: "json",
//       data: {
//         method: "delRoles",
//         id: deleteRoleId,
//       },
//       success: function (result) {
//         if (result.code === 0) {
//           swal(
//             '删除成功!',
//             result.msg,
//             'success'
//             );
//           $("#delete-modal").modal("hide");
//           //刷新表格
//           $("#table").bootstrapTable('refresh');
//         }else if (result.code===1){
//           swal(
//             '删除失败!',
//             result.msg,
//             'error'
//             );
//         }
//       },
//       error: function () {
//         swal(
//           '删除失败!',
//           '网络错误',
//           'error'
//           );
//       }
//     });
//   }
// });


//添加模态框
$(document).on('click',"#add-a",function () {
  $("#addModal").modal({
    backdrop:'static'
  });
  //清空输入框
  $("#operator").val("");
  $("#original_material_name").val("");
  $("#quantity").val("");
  $("#remark").val("");
     //获取原材料id
     $.ajax({
      url:url+"/dataDict/getNounByType.action",
      dataType:"json",
      data:{
        str1:"origin"
      },
      success: function (result) {
        if (result.code === 0) {
        //$("#addModal").modal("hide");
        //console.log(result.data);
        var data=result.data;
        $("#original_material_name").append('<option value="">请选择</option>');
        for(var i in data){
          $("#original_material_name").append('<option value="'+data[i].id+'">'+data[i].name+'</option>');
        }
      }else if(result.code===1){
        swal(
          '获取数据失败!',
          result.msg,
          'error'
          );
      }
    },
    
  });

     //获取经办人id
     $.ajax({
      url:url+"/staff/getSimpleStaff.action",
      dataType:"json",
    // data:{
    //   str1:"origin"
    // },
    success: function (result) {
      if (result.code === 0) {
        //$("#addModal").modal("hide");
        //console.log(result.data);
        var data=result.data;
        $("#operator").append('<option value="">请选择</option>');
        for(var i in data){
          $("#operator").append('<option value="'+data[i].id+'">'+data[i].name+'</option>');
        }
      }else if(result.code===1){
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
   });


// //修改角色的id
// let editRoleId;
// //编辑角色
// $(document).on('click','.editButton',function () {
//   editRoleId=$(this).attr("role_id");
//   $("#updateModal").modal({
//     backdrop:'static'
//   });
//   //回显角色信息
//   let roleName=$(this).parent().prev().prev().prev().text();
//   $("#newName").val(roleName);
//   let roleDescription=$(this).parent().prev().prev().text();
//   $("#newDescript").val(roleDescription);
//   let roleType=$(this).parent().prev().text();
//   $("#newType").val(roleType);
// });

// //编辑模态框保存按钮绑定事件
// $(document).on('click','#edit-save-button',function () {
//   if($("#updateForm").validate().form()){
//     $.ajax({
//       url:url,
//       dataType:"json",
//       data:{
//         method:"updateRoles",
//         id:editRoleId,
//         name:$("#newName").val(),
//         type:$("#newType").val(),
//         descript:$("#newDescript").val()
//       },
//       success:function(result){
//         if (result.code === 0) {
//           swal(
//             '修改成功!',
//             result.msg,
//             'success'
//             );
//           $("#updateModal").modal("hide");
//           $("#table").bootstrapTable('refresh');
//         }else if (result.code === 1) {
//           swal(
//             '修改失败!',
//             result.msg,
//             'error'
//             );
//         }
//       },
//       error:function () {
//         swal(
//           '修改失败!',
//           '网络错误',
//           'error'
//           );
//       }
//     });
//   }
// });

