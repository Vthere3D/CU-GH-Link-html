export default async function handler(req, res) {
  const html = `
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>GitHub Issues Dashboard</title>
      <style>
        body { font-family: sans-serif; background: #1e1e1e; color: #fff; padding: 1rem; }
        table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
        th, td { border-bottom: 1px solid #444; padding: 8px; text-align: left; }
        th { color: #58a6ff; }
        a { color: #58a6ff; text-decoration: none; }
      </style>
    </head>
    <body>
      <h2>🧩 GitHub Issues Dashboard</h2>
      <table id="issuesTable">
        <thead><tr><th>#</th><th>Title</th><th>Status</th></tr></thead>
        <tbody></tbody>
      </table>
      <script>
        fetch('/api/github-issues')
          .then(res => res.json())
          .then(issues => {
            const tbody = document.querySelector('#issuesTable tbody');
            tbody.innerHTML = issues.map(i => 
              '<tr>' +
                '<td>' + i.number + '</td>' +
                '<td><a href="' + i.html_url + '" target="_blank">' + i.title + '</a></td>' +
                '<td>' + (i.state === 'open' ? '🟢 Open' : '🔴 Closed') + '</td>' +
              '</tr>'
            ).join('');
          });
      </script>
    </body>
  </html>`;
  res.setHeader("Content-Type", "text/html");
  res.send(html);
}
