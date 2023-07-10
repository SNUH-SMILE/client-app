//
//  MMediaPlayerViewController.h
//  MDebug
//
//  Created by ProgDesigner on 2015. 2. 9..
//
//

typedef void (^MMediaPlayerViewControllerDoneHandler) ();

@interface MMediaPlayerViewController : PPViewController

@property (nonatomic, readonly) NSURL* contentURL;
@property (copy, nonatomic) MMediaPlayerViewControllerDoneHandler doneHandler;

- (id)initWithPath:(NSString *)path;

@end
