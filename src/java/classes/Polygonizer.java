package classes;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

@WebServlet("/getPolygons")
public class Polygonizer extends HttpServlet {
    
    private static final Logger LOGGER = Logger.getLogger(OpenMeteoJsonUpdateServlet.class.getName());    
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        
        List<List<Double>> polygonCoordinates = new ArrayList<>();
        polygonCoordinates.add(List.of(0.0, 0.0));
        polygonCoordinates.add(List.of(0.0, 1.0));
        polygonCoordinates.add(List.of(1.0, 1.0));
        polygonCoordinates.add(List.of(1.0, 0.0));
        polygonCoordinates.add(List.of(0.0, 0.0));
        Polygon polygon = new Polygon(polygonCoordinates);
        
        response.setContentType("application/json");      
        PrintWriter out = response.getWriter();  
        out.print(polygon.toGeoJson());
        out.flush();
    }
}
