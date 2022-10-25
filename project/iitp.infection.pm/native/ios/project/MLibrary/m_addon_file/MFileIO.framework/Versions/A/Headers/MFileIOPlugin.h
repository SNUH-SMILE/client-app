//
//  MFileIOPlugin.h
//

#import <Foundation/Foundation.h>

@interface MFileIOPlugin : MPlugin

+ (MFileIOPlugin *)getInstance;

@end

#define PLUGIN_CLASS    MFileIOPlugin
#define PLUGIN_BUNDLE   @"MFile.bundle"

#define PGResource(res) [PLUGIN_BUNDLE appendPath:res]
#define PGLocalizedString(key, comment) [PLUGIN_CLASS localizedStringForKey:(key)]
