import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return new Response(
      `<html><body><script>window.opener.postMessage({ error: "${error}" }, "*");window.close();</script></body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  }

  if (!code) {
    return new Response(
      `<html><body><script>window.opener.postMessage({ error: "Missing code" }, "*");window.close();</script></body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  }

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(
          process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
        ).toString('base64')
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: typeof window !== 'undefined' ? `${window.location.origin}/callback` : ''
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to exchange code for token');
    }

    return new Response(
      `<html><body><script>
        window.opener.postMessage({
          type: "SPOTIFY_TOKEN",
          token: "${data.access_token}",
          refreshToken: "${data.refresh_token}"
        }, "*");
        window.close();
      </script></body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  } catch (error) {
    return new Response(
      `<html><body><script>window.opener.postMessage({ error: "Token exchange failed" }, "*");window.close();</script></body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  }
}