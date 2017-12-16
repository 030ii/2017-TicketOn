$(document).ready(function() {
    incomes.init();
});
var incomes = {
    init: function () {
        this.initEvent();
    },
    initEvent: function () {
        var _this = this;
        $(document).on('click touchend', '.customer', this.showCustomer);
    },
    showCustomer: function () {
        var uid = $(this).attr('id');
        $.get('/info', {uid: uid}, function(data) {
            if(data) {
                swal({
                  title: data.u_name,
                  text: "E-mail: " + data.u_id + " / Tel: " + data.u_tel,
                  imageUrl: 'uploads/' + data.u_img,
                  imageWidth: 400,
                  imageHeight: 200,
                  imageAlt: 'Custom image',
                  animation: false
                });
            } else {
                swal(
                  '조회 실패',
                  '존재하지 않는 회원입니다!',
                  'error'
                );
            }
        });
    }
};
