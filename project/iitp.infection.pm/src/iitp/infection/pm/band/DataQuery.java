package iitp.infection.pm.band;

import android.util.Log;

import com.yc.pedometer.info.RateOneDayInfo;
import com.yc.pedometer.info.SleepTimeInfo;
import com.yc.pedometer.info.StepInfo;
import com.yc.pedometer.sdk.UTESQLOperate;
import com.yc.pedometer.utils.CalendarUtils;

import java.text.DecimalFormat;

public class DataQuery {
    private String CLASS_TAG = DataQuery.class.getSimpleName();
    public DataQuery(){

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
    public void querySleepInfo(UTESQLOperate mySQLOperate,String queryDate) {
        if(queryDate.isEmpty()){
            queryDate = CalendarUtils.getCalendar(0);
        }
        SleepTimeInfo sleepTimeInfo = mySQLOperate.querySleepInfo(queryDate);
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
}
