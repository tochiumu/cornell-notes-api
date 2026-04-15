export default function Home() {
  return (
    <div style={{ padding: 40, fontFamily: "system-ui" }}>
      <h1>Cornell Notes API</h1>
      <p>API is running. Available endpoints:</p>
      <ul>
        <li><code>GET /api/notes</code></li>
        <li><code>POST /api/notes</code></li>
        <li><code>GET /api/notes/:id</code></li>
        <li><code>PUT /api/notes/:id</code></li>
        <li><code>DELETE /api/notes/:id</code></li>
      </ul>
    </div>
  );
}
