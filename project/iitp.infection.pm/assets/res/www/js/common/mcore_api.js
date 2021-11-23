/**
 * Core Api
 */


/**
 * Addon Api
 */

/*
* 모피어스 plugin Api
*/
var Plugin = {
    Location : function(callback){
        M.plugin("location").current({
            timeout: 1000,
            maximumAge: 1,
            callback: function( result ) {
                if ( result.status === 'NS' ) {
                    MPopup.alert({
                        message : "해당 기기는 geolocation 기능을 지원하지 않는 기기입니다."
                    },"layer");
                }
                else if ( result.status !== 'SUCCESS' ) {
                    if ( result.message ) {
                    }
                    else {
                        MPopup.alert({message : "현 위치 수신 오류"},"layer");
                    }
                }
                else {
                    if ( result.coords ) {
                        if(typeof callback =="function"){
                            callback(result.coords);
                        }
                    }
                    else {
                            console.log( 'It cann\'t get GPS Coords.' );
                    }
                }
            }
        });
    }
}
