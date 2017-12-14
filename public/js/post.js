$(window).ready(function() {
    post.init();
});

var post = {
    init: function () {
        this.initEvent();
    },

    initEvent: function () {
        var _this = this;

        $(document).on('change touchend', '#auction-image', this.readURL);
    },

    readURL: function() {
        var file = $('#auction-image')[0].files[0];
        var reader  = new FileReader();
        reader.onload = function(e)  {
            $('#preview-image').attr('src', e.target.result);
        }
        reader.readAsDataURL(file);
    }
};
