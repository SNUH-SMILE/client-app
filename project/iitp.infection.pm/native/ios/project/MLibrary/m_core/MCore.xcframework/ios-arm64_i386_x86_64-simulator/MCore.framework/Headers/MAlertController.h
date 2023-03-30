//
//  MAlertController.h
//

#import <Foundation/Foundation.h>

typedef void (^MAlertActionHandler)(NSInteger actionIndex);
typedef void (^MAlertTextFieldHandler)(UITextField *textField);

typedef NS_ENUM(NSInteger, MAlertActionStyle) {
    MAlertActionStyleDefault = 0,
    MAlertActionStyleImportant = 1,
    MAlertActionStyleCancel
};

typedef NS_ENUM(NSInteger, MAlertControllerStyle) {
    MAlertControllerStyleActionSheet = 0,
    MAlertControllerStyleAlert
};

@class MAlertController;

@protocol MAlertControllerDelegate <NSObject>

@optional

- (void)alertController:(MAlertController *)alertController clickedButtonAtIndex:(NSInteger)buttonIndex;

@end

@interface MAlertController : NSObject

@property (nonatomic, strong) NSString *title;
@property (nonatomic, strong) NSString *message;
@property (nonatomic, strong) NSArray *actionHandlers;
@property (nonatomic, assign) id <MAlertControllerDelegate> delegate;
@property (nonatomic, readonly) MAlertControllerStyle controllerStyle;
@property (nonatomic) BOOL waitUntilDone;

- (id)initWithTitle:(NSString *)title preferredStyle:(MAlertControllerStyle)controllerStyle;
- (id)initWithTitle:(NSString *)title message:(NSString *)message delegate:(id /*<MAlertControllerDelegate>*/)delegate cancelButtonTitle:(NSString *)cancelButtonTitle otherButtonTitles:(NSString *)otherButtonTitles, ... NS_REQUIRES_NIL_TERMINATION;

- (void)addActionWithButtonTitle:(NSString *)title style:(MAlertActionStyle)style handler:(MAlertActionHandler)handler;
- (void)addTextFieldWithConfigurationHandler:(MAlertTextFieldHandler)handler;
- (UITextField *)textFieldAtIndex:(NSInteger)textFieldIndex;

- (void)showInRootViewController;
- (void)showInViewController:(UIViewController *)viewController;

@end
