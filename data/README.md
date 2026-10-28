# Map data

`us-states-10m.json` is the unprojected state topology from
[U.S. Atlas 3.0.1](https://github.com/topojson/us-atlas), based on the U.S. Census
Bureau's 2017 cartographic boundary shapefiles. Downloaded from
https://cdn.jsdelivr.net/npm/us-atlas@3.0.1/states-10m.json.

The map uses shared state boundaries, with the same geographic projection as
the world map. The upstream license is included in `us-atlas-LICENSE`.

`great-lakes-50m.json` contains Lake Superior, Michigan, Huron, Erie, Ontario,
and Saint Clair from Natural Earth's 1:50m lakes data, version 5.1.2:
https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_50m_lakes.geojson.
Only the name and geometry are retained. Polygon rings are oriented clockwise
outside and counterclockwise inside for D3's spherical geometry convention.
Natural Earth data is public domain:
https://www.naturalearthdata.com/about/terms-of-use/.

The state borders and lake shorelines load together when the visitor zooms in.
The lake layer is necessary because the world countries layer treats the Great
Lakes as land; shared state boundaries alone leave Michigan's outline incomplete.
