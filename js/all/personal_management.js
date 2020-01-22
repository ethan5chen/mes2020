let roles = getQueryVariable("roles");
$(function () {
  if (roles === 0) {
    $("#toolbar").remove();
    $('#table').bootstrapTable({
      url: url+"/staff/getStaff.action",
      method: 'post',
      pagination: true,
      search: false,
      dataType: 'json',
      toolbar: '#toolbar',
      striped: true,
      contentType: "application/x-www-form-urlencoded",
      sidePagination: 'client',
      queryParams: function (params) {
        return {
          str1: 15,
          str2: 0
        }
      },
      pageSize: '15',
      pageList: [10, 25, 50, 100],
      showRefresh: false,
      dataField: "data",
      mobileResponsive: true,
      useRowAttrFunc: true,
      columns: [{
        field: 'workNum',
        title: '工号',
        sortable: true,
      }, {
        field: 'name',
        title: '姓名',
        sortable: true,
      }, {
        field: 'sex',
        title: '性别',
        sortable: true,
      }, {
        field: 'birth',
        title: '出生日期',
        sortable: true,
      }, {
        field: 'phone',
        title: '手机号',
        sortable: true,
      }, {
        field: 'entryDate',
        title: '入职时间',
        sortable: true,
      }, {
        field: 'descript',
        title: '描述',
        sortable: true,
      }
      ]
    })

  }
  else {
    let icon = "<i class='fa fa-times-circle'></i>  ";
    //身份证号码验证
    jQuery.validator.addMethod("isIdNum",function (value, element) {
      let idNum=/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      return this.optional(element) || (idNum.test(value));
    },"请正确填写身份证号码");
    //手机号码验证
    jQuery.validator.addMethod("isMobile", function(value, element) {
      let length = value.length;
      let mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
      return this.optional(element) || (length === 11 && mobile.test(value));
    }, "请正确填写手机号码");
    $("#addForm").validate({
      rules: {
        phone: {
          required: true,
          isMobile : true
        },
        cardNum:{
          required:true,
          isIdNum:true
        }
      },
      messages: {
        sex: {
          required: icon + '请选择性别'
        },
        birth: {
          required: icon + '请正确填写日期'
        },
        entryDate: {
          required: icon + '请正确填写日期'
        },
        img: {
          required: icon + '请选择照片'
        },
        phone: {
          required: "请填写手机号码",
          isMobile : "请正确填写手机号码"
        },
        cardNum:{
          required:"请填写身份证号码",
          isIdNum: "请正确填写身份证号码"
        }

      },
      errorPlacement: function (error, element) { //指定错误信息位置
        if (element.is(':radio') || element.is(':checkbox')) { //如果是radio或checkbox
          var eid = element.attr('name'); //获取元素的name属性
          error.appendTo(element.parent()); //将错误信息添加当前元素的父结点后面
        } else {
          error.insertAfter(element);
        }
      },
      submitHandler: function (form) {
        form.submit();
        $("#addModal").modal("hide");
        swal(
          '添加成功！',
          '',
          'success'
          );
        setTimeout(function () {
          $("#table").bootstrapTable("refresh")
        }, 500)
      }
    });
    $("#updateForm").validate({
      rules: {
        phone: {
          required: true,
          isMobile : true
        },
        cardNum:{
          required:true,
          isIdNum:true
        }
      },
      messages: {
        sex: {
          required: icon + '请选择性别'
        },
        birth: {
          required: icon + '请正确填写日期'
        },
        entryDate: {
          required: icon + '请正确填写日期'
        },
        img: {
          required: icon + '请选择照片'
        },
        phone: {
          required: "请填写手机号码",
          isMobile : "请正确填写手机号码"
        },
        cardNum:{
          required:"请填写身份证号码",
          isIdNum: "请正确填写身份证号码"
        }
      },
      errorPlacement: function (error, element) { //指定错误信息位置
        if (element.is(':radio') || element.is(':checkbox')) { //如果是radio或checkbox
          let eid = element.attr('name'); //获取元素的name属性
          error.appendTo(element.parent()); //将错误信息添加当前元素的父结点后面
        } else {
          error.insertAfter(element);
        }
      },
      submitHandler: function (form) {
        form.submit();
        $("#updateModal").modal("hide");
        swal(
          '修改成功！',
          '',
          'success'
          );
        setTimeout(function () {
          $("#table").bootstrapTable("refresh")
        }, 500)
      }
    });
    $('#table').bootstrapTable({
      url: url+"/staff/getStaff.action",
      method: 'post',
      pagination: true,
      search: false,
      dataType: 'json',
      toolbar: '#toolbar',
      striped: true,
      contentType: "application/x-www-form-urlencoded",
      sidePagination: 'client',
      pageSize: '15',
      pageList: [10, 25, 50, 100],
      showRefresh: false,
      dataField: "data",
      mobileResponsive: true,
      useRowAttrFunc: true,
      queryParams: function (params) {
        return {
          str1: 15,
          str2: 0
        }
      },
      columns: [{
        field: 'workNum',
        title: '工号',
        sortable: true,
      }, {
        field: 'name',
        title: '姓名',
        sortable: true,
      }, {
        field: 'sex',
        title: '性别',
        sortable: true,
      }, {
        field: 'birth',
        title: '出生日期',
        sortable: true,
      }, {
        field: 'phone',
        title: '手机号',
        sortable: true,
      }, {
        field: 'entryDate',
        title: '入职时间',
        sortable: true,
      }, {
        field: 'descript',
        title: '描述',
        sortable: true,
      }, {
        field: 'null',
        title: '操作',
        formatter: actionFormatter,
      }
      ]
    })
  }

  //渲染按钮
  function actionFormatter(value, row, index) {

    let id = row.workNum;

    let result = "";
    result += "<button class='btn btn-xs btn-warning' onclick=Reset(" + id
    + ") title='重置密码'><span>重置</span></a>";

    result += "<button class='btn btn-xs btn-primary' onclick=Edit("
        + JSON.stringify(row)//将js对象转化为json字符串
        + ") title='修改'><span>修改</span></a>";
        result += "<button class='btn btn-xs btn-danger deleteButton' staff_id="
        + id
        + " title='删除'><span>删除</span></a>";
        result += "<button class='btn btn-xs btn-success assignWorkerType' staff_roles='"+row.roles+"' staff_id=" + id
        + " title='分配工种'><span>分配工种</span></a>";
        result += "<button class='btn btn-xs btn-success assignRole' staff_roles='"+row.roles+"' staff_id=" + id
        + " title='分配角色'><span>分配角色</span></a>";
        return result;
      }

    });


// $(document).on('click',"#addStaffButton",function(){
//   var formData = new FormData();
//   var file = $("#img")[0].files[0];
//   formData.append("img",file);
//   console.log(file);
//   console.log(formData);
//   console.log(formData.get("img"));
//   $.ajax({
//     url:url+"/staff/addStaff.action",
//     type:'post',
//     dataType:'json',
//             //xhrFields: {withCredentials: true},
//           data:{
//           //method:"addRoles",
//           str1:$("#workNum").val(),
//           str2:$("#name").val(),
//           str3:$("#sex").val(),
//           str4:$("#birth").val(),
//           img:formData,
//           str5:$("#entryDate").val(),
//           str6:$("#cardNum").val(),
//           str7:$("#address").val(),
//           str8:$("#phone").val(),
//           str9:$("#descript").val()
//         },
//         processData: false,
//         // 告诉jQuery不要去设置Content-Type请求头
//         //contentType: 'multipart/form-data',
//         contentType: false,
//         success: function (result) {
//           if (result.code === 0) {
//             $("#addModal").modal("hide");
//             swal(
//               '添加成功!',
//               result.msg,
//               'success'
//               );
//             $("#table").bootstrapTable('refresh');
//           }else if(result.code===1){
//             swal(
//               '添加失败!',
//               result.msg,
//               'error'
//               );
//           }
//         },
//         error: function () {
//           swal(
//             '添加失败!',
//             '网络错误',
//             'error'
//             );
//         }
//       })
// });
//模糊搜索员工
$(document).on('click',"#searchButton",function () {
  let searchIn=$("#search-input").val();
  var opt = {
    url: url+"/staff/getBlurStaff.action",
    silent: true,
    query:{
      str1:15,
      str2:0,
      str3:searchIn
    }
  };
  $("#table").bootstrapTable('refresh', opt);
  //console.log(searchIn);
  $("#search-input").val("");
});
//分配角色时的员工id
let assignStaffId;


//为分配工种按钮绑定事件
$(document).on('click', ".assignWorkerType", function () {
  //给员工id赋值
  assignStaffId = $(this).attr("staff_id");
  //获取roles信息
  let roles = $(this).attr("staff_roles");
  //获取role-check元素
  let worker_type_check = $("#worker-type-check");
  // 每次打开的时候清空元素
  worker_type_check.empty();
  $("#worker-type-modal").modal({
    backdrop: 'static',
  });
  //发送ajax请求
  $.ajax({
    url: url + "/staff/getStaffTypes.action",
    dataType: 'json',
    data: {
      //method: "getStaffTypes",
      str1: assignStaffId
      
    },
    success: function (result) {
      let data = result.data;
      let array=[];
      //遍历获取的json数据
      array=roles.split("+");
      $.each(data, function (index, item) {
        //if (array.indexOf((item.id.toString())) !== -1) {
          if (item.selected=="true") {
          worker_type_check.append(
            "<div class=\"center-block text-center\"><input id=" + item.name
            + " class='role-check' type='checkbox' checked value='"
            + item.id + "' ><label for=" + item.name + ">" + item.name
            + "</label></div>")
        } else {
          worker_type_check.append(
            "<div class=\"center-block text-center\"><input id=" + item.name
            + " class='role-check' type='checkbox' value='"
            + item.id + "'><label for=" + item.name + ">" + item.name
            + "</label></div>")
        }
      });
    }
  });
});

//保存分配工种
$(document).on('click', "#worker-type-confirm-button", function () {
  let roles = "";
  let roleCheckLength=$(".role-check:checked").length;
  $(".role-check:checked").each(function (index,item) {
    if (roleCheckLength===(index+1)){
      roles += $(this).val();
    } else {
      roles += ($(this).val()+",");
    }
  });
  //console.log(roles);
  //roles=roles.replace(/\+/g,"%2B");
  $.ajax({
    // url: url+"?method=setStaff&id="+assignStaffId+"&roles="+roles,
    url: url+"/staff/setStaffTypes.action",
    data: {
      //method: 'setStaffTypes',
      str1: assignStaffId,
      str2: roles
    },
    dataType: 'json',
    success: function (result) {
      if (result.code === 0) {
        $("#table").bootstrapTable('refresh');
        swal(
          '分配成功',
          result.msg,
          'success'
          );
        //关闭模态框
        $("#worker-type-modal").modal('hide');
      } else {
        swal(
          '分配失败',
          result.msg,
          'error'
          );
      }
    },
    error: function () {
      swal(
        '分配失败',
        '网络错误',
        'error'
        );
    }
  })
});

//为分配角色按钮绑定事件
$(document).on('click', ".assignRole", function () {
  //给员工id赋值
  assignStaffId = $(this).attr("staff_id");
  //获取roles信息
  let roles = $(this).attr("staff_roles");
  //获取role-check元素
  let role_check = $("#role-check");
  // 每次打开的时候清空元素
  role_check.empty();
  $("#assign-modal").modal({
    backdrop: 'static',
  });
  //发送ajax请求
  $.ajax({
    url: url + "/staff/getStaffRoles.action",
    dataType: 'json',
    data: {
      //method: "getStaffRoles",
      str1: assignStaffId
    },
    success: function (result) {
      let data = result.data;
      let array=[];
      //遍历获取的json数据
      array=roles.split("+");
      $.each(data, function (index, item) {
        //if (array.indexOf((item.id.toString())) !== -1) {
          if(item.selected=="true"){
          role_check.append(
            "<div class=\"center-block text-center\"><input id=" + item.name
            + " class='role-check' type='checkbox' checked value='"
            + item.id + "' ><label for=" + item.name + ">" + item.name
            + "</label></div>")
        } else {
          role_check.append(
            "<div class=\"center-block text-center\"><input id=" + item.name
            + " class='role-check' type='checkbox' value='"
            + item.id + "'><label for=" + item.name + ">" + item.name
            + "</label></div>")
        }
      });
    }
  });
});

//保存分配的角色
$(document).on('click', "#assign-confirm-button", function () {
  let roles = "";
  let roleCheckLength=$(".role-check:checked").length;
  $(".role-check:checked").each(function (index,item) {
    if (roleCheckLength===(index+1)){
      roles += $(this).val();
    } else {
      roles += ($(this).val()+",");
    }
  });
  //roles=roles.replace(/\+/g,"%2B");
  $.ajax({
    // url: url+"?method=setStaff&id="+assignStaffId+"&roles="+roles,
    url: url+"/staff/setStaffRoles.action",
    data: {
      //method: 'setStaffRoles',
      str1: assignStaffId,
      str2: roles
    },
    dataType: 'json',
    success: function (result) {
      if (result.code === 0) {
        $("#table").bootstrapTable('refresh');
        swal(
          '分配成功',
          result.msg,
          'success'
          );
        //关闭模态框
        $("#assign-modal").modal('hide');
      } else {
        swal(
          '分配失败',
          result.msg,
          'error'
          );
      }
    },
    error: function () {
      swal(
        '分配失败',
        '网络错误',
        'error'
        );
    }
  })
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

//重置密码
function Reset(id) {

  swal({
    title: '重置密码',
    text: "该用户的密码重置为123456",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '重置'
  }).then(function (isConfirm) {

    if (isConfirm) {
      $.ajax({
        url: url+"/staff/resetPsw.action",
        dataType:'json',
        data: {
          //method: 'resetPsw',
          str1: id
        },
        success: function (result) {
          if (result.code === 0) {
            swal(
              '重置成功',
              result.msg,
              'success'
              );
          } else {
            swal(
              '重置失败',
              result.msg,
              'error'
              );
          }
        },
        error:function () {
          swal(
            '重置失败',
            '网络错误',
            'error'
            );
        }
      })
    }
  });
}

//编辑
function Edit(row) {
  $("#updateForm").find("input[name=id]").remove();
  $("#newWorkNum").val(row.workNum);
  $("#newName").val(row.name);
  $("#updateForm input:radio[value=" + row.sex + "]").prop('checked', true);
  $("#newBirth").val(row.birth);
  $("#newEntryDate").val(row.entryDate);
  $("#newCardNum").val(row.cardNum);
  $("#newAddress").val(row.address);
  $("#newPhone").val(row.phone);
  $("#newDescript").val(row.descript);
  $("#updateForm").prepend("<input name='id'value='" + row.id + "' hidden>")
  $("#updateModal").modal({
    backdrop: 'static',
  });
}

//需要删除的员工id
let deleteStaffId;
//删除员工
$(document).on('click', '.deleteButton', function () {
  let deletePrompt = $("#delete-prompt");
  //首先清空模态框的提示信息
  deletePrompt.empty();
  deleteStaffId = $(this).attr("staff_id");
  $("#delete-modal").modal({
    backdrop: 'static',
  });
  //回显需要删除的员工的名称
  let staffName = $(this).parent().prev().prev()
  .prev().prev().prev().prev().text();
  //提示信息
  deletePrompt.append("您是否要删除员工:" + staffName);
});

//删除模态框确认按钮绑定事件
$(document).on('click', "#delete-confirm-button", function () {
  console.log($.type(deleteStaffId));
  $.ajax({
    url: url+"/staff/delStaff.action",
    dataType: "json",
    type:'post',
    data: {
      //method: "delStaff",
      str1: deleteStaffId,
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
      } else if (result.code === 1) {
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
});

//触发添加员工模态框
$(document).on('click', "#add-a", function () {
  //清空原来的信息
  $("#workNum").val("");
  $("#name").val("");
  $("#birth").val("");
  $("#img").val("");
  $("#cardNum").val("");
  $("#address").val("");
  $("#phone").val("");
  $("#descript").val("");
  $("#entryDate").val("");
  $("#addModal").modal({
    backdrop: 'static'
  });
});

