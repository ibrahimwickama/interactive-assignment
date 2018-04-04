#!/usr/bin/env bash
ng build --prod --aot=false
mv dist/assets/manifest.webapp dist/
cp -r dist/* /opt/dhis/config/apps/orgUnitAssignment/
cd dist
#Compress the file
echo "Compressing the file..."
zip -r -D orgUnitAssignment.zip .
echo "Installing the app into dhis.hisptz.org/dhis..."
curl -X POST -u ibrahimwickama:ibrahim@hispTz1 -F file=@orgUnitAssignment.zip https://dhis.hisptz.org/dhis/api/apps
echo "Installing the app into DHIS HiSPTz on play.hisptz.org/28..."
curl -X POST -u admin:district -F file=@orgUnitAssignment.zip https://play.hisptz.org/28/api/apps
echo "Successful installed the app"
