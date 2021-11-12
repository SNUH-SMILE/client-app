package iitp.infection.pm.samples.utils;

import android.app.Activity;
import android.content.pm.PackageManager;
import android.support.v4.app.ActivityCompat;
import android.util.Log;

public class ComListener {
    //퍼미션 체크 항목
    public static final int PERMISSION_ALL = 100;
    public static boolean per_dont_ask = false;
    public static String[] PERMISSIONS = {
            android.Manifest.permission.ACCESS_FINE_LOCATION,
            android.Manifest.permission.ACCESS_COARSE_LOCATION
    };
    public static PermissionsResultListener mPermissionsResultListener;
    public static BluetoothResultListener mBluetoothResultListener;

    public ComListener(){

    }
    /**
    * 퍼미션 관련 result 리스너
    **/
    public interface PermissionsResultListener{
        void onPermissionsResultListener(int requestCode, String[] permissions, int[] grantResults);
    }
    public static void setPermissionsResultListener(PermissionsResultListener permissionsResultListener){
        mPermissionsResultListener = permissionsResultListener;
    }
    //퍼미션 설정 되어있나 확인
    public static boolean hasPermissions(Activity activity, String... permissions) {
        if (activity != null && permissions != null) {
            for (String permission : permissions) {
                if (ActivityCompat.checkSelfPermission(activity, permission) != PackageManager.PERMISSION_GRANTED) {
                    // 사용자가 다시 보지 않기에 체크를 하지 않고, 권한 설정을 거절한 이력이 있는 경우
                    if (ActivityCompat.shouldShowRequestPermissionRationale(activity, permission)) {
                        Log.i("GLOBAL_LOG_TAG", "permission not don't ask");
                        per_dont_ask = false;
                    } else {
                        // 사용자가 다시 보지 않기에 체크하고, 권한 설정을 거절한 이력이 있는 경우
                        Log.i("GLOBAL_LOG_TAG", "permission don't ask");
                        per_dont_ask = true;
                    }
                    return false;
                }
            }
        }
        return true;
    }

    /**
    * Bluetooth 활성화 Result 관련 리스
    **/
    public interface BluetoothResultListener{
        void onBluetoothResultListener();
    }
    public static void setBluetoothResultListener(BluetoothResultListener bluetoothResultListener){
        mBluetoothResultListener = bluetoothResultListener;
    }
}
