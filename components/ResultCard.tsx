type ResultCardProps = {
  title: string;
  body: string;
};

export function ResultCard({ title, body }: ResultCardProps) {
  return (
    <article className="rounded-lg border border-hcdr-light-grey bg-white p-5 shadow-sm">
      <h2 className="text-2xl font-semibold text-hcdr-dark">{title}</h2>
      <p className="mt-3 leading-relaxed text-hcdr-body">{body}</p>
    </article>
  );
}
