let roles = getQueryVariable("roles");
console.log(roles);
// $(document).ready(function() {
//   $('#addForm').bootstrapValidator({
//     message: 'This value is not valid',

// $("#addForm").validate();
//$('#addForm').data('bootstrapValidator').validate();
if (roles === 0) {
  $("#toolbar").remove();
  $('#table').bootstrapTable({
    url:url + "/product/getProducts.action",
    // url: mockUrl + "/getProducts",
    method: 'post',
    pagination: true,
    search: false,
    dataType: 'json',
    toolbar: '#toolbar',
    contentType: "application/x-www-form-urlencoded",
    striped: true,
    sidePagination: 'server',
    pageNumber: 1,
    responseHandler: function (res) {
      res.total = res.count;
      return res;
    },
    queryParams: function (params) {
      return {
        str1: "noDoing",
        str2: params.limit,
        str3: (params.offset / params.limit) + 1,
      }
    },
    pageSize: '15',
    pageList: [10, 25, 50, 100],
    showRefresh: false,
    dataField: "data",
    mobileResponsive: true,
    useRowAttrFunc: true,
    columns: [{
      field: 'id',
      title: '订单号',
      sortable: true,
    }, {
      field: 'orderName',
      title: '订单名称',
      sortable: true,
    }, {
      field: 'endDate',
      title: '交货日期',
      sortable: true,
    }, {
      field: 'remark',
      title: '说明',
      sortable: true,
    }
    ]
  })

}
else
  $('#table').bootstrapTable({
    url:url + "/product/getProducts.action",
    method: 'post',
    pagination: true,
    search: false,
    dataType: 'json',
    toolbar: '#toolbar',
    striped: true,
    pageSize: '15',
    pageList: [10, 25, 50, 100],
    showRefresh: false,
    dataField: "data",
    contentType: "application/x-www-form-urlencoded",
    mobileResponsive: true,
    useRowAttrFunc: true,
    sidePagination: 'server',
    pageNumber: 1,
    responseHandler: function (res) {
      res.total = res.count;
      return res;
    },
    queryParams: function (params) {
      return {
        str1: "noDoing",
        str2: params.limit,
        str3: (params.offset / params.limit) + 1,
      }
    },
    columns: [{
      field: 'id',
      title: '订单号',
      sortable: true,
    }, {
      field: 'orderName',
      title: '订单名称',
      sortable: true,
    }, {
      field: 'endDate',
      title: '交货日期',
      sortable: true,
    },/*{
        field:'num',
        title:'数量',
        sortable:true,
      },*/{
      field: 'remark',
      title: '说明',
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
  let id = row.id;
  delete row.ability;
  delete row.createDate;
  let result = "";
  result += "<button class='btn btn-xs btn-primary produceTemplate' product_id=" + id + "  title='生产模板'><span>生产模板</span></button>";
  result += "<button class='btn btn-xs btn-success startProduce' product_id=" + id + " title='开始生产' ><span>开始生产</span></button>";
  result += "<button class='btn btn-xs btn-warning setProduct' product_id=" + id + " title='设置订单物品' ><span>设置订单物品</span></button>";
  return result;
}

$(document).on('click', '.produceTemplate', function () {
  let product_id = $(this).attr("product_id");
  window.location.href = "produce_template.html?id=" + product_id + "";
});

//设置订单物品按钮
$(document).on('click', '.setProduct', function () {
  let product_id = $(this).attr("product_id");
  window.location.href = "order_product.html?id=" + product_id;
});
//开始生产按钮
$(document).on('click', '.startProduce', function () {
  let product_id = $(this).attr("product_id");
  $.ajax({
    url: url + "/product/startProduct.action",
    method: 'post',
    dataType: "json",
    data: {
      str1: product_id
    },
    success: function (result) {
      if (result.code === 0) {
        swal(
          '开始生产!',
          result.msg,
          'success'
        );
        $("#table").bootstrapTable('refresh');
      } else if (result.code === 1) {
        swal(
          '操作失败!',
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


//获取url中的参数
function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  console.log(query);
  query = window.atob(query);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] === variable) { return pair[1]; }
  }
  return (false);
}

//添加
function add() {
  $('#addForm').data('bootstrapValidator').validate();
  if ($('#addForm').data('bootstrapValidator').isValid())
    //console.log($("#deliveryDate").val());
    $.ajax({
      url: url + "/product/addProduct.action",
      dataType: "json",
      data: {
        str1: $("#orderNumber").val(),
        str2: $("#orderName").val(),
        str3: $("#deliveryDate").val(),
        str4: $("#remark").val(),
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
        } else if (result.code === 1) {
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
//let deleteRoleId;
//删除属性
// $(document).on('click','.deleteButton',function () {
//   let deletePrompt=$("#delete-prompt");
//   //首先清空模态框的提示信息
//   deletePrompt.empty();
//   deleteRoleId=$(this).attr("role_id");
//   $("#delete-modal").modal({
//     backdrop: 'static',
//   });
//   //回显需要删除的属性的名称
//   let roleName=$(this).parent().prev().prev().text();
//   //提示信息
//   deletePrompt.append("您是否要删除返修问题:"+roleName);
// });

//删除模态框确认按钮绑定事件
/*$(document).on('click',"#delete-confirm-button",function () {
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
      url: url,
      dataType: "json",
      data: {
        method: "delRoles",
        id: deleteRoleId,
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
});*/

//添加模态框
$(document).on('click', "#add-a", function () {
  $("#addModal").modal({
    backdrop: 'static'
  });
  //清空输入框
  $("#orderNumber").val("");
  $("#orderName").val("");
  $("#deliveryDate").val("");
  $("#remark").val("");
  // $("#number").val("");
  // $("#name").val("");
  // $("#orderNumber").val("");
  // $("#deliveryDate").val("");
  // $("#unit").val("");
  // $("#quantity").val("");
});


/*//修改角色的id
let editRoleId;
//编辑角色
$(document).on('click','.editButton',function () {
  editRoleId=$(this).attr("role_id");
  $("#updateModal").modal({
    backdrop:'static'
  });
  //回显角色信息
  let roleName=$(this).parent().prev().prev().prev().text();
  $("#newName").val(roleName);
  let roleDescription=$(this).parent().prev().prev().text();
  $("#newDescript").val(roleDescription);
  let roleType=$(this).parent().prev().text();
  $("#newType").val(roleType);
});
*/
//编辑模态框保存按钮绑定事件
/*$(document).on('click','#edit-save-button',function () {
  if($("#updateForm").validate().form()){
    $.ajax({
      url:url,
      dataType:"json",
      data:{
        method:"updateRoles",
        id:editRoleId,
        name:$("#newName").val(),
        type:$("#newType").val(),
        descript:$("#newDescript").val()
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
});*/

