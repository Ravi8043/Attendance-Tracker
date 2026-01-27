import { useEffect, useState } from "react";
import api from "../api/axios";
import SubjectStats from "./SubjectStats";
import type { Attendance } from "../types/attendance";

type Subject = {
  id: number;
  subject_name: string;
  subject_code: string;
};

type Props = {
  subjectId: string;
  attendance: Attendance[];
};

const SubjectDashBoard = ({ subjectId, attendance }: Props) => {
  const [subject, setSubject] = useState<Subject | null>(null);

  useEffect(() => {
    api
      .get(`/api/v1/subjects/${subjectId}/`)
      .then(res => setSubject(res.data))
      .catch(err => console.error("Failed to load subject", err));
  }, [subjectId]);

  if (!subject) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">{subject.subject_name}</h1>
        <p className="text-neutral-400">{subject.subject_code}</p>
      </div>

      <SubjectStats attendance={attendance} />
    </div>
  );
};

export default SubjectDashBoard;
