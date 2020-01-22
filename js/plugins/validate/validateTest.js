$(document).on('click', '#btn', function () {
    // 匹配密码，以字母开头，长度在6-12之间，必须包含数字和特殊字符。
    ///^[a-zA-Z0-9_\.]+$/
    jQuery.validator.addMethod("noneChinese", function (value, element) {
        // var str = value;
        // if (!/^[a-zA-Z]/.test(str))
        // 	return false;
        // if (!/[0-9]/.test(str))
        // 	return fasle;
        // return this.optional(element) || /^[a-zA-Z0-9_\.]+$/.test(str);
        var tel = /^(\d{3,4}-)?\d{7,8}$/g; // 区号－3、4位 号码－7、8位
        return this.optional(element) || (tel.test(value));
    }, "只能输入数字和字母");

    $("#addForm").validate({
        errorElement: 'span',
        errorClass: 'help-block',
        rules: {
            number: {
                required: true,
                noneChinese: true,
            },
            name: "required",
            orderNumber: {
                required: true,
                noneChinese: true,
            },
            deliveryDate: "required",
            unit: "required",
            quantity: "required"
        },
        messages: {
            name: "请输入单品名称",
            number: {
                required: "请输入单品编号",
                noneChinese: "请输入字母或数字"
            },
            orderNumber: {
                required: "请输入订单号",
                noneChinese: "请输入字母或数字"
            },
            deliveryDate: "请选择交货日期",
            unit: "请输入单位",
            quantity: "请输入数量",
        },
        highlight: function (element) {
            $(element).closest('.form-group').addClass('has-error has-feedback');
        }
        //提示位置
        // errorPlacement : function(error, element) {
        // 	element.next().remove();
        // 	element.after('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>');
        // 	element.closest('.form-group').append(error);
        // },

        // success : function(label) {
        // 	var el=label.closest('.form-group').find("input");
        // 	el.next().remove();
        // 	el.after('<span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>');
        // 	label.closest('.form-group').removeClass('has-error').addClass("has-feedback has-success");
        // 	label.remove();
        // },
        // submitHandler: function(form) { 
        // 	alert("submitted!");
        // }

    });
    console.log("000");
});
