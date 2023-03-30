//
//  MPlugin.h
//

#import <Foundation/Foundation.h>

@interface MPlugin : NSObject

@property (nonatomic, strong) NSBundle *bundle;
@property (nonatomic, readonly) NSString *bundleFileName;
@property (nonatomic, readonly, copy) NSDictionary *pluginInfoDictionary;

- (void)initialize;

+ (NSString *)localizedStringForKey:(NSString *)key;

@end
