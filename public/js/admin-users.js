$(document).ready(function() {
    users.init();
});
var users = {
    init: function () {
        this.initEvent();
    },
    initEvent: function () {
        var _this = this;
        $(document).on('click touchend', '.deleteUser', this.deleteUser);
    },
    deleteUser: function() {
      var uid = $(this).parent().parent().attr('id');
      swal({
        title: '정말 추방하시겠습니까?',
        text: "추방 시 되돌릴 수 없습니다!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '네, 추방합니다!',
        cancelButtonText: '아니오'
      }).then(function(result) {
          if (result) {
              $.post('/mypage?_method=DELETE', {uid: uid});
              swal(
                '추방완료!',
                '선택한 회원를 추방하였습니다.',
                'success'
              );
              location.reload();
          }
      });
    }
};
