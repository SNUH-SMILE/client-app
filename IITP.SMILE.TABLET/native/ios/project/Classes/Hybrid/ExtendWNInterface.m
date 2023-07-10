//
//  ExtendWNInterface.m
//

#import "ExtendWNInterface.h"

@interface ExtendWNInterface ()

@property (nonatomic, assign) PPWebViewController *viewctrl;

@end

@implementation ExtendWNInterface

- (id)init {
    self = [super init];
    if (self) {
        
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

@end
