
import { ClassSchedule, SemesterGrade, Assignment } from './types';

export const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const DEFAULT_ATTENDANCE_TARGET = 75;

export const INITIAL_ROUTINE: ClassSchedule[] = [
  { id: '1', name: 'Mathematics', day: 'Monday', startTime: '09:00', endTime: '10:00' },
  { id: '2', name: 'Physics', day: 'Monday', startTime: '10:15', endTime: '11:15' },
  { id: '3', name: 'Computer Science', day: 'Tuesday', startTime: '11:00', endTime: '12:00' },
];

export const INITIAL_GRADES: SemesterGrade[] = [
  { semester: 1, sgpa: 8.5, credits: 20 },
  { semester: 2, sgpa: 8.2, credits: 22 },
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  { 
    id: 'a1', 
    title: 'Calculus Problem Set', 
    subject: 'Mathematics', 
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], 
    status: 'pending' 
  },
];
