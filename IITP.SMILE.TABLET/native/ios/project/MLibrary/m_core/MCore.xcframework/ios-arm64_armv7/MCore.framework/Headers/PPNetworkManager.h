//
//  PPNetworkManager.h
//  Library
//
//  Created by  on 11. 8. 30..
//  Copyright 2011 . All rights reserved.
//

#import <Foundation/Foundation.h>

@protocol PPNetworkManager;
@protocol PPNetworkManagerDelegate;

@protocol PPNetworkManagerDelegate <NSObject>

@optional

//- (void) didFinishNetworkManager:(id<PPNetworkManager>)manager
//                    targetserver:(NSString*)targetserver
//                          trcode:(NSString*)trcode
//                        response:(NSString*)response
//                      cbfunction:(NSString*)cbfunction
//                        userdata:(NSArray*)userdata;
//
//- (void) didFailNetWorkManager:(id<PPNetworkManager>)manager
//                  targetserver:(NSString*)targetserver
//                        trcode:(NSString*)trcode
//                     errorcode:(NSString*)errorcode
//                      errormsg:(NSString*)errormsg
//                      userdata:(NSArray*)userdata;
//
//- (void) didFinishNetworkManager:(id<PPNetworkManager>)manager
//                    targetserver:(NSString*)targetserver
//                          trcode:(NSString*)trcode
//                        response:(NSString*)response
//                      cbfunction:(NSString*)cbfunction
//                           tagId:(NSString*)tagId
//                        userdata:(NSArray*)userdata;
//
//- (void) didFailNetWorkManager:(id<PPNetworkManager>)manager
//                  targetserver:(NSString*)targetserver
//                        trcode:(NSString*)trcode
//                         tagId:(NSString*)tagId
//                     errorcode:(NSString*)errorcode
//                      errormsg:(NSString*)errormsg
//                      userdata:(NSArray*)userdata;

- (void) didFinishNetworkManager:(id<PPNetworkManager>)manager
                    targetserver:(NSString*)targetserver
                          trcode:(NSString*)trcode
                        response:(NSString*)response
                      cbfunction:(NSString*)cbfunction
                           tagId:(NSString*)tagId
                    jsonUserData:(NSString*)jsonUserData
                        userdata:(NSArray*)userdata;

- (void) didFailNetWorkManager:(id<PPNetworkManager>)manager
                  targetserver:(NSString*)targetserver
                        trcode:(NSString*)trcode
                         tagId:(NSString*)tagId
                  jsonUserData:(NSString*)jsonUserData
                     errorcode:(NSString*)errorcode
                      errormsg:(NSString*)errormsg
                      userdata:(NSArray*)userdata;

- (void) downlodingNetworkManager:(id<PPNetworkManager>)manager
                        totalsize:(NSNumber*)totalsize 
                          cursize:(NSNumber*)cursize 
                         userdata:(NSArray*)userdata;


- (void) uploadingNetworkManager:(id<PPNetworkManager>)manager
                       totalsize:(NSNumber*)totalsize 
                         cursize:(NSNumber*)cursize 
                        userdata:(NSArray*)userdata;

@end

@protocol PPNetworkManager <NSObject>

@required

- (void) processWithViewCtrl:(UIViewController *)ctrl 
                      trcode:(NSString *)trcode
                        data:(NSObject *)data
               networkoption:(NSObject *)networkoption
                    delegate:(id<PPNetworkManagerDelegate>)delegate
                    userinfo:(NSArray *)userinfo;

- (void) configuration:(NSDictionary *)info;

@optional

+ (NSString *) networkName;

- (NSData *) resourceFileDownLoadWithUrl:(NSString*)url progressDelegate:(id)progressDelegate error:(NSError**)error;

- (NSData *) extendResourceDownWithUrl:(NSString*)url 
                      progressDelegate:(id)progressDelegate 
                          fileAllCount:(NSInteger)fileAllCount
                          fileCurCount:(NSInteger)fileCurCount
                                 error:(NSError**)error;

/* 리소스 멀티 다운로드 용 */
- (BOOL) extendMultiResourceDownloadWithUrl:(NSString*)url progressDelegate:(id)progressDelegate;

@end