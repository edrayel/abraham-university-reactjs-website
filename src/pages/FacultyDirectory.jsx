import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, Building2, Mail, Phone, MapPin, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import LoadingState from '@/components/common/LoadingState';
import EmptyState from '@/components/common/EmptyState';
import apiService from '@/services/apiService';

const FacultyDirectory = () => {
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [departments, setDepartments] = useState([]);
  const [facultyData, setFacultyData] = useState([]);
  const [filteredFaculty, setFilteredFaculty] = useState([]);
  const [expandedFaculty, setExpandedFaculty] = useState(null);
  
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch faculty data from API
  const fetchFacultyData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.get('/faculty');
      if (response && response.departments) {
        setDepartments(response.departments);
        
        // Flatten faculty data from all departments
        const allFaculty = [];
        response.departments.forEach(dept => {
          if (dept.faculty && Array.isArray(dept.faculty)) {
            dept.faculty.forEach(member => {
              allFaculty.push({
                ...member,
                departmentName: dept.name
              });
            });
          }
        });
        
        setFacultyData(allFaculty);
        setFilteredFaculty(allFaculty);
      }
    } catch (err) {
      console.error('Error fetching faculty data:', err);
      setError('Failed to load faculty data. Please try again later.');
      toast({
        title: 'Error',
        description: 'Failed to load faculty data. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter faculty based on search term and selected department
  const filterFaculty = () => {
    let filtered = [...facultyData];
    
    // Filter by department
    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(faculty => {
        return faculty.departments.some(dept => dept.id.toString() === selectedDepartment);
      });
    }
    
    // Filter by search term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(faculty => {
        return (
          faculty.title.toLowerCase().includes(term) ||
          faculty.position?.toLowerCase().includes(term) ||
          faculty.departmentName?.toLowerCase().includes(term) ||
          faculty.research_interests?.some(interest => interest.toLowerCase().includes(term))
        );
      });
    }
    
    setFilteredFaculty(filtered);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle department filter change
  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
  };

  // Toggle expanded faculty member
  const toggleExpandFaculty = (id) => {
    setExpandedFaculty(expandedFaculty === id ? null : id);
  };

  // Handle email click
  const handleEmailClick = (email) => {
    window.location.href = `mailto:${email}`;
  };

  // Handle profile click
  const handleProfileClick = (permalink) => {
    window.open(permalink, '_blank');
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchFacultyData();
  }, []);

  // Filter faculty when search term or department changes
  useEffect(() => {
    filterFaculty();
  }, [searchTerm, selectedDepartment, facultyData]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="pt-60 pb-40 hero-gradient">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Faculty Directory</h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Meet our distinguished faculty members who are leaders in their fields,
              dedicated to excellence in teaching, research, and service.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white shadow-md sticky top-20 z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name, position, or research interest"
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 py-6 rounded-md border-gray-300 w-full"
              />
            </div>
            <div className="w-full md:w-64">
              <select
                value={selectedDepartment}
                onChange={handleDepartmentChange}
                className="w-full h-12 px-4 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id.toString()}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Faculty Listing Section */}
      <section className="section-padding">
        <div className="container mx-auto px-4">
          <ErrorBoundary>
            {loading ? (
              <LoadingState />
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500 text-lg">{error}</p>
                <Button
                  onClick={fetchFacultyData}
                  className="mt-4 bg-yellow-600 hover:bg-yellow-700"
                >
                  Try Again
                </Button>
              </div>
            ) : filteredFaculty.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {filteredFaculty.map((faculty) => (
                  <motion.div
                    key={faculty.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                  >
                    <div className="p-6 flex flex-col md:flex-row gap-6">
                      {/* Faculty Image */}
                      <div className="md:w-1/4 lg:w-1/5">
                        <div className="aspect-square rounded-full overflow-hidden bg-gray-200">
                          {faculty.featured_image ? (
                            <img
                              src={faculty.featured_image}
                              alt={faculty.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/200?text=Faculty';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-yellow-100 text-yellow-800">
                              <Users size={40} />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Faculty Info */}
                      <div className="md:w-3/4 lg:w-4/5">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{faculty.title}</h2>
                            {faculty.position && (
                              <p className="text-yellow-700 font-medium mb-2">{faculty.position}</p>
                            )}
                            <p className="text-gray-600 mb-4">{faculty.departmentName}</p>
                          </div>
                          <Button
                            variant="outline"
                            className="self-start mt-2 md:mt-0"
                            onClick={() => toggleExpandFaculty(faculty.id)}
                          >
                            {expandedFaculty === faculty.id ? (
                              <>
                                Less Info <ChevronUp className="ml-2 h-4 w-4" />
                              </>
                            ) : (
                              <>
                                More Info <ChevronDown className="ml-2 h-4 w-4" />
                              </>
                            )}
                          </Button>
                        </div>
                        
                        {/* Contact Info */}
                        <div className="flex flex-wrap gap-4 mt-2 mb-4">
                          {faculty.email && (
                            <div 
                              className="flex items-center text-gray-600 hover:text-yellow-700 cursor-pointer"
                              onClick={() => handleEmailClick(faculty.email)}
                            >
                              <Mail className="h-4 w-4 mr-2" />
                              <span>{faculty.email}</span>
                            </div>
                          )}
                          {faculty.phone && (
                            <div className="flex items-center text-gray-600">
                              <Phone className="h-4 w-4 mr-2" />
                              <span>{faculty.phone}</span>
                            </div>
                          )}
                          {faculty.office_location && (
                            <div className="flex items-center text-gray-600">
                              <MapPin className="h-4 w-4 mr-2" />
                              <span>{faculty.office_location}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Expanded Info */}
                        {expandedFaculty === faculty.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 border-t pt-4"
                          >
                            {faculty.education && faculty.education.length > 0 && (
                              <div className="mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Education</h3>
                                <ul className="list-disc list-inside text-gray-600 space-y-1">
                                  {faculty.education.map((edu, index) => (
                                    <li key={index}>{edu}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {faculty.research_interests && faculty.research_interests.length > 0 && (
                              <div className="mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Research Interests</h3>
                                <div className="flex flex-wrap gap-2">
                                  {faculty.research_interests.map((interest, index) => (
                                    <span 
                                      key={index}
                                      className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm"
                                    >
                                      {interest}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {faculty.publications && faculty.publications.length > 0 && (
                              <div className="mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Selected Publications</h3>
                                <ul className="list-disc list-inside text-gray-600 space-y-2">
                                  {faculty.publications.map((pub, index) => (
                                    <li key={index} className="pl-2">
                                      <span className="-ml-2">{pub}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {faculty.permalink && (
                              <Button
                                onClick={() => handleProfileClick(faculty.permalink)}
                                className="mt-2 bg-yellow-600 hover:bg-yellow-700"
                              >
                                Full Profile <ExternalLink className="ml-2 h-4 w-4" />
                              </Button>
                            )}
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <EmptyState
                type="search"
                title="No faculty members found"
                message="We couldn't find any faculty members matching your search criteria."
                suggestion="Try adjusting your search term or selecting a different department."
                onRetry={() => {
                  setSearchTerm('');
                  setSelectedDepartment('all');
                }}
              />
            )}
          </ErrorBoundary>
        </div>
      </section>
      
      {/* Call to Action Section */}
      <section className="section-padding hero-gradient">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-white"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Join Our Academic Community
            </h2>
            <p className="text-xl mb-8 text-white/80">
              Interested in working with our distinguished faculty? Explore our academic programs and research opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => window.location.href = '/academics'}
                className="bg-white text-yellow-700 hover:bg-yellow-50 font-semibold"
              >
                Explore Programs
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.location.href = '/research'}
                className="border-white text-white hover:bg-white/10"
              >
                Research Opportunities
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FacultyDirectory;