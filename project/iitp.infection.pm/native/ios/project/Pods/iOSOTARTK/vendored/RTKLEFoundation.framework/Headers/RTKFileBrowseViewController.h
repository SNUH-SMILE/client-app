//
//  RTKFileBrowseViewController.h
//  RTKTest
//
//  Created by jerome_gu on 2018/5/29.
//  Copyright © 2018年 jerome_gu. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

typedef NS_ENUM(NSUInteger, RTKFileBrowseStyle) {
    RTKFileBrowseStyleView,
    RTKFileBrowseStyleSelection,
    RTKFileBrowseStyleViewAndSelection,
};


@class RTKFileBrowseViewController;

@protocol RTKFileBrowseViewControllerDelegate <NSObject>
@optional
- (BOOL)fileBrowseViewController:(RTKFileBrowseViewController *)browser shouldPreviewFileAtPath:(NSString *)path;
- (void)fileBrowseViewController:(RTKFileBrowseViewController *)browser didSelectRegularFileAtPath:(NSString *)path;
@end


@interface RTKFileBrowseViewController : UITableViewController

@property (nonatomic) RTKFileBrowseStyle style;

- (instancetype)initWithRootPath:(NSString *)path;

@property (nonatomic, copy) NSString *rootPath;

@property (nonatomic) NSURL *rootDirectoryURL;

// Default NO
@property (nonatomic) BOOL showHiddenFiles;

@property (weak) id<RTKFileBrowseViewControllerDelegate> delegate;

@property (readonly, nonatomic) NSString *currentDirectoryPath;

@property (readonly, nonatomic) NSURL *currentDirectoryURL;

@property (readonly) NSArray <NSString *> *contents;

@end

NS_ASSUME_NONNULL_END
