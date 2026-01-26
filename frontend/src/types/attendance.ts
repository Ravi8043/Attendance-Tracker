export type AttendanceStatus = "PRESENT" | "ABSENT" | "NO CLASS";

export type Attendance = {
  id: number;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
};