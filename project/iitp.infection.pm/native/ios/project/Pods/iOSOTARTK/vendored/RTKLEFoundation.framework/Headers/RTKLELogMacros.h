//
//  RTKLELogMacros.h
//  RTKLEFoundation
//
//  Created by jerome_gu on 2019/1/8.
//  Copyright © 2019 Realtek. All rights reserved.
//

#ifndef RTKLELogMacros_h
#define RTKLELogMacros_h

#import "RTKLog.h"

#define RTKLogError(fmt, ...)   [RTKLog _logWithLevel:RTKLogLevelError format: (fmt), ## __VA_ARGS__]
#define RTKLogWarn(fmt, ...)    [RTKLog _logWithLevel:RTKLogLevelWarning format: (fmt), ## __VA_ARGS__]
#define RTKLogInfo(fmt, ...)    [RTKLog _logWithLevel:RTKLogLevelInfo format: (fmt), ## __VA_ARGS__]
#define RTKLogDebug(fmt, ...)   [RTKLog _logWithLevel:RTKLogLevelDebug format: (fmt), ## __VA_ARGS__]
#define RTKLogVerbose(fmt, ...) [RTKLog _logWithLevel:RTKLogLevelVerbose format: (fmt), ## __VA_ARGS__]

#endif /* RTKLELogMacros_h */
