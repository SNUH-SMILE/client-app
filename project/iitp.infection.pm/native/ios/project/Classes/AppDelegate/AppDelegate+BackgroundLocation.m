//
//  AppDelegate.m
//

#import "AppDelegate+BackgroundLocation.h"

@implementation AppDelegate (BackgroundLocation)

- (void)applicationDidBecomeActive {
    [self locationManagerDidChangeAuthorization :self.locationManager];
}

// 위치 서비스 시작
- (void) startLocation {
    
    if (self.locationStarted == YES) return;
    
    if (self.locationManager == nil) {
        self.locationManager = [[CLLocationManager alloc] init];
        self.locationManager.delegate = self;
        self.locationManager.desiredAccuracy = kCLLocationAccuracyBest;
        self.locationManager.distanceFilter = kCLDistanceFilterNone;
        self.locationManager.allowsBackgroundLocationUpdates = YES;
        self.locationManager.pausesLocationUpdatesAutomatically = NO;
    }
    
    CLAuthorizationStatus authStatus = [self.locationManager authorizationStatus];
    
    if ([CLLocationManager locationServicesEnabled]) {
        if (authStatus == kCLAuthorizationStatusNotDetermined) {
            
            self.didBecomeActiveDelegate = self;
            
            [self.locationManager requestAlwaysAuthorization];
            
            [NSTimer scheduledTimerWithTimeInterval:0.1 repeats:NO block:^(NSTimer * _Nonnull timer) {
                self.locationPermission = YES;
            }];
            
            self.hasRequestLocation = YES;
            
        } else if (authStatus == kCLAuthorizationStatusAuthorizedAlways) {
            [self startLocationReal];
        } else if (authStatus == kCLAuthorizationStatusAuthorizedWhenInUse) {
            
            if (self.hasRequestLocation == NO) {
                self.didBecomeActiveDelegate = self;
                
                [self.locationManager requestAlwaysAuthorization];
                
                [NSTimer scheduledTimerWithTimeInterval:0.1 repeats:NO block:^(NSTimer * _Nonnull timer) {
                    self.locationPermission = YES;
                }];
                
                self.hasRequestLocation = YES;
            } else {
                // 앱 사용중에만 위치서비스를 사용한다고 한 상태에서, 위치 서비스 시작
                [self startLocationReal];
            }
        } else {
            // 권한 부족
        }
    } else {
        // 위치 서비스가 꺼짐
    }
}

// 위치 서비스 시작
- (void) startLocationReal {
    
    if (self.locationStarted == YES) return;
    self.locationStarted = YES;
    
    [self.locationManager startUpdatingLocation];
    
    if ([CLLocationManager significantLocationChangeMonitoringAvailable]) {
        [self.locationManager startMonitoringSignificantLocationChanges];
    }
}

// 위치 서비스 종료
- (void) stopLocation {
    
    NSLog(@"- (void) stopLocation");
    
    self.locationStarted = NO;
    
    [self.locationManager stopUpdatingLocation];
    
    if ([CLLocationManager significantLocationChangeMonitoringAvailable]) {
        [self.locationManager stopMonitoringSignificantLocationChanges];
    }
}

- (NSString *)statusLocation {
    if (self.locationStarted) return @"Y";
    return @"N";
}

- (void)locationManagerDidChangeAuthorization:(CLLocationManager *)manager {
    
    // 권한 요청에 관하여서 1회만 처리 하기 위함
    // 앱이 액티브로 오는 경우에도 이 부분이 호출되지만, 이 조건에 결려서 2번 실행되지 않음
    if (self.locationPermission == YES) {
        
        CLAuthorizationStatus authStatus = [manager authorizationStatus];

        if (authStatus == kCLAuthorizationStatusNotDetermined) {
            // 권한이 없는 경우
        } else if (authStatus == kCLAuthorizationStatusAuthorizedAlways) {
            [self startLocationReal];
        } else if (authStatus == kCLAuthorizationStatusAuthorizedWhenInUse) {
            // 앱 사용중에만 사작하는 경우
            [self startLocationReal];
        } else {
            // 거부등 경우
        }
        
        self.locationPermission = NO;
    }
}

// 위치 서비스 권한 상태 변경
- (void)locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray<CLLocation *> *)locations {

    NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
    [formatter setDateFormat:@"yyyyMMddHHmm"];
    NSString *todayNow = [formatter stringFromDate:[NSDate new]];
    
    todayNow = [todayNow substringToIndex:11]; // 10분에 1회씩, 주석처리시 1분에 1회씩
    
    NSLog(@"%@", todayNow);
    
    if (self.locationUpdateToServerDate != nil && [todayNow isEqualToString:self.locationUpdateToServerDate])
        return;
    
    self.locationUpdateToServerDate = todayNow;
    
    CLLocation *location = [locations lastObject];
        
    double lat = location.coordinate.latitude;
    double lon = location.coordinate.longitude;
        
    // 서버로 데이터 발송
        
    NSString *locationUrl = _getStorageValue(@"LOCATION_UPDATE_URL");
    NSString *userId = _getStorageValue(@"LOCATION_UPDATE_USER_ID");
    
    if (locationUrl == nil || userId == nil || [locationUrl isEqualToString:@""] || [userId isEqualToString:@""]) return;
    
    // NSString *url = locationUrl;
    
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    dic[@"userId"] = userId;
    dic[@"latitude"] = [NSString stringWithFormat:@"%f", lat];
    dic[@"longitude"] = [NSString stringWithFormat:@"%f", lon];
    
    NSMutableDictionary *dic2 = [NSMutableDictionary dictionary];
    dic2[@"body"] = dic;
        
    NSData* jsonData = [NSJSONSerialization dataWithJSONObject:dic2 options:NSJSONWritingPrettyPrinted error:nil];
    NSString* jsonDataStr = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];

    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:locationUrl]];
    [request setHTTPMethod:@"POST"];
    [request setValue:@"application/text" forHTTPHeaderField:@"Content-Type"];
    [request setHTTPBody:[jsonDataStr dataUsingEncoding:NSUTF8StringEncoding]];
    [request setTimeoutInterval:20];
        
    NSLog(@"%@", locationUrl);
    NSLog(@"%@", dic2);
        
    NSURLSessionDataTask *task = [[NSURLSession sharedSession] dataTaskWithRequest:request completionHandler:^(NSData * _Nullable responseData, NSURLResponse * _Nullable response, NSError * _Nullable error) {

        if (error != nil) {
            NSLog(@"UPDATE LOCATION ERROR.");
        } else {
            NSLog(@"UPDATE LOCATION SUCCESS.");
            NSLog(@"UPDATE LOCATION RESPONSE = [");
            if (responseData != nil) {
                NSString* result = [[NSString alloc] initWithData:responseData encoding:NSUTF8StringEncoding];
                NSLog(@"%@", result);
            }
            NSLog(@"]");
        }
    }];
        
    [task resume];
}

- (void)locationManager:(CLLocationManager *)manager didFailWithError:(NSError *)error {
    NSLog(@"- (void)locationManager:(CLLocationManager *)manager didFailWithError:(NSError *)error ");
}


@end
