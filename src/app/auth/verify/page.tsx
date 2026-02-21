export default function VerifyPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="max-w-sm text-center">
        <div className="mb-4 text-4xl">&#9993;</div>
        <h1 className="text-xl font-bold text-brand-text">Check your email</h1>
        <p className="mt-2 text-sm text-brand-muted">
          A sign-in link has been sent to your email address. Click the link to
          complete sign in.
        </p>
      </div>
    </div>
  );
}
