$(document).ready(function() {
    post.init();

    var tel = $("#profile-tel");
    var img = $("#profile-image");
    var curPwd = $("#profile-password");
    var newPwd = $("#profile-password-new");
    var newPwdConfirm = $("#profile-password-new-confirm");
    var bank = $("#account-bank");
    var number = $("#account-number");
    var holder = $("#account-holder");

    $("form[name=mypage_fm] button[type=submit]").on('click', function(e) {
        page = $("form[name=mypage_fm] li[class=active]").index();

        switch(page) {
            case 0:
                if(!tel.val()) {
                    e.preventDefault();
                    tel.focus();
                    swal(
                        '미입력 오류',
                        '전화번호를 입력해주세요!',
                        'error'
                    );
                }
                break;
            case 1:
                e.preventDefault();
                if(!curPwd.val()) {
                    curPwd.focus();
                    swal(
                        '미입력 오류',
                        '현재 비밀번호를 입력해주세요!',
                        'error'
                    );
                } else if (!newPwd.val() || !newPwdConfirm.val()) {
                    newPwd.focus();
                    swal(
                        '미입력 오류',
                        '새로운 비밀번호를 입력해주세요!',
                        'error'
                    );
                } else if(newPwd.val().length < 8 || newPwd.val().length > 16) {
                    newPwd.focus();
                    swal(
                        '비밀번호 오류',
                        '비밀번호는 8~16자리만 가능합니다!',
                        'error'
                    );
                } else if (newPwd.val() != newPwdConfirm.val()) {
                    newPwd.focus();
                    swal(
                        '비밀번호 오류',
                        '비밀번호가 서로 다릅니다!',
                        'error'
                    );
                } else {
                    $.post('/mypage/changePwd?_method=PUT', {curPwd: curPwd.val(), newPwd: newPwd.val()}, function(data) {
                        if(data) {
                            swal(
                                '비밀번호 변경',
                                '비밀번호가 변경되었습니다!',
                                'success'
                            ).then(function() {
                                location.reload();
                            });
                        } else {
                            swal(
                                '비밀번호 오류',
                                '현재 비밀번호를 확인해주세요!',
                                'error'
                            ).then(function() {
                                location.reload();
                            });
                        }
                    });
                }
                break;
            case 2:
                e.preventDefault();
                if(bank.val() == "") {
                    bank.focus();
                    swal(
                        '미입력 오류',
                        '은행명을 입력해주세요!',
                        'error'
                    );
                } else if (number.val() == "") {
                    number.focus();
                    swal(
                        '미입력 오류',
                        '계좌번호를 입력해주세요!',
                        'error'
                    );
                } else if (holder.val() == "") {
                    holder.focus();
                    swal(
                        '미입력 오류',
                        '예금주를 입력해주세요!',
                        'error'
                    );
                } else {
                    $.post('/mypage/changeDeposit?_method=PUT', {bank: bank.val(), number: number.val(), holder: holder.val()}, function(data) {
                        if(data) {
                            swal(
                                '계좌정보 변경',
                                '계좌정보가 변경되었습니다!',
                                'success'
                            ).then(function() {
                                location.reload();
                            });
                        }
                    });
                }
                break;
        }
    });
});

var post = {
    init: function () {
        this.initEvent();
    },
    initEvent: function () {
        var _this = this;
        $(document).on('change touchend', '#profile-image', this.readURL);
    },
    readURL: function() {
        var file = $('#profile-image')[0].files[0];
        var reader  = new FileReader();
        reader.onload = function(e)  {
            $('#preview-image').attr('src', e.target.result);
        }
        reader.readAsDataURL(file);
    }
};
