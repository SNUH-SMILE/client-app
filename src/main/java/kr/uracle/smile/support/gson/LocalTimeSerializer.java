package kr.uracle.smile.support.gson;

import com.google.gson.*;
import org.springframework.util.StringUtils;

import java.lang.reflect.Type;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

public class LocalTimeSerializer implements JsonSerializer<LocalTime>, JsonDeserializer<LocalTime> {

    private final DateTimeFormatter formatter;

    public LocalTimeSerializer() {
        this("HH:mm:ss");
    }

    public LocalTimeSerializer(String pattern) {
        this.formatter = DateTimeFormatter.ofPattern(pattern);
    }

    @Override
    public JsonElement serialize(LocalTime time, Type type, JsonSerializationContext context) {
        return new JsonPrimitive(time.format(formatter));
    }

    @Override
    public LocalTime deserialize(JsonElement json, Type type, JsonDeserializationContext context) throws JsonParseException {
        String value = json.getAsString();
        try {
            return StringUtils.hasText(value) ? LocalTime.parse(value, formatter) : null;
        } catch (DateTimeParseException e) {
            return null;
        }
    }
}
