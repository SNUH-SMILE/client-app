//
//  NSBundle+Manifest.h
//  MDebug
//
//  Created by ProgDesigner on 2015. 5. 12..
//
//

#import <Foundation/Foundation.h>

@interface NSBundle (Manifest)

- (NSDictionary *)dictionaryWithManifestFile:(NSString *)filePath;

@end
