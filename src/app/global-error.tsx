"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ro">
      <body
        style={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#5f6361",
          color: "#ece3cb",
          fontFamily: "Montserrat, sans-serif",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <h2
          style={{
            fontSize: "1.875rem",
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
        >
          Eroare critică
        </h2>
        <p style={{ color: "#e8e0c8", marginBottom: "2rem" }}>
          A apărut o eroare neașteptată. Încercați din nou.
        </p>
        <button
          onClick={reset}
          style={{
            backgroundColor: "#ece3cb",
            color: "#555a57",
            padding: "0.75rem 1.5rem",
            borderRadius: "9999px",
            border: "none",
            fontWeight: 600,
            cursor: "pointer",
            minHeight: "44px",
          }}
        >
          Încearcă din nou
        </button>
      </body>
    </html>
  );
}
