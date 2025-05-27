import React from 'react';

interface SubjectData {
  name: string;
  faculty: string;
  time: string;
  section: string;
  present: number;
  absent: number;
  total: number;
  percentage: number;
}

interface Props {
  data: SubjectData[];
}

const ReportTable: React.FC<Props> = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-neutral-200">
        <thead className="bg-neutral-50">
          <tr>
            <th scope="col\" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Subject
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Faculty
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Time
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Section
            </th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Present
            </th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Absent
            </th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Total
            </th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Percentage
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-neutral-200">
          {data.map((subject, index) => (
            <tr key={index} className="hover:bg-neutral-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-800">
                {subject.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                {subject.faculty}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                {subject.time}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                {subject.section}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-success font-medium">
                {subject.present}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-error font-medium">
                {subject.absent}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">
                {subject.total}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                <span 
                  className={`px-2 py-1 rounded-full text-white text-xs font-medium ${
                    subject.percentage >= 90 ? 'bg-success' : 
                    subject.percentage >= 75 ? 'bg-warning' : 
                    'bg-error'
                  }`}
                >
                  {subject.percentage.toFixed(1)}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportTable;