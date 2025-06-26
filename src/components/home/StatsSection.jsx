import React from "react";
import { motion } from "framer-motion";
import { Users, BookOpen, Award, Globe } from "lucide-react";
import useUniversityStore from "@/stores/homeStore";

const iconMap = {
  users: Users,
  book_open: BookOpen,
  award: Award,
  globe: Globe,
  // Add more mappings if needed for other icons
};

const StatsSection = () => {
  const { statistics, isLoading, error, fetchAllData } = useUniversityStore();

  // Fetch data on component mount
  // useEffect(() => {
  //   fetchAllData();
  // }, [fetchAllData]);

  // Map JSON statistics to the component's expected format
  const statsData = statistics.map((stat) => ({
    number: stat.value,
    label: stat.label,
    icon: iconMap[stat.icon.toLowerCase()] || Globe, // Fallback to Globe if icon not found
  }));

  // if (isLoading) {
  //   return <div>Loading statistics...</div>;
  // }

  // if (error) {
  //   return <div>Error: {error}</div>;
  // }

  // if (!statsData.length) {
  //   return <div>No statistics available.</div>;
  // }

  return (
    <div className="py-12 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex justify-center mb-4">
                {stat.icon && <stat.icon className="h-8 w-8 text-blue-600" />}
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {stat.number}
              </h3>
              <p className="mt-2 text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsSection;

// const statsData = [
//   { number: '25,000+', label: 'Students', icon: Users },
//   { number: '500+', label: 'Programs', icon: BookOpen },
//   { number: '98%', label: 'Graduate Success Rate', icon: Award },
//   { number: '50+', label: 'Countries Represented', icon: Globe },
// ];

// const StatsSection = () => {
//   return (
//     <section className="py-16 bg-white">
//       <div className="container mx-auto px-4">
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//           {statsData.map((stat, index) => (
//             <motion.div
//               key={stat.label}
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true, amount: 0.5 }}
//               transition={{ delay: index * 0.1 }}
//               className="text-center p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow"
//             >
//               <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
//                 <stat.icon className="h-8 w-8 text-blue-700" />
//               </div>
//               <div className="text-3xl font-bold text-gray-800 mb-1">{stat.number}</div>
//               <div className="text-gray-600 text-sm">{stat.label}</div>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default StatsSection;
