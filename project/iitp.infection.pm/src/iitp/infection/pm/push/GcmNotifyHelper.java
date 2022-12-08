package iitp.infection.pm.push;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;

import org.json.JSONException;
import org.json.JSONObject;

import com.nostra13.universalimageloader.core.ImageLoader;
import com.nostra13.universalimageloader.core.ImageLoaderConfiguration;
import com.nostra13.universalimageloader.core.assist.FailReason;
import com.nostra13.universalimageloader.core.listener.SimpleImageLoadingListener;

import iitp.infection.pm.PushMessageManager;
import iitp.infection.pm.R;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Handler;
import android.os.Message;
import androidx.core.app.NotificationCompat;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;

public class GcmNotifyHelper {
	
	public static void showNotification(final Context context, final JSONObject jsonMsg, final String psid, final String encryptData) throws Exception {
	    String extData = "";
	    JSONObject apsJsonObj = jsonMsg.getJSONObject("aps");
	    JSONObject mpsJsonObj = jsonMsg.getJSONObject("mps");
	    
	    if (mpsJsonObj.has("ext")) {
	    	extData = mpsJsonObj.getString("ext");
	    	System.out.println("extData: " + extData);
	    }
	    
	    //extData = "http:/211.241.199.158:8180/msg/totalInfo/0218115649_msp.html";
	    //extData = "3|145,text|null";
	    if (extData.startsWith("http")) {
			Handler handler = new Handler() {
				@Override
				public void handleMessage(Message msg) {
	        		if(msg.what == 0) {
	        			String message = (String) msg.obj;
	        			if (message != null) {
	        				message = message.replaceAll("https", "http");
	        				message = message.replaceAll("\\\\", "/");

	        				try { 
	        					// "TYPE":"R","VAR":"hoseok|2015-06-31|2015-07-30|104320|11"
	        					if (jsonMsg.has("TYPE") && jsonMsg.getString("TYPE").equals("R")) {
	        						String var = jsonMsg.getString("VAR");
	        						HashMap<String, String> varMap = new HashMap<String, String>();
	        						if (var != null) {
	        							String[] varArray = var.split("\\|");
	        							for (int i=0; i<varArray.length; i++) {
	        								int idx = i+1;
	        								varMap.put("%VAR" + idx + "%", varArray[i]);
	        								//Log.d("test", "%VAR" + idx + "%" + " " +  varArray[i]);
	        							}
	        							
	        							Iterator<?> keys = varMap.keySet().iterator();
	        							while (keys.hasNext()) {
	        								String key = (String) keys.next();
	        								message = message.replaceAll(key, varMap.get(key));
	        								//Log.d("test", "message: " + message);
	        							}
	        						}
	        					}
	        				} catch (JSONException e) {
	        					e.printStackTrace();
	        				}
	        			}
	        			
	        			//DBUtils.getDbOpenHelper(context).insertPushMSG(messageuniquekey, jsonMsg.toString(), message, encryptData);
	        			createNotification(context, jsonMsg, psid, encryptData, message);
	        		}
				}
			};
			new HttpGetStringThread(handler, extData).start();
		}
		else {
			//DBUtils.getDbOpenHelper(context).insertPushMSG(messageuniquekey, jsonMsg.toString(), extData, encryptData);
			createNotification(context, jsonMsg, psid, encryptData, extData);
		}
	}	
	
	private static void createNotification(final Context context, final JSONObject jsonMsg, final String psid, final String encryptData, String message) {
		ArrayList<String> params = null;
		if (message != null) {
			String[] paramArray = message.split("\\|");
			params = new ArrayList<String>(Arrays.asList(paramArray));
		}

		Log.d("NotificationManager", "[NotificationManager] params size:: " + params.size());
		if (params != null && params.size() > 0) {
			try {
			    JSONObject mpsJsonObj = jsonMsg.getJSONObject("mps");
			    mpsJsonObj.remove("ext");
			    mpsJsonObj.put("ext", message);
			    jsonMsg.put("mps", mpsJsonObj);

				if (params.get(0).equals("0") || params.get(0).equals("4")|| params.get(0).equals("6")) {
					Log.d("NotificationManager", "[NotificationManager] defaultNotification(0 or 4 or 6): " + message);
					defaultNotification(context, jsonMsg, params.get(1), psid, message, encryptData, null);
				}
				else if (params.get(0).equals("11")) { //시큐어 푸시를 위한 구분 (Icon 이미지를 포함한 ext)
					Log.d("NotificationManager", "[NotificationManager] defaultNotification(11): " + message);
					showIconNotification(context, jsonMsg, params.get(1), psid, message, encryptData, params.get(2));
				}
				else if (params.size() > 2) {
					Log.d("NotificationManager", "[NotificationManager] showImageNotification(2 or 3): " + message);
					String url = params.get(2);
					if (TextUtils.isEmpty(url) || "null".equals(url)) {
						defaultNotification(context, jsonMsg, params.get(1), psid, message, encryptData, null);
					}
					else {
						showImageNotification(context, jsonMsg, params.get(1), params.get(2), psid, message);
					}
				}
				else {
					Log.d("NotificationManager", "[NotificationManager] UNKNOUWN TYPE:: " + params.get(0));
					defaultNotification(context, jsonMsg, message, psid, message, encryptData, null);
				}
			} 
			catch (Exception e) {
				e.printStackTrace();
			}
		}
	}
	
	private static void showIconNotification(final Context context, final JSONObject jsonMsg, 
			final String strMessage, final String psid, final String ext, final String encryptData, String iconPath) {
		
		//iconPath = "http://211.241.199.216:28080/secure-push-gw/ic_default.png";
		if (!iconPath.startsWith("http://")) {
			iconPath = iconPath.replaceAll("http:/", "http://");
		}
		if (!ImageLoader.getInstance().isInited()) {
			ImageLoaderConfiguration config = new ImageLoaderConfiguration.Builder(context).build();
			ImageLoader.getInstance().init(config);
		}
		ImageLoader.getInstance().loadImage(iconPath, new SimpleImageLoadingListener() {
			@Override
			public void onLoadingFailed(String imageUri, View view, FailReason failReason) {
				defaultNotification(context, jsonMsg, strMessage, psid, ext, encryptData, null);
			}
			
		    @Override
		    public void onLoadingComplete(String imageUri, View view, Bitmap loadedImage) {
		    	System.out.println("loadedImage.getWidth(): " + loadedImage.getWidth());
		    	System.out.println("loadedImage.getHeight(): " + loadedImage.getHeight());
		    	Bitmap scaledImage = Bitmap.createScaledBitmap(loadedImage, 192, 192, false);
		    	if (loadedImage != null) {
		    		loadedImage.recycle();
		    		loadedImage = null;
		    	}
		    	defaultNotification(context, jsonMsg, strMessage, psid, ext, encryptData, scaledImage);
		    }
		});		
	}
	public static String NOTIFICATION_CHANNEL_ID =  "";
	public static CharSequence name = "";

	private static void defaultNotification(Context context, JSONObject jsonMsg, String strMessage, String psid, String ext, String encryptData, Bitmap loadedIcon) {
		String alertMessage = strMessage;
		try {
			JSONObject apsJsonObj = jsonMsg.getJSONObject("aps");
			//JSONObject mpsJsonObj = jsonMsg.getJSONObject("mps");
			alertMessage = apsJsonObj.getString("alert");
		} catch (Exception e1) {
			e1.printStackTrace();
		}
		
		int seqno = 0;
		try {
			JSONObject mpsJsonObj = jsonMsg.getJSONObject("mps");
			seqno = Integer.parseInt(mpsJsonObj.getString("seqno"));
		} catch (NumberFormatException e) {
			e.printStackTrace();
		} catch (JSONException e) {
			e.printStackTrace();
		}
		alertMessage = (TextUtils.isEmpty(alertMessage))? "" : alertMessage;

		int icon = R.drawable.icon;
		Bitmap largeIcon = BitmapFactory.decodeResource(context.getResources(), R.drawable.icon);
		if (loadedIcon != null) {
			largeIcon = loadedIcon;
		}

		String title = context.getString(R.string.app_name);
		//int seqno = Integer.parseInt(jsonMsg.getString("SEQNO"));
		//boolean isRunningApp = PushUtils.isRunningPushApps(context);
		Intent intent = new Intent(context, PushMessageManager.class);
		intent.setAction(context.getPackageName() + ".ACTION_NOTIFICATION_HANDLE");
		intent.putExtra("JSON", jsonMsg.toString());
		intent.putExtra("PS_ID", psid);
		intent.putExtra("TITLE", alertMessage);
		intent.putExtra("EXT", ext);
		intent.putExtra("ENCRYPT", encryptData);
		intent.putExtra("PUSH_TYPE", "GCM");
		//intent.putExtra("PUSH_STATUS", (isRunningApp)? PushConstants.APP_STATUS_ACTIVE : PushConstants.APP_STATUS_BACKGROUND);
		//intent.addFlags(Intent.FLAG_ACTIVITY_NO_HISTORY);

		PendingIntent pIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_CANCEL_CURRENT|PendingIntent.FLAG_MUTABLE);
		final NotificationManager mManager = (NotificationManager)context.getSystemService(Context.NOTIFICATION_SERVICE);
		Uri soundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
		NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(context.getApplicationContext())
				.setAutoCancel(true)
				.setContentIntent(pIntent)
				.setSmallIcon(icon)
				.setLargeIcon(largeIcon)
				.setContentTitle(title)
				.setContentText(alertMessage)
				.setTicker(title)
				.setSound(soundUri)
				.setPriority(Notification.PRIORITY_MAX);

		//mBuilder.setFullScreenIntent(pIntent, false);
		//mBuilder.setDefaults(Notification.DEFAULT_VIBRATE);

		NOTIFICATION_CHANNEL_ID = context.getPackageName();
		name = context.getString(R.string.app_name);

		if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O)

		{

			int importance = NotificationManager.IMPORTANCE_HIGH;

			NotificationChannel notificationChannel = new NotificationChannel(NOTIFICATION_CHANNEL_ID, name, importance);

			notificationChannel.setDescription("샘플 푸시 앱에 대한 채널 설명");

			notificationChannel.enableLights(true);

			notificationChannel.setLightColor(Color.RED);

			notificationChannel.enableVibration(true);

			notificationChannel.setVibrationPattern(new long[]{100});

			assert mManager != null;

			mBuilder.setChannelId(NOTIFICATION_CHANNEL_ID);

			mManager.createNotificationChannel(notificationChannel);

		}

		final Notification notify = mBuilder.build();
		mManager.notify("gcm", seqno, notify);
	}
	
	private static void showImageNotification(Context context, final JSONObject jsonMsg, final String strMessage, String img, final String psid, final String ext) {
		final int icon = R.drawable.icon;
		final String title = context.getString(R.string.app_name);
		final Context ctx = context;
		
		if (img.contains("https")) {
			img = img.replaceAll("https", "http");
			img = img.replaceAll("\\\\", "/");
		}
		
		ImageLoaderConfiguration config = new ImageLoaderConfiguration.Builder(context).build();
		ImageLoader.getInstance().init(config);
		ImageLoader.getInstance().loadImage(img, new SimpleImageLoadingListener() {
			
		    @Override
		    public void onLoadingComplete(String imageUri, View view, Bitmap loadedImage) {
		    	notificationWithBigPicture(ctx, jsonMsg, title, strMessage, icon, loadedImage, psid, ext);
		    }
		});		
	}
	
	private static void notificationWithBigPicture(Context context, JSONObject jsonMsg, String title, String message, int icon, Bitmap banner, String psid, String ext) {
		String alertMessage = message;
		try {
			JSONObject apsJsonObj = jsonMsg.getJSONObject("aps");
			alertMessage = apsJsonObj.getString("alert");
		} catch (Exception e1) {
			e1.printStackTrace();
		}

		alertMessage = (TextUtils.isEmpty(alertMessage))? "" : alertMessage;
		//boolean isRunningApp = PushUtils.isRunningPushApps(context);
		Intent intent = new Intent(context, PushMessageManager.class);
		intent.setAction(context.getPackageName() + ".ACTION_NOTIFICATION_HANDLE");
		intent.putExtra("JSON", jsonMsg.toString());
		intent.putExtra("PS_ID", psid);
		intent.putExtra("TITLE", alertMessage);
		intent.putExtra("EXT", ext);
		intent.putExtra("PUSH_TYPE", "UPNS");
		//intent.putExtra("PUSH_STATUS", (isRunningApp)? PushConstants.APP_STATUS_ACTIVE : PushConstants.APP_STATUS_BACKGROUND);
		//intent.addFlags(Intent.FLAG_ACTIVITY_NO_HISTORY); 
		int seqno = 0;

		NOTIFICATION_CHANNEL_ID = context.getPackageName();
		name = context.getString(R.string.app_name);

		try {
			JSONObject mpsJsonObj = jsonMsg.getJSONObject("mps");
			seqno = Integer.parseInt(mpsJsonObj.getString("seqno"));
		} catch (NumberFormatException e) {
			e.printStackTrace();
		} catch (JSONException e) {
			e.printStackTrace();
		}
		PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_CANCEL_CURRENT|PendingIntent.FLAG_MUTABLE);

		NotificationCompat.Builder builder = new NotificationCompat.Builder(context)
				.setSmallIcon(icon)
				.setTicker(title)
				.setContentTitle(title)
				.setContentText(alertMessage)
				.setAutoCancel(true)
				.setPriority(Notification.PRIORITY_MAX);

		NotificationCompat.BigPictureStyle style = new NotificationCompat.BigPictureStyle();
		style.setBigContentTitle(title);
		style.setSummaryText(message);
		style.bigPicture(banner);

		builder.setStyle(style);
		builder.setContentIntent(pendingIntent);
		//builder.setFullScreenIntent(pendingIntent, true);

		builder.setDefaults(Notification.DEFAULT_VIBRATE);
		builder.setSound(RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION));
		NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);

		if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O)

		{

			int importance = NotificationManager.IMPORTANCE_HIGH;

			NotificationChannel notificationChannel = new NotificationChannel(NOTIFICATION_CHANNEL_ID, name, importance);

			notificationChannel.setDescription("샘플 푸시 앱에 대한 채널 설명");

			notificationChannel.enableLights(true);

			notificationChannel.setLightColor(Color.RED);

			notificationChannel.enableVibration(true);

			notificationChannel.setVibrationPattern(new long[]{100});

			assert notificationManager != null;

			builder.setChannelId(NOTIFICATION_CHANNEL_ID);

			notificationManager.createNotificationChannel(notificationChannel);

		}

		notificationManager.notify("gcm", seqno, builder.build());
	}
}