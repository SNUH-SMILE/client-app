//
//  MPushPlugin.h
//

#import <Foundation/Foundation.h>

@interface MPushPlugin : MPlugin

+ (MPushPlugin *)getInstance;

@end

#define PLUGIN_CLASS    MPushPlugin
#define PLUGIN_BUNDLE   @"MPush.bundle"

#define PGResource(res) [PLUGIN_BUNDLE appendPath:res]
#define PGLocalizedString(key, comment) [PLUGIN_CLASS localizedStringForKey:(key)]