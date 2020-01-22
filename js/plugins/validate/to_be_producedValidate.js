//新增单品页面表单验证
$(document).ready(function validating() {
  $('#addForm').bootstrapValidator({
    message: 'This value is not valid',
    feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
    },
    //group: '.form-group',
    fields: {  
      number: {   //单品编号：
        message: 'The username is not valid',
        validators: {
          notEmpty: {
              message: '请填写单品编号'
          },
          regexp: {
              regexp: /^[a-zA-Z0-9_\.]+$/,
              message: '单品编号由字母和数字组成'
          }
        }
      },
      name: {   //单品名称：
        message: 'The username is not valid',
        validators: {
          notEmpty: {
              message: '请填写单品名称'
          }
        }
      },
      orderNumber: {
        message: 'The username is not valid',
        validators: {
          notEmpty: {
              message: '请填写订单号'
          },
          regexp: {
              regexp: /^[a-zA-Z0-9_\.]+$/,
              message: '订单号由字母和数字组成'  
          }
        }
      },
      deliveryDate: {   //交货日期：
        message: 'The username is not valid',
        validators: {
          notEmpty: {
              message: '请选择交货日期'
          }
        }
      },
      unit: {   //单位：
        message: 'The username is not valid',
        validators: {
          notEmpty: {
              message: '请填写单位'
          }
        }
      },
      quantity: {   //数量：
        message: '请输入数字',
        validators: {
          notEmpty: {
              message: '请填写数量'
          }
        }
      }
    }
  });
});