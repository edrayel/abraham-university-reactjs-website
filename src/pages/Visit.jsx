import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  CalendarDays,
  Users,
  Camera,
  ArrowRight,
  Info,
  Coffee,
  Building,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import useVisitorStore from "@/stores/useVisitorStore";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import LoadingState from "@/components/common/LoadingState";

const Visit = () => {
  const {
    campusTours,
    campusHighlights,
    visitorInformation,
    directionsParking,
    accommodations,
    contactInfo,
    isLoading,
    error,
    fetchAllData,
  } = useVisitorStore();
  // Removed unused selectedDate state

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Static icon mapping for visitOptions to match original component
  const visitIconMap = {
    "campus tours": Users,
    "information sessions": Info,
    "department visits": Building,
    "virtual tour": Camera,
  };

  // Map JSON campus_tours to visitOptions format
  const mappedVisitOptions = campusTours.map((tour) => ({
    id: tour.name.toLowerCase().replace(/\s+/g, "-"),
    title: tour.name,
    icon: visitIconMap[tour.name.toLowerCase()] || Users, // Fallback to Users
    description: tour.description,
    duration: tour.duration,
    image: `https://source.unsplash.com/random/600x400/?${tour.name
      .toLowerCase()
      .replace(/\s+/g, "-")}`,
    features: tour.schedule
      ? tour.schedule.split("\r\n").filter((item) => item.trim())
      : [],
    booking_url: tour.booking_url || null,
  }));

  // Map JSON campus_highlights to campusHighlights format
  const mappedCampusHighlights = campusHighlights.map((highlight) => ({
    name: highlight.name,
    image:
      highlight.image_url ||
      `https://source.unsplash.com/random/400x300/?${highlight.name
        .toLowerCase()
        .replace(/\s+/g, "-")}`,
    description: highlight.description,
  }));

  // Use contactInfo and directionsParking for address and contact details
  const address = directionsParking && directionsParking.length > 0 && directionsParking[0].address
    ? directionsParking[0].address
    : contactInfo.visitor_center_location
    ? `${contactInfo.visitor_center_location}, Education City, EC 12345`
    : "123 University Avenue, Education City, EC 12345";

  const contactEmail =
    contactInfo.visitor_center_email || contactInfo.admissions_email || "admissions@abrahamuniversity.edu";

  const contactPhone = 
    contactInfo.visitor_center_phone || contactInfo.admissions_phone || "+1 555 123 4567";

  const visitorCenterHours = 
    contactInfo.visitor_center_hours || "Mon-Fri (9am-5pm)";

  const handleScheduleVisit = (visitType, bookingUrl) => {
    if (bookingUrl) {
      window.location.href = bookingUrl; // Redirect to booking URL
    } else {
      toast({
        title: `🚧 Schedule ${visitType}`,
        description: `Online scheduling for ${visitType.toLowerCase()} isn't implemented yet. Please contact admissions. 🚀`,
      });
    }
  };

  const handleDirectionsClick = () => {
    toast({
      title: "🚧 Get Directions",
      description:
        "This feature isn’t implemented yet. Our address is " +
        address +
        ". 🚀",
    });
  };

  if (isLoading) {
    return <LoadingState type="page" message="Loading visit information..." />;
  }

  if (error) {
    return (
      <ErrorBoundary
        error={error}
        message="We're having trouble loading visit information right now. Please try again."
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!mappedVisitOptions.length && !mappedCampusHighlights.length) {
    return (
      <div className="min-h-screen bg-gray-50 text-center">
        No visit data available.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style>
        {`
          .card-hover {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .card-hover:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
          }
          .animate-pulse {
            animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
        `}
      </style>

      {/* Hero Section */}
      <section className="section-padding hero-gradient">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white max-w-4xl mx-auto"
          >

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Visit Abraham University
            </h1>
            <p className="text-xl text-white/80 leading-relaxed mb-8">
              Experience our vibrant campus, meet our community, and discover
              why Abraham University is the perfect place for your academic
              journey.
            </p>
            <Button
              size="lg"
              onClick={() =>
                handleScheduleVisit(
                  "Campus Tour",
                  mappedVisitOptions.find((opt) => opt.title === "Campus Tours")
                    ?.booking_url
                )
              }
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 hover:from-yellow-500 hover:to-yellow-700 text-lg px-10 py-4 rounded-md font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Schedule Your Visit
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Visit Options Section */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Ways to{" "}
              <span className="text-gradient">Experience Our Campus</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the visit option that best suits your interests and
              schedule. We look forward to welcoming you!
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mappedVisitOptions.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden card-hover group flex flex-col"
                role="presentation"
              >
                <div className="h-64 relative overflow-hidden">
                  <img
                    src={option.image}
                    alt={option.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                    <option.icon className="h-16 w-16 text-white opacity-70 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-3 group-hover:text-gradient transition-colors">
                    {option.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    <CalendarDays className="inline h-4 w-4 mr-1 text-yellow-600" />{" "}
                    {option.duration}
                  </p>
                  <p className="text-gray-600 mb-4 flex-grow">
                    {option.description}
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1 mb-4">
                    {option.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <ArrowRight className="h-3 w-3 mr-2 text-yellow-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() =>
                      handleScheduleVisit(option.title, option.booking_url)
                    }
                    className="w-full mt-auto bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-gray-900 rounded-md"
                    asChild={option.booking_url}
                  >
                    {option.booking_url ? (
                      <a
                        href={option.booking_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Schedule ${option.title}`}
                      >
                        {option.id === "virtual-tour"
                          ? "Take Virtual Tour"
                          : "Schedule Visit"}
                      </a>
                    ) : (
                      <>
                        {option.id === "virtual-tour"
                          ? "Take Virtual Tour"
                          : "Schedule Visit"}
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Campus Highlights Section */}
      <section className="section-padding bg-gray-100">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Campus <span className="text-gradient">Highlights</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover some of the most iconic and beloved spots on our historic
              campus.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {mappedCampusHighlights.map((highlight, index) => (
              <motion.div
                key={highlight.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden card-hover group"
                role="presentation"
              >
                <div className="h-56 relative overflow-hidden">
                  <img
                    src={highlight.image}
                    alt={highlight.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-gradient transition-colors">
                    {highlight.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {highlight.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Visitor Information Section */}
      {visitorInformation && visitorInformation.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Visitor <span className="text-gradient">Information</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Important information to help you prepare for your visit.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visitorInformation.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white rounded-xl shadow-lg p-6 card-hover ${
                    info.important ? 'border-2 border-yellow-400' : ''
                  }`}
                >
                  <div className="flex items-center mb-4">
                    <Info className="h-8 w-8 text-yellow-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-800">
                      {info.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-4">{info.content}</p>
                  {info.link_url && (
                    <Button
                      asChild
                      variant="outline"
                      className="border-yellow-600 text-yellow-600 hover:bg-yellow-100"
                    >
                      <a
                        href={info.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {info.link_text || 'Learn More'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Directions & Parking Section */}
      {directionsParking && directionsParking.length > 0 && (
        <section className="section-padding bg-gray-100">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Directions & <span className="text-gradient">Parking</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Find your way to campus and learn about parking options.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {directionsParking.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-6 card-hover"
                >
                  <div className="flex items-center mb-4">
                    <MapPin className="h-8 w-8 text-yellow-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-800">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  {item.address && (
                    <p className="text-sm text-gray-500 mb-2">
                      <strong>Address:</strong> {item.address}
                    </p>
                  )}
                  {item.hours && (
                    <p className="text-sm text-gray-500 mb-2">
                      <strong>Hours:</strong> {item.hours}
                    </p>
                  )}
                  {item.cost && (
                    <p className="text-sm text-gray-500 mb-4">
                      <strong>Cost:</strong> {item.cost}
                    </p>
                  )}
                  {item.map_url && (
                    <Button
                      asChild
                      className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-gray-900"
                    >
                      <a
                        href={item.map_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View on Map
                        <MapPin className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Accommodations Section */}
      {accommodations && accommodations.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                <span className="text-gradient">Accommodations</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Comfortable places to stay during your visit to campus.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {accommodations.map((accommodation, index) => (
                <motion.div
                  key={accommodation.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white rounded-xl shadow-lg p-6 card-hover ${
                    accommodation.recommended ? 'border-2 border-yellow-400' : ''
                  }`}
                >
                  <div className="flex items-center mb-4">
                    <Building className="h-8 w-8 text-yellow-600 mr-3" />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {accommodation.name}
                      </h3>
                      {accommodation.recommended && (
                        <span className="text-sm text-yellow-600 font-medium">
                          Recommended
                        </span>
                      )}
                    </div>
                  </div>
                  {accommodation.description && (
                    <p className="text-gray-600 mb-4">{accommodation.description}</p>
                  )}
                  {accommodation.address && (
                    <p className="text-sm text-gray-500 mb-2">
                      <strong>Address:</strong> {accommodation.address}
                    </p>
                  )}
                  {accommodation.phone && (
                    <p className="text-sm text-gray-500 mb-2">
                      <strong>Phone:</strong> {accommodation.phone}
                    </p>
                  )}
                  {accommodation.price_range && (
                    <p className="text-sm text-gray-500 mb-2">
                      <strong>Price:</strong> {accommodation.price_range}
                    </p>
                  )}
                  {accommodation.amenities && (
                    <p className="text-sm text-gray-500 mb-4">
                      <strong>Amenities:</strong> {accommodation.amenities}
                    </p>
                  )}
                  {accommodation.website && (
                    <Button
                      asChild
                      variant="outline"
                      className="border-yellow-600 text-yellow-600 hover:bg-yellow-100 w-full"
                    >
                      <a
                        href={accommodation.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit Website
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Plan Your Visit Section */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-yellow-50 p-8 md:p-12 rounded-xl shadow-xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                Plan Your Visit
              </h2>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-gray-700 mb-4">
                    We are located at: <br />
                    <strong className="text-gradient">{address}</strong>
                  </p>
                  <p className="text-gray-700 mb-6">
                    Find information about parking, accommodations, and local
                    attractions to make your visit enjoyable.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={handleDirectionsClick}
                      className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-gray-900"
                    >
                      <MapPin className="mr-2 h-5 w-5" /> Get Directions
                    </Button>
                    <Button
                      variant="outline"
                      className="border-yellow-600 text-yellow-600 hover:bg-yellow-100"
                      onClick={() =>
                        handleScheduleVisit(
                          "Campus Tour",
                          mappedVisitOptions.find(
                            (opt) => opt.title === "Campus Tours"
                          )?.booking_url
                        )
                      }
                    >
                      <CalendarDays className="mr-2 h-5 w-5" /> View Visit
                      Calendar
                    </Button>
                  </div>
                </div>
                <div className="rounded-lg overflow-hidden shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1580582932707-520769456160?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
                    alt="Map showing university location"
                    className="w-full h-64 object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact for Visits */}
      <section className="section-padding hero-gradient text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="max-w-5xl mx-auto"
          >
            <div className="text-center mb-12">
              <Coffee className="h-12 w-12 mx-auto mb-6 text-sky-300" />
              <h2 className="text-3xl font-bold mb-4">
                Questions About Visiting?
              </h2>
              <p className="text-xl text-white/80 leading-relaxed">
                Our team is happy to assist you with planning your visit or answering any questions you may have.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Visitor Center */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <Info className="h-8 w-8 mx-auto mb-4 text-yellow-400" />
                <h3 className="text-xl font-semibold mb-3">Visitor Center</h3>
                {contactPhone && (
                  <p className="text-white/80 mb-2">
                    <strong>Phone:</strong> {contactPhone}
                  </p>
                )}
                {contactEmail && (
                  <p className="text-white/80 mb-2">
                    <strong>Email:</strong> {contactEmail}
                  </p>
                )}
                {visitorCenterHours && (
                  <p className="text-white/80 mb-4">
                    <strong>Hours:</strong> {visitorCenterHours}
                  </p>
                )}
                <Button
                  asChild
                  size="sm"
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 hover:from-yellow-500 hover:to-yellow-700"
                >
                  <a href={`mailto:${contactEmail}`}>
                    Contact Us
                  </a>
                </Button>
              </div>
              
              {/* Admissions */}
              {contactInfo.admissions_email && (
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                  <Users className="h-8 w-8 mx-auto mb-4 text-yellow-400" />
                  <h3 className="text-xl font-semibold mb-3">Admissions</h3>
                  {contactInfo.admissions_phone && (
                    <p className="text-white/80 mb-2">
                      <strong>Phone:</strong> {contactInfo.admissions_phone}
                    </p>
                  )}
                  <p className="text-white/80 mb-4">
                    <strong>Email:</strong> {contactInfo.admissions_email}
                  </p>
                  <Button
                    asChild
                    size="sm"
                    className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 hover:from-yellow-500 hover:to-yellow-700"
                  >
                    <a href={`mailto:${contactInfo.admissions_email}`}>
                      Contact Admissions
                    </a>
                  </Button>
                </div>
              )}
              
              {/* Emergency Contact */}
              {contactInfo.emergency_contact && (
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                  <Phone className="h-8 w-8 mx-auto mb-4 text-red-400" />
                  <h3 className="text-xl font-semibold mb-3">Emergency</h3>
                  <p className="text-white/80 mb-2">
                    <strong>Emergency:</strong> {contactInfo.emergency_contact}
                  </p>
                  {contactInfo.campus_security && (
                    <p className="text-white/80 mb-4">
                      <strong>Security:</strong> {contactInfo.campus_security}
                    </p>
                  )}
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                  >
                    <a href={`tel:${contactInfo.emergency_contact}`}>
                      Call Emergency
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Visit;
