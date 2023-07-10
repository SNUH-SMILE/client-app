//
//  MMediaAVPlayerViewController.h
//  MDebug
//
//  Created by Dantexx on 2019. 5. 29..
//
//

typedef void (^MMediaAVPlayerViewControllerDoneHandler) ();

@interface MMediaAVPlayerViewController : PPViewController

@property (nonatomic, readonly) NSURL* contentURL;
@property (copy, nonatomic) MMediaAVPlayerViewControllerDoneHandler doneHandler;

@property (nonatomic, strong) IBOutlet UIButton *btnDone;

- (id)initWithPath:(NSString *)path;

@end
