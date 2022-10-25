//
//  PushNotification.h
//

#import <Foundation/Foundation.h>

typedef NS_ENUM(NSInteger, PushNotificationStatus)  {
    PushNotificationStatusUnknown    = 0,
    PushNotificationStatusStart      = 1,
    PushNotificationStatusActive     = 2,
    PushNotificationStatusBackground = 4
};

@class PushNotification;

@interface PushNotification : NSObject

@property (nonatomic, strong) NSDictionary *payload;
@property (nonatomic, strong) NSArray *extComponent;
@property (nonatomic, readonly) NSDictionary *aps; 
@property (nonatomic, readonly) NSDictionary *mps;
@property (nonatomic, readonly) NSString *ext;
@property (nonatomic, readonly) NSDictionary *userInfo;
@property (nonatomic, readonly) NSString *messageUID;
@property (nonatomic, readonly) PushNotificationStatus status;
@property (nonatomic, readonly) NSString *statusString;
@property (nonatomic, getter=isExpired) BOOL expired;

- (id)initWithPayload:(NSDictionary *)payload inStatus:(PushNotificationStatus)status;

@end
