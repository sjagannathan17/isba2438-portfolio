import { NextResponse } from "next/server";
import {
  readBlogs,
  findBlogById,
  updateBlog,
  deleteBlog,
} from "@/lib/blogs";
import { validateBlog, blogFieldErrors } from "@/lib/validateBlog";
import { requireAdmin } from "@/lib/requireAdminResponse";
import { logApiCall } from "@/lib/apiLogger";

function routeFor(id) {
  return `/api/blogs/${id}`;
}

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const post = await findBlogById(id);
    if (!post) {
      logApiCall({ method: "GET", route: routeFor(id), status: 404, id });
      return NextResponse.json(
        { errors: { form: "Blog post not found." } },
        { status: 404 }
      );
    }
    logApiCall({ method: "GET", route: routeFor(id), status: 200, id });
    return NextResponse.json({ post }, { status: 200 });
  } catch {
    logApiCall({ method: "GET", route: routeFor(id), status: 500, id });
    return NextResponse.json(
      { errors: { form: "Blog storage is temporarily unavailable. Please try again." } },
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

  const fieldErrors = blogFieldErrors(body);
  if (Object.keys(fieldErrors).length > 0) {
    logApiCall({ method: "PATCH", route: routeFor(id), status: 400, id });
    return NextResponse.json({ errors: fieldErrors }, { status: 400 });
  }

  let existing;
  try {
    existing = await findBlogById(id);
  } catch {
    existing = null;
  }
  if (!existing) {
    logApiCall({ method: "PATCH", route: routeFor(id), status: 404, id });
    return NextResponse.json(
      { errors: { form: "Blog post not found." } },
      { status: 404 }
    );
  }

  const { valid, errors } = validateBlog({
    title: body.title ?? existing.title,
    description: body.description ?? existing.description,
    content: body.content ?? existing.content,
  });
  if (!valid) {
    logApiCall({ method: "PATCH", route: routeFor(id), status: 400, id });
    return NextResponse.json({ errors }, { status: 400 });
  }

  try {
    const { updated } = await updateBlog(id, body);
    if (!updated) {
      logApiCall({ method: "PATCH", route: routeFor(id), status: 404, id });
      return NextResponse.json(
        { errors: { form: "Blog post not found." } },
        { status: 404 }
      );
    }
    logApiCall({ method: "PATCH", route: routeFor(id), status: 200, id });
    return NextResponse.json({ ok: true, post: updated }, { status: 200 });
  } catch {
    logApiCall({ method: "PATCH", route: routeFor(id), status: 500, id });
    return NextResponse.json(
      { errors: { form: "Something went wrong saving your post. Please try again." } },
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
    const removed = await deleteBlog(id);
    if (!removed) {
      logApiCall({ method: "DELETE", route: routeFor(id), status: 404, id });
      return NextResponse.json(
        { errors: { form: "Blog post not found." } },
        { status: 404 }
      );
    }
    logApiCall({ method: "DELETE", route: routeFor(id), status: 204, id });
    return new NextResponse(null, { status: 204 });
  } catch {
    logApiCall({ method: "DELETE", route: routeFor(id), status: 500, id });
    return NextResponse.json(
      { errors: { form: "Something went wrong deleting this post." } },
      { status: 500 }
    );
  }
}
