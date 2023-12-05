package classes;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class Polygon {

    private List<List<Double>> coordinates;

    public Polygon(List<List<Double>> coordinates) {
        this.coordinates = coordinates;
    }

    public List<List<Double>> getCoordinates() {
        return coordinates;
    }

    public void setCoordinates(List<List<Double>> coordinates) {
        this.coordinates = coordinates;
    }

    public String toGeoJson() {
        JsonObject geoJson = new JsonObject();
        geoJson.addProperty("type", "Polygon");

        JsonArray coordinatesArray = new JsonArray();
        coordinatesArray.add(createJsonArray(coordinates));

        geoJson.add("coordinates", coordinatesArray);

        return new Gson().toJson(geoJson);
    }

    private JsonArray createJsonArray(List<List<Double>> points) {
        JsonArray jsonArray = new JsonArray();
        for (List<Double> point : points) {
            JsonArray pointArray = new JsonArray();
            for (Double coord : point) {
                pointArray.add(coord);
            }
            jsonArray.add(pointArray);
        }
        return jsonArray;
    }

    public void saveGeoJsonFile(String path) {
        String jsonString = this.toGeoJson();

        // Gson instance
        Gson gson = new Gson();

        try (FileWriter writer = new FileWriter(path)) {
            // Parse JSON and write to file
            gson.toJson(gson.fromJson(jsonString, Object.class), writer);

            System.out.println("JSON saved to file successfully.");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
