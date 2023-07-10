//
//  MZipPlugin.h
//

#import <Foundation/Foundation.h>

@interface MZipPlugin : MPlugin

+ (MZipPlugin *)getInstance;

@end

#define PLUGIN_CLASS    MZipPlugin
#define PLUGIN_BUNDLE   @"MZip.bundle"

#define PGResource(res) [PLUGIN_BUNDLE appendPath:res]
#define PGLocalizedString(key, comment) [PLUGIN_CLASS localizedStringForKey:(key)]
