//
//  AppDelegate+MPush.m
//

/*
  MPush Plugin 연동 방법

  1. AppDelegate.m 파일내에 AppDelegate+MPush.h 파일을 import

// Example
#import "AppDelegate+MPush.h"

 
  2. application:didFinishLaunchingWithOptionsForPushService: 를
    AppDelegate 의 application:didFinishLaunchingWithOptions: 내에서 호출

// Example
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    // Override point for customization after application launch.
    
    window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    navigationController = [MAppDelegate initialViewControllerWithLaunchOptions:launchOptions];
    
    [window setBackgroundColor:[UIColor blackColor]];
    [window setRootViewController:navigationController];
    [window makeKeyAndVisible];


    [self application:application didFinishLaunchingWithOptionsForPushService:launchOptions];


    return YES;
}
*/

#import "AppDelegate+MPush.h"

#import "PushReceiver.h"
#import <MPush/PushManager.h>
#import <MPush/AppDelegate+PushManager.h>
#define isOSVersionOver10 ([[[[UIDevice currentDevice].systemVersion componentsSeparatedByString:@"."] objectAtIndex:0] integerValue] >= 10)

@implementation AppDelegate(MPush)

- (void)application:(UIApplication *)application didFinishLaunchingWithOptionsForPushService:(NSDictionary *)launchOptions {
    [[PushManager defaultManager] application:application didFinishLaunchingWithOptions:launchOptions];
    
    PushReceiver *receiver = [[PushReceiver alloc] init];
    [[PushManager defaultManager] initilaizeWithDelegate:receiver];
//    [[PushManager defaultManager].info changeMode:@"DEV"];
    
    if(isOSVersionOver10){
        UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
        center.delegate = receiver;
    }
    
//    NSString *settingIP =_getStorageValue(@"SETTING_IP");
//    if(settingIP != nil && [settingIP length] > 0)
//    {
//        [[PushManager defaultManager].info changeHost:settingIP];
//    }
}

- (void)application:(UIApplication *)application
didReceiveRemoteNotification:(NSDictionary *)userInfo {
    
    [[PushManager defaultManager] application:application
                 didReceiveRemoteNotification:userInfo];
}
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error{
    
}

@end
