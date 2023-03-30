//
//  NSObject+WNInterface.h
//

#import <Foundation/Foundation.h>

@interface NSString (WNInterface)

- (BOOL)isJavascriptFunction;
- (NSString *)javascriptEscapeString;

@end

@interface NSObject (WNInterface)

- (NSString *)quoteString;

@end
