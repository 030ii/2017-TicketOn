$(document).ready(function() {
    findPwd.init();
});
var findPwd = {
    init: function () {
        this.initEvent();
    },
    initEvent: function () {
        var _this = this;
        $(document).on('click touchend', '#findPwdModal input[type=submit]', this.findPwd(e));
    },
    findPwd: function(e) {
        var id = $("#findPwdModal").find("input[name=id]");
        e.preventDefault();
        if(!id.val()) {
            id.focus();
            swal(
              '미입력 오류',
              '입력하지 않은 정보가 있습니다!',
              'error'
            );
        } else {
            $.post("/findPwd", {id: id.val()}, function(data) {
                if(data) {
                    swal(
                      '성공',
                      '가입하신 이메일로 비밀번호를 전송하였습니다!',
                      'success'
                    ).then(function() {
                      location.href = '/';
                    });

                } else {
                    swal(
                      '실패',
                      '일치하는 정보가 없습니다!',
                      'info'
                    );
                }
            });
        }
    }
};
