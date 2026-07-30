const SECTIONS = [
  {
    title: "Dashboard",
    body: "Your dashboard shows a daily greeting, chapter-wide stats, today's meetings, your active tasks, quick actions, and community updates with a task-load chart.",
  },
  {
    title: "Calendar & Tasks",
    body: "The Calendar page shows a monthly view with task counts per day and a filterable list. Admins can create tasks and assign them to individuals or teams; reassigning a task notifies both the outgoing and incoming assignee.",
  },
  {
    title: "Task workflow",
    body: "Once assigned, open Tasks to submit your work (notes and/or a link). An admin reviews it and either accepts it (task is marked completed and appears in the Registry) or rejects it (you'll be notified and must resubmit).",
  },
  {
    title: "Meetings",
    body: "Browse meetings as cards, filtered by upcoming/ongoing/completed. Meeting detail pages let the designated attendance taker and MOM taker (or a superadmin) record attendance and minutes, and mark the meeting as ended.",
  },
  {
    title: "Registry",
    body: "A read-only historical log of completed tasks and completed meetings, exportable to CSV.",
  },
  {
    title: "Applications",
    body: "Apply for leave covering a date range, a specific meeting, or a specific task. Admins approve or reject applications from this page.",
  },
  {
    title: "Repository",
    body: "Shared GD (graphic design) and VD (video design) assets and documents. Access is gated by public / member / admin visibility.",
  },
  {
    title: "Forms",
    body: "Active forms accept one submission per person until their deadline. Expired forms and your past submissions remain visible for reference.",
  },
  {
    title: "Chat",
    body: "Simple channel-based messaging for team communication, refreshed automatically.",
  },
  {
    title: "Admin",
    body: "Admins can manage member authority/status and review submitted applications from the Admin section. Only superadmins can grant admin or superadmin authority.",
  },
];

export default function DocsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Documentation</h1>
        <p className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>
          A quick guide to using the GDG On Campus HIT Management Portal.
        </p>
      </div>
      <div className="space-y-4">
        {SECTIONS.map((s) => (
          <div key={s.title} className="card p-5">
            <h2 className="text-sm font-semibold mb-1.5">{s.title}</h2>
            <p className="text-sm" style={{ color: "var(--color-muted)" }}>{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
