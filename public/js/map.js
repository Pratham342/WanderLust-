
let mapToken = MAP_TOKEN;
// console.log(mapToken);
// console.log("Listing coordinates:", listing.geometry.coordinates);

// Initialize the map
const map = new maplibregl.Map({
    container: 'map',
    style: `https://api.maptiler.com/maps/streets/style.json?key=${mapToken}`,
    center: listing.geometry.coordinates, //New Delhi coords h ye
    zoom: 9,
});

// Add zoom and rotation controls
map.addControl(new maplibregl.NavigationControl());

const marker = new maplibregl.Marker({ color: "red" })
    .setLngLat(listing.geometry.coordinates)
    .setPopup(new maplibregl.Popup({ offset: 25 })
      .setHTML(`<h3>${listing.title}</h3><p>Exact location will be provided after booking.</p>`))
    .addTo(map);