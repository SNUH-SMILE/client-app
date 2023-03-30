//
//  NSObject+JSON.h
//

#import <Foundation/Foundation.h>

@interface NSArray (JSON)

- (NSString *)jsonString;
- (NSString *)jsonHumanString;

@end

@interface NSDictionary (JSON)

- (NSString *)jsonString;
- (NSString *)jsonHumanString;

@end

@interface NSString (JSON)

- (id)objectFromJsonString;

@end
