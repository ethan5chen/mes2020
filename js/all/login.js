function login() {
  let workNum = $("#workNum").val();
  let psw = $("#psw").val();
  if (!isVerify){
    $("#showMessageSpan").remove();
    keyTime=true;
    let showMessage=$("<span id='showMessageSpan' style='color: red'></span>");
    showMessage.append("请完成验证");
    $(".verify-bar-area").css("display","inline-block");
    $(".verify-bar-area").after(showMessage);
    return;
  }
  if ($("#login").valid() && isVerify) {
    $.ajax({
      url: url+"/staff/login.action",
      dataType: "json",
      type: "post",
      data: {
        //method: "login",
        str1: workNum,
        str2: psw
      },
      success: function (data) {
        //console.log(data);
        if (data.code === 1) {

          swal(
            '登录失败!',
            data.msg,
            'error'
            );
        } else {
          
          sessionStorage.setItem("roles", data.data.roles);
          sessionStorage.setItem("name", data.data.name);
          sessionStorage.setItem("workNum", workNum);
          //console.log(data);
          window.location.href = "index.html"
        }
      },
      error:function () {
        swal(
          '登录失败!',
          '网络错误',
          'error'
          );
      }
    })
  }

}

let keyTime=true;

$("body").keydown(function (event) {
  if (event.keyCode === 13&&keyTime) {
    login();
  }
  keyTime=!keyTime;
});

//显示校验结果的提示信息
function show_validate_msg(ele, status, msg) {
  //清除当前元素的校验状态
  $(ele).parent().removeClass("has-success has-warning");
  if ("success" === status) {
    $(ele).parent().addClass("has-success");
    $(ele).next("span").next("span").text(msg);
  } else if ("error" === status) {
    $(ele).parent().addClass("has-warning");
    $(ele).next("span").next("span").text(msg);
  }
}

//定义全局变量控制验证码验证状态
let isVerify=false;

$('#validate').slideVerify({
  type : 1,		//类型
  vOffset : 5,	//误差量，根据需求自行调整
  barSize : {
    width : '65%',
    height : '30px',
  },
  ready : function() {
    isVerify=false;
  },
  success : function() {
    isVerify=true;
    $("#showMessageSpan").remove();
  },
  error : function() {
    isVerify=false;
  }

});


