// Minimal helpers for ClickUp & GitHub REST
export async function callClickUp(path, method = "GET", body = null) {
  const res = await fetch(`https://api.clickup.com/api/v2${path}`, {
    method,
    headers: {
      "Authorization": process.env.CLICKUP_TOKEN,
      "Content-Type": "application/json"
    },
    body: body ? JSON.stringify(body) : null
  });
  return await res.json();
}

export async function callGitHub(path, method = "GET", body = null) {
  const res = await fetch(`https://api.github.com${path}`, {
    method,
    headers: {
      "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`,
      "Accept": "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json"
    },
    body: body ? JSON.stringify(body) : null
  });
  return await res.json();
}
