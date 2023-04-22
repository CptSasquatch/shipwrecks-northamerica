# shipwrecks-northamerica

leaflet map of shipwrecks in North America

## Data

The data comes from [Coast Survey's Automated Wreck and Obstruction Information System (AWOIS)](https://nauticalcharts.noaa.gov/data/wrecks-and-obstructions.html). Coast Survey's Automated Wreck and Obstruction Information System (AWOIS) contains information on over 10,000 submerged wrecks and obstructions in the coastal waters of the United States. Information includes latitude and longitude of each feature along with brief historic and descriptive details.

## Process

The data was downloaded as a CSV file and cleaned and converted to JSON using the python library pandas. Then using d3.js and leaflet.js the data was visualized on a map. The custom markers were created using [Pirates Icons](https://elements.envato.com/20-pirates-icons-solid-HESN6U9) from Envato Elements as a base and then modified in Adobe Illustrator. The buttons were created using the easybutton.js library and the icons for the buttons were created using [Font Awesome](https://fontawesome.com/). The functionality to add markers on click was created using the turf.js library.

## To Do

- [ ] Add a search bar to filter the data
- [ ] Add a legend
- [ ] Add a dropdown menu to filter the data for the heatmap
