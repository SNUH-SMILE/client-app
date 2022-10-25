//
//  MAlertView
//

#import <UIKit/UIKit.h>

@class MAlertView;

typedef void (^__nullable MAlertViewCompletionBlock) (MAlertView * __nonnull alertView, NSInteger buttonIndex);
typedef void (^__nullable MAlertViewTextFieldHandler)(UITextField *__nonnull textField);

@interface MAlertView : UIAlertView

@property (copy, nonatomic) MAlertViewCompletionBlock tapBlock;

@end
