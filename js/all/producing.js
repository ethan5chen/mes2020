let roles=getQueryVariable("roles");
$(function () {
  $("#addForm").validate();
  if(roles === 0){
    $("#toolbar").remove();
    $('table').bootstrapTable({
      url:url + "/getToBeProduced",
      method: 'get',
      pagination: true,
      search: true,
      dataType:'json',
      toolbar:'#toolbar',
      contentType: "application/x-www-form-urlencoded",
      striped:true,
      sidePagination:'client',
      // queryParams:function(params){
      //   return{
      //     method:"getRoles",
      //     limit:0,
      //     page:0
      //   }
      // },
      pageSize:'15',
      pageList: [10, 25, 50, 100],
      showRefresh:true,
      dataField: "data",
      mobileResponsive:true,
      useRowAttrFunc: true,
      columns:[{
        field: 'name',
        title: '单品名称',
        sortable: true,
      },{
        field:'orderNumber',
        title:'订单号',
        sortable:true,
      },{
        field:'deliveryDate',
        title:'交货日期',
        sortable:true,
      },{
        field:'quantity',
        title:'数量',
        sortable:true,
      },{
        field:'unit',
        title:'单位',
        sortable:true,
      }
      ]
    })

  }
  else
    $('table').bootstrapTable({
      url:url + "/getToBeProduced",
      method: 'get',
      pagination: true,
      search: true,
      dataType:'json',
      toolbar:'#toolbar',
      striped:true,
      sidePagination:'client',
      pageSize:'15',
      pageList: [10, 25, 50, 100],
      showRefresh:true,
      dataField: "data",
      contentType: "application/x-www-form-urlencoded",
      mobileResponsive:true,
      useRowAttrFunc: true,
      // queryParams:function(params){
      //   return{
      //     method:"getRoles",
      //     limit:0,
      //     page:0
      //   }
      // },
      columns:[{
        field: 'name',
        title: '单品名称',
        sortable: true,
      },{
        field:'orderNumber',
        title:'订单号',
        sortable:true,
      },{
        field:'deliveryDate',
        title:'交货日期',
        sortable:true,
      },{
        field:'quantity',
        title:'数量',
        sortable:true,
      },{
        field:'unit',
        title:'单位',
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
    result += "<button class='btn btn-xs btn-primary operate' title='操作'><span>操作</span></button>";
    return result;
  }

});



$(document).on('click', '.operate', function () {
  window.location.href = "producing_operate.html";
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



