from geopy.geocoders import Nominatim
location_list = ["삿포로시","오타루시","오비히로시","利尻島", "稚内市","網走市","知床国立公園","釧路市","沖縄市","香港","กรุงเทพมหานคร",
                 "Владивосток", "Хабаровск","Чита","Иркутск","Ольхо́н","Красноярск","Москва","Санкт-Петербург","Мурманск",
                 "Kirkenes","Alta","Tromsø","Narvik","Trondheim","Oslo","Rovaniemi","Oulu","Kuopio","Helsinki","Edinburgh","Longyearbyen",
                 "London", "Reykjavík","Borgarnes","Laugarvatn","Gullfoss","Friðland að Fjallabaki","Thórsmörk","Mýrdalshreppur",
                 "Myrdalssandur","Skaftafell","Jökulsárlón","Brunnholl","Höfn í Hornafirði","Djúpivogur","Flögufoss",
                 "Fljótsdalshérað","Bakkagerði","Langanesbyggð","Skinnastaðir","Dettifoss","Akureyri","Blönduós",
                 "Frankfurt am Main","Amsterdam","Haarlem","Enkhuizen","Netherlands Harlingen",
                 "València","Spain Cartagena","Pampaneira","Órgiva","Nerja","Málaga","Granada","Murcia","Ronda","Zahara de la Sierra",
                 "Gibraltar", "Auckland","Christchurch","News Zealand Ashburton","Lake Tekapo","Twizel","Queenstown","Milford Sound","Te Anau",
                 "Washington","New York", "Seoul", "Pohang", "Jeju"]

locator = Nominatim(user_agent="myGeocoder")

with open('location_data.txt', 'w', encoding='utf8') as f:
    for location in location_list:
        region_info = locator.geocode(location, language='en')
        latitude = region_info.latitude
        longitude = region_info.longitude
        city = region_info[0].split(',')[0].strip()
        country = region_info[0].split(',')[-1].strip()
        if city == "Auckland":
            longitude -= 2
        f.write(str(latitude) + " " + str(longitude) + "," + city + " (" + country + "),,," + "#0E4D92;\n")