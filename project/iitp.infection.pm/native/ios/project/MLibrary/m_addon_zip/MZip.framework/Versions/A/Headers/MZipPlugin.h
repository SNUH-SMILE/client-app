//
//  MFileIOPlugin.h
//  Framework
//
//  Created by Uracle Lab on 13. 9. 6..
//
//

#import <Foundation/Foundation.h>

@interface MZipPlugin : NSObject
{
    NSBundle* _bundle;
    NSBundle* _strBundle;
}

@property (nonatomic, retain) NSBundle* bundle;
@property (nonatomic, retain) NSBundle* strBundle;

+ (MZipPlugin *) getInstance;

+ (NSString *) localizedStringForKey:(NSString *)key;

@end

#define PLUGIN_CLASS    MZipPlugin
#define PLUGIN_BUNDLE   @"MZip.bundle"

#define PGResource(res) [PLUGIN_BUNDLE appendPath:res]
#define PGLocalizedString(key, comment) [PLUGIN_CLASS localizedStringForKey:(key)]
