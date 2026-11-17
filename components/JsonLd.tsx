// Renders schema.org structured data. `<` is escaped so product text can't close the script tag.
export default function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  const graph = Array.isArray(data) ? { "@context": "https://schema.org", "@graph": data } : { "@context": "https://schema.org", ...data };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }} />;
}
