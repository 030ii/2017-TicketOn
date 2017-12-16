jQuery(function () {
    detail.init();
    // Init page helpers (Appear + Magnific Popup plugins)
    App.initHelpers(['appear', 'magnific-popup']);

});
var detail = {
    init: function() {
        this.initEvent();
    },
    initEvent: function () {
        var _this = this;
        this.showLoading();
        this.showTime();
        $(document).on('click touchend', '#bid', function(e){
            detail.doBid(e);
        });
        $(document).on('click touchend', '#deleteAuction', this.deleteAuction);
    },
    showLoading: function() {
        swal({
          title: '로딩 중',
          text: '페이지를 불러오는 중 입니다.',
          timer: 800,
          allowOutsideClick: false,
          onOpen: function() {
            swal.showLoading();
          }
        });
    },
    showTime: function() {
        var time = <%= time %>;
        var hour = parseInt(time / (60*60*1000));
        var min = parseInt((time / (60*1000)) % 60);
        var sec = parseInt((time / 1000) % 60);
        min = (min < 10) ? '0' + min : min;
        hour = (hour < 10) ? '0' + hour : hour;
        var timer = setInterval(function() {
            sec = (Number(sec) < 11) ? '0' + String(Number(sec) - 1) : String(Number(sec) - 1);
            if(sec == '0-1') {
                sec = '59';
                min = (Number(min) < 11) ? '0' + String(Number(min) - 1) : String(Number(min) - 1);
            }
            if(min == '0-1') {
                min = '59';
                hour = (Number(hour) < 11) ? '0' + String(Number(hour) - 1) : String(Number(hour) - 1);
            }
            if(hour == '0-1') {
                hour = '00';
                min = '00';
                sec = '00';
                $(".timer").siblings().css('color', 'red');
                $(".timer").siblings().text('경매가 마감되었습니다!');
                clearInterval(timer);
                <% if(auction.a_status == '0') { %>
                $.post('/auction/close?_method=PUT', {aid: <%= auction.aid %>}, function(data) {
                    if(data) {
                        swal({
                          title: '경매 마감',
                          text: '낙찰자: ' + data.u_name + ' / 낙찰가: ' + data.b_price + '원',
                          imageUrl: 'img/trophy.jpg',
                          imageWidth: 400,
                          imageHeight: 300,
                          imageAlt: 'Custom image',
                          animation: false,
                          allowOutsideClick: false,
                          allowEscapeKey: false
                        }).then(function() {
                            location.href = '/auction';
                        });
                    } else {
                        swal({
                          title: '경매 마감',
                          text: '입찰자가 아무도 없습니다.',
                          imageUrl: 'https://picsum.photos/400/200/?random',
                          imageWidth: 400,
                          imageHeight: 200,
                          imageAlt: 'Custom image',
                          animation: false,
                          allowOutsideClick: false,
                          allowEscapeKey: false
                        }).then(function() {
                            location.href = '/auction';
                        });
                    }
                });
                <% } %>
            }
            if(hour == '00' && Number(min) < 5 && Number(min) != 0) {
                $(".timer").css('color', 'red');
                $(".timer").siblings().text('마감시간이 임박했습니다!');
            }
            $(".timer").text(hour + ':' + min + ":" + sec);
        }, 1000);
    },
    doBid: function(e) {
        e.preventDefault();
        swal({
            title: $('.ctrl__counter-input').val() + '원',
            text: "정말 입찰하시겠습니까?",
            type: 'info',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#aaa',
            confirmButtonText: '네',
            cancelButtonText: '아니요'
        }).then(function(result) {
            if (result) {
                var aid = <%= auction.aid %>;
                var uid = <%= session.uid %>;
                var price = $('.ctrl__counter-input').val();
                $.post('/auction/bid', {aid: aid, uid: uid, price: price}, function(data) {
                    if(data) {
                        location.reload();
                    } else {
                        swal({
                          title: '입찰가 오류',
                          html: $('<div>')
                            .addClass('some-class')
                            .text('현재 입찰가보다 낮은 금액입니다!'),
                          animation: false,
                          customClass: 'animated tada'
                        });
                    }
                });
            }
        });
    },
    deleteAuction: function() {
        swal({
          title: '정말 삭제하시겠습니까?',
          text: "삭제 시 되돌릴 수 없습니다!",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: '네, 삭제합니다!',
          cancelButtonText: '아니오'
        }).then(function(result) {
            if (result) {
                swal(
                  '삭제완료!',
                  '경매를 삭제하였습니다.',
                  'success'
                );
                $.post('/auction?_method=DELETE', {aid: <%= auction.aid %>}, function(data) {
                    if(data)
                      location.href = (document.referrer.indexOf('put')) ? '/auction' : document.referrer;
                });
            }
        });
    }
};
