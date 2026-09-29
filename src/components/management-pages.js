"use client";
import { useState } from "react";
import {
  Trophy,
  Target,
  TrendingUp,
  Users,
  Download,
  Plus,
  Check,
  Shield,
  Save,
} from "lucide-react";
import {
  DataTable,
  UserAvatar,
  ProgressBar,
  StatusBadge,
  StatCard,
  FilterDropdown,
  SearchInput,
  DateRangeFilter,
} from "./ui";
import { rankExecutives, money, roles, access } from "@/lib/data";
import { SalesChart } from "./dashboard";
export function LeaderboardPage({ people }) {
  const [team, setTeam] = useState(""),
    [leader, setLeader] = useState(""),
    [period, setPeriod] = useState("This Month");
  const multiplier =
    period === "Last Month" ? 0.92 : period === "This Quarter" ? 2.8 : 1;
  const ranked = rankExecutives(
    people
      .filter(
        (p) => (!team || p.team === team) && (!leader || p.leader === leader),
      )
      .map((p) => ({
        ...p,
        sales: Math.round(p.sales * multiplier),
        target: period === "This Quarter" ? p.target * 3 : p.target,
      })),
  );
  return (
    <>
      <div className="stats-grid four">
        <StatCard
          label="Top performer"
          value={ranked[0]?.short || "—"}
          change="Leading the way"
          icon={Trophy}
        />
        <StatCard
          label="Highest sales"
          value={money(Math.max(0, ...ranked.map((p) => p.sales)))}
          icon={TrendingUp}
        />
        <StatCard
          label="Highest conversions"
          value={Math.max(0, ...ranked.map((p) => p.conversions))}
          icon={Users}
        />
        <StatCard
          label="Target achieved"
          value={`${ranked.filter((p) => p.sales >= p.target).length} executives`}
          icon={Target}
        />
      </div>
      <section className="card">
        <div className="table-toolbar">
          <div>
            <h2>Sales leaderboard</h2>
            <p className="section-subtitle">
              Ranked by target achievement, then total sales.
            </p>
          </div>
          <div className="filter-row">
            <FilterDropdown
              value={period}
              onChange={setPeriod}
              options={[
                "This Month",
                "Last Month",
                "This Quarter",
                "Custom Range",
              ]}
            />
            {period === "Custom Range" && (
              <>
                <input aria-label="Start date" type="date" />
                <input aria-label="End date" type="date" />
              </>
            )}
            <FilterDropdown
              label="All teams"
              value={team}
              onChange={setTeam}
              options={["Team Alpha", "Team Bravo", "Team Charlie"]}
            />
            <FilterDropdown
              label="Team leader"
              value={leader}
              onChange={setLeader}
              options={["Rahul Menon", "Priya Nair", "Arjun Das"]}
            />
          </div>
        </div>
        <DataTable
          rows={ranked}
          columns={[
            {
              key: "rank",
              label: "Position",
              render: (r, i) => (
                <span className={`rank ${i < 3 ? "top-rank" : ""}`}>
                  #{i + 1}
                </span>
              ),
            },
            {
              key: "name",
              label: "Sales executive",
              render: (r, i) => (
                <div className="person-cell">
                  <UserAvatar name={r.name} index={i} />
                  <strong>{r.name}</strong>
                </div>
              ),
            },
            { key: "team", label: "Team" },
            { key: "target", label: "Target", render: (r) => money(r.target) },
            {
              key: "sales",
              label: "Achieved",
              render: (r) => <strong>{money(r.sales)}</strong>,
            },
            {
              key: "pct",
              label: "Achievement",
              render: (r) => (
                <div className="table-progress">
                  <strong>{Math.round((r.sales / r.target) * 100)}%</strong>
                  <ProgressBar value={(r.sales / r.target) * 100} />
                </div>
              ),
            },
            {
              key: "remaining",
              label: "Remaining",
              render: (r) => money(Math.max(0, r.target - r.sales)),
            },
            { key: "conversions", label: "Conversions" },
            {
              key: "status",
              label: "Status",
              render: (r) => (
                <StatusBadge
                  status={
                    r.sales >= r.target
                      ? "Target Achieved"
                      : r.sales
                        ? "In Progress"
                        : "Target Pending"
                  }
                />
              ),
            },
          ]}
        />
      </section>
    </>
  );
}
export function TargetsPage({ people, setPeople, notify }) {
  const [who, setWho] = useState(people[0].name),
    [amount, setAmount] = useState(500000),
    [period, setPeriod] = useState("Monthly"),
    [history, setHistory] = useState(() =>
      people.flatMap((person) =>
        [
          ["August 2026", 0.94],
          ["July 2026", 0.88],
          ["June 2026", 0.81],
        ].map(([month, factor]) => ({
          id: `${person.id}-${month}`,
          executive: person.name,
          period: month,
          target: person.target,
          sales: Math.round(person.sales * factor),
        })),
      ),
    );
  return (
    <div className="two-columns">
      <section className="card detail-card">
        <h2>Assign a sales target</h2>
        <p className="section-subtitle">
          Set a monthly or quarterly goal for one sales executive.
        </p>
        <form
          className="form-stack"
          onSubmit={(e) => {
            e.preventDefault();
            setPeople(
              people.map((p) =>
                p.name === who ? { ...p, target: Number(amount) } : p,
              ),
            );
            setHistory([
              {
                id: Date.now(),
                executive: who,
                period: period + " · September 2026",
                target: Number(amount),
                sales: 0,
              },
              ...history,
            ]);
            notify("Target saved successfully");
          }}
        >
          <label>
            Sales executive
            <select value={who} onChange={(e) => setWho(e.target.value)}>
              {people.map((person) => (
                <option key={person.id} value={person.name}>
                  {person.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Period
            <select value={period} onChange={(e) => setPeriod(e.target.value)}>
              <option>Monthly</option>
              <option>Quarterly</option>
            </select>
          </label>
          <label>
            Month
            <input type="month" defaultValue="2026-09" required />
          </label>
          <label>
            Target amount (₹)
            <input
              type="number"
              min="1"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </label>
          <button className="primary">
            <Save size={15} /> Save target
          </button>
        </form>
      </section>
      <section className="card detail-card">
        <h2>Target history</h2>
        <DataTable
          rows={history.filter((entry) => entry.executive === who)}
          columns={[
            { key: "period", label: "Period" },
            { key: "target", label: "Target", render: (r) => money(r.target) },
            { key: "sales", label: "Achieved", render: (r) => money(r.sales) },
            {
              key: "pct",
              label: "Achievement",
              render: (r) => (
                <StatusBadge
                  status={Math.round((r.sales / r.target) * 100) + "%"}
                />
              ),
            },
          ]}
        />
      </section>
    </div>
  );
}
export function TeamPage({ people, openModal, role }) {
  const [search, setSearch] = useState(""),
    [team, setTeam] = useState(""),
    [selectedRole, setSelectedRole] = useState(""),
    [leader, setLeader] = useState(""),
    [status, setStatus] = useState("");
  const members = [
    ...people.map((p) => ({ ...p, role: "Sales Executive" })),
    ...["Rahul Menon", "Priya Nair", "Arjun Das"].map((name, i) => ({
      id: 20 + i,
      name,
      role: "Team Leader",
      team: ["Team Alpha", "Team Bravo", "Team Charlie"][i],
      leader: "Shamil Ahmed",
      target: null,
      sales: null,
      conversions: null,
    })),
  ];
  return (
    <section className="card">
      <div className="table-toolbar">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search team members…"
        />
        <div className="filter-row">
          <FilterDropdown
            label="Role"
            value={selectedRole}
            onChange={setSelectedRole}
            options={["Sales Executive", "Team Leader"]}
          />
          <FilterDropdown
            label="Team"
            value={team}
            onChange={setTeam}
            options={["Team Alpha", "Team Bravo", "Team Charlie"]}
          />
          <FilterDropdown
            label="Manager / leader"
            value={leader}
            onChange={setLeader}
            options={["Shamil Ahmed", "Rahul Menon", "Priya Nair", "Arjun Das"]}
          />
          <FilterDropdown
            label="Status"
            value={status}
            onChange={setStatus}
            options={["Active", "Inactive"]}
          />
        </div>
      </div>
      <DataTable
        rows={members.filter(
          (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) &&
            (!team || p.team === team) &&
            (!selectedRole || p.role === selectedRole) &&
            (!leader || p.leader === leader) &&
            status !== "Inactive",
        )}
        onRow={(p) => openModal({ type: "employee", record: p })}
        columns={[
          {
            key: "name",
            label: "Team member",
            render: (r, i) => (
              <div className="person-cell">
                <UserAvatar name={r.name} index={i} />
                <strong>{r.name}</strong>
              </div>
            ),
          },
          { key: "role", label: "Role" },
          { key: "team", label: "Team" },
          {
            key: "leads",
            label: "Active leads",
            render: (r) =>
              r.role === "Sales Executive" ? r.conversions + 12 : "—",
          },
          {
            key: "calls",
            label: "Calls",
            render: (r) =>
              r.role === "Sales Executive" ? r.conversions * 6 : "—",
          },
          {
            key: "followups",
            label: "Follow-ups",
            render: (r) =>
              r.role === "Sales Executive" ? r.conversions + 3 : "—",
          },
          {
            key: "conversions",
            label: "Conversions",
            render: (r) => r.conversions ?? "—",
          },
          {
            key: "sales",
            label: "Sales",
            render: (r) => (r.sales == null ? "—" : money(r.sales)),
          },
          {
            key: "target",
            label: "Achievement",
            render: (r) =>
              r.target == null ? (
                "—"
              ) : (
                <div className="table-progress">
                  {Math.round((r.sales / r.target) * 100)}%
                  <ProgressBar value={(r.sales / r.target) * 100} />
                </div>
              ),
          },
          {
            key: "status",
            label: "Status",
            render: () => <StatusBadge status="Active" />,
          },
        ]}
      />
    </section>
  );
}
export function AnalyticsPage({
  page,
  people,
  period,
  onPeriodChange,
  exportData,
}) {
  const [selectedExecutive, setSelectedExecutive] = useState("");
  const isSales = page === "performance" || page === "sales-reports";
  const executiveName = people.some(
    (person) => person.name === selectedExecutive,
  )
    ? selectedExecutive
    : people[0]?.name;
  const executive = people.find((person) => person.name === executiveName);
  const visiblePeople =
    page === "performance" ? (executive ? [executive] : []) : people;
  return (
    <>
      {page === "performance" && executive && (
        <div className="performance-toolbar">
          <DateRangeFilter value={period} onChange={onPeriodChange} />
          <label>
            Sales executive
            <select
              value={executiveName}
              onChange={(event) => setSelectedExecutive(event.target.value)}
            >
              {people.map((person) => (
                <option key={person.id} value={person.name}>
                  {person.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
      <div className="stats-grid four">
        {(page === "performance"
          ? [
              ["Sales achieved", money(executive?.sales || 0)],
              ["Individual target", money(executive?.target || 0)],
              [
                "Target achievement",
                `${Math.round(((executive?.sales || 0) / Math.max(1, executive?.target || 0)) * 100)}%`,
              ],
              ["Conversions", executive?.conversions || 0],
            ]
          : isSales
            ? [
                ["Total sales", "₹26.9L"],
                ["Monthly target", "₹36L"],
                ["Target achievement", "74.7%"],
                ["Conversion rate", "24.8%"],
              ]
            : page === "lead-reports"
              ? [
                  ["Leads assigned", "1,248"],
                  ["Conversions", "310"],
                  ["Lost leads", "72"],
                  ["Conversion rate", "24.8%"],
                ]
              : page === "call-reports"
                ? [
                    ["Calls made", "2,486"],
                    ["Answered", "2,104"],
                    ["Missed calls", "382"],
                    ["Avg. duration", "05:20"],
                  ]
                : [
                    ["Follow-ups completed", "486"],
                    ["Scheduled", "124"],
                    ["Overdue", "18"],
                    ["Completion rate", "79.6%"],
                  ]
        ).map(([label, value]) => (
          <StatCard
            key={label}
            label={label}
            value={value}
            icon={TrendingUp}
            showComparison={page !== "performance"}
          />
        ))}
      </div>
      <div className="two-columns">
        <section className="card">
          <div className="section-heading">
            <h2>
              {isSales ? "Sales performance over time" : "Activity over time"}
            </h2>
            <span className="muted">{period}</span>
          </div>
          <SalesChart
            period={period}
            salesTotal={page === "performance" ? executive?.sales : undefined}
            targetTotal={page === "performance" ? executive?.target : undefined}
          />
        </section>
        <section className="card detail-card">
          <h2>
            {page === "performance"
              ? "Individual activity"
              : page === "lead-reports"
                ? "Lead source analysis"
                : "Conversion analysis"}
          </h2>
          {page === "performance"
            ? [
                ["Leads assigned", (executive?.conversions || 0) * 4],
                ["Calls made", (executive?.conversions || 0) * 8],
                ["Follow-ups completed", (executive?.conversions || 0) * 3],
                ["Conversions", executive?.conversions || 0],
              ].map(([name, value]) => (
                <div className="source-row" key={name}>
                  <div>
                    <span>{name}</span>
                    <strong>{value}</strong>
                  </div>
                </div>
              ))
            : [
                ["Website", 36],
                ["Meta Ads", 28],
                ["Referral", 22],
                ["WhatsApp", 14],
              ].map(([name, pct]) => (
                <div className="source-row" key={name}>
                  <div>
                    <span>{name}</span>
                    <strong>{pct}%</strong>
                  </div>
                  <ProgressBar value={pct} />
                </div>
              ))}
        </section>
      </div>
      <section className="card spaced">
        <div className="section-heading">
          <h2>Sales executive performance</h2>
          <div className="row-actions">
            <button onClick={() => exportData(visiblePeople, page)}>
              <Download size={14} /> Export CSV
            </button>
            <button onClick={() => exportData(visiblePeople, page, "xls")}>
              <Download size={14} /> Export Excel
            </button>
          </div>
        </div>
        <DataTable
          rows={visiblePeople}
          columns={[
            { key: "name", label: "Executive" },
            { key: "sales", label: "Sales", render: (r) => money(r.sales) },
            { key: "target", label: "Target", render: (r) => money(r.target) },
            {
              key: "achievement",
              label: "Achievement",
              render: (r) => ((r.sales / r.target) * 100).toFixed(1) + "%",
            },
            {
              key: "leads",
              label: "Leads assigned",
              render: (r) => r.conversions * 4,
            },
            {
              key: "calls",
              label: "Calls made",
              render: (r) => r.conversions * 8,
            },
            {
              key: "followups",
              label: "Follow-ups completed",
              render: (r) => r.conversions * 3,
            },
            { key: "conversions", label: "Conversions" },
            { key: "rate", label: "Conversion rate", render: () => "25%" },
            {
              key: "lost",
              label: "Lost leads",
              render: (r) => Math.floor(r.conversions / 3),
            },
          ]}
        />
      </section>
      {page === "lead-reports" && (
        <section className="card detail-card spaced">
          <h2>Lost lead reasons</h2>
          {[
            ["Budget constraints", 42],
            ["Timing", 28],
            ["Competitor selected", 18],
            ["No response", 12],
          ].map(([n, v]) => (
            <div className="source-row" key={n}>
              <div>
                {n}
                <strong>{v}%</strong>
              </div>
              <ProgressBar value={v} />
            </div>
          ))}
        </section>
      )}
    </>
  );
}
export function UsersPage({ users, setUsers, openModal }) {
  const [tab, setTab] = useState("Users");
  return (
    <section className="card">
      <div className="tabs">
        {["Users", "Role permissions"].map((t) => (
          <button
            key={t}
            className={tab === t ? "active" : ""}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === "Users" ? (
        <DataTable
          rows={users}
          columns={[
            {
              key: "name",
              label: "Name",
              render: (r) => (
                <div className="person-cell">
                  <UserAvatar name={r.name} />
                  <strong>{r.name}</strong>
                </div>
              ),
            },
            { key: "email", label: "Email" },
            { key: "phone", label: "Phone" },
            { key: "role", label: "Role" },
            { key: "team", label: "Team" },
            { key: "manager", label: "Manager" },
            {
              key: "status",
              label: "Status",
              render: (r) => <StatusBadge status={r.status} />,
            },
            {
              key: "actions",
              label: "Actions",
              render: (r) => (
                <div className="row-actions">
                  <button
                    onClick={() => openModal({ type: "user", record: r })}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      setUsers(
                        users.map((u) =>
                          u.id === r.id
                            ? {
                                ...u,
                                status:
                                  u.status === "Active" ? "Inactive" : "Active",
                              }
                            : u,
                        ),
                      )
                    }
                  >
                    {r.status === "Active" ? "Deactivate" : "Activate"}
                  </button>
                </div>
              ),
            },
          ]}
        />
      ) : (
        <div className="permissions-grid">
          {roles.map((role) => (
            <div key={role} className="permission-card">
              <Shield size={19} />
              <h3>{role}</h3>
              {access[role].map((p) => (
                <span key={p}>
                  <Check size={12} />
                  {p.replaceAll("-", " ")}
                </span>
              ))}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
export function SettingsPage({ notify }) {
  const sections = [
    "General",
    "Lead Settings",
    "Lead Sources",
    "Lead Statuses",
    "Teams",
    "Roles & Permissions",
    "Target Settings",
    "Call Settings",
    "WhatsApp Settings",
    "Notifications",
  ];
  const [section, setSection] = useState("General");
  return (
    <section className="card settings-layout">
      <nav>
        {sections.map((s) => (
          <button
            key={s}
            className={section === s ? "active" : ""}
            onClick={() => setSection(s)}
          >
            {s}
          </button>
        ))}
      </nav>
      <div className="settings-content">
        <h2>{section}</h2>
        <p className="section-subtitle">Manage your workspace preferences.</p>
        {section === "Call Settings" || section === "WhatsApp Settings" ? (
          <div className="integration-placeholder">
            <Shield size={28} />
            <h3>{section.split(" ")[0]} integration</h3>
            <p>{section.split(" ")[0]} integration will be configured later.</p>
            <StatusBadge status="Not connected" />
          </div>
        ) : (
          <form
            className="form-stack"
            onSubmit={(e) => {
              e.preventDefault();
              notify(section + " saved for this demo session");
            }}
          >
            {section === "General" ? (
              <>
                <label>
                  Company name
                  <input defaultValue="ENTRAIN" required />
                </label>
                <label>
                  Workspace email
                  <input
                    type="email"
                    defaultValue="hello@entrain.in"
                    required
                  />
                </label>
                <label>
                  Timezone
                  <select>
                    <option>Asia/Kolkata (GMT +5:30)</option>
                  </select>
                </label>
                <label>
                  Currency
                  <select>
                    <option>INR — Indian Rupee (₹)</option>
                  </select>
                </label>
              </>
            ) : section === "Notifications" ? (
              [
                "Follow-up reminders",
                "New lead assignments",
                "Target milestones",
                "Team updates",
              ].map((t) => (
                <label className="checkbox-label" key={t}>
                  <input type="checkbox" defaultChecked />
                  {t}
                </label>
              ))
            ) : section === "Roles & Permissions" ? (
              <div>
                {roles.map((r) => (
                  <p key={r}>
                    {r} · {access[r].length} permitted screens
                  </p>
                ))}
              </div>
            ) : (
              <>
                <label>
                  {section === "Target Settings"
                    ? "Default monthly target (₹)"
                    : "Available values"}
                  <textarea
                    defaultValue={
                      section === "Lead Sources"
                        ? "Meta Ads, Instagram, Facebook, Website, WhatsApp, Referral, Walk-in, Other"
                        : section === "Lead Statuses"
                          ? "New, Contacted, Follow-up, Interested, Quotation, Won, Lost"
                          : section === "Teams"
                            ? "Team Alpha, Team Bravo, Team Charlie"
                            : section === "Target Settings"
                              ? "500000"
                              : "Default priority: Medium"
                    }
                  />
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  Enable for this workspace
                </label>
              </>
            )}
            <button className="primary">
              <Save size={15} /> Save changes
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
export function TasksPage() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      name: "Complete onboarding for Anjali Nair",
      date: "28 Sep 2026",
      done: false,
    },
    {
      id: 2,
      name: "Review September attendance",
      date: "29 Sep 2026",
      done: false,
    },
    {
      id: 3,
      name: "Schedule individual performance check-ins",
      date: "30 Sep 2026",
      done: false,
    },
  ]);
  return (
    <section className="card detail-card">
      <h2>Employee tasks</h2>
      {tasks.map((t) => (
        <label className="task-row" key={t.id}>
          <input
            type="checkbox"
            checked={t.done}
            onChange={() =>
              setTasks(
                tasks.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)),
              )
            }
          />
          <span style={{ textDecoration: t.done ? "line-through" : "none" }}>
            {t.name}
          </span>
          <small>{t.date}</small>
          <StatusBadge status={t.done ? "Completed" : "Pending"} />
        </label>
      ))}
    </section>
  );
}
