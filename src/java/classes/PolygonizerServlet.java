package classes;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.stream.JsonReader;
import com.google.gson.reflect.TypeToken;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.logging.Logger;
import org.locationtech.jts.geom.Coordinate;
import java.net.HttpURLConnection;
import java.net.URL;

@WebServlet("/getPolygons")
public class PolygonizerServlet extends HttpServlet {

    private static final Logger LOGGER = Logger.getLogger(OpenMeteoJsonUpdateServlet.class.getName());

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();

        Properties prop = new Properties();
        String path;

        //load Config for users filepath
        try (InputStream input = getClass().getClassLoader().getResourceAsStream("config.properties")) {
            if (input == null) {
                LOGGER.severe("Konfigurationsdatei 'config.properties' konnte nicht gefunden werden");
                return;
            }
            prop.load(input);
            path = prop.getProperty("dataFilePath");
        } catch (IOException ex) {
            LOGGER.severe("Fehler beim Laden der Konfigurationsdatei: " + ex.getMessage());
            return;
        }

        //iterate over each measuring station
        File dir = new File(path + "web/data/openMeteoData/");
        File[] directoryListing = dir.listFiles();
        if (directoryListing != null) {

            //read through all mp-files and extract coordinates
            List<Coordinate> stationCoordinates = new ArrayList<>();
            for (File child : directoryListing) {

                JsonReader jsonReader = new JsonReader(new FileReader(child.getAbsolutePath()));
                JsonElement jsonElement = JsonParser.parseReader(jsonReader);
                JsonObject stationJSON = jsonElement.getAsJsonObject();

                double longitude = stationJSON.get("longitude").getAsDouble();
                double latitude = stationJSON.get("latitude").getAsDouble();

                Coordinate coordinate = new Coordinate(longitude, latitude);

                stationCoordinates.add(coordinate);
            }

            LOGGER.info(stationCoordinates.toString());
            List<Coordinate> triangulation = BowyerWatson.triangulate(stationCoordinates);

            for (int i = 0; i < triangulation.size(); i += 4) {
                Coordinate v1 = triangulation.get(i);
                Coordinate v2 = triangulation.get(i + 1);
                Coordinate v3 = triangulation.get(i + 2);

                List<Double> v1_list = List.of(v1.x, v1.y);
                List<Double> v2_list = List.of(v2.x, v2.y);
                List<Double> v3_list = List.of(v3.x, v3.y);

                String url = "blah";
                String json = fetchJsonData(url);
                List<Double[]> temperatures = extractTemperatures(json);

                Double[] temps1 = temperatures.get(0);
                Double[] temps2 = temperatures.get(1);
                Double[] temps3 = temperatures.get(2);

                String[] dates = extractDates(json);
                
                for(int j=0; j<dates.length; j++){
                    double avgTemp = (temps1[j] + temps2[j] + temps3[j])/3.0;
                    Polygon polygon = new Polygon(List.of(v1_list, v2_list, v3_list), avgTemp ,dates[j]);
                    String polygonPath = path + "web/data/polygons/polygon%d_%s.geojson";
                    polygon.saveGeoJsonFile(String.format(polygonPath, i / 4, dates[j]));
                }
                
                

                

            }

        } else {
            LOGGER.severe("Fehler beim Laden der Messpunkte");
        }
    }

    private static String fetchJsonData(String jsonUrl) throws IOException {
        // Read JSON data from the URL
        StringBuilder result = new StringBuilder();
        URL url = new URL(jsonUrl);

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(url.openStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                result.append(line);
            }
        }

        return result.toString();
    }

    private static List<Double[]> extractTemperatures(String jsonString) {
        // Parse JSON and extract temperatures using Gson
        Gson gson = new Gson();
        JsonArray locationsArray = gson.fromJson(jsonString, JsonArray.class);

        List<Double[]> temperaturesList = new ArrayList<>();

        for (JsonElement locationElement : locationsArray) {
            JsonObject locationObject = locationElement.getAsJsonObject();
            JsonArray dailyArray = locationObject.getAsJsonObject("daily").getAsJsonArray("temperature_2m_max");

            Double[] temperatures = gson.fromJson(dailyArray, Double[].class);
            temperaturesList.add(temperatures);
        }

        return temperaturesList;
    }

    private static String[] extractDates(String jsonString) {
        // Parse JSON and extract temperatures using Gson
        Gson gson = new Gson();
        JsonArray locationsArray = gson.fromJson(jsonString, JsonArray.class);

        List<Double[]> temperaturesList = new ArrayList<>();

        JsonElement locationElement = locationsArray.get(0);
        JsonObject locationObject = locationElement.getAsJsonObject();
        JsonArray dailyArray = locationObject.getAsJsonObject("daily").getAsJsonArray("time");

        String[] dates = gson.fromJson(dailyArray, String[].class);

        return dates;
    }
}
