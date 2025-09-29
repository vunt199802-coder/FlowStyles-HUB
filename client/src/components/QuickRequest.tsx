import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send } from "lucide-react";

interface QuickRequestData {
  category: string;
  urgency: string;
  state: string;
  city: string;
}

interface QuickRequestProps {
  onSubmit: (data: QuickRequestData) => void;
}

const serviceCategories = [
  { value: "hairstylists", label: "Hairstylists" },
  { value: "barbers", label: "Barbers" },
  { value: "nailtechs", label: "Nail Techs" },
  { value: "massage", label: "Massage Therapists" }
];

const urgencyOptions = [
  { value: "today", label: "Today" },
  { value: "this-week", label: "This Week" },
  { value: "this-month", label: "This Month" },
  { value: "flexible", label: "Flexible" }
];

const statesAndCities = {
  "AL": ["Abbeville", "Adamsville", "Addison", "Akron", "Alabaster", "Albertville", "Alexander City", "Aliceville", "Allgood", "Altoona", "Andalusia", "Anniston", "Arab", "Ardmore", "Arley", "Ashford", "Ashland", "Ashville", "Athens", "Atmore", "Attalla", "Auburn", "Autaugaville", "Avon", "Bay Minette", "Bayou La Batre", "Bear Creek", "Bessemer", "Birmingham", "Blountsville", "Boaz", "Brent", "Brewton", "Bridgeport", "Brighton", "Brookside", "Brookwood", "Butler", "Calera", "Camden", "Carbon Hill", "Carrollton", "Centre", "Centreville", "Chatom", "Chelsea", "Cherokee", "Chickasaw", "Childersburg", "Citronelle", "Clanton", "Clay", "Clayton", "Cleburne", "Cleveland", "Clio", "Coaling", "Coalport", "Columbiana", "Cordova", "Cottonwood", "Cullman", "Dadeville", "Daleville", "Daphne", "Dauphin Island", "Decatur", "Demopolis", "Dora", "Dothan", "Double Springs", "Douglas", "Dozier", "East Brewton", "Eclectic", "Elba", "Elberta", "Elkmont", "Elmore", "Enterprise", "Eufaula", "Eutaw", "Eva", "Evergreen", "Excel", "Fairfield", "Fairhope", "Falkville", "Fayette", "Five Points", "Flomaton", "Florala", "Florence", "Foley", "Fort Deposit", "Fort Payne", "Franklin", "Frisco City", "Fulton", "Fultondale", "Fyffe", "Gadsden", "Gardendale", "Geneva", "Georgiana", "Geraldine", "Glencoe", "Goodwater", "Gordo", "Grand Bay", "Grant", "Graysville", "Greensboro", "Greenville", "Grove Hill", "Guin", "Gulf Shores", "Guntersville", "Gurley", "Hackleburg", "Haleyville", "Hamilton", "Hammondville", "Hanceville", "Hartselle", "Harvest", "Hayneville", "Hazel Green", "Headland", "Heflin", "Helena", "Henagar", "Highland Lake", "Hillsboro", "Hokes Bluff", "Holly Pond", "Hollywood", "Homewood", "Hoover", "Horton", "Hueytown", "Huntsville", "Hurtsboro", "Hytop", "Indian Springs", "Irondale", "Jackson", "Jacksonville", "Jasper", "Jemison", "Kansas", "Kimberly", "Kinston", "LaFayette", "Lake View", "Lanett", "Leeds", "Leesburg", "Lester", "Level Plains", "Lewisburg", "Lincoln", "Linden", "Lineville", "Littleville", "Livingston", "Loachapoka", "Lockhart", "Locust Fork", "Louisville", "Lowndesboro", "Luverne", "Lynn", "Madison", "Madrid", "Magnolia Springs", "Malvern", "Maplesville", "Margaret", "Marion", "Maytown", "McIntosh", "McKenzie", "Mentone", "Midfield", "Midland City", "Millbrook", "Millport", "Millry", "Mobile", "Monroeville", "Montevallo", "Montgomery", "Moody", "Morris", "Moulton", "Moundville", "Mount Vernon", "Muscle Shoals", "Nauvoo", "Nectar", "Needham", "New Brockton", "New Hope", "New Market", "Newton", "Northport", "Notasulga", "Oak Grove", "Oakman", "Odenville", "Ohatchee", "Oneonta", "Onycha", "Opelika", "Opp", "Orange Beach", "Orrville", "Owens Cross Roads", "Oxford", "Ozark", "Paint Rock", "Parrish", "Pelham", "Pell City", "Phenix City", "Phil Campbell", "Pickensville", "Piedmont", "Pike Road", "Pinckard", "Pine Hill", "Pinson", "Pisgah", "Plantersville", "Pleasant Grove", "Point Clear", "Pollard", "Powell", "Prattville", "Prichard", "Pritchard", "Providence", "Rainbow City", "Rainsville", "Ranburne", "Red Bay", "Red Level", "Reeltown", "Reform", "Rehobeth", "Repton", "Ridgeville", "River Falls", "Riverside", "Roanoke", "Robertsdale", "Rogersville", "Rosa", "Russellville", "Rutledge", "Saint Clair Shores", "Samson", "Sand Rock", "Saraland", "Sardis City", "Satsuma", "Scottsboro", "Section", "Selma", "Sheffield", "Shiloh", "Shorter", "Silas", "Siluria", "Sipsey", "Skyline", "Slocomb", "Smiths Station", "Snead", "Somerville", "South Vinemont", "Southside", "Spanish Fort", "Springville", "Steele", "Stevenson", "Sulligent", "Sumiton", "Summerdale", "Susan Moore", "Sweet Water", "Sylacauga", "Sylvan Springs", "Talladega", "Tallassee", "Tarrant", "Taylor", "Thomaston", "Thomasville", "Thorsby", "Tibbie", "Titus", "Tonawanda", "Town Creek", "Triana", "Trinity", "Troy", "Trussville", "Tuscaloosa", "Tuscumbia", "Tuskegee", "Twin", "Union Grove", "Union Springs", "Uniontown", "Valley", "Valley Head", "Vance", "Vernon", "Vestavia Hills", "Vina", "Vincent", "Wadley", "Waldo", "Walnut Grove", "Warrior", "Washington", "Waterloo", "Waverly", "Weaver", "Webb", "Wellington", "West Blocton", "West Jefferson", "West Point", "Westover", "Wetumpka", "White Hall", "Wilsonville", "Winfield", "Woodland", "Woodstock", "Woodville", "York"],
  "AK": ["Adak", "Akiachak", "Akiak", "Akutan", "Alakanuk", "Ambler", "Anchor Point", "Anchorage", "Anderson", "Angoon", "Aniak", "Anvik", "Arctic Village", "Atka", "Atqasuk", "Barrow", "Beaver", "Bethel", "Bettles", "Big Lake", "Birch Creek", "Brevig Mission", "Buckland", "Cantwell", "Central", "Chalkyitsik", "Chefornak", "Chevak", "Chicken", "Chignik", "Chitina", "Chuathbaluk", "Circle", "Clam Gulch", "Clarks Point", "Cold Bay", "Coldfoot", "Cooper Landing", "Copper Center", "Cordova", "Craig", "Crooked Creek", "Deering", "Delta Junction", "Dillingham", "Douglas", "Eagle", "Eagle River", "Eek", "Egegik", "Ekwok", "Elim", "Emmonak", "Ester", "Fairbanks", "False Pass", "Fort Yukon", "Gakona", "Galena", "Gambell", "Girdwood", "Glennallen", "Goodnews Bay", "Grayling", "Gustavus", "Haines", "Healy", "Holy Cross", "Homer", "Hoonah", "Hooper Bay", "Houston", "Hughes", "Huslia", "Hydaburg", "Hyder", "Igiugig", "Iliamna", "Juneau", "Kake", "Kaktovik", "Kalskag", "Kaltag", "Karluk", "Kasaan", "Kasigluk", "Kenai", "Ketchikan", "Kiana", "King Cove", "King Salmon", "Kipnuk", "Kivalina", "Klawock", "Kobuk", "Kodiak", "Koliganek", "Kotlik", "Kotzebue", "Koyuk", "Koyukuk", "Kwethluk", "Kwigillingok", "Lake Louise", "Larsen Bay", "Levelock", "Lime Village", "Livengood", "Manley Hot Springs", "Manokotak", "Marshall", "McGrath", "Mekoryuk", "Metlakatla", "Minto", "Moose Pass", "Mountain Village", "Naknek", "Napakiak", "Napaskiak", "Nenana", "New Stuyahok", "Newhalen", "Nightmute", "Nikolai", "Nikolski", "Ninilchik", "Noatak", "Nome", "Nondalton", "Noorvik", "North Pole", "Northway", "Nuiqsut", "Nulato", "Nunam Iqua", "Nunapitchuk", "Old Harbor", "Ouzinkie", "Palmer", "Pelican", "Petersburg", "Pilot Point", "Pilot Station", "Platinum", "Point Hope", "Point Lay", "Port Alexander", "Port Alsworth", "Port Heiden", "Port Lions", "Prudhoe Bay", "Quinhagak", "Red Devil", "Ruby", "Russian Mission", "Saint George", "Saint Mary's", "Saint Michael", "Saint Paul", "Sand Point", "Savoonga", "Scammon Bay", "Selawik", "Seldovia", "Seward", "Shageluk", "Shaktoolik", "Sheldon Point", "Shishmaref", "Shungnak", "Sitka", "Skagway", "Sleetmute", "Soldotna", "South Naknek", "Sterling", "Stevens Village", "Stony River", "Sutton", "Takotna", "Talkeetna", "Tanacross", "Tanana", "Tatitlek", "Teller", "Tenakee Springs", "Tetlin", "Thorne Bay", "Togiak", "Tok", "Toksook Bay", "Tuluksak", "Tuntutuliak", "Tununak", "Twin Hills", "Two Rivers", "Tyonek", "Unalakleet", "Unalaska", "Upper Kalskag", "Valdez", "Venetie", "Wainwright", "Wales", "Wasilla", "White Mountain", "Whittier", "Willow", "Wrangell", "Yakutat"],
  "AZ": ["Aguila", "Ajo", "Apache Junction", "Arizona City", "Avondale", "Bapchule", "Benson", "Bisbee", "Black Canyon City", "Bouse", "Buckeye", "Bullhead City", "Camp Verde", "Carefree", "Casa Grande", "Cave Creek", "Chandler", "Chino Valley", "Chloride", "Clarkdale", "Claypool", "Clifton", "Colorado City", "Congress", "Coolidge", "Cornville", "Cottonwood", "Dewey", "Douglas", "Duncan", "Eagar", "El Mirage", "Eloy", "Flagstaff", "Florence", "Fountain Hills", "Fredonia", "Gila Bend", "Gilbert", "Glendale", "Globe", "Goodyear", "Grand Canyon Village", "Green Valley", "Guadalupe", "Hayden", "Holbrook", "Huachuca City", "Jerome", "Kearny", "Kingman", "Lake Havasu City", "Litchfield Park", "Lukeville", "Mammoth", "Marana", "Maricopa", "Mesa", "Miami", "Nogales", "Oro Valley", "Page", "Paradise Valley", "Parker", "Patagonia", "Payson", "Peach Springs", "Pearce", "Peoria", "Phoenix", "Pima", "Pinetop", "Prescott", "Prescott Valley", "Quartzsite", "Queen Creek", "Safford", "Sahuarita", "San Luis", "Scottsdale", "Sedona", "Show Low", "Sierra Vista", "Snowflake", "Somerton", "South Tucson", "St. Johns", "Star Valley", "Sun City", "Sun City West", "Superior", "Surprise", "Taylor", "Tempe", "Thatcher", "Tolleson", "Tombstone", "Tuba City", "Tucson", "Tumacacori", "Wickenburg", "Willcox", "Williams", "Window Rock", "Winkelman", "Winslow", "Yuma"],
  "AR": ["Alexander", "Alma", "Arkadelphia", "Arkansas City", "Ash Flat", "Ashdown", "Atkins", "Augusta", "Bald Knob", "Barling", "Batesville", "Beebe", "Bella Vista", "Benton", "Bentonville", "Berryville", "Blytheville", "Booneville", "Bradford", "Brinkley", "Bryant", "Bulldog", "Cabot", "Caddo Valley", "Calico Rock", "Camden", "Carlisle", "Cave City", "Charleston", "Cherokee Village", "Clarksville", "Clinton", "Conway", "Corning", "Crossett", "Dardanelle", "De Queen", "De Witt", "Decatur", "Dermott", "Des Arc", "Diamond City", "Dumas", "El Dorado", "Elkins", "England", "Eureka Springs", "Fairfield Bay", "Fayetteville", "Flippin", "Fordyce", "Forrest City", "Fort Smith", "Gassville", "Gentry", "Gillett", "Glenwood", "Gravette", "Green Forest", "Greenbrier", "Greenwood", "Gurdon", "Hamburg", "Hampton", "Hardy", "Harrison", "Haskell", "Heber Springs", "Helena", "Hope", "Horseshoe Bend", "Hot Springs", "Huntsville", "Jacksonport", "Jacksonville", "Jasper", "Jonesboro", "Lake City", "Lake Village", "Lamar", "Leachville", "Lead Hill", "Little Rock", "Lonoke", "Lowell", "Magnolia", "Malvern", "Mammoth Spring", "Marianna", "Marion", "Marked Tree", "Marshall", "Maumelle", "McGehee", "Melbourne", "Mena", "Monticello", "Morrilton", "Mountain Home", "Mountain View", "Nashville", "Newport", "North Little Rock", "Osceola", "Ozark", "Paragould", "Paris", "Parkin", "Pea Ridge", "Piggott", "Pine Bluff", "Pocahontas", "Prescott", "Quitman", "Rogers", "Russellville", "Salem", "Searcy", "Sheridan", "Sherwood", "Siloam Springs", "Springdale", "Stuttgart", "Texarkana", "Trumann", "Van Buren", "Vilonia", "Waldron", "Walnut Ridge", "Warren", "West Helena", "West Memphis", "White Hall", "Wynne", "Yellville"],
  "CA": ["Adelanto", "Alhambra", "Anaheim", "Antioch", "Apple Valley", "Arcadia", "Bakersfield", "Baldwin Park", "Bellflower", "Berkeley", "Beverly Hills", "Burbank", "Carlsbad", "Carson", "Chico", "Chino", "Chino Hills", "Chula Vista", "Citrus Heights", "Clovis", "Compton", "Concord", "Corona", "Costa Mesa", "Daly City", "Davis", "Downey", "El Cajon", "El Monte", "Elk Grove", "Escondido", "Fairfield", "Fontana", "Fremont", "Fresno", "Fullerton", "Garden Grove", "Glendale", "Hawthorne", "Hayward", "Hemet", "Hesperia", "Huntington Beach", "Inglewood", "Irvine", "Lake Forest", "Lancaster", "Livermore", "Long Beach", "Los Angeles", "Lynwood", "Manteca", "Menifee", "Merced", "Milpitas", "Modesto", "Montebello", "Monterey Park", "Moreno Valley", "Mountain View", "Murrieta", "Napa", "Newport Beach", "Norwalk", "Oakland", "Oceanside", "Ontario", "Orange", "Oxnard", "Palmdale", "Palo Alto", "Paramount", "Pasadena", "Perris", "Petaluma", "Pico Rivera", "Pittsburg", "Placentia", "Pleasanton", "Pomona", "Rancho Cucamonga", "Redding", "Redlands", "Redondo Beach", "Redwood City", "Rialto", "Richmond", "Riverside", "Roseville", "Sacramento", "Salinas", "San Bernardino", "San Buenaventura", "San Diego", "San Francisco", "San Jose", "San Leandro", "San Mateo", "San Rafael", "Santa Ana", "Santa Barbara", "Santa Clara", "Santa Clarita", "Santa Maria", "Santa Monica", "Santa Rosa", "Simi Valley", "South Gate", "Stockton", "Sunnyvale", "Temecula", "Thousand Oaks", "Torrance", "Tracy", "Turlock", "Tustin", "Union City", "Upland", "Vacaville", "Vallejo", "Victorville", "Visalia", "Vista", "Walnut Creek", "West Covina", "West Sacramento", "Westminster", "Whittier", "Yuba City"],
  "CO": ["Arvada", "Aurora", "Boulder", "Broomfield", "Centennial", "Colorado Springs", "Commerce City", "Denver", "Fort Collins", "Grand Junction", "Greeley", "Lakewood", "Longmont", "Louisville", "Loveland", "Northglenn", "Pueblo", "Thornton", "Westminster", "Wheat Ridge"],
  "CT": ["Bridgeport", "Bristol", "Danbury", "Fairfield", "Greenwich", "Hamden", "Hartford", "Manchester", "Meriden", "Middletown", "Milford", "Naugatuck", "New Britain", "New Haven", "New London", "Norwalk", "Norwich", "Shelton", "Stamford", "Stratford", "Torrington", "Trumbull", "Waterbury", "West Hartford", "West Haven"],
  "DE": ["Bear", "Brookside", "Dover", "Glasgow", "Hockessin", "Middletown", "Milford", "Newark", "Pike Creek", "Pike Creek Valley", "Smyrna", "Wilmington"],
  "FL": ["Altamonte Springs", "Apopka", "Aventura", "Boca Raton", "Boynton Beach", "Bradenton", "Cape Coral", "Clearwater", "Coral Gables", "Coral Springs", "Daytona Beach", "Deerfield Beach", "Delray Beach", "Fort Lauderdale", "Fort Myers", "Gainesville", "Hialeah", "Hollywood", "Homestead", "Jacksonville", "Kissimmee", "Lakeland", "Largo", "Margate", "Melbourne", "Miami", "Miami Beach", "Miramar", "Naples", "North Miami", "Ocala", "Orlando", "Palm Bay", "Palm Beach Gardens", "Panama City", "Pembroke Pines", "Pensacola", "Plantation", "Pompano Beach", "Port St. Lucie", "Sanford", "Sarasota", "St. Petersburg", "Sunrise", "Tallahassee", "Tampa", "Tamarac", "Titusville", "West Palm Beach", "Winter Haven"],
  "GA": ["Albany", "Alpharetta", "Athens", "Atlanta", "Augusta", "Columbus", "Duluth", "Gainesville", "Johns Creek", "Macon", "Marietta", "Peachtree Corners", "Roswell", "Sandy Springs", "Savannah", "Smyrna", "South Fulton", "Warner Robins"],
  "HI": ["East Honolulu", "Hilo", "Honolulu", "Kailua", "Kaneohe", "Pearl City", "Waipahu"],
  "ID": ["Boise", "Caldwell", "Coeur d'Alene", "Idaho Falls", "Lewiston", "Meridian", "Nampa", "Pocatello", "Post Falls", "Twin Falls"],
  "IL": ["Arlington Heights", "Aurora", "Berwyn", "Bloomington", "Bolingbrook", "Chicago", "Cicero", "Decatur", "Des Plaines", "Elgin", "Evanston", "Joliet", "Naperville", "Normal", "Oak Lawn", "Oak Park", "Palatine", "Peoria", "Rockford", "Schaumburg", "Skokie", "Springfield", "Tinley Park", "Waukegan", "Wheaton"],
  "IN": ["Bloomington", "Carmel", "Evansville", "Fishers", "Fort Wayne", "Gary", "Hammond", "Indianapolis", "Lafayette", "Muncie", "Noblesville", "South Bend", "Terre Haute"],
  "IA": ["Ames", "Cedar Falls", "Cedar Rapids", "Council Bluffs", "Davenport", "Des Moines", "Dubuque", "Iowa City", "Sioux City", "Waterloo", "West Des Moines"],
  "KS": ["Kansas City", "Lawrence", "Leavenworth", "Leawood", "Manhattan", "Olathe", "Overland Park", "Salina", "Shawnee", "Topeka", "Wichita"],
  "KY": ["Bowling Green", "Covington", "Hopkinsville", "Lexington", "Louisville", "Owensboro", "Paducah", "Richmond"],
  "LA": ["Alexandria", "Baton Rouge", "Bossier City", "Houma", "Kenner", "Lafayette", "Lake Charles", "Monroe", "New Orleans", "Shreveport", "Slidell"],
  "ME": ["Auburn", "Augusta", "Bangor", "Biddeford", "Lewiston", "Portland", "Saco", "South Portland", "Waterville", "Westbrook"],
  "MD": ["Annapolis", "Baltimore", "Bowie", "College Park", "Columbia", "Frederick", "Gaithersburg", "Germantown", "Glen Burnie", "Hagerstown", "Rockville", "Salisbury", "Silver Spring", "Towson"],
  "MA": ["Attleboro", "Barnstable", "Boston", "Brockton", "Cambridge", "Chelsea", "Chicopee", "Fall River", "Framingham", "Haverhill", "Lawrence", "Lowell", "Lynn", "Malden", "Medford", "New Bedford", "Newton", "Pittsfield", "Plymouth", "Quincy", "Revere", "Salem", "Somerville", "Springfield", "Taunton", "Waltham", "Weymouth", "Worcester"],
  "MI": ["Ann Arbor", "Battle Creek", "Bay City", "Canton", "Dearborn", "Dearborn Heights", "Detroit", "Farmington Hills", "Flint", "Grand Rapids", "Jackson", "Kalamazoo", "Kentwood", "Lansing", "Livonia", "Midland", "Novi", "Pontiac", "Port Huron", "Rochester Hills", "Royal Oak", "Saginaw", "Southfield", "Sterling Heights", "Taylor", "Troy", "Warren", "Westland", "Wyoming"],
  "MN": ["Blaine", "Bloomington", "Brooklyn Park", "Burnsville", "Coon Rapids", "Duluth", "Eagan", "Eden Prairie", "Lakeville", "Maple Grove", "Minneapolis", "Minnetonka", "Moorhead", "Plymouth", "Rochester", "Saint Cloud", "Saint Paul", "Woodbury"],
  "MS": ["Biloxi", "Columbus", "Greenville", "Gulfport", "Hattiesburg", "Jackson", "Madison", "Meridian", "Olive Branch", "Pascagoula", "Pearl", "Ridgeland", "Southaven", "Tupelo", "Vicksburg"],
  "MO": ["Blue Springs", "Cape Girardeau", "Columbia", "Florissant", "Independence", "Jefferson City", "Joplin", "Kansas City", "Lee's Summit", "O'Fallon", "Raytown", "Saint Charles", "Saint Joseph", "Saint Louis", "Springfield", "University City"],
  "MT": ["Billings", "Bozeman", "Butte", "Great Falls", "Helena", "Kalispell", "Missoula"],
  "NE": ["Bellevue", "Fremont", "Grand Island", "Kearney", "Lincoln", "Norfolk", "North Platte", "Omaha", "Papillion"],
  "NV": ["Carson City", "Henderson", "Las Vegas", "North Las Vegas", "Reno", "Sparks"],
  "NH": ["Concord", "Derry", "Dover", "Keene", "Laconia", "Manchester", "Merrimack", "Nashua", "Portsmouth", "Rochester", "Salem"],
  "NJ": ["Atlantic City", "Bayonne", "Camden", "Clifton", "East Orange", "Edison", "Elizabeth", "Hamilton", "Irvington", "Jersey City", "Newark", "New Brunswick", "Paterson", "Perth Amboy", "Plainfield", "Trenton", "Union City", "Vineland", "West New York", "Woodbridge"],
  "NM": ["Alamogordo", "Albuquerque", "Carlsbad", "Clovis", "Farmington", "Gallup", "Las Cruces", "Los Alamos", "Roswell", "Santa Fe", "Silver City"],
  "NY": ["Albany", "Binghamton", "Buffalo", "Hempstead", "Ithaca", "Mount Vernon", "New Rochelle", "New York City", "Niagara Falls", "Rochester", "Rome", "Schenectady", "Syracuse", "Troy", "Utica", "White Plains", "Yonkers"],
  "NC": ["Asheville", "Cary", "Chapel Hill", "Charlotte", "Concord", "Durham", "Fayetteville", "Gastonia", "Greensboro", "Greenville", "High Point", "Huntersville", "Jacksonville", "Kannapolis", "Monroe", "Raleigh", "Rocky Mount", "Salisbury", "Wake Forest", "Wilmington", "Winston-Salem"],
  "ND": ["Bismarck", "Dickinson", "Fargo", "Grand Forks", "Jamestown", "Mandan", "Minot", "Valley City", "Wahpeton", "West Fargo", "Williston"],
  "OH": ["Akron", "Beavercreek", "Canton", "Cincinnati", "Cleveland", "Columbus", "Dayton", "Dublin", "Elyria", "Euclid", "Fairborn", "Findlay", "Hamilton", "Kettering", "Lima", "Lorain", "Mansfield", "Marion", "Newark", "Parma", "Springfield", "Strongsville", "Toledo", "Warren", "Westerville", "Youngstown"],
  "OK": ["Bartlesville", "Broken Arrow", "Edmond", "Enid", "Lawton", "Moore", "Muskogee", "Norman", "Oklahoma City", "Ponca City", "Shawnee", "Stillwater", "Tulsa"],
  "OR": ["Albany", "Beaverton", "Bend", "Corvallis", "Eugene", "Forest Grove", "Grants Pass", "Gresham", "Hillsboro", "Lake Oswego", "McMinnville", "Medford", "Oregon City", "Portland", "Salem", "Springfield", "Tigard"],
  "PA": ["Allentown", "Bethlehem", "Chester", "Erie", "Harrisburg", "Lancaster", "Norristown", "Philadelphia", "Pittsburgh", "Reading", "Scranton", "Upper Darby", "York"],
  "RI": ["Central Falls", "Cranston", "East Providence", "Newport", "Pawtucket", "Providence", "Warwick", "West Warwick", "Woonsocket"],
  "SC": ["Aiken", "Anderson", "Charleston", "Columbia", "Florence", "Fort Mill", "Goose Creek", "Greenville", "Hilton Head Island", "Mount Pleasant", "Myrtle Beach", "North Charleston", "Rock Hill", "Spartanburg", "Summerville", "Sumter"],
  "SD": ["Aberdeen", "Brandon", "Brookings", "Huron", "Mitchell", "Pierre", "Rapid City", "Sioux Falls", "Spearfish", "Vermillion", "Watertown", "Yankton"],
  "TN": ["Bartlett", "Brentwood", "Bristol", "Chattanooga", "Clarksville", "Cleveland", "Collierville", "Columbia", "Cookeville", "Franklin", "Gallatin", "Germantown", "Hendersonville", "Jackson", "Johnson City", "Kingsport", "Knoxville", "Memphis", "Morristown", "Murfreesboro", "Nashville", "Oak Ridge", "Smyrna"],
  "TX": ["Abilene", "Allen", "Amarillo", "Arlington", "Austin", "Baytown", "Beaumont", "Brownsville", "Bryan", "Carrollton", "College Station", "Conroe", "Corpus Christi", "Dallas", "Denton", "El Paso", "Fort Worth", "Frisco", "Galveston", "Garland", "Grand Prairie", "Houston", "Irving", "Killeen", "Laredo", "League City", "Lewisville", "Lubbock", "McAllen", "McKinney", "Mesquite", "Midland", "Odessa", "Pasadena", "Pearland", "Plano", "Richardson", "Round Rock", "San Antonio", "Sugar Land", "Tyler", "Waco", "Wichita Falls"],
  "UT": ["Bountiful", "Cedar City", "Clearfield", "Draper", "Layton", "Logan", "Midvale", "Murray", "Ogden", "Orem", "Provo", "Salt Lake City", "Sandy", "South Jordan", "St. George", "Taylorsville", "West Jordan", "West Valley City"],
  "VT": ["Barre", "Brattleboro", "Burlington", "Colchester", "Essex", "Montpelier", "Rutland", "South Burlington", "St. Albans", "Winooski"],
  "VA": ["Alexandria", "Chesapeake", "Hampton", "Lynchburg", "Newport News", "Norfolk", "Portsmouth", "Richmond", "Roanoke", "Suffolk", "Virginia Beach"],
  "WA": ["Auburn", "Bellevue", "Bellingham", "Bothell", "Bremerton", "Burien", "Edmonds", "Everett", "Federal Way", "Kennewick", "Kent", "Kirkland", "Lakewood", "Lynnwood", "Marysville", "Olympia", "Pasco", "Puyallup", "Redmond", "Renton", "Richland", "Seattle", "Shoreline", "Spokane", "Spokane Valley", "Tacoma", "Vancouver", "Walla Walla", "Yakima"],
  "WV": ["Charleston", "Huntington", "Martinsburg", "Morgantown", "Parkersburg", "Shepherdstown", "Wheeling"],
  "WI": ["Appleton", "Eau Claire", "Fond du Lac", "Green Bay", "Janesville", "Kenosha", "La Crosse", "Madison", "Milwaukee", "Neenah", "Oshkosh", "Racine", "Sheboygan", "Waukesha", "Wauwatosa", "West Allis"],
  "WY": ["Casper", "Cheyenne", "Cody", "Gillette", "Green River", "Jackson", "Laramie", "Rawlins", "Rock Springs", "Sheridan"]
};

const stateOptions = Object.keys(statesAndCities).map(state => ({
  value: state,
  label: state
}));

export function QuickRequest({ onSubmit }: QuickRequestProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<QuickRequestData>({
    category: "",
    urgency: "",
    state: "",
    city: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.category && formData.city) {
      onSubmit(formData);
      setIsOpen(false);
      setFormData({
        category: "",
        urgency: "",
        state: "",
        city: ""
      });
    }
  };

  const updateField = (field: keyof QuickRequestData, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      // Clear city when state changes
      if (field === 'state') {
        newData.city = '';
      }
      return newData;
    });
  };

  // Get cities for selected state
  const availableCities = formData.state ? statesAndCities[formData.state as keyof typeof statesAndCities] || [] : [];

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        data-testid="quick-request-button"
      >
        <MessageSquare className="h-6 w-6" />
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            
            {/* Modal Content */}
            <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-slate-800 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto border border-slate-700 pointer-events-auto"
              >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Quick Request</h2>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-6 w-6" />
                </motion.button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Service Category */}
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Service Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => updateField("category", e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    required
                    data-testid="category-select"
                  >
                    <option value="">Select a service...</option>
                    {serviceCategories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                {/* Urgency */}
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    When do you need this?
                  </label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => updateField("urgency", e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    data-testid="urgency-select"
                  >
                    <option value="">Select timeframe...</option>
                    {urgencyOptions.map(urgency => (
                      <option key={urgency.value} value={urgency.value}>{urgency.label}</option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">
                      State *
                    </label>
                    <select
                      value={formData.state}
                      onChange={(e) => updateField("state", e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      required
                      data-testid="state-select"
                    >
                      <option value="">Select state...</option>
                      {stateOptions.map(state => (
                        <option key={state.value} value={state.value}>{state.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">
                      City *
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:opacity-50"
                      required
                      disabled={!formData.state}
                      data-testid="city-select"
                    >
                      <option value="">
                        {formData.state ? "Select city..." : "Select state first..."}
                      </option>
                      {availableCities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center space-x-2 mt-6"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  data-testid="submit-button"
                >
                  <Send className="h-4 w-4" />
                  <span>Find Services</span>
                </motion.button>
              </form>
            </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}