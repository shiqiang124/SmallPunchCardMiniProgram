var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        parentLabel:'',
        childLabel:'',
        chooseLabelNum: 0,// 当前选择的标签数，最多三个
        labelNameString: "", // 当前选择的标签字符串形式,即label_name,label_name,用于提交服务器
        customLabelName: "", // 自定义的标签名
        showAddCustomLabelModel: false // 控制显示、隐藏添加自定义标签的自定义模态框
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        var that = this;

        wx.showLoading({
            title: '加载中...'
        });

        this.getAllTypeLabel(function (parentLabel,childLabel) {

            // 设置当前父级标签的子级标签全部隐藏 && 当前父级标签下被选中的子级标签字符串为空，即皆未被选中
            for (var i = 0 ; i< parentLabel.length;i++) {
                parentLabel[i].show = true;
                parentLabel[i].chooseLabelNameStr = "";
            }

            // 设置子级标签皆未被选中
            for (var i = 0; i < childLabel.length; i++)
                childLabel[i].choose = false;

            that.setData({
                projectName: options.project_name,
                privacyType: options.privacy_type,
                parentLabel: parentLabel,
                childLabel: childLabel,
                currId: -1
            });
            wx.hideLoading();
        });

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
    },

    // 动态获取打卡圈子类型所有标签
    getAllTypeLabel: function (callback) {
        wx.request({
            url: app.globalData.urlRootPath +
            "Admin/ProjectTypeLabelManage/getAllTypeLabel",

            success:function (response) {

                var parentLabel = response.data.data.parentLabel;
                var childLabel  = response.data.data.childLabel;
                // 成功后进行回调将获取的数据赋值到data当中
                return "function" === typeof callback &&
                    callback(parentLabel,childLabel);
            }
        });
    },

    // 显示、隐藏所属的子标签
    showChildLabel: function (e) {
        var that = this;

        // 获取当前父级标签列表的index,来显示、隐藏对应的子级标签列表
        // e.currentTarget参数标明了当前发生事件的控件，可以通过dataSet传值
        var  currIndex= e.currentTarget.dataset.parentindex;
        var parentLabel;
        parentLabel = that.data.parentLabel;

        //变换其打开、关闭的状态,即若是打开则关闭，关闭则打开 false为打开，true为关闭
        // parentLabel[currIndex].show = !parentLabel[currIndex].show || false;
        parentLabel[currIndex].show = parentLabel[currIndex].show === false;
        
        // 如果点击后是打开效果，则关闭其他的已经展开的
        if (parentLabel[currIndex].show === false) {
            this.packUp(parentLabel,currIndex);
        }
        
                
        that.setData({
            parentLabel:parentLabel
        });

    },

    //让所有的展开项，都变为收起
    packUp: function (data,currIndex) {
        //其他列表变为关闭状态
        for (var i = 0, len = data.length; i < len; i++) {
            if (i !== currIndex)
                data[i].show = true;
        }
    },

    // 子级标签被选中、取消时的点击事件，选中后修改显示样式以及设置显示已被选中的标签名
    childLabelBeChoose: function (e) {
        console.log(e);
        var that = this;

        // 当前被点击的标签的相关信息
        var childId     = e.currentTarget.dataset.childid,
            childName   = e.currentTarget.dataset.childlabelname,
            parentIndex = e.currentTarget.dataset.parentindex; // 当前被点击的子标签位于父标签的位置索引

        var num = that.data.chooseLabelNum; // 记录当前被选中的标签数

        var cLabel = that.data.childLabel,
            pLabel = that.data.parentLabel,
            allChooseLabelNameStr = that.data.labelNameString;

        for(var i = 0; i < cLabel.length; i++) {
            if (cLabel[i].id === childId) {
                // 原先为false则修改为true选中状态，true则修改为false未被选中状态
                if (cLabel[i].choose) {
                    cLabel[i].choose = false;
                    num -= 1;// 当前标签被取消选中，则选中标签数减一

                    // 将被取消选中的标签名从对应的父级标签的被选中子标签名字符串中删除
                    var labelNameArr = pLabel[parentIndex].chooseLabelNameStr.split(",");
                    var delAfterLabelNameArr = that.removeArray(labelNameArr,childName);
                    pLabel[parentIndex].chooseLabelNameStr = delAfterLabelNameArr.join(",");

                    // 从总的被选中的标签字符串中删除
                    labelNameArr = [];
                    delAfterLabelNameArr = [];
                    labelNameArr = allChooseLabelNameStr.split(",");
                    delAfterLabelNameArr = that.removeArray(labelNameArr,childName);
                    allChooseLabelNameStr = delAfterLabelNameArr.join(",");
                    console.log("del-all-str:"+ allChooseLabelNameStr);


                } else {
                    // 当已经选中三个标签之后则不可以再选中其他的
                    if (num === 3) {
                        wx.showToast({
                            title: '最多只能选择三个标签',
                            icon: "none"
                        });
                    } else {
                        cLabel[i].choose = true;
                        num += 1;

                        // 将被选中的标签添加至对应的父级标签的被选中子级标签名字符串
                        if (pLabel[parentIndex].chooseLabelNameStr === "")
                            pLabel[parentIndex].chooseLabelNameStr += childName;
                        else
                            pLabel[parentIndex].chooseLabelNameStr += ("," + childName);

                        // 添加至总的被选中的子级标签名字符串中
                        if (allChooseLabelNameStr === "")
                            allChooseLabelNameStr += childName;
                        else
                            allChooseLabelNameStr += ("," + childName);

                        console.log("add-all-str:" + allChooseLabelNameStr);
                    }
                }
            }
        }
        console.log("num:"+num);
        that.setData({
            childLabel: cLabel,
            parentLabel: pLabel,
            labelNameString: allChooseLabelNameStr,
            chooseLabelNum: num
        })
    },


    // 自定义函数 用于删除数组指定元素
    removeArray: function (labelNameArr,delLabelName) {
        var delAfterLabelNameStr = [];
        // 获取需要删除的元素的下标索引
        for (var i = 0; i < labelNameArr.length; i++) {
            if (labelNameArr[i] !== delLabelName) {
                delAfterLabelNameStr.push(labelNameArr[i])
            }
        }
        return delAfterLabelNameStr;
    },

    /**
     * 添加自定义标签模态对话框
     */
    showDialogBtn: function() {
        var that = this;

        // 如果已经存在系统内置的子标签已经选中了三个则不能添加自定义标签
        // 若是存在一个自定义标签外加两个系统标签则可以重新修改已经添加的自定义标签
        if (that.data.customLabelName === "") {
            if (that.data.chooseLabelNum === 3) {
                wx.showToast({
                    title: '最多只能选择三个标签',
                    icon: "none"
                });
                return ;
            }
        }


        this.setData({
            showAddCustomLabelModel: true
        })
    },
    /**
     * 弹出框蒙层截断touchmove事件
     */
    preventTouchMove: function () {
    },
    // 截断点击事件
    preventTab: function () {

    },
    /**
     * 隐藏模态对话框
     */
    hideModal: function () {
        this.setData({
            showAddCustomLabelModel: false
        });
    },

    // 输入框失去焦点响应事件，获取输入值检测格式（中文&&英文字符 15个字符以内）,格式正确保存至页面data中
    addCustomLabelEnd: function (e) {
        console.log(e);

        var that = this;
        var preCustomLabelName = that.data.customLabelName,
            num  = that.data.chooseLabelNum,
            labelNameStr = that.data.labelNameString;

        // 如果原先的自定义子标签名不为空，新输入的自定义标签名为空则代表删除原先的自定义标签
        if (preCustomLabelName !== "")
        {
            if (e.detail.value === "")
            {
                num -= 1;
                var labelNameArr = labelNameStr.split(",");
                var delAfterLabelNameArr = that.removeArray(labelNameArr,
                    preCustomLabelName);

                labelNameStr = delAfterLabelNameArr.join(",");

                that.data.chooseLabelNum  = num;
                that.data.labelNameString = labelNameStr;
            }

        }

        // 检测是否为十五个汉字、英文以内的字符
        var reg = /^[\u4e00-\u9fa5A-Za-z]{0,15}$/;
        if(reg.test(e.detail.value)){
            that.data.customLabelName = e.detail.value;

        } else {
            var title = "标签名格式错误!";
            if (e.detail.value.length > 15)
                title = "标签名限制十五字符!";

            wx.showToast({
                title: title,
                icon: "none"

            })
        }
    },


    /**
     * 对话框取消按钮点击事件
     */
    onCancel: function (e) {
        console.log(e);
        this.hideModal();
    },
    /**
     * 对话框确认按钮点击事件
     */
    onConfirm: function (e) {
        console.log(e);
        var that = this;

        var customLabelName = that.data.customLabelName,
            labelNameStr = that.data.labelNameString;




        // 只有用户输入的自定义标签不为空才能算是一个标签，被选标签数才能+1
        if (customLabelName !== "") {
            that.data.chooseLabelNum += 1;

            // 添加至总的选中子标签名字符串
            if (labelNameStr === "")
                labelNameStr += customLabelName;
            else
                labelNameStr += ("," + customLabelName);
        }
        console.log("num:" + that.data.chooseLabelNum);
        console.log("add-all-str:" + labelNameStr);


        that.setData({
            customLabelName: customLabelName,
            labelNameString: labelNameStr
        });

        this.hideModal();
    },

    // 创建打卡圈子按钮
    createPunchCardProject: function () {
        var that = this;

        wx.showLoading({
            title: "加载中...",
            mask: true
        });

        // 向服务器端发送请求执行创建打卡圈子
        wx.request({
            url: app.globalData.urlRootPath + "index/PunchCardProject/create",
            method: "post",
            data: {
                project_name:that.data.projectName,
                privacy_type: parseInt(that.data.privacyType),
                type_label: that.data.labelNameString,
                creator_id: parseInt(app.globalData.userInfo.id)

            },
            success:function (response) {
                wx.hideLoading();

                switch (response.statusCode) {
                    case 200:
                        // 创建成功则进入打卡圈子详情页，完善圈子介绍信息
                        var id = response.data.data.id;
                        wx.navigateTo({
                          url: '../stepThree/index' + '?projectId=' + id
                        });

                        break;

                    default:
                        var title = response.data.errMsg;
                        wx.showToast({
                            title: title,
                            icon: "none"
                        });
                        break;
                }

            },
            fail: function (response) {
                // 客户端发送请求失败才会进入这里
                wx.hideLoading();

                wx.showToast({
                    title: "网络异常!",
                    icon: "none"
                });
            }
        });
        console.log(that.data);
        console.log(app.globalData.userInfo.id);

    }



});