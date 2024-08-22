import { NextResponse } from 'next/server';
import webPush from 'web-push';

export async function POST(request: Request) {
  try {
    const data = await request.json();
   
    const { subscription } = data;
    if (!subscription) {
      return NextResponse.json({ message: "Subscription data missing." }, { status: 400 });
    }

    webPush.setVapidDetails(
      `mailto:${process.env.WEB_PUSH_EMAIL}`,
      process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY!,
      process.env.WEB_PUSH_PRIVATE_KEY!
    );

    const response = await webPush.sendNotification(
      subscription,
      JSON.stringify({
        title: "Hello Web Push",
        message: "Your web push notification is here!",
      })
    );

    return new Response(response.body, {
      status: response.statusCode,
      headers: response.headers,
    });
  } catch (err) {
    console.error('Error sending notification:', err);
    return NextResponse.json({ message: "Failed to send notification." }, { status: 500 });
  }
}