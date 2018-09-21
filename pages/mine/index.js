// pages/mine/index.js

var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        hideCommentInputView:'none',
        sendBtnAttr: {
            'allowSend': true
        },
        userInfo: {},

        // 打卡日记数据
        diaryLists: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        console.log("mine/index-全局数据:");
        console.log(app.globalData);

        this.setData({
            userInfo: app.globalData.userInfo,
            // 这里的打卡日记数据应该从服务器端获取
            diaryLists: [
                {
                    diaryDetailContent: '这是打卡日记111111111,哈哈哈哈哈哈哈哈哈哈啦啦啦啦',
                    likeUserInfo: {
                        "num": 20,
                        "info": [
                            {"nick_name": 'MYXuu1', "open_id": 111},
                            {"nick_name": 'MYXuu2', "open_id": 222},
                            {"nick_name": 'MYXuu3', "open_id": 333},
                            {"nick_name": 'MYXuu4', "open_id": 111},
                            {"nick_name": 'MYXuu5', "open_id": 222},
                            {"nick_name": 'MYXuu6', "open_id": 333},
                            {"nick_name": 'MYXuu7', "open_id": 111},
                            {"nick_name": 'MYXuu8', "open_id": 222},
                            {"nick_name": 'MYXuu9', "open_id": 222},
                            {"nick_name": 'MYXuu10', "open_id": 333}
                        ]
                    },
                    commentInfo: [
                        {
                            "content": '超级赞dnf哈哈哈哈哈哈啦啦啦啦哈哈哈哈哈哈哈哈哈哈',
                            "sender": {'nick_name': 'MYXu', 'open_id': 123},
                            'receiver': ''
                        },
                        {
                            "content": '谢谢!',
                            "sender": {'nick_name': 'MYXuu', 'open_id': 456},
                            'receiver': {'nick_name': 'MYXu', 'open_id': 123}
                        },
                        {
                            "content": '啦啦啦啦啦啦啦啦绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿',
                            "sender": {'nick_name': 'MYXu', 'open_id': 123},
                            'receiver': {'nick_name': 'MYXuu', 'open_id': 456}
                        },
                        {
                            "content": '测试一下啦啦啦啦啦啦啦啦绿啦绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿' +
                            '绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿',
                            "sender": {'nick_name': 'MYXu', 'open_id': 123},
                            'receiver': ''
                        }
                    ]
                },
                {
                    diaryDetailContent: '这是打卡日记222222222,哈哈哈哈哈哈哈哈哈哈啦啦啦啦',
                    likeUserInfo: {
                        "num": 20,
                        "info": [
                            {"nick_name": 'MYXuu1', "open_id": 111},
                            {"nick_name": 'MYXuu2', "open_id": 222},
                            {"nick_name": 'MYXuu3', "open_id": 333},
                            {"nick_name": 'MYXuu4', "open_id": 111},
                            {"nick_name": 'MYXuu5', "open_id": 222},
                            {"nick_name": 'MYXuu6', "open_id": 333},
                            {"nick_name": 'MYXuu7', "open_id": 111},
                            {"nick_name": 'MYXuu8', "open_id": 222},
                            {"nick_name": 'MYXuu9', "open_id": 222},
                            {"nick_name": 'MYXuu10', "open_id": 333}
                        ]
                    },
                    commentInfo: [
                        {
                            "content": '超级赞dnf哈哈哈哈哈哈啦啦啦啦哈哈哈哈哈哈哈哈哈哈',
                            "sender": {'nick_name': 'MYXu', 'open_id': 123},
                            'receiver': ''
                        },
                        {
                            "content": '谢谢',
                            "sender": {'nick_name': 'MYXuu', 'open_id': 456},
                            'receiver': {'nick_name': 'MYXu', 'open_id': 123}
                        },
                        {
                            "content": '啦啦啦啦啦啦啦啦绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿',
                            "sender": {'nick_name': 'MYXu', 'open_id': 123},
                            'receiver': {'nick_name': 'MYXuu', 'open_id': 456}
                        }
                    ]

                }
            ]
        })
    },

    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        wx.setNavigationBarTitle({
            title: '我的'
        })
    },


    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    onPageScroll: function (e) {
        this.setData({
            releaseFocus: false,
            hideCommentInputView:'none'
        })
    },




    // 进入我的主页，展示更为详细的用户信息
    intoUserInfoDetailPage: function (e) {
        console.log(e);
        wx.navigateTo({
            url: './detailPage/userInfo'
        })
    },

    //
    intoDiaryDetailPage: function () {
        wx.showToast({
            title: '进入打卡日记详情页'

        })
    },

    deleteDiary: function () {
        wx.showToast({
            title: '删除打卡日记'

        })

    },

    intoProjectDetailPage: function () {
        wx.showToast({
            title: '进入打卡圈子详情页'

        })
    },

    receiverComment: function(e){
        this.setData({
            releaseFocus: true,
            hideCommentInputView:'flex',
            replyTo:'回复XX',
            placeholderColor:'color:#C9C9C9;'
        })
    },
    // 发送评论
    sendComment: function () {
        wx.showToast({
          title: '发送成功'

        });
    },

    // 键盘输入时触发，检测输入内容是否为空，为空禁止发送按钮
    updateSendBtn: function (e) {
        console.log(e);
        if (e.detail.cursor !== 0) {
            this.setData({
                sendBtnAttr: {
                    'allowSend': false
                },
                placeholderColor:'color:transparent;'
            })
        } else {
            this.setData({
                sendBtnAttr: {
                    'allowSend': true
                },
                placeholderColor:'color:#C9C9C9;'
            })
        }
    }

});