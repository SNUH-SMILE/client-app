/*
* google map 생성성
*/


var map;
var mapOption = {};
var initMap = function(){
   Plugin.Location(function(result){
       var mapTag = document.getElementById("map");
       var lat = Number(result.latitude);
       var lng = Number(result.longitude) ;
       mapOption = {
           center: { lat: lat, lng: lng },
           mapTypeControl : false,
           zoom: 19
       }
       map = new google.maps.Map(mapTag,mapOption);
       google.maps.event.addListenerOnce(map,"idle",function(){
            M.execute('exWnCurrentLocationStart');//내위치 수신 시작
       });
        google.maps.event.addListener(map, 'click', function(event) {//맵에 클릭한 곳 마커 찍기
            if(!isEmpty(markerArray[SELECT_POSITION_MARKERID])){
               markerArray[SELECT_POSITION_MARKERID].setMap(null);
               delete markerArray[SELECT_POSITION_MARKERID];
            }
            mapMarker(event.latLng,false,SELECT_POSITION_MARKERID);
            //내가 찍은 좌표와의 현재 GPS 수신 좌표 거리 계산 (GPS 수신 오차 범위 체크하기 위해 잠시 넣어 놓음)
            $("#selPoint").html("위도 : "+ event.latLng.lat() + " 경도 : "+event.latLng.lng());
            if(!isEmpty(markerArray[CURRENT_LOCATION_MARKERID])){
                var curMarker = markerArray[CURRENT_LOCATION_MARKERID];
                var calDis = calcDistance(curMarker.getPosition(),event.latLng);
                $("#calPoint").html(calDis+"미터");
            }
//            placeMarker(event.latLng);
        });
   });
}


/*
* 맵에 마커 찍기(자가격리 위치 및 현위치 마커)
* CLState //현재 위치 마커 찍기 위한 값 true 현위치에 대한 마커 찍기 false 임의의 위치 마커 찍(Current Location)
* markerID 마커 아이디
*/
var markerArray = {};
var CURRENT_LOCATION_MARKERID = "CL";
var SELECT_POSITION_MARKERID = "SP";
var mapMarker = function(markLocation,CLState,markerID){
    // 마커로 사용할 이미지 주소
    var image = "../img/poi-my.png";
    var id = CURRENT_LOCATION_MARKERID;
    if(!CLState){//임의의 좌표에 마커찍기(사용자가 선택한 위치)
        id = markerID;
        image = "../img/poi-my_red.png";//'../img/ic-user-pin.png';
    }

    var marker = new google.maps.Marker({
        id:id,
        position: markLocation, // 마커가 위치할 위도와 경도(변수)
        map: map,
        icon: image // 마커로 사용할 이미지(변수)
    });
    //markerArray.push(marker);
    markerArray[id] = marker;
}

//현재 위치 change Listener
var i =1;
var OnCurrentLocation = function(lat,lng){
    var lat = Number(lat);
    var lng = Number(lng);
    var currLatLng = new google.maps.LatLng(lat,lng); // 마커가 위치할 위도와 경도
    if(!isEmpty(markerArray[CURRENT_LOCATION_MARKERID])){
       markerArray[CURRENT_LOCATION_MARKERID].setMap(null);
       delete markerArray[CURRENT_LOCATION_MARKERID];
    }
    mapMarker(currLatLng,true);
    //현재 위치가 수신시마다 내가 찍은 좌표와의 거리 계산 (GPS 수신 오차 범위 체크하기 위해 잠시 넣어 놓음)

    $("#curPoint").append("</br>위도 : "+ lat + " 경도 : "+lng);
    if(!isEmpty(markerArray[SELECT_POSITION_MARKERID])){
        var endMarker = markerArray[SELECT_POSITION_MARKERID];
        var calDis = calcDistance(currLatLng,endMarker.getPosition());
        $("#calPoint").html(calDis+"미터");
        console.log("위도 : "+ lat + " 경도 : "+lng +" 오차 범위 : "+calDis)
    }


}

/*
* 위도 경도를 이용한 주소가져 오기
*/
var geocoderInfo = function(lat,lng,cbFunc){
    var latlng = {lat:Number(lat),lng:Number(lng)};
    var geocoder = new google.maps.Geocoder;
    var data = {};
    data.location = latlng;
    geocoder.geocode(data,function(results,status){
        if(status ==="OK"){
            console.log("주소정보 : "+JSON.stringify(results));
            if(typeof cbFunc == "function"){
                cbFunc(results);
            }
        }else{
            MPopup.alert({message:"주소를 가져오지 못하였습니다."},"layer")
        }
    })

}
//주소로 위,경도 찾기
function codeAddress() {
	var geocoder = new google.maps.Geocoder();
	var address = document.getElementById("userAddr").value;//$("#userAddr").val();
	geocoder.geocode( { 'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			var lat = results[0]['geometry']['location']['lat']();
			var lng = results[0]['geometry']['location']['lng']();
			var addrLatLan = new google.maps.LatLng(lat,lng); // 마커가 위치할 위도와 경도
            console.log(address+"의 위도는 " + lat + " 이며, 경도는" + lng + " 입니다.");
            if(!isEmpty(markerArray[SELECT_POSITION_MARKERID])){
               markerArray[SELECT_POSITION_MARKERID].setMap(null);
               delete markerArray[SELECT_POSITION_MARKERID];
            }
            mapMarker(addrLatLan,false,SELECT_POSITION_MARKERID);

            //내가 찍은 좌표와의 현재 GPS 수신 좌표 거리 계산 (GPS 수신 오차 범위 체크하기 위해 잠시 넣어 놓음)
            $("#selPoint").html("위도 : "+ lat + " 경도 : "+lng);
            if(!isEmpty(markerArray[CURRENT_LOCATION_MARKERID])){
                var curMarker = markerArray[CURRENT_LOCATION_MARKERID];
                var calDis = calcDistance(curMarker.getPosition(),addrLatLan);
                $("#calPoint").html(calDis+"미터");
            }
			//map.setCenter(results[0].geometry.location);
		} else {
			alert('Geocode was not successful for the followingreason: ' + status);
		}
	});

}


/*
* 두 위치 사이 거리 계산
*/
var calcDistance = function(p1LatLng,p2LatLng){
    return (google.maps.geometry.spherical.computeDistanceBetween(p1LatLng, p2LatLng)).toFixed(2);//미터 단위로 반환


}
