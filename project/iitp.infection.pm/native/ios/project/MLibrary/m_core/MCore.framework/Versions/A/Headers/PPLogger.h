//
//  PPLogger.h
//  Library
//
//  Created by Uracle Lab on 12. 4. 16..
//  Copyright (c) 2012년 eungwan@uracle.co.kr All rights reserved.
//

#import <Foundation/Foundation.h>
#import "MPAppManifestConfig.h"
#import "MPCategoryBundle.h"

#define TAG_FORMAT     @"%-23s "
#define LINE_FORMAT    @"(%3d): "
#define ETC_FORMAT     @"(---): "
#define PREFIX_FORMAT      [TAG_FORMAT stringByAppendingString:LINE_FORMAT]
#define PREFIX_ETC_FORMAT  [TAG_FORMAT stringByAppendingString:ETC_FORMAT]

#define LOG_SIMPLE_FILE_NM \
[[[NSString stringWithUTF8String:__FILE__] lastPathComponent] stringByDeletingPathExtension] 

#define MPFrameworkLogMake(_tagfrm_, _tagNm_, _tagLine_, _level_, _frm_, ...) \
    do {\
    NSString* _FORMAT_ = [NSString stringWithFormat:_tagfrm_,_tagNm_,_tagLine_];\
    _FORMAT_ = [_FORMAT_ stringByAppendingString:_frm_];\
    [[PPLogger getInstance] _level_:_FORMAT_ , ##__VA_ARGS__];\
} while(0)

#define MPLogMake(_level_, _frm_, ...) \
do { \
    NSString* _tag_ = LOG_SIMPLE_FILE_NM; \
    if ([_tag_ length] > 23) { \
        _tag_ = [_tag_ substringToIndex:21]; \
        _tag_ = [_tag_ stringByAppendingString:@".."]; \
    } \
    MPFrameworkLogMake(PREFIX_FORMAT, [_tag_ UTF8String], __LINE__, _level_, _frm_, ##__VA_ARGS__); \
} while(0)

#define MPDDebug(frm, ...)  MPLogMake(ddebug, frm, ##__VA_ARGS__)
#define MPDebug(frm, ...)   MPLogMake(debug, frm, ##__VA_ARGS__)
#define MPWarn(frm, ...)    MPLogMake(warn, frm, ##__VA_ARGS__)
#define MPError(frm, ...)   MPLogMake(error, frm, ##__VA_ARGS__)
#define MPInfo(frm, ...)    MPLogMake(info, frm, ##__VA_ARGS__)
#define MPVerbose(frm, ...) MPLogMake(verbose, frm, ##__VA_ARGS__)

#define MPLogWebToNative(_frm_, ...) \
MPFrameworkLogMake(PREFIX_ETC_FORMAT, "#### Web -> Native ####", "---", debug, _frm_, ##__VA_ARGS__)

#define MPLogNativeToWeb(_frm_, ...) \
MPFrameworkLogMake(PREFIX_ETC_FORMAT, "#### Native -> Web ####", "---", debug, _frm_, ##__VA_ARGS__)

#define MPWNLog(_level_, _frm_, ...) \
MPFrameworkLogMake(PREFIX_ETC_FORMAT, "####### WNLog #########", "---", _level_, _frm_, ##__VA_ARGS__)

#define MPWNVerbose(frm, ...) MPWNLog(verbose, frm, ##__VA_ARGS__)
#define MPWNDebug(frm, ...)   MPWNLog(debug, frm, ##__VA_ARGS__)
#define MPWNWarn(frm, ...)    MPWNLog(warn, frm, ##__VA_ARGS__)
#define MPWNError(frm, ...)   MPWNLog(error, frm, ##__VA_ARGS__)
#define MPWNInfo(frm, ...)    MPWNLog(info, frm, ##__VA_ARGS__)

#define MPWebKitLog(_frm_, ...) \
MPFrameworkLogMake(PREFIX_ETC_FORMAT, "======= WebKit ========", "---", verbose, _frm_, ##__VA_ARGS__)

#define DescriptionStrAppend(_buf, _name, _value) do { \
    if (![_buf isKindOfClass:[NSMutableString class]]) break; \
    if (![_name isKindOfClass:[NSString class]]) break; \
    if (![_value isKindOfClass:[NSString class]]) break; \
    NSString* _l_frm = @"\n| %@|"; \
    NSString* _c_frm = @"%-25s  ==>   [%@]"; \
    NSString* _c     = [NSString stringWithFormat:_c_frm, [_name UTF8String], _value]; \
    [_buf appendFormat:_l_frm, [_c rightPadding:@" " length:72]]; \
} while(0)\

@interface PPLogger : NSObject {
    
}

+ (PPLogger *) getInstance;

- (void) setLoggerLevel:(MPLogLevel) lvl;

- (void) verbose:(NSString *) format, ...;

- (void) ddebug:(NSString *) format, ...; // Debug 프로젝트에서만 로그가 찍힘

- (void) debug:(NSString *) format, ...;

- (void) info:(NSString *) format, ...;

- (void) warn:(NSString *) format, ...;

- (void) error:(NSString *) format, ...;

- (void) verbose:(NSString *)tag :(NSString *) format, ...;

- (void) debug:(NSString *)tag :(NSString *) format, ...;

- (void) info:(NSString *)tag :(NSString *) format, ...;

- (void) warn:(NSString *)tag :(NSString *) format, ...;

- (void) error:(NSString *)tag :(NSString *) format, ...;

@end
