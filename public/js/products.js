$(document).ready(function () {
    // Init page helpers (Appear plugin)
    App.initHelpers('appear');

    swal({
      title: '로딩 중',
      text: '페이지를 불러오는 중 입니다.',
      timer: 1000,
      allowOutsideClick: false,
      onOpen: () => {
        swal.showLoading();
      }
    });

    $("#category li").on('click', function(e) {
        var category = $(this).index();
        switch(category) {
            case 0:
              showCategory("전체");
              break;
            case 1:
              showCategory("뮤지컬/연극");
              break;
            case 2:
              showCategory("영화");
              break;
            case 3:
              showCategory("전시/체험");
              break;
            case 4:
              showCategory("콘서트/마술");
              break;
            case 5:
              showCategory("외식/편의점");
              break;
            case 6:
              showCategory("놀이동산/컨텐츠");
              break;
            case 7:
              showCategory("뷰티/생활");
              break;
        }
    });
    function showCategory(category) {
        if(category == "전체") {
            $(".auction").css('display', 'block');
            return;
        }
        $(".auction").css('display', 'none');
        $(".auction p:contains('" + category + "')").parent().parent().parent().parent().css('display', 'block');
    }

    var timers = []
        , times = []
        , hours = []
        , mins = []
        , secs = [];

    <% for (var i = 0; i < time.length; i++) { %>
        times[<%=i%>] = <%= time[i] %>;
        hours[<%=i%>] = parseInt(times[<%= i %>] / (60*60*1000));
        mins[<%=i%>] = parseInt((times[<%= i %>] / (60*1000)) % 60);
        secs[<%=i%>] = parseInt((times[<%= i %>] / 1000) % 60);
        mins[<%=i%>] = (mins[<%=i%>] < 10) ? '0' + mins[<%=i%>] : mins[<%=i%>];
        hours[<%=i%>] = (hours[<%=i%>] < 10) ? '0' + hours[<%=i%>] : hours[<%=i%>];

        timers[<%=i%>] = setInterval(function() {
            secs[<%=i%>] = (Number(secs[<%=i%>]) < 11) ? '0' + String(Number(secs[<%=i%>]) - 1) : String(Number(secs[<%=i%>]) - 1);
            if(secs[<%=i%>] == '0-1') {
                secs[<%=i%>] = '59';
                mins[<%=i%>] = (Number(mins[<%=i%>]) < 11) ? '0' + String(Number(mins[<%=i%>]) - 1) : String(Number(mins[<%=i%>]) - 1);
            }
            if(mins[<%=i%>] == '0-1') {
                mins[<%=i%>] = '59';
                hours[<%=i%>] = (Number(hours[<%=i%>]) < 11) ? '0' + String(Number(hours[<%=i%>]) - 1) : String(Number(hours[<%=i%>]) - 1);
            }
            if(hours[<%=i%>] == '0-1') {
                hours[<%=i%>] = '00';
                mins[<%=i%>] = '00';
                secs[<%=i%>] = '00';
                clearInterval(timers[<%=i%>]);
            }
            if(hours[<%=i%>] == '00' && Number(mins[<%=i%>]) < 5) {
                $(".timer").eq(<%=i%>).css('color', 'red');
            }
            $(".timer").eq(<%=i%>).text(hours[<%=i%>] + ':' + mins[<%=i%>] + ':' + secs[<%=i%>]);
        }, 1000);
    <% } %>
});
