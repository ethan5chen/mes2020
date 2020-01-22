let roles=getQueryVariable("roles");
$(function () {
  $("#addForm").validate();
  if(roles === 0){
    $("#toolbar").remove();
    $('table').bootstrapTable({
      url:url + "/product/getTorns.action",
      method: 'post',
      pagination: true,
      search: false,
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
      showRefresh:false,
      dataField: "data",
      mobileResponsive:true,
      useRowAttrFunc: true,
      columns:[{
        field:'orderNum',
        title:'订单号',
        sortable:true,
      },{
        field: 'goodsName',
        title: '单品名',
        sortable: true,
      },{
        field:'stepName',
        title:'工序名',
        sortable:true,
      },{
        field:'wokrname',
        title:'操作员',
        sortable:true,
      },{
        field:'tornName',
        title:'破损物品',
        sortable:true,
      },{
        field:'tornNum',
        title:'数量',
        sortable:true,
      },{
        field:'null',
        title:'操作',
        formatter:actionFormatter,
      }
      ]
    })

  }
  else
    $('table').bootstrapTable({
      url:url + "/product/getTorns.action",
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
      // queryParams:function(params){
      //   return{
      //     method:"getRoles",
      //     limit:0,
      //     page:0
      //   }
      // },
      columns:[{
        field:'orderNum',
        title:'订单号',
        sortable:true,
      },{
        field: 'goodsName',
        title: '单品名',
        sortable: true,
      },{
        field:'stepName',
        title:'工序名',
        sortable:true,
      },{
        field:'wokrname',
        title:'操作员',
        sortable:true,
      },{
        field:'tornName',
        title:'破损物品',
        sortable:true,
      },{
        field:'tornNum',
        title:'数量',
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
    result += "<button class='btn btn-xs btn-primary allocate' title='分配'><span>分配</span></button>";
    return result;
  }

});



$(document).on('click', '.allocate', function () {
  window.location.href = "broken_allocate.html";
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



