roles = 1;
$(function () {
  $("#addForm").validate();
  if(roles === 0){
    $("#toolbar").remove();
    $('table').bootstrapTable({
      url:url + "/product/getTorns.action",
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
        field:'orderNum',
        title:'订单号',
        sortable:true,
      },{
        field: 'goodsName',
        title: '单品名称',
        sortable: true,
      },{
        field: 'jobNum',
        title: '工单号',
        sortable: true,
      },{
        field:'stepNum',
        title:'工序编号',
        sortable:true,
      },{
        field:'stepName',
        title:'工序名称',
        sortable:true,
      },{
        field:'workName',
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
      }
      ]
    })

  }
  else
    $('table').bootstrapTable({
      url:url + "/product/getTorns.action",
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
        field:'orderNum',
        title:'订单号',
        sortable:true,
      },{
        field: 'goodsName',
        title: '单品名称',
        sortable: true,
      },{
        field: 'jobNum',
        title: '工单号',
        sortable: true,
      },{
        field:'stepNum',
        title:'工序编号',
        sortable:true,
      },{
        field:'stepName',
        title:'工序名称',
        sortable:true,
      },{
        field:'workName',
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
    let result = "";
    result += "<button class='btn btn-xs btn-primary allocate' orderNum='"+ row.orderNum +"' goodsNum='"+ row.goodsNum +"' returnId='"+ row.id +"' title='分配' productId='"+ row.productId +"'><span>分配</span></button>";
    return result;
  }

});



$(document).on('click', '.allocate', function () {
  let productId = $(this).attr('productId');
  let returnId = $(this).attr('returnId');
  let goodsNum = $(this).attr('goodsNum');
  let orderNum = $(this).attr('orderNum');
  window.location.href = "broken_allocate.html?id=" + productId + "&returnId=" + returnId + "&goodsNum=" + goodsNum + "&orderNum=" + orderNum;
});




