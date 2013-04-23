
library(rjson)

cities <- read.csv('cities.csv', as.is=TRUE)
cities <- cities[!is.na(cities$Latitude),]
n.cities <- nrow(cities)
city.list <- list()

for (i in 1:n.cities) {
  city <- cities$City[i]
  country <- cities$Country[i]
  latitude <- cities$Latitude[i]
  longitude <- cities$Longitude[i]
  zoom <- cities$Zoom[i]
  lst <- list(city=city, country=country,
              latitude=latitude, longitude=longitude, zoom=zoom)
  city.list[[i]] <- lst
}

city.list <- list(cities=city.list)
city.json <- toJSON(city.list)
sink("../web/cities.json")
cat(city.json)
sink()
