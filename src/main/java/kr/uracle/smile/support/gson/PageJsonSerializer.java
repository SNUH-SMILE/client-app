package kr.uracle.smile.support.gson;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;
import kr.uracle.smile.support.mybatis.Page;

import java.lang.reflect.Type;

/**
 * 페이징 결과에 대한 JsonSerializer
 * @author Minki,Cho
 */
public class PageJsonSerializer implements JsonSerializer<Page> {
    @Override
    public JsonElement serialize(Page page, Type type, JsonSerializationContext context) {
        final JsonObject object = new JsonObject();

        if(page instanceof Page) {
            JsonElement pagination = context.serialize(((Page)page).getPagination());
            object.add("pagination", pagination);
            object.addProperty("paginationSize", ((Page) page).getPaginationSize());
        }

        object.addProperty("page", page.getNumber());
        object.addProperty("size", page.getSize());
        object.addProperty("pageSize", page.getPageSize());
        object.addProperty("previous", page.hasPrevious());
        object.addProperty("next", page.hasNext());
        object.addProperty("totalElements", page.getTotalElements());
        object.addProperty("totalPages", page.getTotalPages());

        JsonElement content = context.serialize(page.getContent());
        object.add("content", content);

        return object;
    }
}

