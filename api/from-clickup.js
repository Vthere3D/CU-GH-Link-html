import { callGitHub } from "./_shared.js";

export default async function handler(req, res) {
  // ClickUp sends JSON with event + data/after fields (varies by workspace)
  const payload = req.body;

  // Handle common forms: taskStatusUpdated or taskUpdated
  const evt = payload.event || payload.type || "";
  const after = payload.after || payload.data || payload.task || {};

  // Extract status + task title
  const status = (after.status && (after.status.status || after.status)) || "";
  const title = after.name || after.title || "";

  // Expect issue number embedded in task title like "[#123] Something"
  const m = title.match(/#(\d+)/);
  if (!m) return res.status(200).json({ ok: true, note: "no issue number in task title" });

  const issueNumber = m[1];
  const [owner, repo] = (process.env.GITHUB_REPO || "").split("/");
  if (!owner || !repo) return res.status(500).json({ ok: false, error: "GITHUB_REPO not set (owner/repo)" });

  // Map ClickUp status to GitHub issue state/labels
  const done = (process.env.CLICKUP_DONE_STATUS || "Done").toLowerCase();
  const cuForReview = (process.env.MAP_CU_FOR_REVIEW || "For Review").toLowerCase();
  const cuInProgress = (process.env.MAP_CU_IN_PROGRESS || "In Progress").toLowerCase();
  const s = (status || "").toLowerCase();

  if (s === done) {
    await callGitHub(`/repos/${owner}/${repo}/issues/${issueNumber}`, "PATCH", { state: "closed" });
  } else if (s === cuForReview || s === cuInProgress) {
    await callGitHub(`/repos/${owner}/${repo}/issues/${issueNumber}`, "PATCH", { state: "open" });
  }

  return res.status(200).json({ ok: true });
}
