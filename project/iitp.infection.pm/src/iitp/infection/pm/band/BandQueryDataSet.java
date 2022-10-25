package iitp.infection.pm.band;

import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.ParseException;
import java.util.HashMap;

import iitp.infection.pm.samples.utils.CommUtils;

public class BandQueryDataSet {
    String CLASS_TAG = BandQueryDataSet.class.getSimpleName();
    public static boolean isDetailQuery = false;
    public BandQueryDataSet(){

    }
    /**
     * 스텝 데이터 쿼리 정보 JSON Set리
     * param 1 : 측정일자 / param 2 : 측정시각 / param 3 : 걸음수 / param 4 : 거리
    *
     * @return*/
    public JSONObject StepDataJsonSet(String checkDt,JSONArray jsonArray, float totDistance,int stepTotalCnt){
        JSONArray StepTimeList = new JSONArray();
        try {
            double distance = 0.0f;
            for(int i=0; i<jsonArray.length();i++){
                JSONObject obj = new JSONObject();
                JSONArray hourStepArray = new JSONArray(jsonArray.getString(i));
                int stepTime = hourStepArray.getInt(0);
                int stepCnt = hourStepArray.getInt(1);
                String stepTimeStr = new CommUtils().mmToHhMm(stepTime,"",true);
                if(isDetailQuery){//상세 조회시에만 사용
                    obj.put("resultDate",checkDt);//측정일자
                    distance = (totDistance * stepCnt)/stepTotalCnt;
                    distance = (Math.round(distance*100)/100.0);
                    obj.put("distance",distance);//거리
                }
                obj.put("resultTime",stepTimeStr);//측정시각
                obj.put("stepCount",stepCnt);//걸음수
                StepTimeList.put(obj);
                Log.d(CLASS_TAG, "StepDataJsonSet>> step minute TIME : "+stepTime);//분단위의 시간
                Log.d(CLASS_TAG, "StepDataJsonSet>> step HHMMSS TIME : "+stepTimeStr);//시간
                Log.d(CLASS_TAG, "StepDataJsonSet>> step CNT : "+stepCnt);//걸음수
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return new CommUtils().setJSONData("stepCountList",StepTimeList);
    }
    /**
     * 수면 데이터 쿼리 정보 JSON Set
     **/
    public JSONObject SleepDataJsonSet(String startDate, String endDate, int sleepTotTime, JSONArray sleepList){
        JSONObject resultObj = new JSONObject();
        JSONArray sleepListArray = new JSONArray();
        try {
            if(isDetailQuery){
                resultObj.put("resultStartDateTime",startDate);//수면시작 날짜
                resultObj.put("resultEndDateTime",endDate);//수면종료날짜
            }
            resultObj.put("totalSleepTime",new CommUtils().mmToHhMm(sleepTotTime,"",false));//수면 총 시간
            for(int i=0; i<sleepList.length();i++){
                JSONObject sleepListJson = new JSONObject();
                JSONArray sleep_time_status_array = new JSONArray(sleepList.get(i).toString());
                int startTime = Integer.valueOf(sleep_time_status_array.get(0).toString());
                int endTime = Integer.valueOf(sleep_time_status_array.get(1).toString());
                int sleepType = Integer.valueOf(sleep_time_status_array.get(2).toString());
                sleepListJson.put("sleepType",sleepType);//수면 타입 0:깊은잠, 1:얕은잠, 2:기상
                sleepListJson.put("sleepStartTime",new CommUtils().mmToHhMm(startTime,"",false));//각각의 수면 패턴의 수면 시작시간
                sleepListJson.put("sleepEndTime",new CommUtils().mmToHhMm(endTime,"",false));//각각의 수면 패턴의 수면 종료 시간
                sleepListArray.put(sleepListJson);
            }

            resultObj.put("sleepTimeList",sleepListArray);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return resultObj;
    }
    /**
     * 심박 데이터 쿼리 정보 JSON Set
     **/
    public JSONObject RateDataJsonSet(String checkDT,int time,int rate){
        JSONObject obj = new JSONObject();
        try {
            if(isDetailQuery){
                obj.put("resultDate",checkDT);
            }

            obj.put("resultTime",new CommUtils().mmToHhMm(time,"",true));
            obj.put("hr",rate);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return obj;
    }
    /**
     * 체온 데이터 쿼리 정보 JSON Set
     **/
    public JSONObject TempDataJsonSet(String checkDT,int time, float temp){
        JSONObject obj = new JSONObject();
        try {
            if(isDetailQuery){
                obj.put("resultDate",checkDT);
            }
            obj.put("resultTime",new CommUtils().mmToHhMm(time,"",true));
            obj.put("bt",temp);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return obj;
    }
    /**
     * 혈중산소포화도  데이터 쿼리 정보 JSON Set
     **/
    public JSONObject OxygenDataJsonSet(String date,int time,int spO2){
        JSONObject obj = new JSONObject();
        try {
            obj.put("resultDate",date);
            obj.put("resultTime",new CommUtils().mmToHhMm(time,"",false));
            obj.put("spO2",spO2);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return obj;
    }
    /**
     * 혈압  데터 쿼리 정보 JSON Set
     **/
    public JSONObject BloodDataJsonSet(String date,int time,int maxBlood,int minBlood){
        JSONObject obj = new JSONObject();
        try {
            if(isDetailQuery){
                obj.put("resultDate",date);
            }
            obj.put("resultTime",new CommUtils().mmToHhMm(time,"",true));
            obj.put("sbp",maxBlood);
            obj.put("dbp",minBlood);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return obj;
    }
}
