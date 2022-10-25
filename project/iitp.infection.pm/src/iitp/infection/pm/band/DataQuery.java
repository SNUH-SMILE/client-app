package iitp.infection.pm.band;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.SQLException;
import android.database.sqlite.SQLiteDatabase;
import android.util.Log;

import com.yc.pedometer.info.OxygenInfo;
import com.yc.pedometer.info.RateOneDayInfo;
import com.yc.pedometer.info.SleepTimeInfo;
import com.yc.pedometer.info.StepInfo;
import com.yc.pedometer.info.TemperatureInfo;
import com.yc.pedometer.sdk.UTESQLOperate;
import com.yc.pedometer.utils.CalendarUtils;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.Serializable;
import java.lang.reflect.Array;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.util.ArrayList;

import iitp.infection.pm.database.DBConfig;
import iitp.infection.pm.database.DBHelper;
import iitp.infection.pm.samples.utils.CommUtils;

public class DataQuery {
    private String CLASS_TAG = DataQuery.class.getSimpleName();
    private Context mContext;
    DBHelper myDb;
//    private String DB_FILE_NAME = "pedometer.db";
//    private int DB_VERSION = 13;
    BandQueryDataSet mBandQueryDataSet = new BandQueryDataSet();
    public DataQuery(Context context,String dbNM,int dbVer){
        mContext = context;
        myDb = new DBHelper(mContext,dbNM,dbVer);
    }
    /**
    * 스텝 쿼리
    **/
    public void queryStepInfo(UTESQLOperate mySQLOperate,String queryDate){
        if(queryDate.isEmpty()){
            queryDate = CalendarUtils.getCalendar(0);
        }
        StepInfo stepTimeInfo = mySQLOperate.queryStepInfo(queryDate);
        if(stepTimeInfo != null){

        }else{

        }
    }

    /**
     * 수면정보 쿼리  CalendarUtils.getCalendar(0) 당일
     * CalendarUtils.getCalendar(-1)하루 전
     * CalendarUtils.getCalendar(-2)이틀 전
     */
    public void querySleepInfo(UTESQLOperate mySQLOperate,String queryDate,boolean detailQueryAble) {
        SleepTimeInfo sleepTimeInfo;
        if(queryDate.isEmpty()){
            queryDate = CalendarUtils.getCalendar(0);
        }
        sleepTimeInfo = mySQLOperate.querySleepInfo(queryDate);
        int deepTime, lightTime, awakeCount, sleepTotalTime;
        if (sleepTimeInfo != null) {
            deepTime = sleepTimeInfo.getDeepTime();
            lightTime = sleepTimeInfo.getLightTime();
            awakeCount = sleepTimeInfo.getAwakeCount();
            sleepTotalTime = sleepTimeInfo.getSleepTotalTime();

            int[] colorArray = sleepTimeInfo.getSleepStatueArray();// 绘图中不同睡眠状态可用不同颜色表示，颜色自定义
            int[] timeArray = sleepTimeInfo.getDurationTimeArray();
            int[] timePointArray = sleepTimeInfo.getTimePointArray();

            Log.d(CLASS_TAG, "Calendar=" + CalendarUtils.getCalendar(0)
                    + ",timeArray =" + timeArray + ",timeArray.length ="
                    + timeArray.length + ",colorArray =" + colorArray
                    + ",colorArray.length =" + colorArray.length
                    + ",timePointArray =" + timePointArray
                    + ",timePointArray.length =" + timePointArray.length);

            double total_hour = ((float) sleepTotalTime / 60f);
            DecimalFormat df1 = new DecimalFormat("0.0");// 保留1位小数，带前导零

            int deep_hour = deepTime / 60;
            int deep_minute = (deepTime - deep_hour * 60);
            int light_hour = lightTime / 60;
            int light_minute = (lightTime - light_hour * 60);
            int active_count = awakeCount;
            String total_hour_str = df1.format(total_hour);

            if (total_hour_str.equals("0.0")) {
                total_hour_str = "0";
            }
            Log.d(CLASS_TAG, "total_hour_str =" + total_hour_str+", deep_hour="+deep_hour+", deep_minute="+deep_minute+", light_hour="+light_hour+", light_minute="+light_minute+", active_count="+active_count);
        } else {
            Log.d(CLASS_TAG, "sleepTimeInfo =" + sleepTimeInfo);
        }
    }

    /*
     * 심박 측정 당시의 최신 심박, max 심박, min 심박, 평균 심박
     */
    public void UpdateUpdataRateMainUI(UTESQLOperate mySQLOperate,String queryDate) {
        if(queryDate.isEmpty()){
            queryDate = CalendarUtils.getCalendar(0);
        }
        RateOneDayInfo mRateOneDayInfo = mySQLOperate.queryRateOneDayMainInfo(queryDate);
        if (mRateOneDayInfo != null) {
            int currentRate = mRateOneDayInfo.getCurrentRate();
            int lowestValue = mRateOneDayInfo.getLowestRate();
            int averageValue = mRateOneDayInfo.getVerageRate();
            int highestValue = mRateOneDayInfo.getHighestRate();
        } else {
        }
    }


    /**
     * 스텝 정보 테이블 직접 쿼리(밴드 업체에서 제공한 SDK를 통한 생성된 DB에서 조회)
     **/
    public JSONObject queryStepCustom(String queryDate){
        String sql;
        Cursor cursor;
        JSONObject resultObj = new JSONObject();

        if(queryDate.isEmpty()){
            queryDate = CalendarUtils.getCalendar(0);
        }
        sql ="SELECT * FROM step_total_table WHERE date='"+queryDate+"'";
        cursor = myDb.queryData(sql);
        while (cursor.moveToNext()){
            String hour_details_array = cursor.getString(cursor.getColumnIndex("hour_details_array"));//시간별 걸음수
            float stepDistance = cursor.getFloat(cursor.getColumnIndex("distance"));//당일 총 거리
            int stepTotalCnt = cursor.getInt(cursor.getColumnIndex("step"));//당일 총 걸음수
            String date = cursor.getString(cursor.getColumnIndex("date"));//날짜
            Log.d(CLASS_TAG, "queryStepCustom>> hour_details_array : "+hour_details_array+"  stepDistance : "+ stepDistance +"  stepTotalCnt:"+stepTotalCnt);
            try {
                JSONArray hourDetailArray = new JSONArray(hour_details_array);
                resultObj = mBandQueryDataSet.StepDataJsonSet(date,hourDetailArray,stepDistance,stepTotalCnt);
            } catch (JSONException e) {
                e.printStackTrace();
            }

        }
        cursor.close();
        return resultObj;
    }
    /**
     * 스텝 정보 테이블 직접 쿼리(공통 테이블에서 조회)
     **/
    public JSONObject queryCommDbStep(String queryDate,String bandAddr){
        String sql;
        Cursor cursor;
        JSONArray StepTimeList = new JSONArray();
        DBHelper comDB = new DBHelper(mContext, DBConfig.COM_DB_NAME,1);
        if(queryDate.isEmpty()){
            queryDate = CalendarUtils.getCalendar(0);
        }
        sql ="SELECT * FROM sbSyncStep WHERE sDate='"+queryDate+"' AND sDeviceId = '"+bandAddr+"'";
        cursor = comDB.queryData(sql);
        while (cursor.moveToNext()){
            JSONObject jsonDt = new JSONObject();
            try {
                if(BandQueryDataSet.isDetailQuery){
                    jsonDt.put("resultDate",cursor.getString(cursor.getColumnIndex("sDate1")));//날짜
                    jsonDt.put("distance",cursor.getString(cursor.getColumnIndex("sV2")));//거리
                }
                jsonDt.put("resultTime",cursor.getString(cursor.getColumnIndex("sTime1")));//시간
                jsonDt.put("stepCount",cursor.getString(cursor.getColumnIndex("sV1")));//걸음수
                StepTimeList.put(jsonDt);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        cursor.close();
        return new CommUtils().setJSONData("stepCountList",StepTimeList);
    }
    /**
     * 서버 전송을 위한 스텝 정보 테이블 직접 쿼리(공통 테이블에서 조회)
     **/
    public JSONObject serverSendQueryCommDbStep(){
        String sql;
        Cursor cursor;
        JSONArray StepTimeList = new JSONArray();
        DBHelper comDB = new DBHelper(mContext, DBConfig.COM_DB_NAME,1);
        sql ="SELECT rowid,* FROM sbSyncStep WHERE  sSyncServer = 0";//서버 동기화 하지 않은 데이
        cursor = comDB.queryData(sql);
        while (cursor.moveToNext()){
            Log.d(CLASS_TAG,"queryCommDbStep() rowid: "+cursor.getInt(cursor.getColumnIndex("rowid")));
            ContentValues cv = new ContentValues();
            cv.put("sSyncServer",2);
            comDB.updateData("sbSyncStep",cv,"ROWID",cursor.getString(cursor.getColumnIndex("rowid")));
            JSONObject jsonDt = new JSONObject();
            try {
                jsonDt.put("resultDate",cursor.getString(cursor.getColumnIndex("sDate1")));//날짜
                jsonDt.put("resultTime",cursor.getString(cursor.getColumnIndex("sTime1")));//시간
                jsonDt.put("distance",cursor.getString(cursor.getColumnIndex("sV2")));//거리
                jsonDt.put("stepCount",cursor.getString(cursor.getColumnIndex("sV1")));//걸음수
                jsonDt.put("deviceId",cursor.getString(cursor.getColumnIndex("sDeviceId")));//디바이스 ID
                StepTimeList.put(jsonDt);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        cursor.close();
        return new CommUtils().setJSONData("stepCountList",StepTimeList);
    }
    /**
     * 스텝 정보 테이블 직접 쿼리(전체 데이터)
     * 밴드 -> 폰 DB로 싱크 시 밴드 업체에서 제공된 SDK 내부에서 직접 DB에 저장하는 데이터
     * 공통 DB 파일로 insert 하기 위해
    */
    public void queryAllStepInsert(String bandAddr){
        String sql="SELECT * FROM step_total_table";
        Cursor cursor;
        DBHelper comDB = new DBHelper(mContext, DBConfig.COM_DB_NAME,1);
        cursor = myDb.queryData(sql);
        while (cursor.moveToNext()){
            String hour_details_array = cursor.getString(cursor.getColumnIndex("hour_details_array"));//시간별 걸음수
            float stepTotDistance = cursor.getFloat(cursor.getColumnIndex("distance"));//당일 총 거리
            int stepTotalCnt = cursor.getInt(cursor.getColumnIndex("step"));//당일 총 걸음수
            String date = cursor.getString(cursor.getColumnIndex("date"));//날짜
            Log.d(CLASS_TAG, "queryStepCustom>> hour_details_array : "+hour_details_array+"  stepDistance : "+ stepTotDistance +"  stepTotalCnt:"+stepTotalCnt);
            if(date.isEmpty()){
               break;
            }
            try {
                double distance = 0.0f;
                JSONArray hourDetailArray = new JSONArray(hour_details_array);
                for (int i=0; i<hourDetailArray.length();i++){
                    JSONArray hourStepArray = hourDetailArray.getJSONArray(i);
                    int stepTime = hourStepArray.getInt(0);
                    String stepTimeStr = new CommUtils().mmToHhMm(stepTime,"",true);
                    int stepCnt = hourStepArray.getInt(1);
                    distance = (stepTotDistance * stepCnt) / stepTotalCnt;
                    distance = (Math.round(distance*100)/100.0);
                    String sqlStr = "INSERT OR REPLACE INTO sbSyncStep (sDeviceId,sDate,sDate1,sTime1,sV1,sV2) VALUES ('"+bandAddr+"','"+date+"','"+date+"','"+stepTimeStr+"','"+stepCnt+"','"+distance+"')";
                    comDB.insertAndReplace(sqlStr);
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }

        }
        cursor.close();
    }
    /**
     * 스텝 정보 단일 저장 사용자 스텝이 변화가 있는 경우 공통 DB(String COM_DB_NAME = "SmartBand.db")적재
     **/
    public void changeStepInsert(String bandAddr, JSONObject info) {
        DBHelper comDB = new DBHelper(mContext, DBConfig.COM_DB_NAME,1);
        try {
            String date = info.getString("resultDate");
            String time = info.getString("resultTime");//시간;
            String stepCount = info.getString("stepCount");//걸음수
            String distance = info.getString("distance");//거리
            String sqlStr = "INSERT OR REPLACE INTO sbSyncStep (sDeviceId,sDate,sDate1,sTime1,sV1,sV2) VALUES ('"+bandAddr+"','"+date+"','"+date+"','"+time+"','"+stepCount+"','"+distance+"')";
            comDB.insertAndReplace(sqlStr);
            Log.d(CLASS_TAG,"changeStepInsert()");
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
    /**
     * 수면 정보 테이블 직접 쿼리
     **/
    public JSONObject querySleepCustom(String queryDate) {
        String sql,endDate;
        Cursor cursor;
        JSONObject resultObj = new JSONObject();
        if(queryDate.isEmpty()) {
            queryDate = CalendarUtils.getCalendar(0);
        }
        sql ="SELECT * FROM sleep_total_table WHERE date='"+queryDate+"'";
        cursor = myDb.queryData(sql);
        while (cursor.moveToNext()){
            try {
                String sleep_time_status_array = cursor.getString(cursor.getColumnIndex("sleep_time_status_array"));
                String sleepEndDate = cursor.getString(cursor.getColumnIndex("date"));
                String sleepStartDate = sleepEndDate;//new CommUtils().dateCal(sleepEndDate,-1);
                int sleepTotalTime = cursor.getInt(cursor.getColumnIndex("time"));
                JSONArray sleepTimeStatusArray = new JSONArray(sleep_time_status_array);
                String startTime = new JSONArray(sleepTimeStatusArray.get(0).toString()).get(0).toString();
                if(startTime.length() == 4){
                    sleepStartDate = new CommUtils().dateCal(sleepEndDate,-1);
                }
                Log.d(CLASS_TAG,"querySleepCustom() startTime:"+startTime);
                resultObj = mBandQueryDataSet.SleepDataJsonSet(sleepStartDate,sleepEndDate,sleepTotalTime,sleepTimeStatusArray);
            } catch (JSONException e) {
                e.printStackTrace();
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }
        cursor.close();
        return resultObj;
    }
    /**
     * 수면 정보 테이블 직접 쿼리
     **/
    public JSONObject queryCommDbSleep(String queryDate,String bandAddr){
        String sql;
        Cursor cursor;
        JSONObject resultObj = new JSONObject();
        JSONArray SleepTimeList = new JSONArray();
        DBHelper comDB = new DBHelper(mContext, DBConfig.COM_DB_NAME,1);
        if(queryDate.isEmpty()){
            queryDate = CalendarUtils.getCalendar(0);
        }
        sql ="SELECT * FROM sbSyncSleep WHERE sDate='"+queryDate+"' AND sDeviceId = '"+bandAddr+"'";
        cursor = comDB.queryData(sql);
        while (cursor.moveToNext()){
            JSONObject jsonDt = new JSONObject();
            try {
                Log.d(CLASS_TAG,"queryCommDbSleep() cursor.getPosition :"+cursor.getPosition());
                if(cursor.getPosition() == 0){
                    if(BandQueryDataSet.isDetailQuery){

                    }
                    Log.d(CLASS_TAG,"queryCommDbSleep() totalSleepTime:"+cursor.getString(cursor.getColumnIndex("sV2")));
                    //jsonDt.put("totalSleepTime",cursor.getString(cursor.getColumnIndex("sV2")));//수면 전체 시간
                    new CommUtils().setJSONData("totalSleepTime",cursor.getString(cursor.getColumnIndex("sV2")));
                }
                jsonDt.put("sleepStartDate",cursor.getString(cursor.getColumnIndex("sDate1")));//시작날짜
                jsonDt.put("sleepEndDate",cursor.getString(cursor.getColumnIndex("sDate2")));//종날짜
                jsonDt.put("sleepStartTime",cursor.getString(cursor.getColumnIndex("sTime1")));//수면 시작 시간
                jsonDt.put("sleepEndTime",cursor.getString(cursor.getColumnIndex("sTime2")));//수면 종료 시간
                jsonDt.put("sleepType",cursor.getString(cursor.getColumnIndex("sV1")));//수면 상태

                SleepTimeList.put(jsonDt);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        cursor.close();
        return new CommUtils().setJSONData("sleepTimeList",SleepTimeList);
    }
    /**
     * 서버 전송을 위한 수면 정보 테이블 직접 쿼리(SmartBand.db 공통)
     **/
    public JSONObject serverSendQueryCommDbSleep(){
        String sql;
        Cursor cursor;
        JSONArray SleepTimeList = new JSONArray();
        DBHelper comDB = new DBHelper(mContext, DBConfig.COM_DB_NAME,1);
        sql ="SELECT rowid,* FROM sbSyncSleep WHERE sSyncServer = 0";
        cursor = comDB.queryData(sql);
        while (cursor.moveToNext()){
            ContentValues cv = new ContentValues();
            cv.put("sSyncServer",2);
            comDB.updateData("sbSyncSleep",cv,"ROWID",cursor.getString(cursor.getColumnIndex("rowid")));
            JSONObject jsonDt = new JSONObject();
            try {
                jsonDt.put("resultStartDate",cursor.getString(cursor.getColumnIndex("sDate1")));//시작날짜
                jsonDt.put("resultStartTime",cursor.getString(cursor.getColumnIndex("sTime1")));//수면 시작 시간
                jsonDt.put("resultEndDate",cursor.getString(cursor.getColumnIndex("sDate2")));//종료날짜
                jsonDt.put("resultEndTime",cursor.getString(cursor.getColumnIndex("sTime2")));//수면 종료 시간
                //jsonDt.put("totalSleepTime",cursor.getString(cursor.getColumnIndex("sV2")));//수면 전체 시간
                jsonDt.put("sleepType",cursor.getString(cursor.getColumnIndex("sV1")));//수면 상태
                jsonDt.put("deviceId",cursor.getString(cursor.getColumnIndex("sDeviceId")));//수면 상태

                SleepTimeList.put(jsonDt);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        cursor.close();
        return new CommUtils().setJSONData("sleepTimeList",SleepTimeList);
    }
    /**
     * 수면 정보 테이블 직접 쿼리(전체 데이터)
     * 밴드 -> 폰 DB로 싱크 시 밴드 업체에서 제공된 SDK 내부에서 직접 DB에 저장하는 데이터
     * 공통 DB 파일로 insert 하기 위해
     */
    public void queryAllSleepInsert(String bandAddr,String selectDay) {
        String sql="SELECT * FROM sleep_total_table";
        Cursor cursor;
        DBHelper comDB = new DBHelper(mContext, DBConfig.COM_DB_NAME,1);
        if(!selectDay.isEmpty()){
            sql="SELECT * FROM sleep_total_table WHERE date='"+selectDay+"'";
        }
        cursor = myDb.queryData(sql);
        while (cursor.moveToNext()){
            try {
                String sleep_time_status_array = cursor.getString(cursor.getColumnIndex("sleep_time_status_array"));
                String sleepChkEndDate = cursor.getString(cursor.getColumnIndex("date"));
                String sleepTotalTime = new CommUtils().mmToHhMm(cursor.getInt(cursor.getColumnIndex("time")),"",false);
                JSONArray sleepTimeStatusArray = new JSONArray(sleep_time_status_array);

                for(int i=0;i < sleepTimeStatusArray.length();i++){
                    String sleepStartDate = sleepChkEndDate;
                    String sleepEndDate = sleepChkEndDate;
                    JSONArray detailArray = sleepTimeStatusArray.getJSONArray(i);
                    if(detailArray.getString(0).length() == 4){//배열의 첫번째 숫자 수면 시작 시간
                        sleepStartDate = new CommUtils().dateCal(sleepChkEndDate,-1);
                    }
                    if(detailArray.getString(1).length() == 4){//밴열의 두번째 숫자 수면 종료 시간
                        sleepEndDate = new CommUtils().dateCal(sleepChkEndDate,-1);
                    }
                    String startTime = new CommUtils().mmToHhMm(detailArray.getInt(0),"",true);
                    String endTime = new CommUtils().mmToHhMm(detailArray.getInt(1),"",true);
                    String sleepType = detailArray.getString(2);
                    String sqlStr = "INSERT OR REPLACE INTO sbSyncSleep (sDeviceId,sDate,sDate1,sTime1,sDate2,sTime2,sV1,sV2) VALUES ('"+bandAddr+"','"+sleepChkEndDate+"','"+sleepStartDate+"','"+startTime+"','"+sleepEndDate+"','"+endTime+"','"+sleepType+"','"+sleepTotalTime+"')";
                    comDB.insertAndReplace(sqlStr);
                }

            } catch (JSONException e) {
                e.printStackTrace();
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }
        cursor.close();
    }
    /**
     * 심박 정보 테이블 직접 쿼리
     **/
    public JSONObject queryRateCustom(String queryDate) {
        String sql;
        Cursor cursor;
        JSONObject resultObj = new JSONObject();
        JSONArray list = new JSONArray();
        if(queryDate.isEmpty()){
            queryDate = CalendarUtils.getCalendar(0);
        }
        sql ="SELECT * FROM rate_24_hour_table_name WHERE calendar ='"+queryDate+"'";
        //myDb = new DBHelper(mContext,DB_FILE_NAME,DB_VERSION);
        cursor = myDb.queryData(sql);
        while (cursor.moveToNext()){
            String date = cursor.getString(cursor.getColumnIndex("calendar"));
            int time = cursor.getInt(cursor.getColumnIndex("time"));
            int rateCnt = cursor.getInt(cursor.getColumnIndex("rate"));
            list.put(mBandQueryDataSet.RateDataJsonSet(date,time,rateCnt));
        }
        cursor.close();
        return new CommUtils().setJSONData("hrList",list);
    }
    /**
     * 심박 정보 테이블 직접 쿼리(공통 테이블에서 조회)
     **/
    public JSONObject queryCommDbRate(String queryDate,String bandAddr){
        String sql;
        Cursor cursor;
        JSONArray RateTimeList = new JSONArray();
        DBHelper comDB = new DBHelper(mContext, DBConfig.COM_DB_NAME,1);
        if(queryDate.isEmpty()){
            queryDate = CalendarUtils.getCalendar(0);
        }
        sql ="SELECT * FROM sbSyncHRM WHERE sDate='"+queryDate+"' AND sDeviceId = '"+bandAddr+"'";
        cursor = comDB.queryData(sql);
        while (cursor.moveToNext()){
            JSONObject jsonDt = new JSONObject();
            try {
                if(BandQueryDataSet.isDetailQuery){
                    jsonDt.put("resultDate",cursor.getString(cursor.getColumnIndex("sDate1")));//날짜
                }
                jsonDt.put("resultTime",cursor.getString(cursor.getColumnIndex("sTime1")));//시간
                jsonDt.put("hr",cursor.getString(cursor.getColumnIndex("sV1")));//심박수
                RateTimeList.put(jsonDt);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        cursor.close();
        return new CommUtils().setJSONData("hrList",RateTimeList);
    }
    /**
     * 서버로 전송을 위해 심박 정보 테이블 직접 쿼리(SmartBand.db 공통)
     **/
    public JSONObject serverSendQueryCommDbRate(){
        String sql;
        Cursor cursor;
        JSONArray RateTimeList = new JSONArray();
        DBHelper comDB = new DBHelper(mContext, DBConfig.COM_DB_NAME,1);
        sql ="SELECT rowid,* FROM sbSyncHRM WHERE sSyncServer = 0";
        cursor = comDB.queryData(sql);
        while (cursor.moveToNext()){
            ContentValues cv = new ContentValues();
            cv.put("sSyncServer",2);
            comDB.updateData("sbSyncHRM",cv,"ROWID",cursor.getString(cursor.getColumnIndex("rowid")));
            JSONObject jsonDt = new JSONObject();
            try {
                jsonDt.put("resultDate",cursor.getString(cursor.getColumnIndex("sDate1")));//날짜
                jsonDt.put("resultTime",cursor.getString(cursor.getColumnIndex("sTime1")));//시간
                jsonDt.put("hr",cursor.getString(cursor.getColumnIndex("sV1")));//심박수
                jsonDt.put("deviceId",cursor.getString(cursor.getColumnIndex("sDeviceId")));//심박수
                RateTimeList.put(jsonDt);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        cursor.close();
        return new CommUtils().setJSONData("hrList",RateTimeList);
    }
    /**
     * 심박 정보 테이블 직접 쿼리(전체 데이터)
     * 밴드 -> 폰 DB로 싱크 시 밴드 업체에서 제공된 SDK 내부에서 직접 DB에 저장하는 데이터
     * 공통 DB 파일로 insert 하기 위해
     */
    public void queryAllRateInsert(String bandAddr) {
        String sql = "SELECT * FROM rate_24_hour_table_name";
        Cursor cursor;
        DBHelper comDB = new DBHelper(mContext, DBConfig.COM_DB_NAME,1);
        cursor = myDb.queryData(sql);
        while (cursor.moveToNext()){
            String date = cursor.getString(cursor.getColumnIndex("calendar"));

            String time = new CommUtils().mmToHhMm(cursor.getInt(cursor.getColumnIndex("time")),"",true);
            String rateCnt = cursor.getString(cursor.getColumnIndex("rate"));
            String sqlStr = "INSERT OR REPLACE INTO sbSyncHRM (sDeviceId,sDate,sDate1,sTime1,sV1) VALUES ('"+bandAddr+"','"+date+"','"+date+"','"+time+"','"+rateCnt+"')";
            comDB.insertAndReplace(sqlStr);
        }
        cursor.close();
    }
    /**
     * 사용자가 임의로 축정하는 심박데이터는 따로 저장하지 않고 단순하게 화면에 수치 갱신용으로만 사용
     * 10분 주기로 측정되는 데이터만 밴드사 SDK에서 저장하는 DB 파일에서 로컬 DB(String COM_DB_NAME = "SmartBand.db")로 추가 insert
     * 심박 측정 데이터 중에 사용자가 측정을 직접 시도하는 데이터는 BandCont.java에 등록되어 있는 RateChangeListener 이벤트가 들어오지만,
     * 10분 주기로 측정되는 데이터는 RateChangeListener 이벤트가 발생하지 않아서 10분주기로 측정되는 TEMP(체온) onTestResult(TemperatureInfo tempInfo)로 이벤트가
     * 들어오는 경우 심박 데이터가 자동저장되는 pedometer.db 파일애서 SmartBand.db 파일로 추가 insert가 되도록 예외 적용
     **/
    public void changeRateInsert(String bandLastAddr, String date, int secondTime) {
        Log.d(CLASS_TAG,"changeRateInsert() date:"+date +", secondTime:"+secondTime);
        String sql = "SELECT * FROM rate_24_hour_table_name WHERE calendar='"+date+"' AND time="+secondTime;//밴드사에서 제공되는 pedometer.db 파일에 존재하는 테이블 명
        DBHelper comDB = new DBHelper(mContext, DBConfig.COM_DB_NAME,1);
        Cursor cursor = myDb.queryData(sql);
        while (cursor.moveToNext()){
            String calendar = cursor.getString(cursor.getColumnIndex("calendar"));
            String time = new CommUtils().mmToHhMm(cursor.getInt(cursor.getColumnIndex("time")),"",true);
            String rateCnt = cursor.getString(cursor.getColumnIndex("rate"));
            String sqlStr = "INSERT OR REPLACE INTO sbSyncHRM (sDeviceId,sDate,sDate1,sTime1,sV1) VALUES ('"+bandLastAddr+"','"+calendar+"','"+calendar+"','"+time+"','"+rateCnt+"')";
            comDB.insertAndReplace(sqlStr);
        }
        cursor.close();
//
//        String date = info.getCalendar();//string;
//        String time = new CommUtils().mmToHhMm(info.getSecondTime()/60, "", true);
//        String rateCnt = String.valueOf(info.getBodyTemperature());//string;
//        String sqlStr = "INSERT OR REPLACE INTO sbSyncHRM (sDeviceId,sDate,sDate1,sTime1,sV1) VALUES ('"+bandAddr+"','"+date+"','"+date+"','"+time+"','"+temp+"')";
//        comDB.insertAndReplace(sqlStr);
    }
    /**
     * 체온 정보 테이블 직접 쿼리
     **/
    public JSONObject queryTempCustom(String queryDate) {
        String sql;
        Cursor cursor;
        JSONObject resultObj = new JSONObject();
        JSONArray list = new JSONArray();
        if(queryDate.isEmpty()){
            queryDate = CalendarUtils.getCalendar(0);
        }
        sql ="SELECT * FROM temperature_table WHERE calendar='"+queryDate+"'";
        //myDb = new DBHelper(mContext,DB_FILE_NAME,DB_VERSION);
        cursor = myDb.queryData(sql);
        while (cursor.moveToNext()){
            String date = cursor.getString(cursor.getColumnIndex("calendar"));
            int time = cursor.getInt(cursor.getColumnIndex("time"))/60;
            //int time = cursor.getInt(cursor.getColumnIndex("time"));
            float temp = cursor.getFloat(cursor.getColumnIndex("body_temperature"));
            list.put(mBandQueryDataSet.TempDataJsonSet(date,time,temp));
        }
        cursor.close();
        return new CommUtils().setJSONData("btList",list);
    }
    /**
     * 체온 정보 테이블 직접 쿼리(공통 테이블에서 조회)
     **/
    public JSONObject queryCommDbTemp(String queryDate,String bandAddr){
        String sql;
        Cursor cursor;
        JSONArray TempTimeList = new JSONArray();
        DBHelper comDB = new DBHelper(mContext, DBConfig.COM_DB_NAME,1);
        if(queryDate.isEmpty()){
            queryDate = CalendarUtils.getCalendar(0);
        }
        sql ="SELECT * FROM sbSyncTemperature WHERE sDate='"+queryDate+"' AND sDeviceId = '"+bandAddr+"'";
        cursor = comDB.queryData(sql);
        while (cursor.moveToNext()){
            JSONObject jsonDt = new JSONObject();
            try {
                if(BandQueryDataSet.isDetailQuery){
                    jsonDt.put("resultDate",cursor.getString(cursor.getColumnIndex("sDate1")));//날짜
                }
                jsonDt.put("resultTime",cursor.getString(cursor.getColumnIndex("sTime1")));//시간
                jsonDt.put("bt",cursor.getString(cursor.getColumnIndex("sV1")));//체온
                TempTimeList.put(jsonDt);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        cursor.close();
        return new CommUtils().setJSONData("btList",TempTimeList);
    }
    /**
     * 서버로 전송을 위해 체온 정보 테이블 직접 쿼리(SmartBand.db 공통)
     **/
    public JSONObject serverSendQueryCommDbTemp(){
        String sql;
        Cursor cursor;
        JSONArray TempTimeList = new JSONArray();
        DBHelper comDB = new DBHelper(mContext, DBConfig.COM_DB_NAME,1);
        sql ="SELECT rowid,* FROM sbSyncTemperature WHERE sSyncServer = 0";
        cursor = comDB.queryData(sql);
        while (cursor.moveToNext()){
            JSONObject jsonDt = new JSONObject();
            try {
                ContentValues cv = new ContentValues();
                cv.put("sSyncServer",2);
                comDB.updateData("sbSyncTemperature",cv,"ROWID",cursor.getString(cursor.getColumnIndex("rowid")));
                jsonDt.put("resultDate",cursor.getString(cursor.getColumnIndex("sDate1")));//날짜
                jsonDt.put("resultTime",cursor.getString(cursor.getColumnIndex("sTime1")));//시간
                jsonDt.put("bt",cursor.getString(cursor.getColumnIndex("sV1")));//체온
                jsonDt.put("deviceId",cursor.getString(cursor.getColumnIndex("sDeviceId")));//디바이스 ID 밴드 addr
                TempTimeList.put(jsonDt);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        cursor.close();
        return new CommUtils().setJSONData("btList",TempTimeList);
    }
    /**
     * 체온 정보 테이블 직접 쿼리(전체 데이터)
     * 밴드 -> 폰 DB로 싱크 시 밴드 업체에서 제공된 SDK 내부에서 직접 DB에 저장하는 데이터
     * 공통 DB 파일로 insert 하기 위해
     */
    public void queryAllTempInsert(String bandAddr) {
        String sql ="SELECT * FROM temperature_table";
        Cursor cursor;
        DBHelper comDB = new DBHelper(mContext, DBConfig.COM_DB_NAME,1);
        cursor = myDb.queryData(sql);
        while (cursor.moveToNext()){
            String date = cursor.getString(cursor.getColumnIndex("calendar"));
            Log.d(CLASS_TAG,"queryAllTempInsert() Time:"+cursor.getInt(cursor.getColumnIndex("time")));
            String time = new CommUtils().mmToHhMm(cursor.getInt(cursor.getColumnIndex("time"))/60,"",true);
            String temp = cursor.getString(cursor.getColumnIndex("body_temperature"));
            String sqlStr = "INSERT OR REPLACE INTO sbSyncTemperature (sDeviceId,sDate,sDate1,sTime1,sV1) VALUES ('"+bandAddr+"','"+date+"','"+date+"','"+time+"','"+temp+"')";
            comDB.insertAndReplace(sqlStr);
        }
        cursor.close();
    }
    /**
    * 체온 정보 단일 저장 사용자가 측정을 하거나, 10분 주기로 측정되는 체온 데이터 로컬 DB(String COM_DB_NAME = "SmartBand.db")에 적재
    **/
    public void changeTempInsert(String bandAddr, TemperatureInfo info) {
        DBHelper comDB = new DBHelper(mContext, DBConfig.COM_DB_NAME,1);
        String date = info.getCalendar();//string;
        String time = new CommUtils().mmToHhMm(info.getSecondTime()/60, "", true);
        String temp = String.valueOf(info.getBodyTemperature());//string;
        String sqlStr = "INSERT OR REPLACE INTO sbSyncTemperature (sDeviceId,sDate,sDate1,sTime1,sV1) VALUES ('"+bandAddr+"','"+date+"','"+date+"','"+time+"','"+temp+"')";
        comDB.insertAndReplace(sqlStr);
    }

    /**
     * 혈중산소포화도 정보 테이블 직접 쿼리 현재 데이터 측정이 불가능하므로 빈 JSON으로 우선 넘긴다.
     **/
    public JSONObject queryOxygenCustom(String queryDate) {
        String sql;
        Cursor cursor;
        JSONObject resultObj = new JSONObject();
        JSONArray list = new JSONArray();
        if(queryDate.isEmpty()){
            queryDate = CalendarUtils.getCalendar(0);
        }
        sql ="SELECT * FROM oxygen_table WHERE calendar='"+queryDate+"'";
        //myDb = new DBHelper(mContext,DB_FILE_NAME,DB_VERSION);
        cursor = myDb.queryData(sql);
        while (cursor.moveToNext()){
            String date = cursor.getString(cursor.getColumnIndex("calendar"));
            int time = cursor.getInt(cursor.getColumnIndex("time"));
            int spO2= cursor.getInt(cursor.getColumnIndex("oxygen_value"));
            list.put(mBandQueryDataSet.OxygenDataJsonSet(date,time,spO2));
        }
        cursor.close();
        return new CommUtils().setJSONData("spO2List",list);
    }
    /**
     * 산소포화도  정보 테이블 직접 쿼리(공통 테이블에서 조회)
     **/
    public JSONObject queryCommDbOxygen(String queryDate,String bandAddr){
        String sql;
        Cursor cursor;
        JSONArray OxygenTimeList = new JSONArray();
        DBHelper comDB = new DBHelper(mContext, DBConfig.COM_DB_NAME,1);
        if(queryDate.isEmpty()){
            queryDate = CalendarUtils.getCalendar(0);
        }
        //산소포화도는  우선 지원되는 밴드에서 추출한 데이터가 지원되지 않는 밴드에서도 그냥 보이게 하라는 본부장님 의견으로 밴드 맥 주소를 where에 넣지 않는다.
        sql ="SELECT * FROM sbSyncOxygen WHERE sDate='"+queryDate+"'";
        cursor = comDB.queryData(sql);
        while (cursor.moveToNext()){
            JSONObject jsonDt = new JSONObject();
            try {
                if(BandQueryDataSet.isDetailQuery){
                    jsonDt.put("resultDate",cursor.getString(cursor.getColumnIndex("sDate1")));//날짜
                }
                jsonDt.put("resultTime",cursor.getString(cursor.getColumnIndex("sTime1")));//시간
                jsonDt.put("spO2",cursor.getString(cursor.getColumnIndex("sV1")));//산소포화도
                OxygenTimeList.put(jsonDt);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        cursor.close();
        return new CommUtils().setJSONData("spO2List",OxygenTimeList);
    }
    /**
     * 서버 전송을 위한 산소포화도  정보 테이블 직접 쿼리(SmartBand.db 공통)
     **/
    public JSONObject serverSendQueryCommDbOxygen(){
        String sql;
        Cursor cursor;
        JSONArray OxygenTimeList = new JSONArray();
        DBHelper comDB = new DBHelper(mContext, DBConfig.COM_DB_NAME,1);
        sql ="SELECT rowid,* FROM sbSyncOxygen WHERE sSyncServer = 0";
        cursor = comDB.queryData(sql);
        while (cursor.moveToNext()){
            JSONObject jsonDt = new JSONObject();
            ContentValues cv = new ContentValues();
            cv.put("sSyncServer",2);
            comDB.updateData("sbSyncOxygen",cv,"ROWID",cursor.getString(cursor.getColumnIndex("rowid")));

            try {
                jsonDt.put("resultDate",cursor.getString(cursor.getColumnIndex("sDate1")));//날짜
                jsonDt.put("resultTime",cursor.getString(cursor.getColumnIndex("sTime1")));//시간
                jsonDt.put("spO2",cursor.getString(cursor.getColumnIndex("sV1")));//산소포화도
                jsonDt.put("deviceId",cursor.getString(cursor.getColumnIndex("sDeviceId")));//밴드 디바이스 ID
                OxygenTimeList.put(jsonDt);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        cursor.close();
        return new CommUtils().setJSONData("spO2List",OxygenTimeList);
    }
    /**
     * 산소포화도 정보 테이블 직접 쿼리(전체 데이터)
     * 밴드 -> 폰 DB로 싱크 시 밴드 업체에서 제공된 SDK 내부에서 직접 DB에 저장하는 데이터
     * 공통 DB 파일로 insert 하기 위해
     */
    public void queryAllOxygenInsert(String bandAddr) {
        String sql ="SELECT * FROM oxygen_table";
        Cursor cursor;
        DBHelper comDB = new DBHelper(mContext, DBConfig.COM_DB_NAME,1);
        cursor = myDb.queryData(sql);
        while (cursor.moveToNext()){
            String date = cursor.getString(cursor.getColumnIndex("calendar"));
            String time = new CommUtils().mmToHhMm(cursor.getInt(cursor.getColumnIndex("time")),"",true);
            String spO2= cursor.getString(cursor.getColumnIndex("oxygen_value"));
            String sqlStr = "INSERT OR REPLACE INTO sbSyncTemperature (sDeviceId,sDate,sDate1,sTime1,sV1) VALUES ('"+bandAddr+"','"+date+"','"+date+"','"+time+"','"+spO2+"')";
            comDB.insertAndReplace(sqlStr);
        }
        cursor.close();
    }
    /**
     * 혈압 정보 테이블 직접 쿼리
     **/
    public JSONObject queryBloodCustom(String queryDate) {
        String sql, isTable;
        Cursor cursor;
        JSONArray list = new JSONArray();
        if(queryDate.isEmpty()){
            queryDate = CalendarUtils.getCalendar(0);
        }
        sql ="SELECT * FROM blood_pressure_"+queryDate;
        isTable = "blood_pressure_"+queryDate;
        //myDb = new DBHelper(mContext,DB_FILE_NAME,DB_VERSION);
        if(myDb.tableIsExists(isTable)){
            cursor = myDb.queryData(sql);
            while (cursor.moveToNext()){
                int time = cursor.getInt(cursor.getColumnIndex("time"));
                int maxBlood = cursor.getInt(cursor.getColumnIndex("blood_pressure_value_high"));
                int minBlood = cursor.getInt(cursor.getColumnIndex("blood_pressure_value_low"));
                list.put(mBandQueryDataSet.BloodDataJsonSet(queryDate,time,maxBlood,minBlood));
            }
            cursor.close();

        }
        return new CommUtils().setJSONData("bpList",list);
    }
    /**
     * 혈압   정보 테이블 직접 쿼리(공통 테이블에서 조회)
     **/
    public JSONObject queryCommDbBlood(String queryDate,String bandAddr){
        String sql;
        Cursor cursor;
        JSONArray BloodTimeList = new JSONArray();
        DBHelper comDB = new DBHelper(mContext, DBConfig.COM_DB_NAME,1);
        if(queryDate.isEmpty()){
            queryDate = CalendarUtils.getCalendar(0);
        }
        //혈압은 우선 지원되는 밴드에서 추출한 데이터가 지원되지 않는 밴드에서도 그냥 보이게 하라는 본부장님 의견으로 밴드 맥 주소를 where에 넣지 않는다.
        sql ="SELECT * FROM sbSyncBP WHERE sDate='"+queryDate+"'";
        cursor = comDB.queryData(sql);
        while (cursor.moveToNext()){
            JSONObject jsonDt = new JSONObject();
            try {
                if(BandQueryDataSet.isDetailQuery){
                    jsonDt.put("resultDate",cursor.getString(cursor.getColumnIndex("sDate1")));//날짜
                }
                jsonDt.put("resultTime",cursor.getString(cursor.getColumnIndex("sTime1")));//시간
                jsonDt.put("sbp",cursor.getString(cursor.getColumnIndex("sV1")));//Max 혈압
                jsonDt.put("dbp",cursor.getString(cursor.getColumnIndex("sV2")));//min 혈압
                BloodTimeList.put(jsonDt);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        cursor.close();
        return new CommUtils().setJSONData("bpList",BloodTimeList);
    }
    /**
     * 서버에 전송을 위한 혈압  정보 테이블 직접 쿼리(SmartBand.db 공통)
     **/
    public JSONObject serverSendQueryCommDbBlood(){
        String sql;
        Cursor cursor;
        JSONArray BloodTimeList = new JSONArray();
        DBHelper comDB = new DBHelper(mContext, DBConfig.COM_DB_NAME,1);
        sql ="SELECT rowid,* FROM sbSyncBP WHERE sSyncServer=0";
        cursor = comDB.queryData(sql);
        while (cursor.moveToNext()){
            JSONObject jsonDt = new JSONObject();
            ContentValues cv = new ContentValues();
            cv.put("sSyncServer",2);
            comDB.updateData("sbSyncOxygen",cv,"ROWID",cursor.getString(cursor.getColumnIndex("rowid")));
            try {
                jsonDt.put("resultDate",cursor.getString(cursor.getColumnIndex("sDate1")));//날짜
                jsonDt.put("resultTime",cursor.getString(cursor.getColumnIndex("sTime1")));//시간
                jsonDt.put("sbp",cursor.getString(cursor.getColumnIndex("sV1")));//Max 혈압
                jsonDt.put("dbp",cursor.getString(cursor.getColumnIndex("sV2")));//min 혈압
                jsonDt.put("deviceId",cursor.getString(cursor.getColumnIndex("sDeviceId")));//밴드 디바이스 ID
                BloodTimeList.put(jsonDt);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        cursor.close();
        return new CommUtils().setJSONData("bpList",BloodTimeList);
    }
    /**
     * 혈압 정보 테이블 직접 쿼리(전체 데이터)
     * 밴드 -> 폰 DB로 싱크 시 밴드 업체에서 제공된 SDK 내부에서 직접 DB에 저장하는 데이터
     * 공통 DB 파일로 insert 하기 위해
     */
    public void queryAllBloodInsert(String bandAddr) {
        //밴드 업체에서 제공한 SDK 내부에서 혈압 테이블은 날짜별로 테이블을 생성하고 있는 상태이므로 테이블을 전체를 찾아서
        //혈압에 해당하는 테이블인 경우에 공통 DB테이블로 혈압을 다시 적재한다.
        String allTableSelSql = "select DISTINCT tbl_name from sqlite_master WHERE tbl_name LIKE 'blood_pressure_%'";
        DBHelper comDB = new DBHelper(mContext, DBConfig.COM_DB_NAME,1);
        Cursor cursor = myDb.queryData(allTableSelSql);
        while (cursor.moveToNext()){
            Log.d(CLASS_TAG,"queryAllBloodInsert() table Name : "+cursor.getString(0));
            String TableName = cursor.getString(0);
            String sql ="SELECT * FROM "+TableName;
            String[] tableNameSplit = TableName.split("_");
            String date = tableNameSplit[tableNameSplit.length-1];
            Cursor BloodCur = myDb.queryData(sql);
            Log.d(CLASS_TAG,"queryAllBloodInsert() BloodCur.size : "+BloodCur.getCount());
            while (BloodCur.moveToNext()){
                String time = new CommUtils().mmToHhMm(BloodCur.getInt(BloodCur.getColumnIndex("time")),"",true);
                String maxBlood = BloodCur.getString(BloodCur.getColumnIndex("blood_pressure_value_high"));
                String minBlood = BloodCur.getString(BloodCur.getColumnIndex("blood_pressure_value_low"));
                String sqlStr = "INSERT OR REPLACE INTO sbSyncBP (sDeviceId,sDate,sDate1,sTime1,sV1,sV2) VALUES ('"+bandAddr+"','"+date+"','"+date+"','"+time+"','"+maxBlood+"','"+minBlood+"')";
                Log.d(CLASS_TAG,"queryAllBloodInsert() maxBlood : "+maxBlood);
                comDB.insertAndReplace(sqlStr);
            }
            BloodCur.close();
        }
        cursor.close();
    }
    /**
    * 산소포화도 데이터 직접 insert
    * */
    public void insertOxygenCustom(OxygenInfo oxygenInfo){

        String tableNm = "oxygen_table";

        ContentValues cv = new ContentValues();
        String startDate = oxygenInfo.getStartDate().substring(0,11)+"0";//끝 분 버리고 10분 단위로만 insert 하기
        String duplicChkQuery ="SELECT * FROM oxygen_table WHERE StartDate='"+startDate+"'";
        String time = String.valueOf(oxygenInfo.getTime());
        time = time.substring(0,time.length()-1)+"0";//끝 분 버리고 10분 단위로만 insert 하기
        cv.put("calendar",oxygenInfo.getCalendar());
        cv.put("StartDate",startDate);
        cv.put("time",Integer.valueOf(time));
        cv.put("oxygen_value",oxygenInfo.getOxygenValue());
        if(myDb.chkDuplicated(duplicChkQuery)){//중복
            myDb.updateData(tableNm,cv,"StartDate",startDate);
        }else{//중복 아님
            myDb.insertData(tableNm,cv);
        }

    }
    /**
     * 산소포화도 데이터 직접 insert
     * 밴드 업체에서 제공한 SDK를 통하여 생성된 DB파일이 아닌 임의로 생성한 공통 테이블에 저장
     * */
    public void insertOxygenCustom(OxygenInfo oxygenInfo,String bandAddr){
        String tableNm = "sbSyncOxygen";
        DBHelper comDB = new DBHelper(mContext, DBConfig.COM_DB_NAME,1);
        String date = oxygenInfo.getCalendar();
        String time = new CommUtils().mmToHhMm(oxygenInfo.getTime(),"",true);
        String spO2 = String.valueOf(oxygenInfo.getOxygenValue());
        String sqlStr = "INSERT OR REPLACE INTO sbSyncOxygen (sDeviceId,sDate,sDate1,sTime1,sV1) VALUES ('"+bandAddr+"','"+date+"','"+date+"','"+time+"','"+spO2+"')";
        comDB.insertAndReplace(sqlStr);

    }

    /**
     * 서버에 생체 데이터 전송 완료 후 서버 전송 완료된 생체 데이터는 DB 테이블 sSyncServer 컬럼 값 2인 Row만 1로 변경
    **/
    public void bodyDataServerSyncOKUpdate(){
        DBHelper comDB = new DBHelper(mContext, DBConfig.COM_DB_NAME,1);
        ContentValues cv = new ContentValues();
        cv.put("sSyncServer",1);//sSyncServer 값 1로 변경
        comDB.updateData("SbSyncBP",cv,"sSyncServer","2");//혈압
        comDB.updateData("SbSyncHRM",cv,"sSyncServer","2");//심박
        comDB.updateData("sbSyncOxygen",cv,"sSyncServer","2");//혈중산소포화도
        comDB.updateData("SbSyncSleep",cv,"sSyncServer","2");//수면
        comDB.updateData("SbSyncStep",cv,"sSyncServer","2");//걸음수
        comDB.updateData("SbSyncTemperature",cv,"sSyncServer","2");//체온
    }
}
