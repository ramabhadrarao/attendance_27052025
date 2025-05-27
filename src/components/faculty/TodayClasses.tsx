import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';

interface ClassItem {
  period: number;
  time: string;
  subject: string;
  section: string;
  room: string;
  attendanceStatus: 'Taken' | 'Pending';
}

interface Props {
  classes: ClassItem[];
  onTakeAttendance: (period: number) => void;
}

const TodayClasses: React.FC<Props> = ({ classes, onTakeAttendance }) => {
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

  // Function to determine if a period is upcoming
  const isUpcomingPeriod = (timeString: string) => {
    const [startTime] = timeString.split(' - ');
    const [startHour, startMinute] = startTime.split(':').map(Number);
    
    const periodStart = startHour * 60 + startMinute;
    const currentTime = currentHour * 60 + currentMinute;
    
    return currentTime < periodStart;
  };

  // Function to determine if a period is past
  const isPastPeriod = (timeString: string) => {
    const [_, endTime] = timeString.split(' - ');
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const periodEnd = endHour * 60 + endMinute;
    const currentTime = currentHour * 60 + currentMinute;
    
    return currentTime > periodEnd;
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
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Section</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Room</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {classes.map((item) => {
              const isCurrent = isCurrentPeriod(item.time);
              const isPast = isPastPeriod(item.time);
              const isUpcoming = isUpcomingPeriod(item.time);
              
              return (
                <tr 
                  key={item.period} 
                  className={`
                    ${isCurrent ? 'bg-primary/5' : 'hover:bg-neutral-50'}
                    ${isPast && item.attendanceStatus === 'Pending' ? 'bg-warning/5' : ''}
                  `}
                >
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-neutral-800">
                    {item.period}
                    {isCurrent && (
                      <span className="ml-2 inline-block w-2 h-2 bg-primary rounded-full"></span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">{item.time}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-800 font-medium">{item.subject}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">{item.section}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">{item.room}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {item.attendanceStatus === 'Taken' ? (
                      <span className="flex items-center text-success">
                        <CheckCircle size={16} className="mr-1" />
                        Taken
                      </span>
                    ) : (
                      <span className="flex items-center text-warning">
                        <Clock size={16} className="mr-1" />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                    {item.attendanceStatus === 'Pending' ? (
                      <button
                        onClick={() => onTakeAttendance(item.period)}
                        className={`btn ${isCurrent ? 'btn-primary' : 'btn-secondary'} text-xs py-1`}
                        disabled={!isCurrent && !isUpcoming && isPast}
                      >
                        {isCurrent ? 'Take Now' : isUpcoming ? 'Take Later' : 'Missed'}
                      </button>
                    ) : (
                      <button
                        className="text-primary hover:text-primary-dark text-xs underline"
                        onClick={() => onTakeAttendance(item.period)}
                      >
                        View Details
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TodayClasses;