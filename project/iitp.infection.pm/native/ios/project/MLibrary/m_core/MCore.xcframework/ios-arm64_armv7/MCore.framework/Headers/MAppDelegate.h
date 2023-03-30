//
//  MAppDelegate.h
//

#import <Foundation/Foundation.h>

@interface MAppDelegate : NSObject

+ (PPNavigationController *)initialViewControllerWithLaunchOptions:(NSDictionary *)launchOptions; // User History for First Page - Default : NO
+ (PPNavigationController *)initialViewControllerWithLaunchOptions:(NSDictionary *)launchOptions history:(BOOL)history;
+ (PPNavigationController *)initialViewControllerWithLaunchOptions:(NSDictionary *)launchOptions history:(BOOL)history parameters:(NSDictionary *)parameters;

@end
