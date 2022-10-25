//
//  NSString+MPath.h
//

#import <Foundation/Foundation.h>

@class PPWebViewController;

@interface NSString (MPath)

- (NSString *)stringByAppendingRootPath;
- (NSString *)stringByDeletingRootPath;
- (NSString *)stringByReplacingAliasPath;
- (NSString *)stringByCompactingPath;
- (NSString *)stringByDeletingBaseURL;

- (BOOL)hasHttpScheme;
- (BOOL)hasFileSchema;
- (NSString *)normalizePathWithWebViewController:(PPWebViewController *)webViewController;
- (NSString *)navigationKey;

@end
