import React from 'react';

interface Subject {
  name: string;
  percentage: number;
}

interface Props {
  subjects: Subject[];
}

const AttendanceSummary: React.FC<Props> = ({ subjects }) => {
  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-success';
    if (percentage >= 75) return 'bg-warning';
    return 'bg-error';
  };

  return (
    <div className="space-y-4">
      {subjects.map((subject, index) => (
        <div key={index} className="border border-neutral-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-neutral-800">{subject.name}</h3>
            <span className={`px-2 py-1 rounded-full text-white text-xs font-medium ${getStatusColor(subject.percentage)}`}>
              {subject.percentage}%
            </span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full rounded-full ${getStatusColor(subject.percentage)}`} 
              style={{ width: `${subject.percentage}%` }}
            ></div>
          </div>
          <div className="mt-2 text-sm text-neutral-500">
            {subject.percentage >= 75 ? (
              <span>Good standing</span>
            ) : (
              <span className="text-error">Attendance below required percentage</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AttendanceSummary;