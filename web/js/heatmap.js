polygonNumber = 21;

for (let i = 0; i < polygonNumber; i++) {
    measurePoints_options.modelFiles.push(
            {
                url: '/Werre/data/polygons/polygon'+ i.toString() +'.geojson',
                name: 'polygon_' + i.toString(),
                fillColor: '0x67ADDFFF',
                outlineColor: 'blue',
                outlineWidth: 2
            }
    );
}