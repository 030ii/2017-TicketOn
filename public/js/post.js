$(document).ready(function() {
    post.init();
    // Init page helpers (BS Maxlength + Select2 + Tags Inputs + CKEditor + Appear + CountTo plugins)
    App.initHelpers(['maxlength']);
});

var post = {
    init: function () {
        this.initEvent();
    },
    initEvent: function () {
        var _this = this;
        $(document).on('change touchend', '#auction-image', this.readURL);
        $(document).on('click touchend', '#postAuctionBtn', function(e){
            post.postAuction(e);
        });
    },
    readURL: function() {
        var file = $('#auction-image')[0].files[0];
        var reader  = new FileReader();
        reader.onload = function(e)  {
            $('#preview-image').attr('src', e.target.result);
        }
        reader.readAsDataURL(file);
    },
    postAuction: function(e){
        var title = $("#auction-title");
        var category = $("#auction-category");
        var deadline = $("#auction-deadline");
        var content = $("#auction-content");

        if(!title.val()) {
            e.preventDefault();
            title.focus();
            swal(
                "미입력 오류",
                "제목을 입력해주세요!",
                "error"
            );
        } else if (!category.val()) {
            e.preventDefault();
            category.focus();
            swal(
                "미입력 오류",
                "분류를 선택해주세요!",
                "error"
            );
        } else if (!deadline.val()) {
            e.preventDefault();
            deadline.focus();
            swal(
                "미입력 오류",
                "경매기간을 선택해주세요!",
                "error"
            );
        } else if (!content.val()) {
            e.preventDefault();
            content.focus();
            swal(
                "미입력 오류",
                "내용을 입력해주세요!",
                "error"
            );
        } else {
            swal({
                position: 'center',
                type: 'success',
                title: '경매를 등록하였습니다!',
                showConfirmButton: false,
                timer: 1500
            });
        }
    }
};
