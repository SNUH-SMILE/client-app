package iitp.infection.pm;

import android.Manifest;
import android.app.Activity;
import android.os.Build;
import android.os.Bundle;
import android.webkit.WebView;
import android.widget.Toast;

import com.gun0912.tedpermission.PermissionListener;
import com.gun0912.tedpermission.normal.TedPermission;

import java.util.List;

import iitp.infection.pm.database.DBConfig;
import iitp.infection.pm.database.DBHelper;
import m.client.android.library.core.common.CommonLibHandler;


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
        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT){
            WebView.setWebContentsDebuggingEnabled(true);
        }
        ////////////////////////////////////////////////////////////////////////////////
        // - 중요 -
        // 최초 시작 Activity에 아래의 코드를 넣어야 한다. 
        //1. 앱 구동전 밴드 데이터를 관리할 공통 DB 파일 및 Table를 생성 한다.
        DBHelper dbHelper = new DBHelper(getApplicationContext(), DBConfig.COM_DB_NAME,DBConfig.COM_DB_VER);
        dbHelper.getWritableDatabase();

        ////////////////////////////////////////////////////////////////////////////////    

	    PermissionListener permissionlistener = new PermissionListener() {
		    @Override
		    public void onPermissionGranted() {
			    //Toast.makeText(MainActivity.this, "Permission Granted", Toast.LENGTH_SHORT).show();

			    commLibHandle.processAppInit(Startup.this);
		    }

		    @Override
		    public void onPermissionDenied(List<String> deniedPermissions) {
			    Toast.makeText(Startup.this, "Permission Denied\n" + deniedPermissions.toString(), Toast.LENGTH_SHORT).show();
		    }


	    };

		if(Build.VERSION.SDK_INT > Build.VERSION_CODES.R){
			TedPermission.create()
					.setPermissionListener(permissionlistener)
					.setDeniedMessage("만약 권한을 승인하지 않으면, 앱이 동작하지 않습니다. 다음 메뉴에서 활성화 할 수 있습니다. [설정] > [권한]")
					.setPermissions(Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.BLUETOOTH_CONNECT)
					.check();

		} else {
			// TODO: 임시 퍼미션 체크 하지 않도록 처리..
			TedPermission.create()
					.setPermissionListener(permissionlistener)
					.setDeniedMessage("만약 권한을 승인하지 않으면, 앱이 동작하지 않습니다. 다음 메뉴에서 활성화 할 수 있습니다. [설정] > [권한]")
					.setPermissions(Manifest.permission.ACCESS_FINE_LOCATION)
					.check();
		}

    }
}
