import {
  type FormEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useRef,
  useState,
} from "react"
import "./prototype.css"

type Screen = "signup" | "profile" | "discover" | "mentor" | "requests" | "requirements" | "matches" | "conversation"

type IconName = "arrow" | "back" | "briefcase" | "calendar" | "check" | "chevron" | "clock" | "close" | "discover" | "edit" | "filter" | "graduation" | "heart" | "location" | "matches" | "message" | "profile" | "requests" | "search" | "send" | "spark" | "target" | "users"

const mentors = [
  {
    name: "Dr. Maya Chen",
    initials: "MC",
    role: "Senior Cloud Architect",
    company: "Northstar Systems",
    location: "Los Angeles, CA",
    match: 96,
    color: "avatar-green",
    tags: ["Cloud architecture", "Career planning", "AWS"],
    bio: "I help early-career technologists build confidence, find their specialty, and turn classroom knowledge into real-world impact.",
  },
  {
    name: "Marcus Johnson",
    initials: "MJ",
    role: "Engineering Manager",
    company: "Lattice Labs",
    location: "Pasadena, CA",
    match: 92,
    color: "avatar-navy",
    tags: ["Leadership", "Backend systems", "Interviews"],
    bio: "Engineering leader focused on helping students navigate their first role and develop sustainable technical habits.",
  },
  {
    name: "Sofia Patel",
    initials: "SP",
    role: "Product Security Lead",
    company: "VantaWorks",
    location: "Remote",
    match: 88,
    color: "avatar-brown",
    tags: ["Cybersecurity", "Networking", "Certifications"],
    bio: "Security practitioner and lifelong learner. I mentor with practical projects and candid, encouraging feedback.",
  },
]

const messages = [
  {
    from: "mentor",
    text: "Hi Alex! I’m glad we matched. I read through your goals and would love to help.",
    time: "10:24 AM",
  },
  {
    from: "me",
    text: "Hi Maya! Thank you. I’m especially hoping to learn how to move from support into cloud engineering.",
    time: "10:27 AM",
  },
  {
    from: "mentor",
    text: "That’s a great direction. Let’s start by mapping your current skills and choosing one small portfolio project.",
    time: "10:29 AM",
  },
]

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
    back: (
      <>
        <path d="m15 18-6-6 6-6" />
      </>
    ),
    briefcase: (
      <>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    chevron: <path d="m9 18 6-6-6-6" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    close: (
      <>
        <path d="m6 6 12 12M18 6 6 18" />
      </>
    ),
    discover: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
      </>
    ),
    edit: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
      </>
    ),
    filter: <path d="M4 5h16M7 12h10M10 19h4" />,
    graduation: (
      <>
        <path d="m2 9 10-5 10 5-10 5Z" />
        <path d="M6 11.5V16c3 3 9 3 12 0v-4.5" />
      </>
    ),
    heart: (
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
    ),
    location: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    matches: (
      <>
        <path d="M8.5 14.5 12 18l7-7a4 4 0 0 0-5.7-5.6L12 6.7l-1.3-1.3A4 4 0 0 0 5 11l1 1" />
        <circle cx="6" cy="17" r="3" />
      </>
    ),
    message: (
      <>
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
      </>
    ),
    profile: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    requests: (
      <>
        <path d="M8 3h8l1 3h3v15H4V6h3Z" />
        <path d="m8 13 2.5 2.5L16 10" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    send: (
      <>
        <path d="m22 2-7 20-4-9-9-4Z" />
        <path d="M22 2 11 13" />
      </>
    ),
    spark: (
      <>
        <path d="m12 3 1.3 3.7L17 8l-3.7 1.3L12 13l-1.3-3.7L7 8l3.7-1.3Z" />
        <path d="m19 14 .8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8Z" />
      </>
    ),
    target: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />
      </>
    ),
  }
  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}

function Button({
  children,
  variant = "primary",
  icon,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}: {
  children: ReactNode
  variant?: "primary" | "secondary" | "ghost" | "pass" | "accept" | "danger"
  icon?: IconName
  onClick?: () => void
  type?: "button" | "submit"
  className?: string
  disabled?: boolean
}) {
  return (
    <button
      className={`button button-${variant} ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
      {icon && <Icon name={icon} size={18} />}
    </button>
  )
}

function Avatar({
  initials,
  color = "avatar-green",
  large = false,
}: {
  initials: string
  color?: string
  large?: boolean
}) {
  return (
    <div
      className={`avatar ${color} ${large ? "avatar-large" : ""}`}
      aria-hidden="true"
    >
      <span>{initials}</span>
    </div>
  )
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand ${compact ? "brand-compact" : ""}`}>
      <div className="brand-mark">
        <span />
        <span />
      </div>
      <div>
        <strong>mentor&me</strong>
        {!compact && <small>Learn. Connect. Grow.</small>}
      </div>
    </div>
  )
}

function AppShell({
  screen,
  navigate,
  children,
}: {
  screen: Screen
  navigate: (screen: Screen) => void
  children: ReactNode
}) {
  const nav = [
    {
      id: "discover" as Screen,
      label: "Discover",
      icon: "discover" as IconName,
    },
    {
      id: "requests" as Screen,
      label: "Requests",
      icon: "requests" as IconName,
    },
    { id: "matches" as Screen, label: "Matches", icon: "matches" as IconName },
    {
      id: "requirements" as Screen,
      label: "Profile",
      icon: "profile" as IconName,
    },
  ]
  const active =
    screen === "mentor"
      ? "discover"
      : screen === "conversation"
        ? "matches"
        : screen
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <button
            className="brand-button"
            onClick={() => navigate("discover")}
            aria-label="Go to discover"
          >
            <Brand compact />
          </button>
          <nav className="desktop-nav" aria-label="Main navigation">
            {nav.map((item) => (
              <button
                key={item.id}
                className={active === item.id ? "nav-item active" : "nav-item"}
                onClick={() => navigate(item.id)}
              >
                <Icon name={item.icon} size={18} />
                {item.label}
                {item.id === "requests" && <span className="nav-count">2</span>}
              </button>
            ))}
          </nav>
          <button
            className="account"
            onClick={() => navigate("profile")}
            aria-label="Open profile"
          >
            <Avatar initials="AR" color="avatar-navy" />
            <span>
              Alex Rivera<small>Mentee</small>
            </span>
            <Icon name="chevron" size={16} />
          </button>
        </div>
      </header>
      <main className="main-content">{children}</main>
      <nav className="mobile-nav" aria-label="Main navigation">
        {nav.map((item) => (
          <button
            key={item.id}
            className={
              active === item.id ? "mobile-nav-item active" : "mobile-nav-item"
            }
            onClick={() => navigate(item.id)}
          >
            <Icon name={item.icon} size={21} />
            <span>{item.label}</span>
            {item.id === "requests" && <i>2</i>}
          </button>
        ))}
      </nav>
    </div>
  )
}

function Signup({
  navigate,
  onJoin,
}: {
  navigate: (screen: Screen) => void
  onJoin: (role: "mentee" | "mentor") => void
}) {
  const [role, setRole] = useState<"mentee" | "mentor">("mentee")
  const submit = (event: FormEvent) => {
    event.preventDefault()
    onJoin(role)
  }
  return (
    <div className="auth-page">
      <section className="auth-story">
        <Brand />
        <div className="auth-copy">
          <span className="eyebrow light">Your next chapter starts here</span>
          <h1>
            Grow further,
            <br />
            together.
          </h1>
          <p>
            Meaningful mentorship for students and professionals ready to share
            what they know.
          </p>
        </div>
        <div className="community-proof">
          <div className="avatar-stack">
            <Avatar initials="MC" />
            <Avatar initials="MJ" color="avatar-brown" />
            <Avatar initials="SP" color="avatar-navy" />
          </div>
          <span>
            <strong>2,400+ meaningful connections</strong>
            <small>built by our community</small>
          </span>
        </div>
      </section>
      <section className="auth-form-wrap">
        <form className="auth-form" onSubmit={submit}>
          <span className="eyebrow">Join Mentor & Me</span>
          <h2>Create your account</h2>
          <p>Tell us how you’d like to participate.</p>
          <fieldset className="role-picker">
            <legend>I want to...</legend>
            <button
              type="button"
              className={role === "mentee" ? "role-card selected" : "role-card"}
              onClick={() => setRole("mentee")}
            >
              <span className="role-icon">
                <Icon name="graduation" />
              </span>
              <span>
                <strong>Find a mentor</strong>
                <small>Get guidance and grow your career</small>
              </span>
              <i>{role === "mentee" && <Icon name="check" size={14} />}</i>
            </button>
            <button
              type="button"
              className={role === "mentor" ? "role-card selected" : "role-card"}
              onClick={() => setRole("mentor")}
            >
              <span className="role-icon brown">
                <Icon name="spark" />
              </span>
              <span>
                <strong>Become a mentor</strong>
                <small>Share your experience and give back</small>
              </span>
              <i>{role === "mentor" && <Icon name="check" size={14} />}</i>
            </button>
          </fieldset>
          <label className="field">
            <span>Email address</span>
            <input type="email" placeholder="you@example.com" required />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              type="password"
              placeholder="At least 8 characters"
              required
              minLength={8}
            />
          </label>
          <Button type="submit" icon="arrow" className="full">
            Continue
          </Button>
          <p className="form-foot">
            Already have an account?{" "}
            <button type="button" onClick={() => navigate("discover")}>
              Sign in
            </button>
          </p>
        </form>
      </section>
    </div>
  )
}

function ProfileBuilder({ navigate }: { navigate: (screen: Screen) => void }) {
  const [step, setStep] = useState(1)
  const [journey, setJourney] = useState("Early career")
  const [selected, setSelected] = useState([
    "Cloud engineering",
    "Career growth",
  ])
  const skills = [
    "Cloud engineering",
    "Cybersecurity",
    "Software development",
    "Career growth",
    "Leadership",
    "Interview prep",
  ]
  const toggle = (skill: string) =>
    setSelected((current) =>
      current.includes(skill)
        ? current.filter((item) => item !== skill)
        : [...current, skill],
    )
  return (
    <div className="builder-page">
      <header className="builder-header">
        <Brand compact />
        <span>Step {step} of 4</span>
      </header>
      <div className="builder-progress">
        <i style={{ width: `${step * 25}%` }} />
      </div>
      <main className="builder-main">
        <aside className="step-list">
          {["Your goals", "About you", "Experience", "Preferences"].map(
            (label, index) => (
              <div
                key={label}
                className={
                  step === index + 1
                    ? "step active"
                    : step > index + 1
                      ? "step complete"
                      : "step"
                }
              >
                <span>
                  {step > index + 1 ? (
                    <Icon name="check" size={15} />
                  ) : (
                    index + 1
                  )}
                </span>
                <div>
                  <strong>{label}</strong>
                  <small>
                    {
                      [
                        "What you want to achieve",
                        "A short introduction",
                        "Your skills and background",
                        "Your ideal connection",
                      ][index]
                    }
                  </small>
                </div>
              </div>
            ),
          )}
        </aside>
        <section className="builder-card">
          <span className="eyebrow">Let’s personalize your experience</span>
          <h1>
            {step === 1
              ? "What would you like to work on?"
              : step === 2
                ? "Tell us a little about you"
                : step === 3
                  ? "Where are you in your journey?"
                  : "What makes a great match?"}
          </h1>
          <p>
            {step === 1
              ? "Choose up to three goals. We’ll use these to find mentors who can help."
              : "This helps us recommend people who understand where you are and where you want to go."}
          </p>
          {step === 1 && (
            <div className="choice-grid">
              {skills.map((skill) => (
                <button
                  key={skill}
                  className={
                    selected.includes(skill) ? "choice selected" : "choice"
                  }
                  onClick={() => toggle(skill)}
                >
                  <span>{skill}</span>
                  {selected.includes(skill) && <Icon name="check" size={17} />}
                </button>
              ))}
            </div>
          )}
          {step === 2 && (
            <div className="form-stack">
              <label className="field">
                <span>Preferred name</span>
                <input defaultValue="Alex" />
              </label>
              <label className="field">
                <span>A short introduction</span>
                <textarea
                  placeholder="Share what motivates you and what you’re curious about..."
                  rows={5}
                />
              </label>
            </div>
          )}
          {step === 3 && (
            <div className="choice-grid">
              {[
                "Student",
                "Early career",
                "Mid career",
                "Career transition",
              ].map((item) => (
                <button
                  className={journey === item ? "choice selected" : "choice"}
                  key={item}
                  onClick={() => setJourney(item)}
                >
                  <span>{item}</span>
                  {journey === item && <Icon name="check" size={17} />}
                </button>
              ))}
            </div>
          )}
          {step === 4 && (
            <div className="form-stack">
              <label className="field">
                <span>How often would you like to connect?</span>
                <select defaultValue="Every other week">
                  <option>Weekly</option>
                  <option>Every other week</option>
                  <option>Monthly</option>
                </select>
              </label>
              <label className="field">
                <span>Meeting preference</span>
                <select defaultValue="Video or chat">
                  <option>Video or chat</option>
                  <option>Video calls</option>
                  <option>Chat only</option>
                </select>
              </label>
            </div>
          )}
          <div className="builder-actions">
            {step > 1 ? (
              <Button variant="ghost" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            ) : (
              <span />
            )}
            {step < 4 ? (
              <Button icon="arrow" onClick={() => setStep(step + 1)}>
                Continue
              </Button>
            ) : (
              <Button icon="spark" onClick={() => navigate("discover")}>
                See my matches
              </Button>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

function MentorProfileBuilder({
  navigate,
}: {
  navigate: (screen: Screen) => void
}) {
  const [step, setStep] = useState(1)
  const [expertise, setExpertise] = useState([
    "Cloud architecture",
    "Career planning",
  ])
  const [styles, setStyles] = useState(["Goal-focused", "Encouraging"])
  const [verificationMethod, setVerificationMethod] =
    useState<"education" | "work" | "profile">("education")
  const [verificationValue, setVerificationValue] = useState("")
  const [codeSent, setCodeSent] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [verified, setVerified] = useState(false)
  const expertiseOptions = [
    "Cloud architecture",
    "Cybersecurity",
    "Software development",
    "Career planning",
    "Leadership",
    "Interview preparation",
  ]
  const styleOptions = [
    "Goal-focused",
    "Encouraging",
    "Direct feedback",
    "Project-based",
    "Open-ended",
    "Highly structured",
  ]
  const toggle = (
    value: string,
    selected: string[],
    update: (values: string[]) => void,
  ) =>
    update(
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value],
    )
  const steps = [
    ["Your expertise", "What you can help with"],
    ["Your experience", "Your professional background"],
    ["Verification", "Confirm your identity"],
    ["Mentoring style", "How you support others"],
    ["Availability", "When you can connect"],
  ]
  const chooseVerification = (method: "education" | "work" | "profile") => {
    setVerificationMethod(method)
    setVerificationValue("")
    setVerificationCode("")
    setCodeSent(false)
    setVerified(false)
  }

  return (
    <div className="builder-page mentor-builder">
      <header className="builder-header">
        <Brand compact />
        <span>Mentor profile · Step {step} of 5</span>
      </header>
      <div className="builder-progress">
        <i style={{ width: `${step * 20}%` }} />
      </div>
      <main className="builder-main">
        <aside className="step-list">
          {steps.map(([label, description], index) => (
            <div
              key={label}
              className={
                step === index + 1
                  ? "step active"
                  : step > index + 1
                    ? "step complete"
                    : "step"
              }
            >
              <span>
                {step > index + 1 ? <Icon name="check" size={15} /> : index + 1}
              </span>
              <div>
                <strong>{label}</strong>
                <small>{description}</small>
              </div>
            </div>
          ))}
        </aside>
        <section className="builder-card">
          <div className="mentor-builder-kicker">
            <span className="role-icon brown">
              <Icon name="spark" />
            </span>
            <span>
              <strong>Become a mentor</strong>
              <small>
                Build a profile that helps the right people find you
              </small>
            </span>
          </div>
          <span className="eyebrow">Share what you know</span>
          <h1>
            {step === 1
              ? "What can you mentor others in?"
              : step === 2
                ? "Tell us about your experience"
                : step === 3
                  ? "Verify your background"
                  : step === 4
                    ? "How do you like to mentor?"
                    : "When are you available?"}
          </h1>
          <p>
            {step === 1
              ? "Choose the areas where you can offer practical, confident guidance."
              : "Your answers help us introduce you to mentees who fit your strengths and schedule."}
          </p>
          {step === 1 && (
            <>
              <div className="choice-grid">
                {expertiseOptions.map((item) => (
                  <button
                    className={
                      expertise.includes(item) ? "choice selected" : "choice"
                    }
                    key={item}
                    onClick={() => toggle(item, expertise, setExpertise)}
                  >
                    <span>{item}</span>
                    {expertise.includes(item) && (
                      <Icon name="check" size={17} />
                    )}
                  </button>
                ))}
              </div>
              <p className="selection-note">
                {expertise.length} areas selected
              </p>
            </>
          )}
          {step === 2 && (
            <div className="form-stack">
              <div className="field-pair">
                <label className="field">
                  <span>Current role</span>
                  <input placeholder="e.g. Senior Cloud Architect" />
                </label>
                <label className="field">
                  <span>Company or organization</span>
                  <input placeholder="e.g. Northstar Systems" />
                </label>
              </div>
              <label className="field">
                <span>Years of professional experience</span>
                <select defaultValue="5–10 years">
                  <option>1–4 years</option>
                  <option>5–10 years</option>
                  <option>10–15 years</option>
                  <option>15+ years</option>
                </select>
              </label>
              <label className="field">
                <span>Your mentoring introduction</span>
                <textarea
                  placeholder="Share your professional journey and what motivates you to mentor..."
                  rows={4}
                />
              </label>
            </div>
          )}
          {step === 3 && (
            <div className="verification-flow">
              <div className="verification-options">
                <button
                  className={
                    verificationMethod === "education"
                      ? "verification-option selected"
                      : "verification-option"
                  }
                  onClick={() => chooseVerification("education")}
                >
                  <span className="verification-icon">
                    <Icon name="graduation" />
                  </span>
                  <span>
                    <strong>Education email</strong>
                    <small>Verify with your .edu institution email</small>
                  </span>
                  <i>
                    {verificationMethod === "education" && (
                      <Icon name="check" size={14} />
                    )}
                  </i>
                </button>
                <button
                  className={
                    verificationMethod === "work"
                      ? "verification-option selected"
                      : "verification-option"
                  }
                  onClick={() => chooseVerification("work")}
                >
                  <span className="verification-icon">
                    <Icon name="briefcase" />
                  </span>
                  <span>
                    <strong>Professional email</strong>
                    <small>Use your current organization email</small>
                  </span>
                  <i>
                    {verificationMethod === "work" && (
                      <Icon name="check" size={14} />
                    )}
                  </i>
                </button>
                <button
                  className={
                    verificationMethod === "profile"
                      ? "verification-option selected"
                      : "verification-option"
                  }
                  onClick={() => chooseVerification("profile")}
                >
                  <span className="verification-icon">
                    <Icon name="profile" />
                  </span>
                  <span>
                    <strong>Professional profile</strong>
                    <small>Connect an established career profile</small>
                  </span>
                  <i>
                    {verificationMethod === "profile" && (
                      <Icon name="check" size={14} />
                    )}
                  </i>
                </button>
              </div>
              <div className="verification-panel">
                {verified ? (
                  <div className="verification-success">
                    <span>
                      <Icon name="check" />
                    </span>
                    <div>
                      <strong>Background verified</strong>
                      <p>Your mentor profile will display a verified badge.</p>
                    </div>
                  </div>
                ) : verificationMethod === "profile" ? (
                  <>
                    <div className="trust-copy">
                      <Icon name="profile" />
                      <div>
                        <strong>Connect your professional profile</strong>
                        <p>
                          We’ll confirm your name, current role, and employment
                          history. We never post on your behalf.
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      icon="arrow"
                      className="full"
                      onClick={() => setVerified(true)}
                    >
                      Connect professional profile
                    </Button>
                  </>
                ) : (
                  <>
                    <label className="field">
                      <span>
                        {verificationMethod === "education"
                          ? "Institution email"
                          : "Organization email"}
                      </span>
                      <div className="verification-input">
                        <input
                          type="email"
                          value={verificationValue}
                          onChange={(event) =>
                            setVerificationValue(event.target.value)
                          }
                          placeholder={
                            verificationMethod === "education"
                              ? "name@university.edu"
                              : "name@company.com"
                          }
                        />
                        <Button
                          variant="secondary"
                          onClick={() => setCodeSent(true)}
                          disabled={!verificationValue.includes("@")}
                        >
                          {codeSent ? "Resend" : "Send code"}
                        </Button>
                      </div>
                    </label>
                    {codeSent && (
                      <div className="code-entry">
                        <label className="field">
                          <span>6-digit verification code</span>
                          <input
                            inputMode="numeric"
                            maxLength={6}
                            value={verificationCode}
                            onChange={(event) =>
                              setVerificationCode(
                                event.target.value.replace(/\D/g, ""),
                              )
                            }
                            placeholder="000000"
                          />
                        </label>
                        <Button
                          icon="check"
                          onClick={() => setVerified(true)}
                          disabled={verificationCode.length !== 6}
                        >
                          Verify
                        </Button>
                      </div>
                    )}
                    <p className="verification-help">
                      <Icon name="check" size={14} />
                      We use this only for verification and won’t show your
                      email publicly.
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="choice-grid">
              {styleOptions.map((item) => (
                <button
                  className={
                    styles.includes(item) ? "choice selected" : "choice"
                  }
                  key={item}
                  onClick={() => toggle(item, styles, setStyles)}
                >
                  <span>{item}</span>
                  {styles.includes(item) && <Icon name="check" size={17} />}
                </button>
              ))}
            </div>
          )}
          {step === 5 && (
            <div className="form-stack">
              <div className="availability-callout">
                <Icon name="clock" />
                <div>
                  <strong>Set a sustainable commitment</strong>
                  <p>
                    Most mentors start with one or two mentees and meet every
                    other week.
                  </p>
                </div>
              </div>
              <div className="field-pair">
                <label className="field">
                  <span>Meeting cadence</span>
                  <select defaultValue="Every other week">
                    <option>Weekly</option>
                    <option>Every other week</option>
                    <option>Monthly</option>
                  </select>
                </label>
                <label className="field">
                  <span>Session length</span>
                  <select defaultValue="45 minutes">
                    <option>30 minutes</option>
                    <option>45 minutes</option>
                    <option>60 minutes</option>
                  </select>
                </label>
              </div>
              <label className="field">
                <span>How many mentees can you support?</span>
                <select defaultValue="Up to 2 mentees">
                  <option>1 mentee</option>
                  <option>Up to 2 mentees</option>
                  <option>Up to 3 mentees</option>
                </select>
              </label>
            </div>
          )}
          <div className="builder-actions">
            {step > 1 ? (
              <Button variant="ghost" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            ) : (
              <span />
            )}
            {step < 5 ? (
              <Button
                icon="arrow"
                onClick={() => setStep(step + 1)}
                disabled={step === 3 && !verified}
              >
                Continue
              </Button>
            ) : (
              <Button icon="check" onClick={() => navigate("requirements")}>
                Publish mentor profile
              </Button>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

function PageHeading({
  eyebrow,
  title,
  copy,
  action,
}: {
  eyebrow?: string
  title: string
  copy?: string
  action?: ReactNode
}) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {copy && <p>{copy}</p>}
      </div>
      {action}
    </div>
  )
}

function Discover({ navigate }: { navigate: (screen: Screen) => void }) {
  const [index, setIndex] = useState(0)
  const [dragX, setDragX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
    null,
  )
  const [actionNotice, setActionNotice] = useState("")
  const dragStart = useRef(0)
  const mentor = mentors[index % mentors.length]
  const nextMentor = mentors[(index + 1) % mentors.length]
  const completeSwipe = (direction: "left" | "right") => {
    if (swipeDirection) return
    setSwipeDirection(direction)
    if ("vibrate" in navigator) navigator.vibrate(12)
    if (direction === "right") {
      setActionNotice(`Connection request sent to ${mentor.name}`)
      window.setTimeout(() => setActionNotice(""), 2400)
    }
    window.setTimeout(() => {
      setIndex((value) => value + 1)
      setSwipeDirection(null)
      setDragX(0)
    }, 280)
  }
  const startDrag = (event: ReactPointerEvent<HTMLElement>) => {
    if (swipeDirection) return
    dragStart.current = event.clientX
    setDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  const moveDrag = (event: ReactPointerEvent<HTMLElement>) => {
    if (!dragging || swipeDirection) return
    setDragX(event.clientX - dragStart.current)
  }
  const endDrag = () => {
    if (!dragging) return
    setDragging(false)
    if (Math.abs(dragX) > 85) {
      completeSwipe(dragX > 0 ? "right" : "left")
    } else {
      setDragX(0)
    }
  }
  const cardTransform = swipeDirection
    ? `translate3d(${
        swipeDirection === "right" ? "120vw" : "-120vw"
      }, 12px, 0) rotate(${swipeDirection === "right" ? 18 : -18}deg)`
    : `translate3d(${dragX}px, 0, 0) rotate(${dragX / 22}deg)`
  return (
    <AppShell screen="discover" navigate={navigate}>
      <div className="page narrow discover-page">
        <PageHeading
          eyebrow="Curated for you"
          title="Meet your next mentor"
          copy="Based on your goals, interests, and working style."
          action={
            <Button variant="secondary" icon="filter">
              Filters
            </Button>
          }
        />
        <div className="swipe-layout">
          <div className="deck-progress" aria-label="Mentor deck progress">
            {mentors.map((item, itemIndex) => (
              <i
                className={itemIndex === index % mentors.length ? "active" : ""}
                key={item.name}
              />
            ))}
          </div>
          <div className="swipe-deck">
            <section className="mentor-card next-card" aria-hidden="true">
              <div className="mentor-hero">
                <Avatar
                  initials={nextMentor.initials}
                  color={nextMentor.color}
                  large
                />
                <div className="mentor-title">
                  <span>Up next</span>
                  <h2>{nextMentor.name}</h2>
                  <p>{nextMentor.role}</p>
                </div>
              </div>
            </section>
            <section
              className={`mentor-card active-card ${
                dragging ? "dragging" : ""
              } ${swipeDirection ? `swiping-${swipeDirection}` : ""}`}
              onPointerDown={startDrag}
              onPointerMove={moveDrag}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              style={{ transform: cardTransform }}
            >
              <div
                className="decision-stamp decision-like"
                style={{ opacity: Math.min(Math.max(dragX / 80, 0), 1) }}
              >
                Connect
              </div>
              <div
                className="decision-stamp decision-pass"
                style={{ opacity: Math.min(Math.max(-dragX / 80, 0), 1) }}
              >
                Pass
              </div>
              <div className="mentor-hero">
                <div className="match-badge">
                  <Icon name="spark" size={15} /> {mentor.match}% match
                </div>
                <Avatar initials={mentor.initials} color={mentor.color} large />
                <div className="mentor-title">
                  <span>Recommended mentor</span>
                  <h2>{mentor.name}</h2>
                  <p>
                    {mentor.role} at {mentor.company}
                  </p>
                  <small>
                    <Icon name="location" size={15} /> {mentor.location}
                  </small>
                </div>
              </div>
              <div className="mentor-body">
                <p className="mentor-bio">“{mentor.bio}”</p>
                <div className="tag-row">
                  {mentor.tags.map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mentor-meta">
                  <span>
                    <Icon name="calendar" size={18} />
                    <strong>Biweekly</strong>
                    <small>Availability</small>
                  </span>
                  <span>
                    <Icon name="briefcase" size={18} />
                    <strong>8 years</strong>
                    <small>Experience</small>
                  </span>
                  <span>
                    <Icon name="message" size={18} />
                    <strong>12 mentees</strong>
                    <small>Mentored</small>
                  </span>
                </div>
                <button
                  className="view-profile"
                  onClick={() => navigate("mentor")}
                >
                  View full profile <Icon name="arrow" size={17} />
                </button>
              </div>
            </section>
          </div>
          <div className="swipe-actions">
            <button
              className="circle-action pass"
              onClick={() => completeSwipe("left")}
              aria-label="Pass"
            >
              <Icon name="close" size={25} />
            </button>
            <button
              className="circle-action accept"
              onClick={() => completeSwipe("right")}
              aria-label="Connect"
            >
              <Icon name="heart" size={25} />
            </button>
          </div>
          <p className="swipe-tip">
            <span className="mobile-swipe-copy">
              Swipe left to pass · right to connect
            </span>
            <span className="desktop-swipe-copy">
              Pass for now <i>or</i> send a connection request
            </span>
          </p>
        </div>
        {actionNotice && (
          <div className="action-toast" role="status">
            <span>
              <Icon name="check" size={16} />
            </span>
            {actionNotice}
          </div>
        )}
      </div>
    </AppShell>
  )
}

function MentorDetail({ navigate }: { navigate: (screen: Screen) => void }) {
  return (
    <AppShell screen="mentor" navigate={navigate}>
      <div className="page">
        <button className="back-link" onClick={() => navigate("discover")}>
          <Icon name="back" size={19} /> Back to discover
        </button>
        <section className="detail-hero">
          <Avatar initials="MC" large />
          <div className="detail-title">
            <div className="match-badge">
              <Icon name="spark" size={15} /> 96% match
            </div>
            <h1>Dr. Maya Chen</h1>
            <p>Senior Cloud Architect at Northstar Systems</p>
            <small>
              <Icon name="location" size={15} /> Los Angeles, CA · Available
              biweekly
            </small>
          </div>
          <Button icon="heart" onClick={() => navigate("matches")}>
            Request mentorship
          </Button>
        </section>
        <div className="detail-grid">
          <div className="detail-main">
            <section className="content-card">
              <h2>About Maya</h2>
              <p>
                I’m a cloud architect and educator who believes a good mentor
                helps you ask better questions—not just find quick answers. My
                own path into technology wasn’t linear, so I especially enjoy
                supporting students and career changers.
              </p>
              <p>
                We’ll set practical goals, build confidence through small wins,
                and create a roadmap that feels like yours.
              </p>
            </section>
            <section className="content-card">
              <h2>How I can help</h2>
              <div className="tag-row">
                {mentors[0].tags
                  .concat(["Technical portfolios", "Networking"])
                  .map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
              </div>
            </section>
            <section className="content-card">
              <h2>Mentoring approach</h2>
              <div className="approach-list">
                <span>
                  <i>
                    <Icon name="target" />
                  </i>
                  <div>
                    <strong>Goal-focused</strong>
                    <p>
                      Clear milestones and useful next steps after every
                      conversation.
                    </p>
                  </div>
                </span>
                <span>
                  <i>
                    <Icon name="message" />
                  </i>
                  <div>
                    <strong>Open and candid</strong>
                    <p>
                      Direct, encouraging feedback in a judgment-free space.
                    </p>
                  </div>
                </span>
              </div>
            </section>
          </div>
          <aside className="detail-side">
            <section className="content-card facts">
              <h3>At a glance</h3>
              <span>
                <Icon name="briefcase" />
                <div>
                  <strong>8 years</strong>
                  <small>Industry experience</small>
                </div>
              </span>
              <span>
                <Icon name="users" />
                <div>
                  <strong>12 people</strong>
                  <small>Mentored so far</small>
                </div>
              </span>
              <span>
                <Icon name="clock" />
                <div>
                  <strong>45 minutes</strong>
                  <small>Typical session</small>
                </div>
              </span>
            </section>
            <section className="quote-card">
              “The best mentorship creates the confidence to keep learning long
              after the session ends.”
            </section>
          </aside>
        </div>
      </div>
    </AppShell>
  )
}

function Requests({ navigate }: { navigate: (screen: Screen) => void }) {
  const [requests, setRequests] = useState([
    {
      name: "Jordan Lee",
      initials: "JL",
      title: "CIT student · Senior",
      goal: "Transition into cybersecurity and prepare for entry-level security roles.",
      overlap: ["Cybersecurity", "Certifications"],
    },
    {
      name: "Nina Torres",
      initials: "NT",
      title: "IT Support Specialist",
      goal: "Build a cloud portfolio and move toward a junior cloud engineering role.",
      overlap: ["Cloud architecture", "Career planning"],
    },
  ])
  return (
    <AppShell screen="requests" navigate={navigate}>
      <div className="page">
        <PageHeading
          eyebrow="Mentor workspace"
          title="Connection requests"
          copy={`${requests.length} people would like to learn from you.`}
        />
        {requests.length ? (
          <div className="request-list">
            {requests.map((request, index) => (
              <section className="request-card" key={request.name}>
                <div className="request-person">
                  <Avatar
                    initials={request.initials}
                    color={index ? "avatar-brown" : "avatar-navy"}
                  />
                  <div>
                    <h2>{request.name}</h2>
                    <p>{request.title}</p>
                    <small>
                      Requested {index ? "yesterday" : "2 hours ago"}
                    </small>
                  </div>
                </div>
                <div className="request-goal">
                  <span>What they’re working toward</span>
                  <p>{request.goal}</p>
                  <div className="tag-row">
                    {request.overlap.map((tag) => (
                      <span className="tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="request-actions">
                  <Button
                    variant="pass"
                    onClick={() =>
                      setRequests((items) =>
                        items.filter((item) => item.name !== request.name),
                      )
                    }
                  >
                    Decline
                  </Button>
                  <Button
                    variant="accept"
                    icon="check"
                    onClick={() => navigate("matches")}
                  >
                    Accept request
                  </Button>
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span>
              <Icon name="requests" size={28} />
            </span>
            <h2>You’re all caught up</h2>
            <p>New connection requests will appear here.</p>
          </div>
        )}
      </div>
    </AppShell>
  )
}

function Requirements({ navigate }: { navigate: (screen: Screen) => void }) {
  const [rules, setRules] = useState([
    {
      label: "Areas I can mentor",
      value: "Cloud architecture, career planning, AWS",
    },
    {
      label: "Preferred experience level",
      value: "Students and early-career professionals",
    },
    { label: "Meeting cadence", value: "Every other week · 45 minutes" },
    {
      label: "Communication style",
      value: "Direct, structured, and encouraging",
    },
  ])
  const addRule = () =>
    setRules((items) => [
      ...items,
      {
        label: "New preference",
        value: "Click edit to describe your preference",
      },
    ])
  return (
    <AppShell screen="requirements" navigate={navigate}>
      <div className="page medium">
        <PageHeading
          eyebrow="Mentor profile"
          title="Mentoring preferences"
          copy="Help us send you requests from people you’re best equipped to support."
          action={
            <Button variant="secondary" icon="edit" onClick={addRule}>
              Add preference
            </Button>
          }
        />
        <section className="profile-summary">
          <Avatar initials="MC" large />
          <div>
            <h2>Dr. Maya Chen</h2>
            <p>Senior Cloud Architect · Mentor</p>
            <span className="status-dot">Profile active</span>
          </div>
          <div className="profile-score">
            <strong>92%</strong>
            <small>Profile strength</small>
          </div>
        </section>
        <section className="rules-card">
          <div className="rules-head">
            <div>
              <h2>Your matching criteria</h2>
              <p>These preferences shape who can request you as a mentor.</p>
            </div>
            <span>{rules.length} preferences</span>
          </div>
          {rules.map((rule, index) => (
            <div className="rule-row" key={`${rule.label}-${index}`}>
              <span className="rule-number">{index + 1}</span>
              <div>
                <small>{rule.label}</small>
                <strong>{rule.value}</strong>
              </div>
              <button aria-label={`Edit ${rule.label}`}>
                <Icon name="edit" size={18} />
              </button>
            </div>
          ))}
        </section>
        <div className="save-bar">
          <span>
            <Icon name="check" size={17} /> All changes saved
          </span>
          <Button onClick={() => navigate("discover")}>
            Preview my profile
          </Button>
        </div>
      </div>
    </AppShell>
  )
}

function Matches({ navigate }: { navigate: (screen: Screen) => void }) {
  return (
    <AppShell screen="matches" navigate={navigate}>
      <div className="page">
        <PageHeading
          eyebrow="Your network"
          title="Matches"
          copy="Keep the conversation going with your mentorship connections."
          action={
            <label className="search-box">
              <Icon name="search" size={18} />
              <input placeholder="Search matches" />
            </label>
          }
        />
        <section className="match-featured">
          <div className="match-person">
            <div className="online-wrap">
              <Avatar initials="MC" large />
              <i />
            </div>
            <div>
              <span className="eyebrow">Active mentorship</span>
              <h2>Dr. Maya Chen</h2>
              <p>Senior Cloud Architect · Northstar Systems</p>
            </div>
          </div>
          <div className="next-session">
            <Icon name="calendar" />
            <span>
              <small>Next session</small>
              <strong>Thursday, 3:00 PM</strong>
            </span>
          </div>
          <Button icon="message" onClick={() => navigate("conversation")}>
            Open conversation
          </Button>
        </section>
        <div className="section-label">
          <h2>Recent connections</h2>
          <span>2 people</span>
        </div>
        <div className="match-grid">
          {mentors.slice(1).map((mentor, index) => (
            <section className="match-card" key={mentor.name}>
              <div className="online-wrap">
                <Avatar initials={mentor.initials} color={mentor.color} />
                <i className={index ? "offline" : ""} />
              </div>
              <div className="match-card-title">
                <h3>{mentor.name}</h3>
                <p>{mentor.role}</p>
              </div>
              <p className="last-message">
                {index
                  ? "You’re connected. Say hello and start a conversation."
                  : "That resource you shared was very helpful—thank you!"}
              </p>
              <div>
                <span className="tag">{index ? "New match" : "2h ago"}</span>
                <button
                  onClick={() => navigate("conversation")}
                  aria-label={`Message ${mentor.name}`}
                >
                  <Icon name="arrow" size={18} />
                </button>
              </div>
            </section>
          ))}
        </div>
      </div>
    </AppShell>
  )
}

function Conversation({ navigate }: { navigate: (screen: Screen) => void }) {
  const [thread, setThread] = useState(messages)
  const [draft, setDraft] = useState("")
  const send = (event: FormEvent) => {
    event.preventDefault()
    if (!draft.trim()) return
    setThread((items) => [
      ...items,
      { from: "me", text: draft.trim(), time: "Now" },
    ])
    setDraft("")
  }
  return (
    <AppShell screen="conversation" navigate={navigate}>
      <div className="conversation-page">
        <header className="conversation-head">
          <button className="back-link" onClick={() => navigate("matches")}>
            <Icon name="back" size={19} />
            <span className="desktop-only">Matches</span>
          </button>
          <div className="conversation-person">
            <div className="online-wrap">
              <Avatar initials="MC" />
              <i />
            </div>
            <span>
              <strong>Dr. Maya Chen</strong>
              <small>Online · Your mentor</small>
            </span>
          </div>
          <Button variant="secondary" icon="calendar">
            Schedule
          </Button>
        </header>
        <div className="conversation-body">
          <div className="date-divider">
            <span>Today</span>
          </div>
          {thread.map((message, index) => (
            <div
              className={`message-row ${message.from === "me" ? "mine" : ""}`}
              key={`${message.time}-${index}`}
            >
              {message.from === "mentor" && <Avatar initials="MC" />}
              <div className="message-wrap">
                <div className="message-bubble">{message.text}</div>
                <small>{message.time}</small>
              </div>
            </div>
          ))}
        </div>
        <form className="composer" onSubmit={send}>
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Write a message..."
            aria-label="Message"
          />
          <button type="submit" aria-label="Send message">
            <Icon name="send" size={20} />
          </button>
        </form>
      </div>
    </AppShell>
  )
}

function PrototypeScreens() {
  const [screen, setScreen] = useState<Screen>("signup")
  const [role, setRole] = useState<"mentee" | "mentor">("mentee")
  const join = (selectedRole: "mentee" | "mentor") => {
    setRole(selectedRole)
    setScreen("profile")
  }
  if (screen === "signup") return <Signup navigate={setScreen} onJoin={join} />
  if (screen === "profile")
    return role === "mentor" ? (
      <MentorProfileBuilder navigate={setScreen} />
    ) : (
      <ProfileBuilder navigate={setScreen} />
    )
  if (screen === "discover") return <Discover navigate={setScreen} />
  if (screen === "mentor") return <MentorDetail navigate={setScreen} />
  if (screen === "requests") return <Requests navigate={setScreen} />
  if (screen === "requirements") return <Requirements navigate={setScreen} />
  if (screen === "matches") return <Matches navigate={setScreen} />
  return <Conversation navigate={setScreen} />
}

export default function Prototype() {
  return (
    <div className="prototype">
      <aside className="prototype-notice" aria-label="Prototype information">
        <span>Prototype · Use sample info</span>
        <a href="/">Project status</a>
      </aside>
      <PrototypeScreens />
    </div>
  )
}
