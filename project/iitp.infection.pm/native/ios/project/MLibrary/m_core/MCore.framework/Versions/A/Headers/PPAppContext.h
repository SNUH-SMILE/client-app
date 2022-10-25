//
//  PPAppContext.h
//  Library
//
//  Created by Uracle Lab on 12. 5. 21..
//  Copyright (c) 2012년 lab@uracle.co.kr. All rights reserved.
//

#import <Foundation/Foundation.h>

#define _setGlovalValue(_key, _value)  [[PPAppContext getInstance] setGlobalObject:_value key:_key]
#define _getGlovalValue(_key)          [[PPAppContext getInstance] globalObjectForKey:_key]

#define _setGlobalValue(_key, _value)  [[PPAppContext getInstance] setGlobalObject:_value key:_key]
#define _getGlobalValue(_key)          [[PPAppContext getInstance] globalObjectForKey:_key]
#define _setStorageValue(_key, _value) [[PPAppContext getInstance] setStorageObject:_value key:_key]
#define _getStorageValue(_key)         [[PPAppContext getInstance] storageStringForKey:_key]

#define _setLocaleValue(_lang, _region) [[PPAppContext getInstance] setLocaleValue:_lang region:_region]
#define _getLocaleValue(_key)         [[PPAppContext getInstance] localeValueForKey:_key]

#define CACHE_ENABLE @"CACHE_ENABLE"

#define STARTPAGE_ONLY @"STARTPAGE_ONLY"

#define NO_LOCAL_SERVER @"NO_LOCAL_SERVER"

#define STORAGE_RESET @"STORAGE_RESET"

#define PAGE_LOADING_DELAY @"PAGE_LOADING_DELAY"

#define PAGE_ANIMATION_DELAY @"PAGE_ANIMATION_DELAY"

@interface PPAppContext : NSObject {
@private
	NSMutableDictionary *_sharedVariable;
    NSDictionary* appStartOption;
    NSMutableDictionary *_localeVariable;
    WKProcessPool *PPProcessPool;
}

@property (nonatomic, readonly) NSMutableDictionary *sharedVariable;
@property (nonatomic, retain)   NSDictionary        *appStartOption;
@property (nonatomic, readonly) NSMutableDictionary *localeVariable;

+ (PPAppContext *) getInstance;

#pragma -
#pragma application valiable setter getter methods

- (void) setStorageObject: (NSString *) object key: (NSString *) key;

- (NSString *) storageObjectForKey: (NSString *) key;

- (NSString *) storageObjectForKeyAndRemove: (NSString *) key;

- (NSString *) storageStringForKey: (NSString *) key;

- (NSArray *) listAllStorageKeys;

- (NSDictionary *) listAllStorageValues;

- (void) removeStorageObject:(NSString *)key;

- (void) resetAllStorageKeys;

- (void) setLocaleValue: (NSString *) lang region: (NSString *) region;

- (NSString *) localeValueForKey: (NSString *) key;

- (WKProcessPool *)getProcessPool;

- (void)setManifestFile:(NSString *)fileName;

- (void)removeManifestFile;

#pragma -
#pragma global valiable setter getter methods

- (void) setGlobalObject: (NSString *) object key: (NSString *) key;

- (NSString *) globalObjectForKey: (NSString *) key;

- (NSString *) globalObjectForKeyAndRemove: (NSString *) key;

- (NSArray *) listAllGlobalKeys;

- (void) removeGlobalObject:(NSString *)key;

- (void) resetAllGlobalKeys;

+ (Class) NSClassFromStringForM:(NSString *)aClassName;

@end
