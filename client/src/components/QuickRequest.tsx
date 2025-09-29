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
  "AL": ["Birmingham", "Montgomery", "Mobile", "Huntsville", "Tuscaloosa"],
  "AK": ["Anchorage", "Fairbanks", "Juneau", "Sitka", "Ketchikan"],
  "AZ": ["Phoenix", "Tucson", "Mesa", "Chandler", "Scottsdale", "Glendale", "Tempe"],
  "AR": ["Little Rock", "Fort Smith", "Fayetteville", "Springdale", "Jonesboro"],
  "CA": ["Los Angeles", "San Francisco", "San Diego", "San Jose", "Oakland", "Sacramento", "Long Beach", "Fresno", "Bakersfield", "Anaheim", "Santa Ana", "Riverside"],
  "CO": ["Denver", "Colorado Springs", "Aurora", "Fort Collins", "Lakewood", "Thornton"],
  "CT": ["Hartford", "New Haven", "Stamford", "Bridgeport", "Waterbury"],
  "DE": ["Wilmington", "Dover", "Newark", "Middletown", "Smyrna"],
  "FL": ["Miami", "Tampa", "Orlando", "Jacksonville", "St. Petersburg", "Hialeah", "Tallahassee", "Fort Lauderdale", "Port St. Lucie", "Cape Coral"],
  "GA": ["Atlanta", "Augusta", "Columbus", "Macon", "Savannah", "Athens"],
  "HI": ["Honolulu", "Pearl City", "Hilo", "Kailua", "Waipahu"],
  "ID": ["Boise", "Meridian", "Nampa", "Idaho Falls", "Pocatello"],
  "IL": ["Chicago", "Aurora", "Peoria", "Rockford", "Joliet", "Naperville", "Springfield", "Elgin"],
  "IN": ["Indianapolis", "Fort Wayne", "Evansville", "South Bend", "Carmel", "Fishers"],
  "IA": ["Des Moines", "Cedar Rapids", "Davenport", "Sioux City", "Iowa City"],
  "KS": ["Wichita", "Overland Park", "Kansas City", "Topeka", "Olathe"],
  "KY": ["Louisville", "Lexington", "Bowling Green", "Owensboro", "Covington"],
  "LA": ["New Orleans", "Baton Rouge", "Shreveport", "Metairie", "Lafayette"],
  "ME": ["Portland", "Lewiston", "Bangor", "South Portland", "Auburn"],
  "MD": ["Baltimore", "Frederick", "Rockville", "Gaithersburg", "Bowie", "Annapolis"],
  "MA": ["Boston", "Worcester", "Springfield", "Lowell", "Cambridge", "New Bedford"],
  "MI": ["Detroit", "Grand Rapids", "Warren", "Sterling Heights", "Lansing", "Ann Arbor"],
  "MN": ["Minneapolis", "Saint Paul", "Rochester", "Duluth", "Bloomington"],
  "MS": ["Jackson", "Gulfport", "Southaven", "Hattiesburg", "Biloxi"],
  "MO": ["Kansas City", "Saint Louis", "Springfield", "Independence", "Columbia"],
  "MT": ["Billings", "Missoula", "Great Falls", "Bozeman", "Butte"],
  "NE": ["Omaha", "Lincoln", "Bellevue", "Grand Island", "Kearney"],
  "NV": ["Las Vegas", "Henderson", "Reno", "North Las Vegas", "Sparks"],
  "NH": ["Manchester", "Nashua", "Concord", "Derry", "Rochester"],
  "NJ": ["Newark", "Jersey City", "Paterson", "Elizabeth", "Edison", "Woodbridge"],
  "NM": ["Albuquerque", "Las Cruces", "Rio Rancho", "Santa Fe", "Roswell"],
  "NY": ["New York City", "Buffalo", "Rochester", "Yonkers", "Syracuse", "Albany", "New Rochelle", "Mount Vernon"],
  "NC": ["Charlotte", "Raleigh", "Greensboro", "Durham", "Winston-Salem", "Fayetteville"],
  "ND": ["Fargo", "Bismarck", "Grand Forks", "Minot", "West Fargo"],
  "OH": ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Akron", "Dayton"],
  "OK": ["Oklahoma City", "Tulsa", "Norman", "Broken Arrow", "Lawton"],
  "OR": ["Portland", "Salem", "Eugene", "Gresham", "Hillsboro", "Beaverton"],
  "PA": ["Philadelphia", "Pittsburgh", "Allentown", "Erie", "Reading", "Scranton"],
  "RI": ["Providence", "Warwick", "Cranston", "Pawtucket", "East Providence"],
  "SC": ["Columbia", "Charleston", "North Charleston", "Mount Pleasant", "Rock Hill"],
  "SD": ["Sioux Falls", "Rapid City", "Aberdeen", "Brookings", "Watertown"],
  "TN": ["Nashville", "Memphis", "Knoxville", "Chattanooga", "Clarksville"],
  "TX": ["Houston", "San Antonio", "Dallas", "Austin", "Fort Worth", "El Paso", "Arlington", "Corpus Christi", "Plano", "Laredo"],
  "UT": ["Salt Lake City", "West Valley City", "Provo", "West Jordan", "Orem"],
  "VT": ["Burlington", "Essex", "South Burlington", "Colchester", "Rutland"],
  "VA": ["Virginia Beach", "Norfolk", "Chesapeake", "Richmond", "Newport News", "Alexandria"],
  "WA": ["Seattle", "Spokane", "Tacoma", "Vancouver", "Bellevue", "Kent"],
  "WV": ["Charleston", "Huntington", "Morgantown", "Parkersburg", "Wheeling"],
  "WI": ["Milwaukee", "Madison", "Green Bay", "Kenosha", "Racine"],
  "WY": ["Cheyenne", "Casper", "Laramie", "Gillette", "Rock Springs"]
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