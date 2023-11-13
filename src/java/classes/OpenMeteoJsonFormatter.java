
package classes;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

public class OpenMeteoJsonFormatter {

    public static String extractLatestWeatherData(String jsonData) {
        JsonObject jsonObject = JsonParser.parseString(jsonData).getAsJsonObject();

        double longitude = jsonObject.get("longitude").getAsDouble();
        double latitude = jsonObject.get("latitude").getAsDouble();
        JsonObject hourly = jsonObject.getAsJsonObject("hourly");

        ZoneId zoneId = ZoneId.of(jsonObject.get("timezone").getAsString());
        LocalDateTime now = LocalDateTime.now(zoneId);
        LocalDateTime relevantHour;
        if (now.getMinute() > 0) {
            relevantHour = now.withMinute(0).withSecond(0).withNano(0);
        } else {
            relevantHour = now.minusHours(1).withMinute(0).withSecond(0).withNano(0);
        }
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm", Locale.GERMANY);
        String relevantHourString = relevantHour.format(formatter);

        int indexRelevantHour = -1;
        for (int i = 0; i < hourly.getAsJsonArray("time").size(); i++) {
            if (hourly.getAsJsonArray("time").get(i).getAsString().startsWith(relevantHourString)) {
                indexRelevantHour = i;
                break;
            }
        }

        JsonObject newJsonObject = new JsonObject();
        newJsonObject.addProperty("longitude", longitude);
        newJsonObject.addProperty("latitude", latitude);

        if (indexRelevantHour != -1) {
            String time = hourly.getAsJsonArray("time").get(indexRelevantHour).getAsString();
            double temp = hourly.getAsJsonArray("temperature_2m").get(indexRelevantHour).getAsDouble();
            double soilTemp0cm = hourly.getAsJsonArray("soil_temperature_0cm").get(indexRelevantHour).getAsDouble();
            double soilTemp6cm = hourly.getAsJsonArray("soil_temperature_6cm").get(indexRelevantHour).getAsDouble();
            double soilTemp18cm = hourly.getAsJsonArray("soil_temperature_18cm").get(indexRelevantHour).getAsDouble();
            double soilTemp54cm = hourly.getAsJsonArray("soil_temperature_54cm").get(indexRelevantHour).getAsDouble();

            newJsonObject.addProperty("time", time);
            newJsonObject.addProperty("temp", temp);
            newJsonObject.addProperty("soil_temperature_0cm", soilTemp0cm);
            newJsonObject.addProperty("soil_temperature_6cm", soilTemp6cm);
            newJsonObject.addProperty("soil_temperature_18cm", soilTemp18cm);
            newJsonObject.addProperty("soil_temperature_54cm", soilTemp54cm);
        } else {
            newJsonObject.addProperty("error", "Keine Daten vorhanden");
        }

        return newJsonObject.toString();
    }
}



