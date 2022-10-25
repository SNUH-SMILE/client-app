//
//  ExtendWNInterface+Base.m
//  iitp.infection.pm
//
//  Created by 유라클 on 2021/11/29.
//

#import "ExtendWNInterface.h"
#import "AppDelegate.h"
#import "AppDelegate+BackgroundLocation.h"

@interface ExtendWNInterface (BackgroundLocation)

@end

@implementation ExtendWNInterface (BackgroundLocation)

- (void) exLocationStart :(NSString *) userId :(NSString *) serverUrl {
    AppDelegate *appDelegate = (AppDelegate *) [UIApplication sharedApplication].delegate;
    
    _setStorageValue(@"LOCATION_UPDATE_URL", serverUrl);
    _setStorageValue(@"LOCATION_UPDATE_USER_ID", userId);
    
    [appDelegate startLocation];
}

- (void) exLocationStop {
    AppDelegate *appDelegate = (AppDelegate *) [UIApplication sharedApplication].delegate;
    
    _setStorageValue(@"LOCATION_UPDATE_URL", @"");
    _setStorageValue(@"LOCATION_UPDATE_USER_ID", @"");
    
    [appDelegate stopLocation];
}

- (NSString *) exLocationState {
    AppDelegate *appDelegate = (AppDelegate *) [UIApplication sharedApplication].delegate;
    
    return [appDelegate statusLocation];
}
@end
