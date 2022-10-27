package kr.uracle.smile.module.exception;

/**
 * 공백이 포함된 파라미터값 입력 오류
 */
public class BlankContainParameterException extends RuntimeException{
	public BlankContainParameterException(String paramField) {
		super(paramField);
	}
}
