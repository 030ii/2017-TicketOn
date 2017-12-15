$(document).ready(function() {
    var tel = $("#profile-tel");
    var img = $("#profile-image");
    var curPwd = $("#profile-password");
    var newPwd = $("#profile-password-new");
    var newPwdConfirm = $("#profile-password-new-confirm");
    var bank = $("#account-bank");
    var number = $("#account-number");
    var holder = $("#account-holder");

    $("form[name=mypage_fm] button[type=submit]").on('click', function(e) {
        e.preventDefault();
        page = $("form[name=mypage_fm] li[class=active]").index();

        switch(page) {
            case 0:
                if(!tel.val()) {
                    tel.focus();
                    swal(
                        '미입력 오류',
                        '전화번호를 입력해주세요!',
                        'error'
                    );
                } else {
                    $.post('/mypage/changeInfo?_method=PUT', {tel: tel.val(), img: img.val()}, function(data) {
                        if(data) {
                            swal(
                                '프로필 수정',
                                '프로필 수정 완료!',
                                'success'
                            );
                        }
                    });
                }
                break;
            case 1:
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
                                '비밀번호 변경 완료!',
                                'success'
                            );
                        } else {
                            swal(
                                '비밀번호 변경 오류',
                                '현재 비밀번호를 확인해주세요!',
                                'error'
                            );
                        }
                    });
                }
                break;
            case 2:
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
                    $.post('/mypage/deposits?_method=PUT', {bank: bank.val(), number: number.val(), holder: holder.val()}, function(data) {
                        if(data) {
                            swal(
                                '계좌 수정',
                                '계좌 수정 완료!',
                                'success'
                            );
                        }
                    });
                }
                break;
        }
    });
});
