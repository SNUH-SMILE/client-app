//
//  PPHttpProviderDelegate.h
//  Library
//
//  Created by  on 11. 11. 23..
//  Copyright (c) 2011 . All rights reserved.
//

#import <Foundation/Foundation.h>

@protocol PPHttpProviderDelegate <NSObject>

@required
- (void) didFinishHttpProvider:(id)provider 
                        header:(NSDictionary *)header 
                          body:(NSData *)body
                      encoding:(NSStringEncoding)encoding
                      userdata:(NSArray*)userdata;

- (void) didFailHttpProvider:(id)provider 
                    errormsg:(NSString*)errormsg 
                    userdata:(NSArray*)userdata;

@optional

- (void) uploadingHttpProvider:(id)provider 
                     totalsize:(NSNumber *)totalsize 
                       cursize:(NSNumber *)cursize 
                      userdata:(NSArray *)userdata;

- (void) downloadingHttpProvider:(id)provider 
                       totalsize:(NSNumber *)totalsize 
                         cursize:(NSNumber *)cursize 
                        userdata:(NSArray *)userdata;

- (void) didFailHttpProvider:(id)provider
                    errormsg:(NSString*)errormsg
                    userdata:(NSArray*)userdata
                       error:(NSError *)error;

@end
