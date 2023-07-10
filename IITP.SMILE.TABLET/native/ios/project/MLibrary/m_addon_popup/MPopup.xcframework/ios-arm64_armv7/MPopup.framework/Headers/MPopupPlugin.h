//
//  MPopupPlugin.h
//

#import <Foundation/Foundation.h>

@interface MPopupPlugin : MPlugin

+ (MPopupPlugin *)getInstance;

@end

#define PLUGIN_CLASS    MPopupPlugin
#define PLUGIN_BUNDLE   @"MPopup.bundle"

#define PGResource(res) [PLUGIN_BUNDLE appendPath:res]
#define PGLocalizedString(key, comment) [PLUGIN_CLASS localizedStringForKey:(key)]
