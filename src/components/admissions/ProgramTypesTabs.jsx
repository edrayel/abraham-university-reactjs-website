import React from 'react';

const ProgramTypesTabs = ({ programTypes, selectedProgram, setSelectedProgram }) => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {programTypes.map((program) => (
              <button
                key={program.id}
                onClick={() => setSelectedProgram(program.id)}
                className={`p-6 rounded-xl border-2 transition-all ${
                  selectedProgram === program.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <program.icon className={`h-8 w-8 mx-auto mb-3 ${
                  selectedProgram === program.id ? 'text-blue-600' : 'text-gray-600'
                }`} />
                <div className={`font-semibold ${
                  selectedProgram === program.id ? 'text-blue-600' : 'text-gray-900'
                }`}>
                  {program.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgramTypesTabs;