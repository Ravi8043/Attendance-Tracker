export type AttendanceStatus = "PRESENT" | "ABSENT";

export type Attendance = {
  id: number;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus | null; 
};
