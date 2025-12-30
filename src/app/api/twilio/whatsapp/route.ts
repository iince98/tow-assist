import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  // Twilio sends application/x-www-form-urlencoded
  const formData = await request.formData();

  const body = formData.get("Body")?.toString().trim().toLowerCase();
  const from = formData.get("From")?.toString(); // whatsapp:+49123...

  console.log("📩 WhatsApp Reply:", body, "From:", from);

  if (!from) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const driverPhone = from.replace("whatsapp:", "");

  // 1️⃣ Find pending assignment
  const { data: assignment, error: findError } = await supabase
    .from("assignments")
    .select("*")
    .eq("driver_phone", driverPhone)
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .limit(1)
    .single();

  if (findError || !assignment) {
    return new Response(
      `<Response>
         <Message>No active assignment found.</Message>
       </Response>`,
      { headers: { "Content-Type": "text/xml" } }
    );
  }

  // 2️⃣ YES → assign
  if (body === "1" || body === "yes") {
    const { error: updateError } = await supabase
      .from("assignments")
      .update({ status: "assigned" })
      .eq("id", assignment.id);

    if (updateError) {
      console.error(updateError);
      return new Response(
        `<Response>
           <Message>⚠️ Error updating assignment.</Message>
         </Response>`,
        { headers: { "Content-Type": "text/xml" } }
      );
    }

    return new Response(
      `<Response>
         <Message>✅ Assignment confirmed. Thank you!</Message>
       </Response>`,
      { headers: { "Content-Type": "text/xml" } }
    );
  }

  // 3️⃣ NO or anything else
  return new Response(
    `<Response>
       <Message>❌ Assignment not confirmed.</Message>
     </Response>`,
    { headers: { "Content-Type": "text/xml" } }
  );
}
