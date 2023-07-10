//
//  NSData+MSecurity.h
//

#import <Foundation/Foundation.h>

typedef NS_ENUM(NSInteger, MSecurityTransformation)  {
    MSecurityTransformationUnknown = 0,
    MSecurityTransformationAutoEncrypt = 0,
    MSecurityTransformationAutoDecrypt = 0,
    MSecurityTransformationAES128WithPKCS7Padding = 1,
    MSecurityTransformationAES256WithPKCS7Padding = 2
};

@interface NSString (MSecurity)

- (NSData *) dataFromHexString;

@end

@interface NSData (MSecurity)

- (NSString *)hexStringFromData;

- (NSData *)encrypt:(NSString *)keyString transformation:(MSecurityTransformation)transformation;
- (NSData *)decrypt:(NSString *)keyString transformation:(MSecurityTransformation)transformation;

+ (NSData *)encryptString:(NSString *)string transformation:(MSecurityTransformation)transformation;
+ (NSData *)decryptData:(NSData *)data transformation:(MSecurityTransformation)transformation;

+ (NSData *)encryptFile:(NSString *)filePath transformation:(MSecurityTransformation)transformation;
+ (NSData *)decryptFile:(NSString *)filePath transformation:(MSecurityTransformation)transformation;

+ (NSData *)dataWithHexString:(NSString *)hexString;

@end
