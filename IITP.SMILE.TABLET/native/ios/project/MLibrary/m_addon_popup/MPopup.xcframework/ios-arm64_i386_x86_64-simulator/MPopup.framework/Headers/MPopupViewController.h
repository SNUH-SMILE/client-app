//
//  MPopupViewController.h
//

#import <Foundation/Foundation.h>

@protocol MPopupViewControllerDelegate;

@interface MPopupViewController : NSObject

@property (strong, nonatomic) NSString *defaultButtonTitle;
@property (strong, nonatomic) NSString *cancelButtonTitle;
@property (nonatomic, readonly) UIView *headerView;
@property (nonatomic, readonly) UIView *contentView;
@property (nonatomic, readonly) UIView *footerView;
@property (nonatomic, readonly) UIView *view;
@property (nonatomic, assign) id<MPopupViewControllerDelegate> target;

- (id)initWithTarget:(id<MPopupViewControllerDelegate>)target;
- (void)showInView:(UIViewController *)viewController;
- (void)close;

@end

@protocol MPopupViewControllerDelegate <NSObject>

- (void)popupViewController:(MPopupViewController *)sender clickedButtonAtIndex:(NSInteger)buttonIndex;

@end