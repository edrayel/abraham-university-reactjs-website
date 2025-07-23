import React from 'react';

const ImagePlaceholder = ({ src, alt, className }) => {
  return (
    <div className="elegant-rounded-lg aspect-w-4 aspect-h-3 relative overflow-hidden">
      <img src={src} alt={alt} className={`w-full h-full object-cover ${className}`} />
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300"></div>
    </div>
  );
};

export default ImagePlaceholder;