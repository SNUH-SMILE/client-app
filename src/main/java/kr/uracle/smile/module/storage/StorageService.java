package kr.uracle.smile.module.storage;

import kr.uracle.smile.config.SMILEProperties;
import kr.uracle.smile.config.SMILEProperties.StorageProperties;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;
import org.springframework.util.FileCopyUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

import static kr.uracle.smile.SMILEAttributes.TEMPORARY_RESOURCE_KEY;

/**
 * UMS 저장소 안의 리소스 핸들 획득을 위한 공용 컴포넌트
 */
@Component
public class StorageService {
    private final StorageProperties properties;
    private final ResourceLoader resourceLoader;
    private final String tempDir;


    public StorageService(SMILEProperties properties, ResourceLoader resourceLoader) {
        this.properties = properties.getStorage();
        this.resourceLoader = resourceLoader;

        // 임시 폴더 경로가 지정되지 않은 경우 기본값 지정
        this.properties.getResources().putIfAbsent(TEMPORARY_RESOURCE_KEY, "/tmp");
        this.tempDir = StringUtils.trimTrailingCharacter(
                this.properties.getResources().get(TEMPORARY_RESOURCE_KEY), '/');
    }

    /**
     * Spring Context 초기화 후 리소스 폴더 경로 점검 및 자동 생성
     */
    @EventListener(ContextRefreshedEvent.class)
    public void init() {
        this.properties.getResources().values().stream()
                .map(this::getResource)
                .filter(resource -> !resource.exists())
                .map(resource -> {
                    try {
                        return resource.getFile();
                    } catch (IOException e) {
                        throw new UncheckedIOException(e);
                    }
                })
                .forEach(File::mkdirs);
    }

    /**
     * UMSProperties 내 ums.storage.resources 에 미리 지정된 Resource Key를 이용하여 리소스 핸들을 반환
     * @param resourceKey 리소스 경로에 대한 Key
     * @param location 리소스 경로
     * @return Resource
     */
    public Resource getResource(String resourceKey, String location) {
        String path = this.properties.getResources().get(resourceKey);
        if(path == null) {
            return getResource(location);
        } else {
            return getResource(String.format("%s/%s", StringUtils.trimTrailingCharacter(path, '/'),
                    StringUtils.trimLeadingCharacter(location, '/')));
        }
    }

    /**
     * 지정된 리소스 위치에 대한 리소스 핸들을 반환
     * @param location 리소스 경로
     * @return Resource
     */
    public Resource getResource(String location) {
        if(location.contains(":")) {
            return this.resourceLoader.getResource(location);
        } else if(location.startsWith(properties.getPath())) {
            location = location.substring(properties.getPath().length());
        }

        return this.resourceLoader.getResource("msp:" + location);
    }

    /**
     * 임시 폴더 내 지정된 위치에 대한 리소스 핸들을 반환
     * @param location 리소스 경로
     * @return Resource
     */
    public Resource getResourceFromTemp(String location) {
        return getResource(String.format("%s/%s", tempDir, StringUtils.trimLeadingCharacter(location, '/')));
    }

    /**
     * 리소스의 절대경로 조회
     * @param resource 리소스
     * @return 절대경로
     */
    public String getAbsolutePath(Resource resource) {
        try {
            return StringUtils.cleanPath(resource.getFile().getAbsolutePath());
        } catch (Exception ignored) {
        }
        return null;
    }

    /**
     * 임의의 파일명으로 리소스 Key에 해당하는 경로에 리소스 핸들 반환
     * @param resourceKey 저장소 리소스 Key
     * @param filenameExtension 저장될 파일 확장자
     * @return 저장소 리소스, 실패 시 NULL 반환
     */
    public Resource create(String resourceKey, String filenameExtension) {
        return getResource(resourceKey, createFilename(filenameExtension));
    }

    /**
     * Multipart File을 지정된 파일명으로 리소스 Key에 해당하는 경로로 전송
     * @param resourceKey 저장소 리소스 Key
     * @param filename 저장될 파일명
     * @param multipartFile MultipartFile
     * @return 저장소 리소스, 실패 시 NULL 반환
     */
    public Resource transferTo(String resourceKey, String filename, MultipartFile multipartFile) {
        if(multipartFile == null || multipartFile.isEmpty()) {
            return null;
        }
        Resource target = getResource(resourceKey, filename);
        try {
            multipartFile.transferTo(target.getFile());
        } catch (IOException e) {
            return null;
        }
        return target;
    }

    /**
     * Multipart File을 임의의 파일명으로 리소스 Key에 해당하는 경로로 전송
     * @param resourceKey 저장소 리소스 Key
     * @param multipartFile MultipartFile
     * @return 저장소 리소스, 실패 시 NULL 반환
     */
    public Resource transferTo(String resourceKey, MultipartFile multipartFile) {
        if(multipartFile == null || multipartFile.isEmpty()) {
            return null;
        }
        String filename = createFilename(StringUtils.getFilenameExtension(StringUtils.cleanPath(multipartFile.getOriginalFilename())));
        return transferTo(resourceKey, filename, multipartFile);
    }

    /**
     * Multipart File을 임의의 파일명으로 임시 폴더에 전송
     * @param multipartFile Multipart File
     * @return 저장소 리소스, 실패 시 NULL 반환
     */
    public Resource transferToTemp(MultipartFile multipartFile) {
        return transferTo(TEMPORARY_RESOURCE_KEY, multipartFile);
    }

    /**
     * 원본 리소스를 지정된 파일명으로 리소스 Key에 해당하는 경로로 전송
     * @param resourceKey 저장소 리소스 Key
     * @param filename 파일명
     * @param source 원본 리소스
     * @return 저장소 리소스, 실패 시 NULL 반환
     */
    public Resource transferTo(String resourceKey, String filename, Resource source) {
        if(source == null || !source.exists()) {
            return null;
        }
        Resource target = getResource(resourceKey, filename);
        try {
            File sourceFile = source.getFile();
            FileCopyUtils.copy(sourceFile, target.getFile());
            sourceFile.delete();
        } catch (IOException e) {
            return null;
        }
        return target;
    }

    /**
     * 원본 리소스를 임의의 파일명으로 리소스 Key에 해당하는 경로로 전송
     * @param resourceKey 저장소 리소스 Key
     * @param source 원본 리소스
     * @return 저장소 리소스, 실패 시 NULL 반환
     */
    public Resource transferTo(String resourceKey, Resource source) {
        if(source == null || !source.exists()) {
            return null;
        }
        String filename = createFilename(StringUtils.getFilenameExtension(StringUtils.cleanPath(source.getFilename())));
        return transferTo(resourceKey, filename, source);
    }

    /**
     * 원본 리소스를 임의의 파일명으로 임시 폴더에 전송
     * @param resource 원본 리소스
     * @return 저장소 리소스, 실패 시 NULL 반환
     */
    public Resource transferToTemp(Resource resource) {
        return transferTo(TEMPORARY_RESOURCE_KEY, resource);
    }

    /**
     * 임의의 파일명 생성
     * @param filenameExtension 파일 확장자
     * @return 파일명
     */
    private String createFilename(String filenameExtension) {
        String uuid = UUID.randomUUID().toString().replace("-", "");
        String filename = String.format("%s_%s", LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")), uuid);

        return StringUtils.hasText(filenameExtension) ? String.format("%s.%s", filename, filenameExtension) : filename;
    }

    /**
     * 리소스 Key에 해당하는 경로에서 해당 location의 파일을 삭제
     * @param resourceKey 리소스 Key
     * @param locations 삭제 대상 경로
     * @return 삭제된 파일 수
     */
    public int delete(String resourceKey, String ...locations) {
        int affected = 0;
        for(String location : locations) {
            try {
                Resource resource = getResource(resourceKey, location);
                File file = resource.getFile();
                if(file.exists() && file.isFile() && file.delete()) {
                    affected += 1;
                }
            } catch (IOException ignored) {}
        }
        return affected;
    }

    /**
     * Resource에 해당하는 파일 삭제
     * @param resources 리소스
     * @return 삭제된 파일 수
     */
    public int delete(Resource ...resources) {
        int affected = 0;
        for(Resource resource : resources) {
            try {
                File file = resource.getFile();
                if(file.exists() && file.isFile() && file.delete()) {
                    affected += 1;
                }
            } catch (IOException ignored) {}
        }
        return affected;
    }

    /**
     * 임시 폴더 내에서 해당 location의 파일을 삭제
     * @param location 파일 경로
     * @return 삭제된 파일 수
     */
    public int deleteFromTemp(String ...location) {
        return delete(TEMPORARY_RESOURCE_KEY, location);
    }
}
