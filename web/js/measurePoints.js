var measurePoints_options = {
    zoom: 18,
    plugins: new Map()
};
measurePoints_options.plugins.set('DataShowModal', {
    id: 'DataShowModal',
    active: true
});
window["DataShowModal_measurePoints_options"] = {
    attrsShown: ['latitude', 'longitude', 'name', 'description'],
    attrsFormat: new Map()
};
