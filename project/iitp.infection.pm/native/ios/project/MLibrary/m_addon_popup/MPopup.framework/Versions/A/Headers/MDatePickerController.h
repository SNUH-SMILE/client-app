//
//  MDatePickerController.h
//  MPopup.Framework
//
//  Created by UracleLab on 2014. 9. 19..
//
//

#import <Foundation/Foundation.h>
#import "MPopupViewController.h"

typedef enum {
    MDate_HHMM12,
    MDate_YMD,
    MDate_YMDHM,

    MDate_HHMM12L,  /* 언어 설정 가능 */
    MDate_YMDL,     /* 언어 설정 가능 */
    MDate_YMDHML,   /* 언어 설정 가능 */

    MDate_HHMM24,
    MDate_MM,       /* 1 ~ 12 */
    MDate_DD,       /* 1 ~ 31 */
    MDate_YM,
    MDate_MMYYYY,
    MDate_YYYY,
} MDatePickerType;

@interface NSString(DatePicker_EnumParser)

- (MDatePickerType)datePickerTypeFromString;

@end

typedef void (^MDatePickerControllerCompletionHandler) (NSDictionary *dateInfo, NSError *error, BOOL cancelled);

@interface MDatePickerController : NSObject

@property (readonly) NSDate* date;
@property (strong, nonatomic) NSString *defaultButtonTitle;
@property (strong, nonatomic) NSString *cancelButtonTitle;
@property (readonly) MDatePickerType datePickerType;
@property (nonatomic, assign) NSInteger minuteInterval;
@property (nonatomic, retain) NSString* lowerLimit;
@property (nonatomic, retain) NSString* upperLimit;
@property (strong, nonatomic) NSArray *suffixNames;
@property (strong, nonatomic) NSArray *weekNames;
@property (nonatomic, copy) MDatePickerControllerCompletionHandler completionHandler;

- (id)initWithDatePickerType:(MDatePickerType)datePickerType initDate:(NSString *)initDate;
- (void)showInViewController:(UIViewController *)viewController;

@end

@interface NSDate (MDatePickerController)

+ (NSDate *)dateFromString:(NSString *)dateString withDatePickerType:(MDatePickerType)datePickerType;
+ (NSString *)formatWithDatePickerType:(MDatePickerType)datePickerType;

- (int)weekDay;
- (NSString *)nameOfWeekDay;

@end

@interface NSString(MDatePickerController)

- (MDatePickerType)datePickerTypeFromString;

@end