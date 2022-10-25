//
//  AppDelegate.h
//

#import <UIKit/UIKit.h>

@protocol AppDidBecomeActiveDelegate <NSObject>

@optional
- (void)applicationDidBecomeActive;

@end

@interface AppDelegate : UIResponder <UIApplicationDelegate, AppDidBecomeActiveDelegate>

@property (strong, nonatomic) UIWindow * _Nullable window;



// BACKGROUND LOCATION 관련
@property (weak, nonatomic, nullable) id<AppDidBecomeActiveDelegate> didBecomeActiveDelegate; // 위치 권한 요청 한후에, 사용자가 선택한 권한이 예전 권한과 동일한 경우 , 위치 권한 상태 변경에 관한 이벤트를 받지 못한다. 때문에 넣음
@property (nonatomic, assign) BOOL hasRequestLocation; // 앱 실행 후, 위치정보 조회권한 요청여부, 1회 요청하였으면, WHEN IN USE 상태에세 다시 요청하지 않는다.
@property (strong, nonatomic) CLLocationManager * _Nullable locationManager;
@property (assign, nonatomic) BOOL locationStarted; // 위치서비스 중복시작 방지 위함
@property (assign, nonatomic) BOOL locationPermission; //
@property (retain, nonatomic) NSString * _Nullable locationUpdateToServerDate; // 위치 정보 서버 요청 타임

@end
