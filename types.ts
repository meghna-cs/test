
export interface ClassSchedule {
  id: string;
  name: string;
  day: string;
  startTime: string;
  endTime: string;
}

export interface AttendanceRecord {
  date: string;
  classId: string;
  status: 'attended' | 'missed';
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: 'pending' | 'completed';
  description?: string;
  solution?: string;
}

export interface SemesterGrade {
  semester: number;
  sgpa: number;
  credits: number;
}

export interface FocusSession {
  id: string;
  subject: string;
  durationMinutes: number;
  date: string;
}

export interface ScreentimeLog {
  date: string;
  category: 'Social' | 'Study' | 'Games' | 'Entertainment';
  minutes: number;
}

export interface StudyPlanItem {
  id: string;
  time: string;
  task: string;
  type: 'study' | 'class' | 'break' | 'life';
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface AppState {
  attendanceTarget: number;
  routine: ClassSchedule[];
  history: AttendanceRecord[];
  assignments: Assignment[];
  grades: SemesterGrade[];
  userName: string;
  focusSessions: FocusSession[];
  screentimeLogs: ScreentimeLog[];
  studyPlan: StudyPlanItem[];
  lastAttendancePerc: number; // For tracking recovery logic
}

export type ViewType = 'dashboard' | 'attendance' | 'grades' | 'assignments' | 'ai-solver' | 'coding' | 'focus' | 'planner';
