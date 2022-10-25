//
//  HttpResourceDownloader.h
//

#import <Foundation/Foundation.h>

@interface HttpDefaultResourceDownloader : NSObject <PPHttpProviderDelegate>

@property (nonatomic, assign) id<HttpMultiResourceDownloadDelegate> progressDelegate;
@property (nonatomic, assign) NSString *url;

- (id)initWithDelegate:(id<HttpMultiResourceDownloadDelegate>) downloaderDelegate URLString:(NSString *)url;
- (BOOL)start;

@end
