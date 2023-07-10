//
//  MZipArchiveManager.h
//

#import <Foundation/Foundation.h>

typedef enum {
	MZipArchiveCompressionLevelDefault = -1,
	MZipArchiveCompressionLevelNone = 0,
	MZipArchiveCompressionLevelFastest = 1,
	MZipArchiveCompressionLevelBest = 9
} MZipArchiveCompressionLevel;

@interface NSString (MZipArchiveManager)

- (MZipArchiveCompressionLevel)compressionLevel;

@end

typedef void (^MZipArchiveZipCompletionBlock) (NSDictionary *zipInfo, NSError *error);
typedef void (^MZipArchiveUnzipCompletionBlock) (NSDictionary *unzipInfo, NSError *error);

@interface MZipArchiveManager : NSObject

@property (nonatomic, strong) NSString *password;

- (void)zip:(NSString *)zipPath list:(NSArray *)list overwrite:(BOOL)overwrite compressionLevel:(MZipArchiveCompressionLevel)compressionLevel handler:(MZipArchiveZipCompletionBlock)handler;
- (void)unzip:(NSString *)zipPath destination:(NSString *)destination overwrite:(BOOL)overwrite handler:(MZipArchiveUnzipCompletionBlock)handler;

@end
