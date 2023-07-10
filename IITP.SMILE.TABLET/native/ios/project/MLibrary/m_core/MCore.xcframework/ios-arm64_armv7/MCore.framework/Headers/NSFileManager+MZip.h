//
//  NSFileManager+MZip.h
//

#import <Foundation/Foundation.h>

typedef enum {
	MZipCompressionLevelDefault = -1,
	MZipCompressionLevelNone = 0,
	MZipCompressionLevelFastest = 1,
	MZipCompressionLevelBest = 9
} MZipCompressionLevel;

@interface NSFileManager (MZip)

- (BOOL)createZipFile:(NSString *)zipPath withList:(NSArray *)list password:(NSString *)password compressionLevel:(MZipCompressionLevel)compressionLevel overwrite:(BOOL)overwrite error:(NSError **)error;
- (BOOL)createZipFile:(NSString *)zipPath withList:(NSArray *)list error:(NSError **)error;

- (NSArray *)unzipFile:(NSString *)zipPath toDestination:(NSString *)destination password:(NSString *)password overwrite:(BOOL)overwrite error:(NSError **)error;
- (NSArray *)unzipFile:(NSString *)zipPath toDestination:(NSString *)destination overwrite:(BOOL)overwrite error:(NSError **)error;

@end
