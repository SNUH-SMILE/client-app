//
//  ExtendWNInterface.m
//

#import "ExtendWNInterface.h"

@interface ExtendWNInterface ()



@end

@implementation ExtendWNInterface

- (id)init {
    self = [super init];
    if (self) {
        self.sbm = [UTESmartBandManager shared];
    }
    return self;
}

- (BOOL)checkValidParameters:(NSDictionary *)parameters fromValidClasses:(NSDictionary *)validClasses errorMessage:(NSString **)errorMessage {
    
    for ( NSString *key in validClasses ) {
        Class validClass = [validClasses objectForKey:key];
        id parameter = [parameters objectForKey:key];
        
        if ( parameter == nil ) {
            *errorMessage = [NSString stringWithFormat:@"key(%@) is null", key];
            return NO;
        }
        
        if ( ![parameter isKindOfClass:validClass] ) {
            *errorMessage = [NSString stringWithFormat:@"key(%@) is invalid type", key];
            return NO;
        }
        
        if ( [validClass isEqual:[NSString class]] && [[parameter stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]] isEqualToString:@""]) {
            *errorMessage = [NSString stringWithFormat:@"key(%@) is invalid", key];
            return NO;
        }
        else if ( [validClass isEqual:[NSDictionary class]] ) {
            *errorMessage = [NSString stringWithFormat:@"key(%@) is invalid", key];
            return NO;
        }
        else if ( [validClass isKindOfClass:[NSArray class]] ) {
            *errorMessage = [NSString stringWithFormat:@"key(%@) is invalid", key];
            return NO;
        }
    }
    
    return YES;
}

- (BOOL)isAlive {
    if (![[PPNavigationController ppNavigationController] existViewController:_viewController]) {
        PPDebug(@"Already released view controller!!");
        return NO;
    }
    
    return YES;
}

// Callback 구조를 설명하기 위한 Sample Interface
- (NSString *)wnSampleCallback:(NSString *)jsonString {
    NSDictionary *options = [jsonString objectFromJsonString];
    
    if (!options) {
        return [@{@"status":@"FAIL", @"error":@"invalid params"} jsonString];
    }

    NSString *invalidMessage = nil;
    NSDictionary *validClasses = @{
        @"callback": [NSString class]
    };
    
    if ( ! [self checkValidParameters:options fromValidClasses:validClasses errorMessage:&invalidMessage] ) {
        return [@{@"status":@"FAIL", @"error":invalidMessage} jsonString];
    }
    
    NSString *callback = [options objectForKey:@"callback"];
    
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, 0.35 * NSEC_PER_SEC), dispatch_get_main_queue(), ^{
        NSDictionary *resultInfo = @{
            @"status": @"SUCCESS"
        };
        
        [self.viewController callCbfunction:callback withObjects:resultInfo, nil];
    });
    
    return [@{ @"status": @"PROCESSING" } jsonString];
}

-(void)exWNLocalPush:(NSString *)jsonString
{
    NSMutableDictionary *options = [jsonString objectFromJsonString];
    NSString *title = [options objectForKey:@"title"];
    NSString *body = [options objectForKey:@"body"];

    UNMutableNotificationContent *content = [[UNMutableNotificationContent alloc] init];
    if(title && [title length] > 0)
    {
        content.title = title;
    }
    content.body = body;
    content.sound = UNNotificationSound.defaultSound;
    NSDictionary *infoDict = [self getUserInfo:options];
    content.userInfo = infoDict;
    
    UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
    UNNotificationRequest *request = [UNNotificationRequest requestWithIdentifier:@"localPush" content:content trigger:nil];
    [center addNotificationRequest:request withCompletionHandler:^(NSError * _Nullable error) {
    }];
}

-(void)exWNSyncPush
{
    [[UNUserNotificationCenter currentNotificationCenter] removeAllPendingNotificationRequests];
    NSMutableArray *array = [self.sbm selectPushList];
    if(array)
    {
        for(NSDictionary *dic in array)
        {
            NSString *title = [dic objectForKey:@"title"];
            NSString *body = [dic objectForKey:@"body"];
            NSString *time = [dic objectForKey:@"time"];
            NSString *pushid = [dic objectForKey:@"id"];
            NSString *key = [NSString stringWithFormat:@"%@%@", pushid, time];
            
            NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
            [formatter setDateFormat:@"yyyy-MM-dd HH:mm:ss"];
            NSDate *date = [formatter dateFromString:time];
            
            UNMutableNotificationContent *content = [[UNMutableNotificationContent alloc] init];
            if(title && [title length] > 0)
            {
                content.title = title;
            }
            content.body = body;
            content.sound = UNNotificationSound.defaultSound;
            
            NSDateComponents *dateComponent = [[NSCalendar currentCalendar] components:NSCalendarUnitYear | NSCalendarUnitMonth | NSCalendarUnitDay | NSCalendarUnitHour | NSCalendarUnitMinute | NSCalendarUnitSecond fromDate:date];
            
            dateComponent.day = dateComponent.day + 1;
            
            UNCalendarNotificationTrigger *trigger = [UNCalendarNotificationTrigger triggerWithDateMatchingComponents:dateComponent repeats:NO];
            
            UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
            UNNotificationRequest *request = [UNNotificationRequest requestWithIdentifier:key content:content trigger:trigger];
            [center addNotificationRequest:request withCompletionHandler:^(NSError *error) {
            }];
        }
    }
}

-(NSMutableDictionary *)getUserInfo:(NSMutableDictionary *)dic
{
    NSString *title = [dic objectForKey:@"title"];
    NSString *body = [dic objectForKey:@"body"];
    NSString *ext = [dic objectForKey:@"ext"];
    
    NSMutableDictionary *alert = [NSMutableDictionary dictionary];
    if(title && [title length] > 0)
    {
        [alert setObject:title forKey:@"title"];
    }
    [alert setObject:body forKey:@"body"];
    
    NSMutableDictionary *aps = [NSMutableDictionary dictionary];
    [aps setObject:alert forKey:@"alert"];
    
    NSMutableDictionary *mps = [NSMutableDictionary dictionary];
    if(ext && [ext length] > 0)
    {
        [mps setObject:ext forKey:@"ext"];
    }
    
    NSMutableDictionary *userInfo = [NSMutableDictionary dictionary];
    [userInfo setObject:aps forKey:@"aps"];
    [userInfo setObject:mps forKey:@"mps"];
    
    return userInfo;
}

@end
