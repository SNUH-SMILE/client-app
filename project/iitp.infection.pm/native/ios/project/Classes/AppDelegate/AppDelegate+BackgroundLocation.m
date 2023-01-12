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
    if(_getStorageValue(@"LOCATION_SERVICE_CONFIG") == nil || [_getStorageValue(@"LOCATION_SERVICE_CONFIG") length] == 0)
    {
        return;
    }
    NSDictionary *config = [_getStorageValue(@"LOCATION_SERVICE_CONFIG") objectFromJsonString];
    NSString *checklat = [config objectForKey:@"LAT"];
    NSString *checklng = [config objectForKey:@"LNG"];
    NSString *token = [config objectForKey:@"TOKEN"];
    NSString *loginid = [config objectForKey:@"LOGIN_ID"];
    NSString *api = [config objectForKey:@"API_URL"];
    NSString *distance = [config objectForKey:@"DISTANCE"];
    NSString *interval = [config objectForKey:@"INTERVAL"];
    
    NSDate *now = [NSDate date];
 
    if (self.locationUpdateToServerDate != nil && [now timeIntervalSinceDate:self.locationUpdateToServerDate] < [interval intValue] * 60)
    {
        //NSLog(@"interval Check %f", [now timeIntervalSinceDate:self.locationUpdateToServerDate] );
        return;
    }
    
    self.locationUpdateToServerDate = now;
    
    CLLocation *location = [locations lastObject];
        
    CLLocation *checklocation = [[CLLocation alloc] initWithLatitude:[checklat doubleValue] longitude:[checklng doubleValue]];
    
    CLLocationDistance checkdistance = [location distanceFromLocation:checklocation];
    
    BOOL check = NO;
    if([distance doubleValue] < checkdistance)
    {
        check = YES;
    }
    
    NSObject<PPNetworkManager>* networkManager = GET_NETWORK_MANGER(@"HTTP_DEV");
    
    if (networkManager)
    {
        
        PPNetworkOption *option = [[PPNetworkOption alloc] init];
        [option setEncrypt:NO];
        [option setDummy:NO];
        [option setIndicator:NO];
        [option setTargetServer:@"HTTP_DEV"];
        [option setJsonUserData:[@{@"token":token} jsonString]];
        
        NSDictionary *dic = @{@"quarantineStatusDiv":check ? @"1":@"0", @"loginId":loginid};

        [networkManager processWithViewCtrl:[PPNavigationController ppNavigationController].currentViewCtrl
                                     trcode:api
                                       data:[dic jsonString]
                              networkoption:option
                                   delegate:(id<PPNetworkManagerDelegate>)self
                                   userinfo:nil];
    }
}

- (void)locationManager:(CLLocationManager *)manager didFailWithError:(NSError *)error {
    NSLog(@"- (void)locationManager:(CLLocationManager *)manager didFailWithError:(NSError *)error ");
}

- (void) didFinishNetworkManager:(id<PPNetworkManager>)manager
                    targetserver:(NSString*)targetserver
                          trcode:(NSString*)trcode
                        response:(NSString*)response
                      cbfunction:(NSString*)cbfunction
                           tagId:(NSString*)tagId
                    jsonUserData:(NSString*)jsonUserData
                        userdata:(NSArray*)userdata
{
    
}

- (void) didFailNetWorkManager:(id<PPNetworkManager>)manager
                  targetserver:(NSString*)targetserver
                        trcode:(NSString*)trcode
                         tagId:(NSString*)tagId
                  jsonUserData:(NSString*)jsonUserData
                     errorcode:(NSString*)errorcode
                      errormsg:(NSString*)errormsg
                      userdata:(NSArray*)userdata
{
    
}


@end
