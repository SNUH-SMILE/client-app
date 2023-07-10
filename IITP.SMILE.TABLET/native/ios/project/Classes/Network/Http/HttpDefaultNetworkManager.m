//
//  HttpDefaultNetworkManager.m
//

#import "HttpDefaultNetworkManager.h"
#import "ExPPDefaultNetworkIndicator.h"
#import "HttpDefaultResourceDownloader.h"

#define ContentTypeFormat @"application/x-www-form-urlencoded; charset=%@"

@interface HttpDefaultNetworkManager ()

@end

@implementation HttpDefaultNetworkManager

/*
 * @brief 비동기 데이터 통신 요청 함수, *구현 필수
 * @param viewController   현재 viewcontroller
 * @param path             전문코드
 * @param data             request data string
 * @param networkOption    네트워크 옵션 object
 * @param delegate         result를 넘겨 받을 delegete
 * @param userInfo         확장 변수들을 가지는 array object
 */
- (void)processWithViewCtrl:(UIViewController *)viewController trcode:(NSString *)path data:(NSString *)data networkoption:(PPNetworkOption *)networkOption delegate:(id<PPNetworkManagerDelegate>)delegate userinfo:(NSArray *)userInfo {
    
    // Provider 생성
    PPHttpBaseProvider *provider = nil;
    NSString *retargetURLString = networkOption.retargeturl;
    NSString *url = [NSString isEmpty:retargetURLString] ? _url : retargetURLString;
    
    if ( self.resourceUpdateURI && networkOption.restAction ) {
        NSString *restURLString = nil;
        
        if ( [NSString isEmpty:retargetURLString] ) {
            if ( [url hasSuffix:@"/"] || [path hasPrefix:@"/"] ) {
                restURLString = [url stringByAppendingString:path];
            }
            else {
                restURLString = [url stringByAppendingPathComponent:path];
            }
        }
        else {
            restURLString = retargetURLString;
        }
        
        PPDebug(@"restURL: %@", restURLString);
        
        provider = [[PPHttpBaseProvider alloc] initWithUrl:restURLString methodTypeString:networkOption.restAction];
    }
    else {
        PPDebug(@"url: %@", url);
    
        provider = [[PPHttpBaseProvider alloc] initWithUrl:url methodTypeString:PPHttpBasePostProvide];
    }
    
    // Indicator 설정
    if ( networkOption.indicator ) {
        NSString *indicatorMessage = [NSString isEmpty:networkOption.indicatorMsg] ?
                                            @"데이터 송수신 중입니다.\n잠시만 기다려주세요." :
                                            networkOption.indicatorMsg;
        
        [provider setExNetworkIndicatorClass:[ExPPDefaultNetworkIndicator class]];
        [provider setIndicatorWithViewCtrl:viewController msg:indicatorMessage cancelButton:networkOption.cancelable];
    }
    
    // Head 값 생성
    MAppInfo *appInfo = [MAppInfo sharedInfo];
    NSString *callbackName = @"";
    NSString *serviceID = @"";
    NSString *action = @"";
    
    if ( [networkOption.cbfunc isJavascriptFunction] ) {
        callbackName = [NSString nilToEmpty:networkOption.cbfunc];
    }
    
    if ( networkOption.jsonUserData ) {
        id jsonUserData = [networkOption.jsonUserData objectFromJsonString];
        if ( jsonUserData && [jsonUserData isKindOfClass:[NSDictionary class]] ) {
            action = [NSString nilToEmpty:[jsonUserData objectForKey:@"action"]];
            serviceID = [NSString nilToEmpty:[jsonUserData objectForKey:@"service_id"]];
        }
    }
    
    NSDictionary *head = @{
        @"appid":               [appInfo licenseIdentifier],
        @"app_name":            [appInfo applicationName],
        @"app_version":         [appInfo applicationVersion],
        @"device_id":           [appInfo deviceUUID],
        @"device_md":           [appInfo deviceModel],
        @"phone_no":            [appInfo phoneNumber],
        @"system_version":      [appInfo systemVersion],
        @"system_name":         [appInfo systemTypeName], // -- Gateway Server 2.2.2 버전 이상에서 @"iOS" 값으로 fix
        // @"system_name":         @"iPhone OS",             // -- Gateway Server 2.2.2 이전 버전에서 오류시 변경 필요
        @"callback_function":   callbackName,
        @"callback_request_data_flag": @"",
        @"screen_id":           @"",
        @"action":              action,
        @"service_id":          serviceID,
        // 필요시 Custom 하게 Head 값 추가 가능
        // @"user_id":             "sample_id",
        // @"user_name":           "sample_name",
    };
    
    // Body 값 생성
    id jsonBody = [data objectFromJsonString];
    
    // Request 값 설정
    NSDictionary *jsonRequest = @{
        @"head": head,
        @"body": jsonBody
    };
    
    // Debug Log
    PPDebug( @"requestData: %@", jsonRequest );
    
    NSData *requestData = [[jsonRequest jsonString] dataUsingEncoding:_encoding];
    
    // 암호화 설정
    if ( networkOption.encrypt ) {
        // TODO: 암호화가 필요한 경우 구현.
        
    }
    
    // Header 및 Data 설정
    NSMutableDictionary* requestHeaders = [NSMutableDictionary dictionary];
    
    if ( self.resourceUpdateURI && networkOption.restAction ) {
        NSString *mimetype = @"application/json";
        NSString *contentType = [NSString stringWithFormat:@"%@; charset=%@", mimetype, self.strEncoding];
        [requestHeaders setObject:contentType   forKey:@"Content-Type"  ];
        [requestHeaders setObject:mimetype   forKey:@"Accept"  ];
    
        if ( provider.type == PPHttpBasePutProvide || provider.type == PPHttpBasePostProvide ) {
            [provider appendPostData:requestData];
        }
    }
    else {
        NSString *contentType = [NSString stringWithFormat:ContentTypeFormat,_strEncoding];
        NSString *user_data_enc  = networkOption.encrypt ? @"y" : @"n";
        NSString *user_com_code  = path;
        NSString *user_data_type = @"json";
        NSString *service_code   = networkOption.dummy ? @"dummy" : @"";
        
        [requestHeaders setObject:contentType   forKey:@"Content-Type"  ];
        [requestHeaders setObject:user_data_type forKey:@"user_data_type"];
        [requestHeaders setObject:user_com_code  forKey:@"user_com_code" ];
        [requestHeaders setObject:user_data_enc  forKey:@"user_data_enc" ];
        [requestHeaders setObject:service_code   forKey:@"service_code"  ];
    
        [provider appendPostData:requestData];
    }
    
    [provider setRequestHeaders:requestHeaders];
    
    
    // Timeout 설정
    NSTimeInterval timeout = ( networkOption.timeOut != -1 ) ? networkOption.timeOut : _timeout;
    [provider setTimeout:timeout];
    
    // Delegate 설정
    [provider setDelegate:self];
    
    // 비동기 통신이기 때문에 파라매터로 받았던 데이터들을 통신이 종료 될때 까지 유지 시키기 위해 provider에 포함시킴
    userInfo = userInfo == nil ? @[] : userInfo;
    NSArray *arguments = @[viewController, path, data, networkOption, delegate, userInfo];
    
    // Arguments 를 UserData 로 저장
    // 비동기 통신이기 때문에 파라매터로 받았던 데이터들을 통신이 종료 될때 까지 유지 시키기 위해 provider에 UserData 로 설정
    [provider setUserData:arguments];
    
#if ! __has_feature(objc_arc)
    [viewController retain];
    [delegate retain];
#endif
    
    // Provider 시작
    [provider startAsynchronous];
}

/*
 * @brief 데이터 통신이 정상적으로 종료 되었을때 호출되는 함수.
 * @param provider           provider object
 * @param header             http response headers
 * @param body               http response body
 * @param encoding           reponse string charset encoding
 * @param provider_userdata  저장해둔 paramters
 */
- (void)didFinishHttpProvider:(id)provider header:(NSDictionary *)header body:(NSData *)body encoding:(NSStringEncoding)encoding userdata:(NSArray *)userData {
    PPDebug(@"http response header : %@", header);
    
    // 파라미터 복구
    NSArray *arguments = [NSArray arrayWithArray:userData];
    
    __unused UIViewController *viewController = [arguments objectAtIndex:0];
    __unused NSString *trcode = [arguments objectAtIndex:1];
    __unused NSString *data = [arguments objectAtIndex:2];
    __unused PPNetworkOption *networkOption = [arguments objectAtIndex:3];
    __unused id<PPNetworkManagerDelegate> delegate = [arguments objectAtIndex:4];
    __unused NSArray *userInfo = [arguments objectAtIndex:5];
    
    // DataType 확인
    NSString *dateType = @"JSON";
    NSString *responseBody = [[NSString alloc] initWithData:body encoding:encoding];
    id responseData = [responseBody objectFromJsonString];
    
    if ( self.resourceUpdateURI && networkOption.restAction ) {
        dateType = @"JSON";
        
    }
    else {
        dateType = [header stringForKey:@"user_data_type"];
        
        if ( ! [NSString isEmpty:[header stringForKey:@"user_com_code"]]) {
            trcode = [header stringForKey:@"user_com_code"];
        }
        
        BOOL encrypt = [[header stringForKey:@"user_data_enc"] boolValue];
        
        if (encrypt) {
            // 복호화가 필요한 경우 구현.
            
        }
    }
    
    // 넘어온 데이타 Log
    PPDebug(@"http response body : %@", [responseBody smartPrintMaxLength:3000]);
    
    // 데이타 변환
    NSInteger resultCode = 0;
    NSString *resultMessage = nil;
    NSString *callbackFunction = nil;
    id bodyObject = nil;
    
    @try {
        id headObject = [responseData objectForKey:@"head"];
        resultCode = [[headObject objectForKey:@"result_code"] integerValue];
        resultMessage = [headObject objectForKey:@"result_msg"];
        callbackFunction = [headObject objectForKey:@"callback_function"];
        
        if ([NSString isEmpty:callbackFunction]) {
            callbackFunction = networkOption.cbfunc;
        }
    
        bodyObject = [responseData objectForKey:@"body"];
        
    }
    @catch (NSException *e) {
        // 데이타 변환 오류시 익셉션 처리
        NSString *errorMessage = @"데이터를 처리하는 중 에러가 발생하였습니다.";
        [delegate didFailNetWorkManager:self
                               targetserver:networkOption.targetServer
                                     trcode:trcode 
                                      tagId:networkOption.uitag
                               jsonUserData:networkOption.jsonUserData
                                  errorcode:@"-1" 
                                   errormsg:errorMessage
                                   userdata:userInfo];
        
    #if ! __has_feature(objc_arc)
        PP_RELEASE(responseBody);
        PP_RELEASE(viewController);
        PP_RELEASE(delegate);
        PP_RELEASE(provider);
    #endif

        return;
    }
    
    // Result Code 값이 0 이 아니거나 200 이 아니면 오류
    if (resultCode != 00 && resultCode != 200 ) {
        [delegate didFailNetWorkManager:self 
                           targetserver:networkOption.targetServer
                                 trcode:trcode 
                                  tagId:networkOption.uitag
                           jsonUserData:networkOption.jsonUserData
                              errorcode:[NSString stringWithFormat:@"%@", @(resultCode)]
                               errormsg:resultMessage
                               userdata:userInfo];
        
    #if ! __has_feature(objc_arc)
        PP_RELEASE(responseBody);
        PP_RELEASE(viewController);
        PP_RELEASE(delegate);
        PP_RELEASE(provider);
    #endif
    
        return;
    }
    
    // 응답 완료
    [delegate didFinishNetworkManager:self
                         targetserver:networkOption.targetServer
                               trcode:trcode 
                             response:[bodyObject jsonString]
                           cbfunction:callbackFunction
                                tagId:networkOption.uitag
                         jsonUserData:networkOption.jsonUserData
                             userdata:userInfo];
    
#if ! __has_feature(objc_arc)
    PP_RELEASE(responseBody);
    PP_RELEASE(viewController);
    PP_RELEASE(delegate);
    PP_RELEASE(provider);
#endif

}

/*
 * @brief 데이터 통신이 비정상적으로 종료 되었을때 호출되는 함수.
 * @param provider           provider object
 * @param errormsg           오류 메세지
 * @param provider_userdata  저장해둔 paramters
 */
- (void)didFailHttpProvider:(id)provider errormsg:(NSString *)errormsg userdata:(NSArray *)userData {
    PPWarn(@"http data trans error : %@", errormsg);
    
    // 파라미터 복구
    NSArray *arguments = [NSArray arrayWithArray:userData];
    
    __unused UIViewController *viewController = [arguments objectAtIndex:0];
    __unused NSString *trcode = [arguments objectAtIndex:1];
    __unused NSString *data = [arguments objectAtIndex:2];
    __unused PPNetworkOption *networkOption = [arguments objectAtIndex:3];
    __unused id<PPNetworkManagerDelegate> delegate = [arguments objectAtIndex:4];
    __unused NSArray *userInfo = [arguments objectAtIndex:5];
    
    // call delegate method 
    [delegate didFailNetWorkManager:self 
                       targetserver:networkOption.targetServer
                             trcode:trcode
                              tagId:networkOption.uitag
                       jsonUserData:networkOption.jsonUserData
                          errorcode:@"-1"
                           errormsg:errormsg
                           userdata:userInfo];
    
#if ! __has_feature(objc_arc)
    PP_RELEASE(viewController);
    PP_RELEASE(delegate);
    PP_RELEASE(provider);
#endif
}

/*!
    @brief resource upadate download 시에 사용되는 method
    @remarks
    다운로드 속도 개선된 버전의 확장 영역 구현 코드 
    @param url                download url
    @param progressDelegate   progress delegate object
    @author eungwan@urcle.co.kr
    @date 2012.01.17 18:38
 */
-(BOOL) extendMultiResourceDownloadWithUrl:(NSString*)url progressDelegate:(id)progressDelegate {
    HttpDefaultResourceDownloader* downloader = [[HttpDefaultResourceDownloader alloc] initWithDelegate:progressDelegate URLString:url];
    return [downloader start];
}

@end
