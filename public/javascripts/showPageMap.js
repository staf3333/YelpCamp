// mapboxgl.accessToken = 'pk.eyJ1Ijoic3RhZjMzMzMiLCJhIjoiY2w4aHhzeWcwMGt3dTNvczFwNXFyOTdodCJ9.wVGSJLB5v3dxg_YSUrlc3A';
mapboxgl.accessToken = mapToken;
//console.log(mapToken);
// console.log(campground)
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 9, // starting zoom
    projection: 'globe' // display the map as a 3D globe
});

map.addControl(new mapboxgl.NavigationControl());

map.on('style.load', () => {
    map.setFog({}); // Set the default atmosphere style
});

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campground.title}</h3><p>${campground.location}</p>`
            )
    )
    .addTo(map)
