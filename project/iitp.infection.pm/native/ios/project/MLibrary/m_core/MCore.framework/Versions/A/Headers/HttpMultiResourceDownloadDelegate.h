//
//  HttpMultiResourceDownloadDelegate.h
//  Library
//
//  Created by 영철 정 on 12. 7. 16..
//  Copyright (c) 2012년 __MyCompanyName__. All rights reserved.
//

#import <Foundation/Foundation.h>

typedef enum __HTTP_RESOURCE_DN_STATUS
{
    HTTP_RESOURCE_DN_NONE     = 0,
    HTTP_RESOURCE_DN_REQ      = 1,
    HTTP_RESOURCE_DN_START    = 2,
    HTTP_RESOURCE_DN_LOADING  = 3,
    HTTP_RESOURCE_DN_OK       = 4,
    HTTP_RESOURCE_DN_KO       = 5
} HTTP_RESOURCE_DN_STATUS;


@protocol HttpMultiResourceDownloadDelegate <NSObject>
@required

- (void) didFinishHttpResourceDownload:(id)progressDelegate
                                  body:(NSData*)body;

- (void) didFailHttpResourceDownload:(id)progressDelegate
                            errormsg:(NSString *)errormsg;

@optional
- (void) downloadingHttpResourceDownload:(id)progressDelegate 
                               totalsize:(NSNumber *)totalsize
                                 cursize:(NSNumber *)cursize;

@end