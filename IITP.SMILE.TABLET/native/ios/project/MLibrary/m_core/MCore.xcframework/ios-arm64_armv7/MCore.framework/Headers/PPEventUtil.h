//
//  PPEventUtil.h
//
//  Created by Uracle Lab on 11. 3. 17..
//  Copyright 2011 . All rights reserved.
//

#import <Foundation/Foundation.h>


@interface PPEventUtil : NSObject {
    
}
/*!
    @brief Touch Event를 무시한다.
    @remarks
    Touch Event를 막는 함수\n
    PPEventUtil endIngnoringEvent 함수를 다시 호출 하지 않으면 이벤트를 계속 무시한다.
    - usage:
    @code
    [PPEventUtil beginIgnoringEvent];
    @endcode
    @author eungwan@asgkorea.co.kr
    @date 2011.05.06 13:41
 */
+ (void) beginIgnoringEvent;

/*!
    @brief Touch Event가 무시되고 있는 상태를 해제한다.
    @remarks
    Touch Event가 무시되고 있는 상태를 해제한다.
    - usage:
    @code
    [PPEventUtil endIgnoringEvent];
    @endcode
    @author eungwan@asgkorea.co.kr
    @date 2011.05.06 13:44
 */
+ (void) endIgnoringEvent;

@end
