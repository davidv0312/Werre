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

            bowyerWatson(stationCoordinates);

        } else {
            LOGGER.severe("Fehler beim Laden der Messpunkte");
        }

        //response.setContentType("application/json");      
        //PrintWriter out = response.getWriter();  
        //out.print(polygon.toGeoJson());
        //out.flush();
    }

    public static List<List<Double>> bowyerWatson(List<List<Double>> points) {
        // Create super triangle (adjust the coordinates as needed)
        List<Double> super1 = List.of(-1000.0, -1000.0);
        List<Double> super2 = List.of(3000.0, -1000.0);
        List<Double> super3 = List.of(1000.0, 3000.0);

        List<List<Double>> triangulation = new ArrayList<>();
        triangulation.add(super1);
        triangulation.add(super2);
        triangulation.add(super3);

        for (int i = 0; i < points.size(); i++) {
            List<Double> point = points.get(i);

            List<List<Double>> badTriangles = findBadTriangles(triangulation, point);
            List<List<Double>> polygon = findPolygon(badTriangles);
            triangulation.removeAll(badTriangles);

            for (List<Double> vertex : convexHull(polygon)) {
                triangulation.add(vertex);
                triangulation.add(point);
                triangulation.add(centroid(polygon));
            }
        }

        // Remove triangles containing super triangle vertices
        triangulation.removeIf(triangle -> triangleContainsSuper(triangle, super1, super2, super3));

        return triangulation;
    }

    private static boolean triangleContainsSuper(List<Double> triangle, List<Double> super1, List<Double> super2, List<Double> super3) {
        return pointInTriangle(super1, triangle) || pointInTriangle(super2, triangle) || pointInTriangle(super3, triangle);
    }

    private static boolean pointInTriangle(List<Double> point, List<Double> triangle) {
        double x1 = triangle.get(0);
        double y1 = triangle.get(1);
        double x2 = triangle.get(2);
        double y2 = triangle.get(3);
        double x3 = triangle.get(4);
        double y3 = triangle.get(5);

        double alpha = ((y2 - y3) * (point.get(0) - x3) + (x3 - x2) * (point.get(1) - y3))
                / ((y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3));

        double beta = ((y3 - y1) * (point.get(0) - x3) + (x1 - x3) * (point.get(1) - y3))
                / ((y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3));

        double gamma = 1 - alpha - beta;

        return alpha >= 0 && beta >= 0 && gamma >= 0;
    }

    private static List<List<Double>> findBadTriangles(List<List<Double>> triangulation, List<Double> point) {
        List<List<Double>> badTriangles = new ArrayList<>();
        for (List<Double> triangle : triangulation) {
            List<Double> p1 = triangle.subList(0, 2);
            List<Double> p2 = triangle.subList(2, 4);
            List<Double> p3 = triangle.subList(4, 6);

            if (isPointInCircumcircle(p1, p2, p3, point)) {
                badTriangles.add(triangle);
            }
        }
        return badTriangles;
    }

    private static boolean isPointInCircumcircle(List<Double> p1, List<Double> p2, List<Double> p3, List<Double> point) {
        double detT = (p1.get(0) - point.get(0)) * (p2.get(1) - point.get(1))
                - (p2.get(0) - point.get(0)) * (p1.get(1) - point.get(1));
        double detU = (p1.get(0) - point.get(0)) * (p3.get(1) - point.get(1))
                - (p3.get(0) - point.get(0)) * (p1.get(1) - point.get(1));
        double detV = (p2.get(0) - point.get(0)) * (p3.get(1) - point.get(1))
                - (p3.get(0) - point.get(0)) * (p2.get(1) - point.get(1));

        double mDetT = detT - detU + detV;

        double centerX = (p1.get(0) * p1.get(0) + p1.get(1) * p1.get(1)) * (p2.get(1) - p3.get(1))
                + (p2.get(0) * p2.get(0) + p2.get(1) * p2.get(1)) * (p3.get(1) - p1.get(1))
                + (p3.get(0) * p3.get(0) + p3.get(1) * p3.get(1)) * (p1.get(1) - p2.get(1));

        double centerY = (p1.get(0) * p1.get(0) + p1.get(1) * p1.get(1)) * (p3.get(0) - p2.get(0))
                + (p2.get(0) * p2.get(0) + p2.get(1) * p2.get(1)) * (p1.get(0) - p3.get(0))
                + (p3.get(0) * p3.get(0) + p3.get(1) * p3.get(1)) * (p2.get(0) - p1.get(0));

        double denominator = 2 * mDetT;

        centerX /= denominator;
        centerY /= denominator;

        double radius = Math.sqrt((p1.get(0) - centerX) * (p1.get(0) - centerX)
                + (p1.get(1) - centerY) * (p1.get(1) - centerY));

        double distance = Math.sqrt((point.get(0) - centerX) * (point.get(0) - centerX)
                + (point.get(1) - centerY) * (point.get(1) - centerY));

        return distance < radius;
    }

    private static List<List<Double>> findPolygon(List<List<Double>> badTriangles) {
        List<List<Double>> polygon = new ArrayList<>();
        for (List<Double> triangle : badTriangles) {
            List<Double> p1 = triangle.subList(0, 2);
            List<Double> p2 = triangle.subList(2, 4);
            List<Double> p3 = triangle.subList(4, 6);

            boolean shared = false;

            for (List<Double> other : badTriangles) {
                if (!other.equals(triangle)) {
                    List<Double> v1 = other.subList(0, 2);
                    List<Double> v2 = other.subList(2, 4);
                    List<Double> v3 = other.subList(4, 6);

                    if (v1.equals(p1) || v1.equals(p2) || v1.equals(p3)
                            || v2.equals(p1) || v2.equals(p2) || v2.equals(p3)
                            || v3.equals(p1) || v3.equals(p2) || v3.equals(p3)) {
                        shared = true;
                        break;
                    }
                }
            }

            if (!shared) {
                polygon.add(triangle);
            }
        }
        return polygon;
    }

    private static List<List<Double>> convexHull(List<List<Double>> points) {
        List<List<Double>> convexHull = new ArrayList<>();

        // Sort points lexicographically (first by x, then by y)
        points.sort((p1, p2) -> {
            int cmp = Double.compare(p1.get(0), p2.get(0));
            return (cmp != 0) ? cmp : Double.compare(p1.get(1), p2.get(1));
        });

        // Lower hull
        for (List<Double> point : points) {
            while (convexHull.size() >= 2 && orientation(convexHull.get(convexHull.size() - 2), convexHull.get(convexHull.size() - 1), point) <= 0) {
                convexHull.remove(convexHull.size() - 1);
            }
            convexHull.add(point);
        }

        // Upper hull (reversed for concatenation)
        int upperHullSize = convexHull.size();
        for (int i = points.size() - 2; i >= 0; i--) {
            List<Double> point = points.get(i);
            while (convexHull.size() > upperHullSize && orientation(convexHull.get(convexHull.size() - 2), convexHull.get(convexHull.size() - 1), point) <= 0) {
                convexHull.remove(convexHull.size() - 1);
            }
            convexHull.add(point);
        }

        // Remove duplicate endpoints
        if (convexHull.size() > 1) {
            convexHull.remove(convexHull.size() - 1);
        }

        return convexHull;
    }

    private static double orientation(List<Double> p, List<Double> q, List<Double> r) {
        return (q.get(1) - p.get(1)) * (r.get(0) - q.get(0)) - (q.get(0) - p.get(0)) * (r.get(1) - q.get(1));
    }

    private static List<Double> centroid(List<List<Double>> points) {
        double xSum = 0.0;
        double ySum = 0.0;
        int count = points.size();

        for (List<Double> point : points) {
            xSum += point.get(0);
            ySum += point.get(1);
        }

        double centroidX = xSum / count;
        double centroidY = ySum / count;

        return List.of(centroidX, centroidY);
    }

}
