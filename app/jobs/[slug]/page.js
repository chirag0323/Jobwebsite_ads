import { getJob } from "../../../lib/jobs";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }) { const { slug } = await params; const job = await getJob(slug); return job ? { title: `${job.title} at ${job.company} | Opportunity Hub`, description: `${job.title} opportunity in ${job.location}.` } : {}; }
export default async function JobPage({ params }) {
  const { slug } = await params;
  const job = await getJob(slug); if (!job) notFound();
  return <main className="job-page"><a className="back" href="/">← All openings</a><section className="job-hero"><p className="company">{job.company}</p><h1>{job.title}</h1><div className="pills"><span>{job.location}</span><span>{job.type}</span>{job.salary && <span>{job.salary}</span>}</div></section><section className="job-content"><article><h2>About this role</h2><p className="prose">{job.description}</p>{job.requirements && <><h2>What we’re looking for</h2><p className="prose">{job.requirements}</p></>}</article><aside><div className="apply-box"><h3>Interested?</h3><p>Ready to take the next step?</p><a className="button" href={job.applyUrl} target="_blank" rel="noreferrer">Apply now ↗</a></div></aside></section></main>;
}
