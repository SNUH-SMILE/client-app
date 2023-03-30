//
//  WNInterface.h
//  Library
//
//  Created by Uracle Lab on 12. 5. 8..
//  Copyright (c) 2012년 lab@uracle.co.kr. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "NSObject+WNInterface.h"
#import "PPViewController.h"

@protocol WNInterface <NSObject>

- (void)setViewctrl:(PPViewController *)viewController;

@optional

- (BOOL)isAlive;
- (BOOL)checkValidParameters:(NSDictionary *)parameters fromValidClasses:(NSDictionary *)validClasses errorMessage:(NSString **)errorMessage;
- (BOOL)checkValidPath:(NSString *)path errorMessage:(NSString **)errorMessage;

+ (Class)initalizeClass;
+ (id)initializePlugin;

@end
