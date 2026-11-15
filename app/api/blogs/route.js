import { NextResponse } from "next/server";
import { validateBlog } from "@/lib/validateBlog";
import { readBlogs, saveBlog } from "@/lib/blogs";

export async function GET() {
  try {
    const posts = await readBlogs();
    const sorted = [...posts].sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
    return NextResponse.json({ posts: sorted }, { status: 200 });
  } catch {
    return NextResponse.json(
      { errors: { form: "Blog storage is temporarily unavailable. Please try again." } },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { errors: { form: "Request body must be valid JSON." } },
      { status: 400 }
    );
  }

  const { valid, errors } = validateBlog(body);
  if (!valid) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  try {
    const entry = await saveBlog({
      title: body.title,
      description: body.description,
      content: body.content,
    });
    return NextResponse.json(
      { ok: true, id: entry.id, slug: entry.slug },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { errors: { form: "Something went wrong saving your post. Please try again." } },
      { status: 500 }
    );
  }
}
