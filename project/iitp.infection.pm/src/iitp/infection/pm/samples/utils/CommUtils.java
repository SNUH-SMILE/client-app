package iitp.infection.pm.samples.utils;

import android.app.Activity;
import android.app.ActivityManager;
import android.app.ProgressDialog;
import android.content.Context;
import android.graphics.drawable.ColorDrawable;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.Locale;

import iitp.infection.pm.IitpFGService;
import iitp.infection.pm.R;
import iitp.infection.pm.band.BandCont;
import iitp.infection.pm.band.CommConfig;
import m.client.android.library.core.common.CommonLibHandler;
import m.client.android.library.core.utils.PLog;
import m.client.android.library.core.view.AbstractActivity;


public class CommUtils {
    private static String CLASS_TAG = BandCont.class.getSimpleName();
    static ProgressDialog progressDialog = null;
    static CommonLibHandler commHandle = CommonLibHandler.getInstance();
    public CommUtils(){

    }
    //데이터 JSON object로 set
    public JSONObject setJSONResutlCode(String code, String msg) {
        JSONObject obj = new JSONObject();
        try {
            obj.put("code", code);
            obj.put("message", msg);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return obj;
    }
    //데이터 JSON object로 set
    public JSONObject setJSONData(String key, JSONArray array) {
        JSONObject obj = new JSONObject();
        try {
            obj.put(key, array);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return obj;
    }
    public JSONObject setJSONData(String key, String value) {
        JSONObject obj = new JSONObject();
        try {
            obj.put(key, value);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return obj;
    }
    public static void showLoading(final Activity activity, final String message, final boolean cancelable) {
        Log.d(CLASS_TAG,"showLoading() activity : "+activity);
        if(activity == null){
            return;
        }
        if(!CommConfig.PROGRESS_BAR_SHOW) return;
        hideLoading(activity);

        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (progressDialog == null) {
                    try {
                        progressDialog = ProgressDialog.show(activity, "", message, true, cancelable);
                        if (message.trim().equals(""))
                            progressDialog.setContentView(R.layout.core_progressdialoglayout);
                        progressDialog.getWindow().setBackgroundDrawable(new ColorDrawable(0));
                        progressDialog.show();
                    } catch(Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        });
    }

    public static void hideLoading(final Activity activity) {
        Log.d(CLASS_TAG,"hideLoading() activity : "+activity);
        if(activity == null){
            return;
        }
        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                try {
                    if (progressDialog != null) {
                        progressDialog.dismiss();
                        progressDialog = null;
                    }
                } catch(Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }

    //분단위를 시간분으로 변환한다 (MM -> HHMM)
    public String mmToHhMm(int minute, String format,boolean ssIsShow){
        int HH = minute/60;
        String HHStr = ((int)(Math.log10(HH)+1) < 2) ? "0"+HH : String.valueOf(HH);
        int MM = minute-((minute/60)*60);
        String MMStr = ((int)(Math.log10(MM)+1) < 2) ? "0"+MM : String.valueOf(MM);
        String result =  HHStr + MMStr;
        Log.d(CLASS_TAG,"mmToHhMm >> HH :"+ HH);
        Log.d(CLASS_TAG,"mmToHhMm >> MM :"+ MM);
        if(!format.isEmpty()){
            result = HHStr + format + MMStr;
        }
        if(ssIsShow){//전달 받은 값이 분단위의 값이라 초는 00이나, 초까지 표시를 하고자 한다면
            result = result + "00";
        }
        return result;
    }

    //기준 날짜에서 전 후 구하기
    public String dateCal(String targetDate,int calNum) throws ParseException{
        // 1. 날짜 표시 format
        SimpleDateFormat  formatter = new SimpleDateFormat("yyyyMMdd");
        Date setDate = formatter.parse(targetDate);
        Calendar cal = new GregorianCalendar(Locale.KOREA);
        cal.setTime(setDate);
        cal.add(Calendar.DATE, calNum);
        String y_date = formatter.format(cal.getTime());
        return y_date;
    }

    //서비스가 구동 중인지 확인
    public boolean isServiceRunning(AbstractActivity callerObject, String className) {
        PLog.i(CLASS_TAG, "exWNIsFGServiceRunning()");
        boolean state = false;
        ActivityManager manager = (ActivityManager) callerObject.getSystemService(Context.ACTIVITY_SERVICE);
        for (ActivityManager.RunningServiceInfo runningServiceInfo : manager.getRunningServices(Integer.MAX_VALUE)) {
            if (className.equals(runningServiceInfo.service.getClassName())){
                state =  true;
                break;
            }
        }
        return state;
    }
}
