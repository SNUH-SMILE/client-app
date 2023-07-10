//
//  MDbPlugin.h
//

#import <Foundation/Foundation.h>

@interface MDbPlugin : MPlugin

+ (MDbPlugin *)getInstance;

@end

#define PLUGIN_CLASS    MDbPlugin
#define PLUGIN_BUNDLE   @"MFile.bundle"

#define PGResource(res) [PLUGIN_BUNDLE appendPath:res]
#define PGLocalizedString(key, comment) [PLUGIN_CLASS localizedStringForKey:(key)]
