export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <h1 className="text-lg font-semibold">Terms &amp; Conditions</h1>

      <div className="card p-4" style={{ background: "#fef7e0" }}>
        <p className="text-sm" style={{ color: "#b06000" }}>
          <strong>Draft — pending final approval.</strong> This page is a structural placeholder for the
          GDG On Campus HIT chapter&rsquo;s terms of use. It has not been reviewed by chapter leadership,
          Google Developer Groups program guidelines, or your institution&rsquo;s legal/administrative office,
          and must not be treated as binding until that review happens.
        </p>
      </div>

      <div className="card p-5 space-y-4 text-sm" style={{ color: "var(--color-muted)" }}>
        <section>
          <h2 className="text-sm font-semibold mb-1" style={{ color: "var(--color-ink)" }}>1. Purpose</h2>
          <p>This portal is an internal tool for GDG On Campus HIT members to coordinate tasks, meetings, forms, and shared resources.</p>
        </section>
        <section>
          <h2 className="text-sm font-semibold mb-1" style={{ color: "var(--color-ink)" }}>2. Account use</h2>
          <p>Accounts are personal and should not be shared. Members are responsible for the accuracy of information they submit through tasks, forms, and applications.</p>
        </section>
        <section>
          <h2 className="text-sm font-semibold mb-1" style={{ color: "var(--color-ink)" }}>3. Data handled</h2>
          <p>The portal stores member profile details, task and meeting history, leave applications, form submissions, and uploaded/linked repository assets, for the operational purpose of running chapter activities.</p>
        </section>
        <section>
          <h2 className="text-sm font-semibold mb-1" style={{ color: "var(--color-ink)" }}>4. Authority and access</h2>
          <p>Access to features is governed by role (Superadmin / Admin / Member / Nonmember). Administrators may view and manage member status as needed for chapter operations.</p>
        </section>
        <section>
          <h2 className="text-sm font-semibold mb-1" style={{ color: "var(--color-ink)" }}>5. Acceptable use</h2>
          <p>Members agree not to use the portal to upload unlawful, harassing, or infringing content, and to respect the access levels set on repository assets and forms.</p>
        </section>
        <section>
          <h2 className="text-sm font-semibold mb-1" style={{ color: "var(--color-ink)" }}>6. Google Developer Groups branding</h2>
          <p>This is an independent, student-run chapter tool. Use of GDG visual language does not imply official Google endorsement of this specific software.</p>
        </section>
        <section>
          <h2 className="text-sm font-semibold mb-1" style={{ color: "var(--color-ink)" }}>7. Changes</h2>
          <p>These terms may be revised as the portal evolves; material changes should be communicated to members before taking effect.</p>
        </section>
      </div>
    </div>
  );
}
