package iitp.infection.pm;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;

import m.client.android.library.core.common.CommonLibHandler;
import m.client.android.library.core.utils.Logger;
import android.app.Activity;
import android.content.res.AssetManager;
import android.os.Bundle;


/**
 * Startup Class
 * 
 * @author 김태욱(<a mailto="tukim@uracle.co.kr">tukim@uracle.co.kr</a>)
 * @version v 1.0.0
 * @since Android 2.1 <br>
 *        <DT><B>Date: </B>
 *        <DD>2013.08.01</DD>
 *        <DT><B>Company: </B>
 *        <DD>Uracle Co., Ltd.</DD>
 * 
 * 앱이 구동 될 시 시작되는 Activity 
 * 해당 Activity는 최초 앱 구동 후 실제 webApplication이 로딩 후(BaseActivity) 
 * 종료 된다. 
 * 
 * Copyright (c) 2011-2013 Uracle Co., Ltd. 
 * 166 Samseong-dong, Gangnam-gu, Seoul, 135-090, Korea All Rights Reserved.
 */

public class Startup extends Activity {
	
	private String CLASS_TAG = "Startup";
	private CommonLibHandler commLibHandle = CommonLibHandler.getInstance();
	
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
  	

    	super.onCreate(savedInstanceState);
        ////////////////////////////////////////////////////////////////////////////////
        // - 중요 -
        // 최초 시작 Activity에 아래의 코드를 넣어야 한다. 
        
        commLibHandle.processAppInit(this);
        ////////////////////////////////////////////////////////////////////////////////    

    }
}
