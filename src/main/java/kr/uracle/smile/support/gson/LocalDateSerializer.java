package kr.uracle.smile.support.gson;

import com.google.gson.*;
import org.springframework.util.StringUtils;

import java.lang.reflect.Type;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

public class LocalDateSerializer implements JsonSerializer<LocalDate>, JsonDeserializer<LocalDate> {

    private final DateTimeFormatter formatter;


    public LocalDateSerializer() {
        this("yyyy-MM-dd");
    }

    public LocalDateSerializer(String pattern) {
        this.formatter = DateTimeFormatter.ofPattern(pattern);
    }

    @Override
    public JsonElement serialize(LocalDate date, Type type, JsonSerializationContext context) {
        return new JsonPrimitive(formatter.format(date));
    }

    @Override
    public LocalDate deserialize(JsonElement json, Type type, JsonDeserializationContext context) throws JsonParseException {
        String value = json.getAsString();
        try {
            return StringUtils.hasText(value) ? LocalDate.parse(value, formatter) : null;
        } catch (DateTimeParseException e) {
            return null;
        }
    }
}
