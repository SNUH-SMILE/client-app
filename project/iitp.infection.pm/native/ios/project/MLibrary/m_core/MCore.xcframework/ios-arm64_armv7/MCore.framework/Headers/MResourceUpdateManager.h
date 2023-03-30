//
//  MResourceUpdateManager.h
//  MorpheusLibrary
//
//  Created by UracleLab on 2014. 10. 15..
//
//

#import <Foundation/Foundation.h>

@class MResourceUpdateManager;

@protocol MResourceUpdateManagerDelegate <NSObject>

@required

- (void)manager:(MResourceUpdateManager *)manager resultCode:(NSString*)resultCode resultInfo:(NSDictionary *)resultInfo;
- (void)manager:(MResourceUpdateManager *)manager serverName:(NSString *)serverName trcode:(NSString *)trcode errorCode:(NSString *)errorCode errorMessage:(NSString *)errorMessage;
- (void)manager:(MResourceUpdateManager *)manager currentSize:(NSNumber *)currentSize totalSize:(NSNumber *)totalSize fileCurrentCount:(NSNumber *)fileCurrentCount fileTotalCount:(NSNumber *)fileTotalCount;

@end

@interface MResourceUpdateInfo : NSObject

@property (nonatomic, readonly) NSString *serverName;
@property (nonatomic, readonly) NSDictionary *loginInfo;
@property (nonatomic, readonly) UIViewController *viewController;
@property (nonatomic, readonly) id <MResourceUpdateManagerDelegate> delegate;

@end

@interface MResourceUpdateManager : NSObject

@property (nonatomic, readonly) MResourceUpdateInfo *info;

+ (MResourceUpdateManager*)defaultManager;

- (void)updateResourceWithViewController:(UIViewController *)viewController delegate:(id<MResourceUpdateManagerDelegate>)delegate;

- (void)updateResourceWithViewController:(UIViewController *)viewController delegate:(id<MResourceUpdateManagerDelegate>)delegate parameter:(NSString *)jsonString;

- (void)updateResourceWithServerName:(NSString *)serverName
                                mode:(NSString *)mode
                      viewController:(UIViewController *)viewController
                            delegate:(id<MResourceUpdateManagerDelegate>)delegate;

- (void)updateResourceWithServerName:(NSString *)serverName
                                mode:(NSString *)mode
                                 rsp:(NSString *)rsp
                           loginInfo:(NSDictionary *)loginInfo
                      viewController:(UIViewController *)viewController
                            delegate:(id<MResourceUpdateManagerDelegate>)delegate;

- (void)updateResourceWithServerName:(NSString *)serverName
                                mode:(NSString *)mode
                                 rsp:(NSString *)rsp
                               check:(NSString *)check
                           loginInfo:(NSDictionary *)loginInfo
                      viewController:(UIViewController *)viewController
                            delegate:(id<MResourceUpdateManagerDelegate>)delegate;


- (void)resetVersionOfResources;

- (void)deleteResourceFiles;

@end
