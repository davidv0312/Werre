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

@WebServlet("/updateJson")
public class JsonUpdateServlet extends HttpServlet {

    private static final Logger LOGGER = Logger.getLogger(JsonUpdateServlet.class.getName());

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        LOGGER.info("Empfang einer POST-Anfrage");

        String jsonString = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
        LOGGER.info("Empfangener JSON-String: " + jsonString);   
        
        Properties prop = new Properties();
        String path;

        try (InputStream input = getClass().getClassLoader().getResourceAsStream("config.properties")) {
            if (input == null) {
                LOGGER.severe("Konfigurationsdatei 'config.properties' konnte nicht gefunden werden");
                return;
            }

            // Laden der Konfigurationsdatei
            prop.load(input);

            // Lesen des Pfades aus der Konfigurationsdatei
            path = prop.getProperty("dataFilePath");
        } catch (IOException ex) {
            LOGGER.severe("Fehler beim Laden der Konfigurationsdatei: " + ex.getMessage());
            return;
        }        

        path = path + "web/data/openMeteoData/mp1.json"; 
        LOGGER.info("Pfad zur JSON-Datei: " + path);

        try {
            // Schreiben in die Datei
            Files.write(Paths.get(path), jsonString.getBytes());
            LOGGER.info("JSON-String wurde in die Datei geschrieben: " + jsonString);
        } catch (IOException e) {
            LOGGER.severe("Fehler beim Schreiben in die Datei: " + e.getMessage());
        }
    }

}


