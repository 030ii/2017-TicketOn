$(document).ready(function() {
      var name = $("#findIdModal").find("input[name=name]");
      var tel = $("#findIdModal").find("input[name=tel]");

      $("#findIdModal input[type=submit]").on('click', function(e) {
          e.preventDefault();
          if(!name.val()) {
              name.focus();
              swal(
                '미입력 오류',
                '입력하지 않은 정보가 있습니다!',
                'error'
              );
          } else if(!tel.val()) {
              tel.focus();
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
                        '찾으시는 이메일은 [' + data + ']입니다!',
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
