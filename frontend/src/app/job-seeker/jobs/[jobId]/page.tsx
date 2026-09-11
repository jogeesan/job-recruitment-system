"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedDashboard } from "@/components/dashboard/ProtectedDashboard";
import { applyForJob, getApplications, getJobDetails, getResumes } from "@/lib/jobs";
import type { JobDetails } from "@/types/jobDetails";
import type { Resume } from "@/types/resume";

export default function JobDetailsPage() {
  const params = useParams<{ jobId: string }>();
  const router = useRouter();
  const [job, setJob] = useState<JobDetails | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const jobId = Number(params.jobId);
    if (!Number.isInteger(jobId)) {
      setError("This job could not be found.");
      setIsLoading(false);
      return;
    }
    Promise.all([getJobDetails(jobId), getResumes(), getApplications()])
      .then(([jobData, resumeData, applications]) => {
        setJob(jobData);
        setResumes(resumeData);
        setSelectedResumeId(String(resumeData.find((resume) => resume.isDefault)?.id ?? resumeData[0]?.id ?? ""));
        setAlreadyApplied(applications.some((application) => application.jobId === jobId));
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "We could not load this job."))
      .finally(() => setIsLoading(false));
  }, [params.jobId]);

  async function submitApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!job || !selectedResumeId) {
      setError("Please select a resume before applying.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await applyForJob(job.id, { resumeId: Number(selectedResumeId), coverLetter });
      setAlreadyApplied(true);
      setSuccess("Your application was submitted successfully.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "We could not submit your application.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const deadlinePassed = Boolean(job?.applicationDeadline && new Date(`${job.applicationDeadline}T23:59:59`) < new Date());

  return (
    <ProtectedDashboard role="JOB_SEEKER">
      <div className="space-y-6">
        {isLoading && <p className="text-sm text-slate-500">Loading job details...</p>}
        {error && <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {success && <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">{success}</p>}
        {job && (
          <>
            <Link href="/job-seeker/jobs" className="text-sm font-semibold text-[#5b55dc]">← Back to jobs</Link>
            <header className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-[#5b55dc]">{job.companyName}</p>
              <h1 className="mt-2 text-3xl font-bold">{job.title}</h1>
              <p className="mt-3 text-sm text-slate-500">{job.location ?? "Location not specified"} · {job.employmentType} · {job.experienceLevel ?? "Experience level not specified"}</p>
              <p className="mt-3 text-sm font-semibold text-slate-700">{formatSalary(job)}{job.applicationDeadline ? ` · Apply by ${new Date(`${job.applicationDeadline}T00:00:00`).toLocaleDateString()}` : ""}</p>
            </header>
            <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
              <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <ContentSection title="Job description" content={job.description} />
                <ContentSection title="Responsibilities" content={job.responsibilities} />
                <ContentSection title="Requirements" content={job.requirements} />
                {job.companyDescription && <ContentSection title={`About ${job.companyName}`} content={job.companyDescription} />}
                {job.companyWebsite && <a href={job.companyWebsite} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#5b55dc]">Visit company website</a>}
              </section>
              <form onSubmit={submitApplication} className="h-fit space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold">Apply for this role</h2>
                {alreadyApplied ? <p className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700">You have already applied for this job.</p> : deadlinePassed ? <p className="rounded-lg bg-amber-50 p-4 text-sm text-amber-700">The application deadline has passed.</p> : resumes.length === 0 ? (
                  <div className="space-y-3"><p className="text-sm text-slate-600">Upload a resume before applying.</p><Link href="/job-seeker/profile" className="inline-block text-sm font-semibold text-[#5b55dc]">Go to profile</Link></div>
                ) : (
                  <>
                    <label className="block text-sm font-semibold text-slate-700">Resume<select required value={selectedResumeId} onChange={(event) => setSelectedResumeId(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"><option value="">Select a resume</option>{resumes.map((resume) => <option key={resume.id} value={resume.id}>{resume.fileName}{resume.isDefault ? " (Default)" : ""}</option>)}</select></label>
                    <label className="block text-sm font-semibold text-slate-700">Cover letter<textarea value={coverLetter} onChange={(event) => setCoverLetter(event.target.value)} maxLength={10000} rows={7} placeholder="Tell the company why you are a good fit..." className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#5b55dc]" /></label>
                    <button disabled={isSubmitting} type="submit" className="w-full rounded-lg bg-[#5b55dc] px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? "Submitting..." : "Submit application"}</button>
                  </>
                )}
              </form>
            </div>
          </>
        )}
      </div>
    </ProtectedDashboard>
  );
}

function ContentSection({ title, content }: { title: string; content: string | null }) {
  if (!content) return null;
  return <section><h2 className="text-lg font-bold">{title}</h2><p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-600">{content}</p></section>;
}

function formatSalary(job: JobDetails): string {
  if (job.salaryMin == null && job.salaryMax == null) return "Salary not specified";
  return `${job.salaryMin?.toLocaleString() ?? ""}${job.salaryMax != null ? ` - ${job.salaryMax.toLocaleString()}` : ""}`;
}
