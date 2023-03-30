//
//  Base64+CAT.h
//  Library
//
//  Created by Uracle Lab on 12. 5. 14..
//  Copyright (c) 2012년 lab@uracle.co.kr. All rights reserved.
//
#import <stdio.h>
#import <stdlib.h>
#import <string.h>
#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>

#define _nilToNull(_obj) (_obj == nil ? [NSNull null] : _obj)
#define _nullToNil(_obj) ([_obj isEqual:[NSNull null]] ? nil : _obj)

void *MPNewBase64Decode(const char *inputBuffer,
                      size_t length,
                      size_t *outputLength);

char *MPNewBase64Encode(const void *inputBuffer,
                      size_t length,
                      int separateLines,
                      size_t *outputLength);//
//  NSArray+CAT.h
//  Library
//
//  Created by Uracle Lab on 12. 5. 9..
//  Copyright (c) 2012년 lab@uracle.co.kr. All rights reserved.
//

//#import <Foundation/Foundation.h>

@interface NSArray (MPCategories)

#pragma mark -
#pragma mark reverse section

- (NSArray *) reversedArray;

#pragma mark -
#pragma mark get object and remove section

- (id) safeObjectAtIndex: (NSUInteger) index;

#pragma mark -
#pragma mark json section

//- (NSString *) jsonString;
//
//- (NSString *) jsonHumanString;

#pragma mark -
#pragma mark mutable deep copy section

- (NSMutableArray *) mutableDeepCopy;

@end

@interface NSMutableArray (MPCategories)

#pragma mark -
#pragma mark reverse section

- (void) reverse;

#pragma mark -
#pragma mark get object and remove section

- (id) safeObjectAtIndexAndRemove: (NSInteger) index;

@end
//
//  NSBundle+CAT.h
//  Library
//
//  Created by Uracle Lab on 12. 5. 30..
//  Copyright (c) 2012년 lab@uracle.co.kr. All rights reserved.
//

//#import <Foundation/Foundation.h>


//
//  NSData+CAT.h
//  Library
//
//  Created by Uracle Lab on 12. 5. 14..
//  Copyright (c) 2012년 lab@uracle.co.kr. All rights reserved.
//

//#import <Foundation/Foundation.h>

@interface NSData (MPCategories)

#pragma mark -
#pragma mark hex util section

//- (NSString *) hexStringFromData;

#pragma mark -
#pragma mark aes128 section

- (NSData *) mpAES128EncryptWithKey: (NSString *) key;
- (NSData *) mpAES128DecryptWithKey: (NSString *) key;


#pragma mark -
#pragma mark base64 section

- (NSString *) base64StringFromData;

#pragma mark -
#pragma mark json section

- (id) objectFromJsonData;

- (id) objectFromJsonDataUsingEncoding: (NSStringEncoding) encoding;


#pragma mark -
#pragma mark md5 hash code util

- (NSString *) md5FromData;

@end
//
//  NSDictionary+CAT.h
//  Library
//
//  Created by Uracle Lab on 12. 5. 9..
//  Copyright (c) 2012년 lab@uracle.co.kr. All rights reserved.
//

//#import <Foundation/Foundation.h>

@interface NSDictionary (MPCategories)

#pragma mark -
#pragma mark get object section

- (NSString *) stringForKey: (id) key;

- (NSInteger) integerForKey: (id) key;

- (int) intForKey: (id) key;

- (unsigned short) unsignedShortForKey: (id) key;

- (NSArray *) arrayForKey: (NSString *) key;

- (NSDictionary *) dictForKey: (NSString *) key;

- (id) objectForPath:(NSString *)path;

- (NSString *) stringForPath:(NSString *)path;

- (NSDictionary *) dictForPath:(NSString *)path;

- (NSArray *) arrayForPath:(NSString *)path;


//#pragma mark -
//#pragma mark json section
//
//- (NSString *) jsonString;
//
//- (NSString *) jsonHumanString;

#pragma mark -
#pragma mark web parameter section

- (NSString *) paramStringFromDict;

#pragma mark -
#pragma mark mutable deep copy section

- (NSMutableDictionary *) mutableDeepCopy;

@end

@interface NSMutableDictionary (MPCategories)

#pragma mark -
#pragma mark get object and remove section

- (NSString *) stringForKeyAndRemove: (id) key;

- (NSArray *) arrayForKeyAndRemove: (id) key;

- (NSDictionary *) dictForKeyAndRemove: (id) key;

- (void) exchangeKey:(NSString *)aKey withKey:(NSString *)aNewKey;

@end
//
//  NSFileManager+CAT.h
//  Library
//
//  Created by Uracle Lab on 12. 5. 14..
//  Copyright (c) 2012년 lab@uracle.co.kr. All rights reserved.
//

//#import <Foundation/Foundation.h>
//
//typedef enum MPCompLevel {
//	MPCompDefault = -1,
//	MPCompNone = 0,
//	MPCompFastest = 1,
//	MPCompBest = 9
//} MPCompLevel;

@interface NSFileManager (MPCategories)

#pragma mark -
#pragma mark file md5 section

- (NSString *) md5FromFilePath: (NSString *) path;

- (BOOL) isEqualToMd5: (NSString *) md5 filePath:(NSString *) path;

#pragma mark -
#pragma mark file directory size section

- (unsigned long long) fileSize:(NSString *)path;

- (NSNumber *) directorySize: (NSString *) directory;

- (NSNumber *) diskSpace;

#pragma mark -
#pragma function name short section

- (BOOL) isDir:(NSString *)path;

- (BOOL) isSymbolicLink:(NSString *) path;

#pragma mark -
#pragma zip file section

//- (BOOL) createZipFile:(NSString *)zipPath withFileAtPaths:(NSArray *)fileInfos error:(NSError **)err;
//
//- (BOOL) createZipFile:(NSString *)zipPath withFileAtPaths:(NSArray *)fileInfos 
//              password:(NSString *)password compressLevel:(MPCompLevel)complevel error:(NSError **)err;
//
//- (NSArray *) unzipFile: (NSString *) zipFile withDestinationPath: (NSString *) destination
//               password: (NSString *) password overwrite:(BOOL)overwrite error: (NSError **) err;

@end

//@interface NSString (ZipEnumParse)

//- (MPCompLevel) MPCompLevelFromString;

//@end
//
//  NSObject+CAT.h
//  Library
//
//  Created by Uracle Lab on 12. 5. 14..
//  Copyright (c) 2012년 lab@uracle.co.kr. All rights reserved.
//

//#import <Foundation/Foundation.h>

@interface NSObject (MPCategories)

#pragma mark -
#pragma mark common section

+ (BOOL) isNil:(NSObject *) obj;

#pragma mark -
#pragma mark reflector section

- (NSArray *) methodList;

- (NSArray *) propertyList;

- (NSArray *) setterMethodList;

- (NSArray *) getterMethodList;

- (id) invokeSelector: (SEL) selector argument: (id) args, ...;

- (id) invokeSelector: (SEL) selector argArray: (NSArray *) arguments;

+ (id) invokeWithTarget:(id)target selector:(SEL)selector argument:(id) args, ...;

+ (id) invokeWithTarget:(id)target selector:(SEL) selector argArray: (NSArray *) arguments;

- (BOOL) isTablet;

- (BOOL)isTabletIdiom;

- (BOOL) isOverIOS6;

- (BOOL) isOverIOS7;

- (BOOL) isOverIOS8;

- (BOOL) isOverIOS9;

- (BOOL) isOverIOS11;

- (BOOL) isOverIOS13;

- (BOOL) isiPhoneX;

- (NSInteger) iOSMajorSystemVersion;

@end
//
//  NSString+CAT.h
//  Library
//
//  Created by Uracle Lab on 12. 5. 9..
//  Copyright (c) 2012년 lab@uracle.co.kr. All rights reserved.
//

//#import <Foundation/Foundation.h>

#define _isString(_s)      [_s isKindOfClass :[NSString class]]
#define _format(_frm, ...) [NSString stringWithFormat:_frm, ##__VA_ARGS__]

/*!
 @class NSString(MPCategories)
 @brief NSString util categories
 @remarks String util categories
 @author eungwan@urcle.co.kr
 @date 2011.05.11 17:34
 */
@class PPWebViewController;

@interface NSString (MPCategories)

#pragma mark -
#pragma mark common section

+ (BOOL) isEmpty: (NSString *) src;

+ (NSString *) nilToEmpty: (NSString *) src;

+ (NSString *) nilToEmpty: (NSString *) src def: (NSString *) def;

- (NSString *) trim;

- (NSString *) repeatTimes:(NSUInteger)times;

#pragma mark -
#pragma mark match util section

- (int) countOfMatchString: (NSString *) src;

- (NSString *) matchWithRegularString: (NSString *) regular;

#pragma mark -
#pragma mark replace util section

- (NSString *) replaceAll: (NSString *) search replace: (NSString *) replace option: (NSStringCompareOptions) option;

- (NSString *) replaceAll: (NSString *) search replace: (NSString *) replace;

- (NSString *) remove: (NSString *) search;

- (NSString *) removeRegular: (NSString *) regular;

- (NSString *) removeNotNumber;

- (NSString *) removeNotDotAndNumber;

#pragma mark -
#pragma mark padding util section

- (NSString *) rightPaddingSpace: (NSInteger) len;

- (NSString *) rightPadding: (NSString *) separator length: (NSInteger) len;

- (NSString *) leftPaddingSpace: (NSInteger) len;

- (NSString *) leftPadding: (NSString *) separator length: (NSInteger) len;

- (NSString *) centerSpace: (NSInteger) len;

- (NSString *) center: (NSString *) separator length: (NSInteger) len;

#pragma mark -
#pragma mark json section

//- (id) objectFromJsonString;

#pragma mark -
#pragma mark number section

- (unsigned short) unsignedShortValue;

#pragma mark -
#pragma mark charset encoding section

- (NSStringEncoding) encodingValue;


#pragma mark -
#pragma mark ui orientation section

- (UIInterfaceOrientation) interfaceOrientationValue;

#pragma mark -
#pragma mark escape section

- (NSString *) stringByAddingFullEscapesUsingEncoding: (NSStringEncoding) encoding;

#pragma mark -
#pragma mark print section

- (NSString *) smartPrintMaxLength: (NSUInteger) length;

#pragma mark -
#pragma mark hex string section

//- (NSData *) dataFromHexString;

#pragma mark -
#pragma mark korean util section

- (NSString *) koreanSeparation;

#pragma mark -
#pragma mark base64 section

- (NSData *) dataFromBase64String;

#pragma mark -
#pragma func name short section

// stringByAppendingPathComponent => appendPath
- (NSString *) appendPath:(NSString *)path;

// lastPathComponent => lastPath
- (NSString *) lastPath;

#pragma mark -
#pragma mark paramter section

- (NSMutableDictionary *) dictionaryFromURLQuery;

- (NSMutableDictionary *) dictionaryFromURLQueryWithDecode;

- (NSMutableDictionary *) dictionaryFromInnerGlue: (NSString *) innerGlue
                                       outterGlue: (NSString *) outterGlue
                                        uriDecode: (BOOL) uriDecode;

- (NSMutableArray *) arrayFromURLQuery;

- (NSMutableArray *) arrayFromURLQueryWithDecode;

- (NSMutableArray *) arrayFromInnerGlue: (NSString *) innerGlue
                             outterGlue: (NSString *) outterGlue
                              uriDecode: (BOOL) uriDecode;

#pragma mark -
#pragma mark path section

- (NSString *) simplePath;

#pragma mark -
#pragma mark mimeType section

- (NSString *) mimeTypeFromExtension;


#pragma mark -
#pragma mark javascript section

//- (BOOL) isJavascriptFunction;
//- (NSString *) javascriptEscapeString;

- (NSString *)compactPath;
- (BOOL) hasHttpSchema;
- (BOOL) hasFileSchema;
- (NSString *)navikeyHtmlPath;
- (NSString *)fullHtmlPathOfWebViewController:(PPWebViewController  *)_viewctrl;

#if 1 // TMT
- (NSString *) removeLocalWebBase;
#endif

#pragma mark -
#pragma mark version compare section

- (NSComparisonResult) versionCompare:(NSString *)version;

@end
//
//  UIImage+CAT.h
//  Library
//
//  Created by Uracle Lab on 12. 6. 7..
//  Copyright (c) 2012년 lab@uracle.co.kr. All rights reserved.
//

//#import <UIKit/UIKit.h>

@interface UIImage (MPCategories)

- (UIImage *) rotate:(UIImageOrientation) orientation;

@end


#define NSStringFromUIDeviceOrientation(orientation) [NSString stringFromDeviceOrientation:orientation]
#define NSStringFromUIInterfaceOrientation(orientation) [NSString stringFromInterfaceOrientation:orientation]
#define NSStringFromUIInterfaceOrientationMask(orientation) [NSString stringFromInterfaceOrientationMask:orientation]

@interface NSString (PPNavigationController)

+ (NSString *)stringFromDeviceOrientation:(UIDeviceOrientation)orientation;
+ (NSString *)stringFromInterfaceOrientation:(UIInterfaceOrientation)orientation;
+ (NSString *)stringFromInterfaceOrientationMask:(NSUInteger)orientation;

@end
