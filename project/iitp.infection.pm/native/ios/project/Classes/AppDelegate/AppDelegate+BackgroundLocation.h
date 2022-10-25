//
//  AppDelegate.h
//

#import <UIKit/UIKit.h>
#import "AppDelegate.h"

@interface AppDelegate (BackgroundLocation) <CLLocationManagerDelegate>

- (void)startLocation;
- (void)stopLocation;
- (NSString * _Nullable)statusLocation;

@end
