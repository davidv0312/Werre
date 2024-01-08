# Author: David Vehlow, david.vehlow@hsbi.de, Datum: 18.12.2023
# Für weitere Informationen bitte die Dokumentation lesen.



import json
import requests
from collections import defaultdict
from xml.etree import ElementTree as ET
from requests.exceptions import Timeout
from concurrent.futures import ThreadPoolExecutor, as_completed

def read_geojson(file_path):
    print(f"Lese GeoJSON-Datei: {file_path}")
    with open(file_path, 'r') as file:
        return json.load(file)

def get_xml_data(url, polygon_number, total_polygons):
    try:
        print(f"Abrufen von XML-Daten für Polygon {polygon_number} von {total_polygons}: {url}")
        response = requests.get(url, timeout=180)  # Setzt ein Timeout von 180 Sekunden
        return response.text
    except Timeout:
        print(f"Timeout erreicht für {url}. Versuche es erneut...")
        return get_xml_data(url, polygon_number, total_polygons)  

def extract_land_cover_class_value(xml_data):
    try:
        root = ET.fromstring(xml_data)
        ns = {'gml': 'http://www.opengis.net/gml/3.2', 'xlink': 'http://www.w3.org/1999/xlink'}
        for element in root.findall('.//{*}LandCoverObservation/{*}class', ns):
            href = element.get('{http://www.w3.org/1999/xlink}href')
            class_value = href.split('/')[-1]
            return class_value
    except ET.ParseError as e:
        print(f"XML Parsing-Fehler: {e}")
    return None


def organize_polygons_by_class_value(geojson_data, max_workers=50): # Hier Anzahl gleichzeitiger Download setzen, 50 ist für High-End-PCs gedacht.
    class_value_polygons = defaultdict(list)
    max_polygons = len(geojson_data['features']) 
    polygons_without_class_value = 0

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        future_to_url = {
            executor.submit(get_xml_data, feature['properties']['identifier'], feature_count, max_polygons): feature
            for feature_count, feature in enumerate(geojson_data['features'], start=1)
        }
        
        for future in as_completed(future_to_url):
            feature = future_to_url[future]
            xml_data = future.result()
            class_value = extract_land_cover_class_value(xml_data)
            if class_value:
                class_value_polygons[class_value].append(feature)
            else:
                polygons_without_class_value += 1

    return class_value_polygons, polygons_without_class_value

def write_geojson_files(class_value_polygons, base_name="output"):
    for class_value, features in class_value_polygons.items():
        file_name = f"{base_name}_{class_value}.geojson"
        print(f"Schreibe {len(features)} Polygone in die Datei: {file_name}")
        geojson = {
            "type": "FeatureCollection",
            "features": features
        }
        with open(file_name, 'w') as file:
            json.dump(geojson, file)

def main():
    geojson_data = read_geojson("stadtgebiet.geojson")
    class_value_polygons, polygons_without_class_value = organize_polygons_by_class_value(geojson_data)
    write_geojson_files(class_value_polygons)
    print(f"Anzahl der Polygone ohne LandCoverClassValue: {polygons_without_class_value}")


if __name__ == "__main__":
    main()
















