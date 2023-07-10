//
//  MMediaPickerController.h
//  MDebug
//
//  Created by ProgDesigner on 2015. 5. 19..
//
//

#import <Foundation/Foundation.h>

typedef void (^MMediaPickerControllerDidFinishSelectBlock) (NSArray *list, NSError *error, BOOL cancelled);
typedef void (^MMediaPickerControllerDidFinishLoadBlock) (NSArray *list, NSError *error);

typedef enum {
    MMediaSelectModeUnset = 0,
    MMediaSingleSelectMode = 1,
    MMediaMultiSelectMode = 2
} MMediaSelectMode;

typedef enum {
    MMediaSourceTypeUnset = 0,
    MMediaSourceTypeAssets = 1,
    MMediaSourceTypeResources = 2
} MMediaSourceType;

extern NSString *const MMediaTypePhoto;
extern NSString *const MMediaTypeVideo;
extern NSString *const MMediaTypeAudio;
extern NSString *const MMediaTypeAll;

@interface MMediaPickerController : NSObject
{
    UITableViewController *_picker;
}

@property (strong, nonatomic) NSString *path;
@property (strong, nonatomic) NSString *mediaType;
@property (nonatomic, readwrite) NSInteger maxCount;
@property (nonatomic, readwrite) NSInteger numberOfColumns;
@property (nonatomic, readwrite) BOOL useDetail;
@property (nonatomic, readwrite) BOOL useZoom;
@property (nonatomic, readwrite) BOOL showEnc;
@property (nonatomic, readwrite) MMediaSelectMode selectMode;
@property (nonatomic, readwrite) MMediaSourceType sourceType;
@property (strong, nonatomic) NSString *title;
@property (strong, nonatomic) NSString *leftBtn;
@property (strong, nonatomic) NSString *rightBtn;
@property (strong, nonatomic) NSString *mediaPickerName;
@property (strong, nonatomic) NSString *assetPickerName;

@property (nonatomic, copy) MMediaPickerControllerDidFinishSelectBlock selectBlock;
@property (nonatomic, copy) MMediaPickerControllerDidFinishLoadBlock loadBlock;

- (NSDictionary *)infoWithPath:(NSString *)path;

- (void)loadItems;

- (void)presentPickerInViewController:(UIViewController *)viewController; // Deprecated since 2.1.5.1
- (void)presentControllerInViewController:(UIViewController *)viewController;

- (void)didFinishSelectItems:(NSArray *)items;
- (void)didFinishLoadItems:(NSArray *)items;
- (void)dismissPicker;
- (void)didCancel;
- (void)didDenied;

@end

@interface AssetPicker : UITableViewController {
}

@property (strong, nonatomic) NSMutableArray *assets;
@property (strong, nonatomic) NSString *titleText;
@property (strong, nonatomic) NSString *leftBtn;
@property (strong, nonatomic) NSString *rightBtn;

- (id)initWithDelegate:(id)delegate;

@end

@interface MediaPicker : UITableViewController {
}

@property (strong, nonatomic) NSString *titleText;
@property (strong, nonatomic) NSString *rightBtn;
@property (strong, nonatomic) NSString *leftBtn;

- (id)initWithDelegate:(id)delegate;

@end

