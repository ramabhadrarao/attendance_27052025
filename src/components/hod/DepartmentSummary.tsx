import React from 'react';
import { ChevronRight } from 'lucide-react';

interface Program {
  name: string;
  students: number;
  batches: number;
  sections: string[];
  attendanceRate: number;
}

interface Props {
  programs: Program[];
}

const DepartmentSummary: React.FC<Props> = ({ programs }) => {
  return (
    <div className="space-y-4">
      {programs.map((program, index) => (
        <div key={index} className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-all">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h3 className="font-semibold text-neutral-800">{program.name}</h3>
              <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-sm text-neutral-600">
                <div>Students: {program.students}</div>
                <div>Batches: {program.batches}</div>
                <div>Sections: {program.sections.join(', ')}</div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-4">
              <div>
                <span className="text-sm text-neutral-500">Attendance Rate</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-24 h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${program.attendanceRate >= 90 ? 'bg-success' : program.attendanceRate >= 80 ? 'bg-warning' : 'bg-error'}`}
                      style={{ width: `${program.attendanceRate}%` }}
                    ></div>
                  </div>
                  <span className={`font-medium ${program.attendanceRate >= 90 ? 'text-success' : program.attendanceRate >= 80 ? 'text-warning' : 'text-error'}`}>
                    {program.attendanceRate}%
                  </span>
                </div>
              </div>
              <button className="p-2 rounded-full hover:bg-neutral-100">
                <ChevronRight size={20} className="text-neutral-400" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DepartmentSummary;