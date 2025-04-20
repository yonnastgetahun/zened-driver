export const dynamic = "force-static";
export async function GET() {
  return new Response(JSON.stringify({ message: "Mobile test version" }), {
    headers: { "content-type": "application/json" },
  });
}
