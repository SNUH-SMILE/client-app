//
//  RTKFile.h
//  RTKTest
//
//  Created by jerome_gu on 2018/5/29.
//  Copyright © 2018年 jerome_gu. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@class UIImage;

@interface RTKFile : NSObject

+ (instancetype)fileWithPath:(NSString *)path;
- (instancetype)initWithPath:(NSString *)path;

//- (instancetype)initWithURL:(NSURL *)url;

@property (readonly, copy) NSString *path;

/// File Type
@property (readonly) BOOL isDirectory;
@property (readonly) BOOL isRegularFile;
@property (readonly) BOOL isSymbolicLink;
@property (readonly) BOOL isSocket;
@property (readonly) BOOL isCharacterSpecial;
@property (readonly) BOOL isBlockSpecial;
@property (readonly) BOOL isUnknown;
@property (readonly) BOOL isExtensionHidden;
@property (readonly) BOOL isImage;
@property (readonly) BOOL isAudio;
@property (readonly) BOOL isVideo;

@property (readonly) BOOL isHiddenFile;

@property (readonly) NSUInteger size;

@property (readonly) NSDate *creationDate;
@property (readonly) NSDate *modificationDate;

@property (readonly) UIImage *icon;


@property (readonly) NSString *fileName;
@property (readonly) NSString *displayName;
@property (readonly) NSString *fileExtension;
@property (readonly) NSString *parentDirectoryPath;

@end

NS_ASSUME_NONNULL_END
