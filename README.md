# Mix Master Pro

## Setup Instructions

1. Create a Spotify Developer account at https://developer.spotify.com/dashboard
2. Create a new application
3. Add `http://localhost:3000/callback` to the Redirect URIs in your Spotify app settings
4. Copy your Client ID and Client Secret
5. Create a `.env.local` file in the root directory with the following content:
   ```
   NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_client_id_here
   SPOTIFY_CLIENT_SECRET=your_client_secret_here
   ```
6. Replace `your_client_id_here` and `your_client_secret_here` with your actual Spotify application credentials

## Development

```bash
npm install
npm run dev
```