package iitp.infection.pm.push;

import m.client.push.library.common.Logger;
import m.client.push.library.common.PushConstants;
import m.client.push.library.common.PushConstantsEx;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Message;
import android.util.Log;

public class PushActionReceiver extends BroadcastReceiver {
	private PushUiHandler mUiHandler;
	
	@Override   
	public void onReceive(Context context, Intent intent) {
		Logger.e(intent.toString());
		String bundle = intent.getStringExtra(PushConstantsEx.KEY_BUNDLE);
		if(bundle == null){
			Logger.i("Empty Bundle !!" );
		}
		
		if(!intent.getAction().contains(context.getPackageName())){
			Logger.i("Not Support Action");
			return ;
		}
				
		if (bundle.equals(PushConstantsEx.COMPLETE_BUNDLE.REG_PUSHSERVICE)) { 
			String result = intent.getExtras().getString(PushConstants.KEY_RESULT);
			completedCallBack(PushUiHandler.REG_PUSHSERVICE_COMPLETED, result);
			Log.d("PushActionReceiver", "ACTION_REG_PUSHSERVICE_COMPLETELED RESULT: " + result);
		} 
		else if (bundle.equals(PushConstantsEx.COMPLETE_BUNDLE.IS_REGISTERED_SERVICE)) { 
			String result = intent.getExtras().getString(PushConstants.KEY_RESULT);
			completedCallBack(PushUiHandler.REG_PUSHSERVICE_COMPLETED, result);
			Log.d("PushActionReceiver", "ACTION_REG_PUSHSERVICE_COMPLETELED RESULT: " + result);
		} 
		else if (bundle.equals(PushConstantsEx.COMPLETE_BUNDLE.UNREG_PUSHSERVICE)) { 
			String result = intent.getExtras().getString(PushConstants.KEY_RESULT);
			completedCallBack(PushUiHandler.UNREG_PUSHSERVICE_COMPLETED, result);
			Log.d("PushActionReceiver", "UNREG_PUSHSERVICE_COMPLETED RESULT: " + result);
		} 
		else if (bundle.equals(PushConstantsEx.COMPLETE_BUNDLE.REG_USER)) { 
			String result = intent.getExtras().getString(PushConstants.KEY_RESULT);
			completedCallBack(PushUiHandler.REG_PUSHUSER_COMPLETELED, result);
			Log.d("PushActionReceiver", "ACTION_REG_USER_COMPLETELED RESULT: " + result);
		}
		else if(bundle.equals(PushConstantsEx.COMPLETE_BUNDLE.REG_SERVICE_AND_USER)) { 
			String result = intent.getExtras().getString(PushConstants.KEY_RESULT);
			completedCallBack(PushUiHandler.REG_SERVICEANDUSER_COMPLETED, result);
			Log.d("PushActionReceiver", "REG_SERVICEANDUSER_COMPLETED RESULT: " + result);
		}
		else if (bundle.equals(PushConstantsEx.COMPLETE_BUNDLE.SEND_MESSAGE)) { 
			String result = intent.getExtras().getString(PushConstants.KEY_RESULT);
			completedCallBack(PushUiHandler.SEND_MESSAGE_COMPLETED, result);
			Log.d("PushActionReceiver", "ACTION_SEND_MESSAGE_COMPLETELED RESULT: " + result);
		} 
		else if (bundle.equals(PushConstantsEx.COMPLETE_BUNDLE.READ_CONFIRM)) { 
			String result = intent.getExtras().getString(PushConstants.KEY_RESULT);
			completedCallBack(PushUiHandler.READ_MESSAGE_COMPLETED, result);
			Log.d("PushActionReceiver", "ACTION_READ_CONFIRM_COMPLETELED RESULT: " + result);
		} 
		else if (bundle.equals(PushConstantsEx.COMPLETE_BUNDLE.REG_GROUP)) { 
			String result = intent.getExtras().getString(PushConstants.KEY_RESULT);
			completedCallBack(PushUiHandler.REG_GROUP_COMPLETED, result);
			Log.d("PushActionReceiver", "REG_GROUP_COMPLETED RESULT: " + result);
		} 
		else if (bundle.equals(PushConstantsEx.COMPLETE_BUNDLE.UNREG_GROUP)) {
			String result = intent.getExtras().getString(PushConstants.KEY_RESULT);
			completedCallBack(PushUiHandler.UNREG_GROUP_COMPLETED, result);
			Log.d("PushActionReceiver", "UNREG_GROUP_COMPLETED RESULT: " + result);
		} 
		else if (bundle.equals(PushConstantsEx.COMPLETE_BUNDLE.INITBADGENO)) { 
			String result = intent.getExtras().getString(PushConstants.KEY_RESULT);
			completedCallBack(PushUiHandler.INIT_BADGE_COMPLETED, result);
			Log.d("PushActionReceiver", "INIT_BADGE_COMPLETED RESULT: " + result);
		} 
	}
	
	private void completedCallBack(int what, String result) {
		if (mUiHandler == null) {
			mUiHandler = new PushUiHandler();
		}
		
		Message msg = mUiHandler.obtainMessage(what, result);
		msg.what = what;
		msg.obj = result; 
		mUiHandler.sendMessage(msg);
	}
}
