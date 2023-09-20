package iitp.infection.pm.net;

import iitp.infection.pm.net.data.location.LocationInfo;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.POST;

public interface RetrofitService {

    @POST("/api/location/setLocationList")
    Call<LocationInfo> location(@Body LocationInfo location);

}