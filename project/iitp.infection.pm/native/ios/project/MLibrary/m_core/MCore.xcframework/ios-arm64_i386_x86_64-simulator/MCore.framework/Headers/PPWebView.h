//
//  PPWebView.h
//  Library
//
//  Created by numan4r on 11. 2. 8..
//  Copyright 2011 . All rights reserved.
//

#import <UIKit/UIKit.h>
#import <WebKit/WebKit.h>

@interface PPWebView : WKWebView {
    double    _startDate;
    id        _scriptDebugDelegate;
}
@property (nonatomic, assign) double    startDate;
@property (nonatomic, retain) id        scriptDebugDelegate;

+ (void)allowDisplayingKeyboardWithoutUserAction;

@end
