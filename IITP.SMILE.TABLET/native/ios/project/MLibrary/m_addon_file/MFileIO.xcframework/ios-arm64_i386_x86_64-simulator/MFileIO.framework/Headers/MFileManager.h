//
//  MFileManager.h
//

#import <Foundation/Foundation.h>

extern NSString* const MFileManagerErrorDomain;

typedef void (^MFileHandlerCompletionBlock) (NSDictionary *pathInfo, NSError *error);
typedef void (^MFileTransProgressionBlock) (NSString *srcPath, NSString *dstPath, unsigned long long currentBytes, unsigned long long totalBytes, int currentIndex, int totalCount);
typedef void (^MFileTransCompletionBlock) (NSDictionary *transInfo, NSError *error);

@interface MFileManager : NSObject

- (BOOL)createAtPath:(NSString *)path type:(NSString *)type error:(NSError **)error;
- (NSDictionary *)writeFile:(NSString *)filePath contents:(NSString *)contents encoding:(NSStringEncoding)encoding error:(NSError **)error;
- (NSDictionary *)readFile:(NSString *)filePath encoding:(NSStringEncoding)encoding error:(NSError **)error;
- (NSDictionary *)readFileToBase64:(NSString *)filePath error:(NSError **)error;
- (NSDictionary *)copyAtPath:(NSString *)source toPath:(NSString *)destination overwrite:(BOOL)overwrite error:(NSError **)error progress:(MFileTransProgressionBlock)progress;
- (NSDictionary *)moveAtPath:(NSString *)source toPath:(NSString *)destination overwrite:(BOOL)overwrite error:(NSError **)error progress:(MFileTransProgressionBlock)progress;
- (NSDictionary *)infoAtPath:(NSString *)path error:(NSError **)error;
- (NSArray *)listAtPath:(NSString *)path error:(NSError **)error;
- (BOOL)removeAtPath:(NSString *)path error:(NSError **)error;

- (void)writeFile:(NSString *)filePath contents:(NSString *)contents encoding:(NSStringEncoding)encoding handler:(MFileHandlerCompletionBlock)handler;
- (void)readFile:(NSString *)filePath encoding:(NSStringEncoding)encoding handler:(MFileHandlerCompletionBlock)handler;
- (void)readFileToBase64:(NSString *)filePath handler:(MFileHandlerCompletionBlock)handler;
- (void)copyAtPath:(NSString *)source toPath:(NSString *)destination overwrite:(BOOL)overwrite progress:(MFileTransProgressionBlock)progress finish:(MFileTransCompletionBlock)finish;
- (void)moveAtPath:(NSString *)source toPath:(NSString *)destination overwrite:(BOOL)overwrite progress:(MFileTransProgressionBlock)progress finish:(MFileTransCompletionBlock)finish;

+ (MFileManager *)defaultManager;

@end
