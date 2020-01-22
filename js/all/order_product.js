let product_id = getQueryString("id");
console.log(product_id);
$('#table').bootstrapTable({
  url:url + "/product/getProMats.action",
  // url: mockUrl + "/getProMats",
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
      str1: product_id,
      str2: params.limit,
      str3: (params.offset / params.limit) + 1,
    }
  },
  columns: [{
    field: 'matId',
    title: '物品编号',
    sortable: true,
  }, {
    field: 'matName',
    title: '物品名称（成品）',
    sortable: true,
  }, {
    field: 'num',
    title: '所需数量',
    sortable: true,
  }, {
    field: 'remark',
    title: '备注',
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
  let productNum = row.num;
  let result = "";
  result += "<button class='btn btn-xs btn-success modifyNum' product_id=" + id + " productNum=" + productNum + " title='修改数量'><span>修改数量</span></button>";
  result += "<button class='btn btn-xs btn-danger deleteButton' product_id='" + id + "' title='删除'>删除</button>";
  return result;
}

//删除按钮
$(document).on('click', '.deleteButton', function () {
  let id = $(this).attr("product_id");
  //弹出模态框提示
  swal({
    title: '您是否要删除?',
    text: "",
    type: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    confirmButtonText: '确定',
    cancelButtonColor: '#d33',
    cancelButtonText: "取消",
  }).then(function (isConfirm) {
    if (isConfirm) {
      $.ajax({
        url: url + "/product/delProMat.action",
        method: 'POST',
        dataType: 'json',
        data: {
          str1: id
        },
        success: function (result) {
          if (result.code === 0) {
            swal('删除成功!', '', 'success');
            //删除成功刷新表格
            $("table").bootstrapTable('refresh');
          } else if (result.code === 1) {
            swal('删除失败!', result.msg, 'error');
          }
        },
        error: function () {
          swal('删除失败!', '网络错误', 'error');
        }
      });
    }
  });

});

//添加模态框
$(document).on('click', "#add-a", function () {
  $("#addModal").modal({
    backdrop: 'static'
  });
  //清空输入框
  $("#num").val("");
  $("#remark").val("");
  $(function () {
    $.ajax({   
      url: url + "/product/getFixWorkNoun.action",
      method: 'post',
      data: {
        str1: 'half'
      },
      dataType: 'json',
      success: function (result) {
        let data = result.data;
        $.each(data, function (index, item) {//半成品编号与名称
        //console.log(processMap);
        $("#product").append(
            "<option value='" + item.id + "'>" + item.name + "</option>");
        }); 
      } 
    });
  });
  //添加
  $(document).on('click', '#addProduct', function () {
    // $('#addForm').data('bootstrapValidator').validate();
    // if ($('#addForm').data('bootstrapValidator').isValid()){
    if($("#addForm").valid()){
      var id = getQueryString("id");
      console.log(id);
      $.ajax({
        url: url + "/product/addProMat.action",
        method: 'post',
        dataType: "json",
        data: {
          str1: id,//订单号
          str2: $("#product option:selected").val(), //生产要素Id(半成品)
          str3: $("#num").val(), //数量
          str4: $("#remark").val(),
        },
        success: function (result) {
          if (result.code === 0) {
            $("#addModal").modal("hide");
            swal('添加成功!', result.msg, 'success');
            $("#table").bootstrapTable('refresh');
          } else if (result.code === 1) {
            swal('添加失败!', result.msg, 'error');
          }
        },
        error: function () {
          swal('添加失败!', '网络错误', 'error');
        }
      })
    }
  });
});

//编辑模态框
$(document).on('click', '.modifyNum', function () {
  $("#updateModal").modal({
    backdrop: 'static'
  });
  var str1 = $(this).attr("product_id");  //记录编号  productNum
  var productNum = $(this).attr("productNum");  //记录编号  
  console.log(productNum);
  // row = $.parseJSON(row);
  $("#number").val(productNum);
  console.log($("#number").val());
  //编辑模态框保存按钮绑定事件
  $(document).on('click', '#edit-save-button', function () {
    // if ($("#updateForm").validate().form()) {
    if ($("#updateForm").valid()) {
      $.ajax({
        url: url + "/product/updateProMatNum.action",
        method: 'post',
        dataType: "json",
        data: {
          str1: str1,
          str2: $("#number").val()
        },
        success: function (result) {
          if (result.code === 0) {
            swal('修改成功!', result.msg, 'success');
            $("#updateModal").modal("hide");
            $("#table").bootstrapTable('refresh');
          } else if (result.code === 1) {
            swal('修改失败!', result.msg, 'error');
          }
        },
        error: function () {
          swal('修改失败!', '网络错误', 'error');
        }
      });
    }
  });
});




