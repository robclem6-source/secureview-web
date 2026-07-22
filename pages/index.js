// pages/index.js
//
// The assessment app itself is plain HTML/JS (public/app.html), not a React component.
// This page just reads that file server-side and streams it back as the response
// to "/", so the app loads at the clean root URL instead of requiring /app.html.

import fs from 'fs';
import path from 'path';

export async function getServerSideProps({ res }) {
  const filePath = path.join(process.cwd(), 'public', 'app.html');
  const html = fs.readFileSync(filePath, 'utf8');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.write(html);
  res.end();
  return { props: {} };
}

export default function Index() {
  return null; // response is written directly above; this component never renders
}
