$(document).ready(function() {
    var name = $("form[name=register_fm]").find("input[name=name]");
    var id = $("form[name=register_fm]").find("input[name=id]");
    var password = $("form[name=register_fm]").find("input[name=password]");
    var passwordCh = $("form[name=register_fm]").find("input[name=passwordCh]");
    var tel = $("form[name=register_fm]").find("input[name=tel]");
    var inputs = [name, id, password, passwordCh, tel];

    $("#registerModal button[type=submit]").on('click', function(e) {
        e.preventDefault();
        for(var i = 0; i < inputs.length; i++) {
            if(inputs[i].val() == "") {
                inputs[i].focus();
                swal(
                  '미입력 오류',
                  '입력하지 않은 정보가 있습니다!',
                  'error'
                );
                return;
            }
        }
        if(name.val().length < 2 || name.val().length > 6) {
            name.focus();
            swal(
              '이름 오류',
              '이름은 2~6자리만 가능합니다!',
              'error'
            );
        } else if (password.val().length < 8 || password.val().length > 16) {
            password.focus();
            swal(
              '비밀번호 오류',
              '비밀번호는은 8~16자리만 가능합니다!',
              'error'
            );
        } else if(password.val() != passwordCh.val()) {
            password.focus();
            swal(
              '비밀번호 오류',
              '비밀번호가 서로 다르네요!',
              'error'
            );
        } else {
            $.post('/register', {name: name.val(), id: id.val(), password: password.val(), tel: tel.val()}, function(data) {
                if(data) {
                    swal(
                      '아이디 중복',
                      '이미 존재하는 이메일이에요!',
                      'error'
                    )
                } else {
                    swal({
                      position: 'center',
                      type: 'success',
                      title: '회원가입에 성공하셨습니다!',
                      showConfirmButton: false,
                      timer: 1500
                    });
                    setTimeout(function() {
                      location.reload();
                    }, 1500);
                }
            });
        }
    });
});
