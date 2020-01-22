let roles=getQueryVariable("roles");
$(function () {
  $("#addForm").validate();
  if(roles === 0){
    $("#toolbar").remove();
    $('table').bootstrapTable({
      url: url + "/template/getTemp.action",
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
          str1:params.limit,
          str2:(params.offset/params.limit)+1,
        }
      },
      pageSize:'15',
      pageList: [10, 25, 50, 100],
      showRefresh:true,
      dataField: "data",
      mobileResponsive:true,
      useRowAttrFunc: true,
      columns:[{
        field: 'id',
        title: '编号',
        sortable: true,
      },{
        field: 'name',
        title: '名称',
        sortable: true,
      },{
        field:'descript',
        title:'描述',
        sortable:true,
      },{
        field:'createDate',
        title:'创建时间',
        sortable:true,
      }
      ]
    })

  }
  else
    $('table').bootstrapTable({
      url: url + "/template/getTemp.action",
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
          str1:params.limit,
          str2:(params.offset/params.limit)+1,
        }
      },
      columns:[{
        field: 'id',
        title: '编号',
        sortable: true,
      },{
        field: 'name',
        title: '名称',
        sortable: true,
      },{
        field:'descript',
        title:'描述',
        sortable:true,
      },{
        field:'createDate',
        title:'创建时间',
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
    let json_step = row.json_step;
    let result = "";
    result += "<button class='btn btn-xs btn-primary editButton' templateId='"+ id +"' title='修改'>修改</span></button>";
    result += "<button class='btn btn-xs btn-danger deleteButton' templateId='"+ id +"' title='删除'>删除</button>";
    result += "<button class='btn btn-xs btn-success set_up' templateId='"+ id +"' title='设置'><span>关联关系设置</span></button>";
    return result;
  }

});

//关联关系设置按钮绑定事件
$(document).on('click','.set_up', function () {
  let id=$(this).attr("templateId");
  console.log(id);
  window.location.href = "association_setting.html?id="+id;
});

//新增按钮绑定事件
$(document).on('click','#add-a', function () {
  window.location.href = "add_process_template.html";
});

//获取url中的参数
function getQueryVariable(variable) {
  let query = window.location.search.substring(1);
  query=window.atob(query);
  let vars = query.split("&");
  for (let i=0;i<vars.length;i++) {
    let pair = vars[i].split("=");
    if(pair[0] === variable){return pair[1];}
  }
  return(false);
}

$(document).on('click', '.deleteButton', function () {
  let id = $(this).attr("templateId");
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
        url: url + "/template/delTemp.action",
        method: 'POST',
        dataType: 'json',
        data: {
          str1: id
        },
        success: function (result) {
          if (result.code === 0) {
            swal(
                '删除成功!',
                '',
                'success'
            );
            //删除成功刷新表格
            $("table").bootstrapTable('refresh');
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
    }
  });

});


$(document).on('click', '.editButton', function () {
  let id = $(this).attr("templateId");
  //跳转到新增页面
  window.location.href = "add_process_template.html?id="+id;
});