//
//  MPCommonEnum.h
//  Library
//
//  Created by Uracle Lab on 12. 5. 8..
//  Copyright (c) 2012년 lab@uracle.co.kr. All rights reserved.
//

#import <Foundation/Foundation.h>

typedef enum PPSupportOrientation {
    PPSupportOrientationDefault,
    PPSupportOrientationPortrait,
    PPSupportOrientationLandscape,
    PPSupportOrientationReversiblePortrait,
    PPSupportOrientationReversibleLandscape,
    PPSupportOrientationAll
} PPSupportOrientation;

typedef enum PPMasterOrientation {
    PPMasterOrientationCustom,
    PPMasterOrientationAll,
    PPMasterOrientationPortrait,
    PPMasterOrientationLandscape,
    PPMasterOrientationReversiblePortrait,
    PPMasterOrientationReversibleLandscape
} PPMasterOrientation;

typedef enum PPActionType {
    PPActionNewScreen,
    PPActionNoHistory,
    PPActionClearTop,
    PPActionGotoTop,
    
    PPActionExtTabNewScreen = 0x0100,
    PPActionExtTabMoveTopScreen,
    PPActionExtTabBackScreen,
} PPActionType;

typedef enum PPAnimationType {
    PPAnimationDefault,
    PPAnimationSlideLeft,
    PPAnimationSlideRight,
    PPAnimationSlideTop,
    PPAnimationSlideBottom,
    PPAnimationNone,
    PPAnimationZoomIn,
    PPAnimationZoomOut,
    PPAnimationFade,
    PPAnimationFlipLeft,
    PPAnimationFlipRight,
    PPAnimationCurlUp,
    PPAnimationCurlDown,
    PPAnimationModalUp,
    PPAnimationModalDown,
    PPAnimationModalLeft,
    PPAnimationModalRight
} PPAnimationType;

#define NSStringFromPPMasterOrientation(orientation)    [NSString stringFromPPMasterOrientation:orientation]
#define NSStringFromPPSupportOrientation(orientation)   [NSString stringFromPPSupportOrientation:orientation]
#define NSStringFromPPAnimationType(animation)          [NSString stringFromPPAnimationType:animation]
#define NSStringFromPPActionType(action)                [NSString stringFromPPActionType:action]

@interface NSString(PPViewControllerEnum)

+ (NSString *)stringFromPPMasterOrientation:(PPMasterOrientation)orientation;

+ (NSString *)stringFromPPSupportOrientation:(PPSupportOrientation)orientation;

+ (NSString *)stringFromPPAnimationType:(PPAnimationType)animation;

+ (NSString *)stringFromPPActionType:(PPActionType)action;

- (PPSupportOrientation) PPSupportOrientationFromString;

- (PPActionType) PPActionTypeFromString;

- (PPAnimationType) PPAnimationTypeFromString;

@end
