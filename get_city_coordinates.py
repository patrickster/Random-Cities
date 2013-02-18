
import requests
from BeautifulSoup import BeautifulSoup
import csv
import requests
import re
import random
import time

city_file = 'cities.txt'
out_file = 'cities.csv'

def load_city_list(city_file):
    f = open(city_file)
    r = csv.reader(f)
    cities = []
    for row in r:
        print row
        cities += row
    f.close()
    return cities


def extract_coordinate(coord_string):
    try:
        coord_re = re.compile(r'^(\d+).{1}(\d+).*')
        m = re.match(coord_re, coord_string)
        (degrees, minutes) = m.groups()
        return float(degrees) + float(minutes) / 60
    except:
        print 'Could not identify coordinates in %s' % coord_string  
    return
        

def get_coordinates(city):
    print 'Retrieving coordinates for %s' % city
    url = 'http://en.wikipedia.org/wiki/' + re.sub('\s+', '_', city)
    headers = { 'User-Agent' : 'Mozilla/4.0 (compatible; MSIE 6.1; Windows XP)' }
    r = requests.get(url, headers=headers)
    coords = []
    if r.status_code == 200:
        soup = BeautifulSoup(r.content)
        lat = soup.find('span', { 'class' : 'latitude' }).text
        lng = soup.find('span', { 'class' : 'longitude' }).text
        coords = [extract_coordinate(lat), extract_coordinate(lng)]
        print coords
    else:
        print 'Problem with %s' % city
    return coords


def main():
    cities = load_city_list(city_file)
    f = open(out_file, 'w')
    w = csv.writer(f)
    w.writerow(['city', 'lat', 'lng'])
    for city in cities:
        coords = get_coordinates(city)
        w.writerow([city] + coords)
        time.sleep(random.randint(3, 12))
    f.close()
    
        

if __name__ == '__main__':
    main()
        
