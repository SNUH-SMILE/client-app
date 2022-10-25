//
//  MLocationPlugin.h
//

#import <Foundation/Foundation.h>

@interface MLocationPlugin : MPlugin

+ (MLocationPlugin *)getInstance;

@end

#define PLUGIN_CLASS    MLocationPlugin
#define PLUGIN_BUNDLE   @"MLocation.bundle"

#define PGResource(res) [PLUGIN_BUNDLE appendPath:res]
#define PGLocalizedString(key, comment) [PLUGIN_CLASS localizedStringForKey:(key)]
