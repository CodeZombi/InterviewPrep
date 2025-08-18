import ResumeUploadForm from "../../components/resumeUploadForm";

export default function ResumeAnalyzer() {
  return (
    <div className="w-full min-h-full bg-[#FFFCEF]">
        <div className="w-[500px] h-[500px] bg-amber-200/20 blur-[65px] absolute top-0 left-0" />
      <h1 className="text-4xl font-extrabold tracking-tight text-black-800 black dark:text-black-100 mb-10">
        AI&nbsp;Resume <span className="text-primary-600">Analyzer</span>
      </h1>
      <ResumeUploadForm />
      
    </div>
  );
}