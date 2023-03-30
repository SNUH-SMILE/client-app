package iitp.infection.pm.implementation;

import java.util.LinkedHashMap;
import java.util.Map;

import iitp.infection.pm.R;
import m.client.android.library.core.common.CommonLibHandler;
import m.client.android.library.core.common.DataHandler;
import m.client.android.library.core.common.LibDefinitions;
import m.client.android.library.core.managers.ActivityHistoryManager;
import m.client.android.library.core.model.NetReqOptions;
import m.client.android.library.core.networks.socket.AsyncSocketNetwork;
import m.client.android.library.core.networks.socket.SocketPacketManager;
import m.client.android.library.core.utils.ByteUtils;
import m.client.android.library.core.utils.Logger;
import m.client.android.library.core.utils.PLog;
import m.client.android.library.core.utils.Utils;
import m.client.android.library.core.view.AbstractActivity;
import m.client.android.library.core.view.IActivityNetworkable;
import android.app.ProgressDialog;
import android.widget.Toast;
import java.io.UnsupportedEncodingException;
import android.graphics.drawable.ColorDrawable;

import org.json.JSONException;

/**
 * SocketNetworkManager Class
 * 
 * @author 류경민(<a mailto="kmryu@uracle.co.kr">kmryu@uracle.co.kr</a>)
 * @version v 1.0.0
 * @since Android 2.2 <br>
 *        <DT><B>Date: </B>
 *        <DD>2011.04</DD>
 *        <DT><B>Company: </B>
 *        <DD>Uracle Co., Ltd.</DD>
 * 
 * Copyright (c) 2001-2011 Uracle Co., Ltd. 
 * 166 Samseong-dong, Gangnam-gu, Seoul, 135-090, Korea All Rights Reserved.
 * 
 * @see 이 클래스는 서버 연결에 따른 네트워크 핸들러의 부모 클래스로서 Socket 네트워크 통신으로
 * 서버와의 기본 통신 인터페이스를 정의한다. 
 * 
 */ 
public class SocketDataNetworkManager extends AsyncSocketNetwork  {
	
	private final String CLASS_TAG = "SOCKET_NETWORK_PROCESSING";
	
	private final int RECV_HEAD_LEN = 5;
	private final int RECV_TAIL_LEN = 2;
	
	private boolean isContinuePacket = false;
	private Integer packetSeqId;
	private String recvTrCode;
	private String messageCode;
	private String message;
	private byte[] recvData;
	
	CommonLibHandler commHandle = CommonLibHandler.getInstance();
	
	/**
	 * Constructor 
	 * 아래 생성자는 반드시 포함되어야 한다. 
	 */
	public SocketDataNetworkManager() {
		super();
	}
	
	/**
	 * 데이터 요청 메서드
	 * 아래 메서드는 반드시 포함되어야 한다.
	 */
	@Override
	public synchronized void requestData(final String trCode, final DataHandler sendBuf,
			final String otherInfos, final Object objSender, NetReqOptions netReqOptions) {
		
		// 화면에서 네트워크 메시지를 초기화 하지 않은 경우 기본 설정 적용
		if (netReqOptions == null)
			netReqOptions = new NetReqOptions();	// Default option setting
		final NetReqOptions finalNetReqOptions = netReqOptions;
		
		
		// Create & Show progress dialog
		ProgressDialog progressDialog = null;
		
		// 화면에서 네트워크 옵션으로 인디게이터 표시 여부를 보낸다. 
		// 인디게이터 표시 플래그를 설정했을 경우에만 표시
		if (finalNetReqOptions.indicator && progressDialog == null) {
			String indMsg = finalNetReqOptions.indicatorMsg;
			progressDialog = ProgressDialog.show((AbstractActivity)objSender, "", indMsg, true, finalNetReqOptions.cancelable);
			if (indMsg.trim().equals(""))
				progressDialog.setContentView(Utils.getDynamicID(commHandle.getApplicationContext(), "layout", "addon_net_progressnetworkdialoglayout"));
			progressDialog.getWindow().setBackgroundDrawable(new ColorDrawable(0));
			progressDialog.show();
		}
		
		// Put packet data information
		// 요청 패킷 정보 저장
		// 모든 요청 패킷은 저장되며 서버에서 정상적으로 응답 데이터를 수신시 제거된다.
		// @param trCode 전문번호
		// @param otherInfos 기타정보(수신 JS 함수명)
		// @param progressDialog 프로그래스 다이얼로그 (Object)
		// @param objSender 보내는 화면 객체(Object)
		packetSeqId = SocketPacketManager.getInstance().putPacketInfo(trCode, finalNetReqOptions, otherInfos, progressDialog, objSender);
		
		// Start thread for request data
		new Thread() {
            public void run() {
            	
            	try {
            		
            		PLog.i(CLASS_TAG, "////////////////////////////////////////////////////////////////////////////////");
					PLog.i(CLASS_TAG, "// Request Data trCode[" + trCode + "], Options[dummy:" + finalNetReqOptions.dummy + ", encrypt:" + finalNetReqOptions.encrypt + ", indicator:" + finalNetReqOptions.indicator + ", indicatorMsg:" + finalNetReqOptions.indicatorMsg + "], packetSeqId:" + packetSeqId + "]" );
					PLog.i(CLASS_TAG, "////////////////////////////////////////////////////////////////////////////////");
					
					// Initialization
					DataHandler sh, sb, senData;
					sh = sb = senData = null;
					
					// Connect Network
					if (connect() == false) {
						PLog.i(CLASS_TAG, "connect is false.");
						return;
					}
						
					// Convert javascript objects to DataHandler
					// 화면에서 정의한 JSON 형식의 데이터를 서버로 보내기위한 Packet Data로 변환한다.
					sb = SocketPacketManager.getInstance().convertRequestJsonToPacket(sendBuf.getAllString(), ENCODING, (byte)0x00);
					PLog.i(CLASS_TAG, "convertRequestJsonToPacket: " + sb.toString());
					// 화면에서 정의한 JSON 형식의 헤드 데이터를 얻어온다.
					LinkedHashMap<String, Object> headInfoMap = SocketPacketManager.getInstance().getConvertedHeadInfo(sendBuf.getAllString());
					// Must set head length to receive before send data.
					// 수신 받을 고정 헤더 길이를 설정한다. 
					setRecvHeadLen(RECV_HEAD_LEN);
					// Must set tail length to receive before send data if the packet has tail.
					// 수신 받을 고정 꼬리 길이를 설정한다.
					setRecvTailLen(RECV_TAIL_LEN);
					// Making request header
					sh = setRequestHeader(trCode, packetSeqId, headInfoMap, sb);
					PLog.i(CLASS_TAG, "setRequestHeader: " + sh.toString());
					// Making all packet data (HEAD + BODY + TAIL)
					senData = setRequestData(sh, sb, finalNetReqOptions);
					PLog.i(CLASS_TAG, "setRequestData: " + senData.toString());
					// Send data to server
					sendRequest(senData);
					
            	} 
            	catch (Exception e) {
		            Logger.getTraceLog(e);
                    // 다이얼로그 제거
                    SocketPacketManager.getInstance().removeProgressDialog(packetSeqId);
                    
                    // Process error
                    handlingError(LibDefinitions.errstatus.ERROR_INTERNAL_NETWORK, 
                    		Utils.getDynamicID(commHandle.getApplicationContext(), "string", "mp_addon_net_error_msg_internal_network1"));

                    // If sending packet is failed, remove sending failed packet.
                    // 요청이 실패하는 경우 이미 저장된 패킷 정보를 제거한다.
                    SocketPacketManager.getInstance().removePacketInfo(packetSeqId);
                }
            }
		}.start();
					
	}
	
	/**
	 * 요청 헤더 설정
	 * @param trCode 전문코드 
	 * @param packetSeq 패킷 아이디 
	 * @param headInfo 헤더 정보 
	 * @param sendData 요청 데이터 
	 */
	@Override
	public DataHandler setRequestHeader(String trCode, int packetSeq, Map<String, Object> headInfo, DataHandler sendData) throws Exception {
		
		DataHandler sh = new DataHandler(5 + 106, ENCODING);
			
		// Head packet
		// stx
		sh.putByte((byte)0x02);
		
		// Len : PacketData length
		sh.putByte((byte)((106+sendData.length())/256));
	    sh.putByte((byte)((106+sendData.length())%256));

		// attr : 연속 패킷 여부
	    sh.putByte((byte)0x04);
	    
		// seq
	    sh.putByte((byte)0x20);
	    
		// Packet Data
		// cmd : 일반 TR
		// 0x20 : Ticker, 0x2A : Polling, 0x5A : 실시간 요청, 0x5b : 실시간 데이터, 0x40 : 일반TR, 0x5c : 실시간 멀티
	    sh.putByte((byte)0x40);
	    
		// winID(packet sequence number)
	    sh.putInt(packetSeq);
	    
		// Trcode
	    sh.putString(trCode, 5);
		
		// MsgCode1
	    sh.putString("      ", 6);
		
		// Msg
	    sh.putString("                                                                                  ", 82);
		
		// ErrorPos
	    sh.putString("  ", 2);
		
		// MsgCode2Len
	    sh.putString("   ", 3);
		
		// APDataLen
	    sh.putString("   ", 3);
	    
//	    PLog.i(CLASS_TAG, ">> setRequestHeader[" + sh.array() + "], packetSeq["+packetSeq+"]");
	    
	    sh.rewind();
		return sh;
	}
	
	@Override
	public DataHandler setRequestData(DataHandler sh, DataHandler sb, NetReqOptions netReqOptions) throws Exception {
		
		int sLen = sh.length();
		int bLen = sb.length();
		
		DataHandler data = new DataHandler(sLen + bLen + RECV_TAIL_LEN, ENCODING);
		
		// head setting
		data.putBytes(sh.getBytes(sLen));
		
		// body setting
		if (bLen > 0)
			data.putBytes(sb.getBytes(bLen));

	    // tail setting
	    data.putByte((byte)0x03);
	    data.putByte((byte)0x20);
	    
//	    PLog.i(CLASS_TAG, ">> setRequestData[" + new String(data.array()) + "]");
		
	    data.rewind();
		return data;
	}
	
	/**
	 * 수신한 헤드 정보에서 바디 데이터의 길이를 추출한다. 
	 * 이 메서드는 각 서비스에 맞게 반드시 구현되어야 한다.
	 * (헤드 정보는 패킷 요청시 설정한 헤드 수신 고정 길이를 이용하여 추출한다.)
	 * @param _headBytes 헤드 정보
	 */
	@Override
	public int getBodyLen(byte[] _headBytes) {
		int bLen = 0;
		bLen = ByteUtils.toUnsignedChar(_headBytes[1]) * 256 + ByteUtils.toUnsignedChar(_headBytes[2]);
		return bLen;
	}
	
	/**
	 * 응답 데이터 처리
	 * 모든 응답 데이터는 DataHandler 객체 형태로 이 메서드가 받는다.
	 * @param DataHandler 응답 데이터 버퍼
	 */
	@Override
	public void getResponseData(DataHandler rd) {
		System.out.println("getResponseData: " + rd.toString());
		
		// 수신 받은 데이터에서 헤드 정보 추출
		DataHandler rh = getResponseHeader(rd);
		
		// 수신 받은 데이터에서 바디 정보 추출
		DataHandler rb = getResponseBody(rd);
		if (rb == null) 
			return;
		
		String convertedData = null;
		
		// 수신 받은 패킷의 sequence id 정보를 이용하여 요청한 패킷 정보를 추출한다. 
		// 추출한 요청 패킷 정보에는 요청 전문번호, 콜백함수명, 프로그래스 객체, 요청화면 객체등의 정보가 있다. 
		AbstractActivity selectedActivity = (AbstractActivity)SocketPacketManager.getInstance().getCallerObject(this.packetSeqId);
		if (selectedActivity != null) {
			
			// Processing packet received informations
			// Call back function name
			String callBackFunc = (String)SocketPacketManager.getInstance().getCallBackFunctionName(this.packetSeqId);
			
			// Requested network options 
			NetReqOptions networkOptions = (NetReqOptions)SocketPacketManager.getInstance().getNetworkOptions(this.packetSeqId);
			
			// Requested progressDialog
			// 요청시 생성한 프로그래스 다이얼로그(인디게이터)를 제거한다. 
			SocketPacketManager.getInstance().removeProgressDialog(this.packetSeqId);
			
			// If success send/receive data
			if (this.messageCode.equals("000000")) {
				
				try {
					convertedData = SocketPacketManager.getInstance().convertReceivedPacketToJson(rb, networkOptions.receiveDataTemplete, "UTF-8");
				}catch(Exception e) {
					Logger.getTraceLog(e);
					handlingError(selectedActivity , this.recvTrCode, Integer.valueOf(LibDefinitions.errstatus.ERROR_INTERNAL_NETWORK), e.getLocalizedMessage(), networkOptions);
					return;
				}
				
				// Send to the CallerObject data that received from Server
				// 화면으로 전문번호, 콜백함수명, 응답데이터를 리턴한다.
				selectedActivity.responseData(IActivityNetworkable.RESPONSE_DATA_TYPE_SOCKET, this.recvTrCode, callBackFunc, convertedData, networkOptions);
				
			} else {
				handlingError(selectedActivity , this.recvTrCode, Integer.valueOf(this.messageCode), this.message, networkOptions);
			}
			
			// Remove packet information after finish to process received data.
			// 요청 패킷 풀에서 수신한 패킷의 정보를 제거한다.
			SocketPacketManager.getInstance().removePacketInfo(this.packetSeqId);
		} 
		
	}
	@Override
	public DataHandler getResponseHeader(DataHandler rd) {
		// TODO Auto-generated method stub
		
		if (rd.length() >= RECV_HEAD_LEN) {
			
			// Stx (skip)
			rd.skip(1);	
			
			// Body Len
			rd.skip(2);
			//setRecvBodyLen(getBodyLen(rd.getSubBytes(1, 2)));
//			PLog.i(CLASS_TAG, "// SOCKET RESPONSE HEAD DATA LEN[" + rd.length() + "], [" + ByteUtils.toHexString(rd.array()) + "]");
			
			// Attr(연속 패킷 여부)
			byte bContinuePacket = rd.getByte();
			PLog.i(CLASS_TAG, "// SOCKET RESPONSE Attr[" + ByteUtils.toHexString(bContinuePacket) + "], [" + ByteUtils.toHexString((byte)((bContinuePacket) & 0x04)) + "]");
			if ( ((bContinuePacket) & 0x80) == 0x80) {
				PLog.i(CLASS_TAG, "// continue");
				this.isContinuePacket = true;
				
			} else {
				PLog.i(CLASS_TAG, "// no continue");
				this.isContinuePacket = false;
			}
			
			// Seq (skip)
			rd.skip(1);
			
			// 수신 받은 패킷에서 헤드 정보 추출(버퍼 position 변화 없음)
			return new DataHandler(rd.getSubBytes(0, RECV_HEAD_LEN));
		}
		return null;
	}
	
	@Override
	public DataHandler getResponseBody(DataHandler rd) {
		// TODO Auto-generated method stub
		
//		PLog.i(CLASS_TAG, "// SOCKET RESPONSE BODY DATA LEN[" + rd.length() + "], [" + ByteUtils.toHexString(rd.array()) + "]");
		
		byte[] recvData = null;
		int bodyLen = rd.length() - RECV_HEAD_LEN - RECV_TAIL_LEN;
		
		if (rd.length() >= bodyLen) {
			try {
				// cmd : 일반 TR
				// 0x20 : Ticker, 0x2A : Polling, 0x5A : 실시간 요청, 0x5b : 실시간 데이터, 0x40 : 일반TR, 0x5c : 실시간 멀티
				switch(rd.getByte()) {
					case 0x2a:
						PLog.i(CLASS_TAG, "// CTEST SOCKET RESPONSE Polling..");
						DataHandler dh = new DataHandler(rd.array());
						sendRequest(dh);
						return null;
				}
				
				// WinID(Sequence)
				this.packetSeqId = rd.getInt();
				PLog.i(CLASS_TAG, "// SOCKET RESPONSE BODY DATA packetSeqId[" + this.packetSeqId + "], pos[" + rd.getPosition() + "]");
				
				// TrCode
				this.recvTrCode = new String(rd.getBytes(5), ENCODING);
				PLog.i(CLASS_TAG, "// SOCKET RESPONSE BODY DATA trCode[" + this.recvTrCode + "]");
				
				// Msg Code1
				this.messageCode = new String(rd.getBytes(6), ENCODING);
				PLog.i(CLASS_TAG, "// SOCKET RESPONSE BODY DATA messageCode[" + messageCode + "]");
				
				// Msg
				this.message = new String(rd.getBytes(82), ENCODING);
				PLog.i(CLASS_TAG, "// SOCKET RESPONSE BODY DATA message[" + message + "]");
				
				// ErrorPos
				rd.skip(2);
					
				// MsgCode2Len
				rd.skip(3);
					
				// APDataLen
				rd.skip(3);
				
				// Data
				int realDataLen = bodyLen - (1 + 4 + 5 + 6 + 82 + 8);
				recvData = rd.getBytes(realDataLen);
				PLog.i(CLASS_TAG, "// SOCKET RESPONSE BODY DATA LEN[" + bodyLen + "], DATA[" + new String(recvData, ENCODING) + "]");
				
			} catch (UnsupportedEncodingException e) {
				Logger.getTraceLog(e);
			}
			
			return new DataHandler(recvData);
		}
		return null;
	}
	
	/**
	 * 네트워크 에러 처리 <br/>
	 * 화면(Activity)에 에러 메시지를 전달한다.
	 * @param activity 수신 받은 패킷을 전달해야 하는 화면 객체
	 * @param trCode 전문 번호
	 * @param errCode 에러 코드 
	 * @param errMessage 에러 메시지
	 */
	public synchronized void handlingError(final AbstractActivity activity, final String trCode, final int errCode, final String errMessage, final NetReqOptions netReqOpt)
	{
		PLog.i(CLASS_TAG, "// Handling Error trCode[" + trCode + "], errCode[" + errCode + "], errMessage[" + errMessage + "]");
		
		if (activity != null) {
	    	activity.runOnUiThread(new Runnable(){
	            @Override
	            public void run() {
	
	 	        	String code = String.valueOf(errCode);
	 	        	String message = errMessage;
	 	        	
					switch(errCode) {
					case LibDefinitions.errstatus.ERROR_CONNECTION:
					case LibDefinitions.errstatus.ERROR_INTERNAL_NETWORK:
		 	        	if (message == null || message.equals(""))
		 	        		message = activity.getString(R.string.mp_network_connection_error);
		 	        	Toast.makeText(activity, message, Toast.LENGTH_SHORT).show();
		 	        	activity.handlingError(TARGET_SERVER, "-1", code, message, netReqOpt);
		 	        	break;
					case LibDefinitions.errstatus.ERROR_CANT_FIND_NETWORK:
						message = activity.getString(R.string.mp_network_connection_error);
						Toast.makeText(activity, message, Toast.LENGTH_SHORT).show();
						activity.handlingError(TARGET_SERVER, "-1", code, message, netReqOpt);
		 	        	break;
					case LibDefinitions.errstatus.ERROR_RETUREND_SERVER_ERROR:
					default:
						activity.handlingError(TARGET_SERVER, trCode, code, message, netReqOpt);
						break;
					}
		        }
	        });
		}
	}
	
	/**
	 * 내부에서 에러가 리턴 되는 경우
	 * @param errCode 에러 코드 
	 * @param errMessage 에러 메시지
	 */
	@Override
	public void handlingError(int errCode, String errMessage) {
		
		NetReqOptions options = SocketPacketManager.getInstance().getNetworkOptions(this.packetSeqId);
        System.out.println("packetSeqId: " + packetSeqId);
        System.out.println("options: " + options.targetServerName);
		// 내부에서 에러가 리턴되는 경우에는 현재 화면으로 에러 메시지를 전달한다.
		AbstractActivity topAct = (AbstractActivity)ActivityHistoryManager.getInstance().getTopActivity();
		handlingError(topAct, "-1", errCode, errMessage, options);

		// Clear all packet information
		//SocketPacketManager.getInstance().clearAllPacketInfo();
	}
	
	public void handlingError(int errCode, int resId) {
		AbstractActivity topAct = (AbstractActivity)ActivityHistoryManager.getInstance().getTopActivity();
		String strErrMsg = "";
		if (topAct != null) strErrMsg = topAct.getString(resId);
		handlingError(errCode, strErrMsg);
	}
	
	@Override
	public void disconnect() {
		
		// Clear all packet information
		//SocketPacketManager.getInstance().clearAllPacketInfo();
		
		// You must call disconnect method of super below
		super.netDisconnect();
	}
}
