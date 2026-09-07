import { getJobs } from "../lib/jobs";

export const dynamic = "force-dynamic";
export default async function Home() {
  const jobs = await getJobs();
  return <main><section className="hero"><p className="eyebrow">CAREERS & OPPORTUNITIES</p><h1>Find work worth<br/>showing up for.</h1><p>Explore current openings and take the next step in your career.</p></section><section className="jobs"><div className="section-head"><h2>Open positions</h2><span>{jobs.length} role{jobs.length === 1 ? "" : "s"} available</span></div>{jobs.length ? <div className="job-grid">{jobs.map(job => <a className="job-card" href={`/jobs/${job.slug}`} key={job.id}><div><p className="company">{job.company}</p><h3>{job.title}</h3><p className="meta">{job.location} · {job.type}</p></div><span className="arrow">→</span></a>)}</div> : <div className="empty"><h3>No openings right now</h3><p>Please check back soon for new opportunities.</p></div>}</section></main>;
}
