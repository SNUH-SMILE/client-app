//
//  UTEManagerDelegate.h
//  UTESmartBandApi
//
//  Created by VV on 2017/4/24.
//  Copyright © 2017年 vv. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "UTEDefine.h"

@class UTEModelDevices;
@class UTEModelRunData;
@class UTEDeviceSportModeInfo;

#pragma mark - UTEManagerDelegate

/*!
 *  UTEManagerDelegate
 */
@protocol UTEManagerDelegate;

@protocol UTEManagerDelegate <NSObject>

@optional

/**
 *  @discussion It is called once for each device found
 *
 *  @param modelDevices See UTEModelDevices
 */
- (void)uteManagerDiscoverDevices:(UTEModelDevices *)modelDevices;

/**
 *  @discussion Monitor the status of connected devices in real time
 *
 *  @param devicesState See UTEDevicesSate
 *  @param error        See error.code(UTEErrorCode)
 */
- (void)uteManagerDevicesSate:(UTEDevicesSate)devicesState error:(NSError *)error userInfo:(NSDictionary *)info;

/**
 *  @discussion Bluetooth status
 *
 *  @param bluetoothState See UTEBluetoothSate
 */
- (void)uteManagerBluetoothState:(UTEBluetoothState)bluetoothState;

/**
 *  @discussion
 *   Whenever the first information push function is turned on, the system will pop up a dialog box asking for binding (the dialog box has not popped up before)
 *
 *   Note:
 *   1.If the device is bound, the system will not pop up a dialog box, no return value
 *   2.If the device has not been bound, the user clicks the bind button (then the device is bound to the system) and returns YES, indicating that the push message reminder is valid. If NO is returned, it indicates that the information push is invalid, and the device will be actively disconnected, please reconnect. But RK platform device will not be disconnected.
 *   3.If the device is bound, there will be an information symbol ⓘ on the right side of the device in the system Bluetooth.
 *   4.If you want to unbind the device, it is recommended to remind the user to manually go to the system Bluetooth and click the 'Ignore Device' button, otherwise the device may not be found during the next scan (because it may be connected to the system Bluetooth)
 *
 *  @param isAble Information push function works
 *
 */
- (void)uteManagerExtraIsAble:(BOOL)isAble;

/**
 *  @discussion Monitor the device (steps) change in real time, it will be called frequently
 *  Note:When isHasWalkRun=YES,this method is not called, please use uteManagerReceiveTodaySport.
 *
 *  @param runData See UTEModelRunData
 */
- (void)uteManagerReceiveTodaySteps:(UTEModelRunData *)runData;

/**
 *  @discussion Monitor the device (steps) of the device in real time. It will be called frequently
 *  Required:isHasWalkRun=YES.
 *
 *  @param dict key:kUTEQuerySportWalkRunData value:UTEModelSportWalkRun
 */
- (void)uteManagerReceiveTodaySport:(NSDictionary *)dict;

/**
 *  @discussion Monitor Device UTEDeviceSportMode status
 *  Required:isHasSportHRM=YES OR isHasSportPause=YES.
 *
 */
- (void)uteManagerReceiveSportMode:(UTEDeviceSportModeInfo *)info;

/**
 *  @discussion It monitors the change of the device's sport data in real time, and it will be called frequently.
 *  Required:isHasSportHRM=Yes OR isHasHeadsetHRM=Yes .
 *
 *  @param dict key:kUTEQuerySportHRMData        value:UTEModelSportHRMData
 *         dict key:kUTEQuerySportHeadsetData    value:UTEModelSportHeadsetData
 */
- (void)uteManagerReceiveSportHRM:(NSDictionary *)dict;

/**
*  @discussion Device automatically returns heart rate data
*  Required:isHasHRMValueMaxMin=Yes .
*
*/
- (void)uteManagerReceiveHRMMaxValue:(NSInteger)max minValue:(NSInteger)min averageValue:(NSInteger)average;

/**
 *  @discussion Progress of syncing data.
 *  @param process 0 to 100
 */
- (void)uteManagerSyncProcess:(NSInteger)process;

/**
 *  @discussion Progress of firmware upgrade.
 *
 *  @param process 0 to 100
 */
- (void)uteManagerUpdateProcess:(NSInteger)process;

/**
 *  @discussion When the device UTEOptionOpenCameraMode enters the camera mode, it will be called back every 3 shakes.
 *   Note:You must call UTEOptionCloseCameraMode to exit the camera mode, otherwise the device may not record the number of steps.(If the device is disconnected, it will automatically exit the camera mode.)
 */
- (void)uteManagerTakePicture;

/**
 *  @discussion After querying by calling UTEOptionReadDisplaySize(setUTEOption:), this method callback.
 *
 *  @param width   Device screen resolution.
 *  @param height  Device screen resolution.
 *  @param count   Replaceable quantity.
 */
- (void)uteManagerDisplaySizeWidth:(NSInteger)width height:(NSInteger)height count:(NSInteger)count;

/**
 *  @discussion Read ibeacon information through method readUTEIbeacon, this method callback.
 */
- (void)uteManagerUTEIbeaconOption:(UTEIbeaconOption)option value:(NSString *)value;

/**
 *  @discussion The SDK sends a command to the device. If the device receives value, this method will have callback.
 */
- (void)uteManageUTEOptionCallBack:(UTECallBack)callback;

/**
 *  @discussion Device key events (or touch feedback)
 *
 *  @param data Received device return value
 *  e.g. 'data' is <D10A>, Indicates that the device has been clicked (or touched) (find phone function)
 */
- (void)uteManageTouchDeviceReceiveData:(NSData *)data;

/**
 *  @discussion See sendUTECustomData
 *
 *  @param result  Data transmitted successfully (no lost data)
 */
- (void)uteManagerSendCustomDataResult:(BOOL)result;

/**
 *  @discussion Device returns custom data
 *
 *  @param data    Data returned by the device
 *  @param result  Data transmitted successfully (no lost data)
 */
- (void)uteManagerReceiveCustomData:(NSData *)data result:(BOOL)result;

/**
 *  @discussion     Sport status of Headset.
 *
 *  @param mode     See UTEDeviceSportMode
 *  @param open     Whether it is in sport model.
 *
 *  Note:If the state is open=NO, it means that the sport is stopped, and the mode is UTEDeviceSportModeNone.
 *
 *  @param support  Device support this sport type
 */
- (void)uteManagerHeadsetSport:(UTEDeviceSportMode)mode open:(BOOL)open suppport:(BOOL)support;

/**
 *  @discussion What shortcut buttons the device supports.
 *
 *  Note:Please use "bitwise AND" for value
 */
- (void)uteManagerShortcutBtnSupport:(UTEDeviceShortcutBtnType)type;

/**
 *  @discussion     Status of device shortcut buttons.
 *
 *  @param openType     Which button states are on.
 *  @param closeType    Which button states are off.
 *
 *  Note:Please use "bitwise AND" for value

 */
- (void)uteManagerShortcutBtnStatus:(UTEDeviceShortcutBtnType)openType closeType:(UTEDeviceShortcutBtnType)closeType;

/**
 *  @discussion Heart rate data returned every ten minutes
 *
 *  @param dict key:kUTEQuery24HRMData value:UTEModelHRMData
 */
- (void)uteManagerReceiveTenMinLaterHRM:(NSDictionary *)dict;

/**
 *  @discussion Device debugging information.
 */
- (void)uteManagerReceiveDebugInfo:(NSDictionary *)dict;

/**
 *  @discussion System Bluetooth notification permissions (share system notification permission status, not pairing status bound by the device).
 */
- (void)uteManagerANCSAuthorization:(BOOL)ancsAuthorized NS_AVAILABLE_IOS(13_0);

/**
 *  @discussion Device user id status
 */
- (void)uteManagerUserIDStatus:(UTEUserIDStatus)status;


- (void)uteManagerFactoryTestButtonCallback:(NSInteger)totalButton currentBtnIndex:(NSInteger)index;
- (void)uteManagerFactoryTestTpCallback:(NSInteger)position;
- (void)uteManagerFactoryTestRGBCallback:(BOOL)open;
- (void)uteManagerFactoryTestLogData:(NSData *)data strData:(NSString *)strData tag:(NSInteger)tag;

@end
