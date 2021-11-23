package iitp.infection.pm.samples.utils;

import android.app.Activity;
import android.app.ProgressDialog;
import android.graphics.drawable.ColorDrawable;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import iitp.infection.pm.R;
import iitp.infection.pm.band.BandCont;
import m.client.android.library.core.common.CommonLibHandler;


public class CommUtils {
    private static String CLASS_TAG = BandCont.class.getSimpleName();
    static ProgressDialog progressDialog = null;
    static CommonLibHandler commHandle = CommonLibHandler.getInstance();
    public CommUtils(){

    }
    //데이터 JSON object로 set
    public JSONObject setJSONData(String code, String msg){
        JSONObject obj = new JSONObject();
        try {
            obj.put("result_code", code);
            obj.put("result_msg", msg);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return obj;
    }

    public JSONObject setJSONData(String key, JSONArray array) {
        JSONObject obj = new JSONObject();
        try {
            obj.put(key, array);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return obj;
    }

    public static void showLoading(final Activity activity, final String message, final boolean cancelable) {

        hideLoading(activity);

        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (progressDialog == null) {
                    try {
                        progressDialog = ProgressDialog.show(activity, "", message, true, cancelable);
                        if (message.trim().equals(""))
                            progressDialog.setContentView(R.layout.core_progressdialoglayout);
                        progressDialog.getWindow().setBackgroundDrawable(new ColorDrawable(0));
                        progressDialog.show();
                    } catch(Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        });
    }

    public static void hideLoading(final Activity activity) {
        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                try {
                    if (progressDialog != null) {
                        progressDialog.dismiss();
                        progressDialog = null;
                    }
                } catch(Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }

}
