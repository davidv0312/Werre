package classes;

import com.google.gson.Gson;
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
            List<List<Double>> stationCoordinates = new ArrayList<List<Double>>();
            for (File child : directoryListing) {
                HashMap<String, String> json = gson.fromJson(new FileReader(child), HashMap.class);
                double longitude = Double.parseDouble(json.get("longitude"));
                double latitude = Double.parseDouble(json.get("latitude"));

                List<Double> coord = List.of(longitude, latitude);
                stationCoordinates.add(coord);

            }

            BowyerWatson.triangulate(stationCoordinates);

        } else {
            LOGGER.severe("Fehler beim Laden der Messpunkte");
        }

        //response.setContentType("application/json");      
        //PrintWriter out = response.getWriter();  
        //out.print(polygon.toGeoJson());
        //out.flush();
    }
}
