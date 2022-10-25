package iitp.infection.pm.push;

import iitp.infection.pm.PushMessageManager;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import m.client.push.library.common.PushConstants;
import m.client.push.library.utils.PushUtils;

public class PushStatusCheckReceiver extends BroadcastReceiver {
	
	@Override   
	public void onReceive(Context context, Intent intent) {
		Log.d("PushStatusCheckReceiver", "PushStatusCheckReceiver action:: " + intent.getAction());
		boolean isRunningApp = PushUtils.isRunningPushApps(context);
		Log.d("PushStatusCheckReceiver", "PushStatusCheckReceiver isRunningApp:: " + isRunningApp);
		Intent pushStartIntent = new Intent(context, PushMessageManager.class);
		pushStartIntent.putExtra("JSON", intent.getStringExtra("JSON"));
		pushStartIntent.putExtra("PUSH_TYPE", intent.getStringExtra("PUSH_TYPE"));
		pushStartIntent.putExtra("ENCRYPT", intent.getStringExtra("ENCRYPT"));
		pushStartIntent.putExtra("PUSH_STATUS", (isRunningApp)? PushConstants.APP_STATUS_ACTIVE : PushConstants.APP_STATUS_BACKGROUND);
		pushStartIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
		context.startActivity(pushStartIntent);
	}
}
