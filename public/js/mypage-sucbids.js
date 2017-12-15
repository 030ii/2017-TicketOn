$(document).ready(function() {
    sucbids.init();
});
var sucbids = {
    init: function () {
        this.initEvent();
    },
    initEvent: function () {
        var _this = this;
        $(document).on('click touchend', '.payAuction', this.payAuction);
    },
    payAuction: function() {
        var aid = $(this).parent().prev().attr('id');
        var price = $(this).parent().prev().children().eq(1).find("span").text();
        const {value: formValues} = await swal({
          title: '결제 도우미',
          html:
            '<p>결제 금액: ' + price + '원</p>' +
            '<input id="swal-input1" class="swal2-input" placeholder="예금주">' +
            '<input id="swal-input2" class="swal2-input" placeholder="카드번호 (xxxx-xxxx-xxxx-xxxx)">',
          focusConfirm: false,
          preConfirm: function() {
            return [
              $('#swal-input1').val(),
              $('#swal-input2').val()
            ]
          }
        });
        if (formValues) {
            swal(
              '결제 완료',
              '결제가 완료되었습니다!',
              'success'
            );
            $.post('/auction/pay', {aid: aid, price: price}, function(data) {
                if(data)
                  location.reload();
            });
        }

    }
};
