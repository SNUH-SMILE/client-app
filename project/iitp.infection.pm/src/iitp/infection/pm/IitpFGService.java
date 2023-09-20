package iitp.infection.pm;

import android.annotation.SuppressLint;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.os.FileUtils;
import android.os.Handler;
import android.os.IBinder;


import android.os.Looper;
import android.text.TextUtils;
import android.util.Log;
import android.widget.Toast;

import androidx.core.app.NotificationCompat;

import com.yc.pedometer.utils.GlobalVariable;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

import iitp.infection.pm.band.BandCont;
import iitp.infection.pm.band.DataQuery;
import iitp.infection.pm.database.AlarmDBConfig;
import iitp.infection.pm.database.AlarmDBHelper;
import iitp.infection.pm.database.DBConfig;
import iitp.infection.pm.database.DBHelper;
import iitp.infection.pm.gps.GpsTracker;
import iitp.infection.pm.net.RetrofitClient;
import iitp.infection.pm.net.data.location.LocationInfo;
import iitp.infection.pm.samples.utils.CommUtils;
import m.client.android.library.core.common.CommonLibHandler;
import m.client.android.library.core.managers.ActivityHistoryManager;
import m.client.android.library.core.utils.CommonLibUtil;
import m.client.android.library.core.utils.FileIoUtil;
import m.client.android.library.core.utils.FileUtil;
import m.client.android.library.core.view.MainActivity;
import m.client.push.library.common.Logger;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class IitpFGService extends Service {
    private final String CLASS_TAG = IitpFGService.class.getSimpleName();
    private final String CHANNEL_ID = "iitpFgService";
    private final String CHANNEL_NAME = "국책과제 자가격리 서비스";
    private final String NOTI_TEXT = "자가격리자 위치 체크 중입니다.";

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {


        FGServiceNotiInit();
        bandConnectInit();
        alarmCheck();
        Locationupload();
        return START_STICKY;//super.onStartCommand(intent, flags, startId);
    }
    private void FGServiceNotiInit(){
//        Intent notificationIntent = new Intent(this,Startup.class);
//        PendingIntent pendingIntent = PendingIntent.getActivity(this,0,notificationIntent,0);

        //오레오 윗버젼일 때 아래와 같이 채널을 만들어 notification 과 연결
        Log.d(CLASS_TAG,"FGServiceNotiInit()");
        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.O){
            Notification notification = new Notification.Builder(this, CHANNEL_ID)
                    .setContentTitle(null)
                    .setContentText("자가격리 대상자의 위치정보를 수집합니다.")
                    .setSmallIcon(R.drawable.icon)
                    .setAutoCancel(true)
//                    .setContentIntent(pendingIntent)
                    .setNumber(0)
                    .build();
            NotificationManager manager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
            NotificationChannel notiChannerl = new NotificationChannel(CHANNEL_ID,CHANNEL_NAME,NotificationManager.IMPORTANCE_DEFAULT);
            notiChannerl.setDescription("자가격리 대상자");
            notiChannerl.enableLights(false);
            notiChannerl.enableVibration(false);
            notiChannerl.setVibrationPattern(null);
            notiChannerl.setLockscreenVisibility(Notification.VISIBILITY_PRIVATE);
            notiChannerl.setShowBadge(false);
            manager.createNotificationChannel(notiChannerl);
            startForeground(1,notification);
        }else{
            NotificationCompat.Builder builder = new NotificationCompat.Builder(this);
            builder.setSmallIcon(R.drawable.icon);
            builder.setContentTitle(getString(R.string.app_name));
            builder.setContentText(NOTI_TEXT);
//            builder.setContentIntent(pendingIntent);
            builder.setNumber(0);
            startForeground(1,builder.build());
        }
    }
    private void bandConnectInit(){
        MainActivity topAct = (MainActivity) ActivityHistoryManager.getInstance().getTopActivity();
        BandCont mBandCont = BandCont.getInstance(topAct,getApplicationContext(),null);
        SharedPreferences sp = getSharedPreferences(GlobalVariable.SettingSP, 0);
        String lastConnectAddr0 = sp.getString(GlobalVariable.LAST_CONNECT_DEVICE_ADDRESS_SP,"00:00:00:00:00:00");
        Log.d(CLASS_TAG,"bandConnectInit() lastConnectAddr0 :"+lastConnectAddr0);
        if(!mBandCont.isBandConnected() && lastConnectAddr0 != "00:00:00:00:00:00"){
            mBandCont.BandConnect(lastConnectAddr0);
        }
    }


    private void alarmCheck(){
        new Timer().start();
    }

    public class Timer extends Thread{
        long oldMin = 0;
        @Override
        public void run() {
            super.run();
            while(true){

                SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.KOREA);
                //Date inputDate = simpleDateFormat..parse(System.currentTimeMillis());


                Date date = new Date(System.currentTimeMillis());

                String currDateStr = simpleDateFormat.format(date);

                Date currDate = null;
                try {
                    currDate = simpleDateFormat.parse(currDateStr);
                    long min = currDate.getTime() / (60 * 1000);
                    Thread.sleep(1000);
                    if(min != oldMin) {
                        alarmQueryAllAndNotificaiton(getApplicationContext(), currDateStr);

                    }
                    oldMin = min;

                } catch (ParseException | InterruptedException e) {
                    e.printStackTrace();
                }

            }

        }
    }

    /**
     * 서버 전송을 위한 스텝 정보 테이블 직접 쿼리(공통 테이블에서 조회)
     **/
    @SuppressLint("Range")
    public void alarmQueryAllAndNotificaiton(Context context, String time){
        Logger.e(time);
        String sql;
        Cursor cursor;
        String path = CommonLibHandler.getInstance().getInternalFilesDir() + "/"+ AlarmDBConfig.COM_DB_NAME;
        Logger.e(path);

        if(!FileUtil.isExistFile(path)){
            Logger.e("isExistFile : false" );
            return;
        }
        AlarmDBHelper comDB = new AlarmDBHelper(context, path,1);
        sql ="SELECT * FROM alarm";//알람 데이터 가져오기
        cursor = comDB.queryData(sql);
        while (cursor.moveToNext()){
            Log.d(CLASS_TAG,"queryCommDbStep() rowid: "+cursor.getInt(cursor.getColumnIndex("id")));
           // ContentValues cv = new ContentValues();
           // cv.put("sSyncServer",2);
          // comDB.updateData("sbSyncStep",cv,"ROWID",cursor.getString(cursor.getColumnIndex("rowid")));
            JSONObject jsonDt = new JSONObject();
            try {
                jsonDt.put("title",cursor.getString(cursor.getColumnIndex("title")));//날짜
                jsonDt.put("body",cursor.getString(cursor.getColumnIndex("body")));//시간
                jsonDt.put("type",cursor.getString(cursor.getColumnIndex("type")));//거리
                jsonDt.put("time",cursor.getString(cursor.getColumnIndex("time")));//걸음수
                jsonDt.put("ext",cursor.getString(cursor.getColumnIndex("ext")));//디바이스 ID
                Logger.e(jsonDt.toString(2));
                String notiTime = cursor.getString(cursor.getColumnIndex("time"));
                if(time.equals(notiTime)){
                    Logger.e("notification");
                    new Handler(getMainLooper()).post(new Runnable() {
                        @Override
                        public void run() {
                            alarmNotification(jsonDt);
                        }
                    });

                }

            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        cursor.close();
       // return new CommUtils().setJSONData("stepCountList",StepTimeList);
    }

    private void alarmNotification(JSONObject alarmObject){

        int icon = R.drawable.icon;
        Bitmap largeIcon = BitmapFactory.decodeResource(getApplicationContext().getResources(), R.drawable.icon);
        String title = alarmObject.optString(AlarmDBConfig.DB_C_TITLE);
        String body = alarmObject.optString(AlarmDBConfig.DB_C_BODY);
        int seqno = alarmObject.optInt(AlarmDBConfig.DB_C_ID);
        String ext = alarmObject.optString(AlarmDBConfig.DB_C_EXT);
        Intent intent = new Intent(getApplicationContext(), PushMessageManager.class);

        JSONObject notification = new JSONObject();
        try {

            JSONObject aps = new JSONObject();
            JSONObject alertObject = new JSONObject();
            alertObject.put("title", title);
            alertObject.put("body", body);
            aps.put("alert", alertObject);


            JSONObject mps = new JSONObject();
            mps.put("appid", getApplicationContext().getPackageName());
            mps.put("seqno", seqno);
            mps.put("ext", ext);

            notification.put("aps", aps);
            notification.put("mps", mps);

        }catch (JSONException e){
            e.printStackTrace();
        }
        intent.putExtra("JSON", notification.toString());
        intent.putExtra("PS_ID", getApplicationContext().getPackageName());
        intent.putExtra("TITLE", title);
        intent.putExtra("EXT", ext);
        intent.putExtra("PUSH_TYPE", "GCM");
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

        PendingIntent pIntent = PendingIntent.getActivity(getApplicationContext(), 0, intent, PendingIntent.FLAG_CANCEL_CURRENT|PendingIntent.FLAG_MUTABLE);
        final NotificationManager mManager = (NotificationManager)getApplicationContext().getSystemService(Context.NOTIFICATION_SERVICE);
        Uri soundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
        NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(getApplicationContext().getApplicationContext())
                .setAutoCancel(true)
                .setContentIntent(pIntent)
                .setSmallIcon(icon)
                .setLargeIcon(largeIcon)
                .setContentTitle(title)
                .setContentText(body)
                .setTicker(title)
                .setSound(soundUri)
                .setPriority(Notification.PRIORITY_MAX);

        //mBuilder.setFullScreenIntent(pIntent, false);
        //mBuilder.setDefaults(Notification.DEFAULT_VIBRATE);

        String NOTIFICATION_CHANNEL_ID = getApplicationContext().getPackageName();
        String name = getApplicationContext().getString(R.string.app_name);

        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O){
            int importance = NotificationManager.IMPORTANCE_HIGH;
            NotificationChannel notificationChannel = new NotificationChannel(NOTIFICATION_CHANNEL_ID, name, importance);
            notificationChannel.setDescription("자가격리 알람");
            notificationChannel.enableLights(true);
            notificationChannel.setLightColor(Color.RED);
            notificationChannel.enableVibration(true);
            notificationChannel.setVibrationPattern(new long[]{100});
            assert mManager != null;
            mBuilder.setChannelId(NOTIFICATION_CHANNEL_ID);
            mManager.createNotificationChannel(notificationChannel);
        }

        final Notification notify = mBuilder.build();
        mManager.notify("alarm", seqno, notify);
    }

    double latitude;
    double longitude;
    long syncTimeInterval = 1000;
    private void Locationupload(){
        new LocationTimer().start();
    }
    public class LocationTimer extends Thread{

        @Override
        public void run() {
            super.run();
            while(true){
                Handler mHandler = new Handler(Looper.getMainLooper());
                mHandler.postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        locationStart();
                    }
                }, 0);
                try {
                    if(latitude!=0){
                        locationSend(latitude,longitude);
                    }
                    Thread.sleep(syncTimeInterval);
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
            }
        }
    }

    private GpsTracker mMyGpsTracker;
    public void locationStart() {
        if (mMyGpsTracker == null) {
            mMyGpsTracker = new GpsTracker(getApplicationContext());
        }
        mMyGpsTracker.setOnLocationListener(location -> {
            //Log.d(CLASS_TAG, "location.getLatitude() = " + location.getLatitude());
            //Log.d(CLASS_TAG, "location.getLongitude() = " + location.getLongitude());
            latitude = location.getLatitude();
            longitude = location.getLongitude();
        });
        mMyGpsTracker.startCurrentLocation();
    }

    public void locationSend(double latitude, double longitude){
        Date now = Calendar.getInstance().getTime();
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMdd");
        SimpleDateFormat formatter1 = new SimpleDateFormat("HHmmss");
        String loginId = CommonLibUtil.getUserConfigInfomation("loginId", getApplicationContext());

        LocationInfo locationInfo = new LocationInfo();
        locationInfo.loginId = loginId;
        locationInfo.resultDate = formatter.format(now);
        locationInfo.resultTime = formatter1.format(now);
        locationInfo.lat = String.valueOf(latitude);
        locationInfo.lng = String.valueOf(longitude);

        Call<LocationInfo> rrCall = RetrofitClient.getService(getApplicationContext()).location(locationInfo);
        rrCall.enqueue(new Callback<LocationInfo>() {
            @Override
            public void onResponse(Call<LocationInfo> call, Response<LocationInfo> response) {
                Log.i("LocationInfo", "server_send.onResponse = " + response);
                if (response.isSuccessful()) {
                    Log.i("LocationInfo", "server_send.onResponse = " + response.body());
                    Log.i("LocationInfo", "server_send.onResponse = " + response.body().interval);
                    String interval = response.body().interval;
                    syncTimeInterval = Integer.parseInt(interval);
                }
            }
            @Override
            public void onFailure(Call<LocationInfo> call, Throwable t) {
                Log.e("LocationInfo", "server_send.onFailure = " + t);
            }
        });
    }
}
