//
//  MMediaVoiceRecordViewController.h
//

typedef void (^MMediaVoiceRecordCompletionHandler) (NSDictionary *mediaInfo, NSError *error, BOOL cancelled);

@interface MMediaVoiceRecordViewController : PPViewController

@property (copy, nonatomic) MMediaVoiceRecordCompletionHandler completionHandler;
@property (strong, nonatomic) NSString *path;
@property (strong, nonatomic) NSString *fileName;
@property (nonatomic, readwrite) BOOL overwrite;

- (id)initWithNibView;

@end
