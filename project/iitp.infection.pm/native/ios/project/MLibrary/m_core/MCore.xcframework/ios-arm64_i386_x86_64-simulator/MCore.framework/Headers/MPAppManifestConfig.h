//
//  MPAppManifestConfig.h
//  Library
//
//  Created by Uracle Lab on 11. 6. 22..
//  Copyright 2011. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "PPViewControllerEnum.h"

@protocol  MPWebResourceValidCheckDelegate <NSObject>
    
@optional
- (BOOL) checkerIsOn;
- (BOOL) checkFile:(NSString *)filePath;
- (BOOL) checkData:(NSData *)data fileExtention:(NSString *)fileExt;
    
@end

#define CONFIG_FILE_NAME     @"AppManifest.xml"
#define CONFIG_FILE_ENC_NAME @"AppManifest.xml.enc"
#define CONFIG_FILE_NAME2_0     @"Manifest.xml"
#define CONFIG_FILE_ENC_NAME2_0 @"Manifest.xml.enc"

//#define DOC_CONFIG_PATH      [DOCUMENT_WEB_ROOT_PATH stringByAppendingPathComponent:CONFIG_FILE_NAME]
//#define BUN_CONFIG_PATH      [BUNDLE_WEB_ROOT_PATH stringByAppendingPathComponent:CONFIG_FILE_NAME]
//#define DOC_CONFIG_ENC_PATH  [DOCUMENT_WEB_ROOT_PATH stringByAppendingPathComponent:CONFIG_FILE_ENC_NAME]
//#define BUN_CONFIG_ENC_PATH  [BUNDLE_WEB_ROOT_PATH stringByAppendingPathComponent:CONFIG_FILE_ENC_NAME]

extern NSString *DOC_CONFIG_PATH;
extern NSString *BUN_CONFIG_PATH;
extern NSString *DOC_CONFIG_ENC_PATH;
extern NSString *BUN_CONFIG_ENC_PATH;
extern NSString *DOCUMENT_WEB_HTML_PATH;
extern NSString *BUNDLE_WEB_HTML_PATH;

typedef enum __MPConfigPathType {
    MPConfigPath_DOC,
    MPConfigPath_BUN,
    MPConfigPath_DOC_ENC,
    MPConfigPath_BUN_ENC
} MPConfigPathType;

typedef enum MPLogLevel {
    MPLogLvNone,
    MPLogLvError,
    MPLogLvWarn,
    MPLogLvInfo,
    MPLogLvDebug,
    MPLogLvVerbose
} MPLogLevel;

typedef enum MPUpdateMode {
    MPUpdateUndefined = 0,
    MPUpdateReal,
    MPUpdateDev
} MPUpdateMode;

@class HTTPServer;

@interface NSString(MPLogLevelEnum)

- (MPLogLevel) MPLogLevelFromString;

- (MPUpdateMode) MPUpdateModeFromString;

@end

@interface MPAppManifestConfig : NSObject {
    BOOL          _develop_mode;
    BOOL          _security;
//    BOOL          _logging;
    MPLogLevel    _logging;
    BOOL          _file_logging;
    NSString*     _master_orientation;
    NSString*     _default_orientation;
    NSString*     _default_animation;
    NSString*     _default_version;
    NSString*     _startpage_name;
    NSString*     _startpage_mode;
    NSString*     _intropage_name;

    BOOL          _display_stack_info;
    NSString*     _extend_wninterface;
    NSString*     _screenswitching_indicator;
    NSDictionary* _network_setting;
    NSString*     _res_locales_lang_js;
    NSString*     _system_language;
    MPUpdateMode  _update_mode;
    
    id            _savedNaviController;
    NSUInteger    _plistUIInterfaceOrientationMask;
    
    PPSupportOrientation _default_orientation_value;
    PPMasterOrientation  _master_orientation_value;
    PPAnimationType      _default_animation_value;

    NSString* _update_server_name;
    NSString* _update_server_type;
    NSString* _update_server_trode;
    
    NSMutableArray* _addons;
    NSMutableArray* _plugins;
    
    NSDictionary* _parsedConfig;
    
#if 1 // RSC CHECK
    BOOL       _resource_check_mode;
    NSArray   *_resource_check_files;
    id<MPWebResourceValidCheckDelegate>   _resource_check_interface;
#endif
}
@property (nonatomic, assign) BOOL          develop_mode;
@property (nonatomic, assign) BOOL          security;
@property (nonatomic, assign) BOOL          screenSwitchingIndicator;
//@property (nonatomic, assign) BOOL          logging;
@property (nonatomic, assign) MPLogLevel    logging;
@property (nonatomic, assign) BOOL          file_logging;
@property (nonatomic, copy)   NSString*     master_orientation;
@property (nonatomic, copy)   NSString*     default_orientation;
@property (nonatomic, copy)   NSString*     default_animation;


@property (nonatomic, assign) PPSupportOrientation       default_orientation_value;
@property (nonatomic, assign) PPMasterOrientation        master_orientation_value;
@property (nonatomic, assign) PPAnimationType            default_animation_value;


@property (nonatomic, assign) NSUInteger    plistUIInterfaceOrientationMask;
@property (nonatomic, copy)   NSString*     default_version;
@property (nonatomic, copy)   NSString*     startpage_name;
@property (nonatomic, copy)   NSString*     startpage_mode;
@property (nonatomic, copy)   NSString*     intropage_name;

@property (nonatomic, copy)   NSString*     extend_wninterface;
@property (nonatomic, copy)   NSDictionary* network_setting;
@property (nonatomic, assign) MPUpdateMode  update_mode;
@property (nonatomic, assign) BOOL          display_stack_info;
@property (nonatomic, copy)   NSString*     res_locales_lang_js;
@property (nonatomic, copy)   NSString*     system_language;
@property (nonatomic, copy)   NSString*     system_country;

@property (nonatomic, retain) id httpServer;
@property (nonatomic, readwrite) int httpPort;
@property (nonatomic, copy) NSString* httpBasePath;
@property (nonatomic, copy)   NSArray* local_server_array;

@property (nonatomic, retain) id savedNaviController;

#if 1
@property (nonatomic, assign)   BOOL      resource_check_mode;
@property (nonatomic, retain)   NSArray  *resource_check_files;
@property (nonatomic, retain)   id<MPWebResourceValidCheckDelegate>        resource_check_interface;
#endif

@property (nonatomic, copy)   NSString* update_server_name;
@property (nonatomic, copy)   NSString* update_server_trode;

@property (nonatomic, copy)   NSMutableArray* addons;
@property (nonatomic, copy)   NSMutableArray* plugins;

@property (nonatomic, retain) NSDictionary* parsedConfig;

@property (nonatomic, readonly) BOOL developMode;
@property (nonatomic, readonly) NSString *baseURL;

+ (MPAppManifestConfig*) getInstance;

- (void) configuration;
- (void) configAppManifestPath;
- (UIInterfaceOrientation)firstSupportedInterfaceOrientation;
- (BOOL)isSupportedInterfaceOrientation:(UIInterfaceOrientation)queryOrientation;
- (void) setVariableToStorage:(NSString*)key:(NSString*)value;
@end
