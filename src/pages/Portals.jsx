import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Briefcase, UserCheck, UserCog, Building, LogIn, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const portalCategories = [
  {
    title: 'Students & Family',
    icon: Users,
    color: 'blue',
    portals: [
      { name: 'Student Portal', userType: 'student', description: 'Access grades, courses, and student services.' },
      { name: 'Parent Portal', userType: 'parent', description: 'View student progress and university updates.' },
      { name: 'Alumni Portal', userType: 'alumni', description: 'Connect with fellow alumni and access resources.' },
    ],
  },
  {
    title: 'Faculty & Staff',
    icon: Briefcase,
    color: 'green',
    portals: [
      { name: 'Faculty Portal', userType: 'faculty', description: 'Manage courses, research, and academic resources.' },
      { name: 'Employee Portal', userType: 'employee', description: 'Access HR information, benefits, and payroll.' },
    ],
  },
  {
    title: 'Partners & Administration',
    icon: Building,
    color: 'purple',
    portals: [
      { name: 'Vendor Portal', userType: 'vendor', description: 'Manage contracts, invoices, and communications.' },
      { name: 'Admin Portal', userType: 'admin', description: 'Access administrative tools and system management.' },
    ],
  },
];

const Portals = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="pt-60 pb-40 hero-gradient">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white max-w-4xl mx-auto">
          

            <h1 className="text-5xl md:text-6xl font-bold mb-6">University Portals</h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Access your dedicated portal to find resources, manage information, and connect with the Abraham University community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Portal Categories */}
      <section className="section-padding">
        <div className="container mx-auto px-4">
          {portalCategories.map((category, catIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: catIndex * 0.2 }}
              className="mb-16"
            >
              <div className="flex items-center mb-8">
                <category.icon className={`h-10 w-10 mr-4 text-${category.color}-600`} />
                <h2 className={`text-3xl font-bold text-gray-900`}>{category.title}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.portals.map((portal, portalIndex) => (
                  <motion.div
                    key={portal.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: (catIndex * 0.2) + (portalIndex * 0.1) }}
                    className={`bg-white rounded-xl shadow-xl overflow-hidden card-hover border-t-4 border-${category.color}-500`}
                  >
                    <div className="p-8">
                      <div className="flex items-center mb-4">
                        {portal.userType === 'student' && <Users className={`h-8 w-8 mr-3 text-${category.color}-500`} />}
                        {portal.userType === 'parent' && <UserCheck className={`h-8 w-8 mr-3 text-${category.color}-500`} />}
                        {portal.userType === 'alumni' && <UserCog className={`h-8 w-8 mr-3 text-${category.color}-500`} />}
                        {portal.userType === 'faculty' && <Briefcase className={`h-8 w-8 mr-3 text-${category.color}-500`} />}
                        {portal.userType === 'employee' && <UserCheck className={`h-8 w-8 mr-3 text-${category.color}-500`} />}
                        {portal.userType === 'vendor' && <Building className={`h-8 w-8 mr-3 text-${category.color}-500`} />}
                        {portal.userType === 'admin' && <UserCog className={`h-8 w-8 mr-3 text-${category.color}-500`} />}
                        <h3 className="text-2xl font-semibold text-gray-900">{portal.name}</h3>
                      </div>
                      <p className="text-gray-600 mb-6">{portal.description}</p>
                      <Button asChild className={`w-full bg-gradient-to-r from-${category.color}-500 to-${category.color}-600 hover:from-${category.color}-600 hover:to-${category.color}-700 text-white`}>
                        <Link to={`/webapp/${portal.userType}`}>
                          Access {portal.name}
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* General Info / Help */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4 text-center">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Need Help?</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                    If you're having trouble accessing your portal or have any questions, please contact our support team.
                </p>
                <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600">
                    <Link to="/contact">Contact Support</Link>
                </Button>
            </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Portals;