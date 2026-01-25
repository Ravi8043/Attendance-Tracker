import { useNavigate } from "react-router-dom";

type Subject = {
  id: number;
  subject_name: string;
  subject_code: string;
};


const SubjectCard = ({ subject }: { subject: Subject }) => {
    const navigate = useNavigate();
  return (
    <div 
    onClick={() => navigate(`/subjects/${subject.id}`)}
    className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 hover:border-indigo-500 transition cursor-pointer">
      <h2 className="text-lg font-semibold">
        {subject.subject_name}
      </h2>
      <p className="text-sm text-neutral-400">
        Code: {subject.subject_code}
      </p>

      <div className="mt-4 text-sm text-neutral-300">
        Attendance: <span className="text-indigo-400">--%</span>
      </div>
    </div>
  );
};

export default SubjectCard;
