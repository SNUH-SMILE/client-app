//
//  PushReceiver.h
//

#import <UIKit/UIKit.h>
#import <MPush/PushManager.h>
#import <MPush/PushManagerInfo.h>
#import <UserNotifications/UserNotifications.h>

@interface PushReceiver : NSObject <PushManagerDelegate, UNUserNotificationCenterDelegate>

-(void) didReceiveUserNotification:(NSDictionary *)userInfo status:(NSString *)status messageUID:(NSString *)messageUID ;

@end
