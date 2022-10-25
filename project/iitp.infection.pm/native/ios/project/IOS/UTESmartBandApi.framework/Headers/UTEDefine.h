//
//  UTEDefine.h
//  UTESmartBandApi
//
//  Created by VV on 2017/4/22.
//  Copyright © 2017年 vv. All rights reserved.
//
//  Enumerations and key values

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface UTEDefine : NSObject
/*!
 *  Step
 *
 *  @discussion NSDictionary value:NSArray.
 *              Data synchronization completed.
 */
extern NSString *const kUTEQueryRunData;
/*!
 *  Sleep
 *
 *  @discussion NSDictionary value:NSArray.
 *              Data synchronization completed. All sleep is collected in an array.
 */
extern NSString *const kUTEQuerySleepData;
/*!
 *  Sleep
 *
 *  @discussion NSDictionary value:NSArray.
 *              Data synchronization completed. Sorted out separate sleep data day by day.
 */
extern NSString *const kUTEQuerySleepDataDayByDay;
/*!
 *  Nap
 *
 *  @discussion NSDictionary value:NSArray.
 *              Data synchronization completed.
 */
extern NSString *const kUTEQuerySiestaData;
/*!
 *  Heart Rate
 *
 *  @discussion NSDictionary value:NSArray.
 *              Data synchronization completed OR Test heart rate completed.
 */
extern NSString *const kUTEQueryHRMData;
/*!
 *  24-Hour Heart Rate
 *
 *  @discussion NSDictionary value:NSArray.
 *              Synchronized 24-hour heart rate data completed.
 *              Required isHas24HourHRM = YES.
 */
extern NSString *const kUTEQuery24HRMData;
/*!
 *  Blood Pressure
 *
 *  @discussion NSDictionary value:NSArray.
 *              Data synchronization completed OR Test blood pressure completed.
 */
extern NSString *const kUTEQueryBloodData;
/*!
 *  Blood Oxygen
 *
 *  @discussion NSDictionary value:NSArray.
 *              Data synchronization completed OR Test blood oxygen.
 */
extern NSString *const kUTEQueryBloodOxygenData;
/*!
 *  Device password status
 *
 *  @discussion NSDictionary value:NSString (Converted to NSInteger, corresponding to UTEPasswordState).
 */
extern NSString *const kUTEPasswordState;
/*!
 *  Walking and running
 *
 *  @discussion NSDictionary value:UTEModelSportWalkRun.
 *              Required parameter isHasWalkRun = YES.
 */
extern NSString *const kUTEQuerySportWalkRunData;
/*!
 *  Bicycle
 *
 *  @discussion NSDictionary value:UTEModelDeviceBicycle.
 *              Required parameter isHasBicycle = YES.
 */
extern NSString *const kUTEQuerySportBicycleData;
/*!
 *  Swim
 *
 *  @discussion NSDictionary value:UTEModelSportSwim.
 *              Required parameter isHasSwim = YES.
 */
extern NSString *const kUTEQuerySportSwimData;
/*!
 *  Rope Skipping
 *
 *  @discussion NSDictionary value:UTEModelSportSkip.
 *              Required parameter isHasSkip = YES.
 */
extern NSString *const kUTEQuerySportSkipData;
/*!
 *  TableTennis
 *
 *  @discussion NSDictionary value:UTEModelDeviceTableTennis.
 *              Required parameter isHasTableTennis = YES.
 */
extern NSString *const kUTEQuerySportTableTennisData;
/*!
 *  Badminton
 *
 *  @discussion NSDictionary value:UTEModelDeviceBadminton.
 *              Required parameter isHasBadminton = YES.
 */
extern NSString *const kUTEQuerySportBadmindonData;
/*!
 *  Tennis
 *
 *  @discussion NSDictionary value:UTEModelDeviceTableTennis.
 *              Required parameter isHasTennis = YES.
 */
extern NSString *const kUTEQuerySportTennisData;
/*!
 *  UV
 *
 *  @discussion NSDictionary value:NSNumber.
 */
extern NSString *const kUTEQueryUVData;
/*!
 *  GPS
 *
 *  @discussion NSDictionary value:NSArray.
 *              Data synchronization completed.
 */
extern NSString *const kUTEQueryGPSData;
/*!
 *  New firmware version available
 *
 *  @discussion NSDictionary value:NSNumber(numberWithBool).
 *              if NSNumber is YES,Indicates that the device must be upgraded.Because the device has a serious bug.
 */
extern NSString *const kUTEForceUpdateFirmware;
/*!
 *  New firmware information
 *
 *  @discussion NSDictionary value:UTEModelFirmwareInfo.
 */
extern NSString *const kUTEUpdateFirmwareInfo;
/*!
 *  Barometric pressure
 *
 *  @discussion NSDictionary value:NSArray.
 */
extern NSString *const kUTEQueryBarometricData;
/*!
 *  BodyFat
 *
 *  @discussion NSDictionary value:NSArray.
 */
extern NSString *const kUTEQueryBodyFatData;
/*!
 *  ECG
 *
 *  @discussion value:NSArray During the test.
 *              value:UTEModelDeviceECG  During the test have Heart rate value.
 *              value:UTEModelDeviceECG  Test completed.
 *
 *              value:@[model,model,model...]  synchronization completed.
 *              And the last model is the analysis result, if last model.valid=NO, Please don't save data.
 *              
 */
extern NSString *const kUTEQueryECGData;
/*!
 *  Exercise with heart rate recording
 *
 *  @discussion NSDictionary value:UTEModelSportHRMData.
 *              Required parameter isHasSportHRM = YES.
 */
extern NSString *const kUTEQuerySportHRMData;
/*!
 *  Headset
 *
 *  @discussion NSDictionary value:UTEModelSportHeadsetData.
 *              Required parameter isHasHeadsetHRM = YES.
 */
extern NSString *const kUTEQuerySportHeadsetData;
/*!
 *  Headset click event
 *
 *  @discussion NSDictionary value:UTEModelSportHeadsetData.
 *              Required parameter isHasHeadsetHRM = YES.
 */
extern NSString *const kUTEQuerySportHeadsetDataOnClick;
/*!
 *  Body Temperature
 *
 *  @discussion NSDictionary value:NSArray
 *              Required parameter isHasBodyTemperature = YES.
 */
extern NSString *const kUTEQueryBodyTemperature;
/*!
 *  Respiration Rate
 *
 *  @discussion NSDictionary value:NSArray.
 *              Data synchronization completed OR Test respiration.
 */
extern NSString *const kUTEQueryRespirationData;


/*!
 *  @enum UTEOption
 *
 *  @discussion Set device information
 *
 *  @constant UTEOptionSyncAllStepsData      If isHasDataStatus=YES ,please invoke syncDataCustomTime:type:
 *  @constant UTEOptionSyncAllSleepData      If isHasDataStatus=YES ,please invoke syncDataCustomTime:type:
 *  @constant UTEOptionSyncAllHRMData        If isHasDataStatus=YES ,please invoke syncDataCustomTime:type:
 *  @constant UTEOptionSyncAllBloodData      If isHasDataStatus=YES ,please invoke syncDataCustomTime:type:
 *  @constant UTEOptionSyncAllBloodOxygenData  Unspport syncDataCustomTime:type:
 *  @constant UTEOptionSyncAllRespirationData  Unspport syncDataCustomTime:type:
 *  @constant UTEOptionSyncGPSData           If isHasDataStatus=YES ,please invoke syncDataCustomTime:type:
 
 *  @constant UTEOptionSyncBicycleData       If isHasDataStatus=YES ,please invoke syncDataCustomTime:type:
 *                                           If isHasSportHRM=YES ,please invoke syncUTESportModelCustomTime:
 
 *  @constant UTEOptionSyncBarometricData
 *  @constant UTEOptionSyncBodyFat           If isHasDataStatus=YES ,please invoke syncDataCustomTime:type:
 *  @constant UTEOptionSyncECG               The device saves only one offline test data
 *
 *  @constant UTEOptionIncall                Incoming call command: When the mobile phone calls, when this value is called,the device will vibrate 10 times, once every 1 second.If isHasSocialNotification = Yes OR isHasSocialNotification2 = Yes , please invoke setUTERemindApp: ,do not use setUTEOption:
 *
 *  @constant UTEOptionDeleteGPSData         Delete GPS data saved by the device.
 *                                           It is recommended to invoke this value after the GPS data is synchronized.Otherwise, too much GPS data will cause the device's GPS data to synchronize slowly.
 *
 *  @constant UTEOptionHangup                Hang up the phone OR Connect the call: invoke this value, the device will immediately stop shaking
 *  @constant UTEOptionFindBand              Find device: device shakes 2 times, 1 time per second
 *  @constant UTEOptionSyncTime              Keep the phone time the same as device time
 *  @constant UTEOptionReadDevicesBattery    
 
 *  @constant UTEOptionHeartDetectingStart
 *  @constant UTEOptionHeartDetectingStop
 *  @constant UTEOptionHeartSwitchDynamic    Heart rate dynamic mode.When testing heart rate, the device does not stop testing automatically
 *  @constant UTEOptionHeartSwitchStatic     Heart rate static mode.When testing heart rate,the device automatically stops when it detects a heart rate value
 
 *  @constant UTEOptionOpen24HourHRM         Turn on device heart rate test(Test every 10 minutes). Required isHas24HourHRM = YES
 *  @constant UTEOptionClose24HourHRM        Turn off device heart rate test. Required isHas24HourHRM = YES
 
 *  @constant UTEOptionUnitInch              Units are imperial and pound(lbs)  (Compatible with older devices,no longer used)
 *  @constant UTEOptionUnitMeter             Units are metric and kilogram     (Compatible with older devices,no longer used)
 *  @constant UTEOptionUnitInch_12           Units are imperial and pound(lbs)、12-hour time(AM,PM)
 *  @constant UTEOptionUnitInch_24           Units are imperial and pound(lbs)、24-hour time
 *  @constant UTEOptionUnitMeter_12          Units are metric and kilogram 、12-hour time(AM,PM)
 *  @constant UTEOptionUnitMeter_24          Units are metric and kilogram 、24-hour time
 
 
 
 *  If isHasSocialNotification = Yes OR isHasSocialNotification2 = Yes OR isHasIconANCS = Yes
 *  please invoke setUTERemindApp: ,do not use setUTEOption:
 *
 *  @constant UTEOptionOpenRemindIncall      Required isHasExtra = YES （if isRKDevices = YES,no need to consider parameter 'isHasExtra'）
 *  @constant UTEOptionOpenRemindQQ          Required isHasExtra = YES （if isRKDevices = YES,no need to consider parameter 'isHasExtra'）
 *  @constant UTEOptionOpenRemindWeixin      Required isHasExtra = YES （if isRKDevices = YES,no need to consider parameter 'isHasExtra'）
 *  @constant UTEOptionOpenRemindSms         Required isHasExtra = YES （if isRKDevices = YES,no need to consider parameter 'isHasExtra'）
 *  @constant UTEOptionOpenRemindMore        Required isHasExtra = YES （if isRKDevices = YES,no need to consider parameter 'isHasExtra'）
 *
 *  @constant UTEOptionCloseRemindIncall     Required isHasExtra = YES （if isRKDevices = YES,no need to consider parameter 'isHasExtra'）
 *  @constant UTEOptionCloseRemindQQ         Required isHasExtra = YES （if isRKDevices = YES,no need to consider parameter 'isHasExtra'）
 *  @constant UTEOptionCloseRemindWeixin     Required isHasExtra = YES （if isRKDevices = YES,no need to consider parameter 'isHasExtra'）
 *  @constant UTEOptionCloseRemindSms        Required isHasExtra = YES （if isRKDevices = YES,no need to consider parameter 'isHasExtra'）
 *  @constant UTEOptionCloseRemindMore       Required isHasExtra = YES （if isRKDevices = YES,no need to consider parameter 'isHasExtra'）
 
 
 
 *  @constant UTEOptionOpenCameraMode        Open Device camera mode:Every 3 shakes of the device, the delegate uteManagerTakePicture will be invoked.
 *  @constant UTEOptionCloseCameraMode       Close Device camera mode:Device may not count steps if do not close the camera mode.
 *
 *  @constant UTEOptionDeleteDevicesAllData  Delete all data from the device(Reset everything on the device)
 
 *  @constant UTEOptionDeviceHorizontal      Set the device display orientation to landscape
 *  @constant UTEOptionDeviceVertical        Set device display orientation to portrait
 *
 *  @constant UTEOptionBloodDetectingStart
 *  @constant UTEOptionBloodDetectingStop
 *
 *  @constant UTEOptionBloodOxygenDetectingStart
 *  @constant UTEOptionBloodOxygenDetectingStop
 *
 *  @constant UTEOptionReadDisplaySize       Query device screen resolution and number of screens
 *
 *  @constant UTEOptionSyncSkipData          If isHasSportHRM=YES ,please invoke syncUTESportModelCustomTime:
 *  @constant UTEOptionSyncSwimData          If isHasSportHRM=YES ,please invoke syncUTESportModelCustomTime:
 *
 *  @constant UTEOptionReadBaseStatus        Query the current state of the device is recording the number of steps or recording sleep
 *
 *  @constant UTEOptionDetectUV
 *  @constant UTEOptionFindPhoneFunctionOpen   Device 'find phone' function open (see delegate uteManageTouchDeviceReceiveData)
 *  @constant UTEOptionFindPhoneFunctionClose  Device 'find phone' function close
 
 
 
 
 *  1、If one of the following sports is turned on, you should turn it off before turning on the other.
 *  2、If isHasSportHRM=YES, please invoke method setUTESportModel: to OPEN or CLOSE ,do not use setUTEOption: .
 *
 *  @constant UTEOptionOpenBicycle
 *  @constant UTEOptionCloseBicycle
 *  @constant UTEOptionOpenSwim
 *  @constant UTEOptionCloseSwim
 *  @constant UTEOptionOpenSkip
 *  @constant UTEOptionCloseSkip
 *
 *  @constant UTEOptionOpenTableTennis
 *  @constant UTEOptionCloseTableTennis
 *  @constant UTEOptionOpenBadminton
 *  @constant UTEOptionCloseBadminton
 *  @constant UTEOptionOpenTennis
 *  @constant UTEOptionCloseTennis
 *
 *  @constant UTEOptionSyncBallData          Sync Ball Data(TableTennis、Badminton、Tennis)
                                             If isHasDataStatus=YES ,please invoke syncDataCustomTime:type:
                                             If isHasSportHRM=YES ,please invoke syncUTESportModelCustomTime:
 
 
 *  @constant UTEOptionHRMCalibrateStart          Start the calibration heart rate
 *  @constant UTEOptionHRMCalibrateDefault        Restore Defaults
 *  @constant UTEOptionRaiseHandCalibrateStart    Start calibration 'Raise your hand and the screen will light up'
 *  @constant UTEOptionRaiseHandCalibrateDefault  Restore Defaults
 *
 *  @constant UTEOptionShutdown              Required isHasShutdown=Yes
 *
 *  @constant UTEOptionResetBodyTemperature  Reset temperature calibration value
 *  @constant UTEOptionClearBodyTemperature  Delete all temperature records
 *
 */
typedef NS_ENUM(NSInteger, UTEOption) {
    
    UTEOptionSyncAllStepsData,
    UTEOptionSyncAllSleepData,
    UTEOptionSyncAllHRMData,
    UTEOptionSyncAllBloodData,
    UTEOptionSyncAllBloodOxygenData,
    UTEOptionSyncAllRespirationData,

    UTEOptionSyncGPSData,
    UTEOptionSyncBicycleData,
    UTEOptionSyncBarometricData,
    UTEOptionSyncBodyFat,
    UTEOptionSyncECG,

    UTEOptionIncall,
    UTEOptionHangup,
    UTEOptionFindBand,
    UTEOptionSyncTime,
    UTEOptionReadDevicesBattery,
    UTEOptionDeleteGPSData,
    
    UTEOptionHeartDetectingStart,
    UTEOptionHeartDetectingStop,
    UTEOptionHeartSwitchDynamic,
    UTEOptionHeartSwitchStatic,
    
    UTEOptionOpen24HourHRM,
    UTEOptionClose24HourHRM,
    
    UTEOptionUnitInch,
    UTEOptionUnitMeter,
    UTEOptionUnitInch_12,
    UTEOptionUnitInch_24,
    UTEOptionUnitMeter_12,
    UTEOptionUnitMeter_24,
    
    UTEOptionOpenRemindIncall,
    UTEOptionOpenRemindQQ,
    UTEOptionOpenRemindWeixin,
    UTEOptionOpenRemindSms,
    UTEOptionOpenRemindMore,
    UTEOptionCloseRemindIncall,
    UTEOptionCloseRemindQQ,
    UTEOptionCloseRemindWeixin,
    UTEOptionCloseRemindSms,
    UTEOptionCloseRemindMore,
    
    UTEOptionOpenCameraMode,
    UTEOptionCloseCameraMode,
    
    UTEOptionDeleteDevicesAllData,
    
    UTEOptionDeviceHorizontal,
    UTEOptionDeviceVertical,
    
    UTEOptionBloodDetectingStart,
    UTEOptionBloodDetectingStop,
    
    UTEOptionBloodOxygenDetectingStart,
    UTEOptionBloodOxygenDetectingStop,
    
    UTEOptionRespirationDetectingStart,
    UTEOptionRespirationDetectingStop,
    
    UTEOptionReadDisplaySize,
    
    UTEOptionSyncSkipData,
    UTEOptionSyncSwimData,
    
    UTEOptionReadBaseStatus,
    
    UTEOptionDetectUV,
    UTEOptionFindPhoneFunctionOpen,
    UTEOptionFindPhoneFunctionClose,
    
    UTEOptionOpenBicycle,
    UTEOptionCloseBicycle,
    UTEOptionOpenSwim,
    UTEOptionCloseSwim,
    UTEOptionOpenSkip,
    UTEOptionCloseSkip,
    
    UTEOptionOpenTableTennis,
    UTEOptionCloseTableTennis,
    UTEOptionOpenBadminton,
    UTEOptionCloseBadminton,
    UTEOptionOpenTennis,
    UTEOptionCloseTennis,
    UTEOptionSyncBallData,
    
    UTEOptionHRMCalibrateStart,
    UTEOptionHRMCalibrateDefault,
    UTEOptionRaiseHandCalibrateStart,
    UTEOptionRaiseHandCalibrateDefault,
    
    UTEOptionShutdown,
    UTEOptionResetBodyTemperature,
    UTEOptionClearBodyTemperature,
};


/*!
 *  @enum UTECallBack
 *
 *  @discussion After calling method setUTEOption, if the device receives value, it will feedback to the App.
 */
typedef NS_ENUM(NSInteger, UTECallBack) {
    
    UTECallBackUnit,
    UTECallBackInfoHeightWeight,
    UTECallBackSyncTime,
    UTECallBackAlarm,
    
    UTECallBackOpenRemindIncall,
    UTECallBackOpenRemindQQ,
    UTECallBackOpenRemindWeixin,
    UTECallBackOpenRemindSms,
    UTECallBackOpenRemindMore,
    
    UTECallBackCloseRemindIncall,
    UTECallBackCloseRemindQQ,
    UTECallBackCloseRemindWeixin,
    UTECallBackCloseRemindSms,
    UTECallBackCloseRemindMore,
    
    UTECallBackOpenRemindFacebook,
    UTECallBackOpenRemindFacebookMessenger,
    UTECallBackOpenRemindTwitter,
    UTECallBackOpenRemindWhatsApp,
    UTECallBackOpenRemindLine,
    UTECallBackOpenRemindSkype,
    UTECallBackOpenRemindHangouts,
    
    UTECallBackOpenRemindInstagram,
    UTECallBackOpenRemindYouTube,
    UTECallBackOpenRemindGmail,
    UTECallBackOpenRemindSnapchat,
    UTECallBackOpenRemindPinterest,
    UTECallBackOpenRemindLinkedIn,
    UTECallBackOpenRemindTumblr,
    UTECallBackOpenRemindViber,
    UTECallBackOpenRemindGooglePlus,
    UTECallBackOpenRemindFlickr,
    UTECallBackOpenRemindVK,
    UTECallBackOpenRemindKaKao,
    UTECallBackOpenRemindTelegram,
    
    UTECallBackCloseRemindFacebook,
    UTECallBackCloseRemindFacebookMessenger,
    UTECallBackCloseRemindTwitter,
    UTECallBackCloseRemindWhatsApp,
    UTECallBackCloseRemindLine,
    UTECallBackCloseRemindSkype,
    UTECallBackCloseRemindHangouts,
    
    UTECallBackCloseRemindInstagram,
    UTECallBackCloseRemindYouTube,
    UTECallBackCloseRemindGmail,
    UTECallBackCloseRemindSnapchat,
    UTECallBackCloseRemindPinterest,
    UTECallBackCloseRemindLinkedIn,
    UTECallBackCloseRemindTumblr,
    UTECallBackCloseRemindViber,
    UTECallBackCloseRemindGooglePlus,
    UTECallBackCloseRemindFlickr,
    UTECallBackCloseRemindVK,
    UTECallBackCloseRemindKaKao,
    UTECallBackCloseRemindTelegram,
    
    UTECallBackOpenUnitSitRemind,
    UTECallBackCloseSitRemind,
    
    UTECallBackHeartSwitchDynamic,
    UTECallBackHeartSwitchStatic,
    
    UTECallBackDevicesVersion,
    UTECallBackDevicesAddress,
    
    UTECallBackDeviceHorizontal,
    UTECallBackDeviceVertical,
    
    UTECallBackDeviceSilence,
    
    UTECallBackDeviceWeather,
    UTECallBackDeviceBattery,
    UTECallBackSwitchHandAndDisplay,
    UTECallBackWeatherSevenDay,
    UTECallBackIbeaconOption,
    UTECallBackMultiLanguage,
    
    UTECallBackSiestaSet,
    UTECallBackSleepNightSet,
    UTECallBackSleepAdjust,
    
    UTECallBackFindPhoneFunctionOpen,
    UTECallBackFindPhoneFunctionClose,
    
    UTECallBackOpenBicycle,
    UTECallBackCloseBicycle,
    UTECallBackOpenSwim,
    UTECallBackCloseSwim,
    UTECallBackOpenSkip,
    UTECallBackCloseSkip,
    
    UTECallBackOpenTableTennis,
    UTECallBackCloseTableTennis,
    UTECallBackOpenBadminton,
    UTECallBackCloseBadminton,
    UTECallBackOpenTennis,
    UTECallBackCloseTennis,
    
    UTECallBackOpen24HourHRM,
    UTECallBackClose24HourHRM,
    
    UTECallBackCustomUIshow,
    UTECallBackCustomUIhide,
    UTECallBackDeleteGPSData,
    UTECallBackDeviceCustomMsg,
    
    UTECallBackResetCalibrateBodyTemp,
    UTECallBackClearBodyTempData,
    
    UTECallBackMenstruationOpen,
    UTECallBackMenstruationClose,
    
    UTECallBackBloodPressureAutoTest,
    
    UTECallBackBodyTemperatureAutoTestOpen,
    UTECallBackBodyTemperatureAutoTestClose,
    UTECallBackBodyTemperatureSetTestDuration,
    UTECallBackBodyTemperatureSetAlarm,
    UTECallBackBodyTemperatureFunction2Open,
    UTECallBackBodyTemperatureFunction2Close,
    
    UTECallBloodOxygenAutoTestOpen,
    UTECallBloodOxygenAutoTestClose,
    UTECallBloodOxygenSetTestDuration,
    
    UTECallRespirationAutoTestOpen,
    UTECallRespirationAutoTestClose,
    UTECallRespirationSetTestDuration,
};

/*!
 *  @enum UTEDevicesSate
 *
 *  @constant UTEDevicesSateConnected
 *  @constant UTEDevicesSateDisconnected          There are errors, please see error.code(UTEErrorCode)
 *  @constant UTEDevicesSateConnectingError       An error occurred during device connection
 
 *  @constant UTEDevicesSateSyncBegin             Device sync data start
 *  @constant UTEDevicesSateSyncSuccess           Device sync completed
 *  @constant UTEDevicesSateSyncError             There are errors, please see error.code(UTEErrorCode)
 
 *  @constant UTEDevicesSateHeartDetectingStart
 *  @constant UTEDevicesSateHeartDetectingProcess There will be data during device heart rate detection
 *  @constant UTEDevicesSateHeartDetectingStop
 *  @constant UTEDevicesSateHeartDetectingError   There are errors, please see error.code(UTEErrorCode)
 *  @constant UTEDevicesSateHeartCurrentValue     Device heart rate returns in real time
 
 *  @constant UTEDevicesSateBloodDetectingStart
 *  @constant UTEDevicesSateBloodDetectingProcess There will be data during device Blood pressure detection
 *  @constant UTEDevicesSateBloodDetectingStop
 *  @constant UTEDevicesSateBloodDetectingError   There are errors, please see error.code(UTEErrorCode)
 
 *  @constant UTEDevicesSateBloodOxygenDetectingStart
 *  @constant UTEDevicesSateBloodOxygenDetectingProcess There will be data during device Blood Oxygen detection
 *  @constant UTEDevicesSateBloodOxygenDetectingStop    There will be data if device Blood Oxygen test successful
 *  @constant UTEDevicesSateBloodOxygenDetectingError   There are errors, please see error.code(UTEErrorCode)
 
 *  @constant UTEDevicesSateCheckFirmwareError    Error in firmware check, please see error.code(UTEErrorCode)
 
 *  @constant UTEDevicesSateUpdateHaveNewVersion  There is a new version of the firmware
 *  @constant UTEDevicesSateUpdateNoNewVersion    No new version of firmware
 *  @constant UTEDevicesSateUpdateBegin           Firmware upgrade begins
 *  @constant UTEDevicesSateUpdateSuccess         Firmware upgrade successful(Device will automatically disconnect, please reconnect)
 *  @constant UTEDevicesSateUpdateError           Firmware upgrade failed, please see error.code(UTEErrorCode)
 *
 *  @constant UTEDevicesSateCardApduError         Device Apdu data interaction failed, please see error.code(UTEErrorCode)
 *
 *  @constant UTEDevicesSatePasswordState         Device password verification status. Please see UTEPasswordState
 *
 *  @constant UTEDevicesSateStep                  The device is in the monitoring step
 *  @constant UTEDevicesSateSleep                 The device is in the monitoring sleep
 *  @constant UTEDevicesSateOther                 Other
 *
 *  @constant UTEDevicesSateUV                    Acquired UV data after device testing is completed
 *
 *  @constant UTEDevicesSateHRMCalibrateStart
 *  @constant UTEDevicesSateHRMCalibrateFail
 *  @constant UTEDevicesSateHRMCalibrateComplete
 *  @constant UTEDevicesSateHRMCalibrateDefault   Heart rate calibration value restored to default
 
 *  @constant UTEDevicesSateRaiseHandCalibrateStart     (Raise your hand, the screen lights up) Calibration starts
 *  @constant UTEDevicesSateRaiseHandCalibrateFail
 *  @constant UTEDevicesSateRaiseHandCalibrateComplete
 *  @constant UTEDevicesSateRaiseHandCalibrateDefault   Calibration value restored to default
 
 *  @constant UTEDevicesSateBodyFatStart          Body fat test begins
 *  @constant UTEDevicesSateBodyFatStop
 *  @constant UTEDevicesSateBodyFatStateIn        Device test status. 'Not Wearing' To 'Wearing'
 *  @constant UTEDevicesSateBodyFatStateOut       Device test status. 'Wearing' To 'Not Wearing'
 *  @constant UTEDevicesSateBodyFatComplete       Body fat test completed
 *  @constant UTEDevicesSateBodyFatFail           There are errors. Please see error.code(UTEErrorCode)
 *
 *  @constant UTEDevicesSateECGDetectingStart     ECG test begins
 *  @constant UTEDevicesSateECGDetectingProcess   There will be data during ECG detection
 *  @constant UTEDevicesSateECGDetectingFail      There are errors. Please see error.code(UTEErrorCode)
 *  @constant UTEDevicesSateECGDetectingComplete  ECG completed（Have value）
 *  @constant UTEDevicesSateECGDetectingStatusBothHand     ECG status: Both hands have been placed on the electrodes.
 *  @constant UTEDevicesSateECGDetectingStatusOneHand      ECG status: one of the hands is not placed on the electrode.
 *
 *  @constant UTEDevicesSateBodyTempNormal         The device automatically return data. Required isHasBodyTemperature = YES
 *  @constant UTEDevicesSateBodyTempCurrent        Current body temperature. Required isHasBodyTemperature = YES
 *  @constant UTEDevicesSateBodyTempAlarm          The device issues an alarm for body temperature.
 */
typedef NS_ENUM(NSInteger, UTEDevicesSate) {
    UTEDevicesSateConnected = 0,
    UTEDevicesSateDisconnected,
    UTEDevicesSateConnectingError,
    
    UTEDevicesSateSyncBegin,
    UTEDevicesSateSyncSuccess,
    UTEDevicesSateSyncError,
    
    UTEDevicesSateHeartDetectingStart,
    UTEDevicesSateHeartDetectingProcess,
    UTEDevicesSateHeartDetectingStop,
    UTEDevicesSateHeartDetectingError,
    UTEDevicesSateHeartCurrentValue,
    
    UTEDevicesSateBloodDetectingStart,
    UTEDevicesSateBloodDetectingProcess,
    UTEDevicesSateBloodDetectingStop,
    UTEDevicesSateBloodDetectingError,
    
    UTEDevicesSateBloodOxygenDetectingStart,
    UTEDevicesSateBloodOxygenDetectingProcess,
    UTEDevicesSateBloodOxygenDetectingStop,
    UTEDevicesSateBloodOxygenDetectingError,
    
    UTEDevicesSateRespirationDetectingStart,
    UTEDevicesSateRespirationDetectingProcess,
    UTEDevicesSateRespirationDetectingStop,
    UTEDevicesSateRespirationDetectingError,
    
    UTEDevicesSateCheckFirmwareError,
    
    UTEDevicesSateUpdateHaveNewVersion,
    UTEDevicesSateUpdateNoNewVersion,
    UTEDevicesSateUpdateBegin,
    UTEDevicesSateUpdateSuccess,
    UTEDevicesSateUpdateError,
    
    UTEDevicesSateCardApduError,
    
    UTEDevicesSatePasswordState,
    
    UTEDevicesSateStep,
    UTEDevicesSateSleep,
    UTEDevicesSateOther,
    
    UTEDevicesSateUV,
    
    UTEDevicesSateHRMCalibrateStart,
    UTEDevicesSateHRMCalibrateFail,
    UTEDevicesSateHRMCalibrateComplete,
    UTEDevicesSateHRMCalibrateDefault,
    
    UTEDevicesSateRaiseHandCalibrateStart,
    UTEDevicesSateRaiseHandCalibrateFail,
    UTEDevicesSateRaiseHandCalibrateComplete,
    UTEDevicesSateRaiseHandCalibrateDefault,
    
    UTEDevicesSateBodyFatStart,
    UTEDevicesSateBodyFatStop,
    UTEDevicesSateBodyFatStateIn,
    UTEDevicesSateBodyFatStateOut,
    UTEDevicesSateBodyFatFail,
    UTEDevicesSateBodyFatComplete,
    
    UTEDevicesSateECGDetectingStart,
    UTEDevicesSateECGDetectingProcess,
    UTEDevicesSateECGDetectingFail,
    UTEDevicesSateECGDetectingComplete,
    UTEDevicesSateECGDetectingStatusBothHand,
    UTEDevicesSateECGDetectingStatusOneHand,
    
    UTEDevicesSateBodyTempNormal,
    UTEDevicesSateBodyTempCurrent,
    UTEDevicesSateBodyTempAlarm,
};

/*!
 *  @enum UTEPasswordState
 *
 *  @discussion Some firmware requires a password to connect.
 *
 *  @constant UTEPasswordStateNew               Device needs to set a new password (Not used yet)
 *  @constant UTEPasswordStateNeed              Device needs to set a password (Not used yet)
 *  @constant UTEPasswordStateCorrect           Password input, verified, or modify successfully
 *  @constant UTEPasswordStateError             Password input, verified, or modify failed
 */
typedef NS_ENUM(NSInteger, UTEPasswordState) {
    
    UTEPasswordStateNew    = 1,
    UTEPasswordStateNeed,
    UTEPasswordStateCorrect,
    UTEPasswordStateError,
};

/*!
 *  @enum UTEPasswordType
 *
 *  @discussion The type of password used for what.
 *
 *  @constant UTEPasswordTypeConnect           When the device is connected
 *  @constant UTEPasswordTypeConfirm           Must verify when changing password (Not used yet)
 *  @constant UTEPasswordTypeReset             Reset password (Not used yet)
 */
typedef NS_ENUM(NSInteger, UTEPasswordType) {
    
    UTEPasswordTypeConnect    = 1,
    UTEPasswordTypeConfirm,
    UTEPasswordTypeReset,
};

/*!
 *  @enum UTEErrorCode
 *
 *  @constant UTEErrorCodeDisconnect          Device disconnected from App
 
 *  @constant UTEErrorCodeSyncDisconnect      Device disconnected while syncing data
 *  @constant UTEErrorCodeHeartingDisconnect  Device disconnected during heart rate test
 *  @constant UTEErrorCodeBloodDisconnect     Device disconnected during blood pressure test
 *  @constant UTEErrorCodeBloodOxygenDisconnect     Device disconnected during blood oxygen pressure test
 *  @constant UTEErrorCodeSyncVerify          After syncing data, data verification failed (some data was lost)
 
 *  @constant UTEErrorCodeSyncStep            Sync data of steps. The data reception is abnormal. Sync finish.
 *  @constant UTEErrorCodeSyncSleep           Sync data of sleep. The data reception is abnormal. Sync finish.
 *  @constant UTEErrorCodeSyncHRM             Sync data of Heart rate. The data reception is abnormal. Sync finish.
 *  @constant UTEErrorCodeSyncBlood           Sync data of blood pressure. The data reception is abnormal. Sync finish.
 *  @constant UTEErrorCodeSyncBloodOxygen     Sync data of blood oxygen. The data reception is abnormal. Sync finish.
 *  @constant UTEErrorCodeSyncSwim            Sync data of Swimming. The data reception is abnormal. Sync finish.
 *  @constant UTEErrorCodeSyncSkip            Sync data of rope skipping. The data reception is abnormal. Sync finish.
 *  @constant UTEErrorCodeSyncBicycle         Sync data of bicycle. The data reception is abnormal. Sync finish.
 *  @constant UTEErrorCodeSyncBall            Sync data of ball. The data reception is abnormal. Sync finish.
 *  @constant UTEErrorCodeSyncGPS             Sync data of GPS. The data reception is abnormal. Sync finish.
 *  @constant UTEErrorCodeSyncBarometric      Sync data of barometric pressure. The data reception is abnormal. Sync finish.
 *  @constant UTEErrorCodeSyncECG             Sync data of ECG. The data reception is abnormal. Sync finish.
 *  @constant UTEErrorCodeSyncBodyFat         Sync data of Body fat. The data reception is abnormal. Sync finish.
 *  @constant UTEErrorCodeSyncBodyTemp        Sync data of body temperature. The data reception is abnormal. Sync finish.
 
 *  @constant UTEErrorCodeSyncTimeout         Synchronized data timed out
 
 *  @constant UTEErrorCodeCheckTimeout        Check device's online firmware timeout, network timeout (about 10 seconds)
 *  @constant UTEErrorCodeCheckChara          Check device, the firmware is incomplete and characteristic values are missing
 *  @constant UTEErrorCodeCheckAddress        Check device, the firmware is incomplete and address missing
 
 *  @constant UTEErrorCodeUpdateDownload      Download firmware error while upgrading device
 *  @constant UTEErrorCodeUpdateDisconnect    Device is disconnected while upgrading device
 *  @constantUTEErrorCodeUpdateLoadFirmwareFail The firmware failed to load while upgrading device.
 
 *  @constant UTEErrorCodeApduDisconnect      Device disconnected during Apdu data interaction
 *  @constant UTEErrorCodeDeviceTimeout       Device processing timed out
 *  @constant UTEErrorCodeBodyFatTimeout      Body fat test timeout
 
 *  @constant UTEErrorCodeDialTimeout         Screen(Dial) processing timeout
 *  @constant UTEErrorCodeDialCRC             Screen(Dial) verification failed
 *  @constant UTEErrorCodeDialTooBig          Screen(Dial) capacity is too large for the device to handle
 *  @constant UTEErrorCodeDialDisconnect      Device disconnected while sending Screen(Dial) data
 */
typedef NS_ENUM(NSInteger, UTEErrorCode) {
    UTEErrorCodeDisconnect          = 1,
    
    UTEErrorCodeSyncDisconnect,
    UTEErrorCodeHeartingDisconnect,
    UTEErrorCodeBloodDisconnect,
    UTEErrorCodeBloodOxygenDisconnect,
    UTEErrorCodeSyncVerify,
    
    UTEErrorCodeSyncStep,
    UTEErrorCodeSyncSleep,
    UTEErrorCodeSyncHRM,
    UTEErrorCodeSyncBlood,
    UTEErrorCodeSyncBloodOxygen,
    UTEErrorCodeSyncSwim,
    UTEErrorCodeSyncSkip,
    UTEErrorCodeSyncBicycle,
    UTEErrorCodeSyncBall,
    UTEErrorCodeSyncGPS,
    UTEErrorCodeSyncBarometric,
    UTEErrorCodeSyncECG,
    UTEErrorCodeSyncBodyFat,
    UTEErrorCodeSyncBodyTemp,
    
    UTEErrorCodeSyncTimeout,
    
    UTEErrorCodeCheckTimeout,
    UTEErrorCodeCheckChara,
    UTEErrorCodeCheckAddress,
    
    UTEErrorCodeUpdateDownload,
    UTEErrorCodeUpdateDisconnect,
    UTEErrorCodeUpdateLoadFirmwareFail,
    
    UTEErrorCodeApduDisconnect,
    UTEErrorCodeDeviceTimeout,
    UTEErrorCodeBodyFatTimeout,
    
    UTEErrorCodeDialTimeout,
    UTEErrorCodeDialCRC,
    UTEErrorCodeDialTooBig,
    UTEErrorCodeDialDisconnect,
};

/*!
 *  @enum UTEBluetoothState
 *
 *  @discussion Bluetooth status
 */
typedef NS_ENUM(NSInteger, UTEBluetoothState) {
    UTEBluetoothStateOpen = 0,
    UTEBluetoothStateClose,
    UTEBluetoothStateResetting,
    UTEBluetoothStateUnsupported,
    UTEBluetoothStateUnauthorized,
    UTEBluetoothStateUnknown,
};

/*!
 *  @enum UTEQueryType
 */
typedef NS_ENUM(NSInteger, UTEQueryType) {
    UTEQueryTypeRun = 0,
    UTEQueryTypeSleep,
    UTEQueryTypeHRM,
    UTEQueryTypeAll,
}NS_DEPRECATED_IOS(2_0,7_0);

/*!
 *  @enum UTESleepType
 */
typedef NS_ENUM(NSInteger, UTESleepType) {
    UTESleepTypeAwake = 0,
    UTESleepTypeDeepSleep,
    UTESleepTypeLightSleep,
};

/*!
 *  @enum UTEHRMType
 *
 *  @constant UTEHRMTypeNormal      Data is normal
 *  @constant UTEHRMTypeSuccess     Heart rate test successful
 *  @constant UTEHRMTypeFail        Heart rate test failed
 *  @constant UTEHRMTypeTimeout     Heart rate test timeout
 */
typedef NS_ENUM(NSInteger, UTEHRMType) {
    UTEHRMTypeNormal = 0,
    UTEHRMTypeSuccess,
    UTEHRMTypeFail,
    UTEHRMTypeTimeout,
};

/*!
 *  @enum UTEBloodType
 *
 *  @constant UTEBloodTypeNormal      Data is normal
 *  @constant UTEBloodTypeSuccess     Blood pressure test successful
 *  @constant UTEBloodTypeFail        Blood pressure test failed
 *  @constant UTEBloodTypeTimeout     Blood pressure test timeout
 */
typedef NS_ENUM(NSInteger, UTEBloodType) {
    UTEBloodTypeNormal = 0,
    UTEBloodTypeSuccess,
    UTEBloodTypeFail,
    UTEBloodTypeTimeout,
};

/*!
 *  @enum UTEBloodOxygenType
 *
 *  @constant UTEBloodOxygenTypeNormal      Data is normal
 *  @constant UTEBloodOxygenTypeSuccess     Blood Oxygen test successful
 *  @constant UTEBloodOxygenTypeFail        Blood Oxygen test failed
 *  @constant UTEBloodOxygenTypeTimeout     Blood Oxygen test timeout
 */
typedef NS_ENUM(NSInteger, UTEBloodOxygenType) {
    UTEBloodOxygenTypeNormal = 0,
    UTEBloodOxygenTypeSuccess,
    UTEBloodOxygenTypeFail,
    UTEBloodOxygenTypeTimeout,
};

/*!
 *  @enum UTERespirationType
 *
 *  @constant UTERespirationTypeNormal      Data is normal
 *  @constant UTERespirationTypeSuccess     Respiration test successful
 *  @constant UTERespirationTypeFail        Respiration test failed
 *  @constant UTERespirationTypeTimeout     Respiration test timeout
 */
typedef NS_ENUM(NSInteger, UTERespirationType) {
    UTERespirationTypeNormal = 0,
    UTERespirationTypeSuccess,
    UTERespirationTypeFail,
    UTERespirationTypeTimeout,
};

/*!
 *  @enum UTEAlarmWeek
 */
typedef NS_ENUM(NSInteger, UTEAlarmWeek) {
    UTEAlarmWeekSunday    = 1 << 0,
    UTEAlarmWeekMonday    = 1 << 1,
    UTEAlarmWeekTuesday   = 1 << 2,
    UTEAlarmWeekWednesday = 1 << 3,
    UTEAlarmWeekThursday  = 1 << 4,
    UTEAlarmWeekFriday    = 1 << 5,
    UTEAlarmWeekSaturday  = 1 << 6,
};

/*!
 *  @enum UTEAlarmNum
 *
 *  @discussion Alarm clock number
 */
typedef NS_ENUM(NSInteger, UTEAlarmNum) {
    UTEAlarmNum1 = 1,
    UTEAlarmNum2,
    UTEAlarmNum3,
};

/*!
 *  @enum UTEDeviceFeature
 *
 *  @discussion Device Feature.
 *  When isRKDevices=YES, don't need to consider this enumeration.
 *
 *  @constant UTEDeviceFeatureNone             Default mode
 *  @constant UTEDeviceFeatureWechat           WeChat mode (WeChat ranking)
 *  @constant UTEDeviceFeatureMessage          Message push mode
 *  @constant UTEDeviceFeatureWechatMessage    Message push mode and WeChat mode
 *  @constant UTEDeviceFeatureUpdate           Upgrade mode
 *  @constant UTEDeviceFeatureUpdateWechat     Upgrade mode and WeChat mode
 */
typedef NS_ENUM(NSInteger, UTEDeviceFeature) {
    UTEDeviceFeatureNone,
    UTEDeviceFeatureWechat,
    UTEDeviceFeatureMessage,
    UTEDeviceFeatureWechatMessage,
    UTEDeviceFeatureUpdate,
    UTEDeviceFeatureUpdateWechat,
};

/*!
 *  @enum UTESilenceType
 *
 *  @discussion Turn off some functions of the device
 *
 *  @constant UTESilenceTypeNone             Turn off all functions
 *  @constant UTESilenceTypeScreen           Turn on the device screen and the screen will never light up (This feature is invalid)
 *  @constant UTESilenceTypeVibration        Turn on the device's motor vibration, the device will never shake
 *  @constant UTESilenceTypeMessage          Turn on the device any message alerts
 *  @constant UTESilenceTypePhone            Turn on the 'hang up call' function of the device
 */
typedef NS_ENUM(NSInteger, UTESilenceType) {
    UTESilenceTypeNone              = 0,
    UTESilenceTypeScreen            = 1 << 0, //(This enumerate is invalid)
    UTESilenceTypeVibration         = 1 << 1,
    UTESilenceTypeMessage           = 1 << 2,
    UTESilenceTypePhone             = 1 << 3,
};

/*!
 *  @enum UTEWeatherType
 *
 *  @discussion Weather types supported by firmware.
 *
 *  @constant UTEWeatherTypeSunny
 *  @constant UTEWeatherTypeCloudy
 *  @constant UTEWeatherTypeOvercast
 *  @constant UTEWeatherTypeShower
 *  @constant UTEWeatherTypeThunderStorm
 *  @constant UTEWeatherTypeRainSnow      //Rain and snow
 *  @constant UTEWeatherTypeLightRain
 *  @constant UTEWeatherTypePouring       //heavy rain
 *  @constant UTEWeatherTypeSnow
 *  @constant UTEWeatherTypeSandstorm
 *  @constant UTEWeatherTypeMistHaze
 *  @constant UTEWeatherTypeWind
 */
typedef NS_ENUM(NSInteger, UTEWeatherType) {
    UTEWeatherTypeSunny         = 1,
    UTEWeatherTypeCloudy,
    UTEWeatherTypeOvercast,
    UTEWeatherTypeShower,
    UTEWeatherTypeThunderStorm,
    UTEWeatherTypeRainSnow,
    UTEWeatherTypeLightRain,
    UTEWeatherTypePouring,
    UTEWeatherTypeSnow,
    UTEWeatherTypeSandstorm,
    UTEWeatherTypeMistHaze,
    UTEWeatherTypeWind,
};

/*!
 *  @enum UTEDeviceSreenDisplayType
 *
 *  @discussion Device screen display orientation
 *
 *  @constant UTEDeviceSreenDisplayTypeHorizontal
 *  @constant UTEDeviceSreenDisplayTypeVerticalEN        //Vertical display(English and other languages)
 *  @constant UTEDeviceSreenDisplayTypeVerticalCH        //Vertical display(Chinese)
 */
typedef NS_ENUM(NSInteger, UTEDeviceSreenDisplayType) {
    UTEDeviceSreenDisplayTypeHorizontal,
    UTEDeviceSreenDisplayTypeVerticalEN,
    UTEDeviceSreenDisplayTypeVerticalCH,
};

/*!
 *  @enum UTEWearType
 *
 *  @discussion Which hand wears the device
 *
 *  @constant UTEWearTypeLeft         //Left hand
 *  @constant UTEWearTypeRight        //Right hand
 */
typedef NS_ENUM(NSInteger, UTEWearType) {
    UTEWearTypeLeft,
    UTEWearTypeRight,
};

/*!
 *  @enum UTEIbeaconOption
 *
 *  @discussion ibeacon
 *
 *  @constant UTEIbeaconOptionUUID                 //uuid
 *  @constant UTEIbeaconOptionMajor                //major
 *  @constant UTEIbeaconOptionMinor                //minor
 *  @constant UTEIbeaconOptionName                 //device name
 *  @constant UTEIbeaconOptionTXPower              //TX Power
 *  @constant UTEIbeaconOptionAdvertisingInterval  //Advertising Interval
 */
typedef NS_ENUM(NSInteger, UTEIbeaconOption) {
    UTEIbeaconOptionUUID,
    UTEIbeaconOptionMajor,
    UTEIbeaconOptionMinor,
    UTEIbeaconOptionName,
    UTEIbeaconOptionTXPower,
    UTEIbeaconOptionAdvertisingInterval,
};

/*!
 *  @enum UTEDeviceInfoSex
 *
 *  @discussion Wearer's gender
 *
 *  @constant UTEDeviceInfoSexDefault
 *  @constant UTEDeviceInfoSexMale
 *  @constant UTEDeviceInfoSexFemale
 */
typedef NS_ENUM(NSInteger, UTEDeviceInfoSex) {
    UTEDeviceInfoSexDefault,
    UTEDeviceInfoSexMale,
    UTEDeviceInfoSexFemale,
};

/*!
 *  @enum UTEDeviceLanguage
 */
typedef NS_ENUM(NSInteger, UTEDeviceLanguage) {
    
    UTEDeviceLanguageChinese    = 1,        //中文
    UTEDeviceLanguageEnglish    = 2,        //英语
    UTEDeviceLanguageKorean     = 3,        //韩语
    UTEDeviceLanguageJapanese   = 4,        //日语
    UTEDeviceLanguageGerman     = 5,        //德语
    UTEDeviceLanguageSpanish    = 6,        //西班牙语
    UTEDeviceLanguageFrench     = 7,        //法语
    UTEDeviceLanguageItalian    = 8,        //意大利语
    UTEDeviceLanguagePortuguese  = 9,       //葡萄牙语
    UTEDeviceLanguageArabic     = 10,       //阿拉伯语
    UTEDeviceLanguageIndia      = 11,       //印度语
    UTEDeviceLanguageHindi      = 12,       //印地语
    UTEDeviceLanguagePolish     = 13,       //波兰语
    UTEDeviceLanguageRussian    = 14,       //俄语
    UTEDeviceLanguageDutch      = 15,       //荷兰语
    UTEDeviceLanguageTurkey     = 16,       //土耳其
    UTEDeviceLanguageBengal     = 17,       //孟加拉语
    UTEDeviceLanguageUrdu       = 18,       //乌尔都语
    UTEDeviceLanguageIndonesia  = 19,       //印度尼西亚语
    UTEDeviceLanguagePunjabi    = 20,       //旁遮普语
    UTEDeviceLanguageThai       = 21,       //泰语
    UTEDeviceLanguageCzech      = 22,       //捷克语
    UTEDeviceLanguageChinese_t  = 23,       //中文繁体
    UTEDeviceLanguageHebrew     = 24,       //希伯来语
    UTEDeviceLanguageOther      = UTEDeviceLanguageEnglish, //other
};


/*!
 *  @enum UTEDeviceSleepAuxType
 *
 *  @discussion Sleep assist function
 *
 */
typedef NS_ENUM(NSInteger, UTEDeviceSleepAuxType) {
    UTEDeviceSleepAuxTypeDefault  = 0,
    UTEDeviceSleepAuxTypeOpen     = 1,
    UTEDeviceSleepAuxTypeClose    = -1,
};

/*!
 *  @enum UTEDeviceRemindEnableType
 */
typedef NS_ENUM(NSInteger, UTEDeviceRemindEnableType) {
    UTEDeviceRemindDefault  = 0,
    UTEDeviceRemindOpen     = 1,
    UTEDeviceRemindClose    = -1,
};

/*!
 *  @enum UTEDeviceSleepStatus
 */
typedef NS_ENUM(NSInteger, UTEDeviceSleepStatus) {
    UTEDeviceSleepStatusOpen ,
    UTEDeviceSleepStatusClose,
};

/*!
 *  @enum UTEDeviceSleepTimeType
 *
 *  @discussion Type of sleep
 *
 */
typedef NS_ENUM(NSInteger, UTEDeviceSleepTimeType) {
    UTEDeviceSleepTimeTypeSiesta,      //Daytime nap
    UTEDeviceSleepTimeTypeNight,       //Sleep at night
};

/*!
 *  @enum UTEDeviceBallType
 */
typedef NS_ENUM(NSInteger, UTEDeviceBallType) {
    UTEDeviceBallTypeTableTennis  = 1,
    UTEDeviceBallTypeBadminton,
    UTEDeviceBallTypeTennis,
};

/*!
 *  @enum UTEDeviceCustomUIType
 *
 *  @discussion Which interface is set to show or hide
 *
 */
typedef NS_ENUM(NSInteger, UTEDeviceCustomUIType) {
    UTEDeviceCustomUITypeBloodPressure   = 0,
    UTEDeviceCustomUITypeHRM                ,
    UTEDeviceCustomUITypeBloodOxygen        ,
    UTEDeviceCustomUITypeCalorie            ,
    UTEDeviceCustomUITypeDistance           ,
    UTEDeviceCustomUITypeWeather            ,
    UTEDeviceCustomUITypeSMS                ,
    UTEDeviceCustomUITypeFunction           ,
    
    UTEDeviceCustomUITypeSteps              ,
    UTEDeviceCustomUITypeRopeSkipping       ,
    UTEDeviceCustomUITypeSwimming           ,
    UTEDeviceCustomUITypeCycling            ,
    UTEDeviceCustomUITypeTableTennis        ,
    UTEDeviceCustomUITypeBadminton          ,
    UTEDeviceCustomUITypeTennis             ,
    UTEDeviceCustomUITypeRunning            ,
    
    UTEDeviceCustomUITypeGPS                ,
    UTEDeviceCustomUITypeInfo               ,
    UTEDeviceCustomUITypeFindPhone          ,
    UTEDeviceCustomUITypeNoDisturbing       ,
    UTEDeviceCustomUITypePowerOff           ,
    UTEDeviceCustomUITypeReset              ,
    UTEDeviceCustomUITypeECG                ,
    UTEDeviceCustomUITypeBloodGlucose       ,
    
    UTEDeviceCustomUITypeTramp              ,
    UTEDeviceCustomUITypeBasketball         ,
    UTEDeviceCustomUITypeSoccer_USA         ,
    UTEDeviceCustomUITypeBaseball           ,
    UTEDeviceCustomUITypeVolleyball         ,
    UTEDeviceCustomUITypeCricket            ,
    UTEDeviceCustomUITypeFootball_USA       , //American football
    UTEDeviceCustomUITypeDance              ,
    
    UTEDeviceCustomUITypeMountaineering     ,
    UTEDeviceCustomUITypeSpinningCycling    ,
    UTEDeviceCustomUITypeYoga               ,
    UTEDeviceCustomUITypeSit_Ups            ,
    UTEDeviceCustomUITypeTreadmill          ,
    UTEDeviceCustomUITypeGymnastics         ,
    UTEDeviceCustomUITypeBoating            ,
    UTEDeviceCustomUITypeJumping_Jacks      ,
    
    UTEDeviceCustomUITypeStopwatch          ,
    UTEDeviceCustomUITypeBodyFat            ,
    UTEDeviceCustomUITypeHockey             ,
    
};

/*!
 *  @enum UTEDeviceGPSStatus
 */
typedef NS_ENUM(NSInteger, UTEDeviceGPSStatus) {
    UTEDeviceGPSStatusClose,
    UTEDeviceGPSStatusCloseAndFull,     //GPS is off and The device's GPS data storage data is full. It is recommended to synchronize the GPS data,send the command UTEOptionDeleteGPSData to delete the GPS data of the device.
    UTEDeviceGPSStatusSearch,           //Searching for satellites
    UTEDeviceGPSStatusLocate,           //Positioning success
    
};

/*!
 *  @enum UTEDeviceMsgType
 */
typedef NS_ENUM(NSInteger, UTEDeviceMsgType) {
    UTEDeviceMsgTypeOther,
};

/*!
 *  @enum UTEDeviceAlertType
 *
 *  @discussion When the application is in the background and interacts with the device, the system prompts the system dialog
 *  Note:This is useful for applications that have not specified background mode and cannot display their own alert. If more than one application has requested notification for a given device, the one that was most recently in the foreground will receive the alert.
 *
 */
typedef NS_ENUM(NSInteger, UTEDeviceAlertType) {
    UTEDeviceAlertTypeNone            = 0,      //Default, no system prompt box will pop up
    UTEDeviceAlertTypeConnect         = 1 << 0, //indicating that the system should display a connection alert for a given device, if the application is suspended when a successful connection is made.
    UTEDeviceAlertTypeDisconnect      = 1 << 1, //indicating that the system should display a disconnection alert for a given device, if the application is suspended at the time of the disconnection.
    UTEDeviceAlertTypeCommunicate     = 1 << 2, //indicating that the system should display an alert for all notifications received from a device peripheral, if the application is suspended at the time.
};

/*!
 *  @enum UTEDeviceDataType
 */
typedef NS_ENUM(NSInteger, UTEDeviceDataType) {
    UTEDeviceDataTypeSteps             , //Number of steps
    UTEDeviceDataTypeSleep             , //Sleep at night
    UTEDeviceDataTypeHRM               , //Includes static and dynamic heart rate
    UTEDeviceDataTypeHRM24             , //Heart rate measured 24 hours a day
    UTEDeviceDataTypeBlood             ,
    UTEDeviceDataTypeBloodOxygen       , //Unspport
    UTEDeviceDataTypeRespiration       , //Unspport
    UTEDeviceDataTypeSkipping          ,
    UTEDeviceDataTypeSwiming           ,
    UTEDeviceDataTypeBicycle           ,
    UTEDeviceDataTypeBall              , //Includes badminton、table tennis、tennis
    UTEDeviceDataTypeSportHRM          , //property must be sportHRM=YES
    UTEDeviceDataTypeGPS               , //GPS built into the device itself
    UTEDeviceDataTypeBodyFat           ,
    UTEDeviceDataTypeECG               ,

};

/*!
 *  @enum UTEDeviceScreenType
 */
typedef NS_ENUM(NSInteger, UTEDeviceScreenType) {
    UTEDeviceScreenTypeCircle           ,
    UTEDeviceScreenTypeSquare           ,
    
};

/*!
 *  @enum UTEDeviceDisplayMode
 */
typedef NS_ENUM(NSInteger, UTEDeviceDisplayMode) {
    UTEDeviceDisplayModeDigital     = 1,
    UTEDeviceDisplayModePointer        ,
    
};

/*!
 *  @enum UTEDeviceSportMode
 *
 *  @discussion Required sportHRM = YES
 *
 */
typedef NS_ENUM(NSInteger, UTEDeviceSportMode) {
    UTEDeviceSportModeNone               ,
    UTEDeviceSportModeRunning            ,
    UTEDeviceSportModeCycling            ,
    UTEDeviceSportModeRopeSkipping       ,
    UTEDeviceSportModeSwimming           ,
    UTEDeviceSportModeBadminton          ,
    UTEDeviceSportModeTableTennis        ,
    UTEDeviceSportModeTennis             ,
    UTEDeviceSportModeMountaineering     ,
    UTEDeviceSportModeTramp              ,
    UTEDeviceSportModeBasketball         ,
    UTEDeviceSportModeSoccer_USA         ,
    UTEDeviceSportModeBaseball           ,
    UTEDeviceSportModeVolleyball         ,
    UTEDeviceSportModeCricket            ,
    UTEDeviceSportModeFootball_USA       , //American football
    UTEDeviceSportModeHockey             ,
    UTEDeviceSportModeDance              ,
    UTEDeviceSportModeSpinningCycling    ,
    UTEDeviceSportModeYoga               ,
    UTEDeviceSportModeSit_Ups            ,
    UTEDeviceSportModeTreadmill          ,
    UTEDeviceSportModeGymnastics         ,
    UTEDeviceSportModeBoating            ,
    UTEDeviceSportModeJumping_Jacks      ,
    UTEDeviceSportModeFree               , //Custom training
    
};

/*!
 *  @enum UTEDeviceIntervalTime
 */
typedef NS_ENUM(NSInteger, UTEDeviceIntervalTime) {
    UTEDeviceIntervalTime10s            = 10,  //10 seconds
    UTEDeviceIntervalTime20s            = 20,  //20 seconds
    UTEDeviceIntervalTime30s            = 30,  //30 seconds
    UTEDeviceIntervalTime1min           = 60,  //1 minute
    UTEDeviceIntervalTime2min           = 120, //2 minute
    UTEDeviceIntervalTime3min           = 180, //3 minute
    UTEDeviceIntervalTime4min           = 240, //4 minute
    UTEDeviceIntervalTime5min           = 300, //5 minute
};

/*!
 *  @enum UTEDeviceFactoryType
 */
typedef NS_ENUM(NSInteger, UTEDeviceFactoryType) {
    UTEDeviceFactoryTypePressure,
    UTEDeviceFactoryTypePower,
};

/*!
 *  @enum UTEDeviceShortcutBtnType
 *
 *  @discussion Device shortcut button type
 *
 */
typedef NS_ENUM(NSInteger, UTEDeviceShortcutBtnType) {
    UTEDeviceShortcutBtnTypeFindBand        = 1 << 0,    //Button:‘Find device’
    UTEDeviceShortcutBtnTypeHandlight       = 1 << 1,    //Button:Lift your wrist and the device screen lights up
    UTEDeviceShortcutBtnTypeSitRemind       = 1 << 2,    //Button:After sitting for a long time, the device will vibrate to remind.
    UTEDeviceShortcutBtnTypeSilence         = 1 << 3,    //Button:Device Do Not Disturb Mode
    UTEDeviceShortcutBtnTypeSmartLost       = 1 << 4,    //Button:Device anti-lost function
    UTEDeviceShortcutBtnTypeSMSRemind       = 1 << 5,    //Button:SMS reminder
    UTEDeviceShortcutBtnTypeHRM24h          = 1 << 6,    //Button:Heart rate measured 24 hours a day
    UTEDeviceShortcutBtnTypeLightTime       = 1 << 7,    //Button:Control the duration of screen brightness
    UTEDeviceShortcutBtnTypeVibration       = 1 << 8,    //Button:Vibration intensity of equipment motor
};

/*!
 *  @enum UTEDeviceSportModeStatus
 */
typedef NS_ENUM(NSInteger, UTEDeviceSportModeStatus) {
    UTEDeviceSportModeStatusClose,
    UTEDeviceSportModeStatusOpen,
    UTEDeviceSportModeStatusPause,                 //Required:isHasSportPause=YES
    UTEDeviceSportModeStatusContinue,              //Required:isHasSportPause=YES
};

/*!
 *  @enum UTEUserIDStatus
 *
 *  @discussion User id status
 *
 *  @constant UTEUserIDStatusRequired           Device needs a user id, please invoke setUTEUserID:
 *
 *  @constant UTEUserIDStatusOld                Indicates that the device has stored an User ID,
 *                                              When setting a different user id , device will pop up a dialog box requesting pairing,
 *                                              then user click the pairing button,device will restart,
 *                                              please invoke connectUTEModelDevices: again.
 *
 *  @constant UTEUserIDStatusNew                Indicates that the device has not stored User ID , device will pop up a dialog box requesting pairing.
 *
 *  @constant UTEUserIDStatusVerifySuccess      Indicates that User ID is valid, device starts to connect.
 *
 *  @constant UTEUserIDStatusPaird              In the device interface, user click the pairing button,and the device starts to connect.
 *
 *  @constant UTEUserIDStatusPairdCancel        In the device interface, user click the cancel pairing button,
 *                                              the device will be disconnected directly.
 */
typedef NS_ENUM(NSInteger, UTEUserIDStatus) {
    UTEUserIDStatusRequired,
    UTEUserIDStatusOld,
    UTEUserIDStatusNew,
    UTEUserIDStatusVerifySuccess,
    UTEUserIDStatusPaird,
    UTEUserIDStatusPairdCancel,
};

typedef NS_ENUM(NSInteger, UTEBodyTempTestTime) {
    UTEBodyTempTestTime1Min = 1,              //Automatic test every 1 minute
    UTEBodyTempTestTime5Mins,                 //Automatic test every 5 minutes
    UTEBodyTempTestTime10Mins,                //Automatic test every 10 minutes
    UTEBodyTempTestTime30Mins,                //Automatic test every 30 minutes
    UTEBodyTempTestTime1Hour,                 //Automatic test every 1 hour
    UTEBodyTempTestTime2Hours,                //Automatic test every 2 hours
    UTEBodyTempTestTime3Hours,                //Automatic test every 3 hours
    UTEBodyTempTestTime4Hours,                //Automatic test every 4 hours
    UTEBodyTempTestTime6Hours,                //Automatic test every 6 hours
   
    UTEBodyTempTestTimeAt_8,                  //Automatic test at 08:00 every day
    UTEBodyTempTestTimeAt_8_20,               //Automatic test at 08:00/20:00 every day
    UTEBodyTempTestTimeAt_8_14_20,            //Automatic test at 08:00/14:00/20:00 every day
};

typedef NS_ENUM(NSInteger, UTEBloodOxygenTestTime) {
//    UTEBloodOxygenTestTime1Min = 1,              //Automatic test every 1 minute      //Already invalid
//    UTEBloodOxygenTestTime5Mins,                 //Automatic test every 5 minutes     //Already invalid
    UTEBloodOxygenTestTime10Mins = 3,              //Automatic test every 10 minutes
    UTEBloodOxygenTestTime30Mins,                //Automatic test every 30 minutes
    UTEBloodOxygenTestTime1Hour,                 //Automatic test every 1 hour
    UTEBloodOxygenTestTime2Hours,                //Automatic test every 2 hours
    UTEBloodOxygenTestTime3Hours,                //Automatic test every 3 hours
    UTEBloodOxygenTestTime4Hours,                //Automatic test every 5 hours
    UTEBloodOxygenTestTime6Hours,                //Automatic test every 6 hours
   
    UTEBloodOxygenTestTimeAt_8,                  //Automatic test at 08:00 every day
    UTEBloodOxygenTestTimeAt_8_20,               //Automatic test at 08:00/20:00 every day
    UTEBloodOxygenTestTimeAt_8_14_20,            //Automatic test at 08:00/14:00/20:00 every day
};

typedef NS_ENUM(NSInteger, UTERespirationTestTime) {
//    UTERespirationTestTime1Min = 1,              //Automatic test every 1 minute      //Already invalid
//    UTERespirationTestTime5Mins,                 //Automatic test every 5 minutes     //Already invalid
    UTERespirationTestTime10Mins = 3,              //Automatic test every 10 minutes
    UTERespirationTestTime30Mins,                //Automatic test every 30 minutes
    UTERespirationTestTime1Hour,                 //Automatic test every 1 hour
    UTERespirationTestTime2Hours,                //Automatic test every 2 hours
    UTERespirationTestTime3Hours,                //Automatic test every 3 hours
    UTERespirationTestTime4Hours,                //Automatic test every 5 hours
    UTERespirationTestTime6Hours,                //Automatic test every 6 hours
   
    UTERespirationTestTimeAt_8,                  //Automatic test at 08:00 every day
    UTERespirationTestTimeAt_8_20,               //Automatic test at 08:00/20:00 every day
    UTERespirationTestTimeAt_8_14_20,            //Automatic test at 08:00/14:00/20:00 every day
};

typedef NS_ENUM(NSInteger, UTEDeviceApp) {
    UTEDeviceAppOther = 0, //Other apps not listed below
    UTEDeviceAppSMS,
    UTEDeviceAppQQ,
    UTEDeviceAppWechat,
    UTEDeviceAppPhone,
    UTEDeviceAppFacebook,
    UTEDeviceAppTwitter,
    UTEDeviceAppWhatsApp,
    UTEDeviceAppFacebookMessenger,
    UTEDeviceAppLine,
    UTEDeviceAppSkype,
    UTEDeviceAppHangouts,
    UTEDeviceAppLinkedin,
    UTEDeviceAppInstagram,
    UTEDeviceAppViber,
    UTEDeviceAppKakaoTalk,
    UTEDeviceAppVKontakte,
    UTEDeviceAppSnapchat,
    UTEDeviceAppGooglePlus,
    UTEDeviceAppGmail,
    UTEDeviceAppFlickr,
    UTEDeviceAppTumblr,
    UTEDeviceAppPinterest,
    UTEDeviceAppYouTube,
    UTEDeviceAppTelegram,
};

@end
