import { callClickUp } from "./_shared.js";

export default async function handler(req, res) {
  // Vercel Node functions parse JSON into req.body automatically
  const event = req.headers["x-github-event"];
  const payload = req.body;

  // Handle issue closed/reopened; extend later as needed
  if (event === "issues") {
    const issue = payload.issue;
    const action = payload.action; // opened | edited | closed | reopened | labeled | unlabeled

    // Strategy: find task by issue number in task name: "[#123] Title"
    // (You can switch to storing the ClickUp task ID in the issue body if you prefer.)
    const listId = process.env.CLICKUP_LIST_ID;
    const listTasks = await callClickUp(`/list/${listId}/task?archived=false`);

    const match = (listTasks.tasks || []).find(t => (t.name || "").includes(`#${issue.number}`));
    if (!match) return res.status(200).json({ ok: true, note: "no matching task" });

    if (action === "closed") {
      await callClickUp(`/task/${match.id}`, "PUT", { status: process.env.CLICKUP_DONE_STATUS || "Done" });
    } else if (action === "reopened") {
      await callClickUp(`/task/${match.id}`, "PUT", { status: process.env.MAP_CU_IN_PROGRESS || "In Progress" });
    } else if (action === "labeled" || action === "unlabeled") {
      const labels = (issue.labels || []).map(l => (l.name || "").toLowerCase());
      if (labels.includes((process.env.MAP_LABEL_FOR_REVIEW || "for-review").toLowerCase())) {
        await callClickUp(`/task/${match.id}`, "PUT", { status: process.env.MAP_CU_FOR_REVIEW || "For Review" });
      }
    }
  }

  return res.status(200).json({ ok: true });
}
