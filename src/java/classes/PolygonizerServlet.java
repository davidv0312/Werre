package classes;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.stream.JsonReader;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Properties;
import java.util.logging.Logger;
import org.locationtech.jts.geom.Coordinate;

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

            for(int i=0; i<triangulation.size(); i+=3){
                Coordinate v1 = triangulation.get(i);
                Coordinate v2 = triangulation.get(i+1);
                Coordinate v3 = triangulation.get(i+2);
                
                List<Double> v1_list = List.of(v1.x, v1.y);
                List<Double> v2_list = List.of(v2.x, v2.y);
                List<Double> v3_list = List.of(v3.x, v3.y);
                 
                Polygon polygon = new Polygon(List.of(v1_list, v2_list, v3_list));
                
                String polygonPath = path + "web/data/polygons/polygon%d.geojson";
                polygon.saveGeoJsonFile(String.format(polygonPath, i/3));
                //response.setContentType("application/json");  
                //PrintWriter out = response.getWriter();  
                //out.print(polygon.toGeoJson());
                //out.flush();
            }

        } else {
            LOGGER.severe("Fehler beim Laden der Messpunkte");
        }
    }
}
