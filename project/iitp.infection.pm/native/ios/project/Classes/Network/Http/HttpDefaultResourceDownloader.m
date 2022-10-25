//
//  HttpResourceDownloader.m
//

#import "HttpDefaultResourceDownloader.h"

@interface HttpDefaultResourceDownloader () {
    PPHttpBaseProvider *_provider;
}

@end

@implementation HttpDefaultResourceDownloader

#if ! __has_feature(objc_arc)
- (void)dealloc {
    PP_RELEASE(_provider);
    
    [super dealloc];
}
#endif

- (id)initWithDelegate:(id<HttpMultiResourceDownloadDelegate>) downloaderDelegate URLString:(NSString *)urlString {
    self = [super init];
    if (self) {
        self.progressDelegate        = downloaderDelegate;
        self.url                     = urlString;
    }
    return self;
}

- (BOOL) start {
    _provider = [[PPHttpBaseProvider alloc] initWithUrl:self.url type:PPHttpBaseGetProvide];
    _provider.timeout = 180.0; // 리소스 다운로드시 Timeout 값
    _provider.delegate = self;
    
    [_provider startAsynchronous];
    
    return YES;
}


#pragma mark -
#pragma mark call HttpMultiResourceDownloadDelegate delegate method

- (void) didFinishHttpProvider:(PPHttpBaseProvider*)provider header:(NSDictionary*)header body:(NSData*)body encoding:(NSStringEncoding)encoding userdata:(NSArray*)provider_userdata {
    
    if (self.progressDelegate) {
        SEL selector = @selector(didFinishHttpResourceDownload:body:);
        
        if ([self.progressDelegate respondsToSelector:selector])         {
            [self.progressDelegate didFinishHttpResourceDownload:self.progressDelegate body:body];
        }
    }
    
    #if ! __has_feature(objc_arc)
    PP_RELEASE(_provider);
    [self release];
    #endif
}

- (void) didFailHttpProvider:(PPHttpBaseProvider*)provider errormsg:(NSString *)errormsg userdata:(NSArray *)provider_userdata {
    
    if (self.progressDelegate) {
        SEL selector = @selector(didFailHttpResourceDownload:errormsg:);
        
        if ([self.progressDelegate respondsToSelector:selector]) {
            [self.progressDelegate didFailHttpResourceDownload:self.progressDelegate errormsg:errormsg];
        }
    }
    
    #if ! __has_feature(objc_arc)
    PP_RELEASE(provider);
    [self release];
    #endif
}


- (void) downloadingHttpProvider:(id)provider totalsize:(NSNumber *)totalsize cursize:(NSNumber *)cursize userdata:(NSArray *)userdata {
    
    if (self.progressDelegate) {
        SEL selector = @selector(downloadingHttpResourceDownload:totalsize:cursize:);
        
        if ([self.progressDelegate respondsToSelector:selector]) {
            [self.progressDelegate downloadingHttpResourceDownload:self.progressDelegate totalsize:totalsize cursize:cursize];
        }
    }
}

@synthesize progressDelegate;
@synthesize url;

@end
