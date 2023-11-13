package classes;

import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.ServletException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.logging.Logger;
import java.util.stream.Collectors;
import jakarta.servlet.annotation.WebServlet;
import java.util.Properties;
import java.io.InputStream;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import com.google.gson.JsonObject;

/**
 * This class writes a json-String from the OpenMeteoWeatherForecastAPI into the file that was used 
 * to recieve Weather Data from OpeneMeteo from Coordinates (latitude and longitude)
 */
@WebServlet("/updateJson")
public class OpenMeteoJsonUpdateServlet extends HttpServlet {

    /**
     * Logger for console output
     */
    private static final Logger LOGGER = Logger.getLogger(OpenMeteoJsonUpdateServlet.class.getName());

    /**
     * Processes POST requests by reading JSON strings from the request body, formatting them and writing them to a file.
     * 
     * @param request   The HttpServletRequest object that represents the POST request. It should contain a json-String in 
     *                  the request body that contains the data required for processing (a Json-String and the origin filename)
     * @param response  The HttpServletResponse object that is used to return a response
     *                  to the client. It is not used directly in this method, but it is required to fulfil the Servlet API convention 
     * @throws ServletException If a server-specific problem occurs
     * @throws IOException If an error occus while reading the config-file or writing to the json-files
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        LOGGER.info("Empfang einer POST-Anfrage");

        String jsonString = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));

        JsonElement jsonElement = JsonParser.parseString(jsonString);
        JsonObject jsonObj = jsonElement.getAsJsonObject();

        jsonString = jsonObj.get("currentData").toString();
        
        jsonString = OpenMeteoJsonFormatter.extractLatestWeatherData(jsonString);

        String filename = jsonObj.get("filename").getAsString();        
         
        LOGGER.info("JSON-String vor dekoding " + jsonString);

        jsonElement = JsonParser.parseString(jsonString);
        Gson gson = new Gson();
        String decodedJson = gson.toJson(jsonElement);
        
        Properties prop = new Properties();
        String path;

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

        path = path + "web/data/openMeteoData/" + filename; 
        LOGGER.info("Pfad zur JSON-Datei: " + path);

        try {            
            Files.write(Paths.get(path), decodedJson.getBytes());
            LOGGER.info("JSON-String wurde in die Datei geschrieben: " + decodedJson);
        } catch (IOException e) {
            LOGGER.severe("Fehler beim Schreiben in die Datei: " + e.getMessage());
        }
    }
    
   
}


