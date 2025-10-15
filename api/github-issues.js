export default async function handler(req, res) {
  const owner = "YOUR_GITHUB_ORG_OR_USERNAME";
  const repo = "YOUR_REPO_NAME";

  const gh = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json"
    }
  });

  // Try to parse JSON
  const data = await gh.json();

  // Log unexpected responses for debugging
  if (!Array.isArray(data)) {
    console.error("GitHub API did not return an array:", data);
    return res
      .status(500)
      .json({ error: "Unexpected GitHub API response", details: data });
  }

  res.status(200).json(data.slice(0, 20));
}
