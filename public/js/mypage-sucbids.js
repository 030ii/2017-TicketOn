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
        swal.setDefaults({
          input: 'text',
          confirmButtonText: 'Next &rarr;',
          showCancelButton: true,
          progressSteps: ['1', '2', '3']
        });

        var steps = [
          {title: '카드사', text: '카드사를 입력해주세요'},
          {title: '예금주', text: '예금주를 입력해주세요'},
          {title: '카드번호', text: '카드번호를 입력해주세요'}
        ];
        swal.queue(steps).then(function(result) {
          swal.resetDefaults();
          if (result) {
            swal({
              title: '결제 완료!',
              html: '결제가 완료되었습니다.',
              confirmButtonText: '확인!'
            });
            $.post('/auction/pay', {aid: aid, price: price}, function(data) {
                if(data)
                  location.reload();
            });
          }
        });
    }
};
