package classes;

import java.util.ArrayList;
import java.util.List;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.triangulate.DelaunayTriangulationBuilder;
import org.locationtech.jts.triangulate.quadedge.QuadEdgeSubdivision;

public class BowyerWatson {

    public static List<Coordinate> triangulate(List<Coordinate> points) {
        GeometryFactory geometryFactory = new GeometryFactory();
        DelaunayTriangulationBuilder builder = new DelaunayTriangulationBuilder();

        builder.setSites(geometryFactory.createMultiPoint(points.toArray(new Coordinate[0])));
        //QuadEdgeSubdivision subdivision = builder.getSubdivision();

        // Get the Delaunay triangulation as a JTS Geometry
        Geometry triangulation = builder.getTriangles(geometryFactory);

        // Extract the coordinates from the triangulation
        Coordinate[] coordinates = triangulation.getCoordinates();

        // Convert the coordinates to a list
        List<Coordinate> result = new ArrayList<>();
        for (Coordinate coordinate : coordinates) {
            result.add(new Coordinate(coordinate));
        }

        return result;
    }
    
}