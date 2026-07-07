import Link from "next/link";

// Root fallback for pathnames outside the [locale] tree.
export default function RootNotFound() {
  return (
    <html lang="uz">
      <body style={{ fontFamily: "system-ui, sans-serif", background: "#f7f3ec", color: "#14161f" }}>
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "6rem 1rem", textAlign: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- raw html/body shell outside the [locale] tree */}
          <img src="/oltinoy_logo.png" alt="Oltinoy Collection" width={64} height={63} style={{ margin: "0 auto 1.5rem" }} />
          <div style={{ fontSize: "3.5rem", fontWeight: 600, color: "#c9a227" }}>404</div>
          <h1 style={{ fontSize: "1.5rem", marginTop: "1rem" }}>Sahifa topilmadi</h1>
          <p style={{ marginTop: "0.5rem", color: "#6b6558" }}>Kechirasiz, siz qidirgan sahifa mavjud emas.</p>
          <Link
            href="/"
            style={{
              display: "inline-block",
              marginTop: "1.5rem",
              padding: "0.7rem 1.4rem",
              borderRadius: 999,
              background: "#c9a227",
              color: "#14161f",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Bosh sahifaga qaytish
          </Link>
        </div>
      </body>
    </html>
  );
}
