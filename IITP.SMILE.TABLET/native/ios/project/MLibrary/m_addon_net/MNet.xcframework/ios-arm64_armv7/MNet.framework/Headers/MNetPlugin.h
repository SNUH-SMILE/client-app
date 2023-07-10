//
//  MNetPlugin.h
//

#import <Foundation/Foundation.h>

@interface MNetPlugin : MPlugin

+ (MNetPlugin *)getInstance;

@end

#define PLUGIN_CLASS    MNetPlugin
#define PLUGIN_BUNDLE   @"MNet.bundle"

#define PGResource(res) [PLUGIN_BUNDLE appendPath:res]
#define PGLocalizedString(key, comment) [PLUGIN_CLASS localizedStringForKey:(key)]
