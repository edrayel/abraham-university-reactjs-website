import React from "react";
import useUniversityStore from "@/stores/homeStore";
import {
  ChevronRight,
  GraduationCap,
  BookOpen,
  Users,
  Briefcase,
  Lightbulb,
  Globe,
  Heart,
  Star,
  Trophy,
  Building,
} from "lucide-react";

const AcademicExcellenceSection = () => {
  const { academicExcellence } = useUniversityStore();

  // Icon mapping for the excellence points
  const iconMap = {
    "graduation-cap": GraduationCap,
    "book": BookOpen,
    "users": Users,
    "briefcase": Briefcase,
    "lightbulb": Lightbulb,
    "globe": Globe,
    "heart": Heart,
    "star": Star,
    "trophy": Trophy,
    "building": Building,
  };

  // Don't render if no data
  if (!academicExcellence || !academicExcellence.title) {
    return null;
  }

  const { title, body, points = [], button_text, button_url, image_url } = academicExcellence;

  return (
    <section className="py-16 bg-gradient-to-br from-amber-900 via-amber-800 to-amber-700 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-repeat" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Section */}
          <div className="text-center lg:text-left">
          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-yellow-100">
            {title}
          </h2>

          {/* Body Text */}
          {body && (
            <p className="text-xl md:text-2xl mb-12 text-amber-100 leading-relaxed">
              {body}
            </p>
          )}

          {/* Excellence Points */}
          {points && points.length > 0 && (
            <div className="grid md:grid-cols-1 gap-8 mb-12">
              {points.map((point, index) => {
                const IconComponent = iconMap[point.icon] || Star;
                return (
                  <div
                    key={index}
                    className="flex items-center justify-center md:justify-start space-x-4 text-left"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-amber-900" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-lg md:text-xl text-amber-100 font-medium">
                        {point.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Call to Action Button */}
          {button_text && button_url && (
            <div className="text-center lg:text-left">
              <a
                href={button_url}
                className="inline-flex items-center px-8 py-4 bg-white text-amber-900 font-semibold text-lg rounded-lg hover:bg-yellow-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {button_text}
                <ChevronRight className="ml-2 w-5 h-5" />
              </a>
            </div>
          )}
          </div>

          {/* Image Section */}
          {image_url && (
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src={image_url}
                  alt={title}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 to-transparent"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AcademicExcellenceSection;