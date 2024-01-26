Zum jetzigen Stand des Projekts muss der Pfad zum Projekt (also zum Projekt-Ordner) noch in Werre\web\WEB-INF\classes\config.properties eingetragen werden.

----Hinzufügen von Messpunkten----

Fügen Sie eine neue Messpunkt-JSON-Datei unter web/data/openMeteoData hinzu.
Sie muss den namen mp{n}.json haben. Dabei ist n eine beliebige Nummer.
Fügen sie die Datei anschließend in der Datei web/data/openMeteoData/mpList.json zum Array hinzu.
Der Inhalt einer Messpunkt-JSON-Datei sieht folgendermaßen aus:

{"longitude":8.76,"latitude":52.06,"name":"Lagesche Str. 76, 32108 Bad Salzuflen"}

Schreiben sie nach diesem Muster auch Ihre neue Messpunkt-JSON-Datei.