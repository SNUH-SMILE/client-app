//
//  PushNotificationCenter.h
//

#import <Foundation/Foundation.h>

@interface PushNotificationCenter : NSObject

@property (nonatomic, readonly) NSMutableArray *notifications;
@property (nonatomic, readonly) PushNotification *lastNotification;
@property (nonatomic, assign) NSNumber *badgeNumber;

- (PushNotification *)lastNotificationWithStatus:(PushNotificationStatus)status;
- (NSArray *)unexpiredNotifications;
- (void)clear;

@end
