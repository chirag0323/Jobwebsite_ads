import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { del, list, put } from "@vercel/blob";

const filePath = path.join(process.cwd(), "data", "jobs.json");
const blobPrefix = "jobs/";
const usingBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

function newestFirst(jobs) {
  return jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

async function getLocalJobs() {
  try {
    return newestFirst(JSON.parse(await fs.readFile(filePath, "utf8")));
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function getBlobJobs() {
  const { blobs } = await list({ prefix: blobPrefix });
  const jobs = await Promise.all(blobs.map(async (blob) => {
    const response = await fetch(blob.url, { cache: "no-store" });
    return response.ok ? { ...(await response.json()), blobUrl: blob.url } : null;
  }));
  return newestFirst(jobs.filter(Boolean));
}

export async function getJobs() {
  return usingBlob() ? getBlobJobs() : getLocalJobs();
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
  if (usingBlob()) {
    await put(`${blobPrefix}${job.id}.json`, JSON.stringify(job), {
      access: "public", addRandomSuffix: false, contentType: "application/json"
    });
  } else {
    await fs.writeFile(filePath, JSON.stringify([job, ...jobs], null, 2));
  }
  return job;
}

export async function deleteJob(id) {
  const jobs = await getJobs();
  const job = jobs.find((item) => item.id === id);
  if (!job) return false;
  if (usingBlob()) {
    await del(job.blobUrl);
  } else {
    await fs.writeFile(filePath, JSON.stringify(jobs.filter((item) => item.id !== id), null, 2));
  }
  return true;
}
