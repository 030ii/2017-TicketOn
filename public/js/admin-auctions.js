$(document).ready(function() {
    <% for(var i = 0; i < bid.length; i++) { %>
        $("#<%= bid[i].aid %>").find("span").eq(1).text("<%= bid[i].b_price %>");
        $("#<%= bid[i].aid %>").find("span").eq(3).text("<%= bid[i].u_name %>");
    <% } %>
    <% for(var i = 0; i < bCount.length; i++) { %>
        $("#<%= bCount[i].aid %>").find("span").eq(2).text("<%= bCount[i].cnt %>");
    <% } %>
    $(".deleteAuction").on('click', function(e) {
        var aid = $(this).parent().prev().attr('id');
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
                  '선택한 경매를 삭제하였습니다.',
                  'success'
                );
                $.post('/auction?_method=DELETE', {aid: aid}, function(data) {
                    if(data)
                      location.reload();
                });
            }
        });
    });
});
