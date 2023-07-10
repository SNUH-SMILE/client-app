//
//  MMediaPlugin.h
//

#import <Foundation/Foundation.h>

@interface MMediaPlugin : MPlugin

+ (MMediaPlugin *)getInstance;

@end

#define PLUGIN_CLASS    MMediaPlugin
#define PLUGIN_BUNDLE   @"MMedia.bundle"

#define PGResource(res) [PLUGIN_BUNDLE appendPath:res]
#define PGLocalizedString(key, comment) [PLUGIN_CLASS localizedStringForKey:(key)]
