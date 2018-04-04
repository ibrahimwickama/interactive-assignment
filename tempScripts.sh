#!/usr/bin/env bash
#npm install ng2-dragula --save
#npm install ng2-dnd@4.0.0 --save
#npm install --save angular2-virtual-scroll
#npm install --save leaflet
#npm install --save d3-color
echo "Installing the app into dhis.hisptz.org/dhis..."
cd dist
curl -X POST -u ibrahimwickama:ibrahim@hispTz1 -F file=@orgUnitAssignment.zip https://dhis.hisptz.org/dhis/api/apps
echo "Done..."
