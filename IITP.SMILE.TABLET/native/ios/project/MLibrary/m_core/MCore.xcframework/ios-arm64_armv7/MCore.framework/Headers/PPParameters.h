//
//  PPParameters.h
//  Library
//
//  Created by  on 11. 12. 22..
//  Copyright (c) 2011년 __MyCompanyName__. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface PPParameters : NSObject {
@private
    NSMutableDictionary* _parameters;
}

@property (nonatomic, retain) NSMutableDictionary* parameters;

- (id) initWithParamString:(NSString *)paramString;

+ (id) paramtersWithParamString:(NSString *)paramString;

- (void) parse:(NSString *)string;

- (NSString *) paramString;

- (NSDictionary *) scriptDictionary;

- (void) setObject:(NSString *)anObject forKey:(NSString *)aKey;

- (void) setObject:(NSString *)anObject forKey:(NSString *)aKey encoding:(NSStringEncoding)encoding;

- (NSString *) objectForKey:(NSString*)aKey;

- (NSString *) objectForKey:(NSString*)aKey encoding:(NSStringEncoding)encoding;

- (void) removeObjectForKey:(NSString *)aKey;

- (void) removeAllObjects;

- (void) addEntriesFromDictionary:(NSDictionary *)otherDictionary;

@end
