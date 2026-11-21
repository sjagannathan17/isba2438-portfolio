import { NextResponse } from "next/server";
import {
  readProjects,
  findProjectById,
  updateProject,
  deleteProject,
} from "@/lib/projects";
import { validateProject, projectFieldErrors } from "@/lib/validateProject";
import { requireAdmin } from "@/lib/requireAdminResponse";
import { logApiCall } from "@/lib/apiLogger";

function routeFor(id) {
  return `/api/projects/${id}`;
}

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const project = await findProjectById(id);
    if (!project) {
      logApiCall({ method: "GET", route: routeFor(id), status: 404, id });
      return NextResponse.json(
        { errors: { form: "Project not found." } },
        { status: 404 }
      );
    }
    logApiCall({ method: "GET", route: routeFor(id), status: 200, id });
    return NextResponse.json({ project }, { status: 200 });
  } catch {
    logApiCall({ method: "GET", route: routeFor(id), status: 500, id });
    return NextResponse.json(
      { errors: { form: "Project storage is temporarily unavailable. Please try again." } },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  const denied = requireAdmin(request);
  if (denied) {
    logApiCall({ method: "PATCH", route: routeFor(id), status: 401, id });
    return denied;
  }

  let body;
  try {
    body = await request.json();
  } catch {
    logApiCall({ method: "PATCH", route: routeFor(id), status: 400, id });
    return NextResponse.json(
      { errors: { form: "Request body must be valid JSON." } },
      { status: 400 }
    );
  }

  const fieldErrors = projectFieldErrors(body);
  if (Object.keys(fieldErrors).length > 0) {
    logApiCall({ method: "PATCH", route: routeFor(id), status: 400, id });
    return NextResponse.json({ errors: fieldErrors }, { status: 400 });
  }

  let existing;
  try {
    existing = await findProjectById(id);
  } catch {
    existing = null;
  }
  if (!existing) {
    logApiCall({ method: "PATCH", route: routeFor(id), status: 404, id });
    return NextResponse.json(
      { errors: { form: "Project not found." } },
      { status: 404 }
    );
  }

  const merged = {
    name: body.name ?? existing.name,
    tag: body.tag ?? existing.tag,
    context: body.context ?? existing.context,
    year: body.year ?? existing.year,
    timeframe: body.timeframe ?? existing.timeframe,
    roleSummary: body.roleSummary ?? existing.roleSummary,
    blurb: body.blurb ?? existing.blurb,
    summary: body.summary ?? existing.summary,
    why: body.why ?? existing.why,
    contribution: body.contribution ?? existing.contribution,
    impact: body.impact ?? existing.impact,
    recognition: body.recognition !== undefined ? body.recognition : existing.recognition,
    tech: body.tech ?? existing.tech,
    link: body.link ?? existing.link,
  };

  const { valid, errors } = validateProject(merged);
  if (!valid) {
    logApiCall({ method: "PATCH", route: routeFor(id), status: 400, id });
    return NextResponse.json({ errors }, { status: 400 });
  }

  const updates = {
    name: merged.name.trim(),
    tag: merged.tag.trim(),
    context: merged.context.trim(),
    year: merged.year.trim(),
    timeframe: merged.timeframe.trim(),
    roleSummary: merged.roleSummary.trim(),
    blurb: merged.blurb.trim(),
    summary: merged.summary.trim(),
    why: merged.why.trim(),
    contribution: merged.contribution.trim(),
    impact: merged.impact.trim(),
    tech: merged.tech.map((item) => item.trim()),
    link: { label: merged.link.label.trim(), url: merged.link.url.trim() },
  };
  if (merged.recognition !== undefined && merged.recognition !== null && merged.recognition.trim() !== "") {
    updates.recognition = merged.recognition.trim();
  } else if (body.recognition !== undefined) {
    updates.recognition = undefined;
  }

  try {
    const entry = await updateProject(id, updates);
    if (!entry) {
      logApiCall({ method: "PATCH", route: routeFor(id), status: 404, id });
      return NextResponse.json(
        { errors: { form: "Project not found." } },
        { status: 404 }
      );
    }
    logApiCall({ method: "PATCH", route: routeFor(id), status: 200, id });
    return NextResponse.json({ ok: true, project: entry }, { status: 200 });
  } catch {
    logApiCall({ method: "PATCH", route: routeFor(id), status: 500, id });
    return NextResponse.json(
      { errors: { form: "Something went wrong saving this project. Please try again." } },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const denied = requireAdmin(request);
  if (denied) {
    logApiCall({ method: "DELETE", route: routeFor(id), status: 401, id });
    return denied;
  }

  try {
    const removed = await deleteProject(id);
    if (!removed) {
      logApiCall({ method: "DELETE", route: routeFor(id), status: 404, id });
      return NextResponse.json(
        { errors: { form: "Project not found." } },
        { status: 404 }
      );
    }
    logApiCall({ method: "DELETE", route: routeFor(id), status: 204, id });
    return new NextResponse(null, { status: 204 });
  } catch {
    logApiCall({ method: "DELETE", route: routeFor(id), status: 500, id });
    return NextResponse.json(
      { errors: { form: "Something went wrong deleting this project." } },
      { status: 500 }
    );
  }
}
