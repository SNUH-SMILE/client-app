package iitp.infection.pm.net;

import android.content.Context;
import android.util.Log;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.io.IOException;

import m.client.android.library.core.utils.CommonLibUtil;
import okhttp3.Interceptor;
import okhttp3.OkHttpClient;
import okhttp3.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class RetrofitClient {
    private static final String TAG = RetrofitClient.class.getSimpleName();

    private static final String BASE_URL = "https://smile.hconnect.co.kr";

    private static RetrofitService service;

    // private construct
    private RetrofitClient() {
        Log.i(TAG, "RetrofitClient()");
    }

    private static class InnerInstanceClazz {
        private static final RetrofitClient instance = new RetrofitClient();
    }

    public static RetrofitService getService(Context context) {
        Log.i(TAG, "getService()");
        Gson gson = new GsonBuilder().setLenient().create();

        OkHttpClient interceptorClient = new OkHttpClient().newBuilder()
                .addInterceptor(new RequestInterceptor(context))
                .build();

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addConverterFactory(GsonConverterFactory.create(gson))
                .client(interceptorClient)
                .build();
        service = retrofit.create(RetrofitService.class);

        return InnerInstanceClazz.instance.service;
    }
    static class RequestInterceptor implements Interceptor {
        Context context;
        public RequestInterceptor(Context context){
            this.context = context;
        }
        @Override
        public Response intercept(Chain chain) throws IOException {
            String token = "Bearer "+CommonLibUtil.getUserConfigInfomation("jwt",context.getApplicationContext());
            Log.e("token::",token);
            return chain.proceed(chain.request()
                    .newBuilder()
                    .addHeader("Content-Type","application/json")
                    .addHeader("Accept","*/*")
                    .addHeader("Authorization", token)
                    .build());
        }
    }
}