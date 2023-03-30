//
//  PPResPath.h
//  Library
//
//  Created by Uracle Lab on 11. 5. 3..
//  Copyright 2011 . All rights reserved.
//

#import <Foundation/Foundation.h>

#define TOKEN_RESOURCE_ROOT  @"res"
//#define TOKEN_NATIVE_ROOT    @"native"
//#define TOKEN_NATIVE_IMAGE   @"img"
//#define TOKEN_NATIVE_LAYOUT  @"layout"
//#define TOKEN_NATIVE_DATA    @"data"
//#define TOKEN_NATIVE_VALUES  @"values"
#define TOKEN_WEB_ROOT       @"www"
#define TOKEN_NATIVE_ROOT    @"native" // same levle with 'www'
#define TOKEN_WEB_HTML       @"html"
//#define TOKEN_WEB_CSS        @"css"
//#define TOKEN_WEB_IMAGE      @"im"
//#define TOKEN_WEB_JS         @"js"
#define TOKEN_WEB_WNI        @"wni"

#define TOKEN_WEB_LOCALES    @"locales"

// === MAINBUNDLE PATH ================================================
#define BUNDLE_ROOT_PATH                [[[NSBundle mainBundle] resourcePath] stringByStandardizingPath]
#define BUNDLE_RESOURCE_ROOT_PATH       [BUNDLE_ROOT_PATH stringByAppendingPathComponent:TOKEN_RESOURCE_ROOT]
// --- NATIVE -------------------
#define BUNDLE_NATIVE_ROOT_PATH         [BUNDLE_RESOURCE_ROOT_PATH stringByAppendingPathComponent:TOKEN_NATIVE_ROOT]
//#define BUNDLE_NATIVE_IMAGE_PATH        [BUNDLE_NATIVE_ROOT_PATH stringByAppendingPathComponent:TOKEN_NATIVE_IMAGE]
//#define BUNDLE_NATIVE_LAYOUT_PATH       [BUNDLE_NATIVE_ROOT_PATH stringByAppendingPathComponent:TOKEN_NATIVE_LAYOUT]
//#define BUNDLE_NATIVE_DATA_PATH         [BUNDLE_NATIVE_ROOT_PATH stringByAppendingPathComponent:TOKEN_NATIVE_DATA]
//#define BUNDLE_NATIVE_VALUE_PATH        [BUNDLE_NATIVE_ROOT_PATH stringByAppendingPathComponent:TOKEN_NATIVE_VALUES]
// --- WEB ----------------------
#define BUNDLE_WEB_ROOT_PATH            [BUNDLE_RESOURCE_ROOT_PATH stringByAppendingPathComponent:TOKEN_WEB_ROOT]
//#define BUNDLE_WEB_HTML_PATH            [BUNDLE_WEB_ROOT_PATH stringByAppendingPathComponent:TOKEN_WEB_HTML]
//#define BUNDLE_WEB_CSS_PATH             [BUNDLE_WEB_ROOT_PATH stringByAppendingPathComponent:TOKEN_WEB_CSS]
//#define BUNDLE_WEB_IMAGE_PATH           [BUNDLE_WEB_ROOT_PATH stringByAppendingPathComponent:TOKEN_WEB_IMAGE]
//#define BUNDLE_WEB_JS_PATH              [BUNDLE_WEB_ROOT_PATH stringByAppendingPathComponent:TOKEN_WEB_JS]
#define BUNDLE_WEB_WNI_PATH             [BUNDLE_RESOURCE_ROOT_PATH stringByAppendingPathComponent:TOKEN_WEB_WNI]

#define BUNDLE_WEB_LOCALES_PATH         [BUNDLE_RESOURCE_ROOT_PATH stringByAppendingPathComponent:TOKEN_WEB_LOCALES]

// === DOCUEMNTS PATH =================================================
#define DOCUMENT_ROOT_PATH              [NSHomeDirectory() stringByAppendingPathComponent:@"Documents"]
#define DOCUMENT_RESOURCE_ROOT_PATH     [DOCUMENT_ROOT_PATH stringByAppendingPathComponent:TOKEN_RESOURCE_ROOT]
// --- NATIVE -------------------
#define DOCUMENT_NATIVE_ROOT_PATH       [DOCUMENT_RESOURCE_ROOT_PATH stringByAppendingPathComponent:TOKEN_NATIVE_ROOT]
//#define DOCUMENT_NATIVE_IMAGE_PATH      [DOCUMENT_NATIVE_ROOT_PATH stringByAppendingPathComponent:TOKEN_NATIVE_IMAGE]
//#define DOCUMENT_NATIVE_LAYOUT_PATH     [DOCUMENT_NATIVE_ROOT_PATH stringByAppendingPathComponent:TOKEN_NATIVE_LAYOUT]
//#define DOCUMENT_NATIVE_DATA_PATH       [DOCUMENT_NATIVE_ROOT_PATH stringByAppendingPathComponent:TOKEN_NATIVE_DATA]
//#define DOCUMENT_NATIVE_VALUE_PATH      [DOCUMENT_NATIVE_ROOT_PATH stringByAppendingPathComponent:TOKEN_NATIVE_VALUES]
// --- WEB ----------------------
#define DOCUMENT_WEB_ROOT_PATH          [DOCUMENT_RESOURCE_ROOT_PATH stringByAppendingPathComponent:TOKEN_WEB_ROOT]
//#define DOCUMENT_WEB_HTML_PATH          [DOCUMENT_WEB_ROOT_PATH stringByAppendingPathComponent:TOKEN_WEB_HTML]
//#define DOCUMENT_WEB_CSS_PATH           [DOCUMENT_WEB_ROOT_PATH stringByAppendingPathComponent:TOKEN_WEB_CSS]
//#define DOCUMENT_WEB_IMAGE_PATH         [DOCUMENT_WEB_ROOT_PATH stringByAppendingPathComponent:TOKEN_WEB_IMAGE]
//#define DOCUMENT_WEB_JS_PATH            [DOCUMENT_WEB_ROOT_PATH stringByAppendingPathComponent:TOKEN_WEB_JS]
#define DOCUMENT_WEB_WNI_PATH           [DOCUMENT_RESOURCE_ROOT_PATH stringByAppendingPathComponent:TOKEN_WEB_WNI]

#define DOCUMENT_WEB_LOCALES_PATH       [DOCUMENT_RESOURCE_ROOT_PATH stringByAppendingPathComponent:TOKEN_WEB_LOCALES]
