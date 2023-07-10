//
//  AppDelegate.m
//

#import "AppDelegate.h"

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
    
    return YES;
}

@synthesize window, navigationController;

@end
