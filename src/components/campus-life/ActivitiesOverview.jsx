import React from "react";
import { motion } from "framer-motion";

const ActivitiesOverview = ({ activities, onJoinClick }) => {
  return (
    <section className="section-padding bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Get <span className="text-gradient">Involved</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            With hundreds of opportunities to get involved, you'll find your
            place in our diverse campus community.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 text-center card-hover cursor-pointer"
              onClick={onJoinClick}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                <activity.icon className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {activity.count}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {activity.category}
              </h3>
              <p className="text-gray-600 mb-4">{activity.description}</p>
              <ul className="text-sm text-gray-500 space-y-1">
                {activity.items.map((item, idx) => (
                  <li key={idx} className="flex items-center justify-center">
                    <div className="w-1 h-1 bg-yellow-600 rounded-full mr-2"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ActivitiesOverview;
