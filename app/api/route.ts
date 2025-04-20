export const dynamic = "force-static";
export async function GET() {
  return new Response(JSON.stringify({ message: "TestFlight version" }), {
    headers: { "content-type": "application/json" },
  });
}
