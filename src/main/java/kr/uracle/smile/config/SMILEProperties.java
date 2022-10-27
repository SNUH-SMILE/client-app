package kr.uracle.smile.config;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.NestedConfigurationProperty;
import org.springframework.util.unit.DataSize;

import java.util.HashMap;
import java.util.Map;

/**
 * SMILE 시스템 설정
 */
@ConfigurationProperties(prefix = "smile")
@Getter
@Setter
@ToString
public class SMILEProperties {

    @NestedConfigurationProperty
    private AdminProperties admin = new AdminProperties();

    private DataSourceProperties datasource = new DataSourceProperties();

    /**
     * 스토리지 설정
     */
    private StorageProperties storage = new StorageProperties();

    /**
     * 파일 업로드 설정
     */
    @NestedConfigurationProperty
    private MultipartProperties multipart = new MultipartProperties();

    /**
     * Thread Pool 설정
     */
    @NestedConfigurationProperty
    private ThreadPoolProperties threadPool = new ThreadPoolProperties();

    /**
     * 페이징 처리 설정
     */
    @NestedConfigurationProperty
    private PaginationProperties pagination = new PaginationProperties();
    
    public SMILEProperties() {
    }


    @NoArgsConstructor
    @Getter
    @Setter
    @ToString
    public static class PaginationProperties {
        /**
         * 페이지 별 목록의 항목 수 (기본값: 20)
         */
        private int list = 20;

        /**
         * 페이지 표시 수 (기본값: 10)
         */
        private int page = 10;
    }

    @NoArgsConstructor
    @Getter
    @Setter
    @ToString
    public static class AdminProperties {
        /**
         * 초기 비밀번호 (기본값: '0000')
         */
        private String initialPassword = "0000";
        /**
         * 사용자 IP 획득을 위한 Header 설정
         */
        private String remoteIpHeader;
    }

    @NoArgsConstructor
    @Getter
    @Setter
    @ToString
    public static class ThreadPoolProperties {
        /**
         * 코어 풀 사이즈 (기본값: 시스템 CPU 코어 수)
         */
        private int corePoolSize = (Runtime.getRuntime().availableProcessors());
        /**
         * 최대 풀 사이즈 (기본값: 시스템 CPU 코어 수 * 2)
         */
        private int maxPoolSize = (Runtime.getRuntime().availableProcessors() * 2);
        /**
         * 최대 Queue 수용량 (기본값: 50)
         */
        private int queueCapacity = 50;
    }

    @NoArgsConstructor
    @Getter
    @Setter
    @ToString
    public static class StorageProperties {
        /**
         * NAS 사용 여부
         */
        private boolean nas = false;
        /**
         * UMS 데이터 파일들이 저장되는 스토리지 경로
         */
        private String path = "/data";
        /**
         * UMS에서 사용하는 리소스 경로로 UMS 기동 시 존재하지 않는 디렉토리는 자동으로 생성
         */
        private Map<String, String> resources = new HashMap<>();
    }

    @NoArgsConstructor
    @Getter
    @Setter
    @ToString
    public static class MultipartProperties {
        /**
         * 업로드 파일이 임시 저장될 위치
         */
        private String location = "/tmp";
        /**
         * 최대 단일 파일 크기
         */
        private DataSize maxFileSize = DataSize.ofMegabytes(5);
        /**
         * 최대 HTTP 요청 크기
         */
        private DataSize maxRequestSize = DataSize.ofMegabytes(20);
    }
    
}
