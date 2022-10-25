//
//  ExtendWNInterface.h
//

#import <UIKit/UIKit.h>
#import "PPHybridViewController.h"
#import "UTESmartBandManager.h"

@interface ExtendWNInterface : NSObject<WNInterface>

@property (nonatomic, readonly) PPWebViewController *viewController;
@property (nonatomic, assign) PPWebViewController *viewctrl;

//
@property (nonatomic, retain) UTESmartBandManager *sbm;

@end
