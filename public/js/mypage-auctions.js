$(document).ready(function() {
    auctions.init();
});
var auctions = {
    init: function () {
        this.initEvent();
    },
    initEvent: function () {
        var _this = this;
        this.setSuccessBid();
    },
    setSuccessBid: function() {
        <% for(var i = 0; i < bid.length; i++) { %>
            $("#<%= bid[i].aid %>").find("span").eq(1).text("<%= bid[i].b_price %>");
            if($("#<%= bid[i].aid %>").next().find("span").text() != "진행") {
                $("#<%= bid[i].aid %>").find("span").eq(3).text("<%= bid[i].u_name %>");
            }
        <% } %>
        <% for(var i = 0; i < bCount.length; i++) { %>
            $("#<%= bCount[i].aid %>").find("span").eq(2).text("<%= bCount[i].cnt %>");
        <% } %>
    }
};
