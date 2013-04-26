
library(XML)

geocode <- function(place) {
  require(XML)
  address <- gsub("[[:blank:]+]", "+", place)
  url <- "http://maps.googleapis.com/maps/api/geocode/xml?address="
  url <- paste(url, place, "&sensor=true", sep="")
  response <- xmlTreeParse(url, useInternal=TRUE)
  status <- xmlValue(getNodeSet(response, "//status")[[1]])
  if (status == "OK") {
    lat <- as.numeric(xmlValue(getNodeSet(response, '///lat')[[1]]))
    lng <- as.numeric(xmlValue(getNodeSet(response, '///lng')[[1]]))
  } else {
    lat <- lng <- NA
  }
  return(list(lat=lat, lng=lng))
}

## Load current version of cities table
cities <- read.csv('cities.csv', as.is=TRUE)

## Geocode any new additions
## (i.e. cities without a set lat/lng/zoom)
n.cities <- nrow(cities)
for (i in 1:n.cities) {
  if (is.na(cities$Latitude[i])) {
    city <- cities$City[i]
    print(city)
    coords <- geocode(city, sep=""))
    print(coords)
    cities$Latitude[i] <- coords[["lat"]]
    cities$Longitude[i] <- coords[["lng"]]
    Sys.sleep(5)
  }
}

## Save
write.csv(cities, 'cities.csv', row.names=FALSE)



