//
//  PPNetworkOption.h
//  Library
//
//  Created by  on 11. 10. 19..
//  Copyright 2011 . All rights reserved.
//

#import <Foundation/Foundation.h>

@interface PPNetworkOption : NSObject {
    NSString* _cbfunc;
    BOOL      _dummy;
    BOOL      _encrypt;
    BOOL      _indicator;
    NSString* _indicatorMsg;
    NSString* _retargeturl;
    BOOL      _cancelable;
    NSString* _targetServer;
    // only socket network use
    NSString* _restemplete;
    NSString* _uitag;
    BOOL      _isStartTr;
    int       _timeOut; /* 전문별 타임 아웃값 : default = -1 = use appmanifest.xml value */
    NSString* _jsonUserData; /* 화면의 json user 데이터 */
    NSString* _restAction;
}

@property (nonatomic, copy)   NSString* cbfunc;
@property (nonatomic, assign) BOOL dummy;
@property (nonatomic, assign) BOOL encrypt;
@property (nonatomic, assign) BOOL indicator;
@property (nonatomic, copy)   NSString* indicatorMsg;
@property (nonatomic, copy)   NSString* retargeturl;
@property (nonatomic, assign) BOOL cancelable;
@property (nonatomic, copy)   NSString* targetServer;
@property (nonatomic, assign) int timeOut;
// only socket network use
@property (nonatomic, copy)   NSString* restemplete;
@property (nonatomic, copy)   NSString* uitag;
@property (nonatomic, assign) BOOL isStartTr;
@property (nonatomic, copy)   NSString* jsonUserData;
// only http rest use
@property (nonatomic, copy)   NSString* restAction;

@property (nonatomic, strong) NSString *progressHandler;
@property (nonatomic, strong) NSString *finishHandler;

@end
