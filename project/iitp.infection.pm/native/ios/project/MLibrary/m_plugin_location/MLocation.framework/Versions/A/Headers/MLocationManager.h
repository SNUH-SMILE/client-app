//
//  MLocationManager.h
//

#import <Foundation/Foundation.h>

typedef void (^MLocationManagerUpdateHandler) (CLLocationManager *manager, CLAuthorizationStatus status, CLLocation *location, NSError *error, BOOL *stopUpdating);

@interface MLocationManager : NSObject

@property (nonatomic, assign) NSTimeInterval timeout;
@property (nonatomic, assign) NSTimeInterval maximumAge;
@property (nonatomic, readwrite) BOOL enableHighAccuracy;


- (void)getCurrentPosition:(MLocationManagerUpdateHandler)completionHandler;

+ (MLocationManager *)defaultManager;
+ (BOOL)isAvailable;

@end
