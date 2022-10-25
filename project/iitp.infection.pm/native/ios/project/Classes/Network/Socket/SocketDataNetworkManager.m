//
//  SocketDataNetworkManager.m
//  MorpheusProject
//
//  Created by Uracle Lab on 12. 7. 4..
//  Copyright (c) 2012년 lab@uracle.co.kr. All rights reserved.
//

#import "SocketDataNetworkManager.h"
#import "PPIndicatorUtil.h"
#import "SocketDataContext.h"
#import "SocketDataContexts.h"
#import <MCore/PPGCDSocketProvider.h>

@interface SocketDataNetworkManager() <PPAbstractSocketNetworkManager,PPGCDSocketProviderDelegate, SocketDataContextDelegate> {
    PPGCDSocketProvider*  _provider;
    NSLock* _lock;
}

@end

/*!
 @class SocketDataNetworkManager
 @brief Sample Socket Network Manager class
 @remarks 
    - Sample Socket Network Manager class로 로직을 다 구현해야 실행이 가능하다.
    - 서버마다 맞추어야 하는 protocol이 틀리므로 해당 규칙으로 맞추어 구현한다.
 @date 2012.07.04
 */
@implementation SocketDataNetworkManager

#pragma mark -
#pragma mark init and delloc method



/*
 @brief init function
 @remarks 
    - lock object 초기화 필요.
 @result self
 @date 2012.07.04
 */

- (id)init  {
    self = [super init];
    if (self) {
        _lock = [[NSLock alloc] init];
    }
    return self;
}

- (BOOL)startHandshake {
    return YES;
}



/*!
@brief dealloc function
@remarks 
    - socket provier / lock object release 필요.
@result void
@date 2012.07.04
 */
- (void) dealloc  {

    _provider = nil;

    [_lock unlock];
    _lock = nil;
}

#pragma mark -
#pragma mark PPAbstractSocketNetworkManager protocol method



/*!
 @brief head를 받아 body size를 반환하는 메서드
 @remarks 
   - PPAbstractSocketNetworkManager protocol method 로 [필수] 구현 method 이다.
   - PPSocketProvider 객체에 의해서 호출된다.
   - socket provider(PPSocketProvider) 객체에서 서버로부터 response를 받으면 
     객체에 정의된 head 사이즈 만큼 먼저 읽어 이 함수를 호출하게된다. 
     개발자는 head 정보를 분석하여 body size를 반환하도록 로직을 추가한다.
     만약 server 와의 Protocol 정의중 body size가 고정인 경우 고정값을 반환 해주면 된다.
 @result body size
 @date 2012.07.04
 */
- (UInt16)bodySize:(NSData *)head  {
    UInt16 body_size = 0;
    // TODO: Head 정보에서 body size를 가져오는 로직 구현.

    return body_size;
}



/*!
 @brief send request에 process에 걸려있는 lock을 해제하는 함수.
 @remarks 
   - PPAbstractSocketNetworkManager protocol method 로 [필수] 구현 method 이다.
   - PPSocketProvider 객체에 의해서 호출된다.
   - socket provider(PPSocketProvider) 객체에서 서버로 request를 다 전송하면 이함수를 호출하게 된다.
     lock을 풀어주는 역활을 한다.(lock이 필요없는 경우는 사용을 안해도 상관없음)
 @result void
 @date 2012.07.04
 */
- (void)releaseTheLock  {
    [_lock unlock];
}



/*!
 @brief provider를 초기화하는 메서드이다.
 @remarks 
   - PPAbstractSocketNetworkManager protocol method 로 [필수] 구현 method 이다.
   - NetworkManagerPool에서 호출되는 method로 provider를 초기화 한다.
   - Manager의 host / port / encoding / timeout 정보는 
     이 함수가 호출되기 전에 Appmanifest.xml 정보를 가져와 셋팅된다.
   - 서버와의 프로토콜 정의의 head 길이와, tail 길이를 반드시 셋팅하여야 한다.
 @result void
 @date 2012.07.04
 */
- (void) initProvider  {
    _provider = [[PPGCDSocketProvider alloc] init];
    
    if ([NSString isEmpty:_provider.host] || _provider.port == 0) {
        _provider.host = _host;
        _provider.port = _port;
    }

    _provider.delegate = self;

    // NOTICE : 서버 protocol의 head 길이를 입력한다.
    _provider.recvHeadSize = 5;

    // NOTICE : 서버 protocol의 tail 길이를 입력한다.
    _provider.recvTailSize = 2;
}



#pragma mark -
#pragma mark PPNetworkManager protocol method

/*!
 @brief head를 받아 body size를 반환하는 메서드
 @remarks 
   - PPAbstractSocketNetworkManager(부모 class)에 선언되어있는 method로 [필수] override method 이다.
   - 외부에서 호출되는 method로 web 혹은 native에서 전달 받은 데이터를 분석하여 request data를 생성하고
     전송한다.
   - 서버 환경에 따라 이 method에서 request를 만드는 규칙, context를 저장하는 규칙등을 구현해야한다.(주석 참고)
 @result void
 @date 2012.07.04
 */
- (void) processWithViewCtrl:(UIViewController *)ctrl 
                      trcode:(NSString *)trcode
                        data:(NSString *)reqPacketData
               networkoption:(PPNetworkOption *)networkoption
                    delegate:(id<PPNetworkManagerDelegate>)delegate
                    userinfo:(NSArray *)userinfo {

    PPDebug(@"\n\nPROCESS(%@), TRCODE[%@]\n\n", [networkoption targetServer], trcode);
    
    // privider가 서버 접속에 실패한 경우.
    if (![_provider isConnected] && ![_provider connect]) {
        [_lock unlock];

        // delegate 함수로 fail event를 발생한다.
        // error 코드는 화면 개발자와 통일 하여 정의 한다.
        [delegate didFailNetWorkManager:self 
                           targetserver:[networkoption targetServer]
                                 trcode:trcode 
                                  tagId:[networkoption uitag]
                           jsonUserData:networkoption.jsonUserData
                              errorcode:@"-1"
                               errormsg:@"서버 접속에 실패 하였습니다."
                               userdata:userinfo];
        return;
    }
    
    // network 옵션의 indicator 를 확인하여, 인디케이터를 화면에 출력한다.
    if ([networkoption indicator]) {
        NSString* msg = nil;
        if ([NSString isEmpty:[networkoption indicatorMsg]]) {
            msg = @"데이터 송수신 중입니다.\n잠시만 기다려 주세요.";
        }
        else {
            msg = [networkoption indicatorMsg];
        }

        // activityIndicator 시작
        [PPIndicatorUtil simpleActivityIndicatorStart:ctrl.view message:msg];
    }
    
    // NOTICE : Context(transaction 정보(trcode, delegate reference, reponse template등), 타이머등)
    //          를 저장 하는 방법은 서버 상황에 따라 여러가지 방법이 있을수 있다.
    // 1. 주문서버 같이 경우 동기식으로 한번에 한번만 데이터를 전송 받는다는 조건이 있는경우,
    //    Class 변수에 저장해 두고 reponse가 내려오면 그 데이터를 이용하여 reponse를 내려주는 방법.
    // 2. 서버에 echo 필드가 있는경우, uniqe한 키를 생성하여 context pool에 transaction 정보들을 
    //    저장해두고, request echo 필드에 키를 넣어 전송 후 reponse에 키를 추출하여 context를 찾고
    //    해당 정보를 이용하여 reponse를 내려주는 방법.
    // * 여기서는 2번 방법을 이용한다.
    // ############################## Start ##############################
    SocketDataContext* context = [[SocketDataContext alloc] init];
    // context에는 timer 기능이 들어있다.
    context.ctrl            = ctrl;
    context.trcode          = trcode;
    context.data            = reqPacketData;
    context.networkOption   = networkoption;
    context.delegate        = delegate;
    context.contextDelegate = self;
    context.timestamp       = [NSDate date];
    
    // timeout timer start
    [context startTimer:_timeout];

    // Context Pool
    SocketDataContexts* contexts = [SocketDataContexts getInstance];

    // unique key create
    NSNumber* uniqKey = [contexts uniqueKey];

    // context 등록
    [contexts setContext:context forKey:uniqKey];
    // ############################## END ##############################

    // body 데이터를 분석(parse) 하여, byte array로 만든다.
    // DataHandle : 데이터를 담는 warper 기본 제공 class
    DataHandle* trdata_handle = [[DataHandle alloc] init];
    trdata_handle.serverBytesOrder = PPBigEndian; // server bytes order : BigEndian
    trdata_handle.encoding         = -2147481280; // charset : euc-kr
    
    // PPDataSendingHandler : request json string을 DataHandle 에 바인딩 시켜주는 기본 제공 class 
    PPDataSendingHandler* send_handler = [[PPDataSendingHandler alloc] init];
    [send_handler bindWithString:reqPacketData handle:trdata_handle];
    // trdata_handle => 현재 body data를 byte array 형태로 바인딩 된 상태.
    
    // request data를 전송할 내용을 만든다.
    DataHandle* requestData = [[DataHandle alloc] init];
    
    // head setting(trcode, body length, echo 필드(context key) 등 서버와 정의된 대로 셋팅한다.)
    [requestData setString:@"header 정보1" length:12];
    [requestData setByte:0x0f];
    [requestData setString:[uniqKey stringValue] length:10];
    [requestData setString:@"header 정보2" length:3];
    [requestData setString:@"header 정보3" length:1];
    [requestData setString:@"header 정보4" length:2];
    [requestData setString:@"header 정보5" length:1];
    
    // body setting
    [requestData setData:[trdata_handle data]];
    
    // tail setting(tail이 있는경우)
    [requestData setString:@"tail 정보 1" length:1];
    [requestData setString:@"tail 정보 2" length:1];
    
    [_provider writeData:[requestData data]];
}

#pragma mark -
#pragma mark PPSocketProviderDelegate protocol method

/*!
     @brief socket provider에서 접속이 종료 되면 호출되는 method
     @remarks 
       - PPSocketProviderDelegate에 선언되어있는 method로 [필수] 구현 method 이다.
       - provider disconnect / lock object unlock / context pool을 초기화 한다.
       - error 없이 호출되는경우는 사용자(개발자)가 직접 끊은 경우이며, 
     @result void
     @date 2012.07.04
 */
- (void)providerDidDisconnect:(PPGCDSocketProvider *)provider withError:(NSError *)err {
    [_provider disconnect];
    [_lock unlock];

    [[SocketDataContexts getInstance] removeAllContext];
    
    if (err) {
        PPDebug(@"socket disconnect. error : [%@]", err);
    } else {
        PPDebug(@"socket disconnect.");
    }

    // TODO: error 에 대한 메세지를 뿌려 줄것인지 아닌지는 개발자가 판단한다.
    //       이 부분은 전문의 오류가 아니며, 각 전문에대한 오류로 처리하기도 어려운 내용이다.

    PPError(@"서버와 접속이 끊어졌습니다." );
}

/*!
     @brief socket provider가 데이터를 받으면 호출되는
     @remarks 
     - PPSocketProviderDelegate에 선언되어있는 method로 [필수] 구현 method 이다.
     - provider disconnect / lock object unlock / context pool을 초기화 한다.
     @result void
     @date 2012.07.04
*/
- (void)provider:(PPGCDSocketProvider *)provider didReadData:(NSData *)data {

    if (data == nil || [data length] == 0) {
        PPWarn(@"socket received data length 0");
        return;
    } 
    else if (provider.recvBodySize == 0)  {
        PPWarn(@"invalid receive body size");
        return;
    }

    @try {
        // TODO: 데이터 parse 로직 구현
        // ### data parse sample ### start
        DataHandle* response_handle = [[DataHandle alloc] init];
        response_handle.serverBytesOrder = PPBigEndian; // server bytes order : BigEndian
        response_handle.encoding         = -2147481280; // charset : euc-kr
        NSMutableData* _buf = [data mutableCopy];
        [response_handle setData:_buf];
        
        // parse head
        // head 정보는 필요한 부분에 사용한다.
//        NSString* head_info1  = [response_handle getString:12];
//        NSString* head_info2  = [response_handle getString:12];
//        NSString* head_info3  = [response_handle getString:12];
//        NSString* head_info4  = [response_handle getString:12];
//        NSString* head_info5  = [response_handle getString:12];
//        NSString* head_info6  = [response_handle getString:12];
        NSString* body_length = [response_handle getString:5];
        NSString* uniqKey_str = [response_handle getString:10];

        // parse body
        NSMutableData* body_data = [[response_handle getBytes:[body_length intValue]] mutableCopy];
        
        // parse tail
        // tail 정보는 필요한 부분에 사용한다.
//        NSString* tail_info1 = [response_handle getString:1];
//        NSString* tail_info2 = [response_handle getString:1];
        // ### data parse sample ### end
        
        NSNumber* uniqKey = [NSNumber numberWithUnsignedInt:[uniqKey_str intValue]];
        SocketDataContext* context = [[SocketDataContexts getInstance] contextForKey:uniqKey];

        // response를 받아 처리한 context는 삭제한다.
        [[SocketDataContexts getInstance] removeContextForKey:uniqKey];
        
        // TODO: 업무로직 구현
        // call back function 추출
        NSString* cbFunction = @"";
        if ([[context networkOption] isKindOfClass:[PPNetworkOption class]]) {
            cbFunction = [(PPNetworkOption*)[context networkOption] cbfunc];
        }
        
        // request를 보낸 view controller가 아직 네비게이션에 존재하는지 확인
        if ([_naviCtrl existViewController:[context ctrl]]) {
            // 인디케이터 stop
            if([context.ctrl isKindOfClass:[UIViewController class]] && [context.networkOption indicator]) {
                [PPIndicatorUtil simpleActivityIndicatorStop:[context.ctrl view]];
            }
            
            DataHandle* trdata_handle = [[DataHandle alloc] init];
            trdata_handle.serverBytesOrder = PPBigEndian; // server bytes order : BigEndian
            trdata_handle.encoding         = -2147481280; // charset : euc-kr
            [trdata_handle setData:body_data];
            
            // **[중요] response template parse
            // PPDataReceivingHandler 는 body array와 request 할때 webView로 부터 입력받았던
            // response template을 이용하여 webview로 다시 넘겨줄 데이터(json string)를 만든다.
            PPDataReceivingHandler* receive_handler = [[PPDataReceivingHandler alloc] init];
            // response_string => body data를 reponse template format 대로 바인딩된 json string
            NSString* response_string = [receive_handler stringWithObject:trdata_handle 
                                                                 template:[(PPNetworkOption*)[context networkOption] restemplete]];

            [[context delegate] didFinishNetworkManager:self
                                           targetserver:[context.networkOption targetServer]
                                                 trcode:[context trcode]
                                               response:response_string
                                             cbfunction:cbFunction 
                                                  tagId:[[context networkOption] uitag]
                                           jsonUserData:[context networkOption].jsonUserData
                                               userdata:[context userInfo]];
        }
        context = nil;
	}
    // 데이터 파싱중 에러가 발생한경우
	@catch (NSException *exception)
	{
        PPDebug(@"exception of reading data : %@",exception);
		[_provider disconnect];
        [_lock unlock];
        [[SocketDataContexts getInstance] removeAllContext];

        // TODO: error 에 대한 메세지를 뿌려 줄것인지 아닌지는 개발자가 판단한다.
        PPError( @"통신중 에러가 발생하였습니다." );
        
        return;
	}
}

#pragma mark -
#pragma mark SocketDataContext delegate method

/*!
     @brief SocketDataContext가 timeout 되면 호출되는 method
     @remarks 
         - context 저장 방법 2에서 사용한 방법으로 context의 저장 방법이 2번이 아닌경우는 다르게 구현한다.
     @result void
     @date 2012.07.04
 */
- (void) didTimeoutContext:(SocketDataContext *)context {

    if ([[context ctrl] isKindOfClass:[UIViewController class]] && [[context networkOption] indicator]) {
        [PPIndicatorUtil simpleActivityIndicatorStop:[[context ctrl] view]];
    }
    
    // TODO: 타임아웃에 대한 에러 처리는 개발자가 판단하여 처리한다.
    [[context delegate] didFailNetWorkManager:self 
                                 targetserver:[[self class] networkName] 
                                       trcode:[context trcode]
                                        tagId:[context networkOption].uitag
                                 jsonUserData:[context networkOption].jsonUserData
                                    errorcode:@"-1" 
                                     errormsg:@"서버의 응답이 지연되고 있습니다."
                                     userdata:[context userInfo]];
    
    // context 삭제.
    SocketDataContexts* contexts = [SocketDataContexts getInstance];
    NSMutableDictionary* dictionary = [contexts contexts];

    for (id key in dictionary) {
        SocketDataContext* _context = [contexts contextForKey:key];

        if(context == _context) {
            [contexts removeContextForKey:key];
            break;
        }
    }
}

@end
