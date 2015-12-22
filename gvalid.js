

$.extend($.fn, {

    gvalid: function (options) {

        var defaults = {
            onValided: function (errorList) { },
            isFocus: true
        };

        var output = {}

        var opts = $.extend(defaults, options);

        output.errorList = [];

        var tagList = [];

        var isCallvalid = false;


        var $this = $(this);

        var init = function () {

            //tagList
            $this.find("[gvalid]").each(function (i, val) {


                //re code
                var str = $(val).attr("gvalid");
                var jscodes = str.split('|');

                $(jscodes).each(function (ji, jval) {

                    tagList.push({
                        index: ji,
                        tagIndex: i,
                        tag: val,
                        isInValid: false,
                        hasValidOk: false,
                        condictionObj: new output.validCondiction(val),
                        jsExtCode: "tagItem.condictionObj." + jval


                    });

                });
                $(val).blur(function () {
                    if (isCallvalid == false && opts.isFocus == false) {
                        updateTagList(tagList, i);
                        return;
                    }
                    updateTagList(tagList, i);
                    validOne();
                    opts.onValided(output.errorList);
                });


                //end


            });

        }
        //如果 i=-1 ，则全部更改
        var updateTagList = function (tagList, i) {
            $(tagList).each(function (c, item) {
                if (item.tagIndex == i || i == -1) {
                    item.isInValid = true;
                    item.hasValidOk = false;
                }
            });
        }

        var validOne = function () {

            output.errorList = [];

            $(tagList).each(function (i, tagItem) {

                if (tagItem.isInValid == false) {
                    return;
                }
                if (tagItem.hasValidOk) {
                    return;
                }

                if (eval(tagItem.jsExtCode) == true) {
                    tagItem.hasValidOk = true;
                }

            });


        }

        output.valid = function () {

            isCallvalid = true;

            updateTagList(tagList, -1)

            validOne();
            opts.onValided(output.errorList);

            if (output.errorList.length == 0) {
                return true;
            }
            return false;
        }

        //Condiction ,可以扩展方法
        output.validCondiction = function (tag) {


            this.require = function (elementName) {
                var tagval = $(tag).val();
                if (tagval == null || tagval.trim() == "") {

                    output.errorList.push({
                        tag: this.tag,
                        msg: String.format("{0}不能为空!", elementName)
                    });
                    return false;
                }
                return true;

            };
            this.len = function (elementName, from, to) {

                var tagval = $(tag).val();
                if (tagval.length < from || tagval.length > to) {

                    output.errorList.push({
                        tag: this.tag,
                        msg: String.format("{0}的长度必须大于{1}位，小于{2}!", elementName, from, to)
                    });
                    return false;
                }

                return true;
            };

            //如果是ajax的验证，一定要同步的
            this.ajaxCheckName = function (postUrl) {

                var tagval = $(tag).val();
                var result = true;
                $.ajax({
                    type: "post",
                    url: postUrl,
                    async: false,
                    data: { phoneNum: tagval },
                    success: function (data) {
                        if (data.Tag != 1) {
                            result = false;
                            output.errorList.push({
                                tag: tag,
                                msg: data.Message
                            });
                        }
                    }

                });
                return result;

            };

            this.phoneNum = function () {
                var tagval = $(tag).val();

                var re = /^1\d{10}$/
                if (re.test(tagval) == false) {

                    output.errorList.push({
                        tag: tag,
                        msg: String.format("手机号码错误，请重新输入！")
                    });
                    return false;
                }

                return true;

            };

            this.same = function (tagid) {
                var tagval = $(tag).val();
                var samtagval = $("#" + tagid).val();
                if (tagval != samtagval) {
                    output.errorList.push({
                        tag: tag,
                        msg: String.format("两次密码输入不一致！")
                    });
                    return false;

                }
                return true;
            };



        }

        output.onValided= function()
        {
            opts.onValided(output.errorList);
        }

        //init
        init();


        return output;

    }
});



