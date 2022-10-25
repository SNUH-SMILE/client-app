package iitp.infection.pm.push;

import m.client.android.library.core.managers.ActivityHistoryManager;
import m.client.android.library.core.view.MainActivity;
import m.client.push.library.PushManager;
import m.client.push.library.common.Logger;
import m.client.push.library.common.PushConstants;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.os.Handler;
import android.os.Message;
import android.text.TextUtils;
import android.util.Log;
import android.widget.Toast;

public class PushUiHandler extends Handler {
	public static final int REG_PUSHSERVICE_COMPLETED = 0;
    public static final int REG_PUSHUSER_COMPLETELED = 1;
    public static final int GET_PUSHMESSAGES_COMPLETELED = 2;
    public static final int UNREG_PUSHSERVICE_COMPLETED = 3;
    public static final int SEND_MESSAGE_COMPLETED = 4;
    public static final int REG_SERVICEANDUSER_COMPLETED = 5;
    public static final int REG_GROUP_COMPLETED = 6;
    public static final int UNREG_GROUP_COMPLETED = 7;
    public static final int INIT_BADGE_COMPLETED = 8;
	public static final int READ_MESSAGE_COMPLETED = 9;
    
    @Override
    public void handleMessage(Message msg) {
        super.handleMessage(msg);
         
        Activity activity = ActivityHistoryManager.getInstance().getTopActivity();
        if (activity instanceof MainActivity) {
	        final MainActivity topActivity = (MainActivity) activity;
	        final String callback = PushManager.getInstance().getCurrentCallback(topActivity.getApplicationContext());
	        
	        switch (msg.what) {
		        case REG_PUSHSERVICE_COMPLETED:
		        	try {
			        	final String regPushServiceResult = (String) msg.obj;
			        	Log.d("PushUiHandler", "REG_PUSHSERVICE_COMPLETED RESULT:: " + regPushServiceResult);
						final JSONObject jsonObj = new JSONObject(regPushServiceResult);
						String resultCode = jsonObj.getString(PushConstants.KEY_RESULT_CODE);
						String resultMessage = jsonObj.getString(PushConstants.KEY_RESULT_MSG);
						final String isRegister = (jsonObj.has(PushConstants.KEY_ISREGISTER))? jsonObj.getString(PushConstants.KEY_ISREGISTER) : "";
						if (!TextUtils.isEmpty(isRegister)) {
							if (isRegister.equals("C")) {
								resultMessage = "사용자 재등록 필요";
								resultCode = PushConstants.RESULTCODE_OK;
							} 
							else if(isRegister.equals("N")) {
								resultMessage = "서비스 재등록 필요";
							} 
						}
						
						final String fResultCode = resultCode;
						final String fResultMessage = resultMessage;
			    		if (topActivity.getActivityType() == ActivityHistoryManager.ACTIVITY_TYPE_WEB) {
			    			 topActivity.runOnUiThread(new Runnable() {
			    				 @Override
			    				 public void run() {
			    					 try {
				    					 JSONObject returnValue = new JSONObject();
				    					 String status = (PushConstants.RESULTCODE_OK.equals(fResultCode))? "SUCCESS" : "FAIL";
				    					 returnValue.put("status", status);
				    					 returnValue.put("isRegister", isRegister);
				    					 if ("FAIL".equals(status)) {
				    						 returnValue.put("error", fResultMessage);
				    					 }
				    					 
				    					 Log.d("PushUiHandler", "REG_PUSHSERVICE_COMPLETED RESULT:: " + "javascript:"+ callback +"(" + returnValue.toString() + ");");
				    					 topActivity.getWebView().loadUrl("javascript:"+ callback +"(" + returnValue.toString() + ");");
			    					 } 
			    					 catch (JSONException e) {
			    						 e.printStackTrace();
			    					 }
			    				 }
			    			 });	       			
			    		}
			    		
		        	} catch (Exception e1) {
						e1.printStackTrace();
					}
		            break;
		            
		        case UNREG_PUSHSERVICE_COMPLETED:
		        	try {
			        	final String unregPushServiceResult = (String) msg.obj;
			        	Log.d("PushUiHandler", "UNREG_PUSHSERVICE_COMPLETED RESULT:: " + unregPushServiceResult);
						final JSONObject jsonObj = new JSONObject(unregPushServiceResult);
						final String resultCode = jsonObj.getString(PushConstants.KEY_RESULT_CODE);
						final String resultMessage = jsonObj.getString(PushConstants.KEY_RESULT_MSG);

			    		if (topActivity.getActivityType() == ActivityHistoryManager.ACTIVITY_TYPE_WEB) {
			    			 topActivity.runOnUiThread(new Runnable() {
			    				 @Override
			    				 public void run() {
			    					 try {
				    					 JSONObject returnValue = new JSONObject();
				    					 String status = (PushConstants.RESULTCODE_OK.equals(resultCode))? "SUCCESS" : "FAIL";
				    					 returnValue.put("status", status);
				    					 if ("FAIL".equals(status)) {
				    						 returnValue.put("error", resultMessage);
				    					 }
				    				//	 Log.d("PushUiHandler", "UNREG_PUSHSERVICE_COMPLETED RESULT:: " + "javascript:"+ callback +"(" + returnValue.toString() + ");");
				    					 topActivity.getWebView().loadUrl("javascript:"+ callback +"(" + returnValue.toString() + ");");
			    					 } 
			    					 catch (JSONException e) {
			    						 e.printStackTrace();
			    					 }
			    				 }
			    			 });	       			
			    		}
			    		
		        	} catch (Exception e1) {
						e1.printStackTrace();
					}
		            break;
		             
		        case SEND_MESSAGE_COMPLETED:
		        	try {
			        	final String sendMessageResult = (String) msg.obj;
			        	Log.d("PushUiHandler", "SEND_MESSAGE_COMPLETED RESULT:: " + sendMessageResult);
						final JSONObject jsonObj = new JSONObject(sendMessageResult);
						final String resultCode = jsonObj.getString(PushConstants.KEY_RESULT_CODE);
						final String resultMessage = jsonObj.getString(PushConstants.KEY_RESULT_MSG);
						final Activity toastActivity = topActivity;
						
			    		if (topActivity.getActivityType() == ActivityHistoryManager.ACTIVITY_TYPE_WEB) {
			    			 topActivity.runOnUiThread(new Runnable() {
			    				 @Override
			    				 public void run() {
			    					 try {
				    					 JSONObject returnValue = new JSONObject();
				    					 String status = (PushConstants.RESULTCODE_OK.equals(resultCode))? "SUCCESS" : "FAIL";
				    					 returnValue.put("status", status);
				    					 returnValue.put("result",  jsonObj.optString("RESULT_BODY"));
				    					 if ("FAIL".equals(status)) {
				    						 returnValue.put("error", resultMessage);
				    					 }

				    					 Log.e("SEND MESSAGE", jsonObj.optString("RESULT_BODY").toString());

//				    					 Log.d("PushUiHandler", "SEND_MESSAGE_COMPLETED RESULT:: " + "javascript:"+ callback +"(" + returnValue.toString() + ");");
				    					 topActivity.getWebView().loadUrl("javascript:"+ "putSendMsgSeq" +"(" + jsonObj.optString("RESULT_BODY") + ");");
				    					 
				    					 Toast.makeText(toastActivity, status, Toast.LENGTH_LONG).show();
				    					 
			    					 } 
			    					 catch (JSONException e) {
			    						 e.printStackTrace();
			    					 }
			    				 }
			    			 });	       			
			    		}
			    		
		        	} catch (Exception e1) {
						e1.printStackTrace();
					}
		            break;
		            
		        case REG_SERVICEANDUSER_COMPLETED:
		        	try {
			        	final String regServiceAndUserResult = (String) msg.obj;
			        	Log.d("PushUiHandler", "REG_SERVICEANDUSER_COMPLETED RESULT:: " + regServiceAndUserResult);
						final JSONObject jsonObj = new JSONObject(regServiceAndUserResult);
						final String resultCode = jsonObj.getString(PushConstants.KEY_RESULT_CODE);
						final String resultMessage = jsonObj.getString(PushConstants.KEY_RESULT_MSG);
					
			    		if (topActivity.getActivityType() == ActivityHistoryManager.ACTIVITY_TYPE_WEB) {
			    			 topActivity.runOnUiThread(new Runnable() {
			    				 @Override
			    				 public void run() {
			    					 try {
				    					 JSONObject returnValue = new JSONObject();
				    					 String status = (PushConstants.RESULTCODE_OK.equals(resultCode))? "SUCCESS" : "FAIL";
				    					 returnValue.put("status", status);
				    					 if ("FAIL".equals(status)) {
				    						 returnValue.put("error", resultMessage);
				    					 }
				    					 Log.d("PushUiHandler", "REG_SERVICEANDUSER_COMPLETED RESULT:: " + "javascript:"+ callback +"(" + returnValue.toString() + ");");
				    					 topActivity.getWebView().loadUrl("javascript:"+ callback +"(" + returnValue.toString() + ");");
			    					 } 
			    					 catch (JSONException e) {
			    						 e.printStackTrace();
			    					 }
			    				 }
			    			 });	       			
			    		}
			    		
		        	} catch (Exception e1) {
						e1.printStackTrace();
					}
		            break;
		            
		        case REG_PUSHUSER_COMPLETELED:
		        	try {
			        	final String regPushUserResult = (String) msg.obj;
			        	Log.d("PushUiHandler", "REG_PUSHUSER_COMPLETELED RESULT:: " + regPushUserResult);
						final JSONObject jsonObj = new JSONObject(regPushUserResult);
						final String resultCode = jsonObj.getString(PushConstants.KEY_RESULT_CODE);
						final String resultMessage = jsonObj.getString(PushConstants.KEY_RESULT_MSG);
					
			    		if (topActivity.getActivityType() == ActivityHistoryManager.ACTIVITY_TYPE_WEB) {
			    			 topActivity.runOnUiThread(new Runnable() {
			    				 @Override
			    				 public void run() {
			    					 try {
				    					 JSONObject returnValue = new JSONObject();
				    					 String status = (PushConstants.RESULTCODE_OK.equals(resultCode))? "SUCCESS" : "FAIL";
				    					 returnValue.put("status", status);
				    					 if ("FAIL".equals(status)) {
				    						 returnValue.put("error", resultMessage);
				    					 }
				    					 Log.d("PushUiHandler", "REG_PUSHUSER_COMPLETELED RESULT:: " + "javascript:"+ callback +"(" + returnValue.toString() + ");");
				    					 topActivity.getWebView().loadUrl("javascript:"+ callback +"(" + returnValue.toString() + ");");
			    					 } 
			    					 catch (JSONException e) {
			    						 e.printStackTrace();
			    					 }
			    				 }
			    			 });	       			
			    		}
			    		
		        	} catch (Exception e1) {
						e1.printStackTrace();
					}
		            break;
		            
		        case REG_GROUP_COMPLETED:
		        	try {
			        	final String regPushUserResult = (String) msg.obj;
			        	Log.d("PushUiHandler", "REG_GROUP_COMPLETED RESULT:: " + regPushUserResult);
						final JSONObject jsonObj = new JSONObject(regPushUserResult);
						final String resultCode = jsonObj.getString(PushConstants.KEY_RESULT_CODE);
						final String resultMessage = jsonObj.getString(PushConstants.KEY_RESULT_MSG);
					
			    		if (topActivity.getActivityType() == ActivityHistoryManager.ACTIVITY_TYPE_WEB) {
			    			 topActivity.runOnUiThread(new Runnable() {
			    				 @Override
			    				 public void run() {
			    					 try {
				    					 JSONObject returnValue = new JSONObject();
				    					 String status = (PushConstants.RESULTCODE_OK.equals(resultCode))? "SUCCESS" : "FAIL";
				    					 returnValue.put("status", status);
				    					 if ("FAIL".equals(status)) {
				    						 returnValue.put("error", resultMessage);
				    					 }
				    					 Log.d("PushUiHandler", "REG_GROUP_COMPLETED RESULT:: " + "javascript:"+ callback +"(" + returnValue.toString() + ");");
				    					 topActivity.getWebView().loadUrl("javascript:"+ callback +"(" + returnValue.toString() + ");");
			    					 } 
			    					 catch (JSONException e) {
			    						 e.printStackTrace();
			    					 }
			    				 }
			    			 });	       			
			    		}
			    		
		        	} catch (Exception e1) {
						e1.printStackTrace();
					}
		            break;
		            
		        case UNREG_GROUP_COMPLETED:
		        	try {
			        	final String regPushUserResult = (String) msg.obj;
			        	Log.d("PushUiHandler", "UNREG_GROUP_COMPLETED RESULT:: " + regPushUserResult);
						final JSONObject jsonObj = new JSONObject(regPushUserResult);
						final String resultCode = jsonObj.getString(PushConstants.KEY_RESULT_CODE);
						final String resultMessage = jsonObj.getString(PushConstants.KEY_RESULT_MSG);
					
			    		if (topActivity.getActivityType() == ActivityHistoryManager.ACTIVITY_TYPE_WEB) {
			    			 topActivity.runOnUiThread(new Runnable() {
			    				 @Override
			    				 public void run() {
			    					 try {
				    					 JSONObject returnValue = new JSONObject();
				    					 String status = (PushConstants.RESULTCODE_OK.equals(resultCode))? "SUCCESS" : "FAIL";
				    					 returnValue.put("status", status);
				    					 if ("FAIL".equals(status)) {
				    						 returnValue.put("error", resultMessage);
				    					 }
				    					 Log.d("PushUiHandler", "UNREG_GROUP_COMPLETED RESULT:: " + "javascript:"+ callback +"(" + returnValue.toString() + ");");
				    					 topActivity.getWebView().loadUrl("javascript:"+ callback +"(" + returnValue.toString() + ");");
			    					 } 
			    					 catch (JSONException e) {
			    						 e.printStackTrace();
			    					 }
			    				 }
			    			 });	       			
			    		}
			    		
		        	} catch (Exception e1) {
						e1.printStackTrace();
					}
		            break;
		            
		        case INIT_BADGE_COMPLETED:
		        	try {
			        	final String regPushUserResult = (String) msg.obj;
			        	Log.d("PushUiHandler", "INIT_BADGE_COMPLETED RESULT:: " + regPushUserResult);
						final JSONObject jsonObj = new JSONObject(regPushUserResult);
						final String resultCode = jsonObj.getString(PushConstants.KEY_RESULT_CODE);
						final String resultMessage = jsonObj.getString(PushConstants.KEY_RESULT_MSG);
					
			    		if (topActivity.getActivityType() == ActivityHistoryManager.ACTIVITY_TYPE_WEB) {
			    			 topActivity.runOnUiThread(new Runnable() {
			    				 @Override
			    				 public void run() {
			    					 try {
				    					 JSONObject returnValue = new JSONObject();
				    					 String status = (PushConstants.RESULTCODE_OK.equals(resultCode))? "SUCCESS" : "FAIL";
				    					 returnValue.put("status", status);
				    					 if ("FAIL".equals(status)) {
				    						 returnValue.put("error", resultMessage);
				    					 }
				    					 Log.d("PushUiHandler", "INIT_BADGE_COMPLETED RESULT:: " + "javascript:"+ callback +"(" + returnValue.toString() + ");");
				    					 topActivity.getWebView().loadUrl("javascript:"+ callback +"(" + returnValue.toString() + ");");
			    					 } 
			    					 catch (JSONException e) {
			    						 e.printStackTrace();
			    					 }
			    				 }
			    			 });	       			
			    		}
			    		
		        	} catch (Exception e1) {
						e1.printStackTrace();
					}
		            break;

				case READ_MESSAGE_COMPLETED:
					try {
						final String regPushUserResult = (String) msg.obj;
						Log.d("PushUiHandler", "READ_MESSAGE_COMPLETED RESULT:: " + regPushUserResult);
						final JSONObject jsonObj = new JSONObject(regPushUserResult);
						final String resultCode = jsonObj.getString(PushConstants.KEY_RESULT_CODE);
						final String resultMessage = jsonObj.getString(PushConstants.KEY_RESULT_MSG);

						if (topActivity.getActivityType() == ActivityHistoryManager.ACTIVITY_TYPE_WEB) {
							topActivity.runOnUiThread(new Runnable() {
								@Override
								public void run() {
									try {
										JSONObject returnValue = new JSONObject();
										String status = (PushConstants.RESULTCODE_OK.equals(resultCode))? "SUCCESS" : "FAIL";
										returnValue.put("status", status);
										if ("FAIL".equals(status)) {
											returnValue.put("error", resultMessage);
										}
										Log.d("PushUiHandler", "READ_MESSAGE_COMPLETED RESULT:: " + "javascript:"+ callback +"(" + returnValue.toString() + ");");
										topActivity.getWebView().loadUrl("javascript:"+ callback +"(" + returnValue.toString() + ");");
									}
									catch (JSONException e) {
										e.printStackTrace();
									}
								}
							});
						}

					} catch (Exception e1) {
						e1.printStackTrace();
					}
					break;
		            
		        /*case GET_PUSHMESSAGES_COMPLETELED:
		        	final JSONArray getPushMessagesResult = (JSONArray) msg.obj;
		        	Log.d("PushUiHandler", "GET_PUSHMESSAGES_COMPLETELED RESULT:: " + getPushMessagesResult.length());
		        	if (topActivity.getActivityType() == ActivityHistoryManager.ACTIVITY_TYPE_WEB) { 
		        		 topActivity.runOnUiThread(new Runnable() {
		        			 @Override
		        			 public void run() {
		        				 topActivity.getWebView().loadUrl("javascript:"+ "getPushMessagesCompleted" +"(" + getPushMessagesResult + ");");
		        			 }
		        		 });	       			
		        	}
		            break;*/
		
		        default:
		        	Log.d("PushUiHandler", "UNKNOWN MESSAGE:: " + msg.what);
		            break;
	        }
        }
    }
};
