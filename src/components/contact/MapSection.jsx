import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Users, MessageSquare } from 'lucide-react';

const MapSection = ({ onDirectionsClick, onScheduleVisit, onQuickActionToast }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Find Us</h2>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="h-64 bg-gradient-to-br from-blue-500 to-cyan-500 relative">
            <img  className="w-full h-full object-cover" alt="Campus map" src="https://images.unsplash.com/photo-1658777690356-6bb89e959473" />
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <Button
                onClick={onDirectionsClick}
                className="w-full bg-white/90 text-blue-600 hover:bg-white"
              >
                Get Directions
              </Button>
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Abraham University</h3>
            <p className="text-gray-600">123 University Avenue, Education City, EC 12345</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="space-y-3">
          <Button
            onClick={onScheduleVisit}
            variant="outline"
            className="w-full justify-start"
          >
            <Calendar className="mr-3 h-5 w-5" />
            Schedule a Campus Visit
          </Button>
          <Button
            onClick={() => onQuickActionToast("Virtual Tour")}
            variant="outline"
            className="w-full justify-start"
          >
            <Users className="mr-3 h-5 w-5" />
            Take a Virtual Tour
          </Button>
          <Button
            onClick={() => onQuickActionToast("Live Chat")}
            variant="outline"
            className="w-full justify-start"
          >
            <MessageSquare className="mr-3 h-5 w-5" />
            Start Live Chat
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MapSection;