//
//  MNetExtPlugin.h
//

#import <Foundation/Foundation.h>

@interface MNetExtPlugin : MPlugin

+ (MNetExtPlugin *)getInstance;

@end

#define PLUGIN_CLASS    MNetExtPlugin
#define PLUGIN_BUNDLE   @"MNetExt.bundle"

#define PGResource(res) [PLUGIN_BUNDLE appendPath:res]
#define PGLocalizedString(key, comment) [PLUGIN_CLASS localizedStringForKey:(key)]
