//
//  NSBundle+Localized.h
//

#import <Foundation/Foundation.h>

@interface NSBundle (Localized)

+ (NSBundle *)internalAppBundle;
+ (BOOL)setLanguage:(NSString *)language;
+ (BOOL)checkLanguage:(NSString *)language;

@end
