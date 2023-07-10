//
//  ALAssetsLibrary+MMedia.h
//  MDebug
//
//  Created by ProgDesigner on 2015. 5. 20..
//
//

#import <AssetsLibrary/AssetsLibrary.h>

@interface ALAssetsLibrary (MMedia)

- (void)assetByURL:(NSURL *)assetURL resultBlock:(ALAssetsLibraryAssetForURLResultBlock)resultBlock waitUntilDone:(BOOL)waitUntilDone;

@end
