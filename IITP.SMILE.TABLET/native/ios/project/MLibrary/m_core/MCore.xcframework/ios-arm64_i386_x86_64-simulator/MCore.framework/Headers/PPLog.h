/*
 *  PPLog.h
 *  CommonProject
 *
 *  Created by Uracle Lab on 10. 12. 31..
 *  Copyright 2010 ASIA SOFT GROUP KOREA. All rights reserved.
 */
#import "PPLogger.h"

// === LOG CONFIG ==============================================================
#pragma mark -
#pragma mark log config

#define DDebug(frm, ...)    MPDDebug(frm, ##__VA_ARGS__)
#define PPDebug(frm, ...)   MPDebug(frm, ##__VA_ARGS__)
#define PPInfo(frm, ...)    MPInfo(frm, ##__VA_ARGS__)
#define PPWarn(frm, ...)    MPWarn(frm, ##__VA_ARGS__)
#define PPError(frm, ...)   MPError(frm, ##__VA_ARGS__)
#define PPVerbose(frm, ...) MPVerbose(frm, ##__VA_ARGS__)

// === MPAPP LOG UTIL ======================================================
#pragma mark -
#pragma mark log util

// PPWarn and return nil
#define PPWarn_AND_RETURN_NIL(frm, ...) {PPWarn(frm, ##__VA_ARGS__); return nil;}

// PPWarn and return nil
#define PPWarn_AND_RETURN_VOID(frm, ...) {PPWarn(frm, ##__VA_ARGS__); return;}