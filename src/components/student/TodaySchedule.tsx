import React from 'react';

interface ScheduleItem {
  period: number;
  time: string;
  subject: string;
  faculty: string;
  room: string;
}

interface Props {
  schedule: ScheduleItem[];
}

const TodaySchedule: React.FC<Props> = ({ schedule }) => {
  // Get current time for highlighting current period
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  // Function to determine if a period is current
  const isCurrentPeriod = (timeString: string) => {
    const [startTime, endTime] = timeString.split(' - ');
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const periodStart = startHour * 60 + startMinute;
    const periodEnd = endHour * 60 + endMinute;
    const currentTime = currentHour * 60 + currentMinute;
    
    return currentTime >= periodStart && currentTime <= periodEnd;
  };

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Period</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Time</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Subject</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Faculty</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Room</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {schedule.map((item) => (
              <tr 
                key={item.period} 
                className={`${isCurrentPeriod(item.time) ? 'bg-primary/5' : 'hover:bg-neutral-50'}`}
              >
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-neutral-800">
                  {item.period}
                  {isCurrentPeriod(item.time) && (
                    <span className="ml-2 inline-block w-2 h-2 bg-primary rounded-full"></span>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">{item.time}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-800 font-medium">{item.subject}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">{item.faculty}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">{item.room}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TodaySchedule;