$(function () {

});
let templateId=getQueryString("id");
$(document).on('click','#process_and_work_type',function () {
  window.location.href = "process_and_work_type.html?id="+templateId;
});

$(document).on('click','#work_type_and_materials',function () {
  window.location.href = "work_type_and_materials.html?id="+templateId;
});

$(document).on('click','#work_type_and_production_result',function () {
  window.location.href = "work_type_and_production_result.html?id="+templateId;
});

$(document).on('click','#process_and_return',function () {
  window.location.href = "process_and_return.html?id="+templateId;
});

$(document).on('click','#step_and_environ',function () {
  window.location.href = "step_and_environ.html?id="+templateId;
});

$(document).on('click','#materials_and_production_result',function () {
  window.location.href = "materials_and_production_result.html?id="+templateId;
});