import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="wrap notfound">
      <h1>404</h1>
      <p>This page doesn&rsquo;t exist.</p>
      <div className="hero-ctas">
        <Link href="/components" className="btn btn-primary">
          Browse components
        </Link>
        <Link href="/docs" className="btn btn-ghost">
          Read the docs
        </Link>
      </div>
    </main>
  );
}
