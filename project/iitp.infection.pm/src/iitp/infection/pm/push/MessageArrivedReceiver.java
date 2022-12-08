package iitp.infection.pm.push;

import m.client.android.library.core.managers.ActivityHistoryManager;
import m.client.android.library.core.utils.CommonLibUtil;
import m.client.android.library.core.view.MainActivity;
import m.client.push.library.PushManager;
import m.client.push.library.common.PushConstants;

import org.json.JSONObject;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.text.TextUtils;
import android.util.Log;

public class MessageArrivedReceiver extends BroadcastReceiver {
	
	@Override   
	public void onReceive(Context context, Intent intent) {
		Log.d("MessageArrivedReceiver", "MessageArrivedReceiver action:: " + intent.getAction());
		
		try {
			// TODO: 긴급 메시지 여부를 체크해야함
			// 알림에 대한 판단
			//String isAlarmOn = CommonLibUtil.getUserConfigInfomation("regiService", context);
			//Log.d("MessageArrivedReceiver", "MessageArrivedReceiver isAlarmOn:: " + isAlarmOn);
			//if (!TextUtils.isEmpty(isAlarmOn) && "true".equals(isAlarmOn)) {
			
			if (intent.getAction().equals(context.getPackageName() + PushConstants.ACTION_UPNS_MESSAGE_ARRIVED)) { 
				// 디바이스 Badge 값 변경 
				final String jsonData = intent.getExtras().getString("JSON");
				final String encryptData = intent.getExtras().getString(PushConstants.KEY_ORIGINAL_PAYLOAD_STRING);
				final JSONObject params = new JSONObject(jsonData);
				final String badgeNo = params.getString("BADGENO");
				try {
					if (!TextUtils.isEmpty(badgeNo) && Integer.parseInt(badgeNo) > 0) {
						PushManager.getInstance().setDeviceBadgeCount(context, badgeNo);
					}
				}
				catch(NumberFormatException e) {
					// 존재하지 않거나 0보다 작다면 무시..
				}
				
				final Activity activity = ActivityHistoryManager.getInstance().getTopActivity();
				if(activity != null && activity instanceof MainActivity){
					activity.runOnUiThread(new Runnable() {
						
						@Override
						public void run() {
							// TODO Auto-generated method stub
							JSONObject tempJSON = new JSONObject();

							try {
								tempJSON.put("payload", jsonData);
								tempJSON.put("type", "UPNS");
								tempJSON.put("status", "ACTIVE");
								tempJSON.put("encrypt",encryptData );

								((MainActivity) activity).getCurrentMPWebView().loadUrl("javascript:onReceiveAndroidNotification( " + tempJSON.toString() + ")");
							}catch (Exception e){
								e.printStackTrace();
							}
						}
					});
				}
				PushNotificationManager.createNotification(context, intent, PushConstants.STR_UPNS_PUSH_TYPE);
			}
			else if (intent.getAction().equals(context.getPackageName() + PushConstants.ACTION_GCM_MESSAGE_ARRIVED)) { 
				// 디바이스 Badge 값 변경 
				final String jsonData = intent.getExtras().getString("JSON");
				final String encryptData = intent.getExtras().getString(PushConstants.KEY_ORIGINAL_PAYLOAD_STRING);
				JSONObject jsonMsg = new JSONObject(jsonData);
				//JSONObject aps = jsonMsg.getJSONObject("aps");
				JSONObject aps = jsonMsg.getJSONObject("aps");
				final String badgeNo = aps.getString("badge");
				try {
					if (!TextUtils.isEmpty(badgeNo) && Integer.parseInt(badgeNo) > 0) {
						PushManager.getInstance().setDeviceBadgeCount(context, badgeNo);
					}
				}
				catch(NumberFormatException e) {
					// 존재하지 않거나 0보다 작다면 무시..
				}
				final Activity activity = ActivityHistoryManager.getInstance().getTopActivity();
			/*	if(activity != null && activity instanceof MainActivity){
					activity.runOnUiThread(new Runnable() {
						
						@Override
						public void run() {
						JSONObject tempJSON = new JSONObject();

						try {
							tempJSON.put("payload", jsonData);
							tempJSON.put("type", "GCM");
							tempJSON.put("status", "ACTIVE");
							tempJSON.put("encrypt",encryptData );

							((MainActivity) activity).getCurrentMPWebView().loadUrl("javascript:onReceiveAndroidNotification( " + tempJSON.toString() + ")");
						}catch (Exception e){
							e.printStackTrace();
						}
						}
					});
				}*/
				PushNotificationManager.createNotification(context, intent, PushConstants.STR_GCM_PUSH_TYPE);
				
			}
			//}
		}
		catch(Exception e) {
			e.printStackTrace();
		}
	}
}
