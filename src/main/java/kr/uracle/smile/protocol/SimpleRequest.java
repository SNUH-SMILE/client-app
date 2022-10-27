package kr.uracle.smile.protocol;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;

public class SimpleRequest {
    @Getter
    @Setter
    public static class Index {
        @NotNull
        private Long id;
    }

    @Getter
    @Setter
    public static class ListIndex {
        @NotNull
        @NotEmpty
        private List<Long> ids;
    }

    @Getter
    @Setter
    public static class StringIndex {
        @NotBlank
        private String id;
    }

    @Getter
    @Setter
    public static class ListStringIndex {
        @NotEmpty
        private List<String> ids;
    }
    
    @Getter
    @Setter
    public static class Name {
        @NotBlank
        private String name;
    }
}
