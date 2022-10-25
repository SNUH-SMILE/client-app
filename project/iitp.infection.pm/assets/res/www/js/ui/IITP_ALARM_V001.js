/**
 * @file : IITP_ALARM_V001.js 알림함
 * @author :choiyj
 * @date : 2021.11.30

 서버 EXT 발송 양식

2|https://us05web.zoom.us/j/2773927189?pwd=OVlNcXlOL0gvOFoxMjY0QS9VdTZnZz09

 */


var _onReady = function(){
	init.setView();
	init.setEvent();
};

var init = {
	setView : function(){
        drawList();
	},
	setEvent : function(){
        $("ul").on("click","li",function(){
            var url = $(this).data("url");
            MAPI.apps.browser(url);
        });
	}
};

function drawList(){
    var pushList = MAPI.data.storage("g","PUSH_RCV_LIST");
    var strbuffer = "";
    if(pushList.length > 0){
        $(".chart-none").addClass("none");

        for(var i = 0; i < pushList.length; i++){
            var row = pushList[i];
            strbuffer += '<li data-url="'+row.remoteURL+'">';
            strbuffer += '    <p class="alrm-list-item">';
            strbuffer += '        <span class="ttl">'+row.message+'</span>';
            strbuffer += '        <span class="date">'+moment(row.notification.saveTime).format(Definition.YMDFORMAT6)+'</span>';
            strbuffer += '    </p>';
            strbuffer += '</li>';
        }
        $("ul").html(strbuffer).removeClass("none");
    }else{
        $(".chart-none").removeClass("none");
        $("ul").addClass("none");
    }
}림