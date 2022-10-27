package kr.uracle.smile;

import kr.uracle.smile.module.authentication.AdminAuthenticationHandler;

public final class SMILEAttributes {

    /**
     * 로그인 된 사용자의 메뉴 트리를 Cache 하기 위한 Session Key
     * @see AdminAuthenticationHandler
     */
    public static final String MENU_TREE_ATTRIBUTE = "UMS_MENU_TREE";

    /**
     * 메뉴를 기본으로 활성화 하기 위해 현재 메뉴 위치 저장을 위한 Session Key
     */
    public static final String CURRENT_MENU_ATTRIBUTE = "UMS_CURRENT_MENU";

    /**
     * UMS 임시폴더 경로를 저장하는 Key
     */
    public static final String TEMPORARY_RESOURCE_KEY = "temporary";

    /**
     * UMS 발송대상 CSV 경로를 저장하는 Key
     */
    public static final String SEND_DATA_RESOURCE_KEY = "data";

    /**
     * UMS 발송 이미지 경로를 저장하는 Key
     */
    public static final String SEND_IMAGE_RESOURCE_KEY = "send-image";

    /**
     * UMS 템플릿 이미지 경로를 저장하는 Key
     */
    public static final String TEMPLATE_IMAGE_RESOURCE_KEY = "template-image";


    /**
     * Constants 를 위한 클래스로 인스턴스화가 되지 않도록 차단
     */
    private SMILEAttributes() {
    }
}
