let processMap = new Map(); //工序编号和名称对应的map
let workTypeMap = new Map();  //工种编号和名称对应的map
let materialsMap = new Map();//原材料编号和原材料名称对应的map
let processWorkTypeMap = new Map();//工序编号和工种编号对应的map
let worktype_materialsNumMap = new Map();//工种编号和原材料编号对应的map
let worktype_materialsOriginMap= new Map();//工种编号和原材料来源对应的map
let worktype_resultsMap = new Map();//工种编号和生产结果编号对应的map

let tableJson; //存放当前table的json数据
let id;         //全局id
let process_num = getQueryString("id");
let worktypeDom = document.getElementById("work_type_selection_select");
var processNum,processName;//添加的工序的编号
var workTypeNum,workTypeName;//添加的工种的编号  
let valueJson={};
let valueArray= [];
let formulasJson={};
let formulasArray=[];
let formulasNum;
let formulasRates;
let rates;
let isExact;
let shifts;
let relation;

var materialsNumArray;
var materialsOriginArray
var resultArray;
//界面渲染后
$(function () {
  $.ajax({   
    url: url + "/template/getRelation.action",
    method: 'post',
    data: {
      str1: process_num,
      str2: "inOut"
    },
    dataType: 'json',
    success: function (result) {
      let data = result.data;
      let steps = data.steps;  //工序编号及名称
      let workType = data.workType;   //工种编号及名称
      let materials = data.workNoun; //原材料编号及名称
      let useWt = data.useWt;  //工序编号对应工种编号
      let useWn = data.useWn;  //工种编号对应物料编号  
      let useResult = data.useResult;  //工种编号对应生产结果编号
      $.each(steps, function (index, item) {//工序编号与名称
        processMap.set(item.id, item.name);       
      //console.log(processMap);
        $("#process_selection_select").append(
          "<option value='" + item.id + "'>" + item.name + "</option>");
      });     
      $.each(workType, function (index, item) {//工种编号与名称
        workTypeMap.set(item.id, item.name);
      });
      $.each(materials, function (index, item) {//原材料编号与名称
        materialsMap.set(item.id, item.name);
      });
      $.each(useWt, function (index, item) {  //工序和工种
        item.num=parseInt(item.num.toString().replace(/\"/g, ""));
        processWorkTypeMap.set(item.num, item.value); // 1--"3,4"           
      });             
      $.each(useWn, function(index, item) { //工种和原材料
        var item_num = parseInt(item.num.toString().replace(/\"/g, ""));
        var Value=item.value;
        var str1="",str2="";
        for (var i = 0; i < Value.length; i++) {
            str1+=Value[i].num+',';
            str2+=Value[i].origin+',';
        }
        str1=str1.substring(0, str1.lastIndexOf(','));//去掉最后一个逗号
        str2=str2.substring(0, str2.lastIndexOf(','));        
        worktype_materialsNumMap.set(item_num,str1);  // 1--"3,4"
        worktype_materialsOriginMap.set(item_num,str2);// 1--"origin,origin"
      });
      $.each(useResult, function (index, item) { //工种和生产结果 
        item.num=parseInt(item.num.toString().replace(/\"/g, ""));
        worktype_resultsMap.set(item.num, item.value);       
      });
 
      //将表格的json数据存入全局变量
      tableJson = JSON.stringify(data.table);
      console.log(tableJson);
      //增加表格
      $('table').bootstrapTable({
        data: data.table,
        pagination: true,
        uniqueId: 'stepNum',
        search: true,
        dataType: 'json',
        striped: true,
        sidePagination: 'client',
        pageSize: '15',
        pageList: [10, 25, 50, 100],
        showRefresh: true,
        dataField: "data",
        contentType: "application/x-www-form-urlencoded",
        mobileResponsive: true,
        useRowAttrFunc: true,
        columns: [{
          field: 'stepNum',
          title: '工序名',
          sortable: true,
          formatter: processNameFormatter
        }, {
          field: 'wtNum',
          title: '工种',
          sortable: true,
          formatter: workTypeFormatter
        },{
          field: 'relation',
          title: '对应关系',
          sortable: true,
          formatter: relationFormatter
        }, 
        {
          field: 'null',
          title: '操作',
          formatter: actionFormatter
        }
        ]
      });
    }
  });
});
 
  $("#process_selection_select").change(function(){  
      //获取选中的工序
      let process_selection_select = $('#process_selection_select');
      processNum = process_selection_select.val();
      processName = $('#process_selection_select option:selected').text();

      //清空工种下拉框
      //worktypeDom = document.getElementById("work_type_selection_select");
      for(i=worktypeDom.options.length-1 ; i>= 0 ; i--)
          worktypeDom.options[i] = null;
      $("#productResults_Area").empty();  
      if(processName=='请选择')
        return;
      var selectedVal=$(this).children('option:selected').val();
      workTypeStr=processWorkTypeMap.get(parseInt(selectedVal)); 
      if(workTypeStr==null||workTypeStr==""||workTypeStr==undefined){
        swal('暂未给该工序添加工种信息!');
        processName='请选择';
        $("#process_selection_select").find("option").each(function(){
          if($(this).text() == '请选择')  {
            $(this).attr("selected",true);
            return;
          }
        });
        return;
      }    
      $("#work_type_selection_select").append(
        "<option value='-1'>请选择</option>");
      let workTypeArray = workTypeStr.split(","); 
      for(var i=1; i<= workTypeArray.length ; i++){//工种编号和名称
        $("#work_type_selection_select").append(
          "<option value='" + parseInt(workTypeArray[i-1]) + "'>" + workTypeMap.get(parseInt(workTypeArray[i-1])) + "</option>");
      }
  });

  $("#work_type_selection_select").change(function(){
    //获取选中的工种  
    let work_type_selection_select = $(
        '#work_type_selection_select option:selected');
    workTypeNum = $('#work_type_selection_select').val();
    workTypeName = $('#work_type_selection_select option:selected').text();
    materialsNumStr=worktype_materialsNumMap.get(parseInt(workTypeNum));
    materialsOriginStr=worktype_materialsOriginMap.get(parseInt(workTypeNum));
    resultStr=worktype_resultsMap.get(parseInt(workTypeNum));
    if(materialsNumStr==null||materialsNumStr==""||materialsNumStr==undefined){
      swal('暂未给该工种添加物料信息!','请添加后再次查看','error');
      $("#productResults_Area").empty();
      workTypeName='请选择';
      $("#work_type_selection_select").find("option").each(function(){
        if($(this).text() == '请选择')  {
          $(this).attr("selected",true);
          return;
        }
      });
      return;
    }
    if(resultStr==null||resultStr==""||resultStr==undefined){
      swal('暂未给该工种添加生产结果信息!','请添加后再次查看','error');
      $("#productResults_Area").empty();
      
      return;
    }
    materialsNumArray = materialsNumStr.split(","); //选中工种对应的原材料数组
    materialsOriginArray = materialsOriginStr.split(","); 
    resultArray = resultStr.split(","); //选中工种对应的生产结果数组
     
    $("#productResults_Area").empty();
    var str="";
    for(var i=1; i<= resultArray.length; i++){
        str+="<div class='resultDiv'>";  //一个生产结果对应一个div
        var resultName=materialsMap.get(parseInt(resultArray[i-1]));//生产结果
        for(var j=1; j<= materialsNumArray.length; j++){
            var materialsName=materialsMap.get(parseInt(materialsNumArray[j-1]));//原料名
            if(materialsOriginArray[j-1]=="origin")
              materialsOriginArray[j-1]="原材料";
            else
              materialsOriginArray[j-1]="半成品";
            str+="<span>&nbsp+</span>"
                + "&nbsp <span>"+materialsName+"</span>"
                + "&nbsp <span>("+materialsOriginArray[j-1]+")</span>"
                +"<span>&nbsp*&nbsp</span>"
                +"<input type='number' class='number' id='inputMaterial"+i+j+"'>";  //原材料
        }
        str+=" &nbsp<span>"+"="+"&nbsp"+resultName+"</span>"
             +"<span>&nbsp*&nbsp</span>" 
             +"<input type='number' class='result' id='inputResult" +i+"'>" //生产结果
             +"<span>&nbsp &nbsp &nbsp</span>"
             +"<span><input type='checkbox' checked='checked' class='checkbox' id='checkbox"+i+"'>"      
             +"<label for='精确相等'>精确相等</label></span>"
             +"<span>&nbsp &nbsp &nbsp</span>"  
             +"<label for='偏移值'>偏移值</label>"
             +"<span>&nbsp</span>"
             +"<input type='number' class='shift' id=inputShift" +i+">"
             +"</div> <br/><br/><br/><br/>";                             
        str=str.replace(/\+/,"");//去掉第一个加号  
        $("#productResults_Area").append(str);
        str="";  //添加完每一个div，str清空
    }
    var inputCount=$(".number");
    var resultCount=$(".result");
    var shiftCount=$(".shift");
    for(var i=0;i<inputCount.length;i++){
      inputCount[i].value=0;
    }
    for(var i=0;i<resultCount.length;i++){
          resultCount[i].value=1;
    }
    for(var i=0;i<shiftCount.length;i++){
          shiftCount[i].value=0;
    }
  });
 
  $(document).on('click', '#btn1', function () {
    if($("#two_selectForm").validate().form())
      if(processName=='请选择'||processName==undefined||processName==null||workTypeName=='请选择'||workTypeName==undefined||workTypeName==null){
        //swal('请选择工序工种信息!');
        swal('暂未给工种录入物料或生产结果信息!');
        return;
      }  
      //tableJson = JSON.stringify(data.table);
      if(tableJson.length!=0){  //表格为空时不用判断
        tableJson = JSON.parse(tableJson);
        //console.log(tableJson);
        for (let i = 0; i < tableJson.length; i++) {
          if (processNum===tableJson[i].stepNum&&workTypeNum===tableJson[i].wtNum){
            swal('添加失败!','已存在该工序工种及对应关系绑定,请删除后再次添加','error');
            tableJson = JSON.stringify(tableJson);
            return;
          }
        }
        tableJson = JSON.stringify(tableJson);
      }
      var inputCount=$(".number");
      var resultCount=$(".result");
      var shiftCount=$(".shift");
      for (var i = 1; i <= resultArray.length; i++){
        var flag=0;
        for(let j = 1; j <= materialsNumArray.length; j++){
          if($('#inputMaterial'+i+j).val()!=0)
            flag=1;
        }
        if(flag==0){
          swal('添加失败!','请至少输入一个有效原料比例系数','error');
          return;
        }
      }
      for(var i=0;i<inputCount.length;i++){
        if(inputCount[i].value<0){
          swal('添加失败!','请输入正确的原料比例系数','error');
          return;
        }
      }
      for(var i=0;i<resultCount.length;i++){
        if(resultCount[i].value<1){
          swal('添加失败!','请输入正确的生产结果比例系数','error');
          return;
        }
      }
      for(var i=0;i<shiftCount.length;i++){
        if(shiftCount[i].value<0||shiftCount[i].value>1){
          swal('添加失败!','请输入正确的偏移值系数','error');
          return;
        }
      }
      var checkboxCount=$('.checkbox');
      for(var i=1;i<=checkboxCount.length;i++){
        if($('#checkbox'+i).is(':checked')){
              $('#checkbox'+i).val(true);
        }else{
              $('#checkbox'+i).val(false);
          }
      }

    let addRowJson = {};
    addRowJson.stepNum = processNum;
    addRowJson.wtNum = workTypeNum.toString();
    
    var relationStr="";
    var valueArray= [];
    for (var i = 1; i <= resultArray.length; i++){
      var resultName=materialsMap.get(parseInt(resultArray[i-1]));//生产结果
      valueJson={};
      formulasArray=[];
      valueJson.resultNum=resultArray[i-1];
      valueJson.rates=$('#inputResult'+i).val(); 
      valueJson.isExact=$('#checkbox'+i).val();
      valueJson.shifts=$('#inputShift'+i).val();
      //valueJson.formulas
      for(let j = 1; j <= materialsNumArray.length; j++){
        let formulasJson={};
        if($('#inputMaterial'+i+j).val()!=0){//系数为0的原料不要
          formulasJson.num=materialsNumArray[j-1];//物料号
          formulasJson.rates=$('#inputMaterial'+i+j).val();
          var materialsName=materialsMap.get(parseInt(materialsNumArray[j-1]));
          relationStr+="+"+materialsName+"*"+formulasJson.rates;
          formulasArray.push(formulasJson);
        }
      }
      valueJson.formulas=formulasArray;
      valueArray.push(valueJson);

      relationStr+="="+resultName+"*"+valueJson.rates+",偏移"+valueJson.shifts+";"+"<br/>";
    }  
    relationStr=removeExtraPlus(relationStr);
    //console.log(valueArray);
    addRowJson.value = valueArray;
    addRowJson.relation = relationStr;
    //console.log(tableJson);

    if(tableJson.length!=0){
      tableJson = JSON.parse(tableJson);
    }
    tableJson.push(addRowJson);
    tableJson = JSON.stringify(tableJson);
    //重新刷新表格
    console.log(tableJson);
    $("table").bootstrapTable('destroy');
    initTable(tableJson);
    //提示弹框
    swal('添加成功!','','success');
});

//保存按钮绑定事件
$(document).on('click', '#save-btn', function () {
  $.ajax({
    url: url + "/template/saveRelation.action",
    method: 'POST',
    dataType: 'json',
    data: {
      str1: process_num,
      str2: "inOut",
      str3: tableJson
    },
    success: function (result) {
      if (result.code === 0) {
        swal(
          '保存成功!',
          '',
          'success'
          );
      } else {
        swal(
          '保存失败!',
          '',
          'error'
          );
      }
    }
  })
});

function initTable(data) {
  data = JSON.parse(data);
  console.log(data);
  $('table').bootstrapTable({
    data: data,
    pagination: true,
    uniqueId: 'stepNum',
    search: true,
    dataType: 'json',
    striped: true,
    sidePagination: 'client',
    pageSize: '15',
    pageList: [10, 25, 50, 100],
    showRefresh: true,
    dataField: "data",
    contentType: "application/x-www-form-urlencoded",
    mobileResponsive: true,
    useRowAttrFunc: true,
    columns: [{
      field: 'stepNum',
      title: '工序名',
      sortable: true,
      formatter: processNameFormatter
    }, {
      field: 'wtNum',
      title: '工种',
      sortable: true,
      formatter: workTypeFormatter
    },{
      field: 'relation',
      title: '对应关系',
      sortable: true,
      formatter: relationFormatter
    },  
    {
      field: 'null',
      title: '操作',
      formatter: actionFormatter
    }
    ]
  });
}

//渲染按钮
function actionFormatter(value, row, index) {
  let stepNum = row.stepNum;
  let wtNum = row.wtNum;
  let result = "";
  result += "<button class='btn btn-md btn-danger btn-rounded deleteButton' stepNum="+ stepNum +" wtNum="+ wtNum +" title='删除'><span>删 除</span></button>";
  return result;
}

function processNameFormatter(value, row, index){
  return processMap.get(parseInt(value));
}
function workTypeFormatter(wtNum, row, index){
  let valueArray = (wtNum || "").split(",");
  $.each(valueArray, function (arrayIndex, arrayItem) {
    wtNum = wtNum.replace(arrayItem,workTypeMap.get(parseInt(arrayItem)));
  });
  return wtNum;
}
function relationFormatter(relation, row, index){
  return relation;
}
//删除绑定按钮
$(document).on('click', '.deleteButton', function () {
  let stepNum = $(this).attr("stepNum");
  let wtNum = $(this).attr("wtNum");
  //弹出模态提示框  wtNum
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
      $("table").bootstrapTable('destroy');
      tableJson = JSON.parse(tableJson);
      for (let i = 0; i < tableJson.length; i++) {
        if (tableJson[i].stepNum === stepNum && tableJson[i].wtNum === wtNum) {
          tableJson.splice(i, 1);
        }
      }
      tableJson = JSON.stringify(tableJson);
      console.log(tableJson);
      initTable(tableJson);
    }
  });
});
function removeExtraPlus(str){
    strSplit=str.split('>');
    strSplitLength=strSplit.length;
    str="";
    for(var i=0;i<strSplitLength;i++){
      strSplit[i]=strSplit[i].replace(/\+/,"").concat(">");
      str+=strSplit[i];
    }
    str=str.slice(0,-1);
    return str;
}