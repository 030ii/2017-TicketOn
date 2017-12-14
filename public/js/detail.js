jQuery(function () {
    // Init page helpers (Appear + Magnific Popup plugins)
    App.initHelpers(['appear', 'magnific-popup']);

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
            $(".timer").siblings().text('경매가 마감되었습니다!');
            clearInterval(timer);
        }
        if(hour == '00' && Number(min) < 5) {
            $(".timer").eq(<%=i%>).css('color', 'red');
        }
        $(".timer").text(hour + ':' + min + ":" + sec);
    }, 1000);

    $("form[name=bid] button[type=submit]").on('click', function(e) {
        console.log('start');
        e.preventDefault();
        swal({
            title: $(this).siblings().val() + '원',
            text: "정말 입찰하시겠습니까?",
            type: 'info',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#aaa',
            confirmButtonText: '네',
            cancelButtonText: '아니요'
        }).then(function (result) {
            if (result.value) {
                var aid = <%= auction.aid %>;
                var uid = <%= session.uid %>;
                var price = $(this).siblings().val();
                console.log('results: ', aid, uid, price);
                $.post('/auction/bid', {aid: aid, uid: uid, price: price}, function(data) {
                    if(data) {
                      console.log('true: ', data);
                    } else {
                        console.log('false: ', data);
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
        console.log('end');
    });
});
