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
                      title: '로그인 성공',
                      text: '페이지를 불러오는 중 입니다.',
                      timer: 2000,
                      allowOutsideClick: false,
                      onOpen: () => {
                        swal.showLoading();
                      },
                      onClose: () => {
                        location.href = "/auction";
                      }
                    });
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
