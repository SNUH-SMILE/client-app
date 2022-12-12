//
//  PushReceiver.m
//

#import "PushReceiver.h"

typedef void(^PushReceiverExtLoadHandler)(BOOL success, NSString *richData, NSError *error);

@interface PushReceiver () <PushManagerDelegate>

@end

@implementation PushReceiver

- (id)init {
    self = [super init];
    if (self) {
#ifdef DEBUG
        [[PushManager defaultManager].info changeMode:@"DEV"];
#endif
        
        [PushManager defaultManager].enabled = YES;
    }
    return self;
}

- (void)manager:(PushManager *)manager didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
    
}

-(void) didReceiveUserNotification:(NSDictionary *)userInfo status:(NSString *)status messageUID:(NSString *)messageUID {
    NSString *extHTML = [[userInfo objectForKey:@"mps"] objectForKey:@"ext"];
    
    if ( extHTML != nil && [extHTML hasSuffix:@"_ext.html"] ) {
        [self loadExtData:extHTML handler:^(BOOL success, NSString *richData, NSError *error) {
            NSDictionary *notification = [NSMutableDictionary dictionaryWithDictionary:userInfo];
            [[notification objectForKey:@"mps"] setObject:richData forKey:@"ext"];
            
            [self movePushActivityWithNotification:[NSDictionary dictionaryWithDictionary:notification] status:status messageUID:messageUID];
        }];
    }
    else {
        [self movePushActivityWithNotification:userInfo status:status messageUID:messageUID];
    }
}

- (void)manager:(PushManager *)manager didReceiveUserNotification:(NSDictionary *)userInfo status:(NSString *)status messageUID:(NSString *)messageUID {
    
    NSString *extHTML = [[userInfo objectForKey:@"mps"] objectForKey:@"ext"];
    
    if ( extHTML != nil && [extHTML hasSuffix:@"_ext.html"] ) {
        [self loadExtData:extHTML handler:^(BOOL success, NSString *richData, NSError *error) {
            NSDictionary *notification = [NSMutableDictionary dictionaryWithDictionary:userInfo];
            [[notification objectForKey:@"mps"] setObject:richData forKey:@"ext"];
            
            [self movePushActivityWithNotification:[NSDictionary dictionaryWithDictionary:notification] status:status messageUID:messageUID];
        }];
    }
    else {
        [self movePushActivityWithNotification:userInfo status:status messageUID:messageUID];
    }
}

- (void)loadExtData:(NSString *)extHTML handler:(PushReceiverExtLoadHandler)handler {
    
    NSURL *url = [NSURL URLWithString:extHTML];
    
    if (!url) {
        handler(NO, extHTML, nil);
        return;
    }
    
    [NSURLConnection sendAsynchronousRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:extHTML]]
                                       queue:[NSOperationQueue mainQueue]
                           completionHandler:^(NSURLResponse *response, NSData *data, NSError *connectionError) {
                               
                               if ( connectionError != nil ) {
                                   dispatch_async(dispatch_get_main_queue(), ^{
                                       handler(NO, extHTML, connectionError);
                                   });
                                   return;
                               }
                               
                               NSHTTPURLResponse* httpResponse = (NSHTTPURLResponse *)response;
                               
                               if ( httpResponse.statusCode != 200 ) {
                                   dispatch_async(dispatch_get_main_queue(), ^{
                                       handler(NO, extHTML, nil);
                                   });
                                   return;
                               }
                               
                               NSStringEncoding textEncoding = ( [response textEncodingName] ) ? [response textEncodingName].encodingValue : NSUTF8StringEncoding;
                               
                               NSString *result = [[NSString alloc] initWithData:data encoding:textEncoding];
                               NSString *richData = [NSString stringWithString:result];
                               //richData = [richData stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
                               
#if ! __has_feature(objc_arc)
                               [result release];
#endif
                               
                               dispatch_async(dispatch_get_main_queue(), ^{
                                   handler(YES, richData, nil);
                               });
                           }];
}

- (void)movePushActivityWithNotification:(NSDictionary *)notification status:(NSString *)status messageUID:(NSString *)messageUID {
    PPNavigationController *navigationController = [PPNavigationController ppNavigationController];
    PPWebViewController *current = (PPWebViewController *)navigationController.currentViewCtrl;
    
    while ( navigationController.isAnimating ) {
        [[NSRunLoop currentRunLoop] runMode:NSDefaultRunLoopMode beforeDate:[NSDate distantFuture]];
    }
    
    NSString *payload = [notification jsonString];
    NSString *pushType = @"APNS";
    [current callCbfunction:@"oniOSReceiveNotification" withObjects:@{@"status":status, @"payload":[payload objectFromJsonString], @"type":pushType, @"messageUID": messageUID}, nil];
}


@end
