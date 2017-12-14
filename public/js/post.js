$(window).ready(function() {
    post.init();
});

var post = {
    init: function () {
        this.initEvent();
    },

    initEvent: function () {
        var _this = this;

        $(document).on('change touchend', '#example-file-input', this.readURL);
    },

    readURL: function() {
        var file = document.getElementById('example-file-input').files[0];
        var reader  = new FileReader();
        reader.onload = function(e)  {
            $('#post-image').attr('src', e.target.result);
        }
        reader.readAsDataURL(file);
    }
};
