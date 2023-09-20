package iitp.infection.pm.net.data.location;


import com.google.gson.annotations.SerializedName;


/**
 * LocationInfo
 * return 정의
 * code / message
 *  00 / GPS업로드에 성공했습니다.
 *  21 / 내원중인 격리/입소내역이 존재하지 않습니다.
 *  22 / 중복 격리/ 입소내역이 존재합니다
 *  31 / GPS 업로드에 실패하였습니다
 *  99 / 로그인 아이디가 누락되었습니다.
 */
public class LocationInfo {

    @SerializedName("loginId")
    public String loginId; // 로그인 아이디
    @SerializedName("resultDate")
    public String resultDate; //측정일자   YYYYMMDD
    @SerializedName("resultTime")
    public String resultTime; //측정시간   HHHHmmss
    @SerializedName("lat")
    public String lat; // 위도
    @SerializedName("lng")
    public String lng; // 경도
//----------------------return----------------------------
    @SerializedName("code")
    public String code; // 코드

    @SerializedName("message")
    public String message; // 메시지

    @SerializedName("interval")
    public String interval; // 데이터 동기화 스케쥴 주기 (초단위 기본 10분)

    @Override
    public String toString() {
        StringBuilder stringBuilder = new StringBuilder(super.toString());
        stringBuilder.append("\n");
        stringBuilder.append("[loginId = " + loginId + "]\n");
        stringBuilder.append("[resultDate = " + resultDate + "]\n");
        stringBuilder.append("[resultTime = " + resultTime + "]\n");
        stringBuilder.append("[lat = " + lat + "]\n");
        stringBuilder.append("[lng = " + lng + "]\n");
//----------------------return----------------------------
        stringBuilder.append("[code = " + code + "]\n");
        stringBuilder.append("[message = " + message + "]\n");
        stringBuilder.append("[interval = " + interval + "]\n");
        return stringBuilder.toString();
    }

}
