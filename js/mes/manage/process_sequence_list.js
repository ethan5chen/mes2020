$(function () {
  //获取所有工序
  $.ajax({
    url: url + '/product/getAllSteps.action',
    method: 'post',
    dataType: 'json',
    success: function(result) {
      
      if (result.code === 0) {
        let data = result.data;
        for (let i = 0; i < data.length; i++) {
          $('#process_list_row')
          .append("<button class=\"btn btn-default dim col-md-2 button_large\"  process_id='"+ data[i].id +"' process_name='"+ data[i].name +"' process_descript='"+ data[i].descript +"' type=\"button\"><span>"+ data[i].name +"</span></button>");
        }

      }
    }
  });
});

$(document).on('click', '.button_large', function(){
  //获取工序信息
  let process_id = $(this).attr('process_id');
  let process_name = $(this).attr('process_name');
  let process_descript = $(this).attr('process_descript');
  process_name = encodeURI(encodeURI(process_name));
  process_descript = encodeURI(encodeURI(process_descript));
  //跳转到分配页面
  window.location.href = 'operator_assign.html?id=' + process_id + '&name=' + process_name + '&descript=' + process_descript;
});

