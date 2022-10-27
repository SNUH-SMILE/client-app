package kr.uracle.smile.support.mybatis.type;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;

public class MaskingTypeHandler extends BaseTypeHandler<String> {

    public MaskingTypeHandler() {
    }

	@Override
	public void setNonNullParameter(PreparedStatement ps, int i, String parameter, JdbcType jdbcType) throws SQLException {
		ps.setString(i, parameter);
	}

	@Override
	public String getNullableResult(ResultSet rs, String columnName) throws SQLException {
		String result = null;
		
		if(!columnName.contains("OPEN")) {
			if(columnName.contains("NAME")) {
				result = rs.getString(columnName)==null ? null : maskingName(rs.getString(columnName));
			}else if(columnName.contains("MOBILE")) {
				result = rs.getString(columnName)==null ? null : maskingMobile(rs.getString(columnName));
			}
		}else {
			result = rs.getString(columnName);
		}
		
		return result;
	}

	@Override
	public String getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
		return rs.getString(columnIndex);
	}

	@Override
	public String getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
		return cs.getString(columnIndex);
	}
	
	
	/**
     * 이름 마스킹 적용(가운데 글자 마스킹)
     */
    private String maskingName(String name) {
    	
    	int length = name.length();
    	
    	if(length < 2){
    		return name;
    	}
    	
    	String middleMask = "";
		if(length > 2) {
			middleMask = name.substring(1, length - 1);
		} else {	// 이름이 외자
			middleMask = name.substring(1, length);
		}
		
		String dot = "";
		for(int i = 0; i<middleMask.length(); i++) {
			dot += "*";
		}
		
		if(length > 2) {
			return name.substring(0, 1)
					+ middleMask.replace(middleMask, dot)
					+ name.substring(length-1, length);
		} else { // 이름이 외자 마스킹 리턴
			return name.substring(0, 1)
					+ middleMask.replace(middleMask, dot);
		}
		
    }
    
	/**
     * 한글 이름 마스킹 적용(가운데 글자 마스킹)
     */
    private String maskingKoreaName(String name) {
    	// 한글만 (영어, 숫자 포함 이름은 제외)
    	String regex = "(^[가-힣]+)$";
    	
    	Matcher matcher = Pattern.compile(regex).matcher(name);
    	if(matcher.find()) {
    		int length = name.length();
    		
    		String middleMask = "";
    		if(length > 2) {
    			middleMask = name.substring(1, length - 1);
    		} else {	// 이름이 외자
    			middleMask = name.substring(1, length);
    		}
    		
    		String dot = "";
    		for(int i = 0; i<middleMask.length(); i++) {
    			dot += "*";
    		}
    		
    		if(length > 2) {
    			return name.substring(0, 1)
    					+ middleMask.replace(middleMask, dot)
    					+ name.substring(length-1, length);
    		} else { // 이름이 외자 마스킹 리턴
    			return name.substring(0, 1)
    					+ middleMask.replace(middleMask, dot);
    		}
    	}
    	return name;
    	
    }
    
	/**
     * 휴대전화번호 마스킹 적용(가운데 숫자 마스킹)
     */
    private String maskingMobile(String mobile) {
    	
    	mobile = mobile.replaceAll("[^0-9]",""); // 숫자만 추출
    	
    	if(mobile.length() == 10){
            return mobile.substring(0, 3) + "****" + mobile.substring(6, 10);
        }else if(mobile.length() == 11){
            return mobile.substring(0, 3) + "****" + mobile.substring(7, 11);
        }else {
        	return "";
        }
    }
    
    /**
     * 이메일 마스킹(앞3자리 이후 '@'전까지 마스킹)
     */
    private String maskingEmail(String email) {
    	String regex = "\\b(\\s+)+@(\\s+.\\s+)";
    	
    	Matcher matcher = Pattern.compile(regex).matcher(email);
    	if(matcher.find()) {
    		String target = matcher.group(1);
    		int length = target.length();
    		if(length > 3) {
    			char[] c = new char[length - 3];
    			Arrays.fill(c, '*');
    			
    			return email.replace(target, target.substring(0, 3) + String.valueOf(c));
    		}
    	}
    	return email;
    }
    
    /**
     * 계좌번호 마스킹
     */
    private String maskingAccountNo(String accountNo) {
        String regex = "(^[0-9]+)$";
    	
    	Matcher matcher = Pattern.compile(regex).matcher(accountNo);
    	if(matcher.find()) {
    		int length = accountNo.length();
    		if(length > 5) {
    			char[] c = new char[5];
    			Arrays.fill(c, '*');
    			
    			return accountNo.replace(accountNo, accountNo.substring(0, length-5) + String.valueOf(c));
    		}
    	}
    	return accountNo;
    }
    
    /**
     * 생년월일 마스킹
     */
    private String maskingBirthday(String birthday) {
    	String regex = "^((19|20)\\d\\d)?([-/.])?(0[1-9]|1[012])([-/.])?(0[1-9]|[12][0-9]|3[01])$";
    	
    	Matcher matcher = Pattern.compile(regex).matcher(birthday);
    	if(matcher.find()) {
    		return birthday.replace("[0-9]", "*");
    	}
    	return birthday;
    }
    
    /**
     * 카드번호 마스킹
     */
    private String maskingCardNo(String cardNo) {
    	String regex = "(\\d{4})-?(\\d{4})-?(\\d{4})-?(\\d{3,4})$";
    	
    	Matcher matcher = Pattern.compile(regex).matcher(cardNo);
    	if(matcher.find()) {
    		String target = matcher.group(2) + matcher.group(3);
    		int length = target.length();
    		char[] c = new char[length];
    		Arrays.fill(c, '*');
    		
    		return cardNo.replace(target, String.valueOf(c));
    	}
    	return cardNo;
    }
    
    /**
     * 카드번호 마스킹
     */
    private String maskingAddress(String address) {
    	// 신(구)주소, 도로명 주소
    	String regex = "(([가-힣]+(\\d{1,5}|\\d{1,5}(,|.)\\d{1,5}|)+(읍|면|동|가|리))(^구|)((\\d{1,5}(~|-)\\d{1,5}|\\d{1,5})(가|리|)|))([ ](산(\\d{1,5}(~|-)\\d{1,5}|\\d{1,5}))|)|";
    	String newRegx = "(([가-힣]|(\\d{1,5}(~|-)\\d{1,5})|\\d{1,5})+(로|길))";
    	
    	Matcher matcher = Pattern.compile(regex).matcher(address);
    	Matcher newMatcher = Pattern.compile(newRegx).matcher(address);
    	if(matcher.find()) {
    		return address.replaceAll("[0-9]", "*");
    	} else if(newMatcher.find()) {
    		return address.replaceAll("[0-9]", "*");
    	}
    	return address;
    }

}
