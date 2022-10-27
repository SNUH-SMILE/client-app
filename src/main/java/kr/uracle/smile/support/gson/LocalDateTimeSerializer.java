package kr.uracle.smile.support.gson;

import com.google.gson.*;
import org.springframework.util.StringUtils;

import java.lang.reflect.Type;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

public class LocalDateTimeSerializer implements JsonSerializer<LocalDateTime>, JsonDeserializer<LocalDateTime> {
    private final DateTimeFormatter formatter;

    public LocalDateTimeSerializer() {
        this("yyyy-MM-dd HH:mm:ss");
    }

    public LocalDateTimeSerializer(String pattern) {
        this.formatter = DateTimeFormatter.ofPattern(pattern);
    }

    @Override
    public JsonElement serialize(LocalDateTime datetime, Type type, JsonSerializationContext context) {
        return new JsonPrimitive(formatter.format(datetime));
    }

    @Override
    public LocalDateTime deserialize(JsonElement element, Type type,
                                     JsonDeserializationContext context) throws JsonParseException {
        String value = element.getAsString();
        if(value.length() > 19) {
            value = value.substring(0, 19);
        }
        try {
            return StringUtils.hasText(value) ? LocalDateTime.parse(value, formatter) : null;
        } catch (DateTimeParseException e) {
            return null;
        }
    }
}
