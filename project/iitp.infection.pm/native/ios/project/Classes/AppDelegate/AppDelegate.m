//
//  AppDelegate.m
//

#import "AppDelegate.h"
#import "AppDelegate+BackgroundLocation.h"


@interface AppDelegate ()

@property (strong, nonatomic) PPNavigationController *navigationController;

@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    // Override point for customization after application launch.
    
    window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    navigationController = [MAppDelegate initialViewControllerWithLaunchOptions:launchOptions];
    
    [window setBackgroundColor:[UIColor blackColor]];
    [window setRootViewController:navigationController];
    [window makeKeyAndVisible];
    
    // 위치정보 요청하지 않음, 위치정보 권한요청후, YES로 변경하여야 함.
    self.hasRequestLocation = NO;
    
    // 백그라운드 위치조회 시작여부, 백그라운드 위치서비스 중복시작 방지 위함
    self.locationStarted = NO;
    self.locationPermission = NO;
    
    // 위치 정보 UPDATE 로 부터 앱이 시작되였는지 판단하기
    // YES 면 위치 서비스 다시 시작 하기
    // UIApplicationLaunchOptionsLocationKey
    if ([launchOptions objectForKey:UIApplicationLaunchOptionsLocationKey]) {
        [self startLocation];
    }
    
    return YES;
}

@synthesize window, navigationController;

- (void)applicationDidBecomeActive:(UIApplication *)application {
    
    // 앱이 active 된 후, didBecomeActiveDelegate 있으면, 실행,
    // 이후 didBecomeActiveDelegate 를 nil 로 한다.
    // 위치 서비스 권한 요청시 , 권한이 변경 되지 않으면, 상태 변환 이벤트를 받지 못하나는 경우가 발생하기에 사용함
    if (self.didBecomeActiveDelegate != nil) {
        [self.didBecomeActiveDelegate applicationDidBecomeActive];
        self.didBecomeActiveDelegate = nil;
    }
}



@end
