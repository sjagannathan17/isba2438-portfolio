import { NextResponse } from "next/server";
import { readProjects, saveProject } from "@/lib/projects";
import { validateProject, projectFieldErrors } from "@/lib/validateProject";
import { requireAdmin } from "@/lib/requireAdminResponse";
import { logApiCall } from "@/lib/apiLogger";

const ROUTE = "/api/projects";

export async function GET() {
  try {
    const projects = await readProjects();
    logApiCall({ method: "GET", route: ROUTE, status: 200 });
    return NextResponse.json({ projects }, { status: 200 });
  } catch {
    logApiCall({ method: "GET", route: ROUTE, status: 500 });
    return NextResponse.json(
      { errors: { form: "Project storage is temporarily unavailable. Please try again." } },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const denied = requireAdmin(request);
  if (denied) {
    logApiCall({ method: "POST", route: ROUTE, status: 401 });
    return denied;
  }

  let body;
  try {
    body = await request.json();
  } catch {
    logApiCall({ method: "POST", route: ROUTE, status: 400 });
    return NextResponse.json(
      { errors: { form: "Request body must be valid JSON." } },
      { status: 400 }
    );
  }

  const fieldErrors = projectFieldErrors(body);
  if (Object.keys(fieldErrors).length > 0) {
    logApiCall({ method: "POST", route: ROUTE, status: 400 });
    return NextResponse.json({ errors: fieldErrors }, { status: 400 });
  }

  const { valid, errors } = validateProject(body);
  if (!valid) {
    logApiCall({ method: "POST", route: ROUTE, status: 400 });
    return NextResponse.json({ errors }, { status: 400 });
  }

  try {
    const values = {
      name: body.name.trim(),
      tag: body.tag.trim(),
      context: body.context.trim(),
      year: body.year.trim(),
      timeframe: body.timeframe.trim(),
      roleSummary: body.roleSummary.trim(),
      blurb: body.blurb.trim(),
      summary: body.summary.trim(),
      why: body.why.trim(),
      contribution: body.contribution.trim(),
      impact: body.impact.trim(),
      tech: body.tech.map((item) => item.trim()),
      link: { label: body.link.label.trim(), url: body.link.url.trim() },
    };
    if (body.recognition !== undefined && body.recognition !== null && body.recognition.trim() !== "") {
      values.recognition = body.recognition.trim();
    }
    const entry = await saveProject(values);
    logApiCall({ method: "POST", route: ROUTE, status: 201, id: entry.id });
    return NextResponse.json({ ok: true, project: entry }, { status: 201 });
  } catch {
    logApiCall({ method: "POST", route: ROUTE, status: 500 });
    return NextResponse.json(
      { errors: { form: "Something went wrong saving this project. Please try again." } },
      { status: 500 }
    );
  }
}
