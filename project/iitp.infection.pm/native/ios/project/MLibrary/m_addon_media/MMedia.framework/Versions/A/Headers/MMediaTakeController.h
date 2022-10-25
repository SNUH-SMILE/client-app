//
//  MMediaTakeController.h
//

#import <Foundation/Foundation.h>

typedef void (^MMediaTakeControllerCompletionHandler) (NSDictionary *mediaInfo, NSError *error, BOOL cancelled);

typedef enum {
    MMediaCameraMediaTypePhoto = 1,
    MMediaCameraMediaTypeVideo = 2
} MMediaCameraMediaType;

typedef enum {
    MMediaCameraDirectionBackward = 1,
    MMediaCameraDirectionForward = 2
} MMediaCameraDirection;

@interface MMediaTakeController : NSObject

@property (nonatomic) MMediaCameraMediaType mediaType;
@property (nonatomic) MMediaCameraDirection direction;
@property (strong, nonatomic) NSString *path;
@property (strong, nonatomic) NSString *fileName;
@property (nonatomic, readwrite) BOOL overwrite;
@property (nonatomic, readwrite) BOOL allowEdit;
@property (nonatomic, readwrite) BOOL saveAlbum;
@property (nonatomic, readonly) UIImagePickerController *picker;
@property (copy, nonatomic) MMediaTakeControllerCompletionHandler completionHandler;

+ (MMediaTakeController *)currentController;

- (void)presentTakerInViewController:(UIViewController *)viewController;

@end
