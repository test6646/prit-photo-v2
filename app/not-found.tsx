export default function NotFound() {
return (
<section
className="relative w-full min-h-screen flex items-center justify-center px-[6vw] font-[blauer]"
style={{ background: "var(--background)" }}
> <div className="w-full max-w-[900px] mx-auto flex flex-col items-center text-center">

    {/* ERROR ICON */}
    <div
      className="mb-8 w-16 h-16 flex items-center justify-center border rounded-full"
      style={{ borderColor: "var(--border)" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-7 h-7"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--text)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="13" />
        <circle cx="12" cy="16" r="1" fill="var(--text)" stroke="none" />
      </svg>
    </div>

    {/* HUGE 404 */}
    <h1
      className="text-[32vw] md:text-[18vw] leading-none font-light tracking-[-0.06em]"
      style={{ color: "var(--text)" }}
    >
      404
    </h1>

    {/* TITLE */}
    <h2
      className="mt-4 text-[28px] md:text-[42px] font-light tracking-[-0.03em]"
      style={{ color: "var(--text)" }}
    >
      Oops. You lost your way.
    </h2>

    {/* TEXT */}
    <p
      className="mt-6 text-[15px] md:text-[17px] max-w-[520px] leading-[1.7]"
      style={{ color: "var(--text-muted)" }}
    >
      Looks like you wandered outside the frame. <br />
      Don’t worry — it happens to the best of us.
    </p>

    {/* BUTTON */}
    <a
      href="/"
      className="mt-10 inline-flex items-center justify-center px-10 py-3 rounded-full text-[13px] tracking-[0.2em]"
      style={{
        background: "var(--accent)",
        color: "var(--background)"
      }}
    >
      BACK TO HOME
    </a>

  </div>
</section>

)
}
