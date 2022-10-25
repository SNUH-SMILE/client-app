package iitp.infection.pm;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;
import android.os.IBinder;


import android.util.Log;

import androidx.core.app.NotificationCompat;

import com.yc.pedometer.utils.GlobalVariable;

import iitp.infection.pm.band.BandCont;
import m.client.android.library.core.managers.ActivityHistoryManager;
import m.client.android.library.core.view.MainActivity;

public class IitpFGService extends Service {
    private String CLASS_TAG = IitpFGService.class.getSimpleName();
    private String CHANNEL_ID = "iitpFgService";
    private String CHANNEL_NAME = "국책과제 자가격리 서비스";
    private String NOTI_TEXT = "자가격리자 위치 체크 중입니다.";

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {

        FGServiceNotiInit();
        bandConnectInit();
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
}
