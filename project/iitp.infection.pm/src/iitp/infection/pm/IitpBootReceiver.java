package iitp.infection.pm;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;

public class IitpBootReceiver extends BroadcastReceiver {
    private String CLASS_TAG = IitpBootReceiver.class.getSimpleName();
    @Override
    public void onReceive(Context context, Intent intent) {
        if(intent.getAction().equals(Intent.ACTION_BOOT_COMPLETED)){
            IitpForegroundServiceStart(context);
        }
    }
    private void IitpForegroundServiceStart(Context context){
        Intent intent = new Intent(context,IitpFGService.class);
        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.O){
            context.startForegroundService(intent);
        }else{
            context.startService(intent);
        }
    }
}
