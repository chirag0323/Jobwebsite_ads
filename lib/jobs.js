import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const filePath = path.join(process.cwd(), "data", "jobs.json");

export async function getJobs() {
  const data = await fs.readFile(filePath, "utf8");
  return JSON.parse(data).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function getJob(slug) {
  return (await getJobs()).find((job) => job.slug === slug) || null;
}

function slugify(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function createJob(input) {
  const jobs = await getJobs();
  const base = slugify(input.title) || "job";
  let slug = base;
  let number = 2;
  while (jobs.some((job) => job.slug === slug)) slug = `${base}-${number++}`;
  const job = {
    id: crypto.randomUUID(), slug, title: input.title.trim(), company: input.company.trim(),
    location: input.location.trim(), type: input.type.trim(), salary: input.salary.trim(),
    description: input.description.trim(), requirements: input.requirements.trim(),
    applyUrl: input.applyUrl.trim(), createdAt: new Date().toISOString()
  };
  await fs.writeFile(filePath, JSON.stringify([job, ...jobs], null, 2));
  return job;
}

export async function deleteJob(id) {
  const jobs = await getJobs();
  const updated = jobs.filter((job) => job.id !== id);
  if (updated.length === jobs.length) return false;
  await fs.writeFile(filePath, JSON.stringify(updated, null, 2));
  return true;
}
