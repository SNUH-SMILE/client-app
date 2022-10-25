//
//  RTKOTAError.h
//  RTKLEFoundation
//
//  Created by jerome_gu on 2019/1/30.
//  Copyright © 2019 Realtek. All rights reserved.
//

#ifndef RTKOTAError_h
#define RTKOTAError_h

#import <Foundation/Foundation.h>

extern NSErrorDomain const RTKOTAErrorDomain;

/* RTKOTAErrorDomain Error code */
typedef NS_ENUM(NSInteger, RTKOTAErrorCode) {
    RTKOTAErrorUnknown,
    
    RTKOTAErrorCommunicationNotOpen,                         // operation cannot be executed because of communication not opened.
    
    RTKOTAErrorScaningBusy,                                 // there is a pending scan task, you may retry later.
    RTKOTAErrorScanForPeripheralTimeout,                    // cannot discover a specific peripheral within a specific duration.
    
    RTKOTAErrorServiceNotDetermined,                        // service(and containing characterisitc) is not discovered or not installed.
    
    RTKOTAErrorOTAInfoReadTimeOut,                          // read OTA device information time out.
    
    RTKOTAErrorOTAServiceInconsistency,                     // the info readed from peripheral is inconsisitent, OTA upgrade can't be started.
    
    RTKOTAErrorOTAModePeripheralScanning,                   // Scan for peripheral in OTA mode fail.
    RTKOTAErrorPeripheralReconnection,                      // reconnect to peripheral failed while upgrade silently.
    
    RTKOTAErrorUserCancelled,                               // user(app) cancel upgrade.
    
    RTKOTAErrorDFUImageMismatch,                            // the image to upgrade is not match with SOC
    
    RTKOTAErrorDFUGetImageInfo,                             // get target image info failed.
    RTKOTAErrorDFUStartDFU,                                 // send start DFU message failed.
    RTKOTAErrorDFURequestReceiveFailure,                    // request peripheral to receive image failed.
    RTKOTAErrorDFUImageSendFailure,                         // send image data failed.
    RTKOTAErrorDFUBufferCheckFailure,                       // Buffer check failed.
    RTKOTAErrorDFUValidate,                                 // image validate failed.
    RTKOTAErrorDFUActive,                                 // image active failed.
    RTKOTAErrorDFUReset,                                 // image reset failed.
    RTKOTAErrorDFUCopyImage,                                // copy image failed. (used in dual bank)
    RTKOTAErrorDFUImageExistState,                          // get image exist state failed.
    RTKOTAErrorDFUDisconnectionWait,                        // wait for LE disconnection failed during upgrade.
    
    RTKOTAErrorBinFileNotExist,                             // The file does not exist which path identity.
    RTKOTAErrorBinFileFormatInvalid,                        // The passed in bin file format is invalid.
    
    
    RTKOTAErrorDFUCommunication,
    
    RTKOTAErrorPrepareFailed,
    
    RTKOTAErrorDFUConnParameterUpdateFailure,               // Connection Parameter Update Failed
    
};

#endif /* RTKOTAError_h */
