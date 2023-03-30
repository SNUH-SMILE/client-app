//
//  PHImageManager+MMedia.h
//  MDebug
//
//  Created by ProgDesigner on 2015. 5. 20..
//
//

#import <Photos/Photos.h>

@interface PHImageManager (MMedia)

-(UIImage *)fetchFullResolutionImageWithLocalIdentifier:(NSString *)localIdentifier;
-(NSData *)fetchDataWithLocalIdentifier:(NSString *)localIdentifier;

@end
