$(document).ready(function() {
      var id = $("#findPwdModal").find("input[name=id]");

      $("#findPwdModal button[type=submit]").on('click', function(e) {
          e.preventDefault();
          if(id.val() == "") {
              id.focus();
              swal(
                '미입력 오류',
                '입력하지 않은 정보가 있습니다!',
                'error'
              );
          } else {
              $.post("/findID", {name: name.val(), tel: tel.val()}, function(data) {
                  if(data) {
                      swal(
                        '성공',
                        '가입하신 이메일로 비밀번호를 전송하였습니다!',
                        'success'
                      );
                  } else {
                      swal(
                        '실패',
                        '일치하는 정보가 없습니다!',
                        'info'
                      );
                  }
              });
          }
      });
});
