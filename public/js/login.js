$(document).ready(function() {
    var id = $("#loginModal").find("input[name=id]");
    var password = $("#loginModal").find("input[name=password]");

    $("#loginModal input[type=submit]").on('click', function(e) {
        e.preventDefault();
        if(id.val() == "") {
            id.focus();
            swal(
              '미입력 오류',
              '입력하지 않은 정보가 있습니다!',
              'error'
            );
        } else if(password.val() == "") {
            password.focus();
            swal(
              '미입력 오류',
              '입력하지 않은 정보가 있습니다!',
              'error'
            );
        } else {
            $.post('/login', {id: id.val(), password: password.val()}, function(data) {
                if(data) {
                    swal({
                      position: 'center',
                      type: 'success',
                      title: '환영합니다!',
                      showConfirmButton: false,
                      timer: 1500
                    });
                    setTimeout(function() {
                        location.href = "/auction";
                    }, 1500);
                } else {
                    swal(
                      '로그인 실패',
                      '아이디 혹은 비밀번호를 확인해주세요!',
                      'error'
                    );
                }
            });
        }
    });
});
