//
//  AppDelegate.m
//

#import "AppDelegate.h"
#import "PushReceiver.h"
#import <MPush/MPush.h>
#import "AppDelegate+BackgroundLocation.h"


@interface AppDelegate ()

@property (strong, nonatomic) PPNavigationController *navigationController;

@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    // Override point for customization after application launch.
    if([launchOptions objectForKey:UIApplicationLaunchOptionsRemoteNotificationKey])
    {
        NSDictionary *dic = [launchOptions objectForKey:UIApplicationLaunchOptionsRemoteNotificationKey];
        _setGlobalValue(@"_PUSHDATA", dic);
    }
    
    if([launchOptions objectForKey:UIApplicationLaunchOptionsLocalNotificationKey])
    {
        UILocalNotification *notification = [launchOptions objectForKey:UIApplicationLaunchOptionsLocalNotificationKey];
        _setGlobalValue(@"_PUSHDATA", notification.userInfo);
    }
    
    [[PushManager defaultManager] application:application didFinishLaunchingWithOptions:launchOptions];
    [[PushManager defaultManager] initilaizeWithDelegate:[[PushReceiver alloc] init]];
    
    window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    navigationController = [MAppDelegate initialViewControllerWithLaunchOptions:launchOptions history:YES];
    
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
    
    [UNUserNotificationCenter currentNotificationCenter].delegate = self;
    
    return YES;
}

-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler
{
    completionHandler(UNNotificationPresentationOptionAlert | UNNotificationPresentationOptionBadge | UNNotificationPresentationOptionSound);
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void(^)(void))completionHandler
{
    NSLog( @"didReceiveNotificationResponse: %@", response.notification.request.content.userInfo);
    NSDictionary *userInfo = response.notification.request.content.userInfo;
    
    PPNavigationController *navigationController = [PPNavigationController ppNavigationController];
    if([navigationController.currentViewCtrl isKindOfClass:[PPWebViewController class]])
    {
        PPWebViewController *current = (PPWebViewController *)navigationController.currentViewCtrl;
        [current callCbfunction:@"oniOSReceiveNotification" withObjects:@{@"status":@"ACTIVE", @"payload":userInfo, @"type":@"APNS", @"messageUID": @""}, nil];
    }
    
    completionHandler();
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
