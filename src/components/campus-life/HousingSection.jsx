// import React, { useEffect } from "react";
import { motion } from "framer-motion";
// import useCampusStore from "./useCampusStore";
import useCampusStore from "@/stores/useCampusStore";
// Adjust the import path as needed

const HousingSection = ({ onHousingClick }) => {
  const { housingOptions, isLoading, error, fetchAllData } = useCampusStore();

  // // Fetch data on component mount
  // useEffect(() => {
  //   fetchAllData();
  // }, [fetchAllData]);

  // Map JSON housing_options to component format
  const mappedHousingOptions = housingOptions.map((option) => ({
    name: option.name,
    type: option.type,
    capacity: `${option.capacity} students`, // Format capacity for display
    features: option.amenities
      ? option.amenities
          .split(",\r\n")
          .map((item) => item.trim())
          .filter((item) => item)
      : [], // Split amenities into array, remove empty items
    image:
      option.image_url ||
      "https://images.unsplash.com/photo-1595872018818-97555653a011", // Fallback image
  }));

  // if (isLoading) {
  //   return (
  //     <section className="section-padding bg-gray-50">
  //       <div className="container mx-auto px-4 text-center">
  //         Loading housing options...
  //       </div>
  //     </section>
  //   );
  // }

  // if (error) {
  //   return (
  //     <section className="section-padding bg-gray-50">
  //       <div className="container mx-auto px-4 text-center">Error: {error}</div>
  //     </section>
  //   );
  // }

  if (!mappedHousingOptions.length) {
    return (
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          No housing options available.
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Campus <span className="text-gradient">Housing</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find your home away from home in our diverse housing options
            designed for every lifestyle.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {mappedHousingOptions.map((option, index) => (
            <motion.div
              key={option.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden card-hover cursor-pointer"
              onClick={onHousingClick}
            >
              <div className="h-48 bg-gradient-to-br from-yellow-500 to-yellow-600 relative overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  alt={option.name}
                  src={option.image}
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 text-yellow-600 px-3 py-1 rounded-full text-sm font-medium">
                    {option.type}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {option.name}
                </h3>
                <p className="text-yellow-600 font-medium mb-3">
                  {option.capacity}
                </p>
                <ul className="space-y-2">
                  {option.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start text-sm text-gray-600"
                    >
                      <div className="w-2 h-2 bg-yellow-600 rounded-full mr-2 mt-1.5"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HousingSection;
