export default async function handler(req, res) {
  const owner = "YOUR_GITHUB_ORG_OR_USERNAME";
  const repo = "YOUR_REPO_NAME";

  const gh = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json"
    }
  });

  const data = await gh.json();

  res.status(200).json(data.slice(0, 20)); // return first 20 issues
}
