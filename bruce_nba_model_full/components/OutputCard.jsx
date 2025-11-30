export default function OutputCard({ result }) {
  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-2xl border">
      <pre className="whitespace-pre-wrap text-gray-800 leading-relaxed">
        {result}
      </pre>
    </div>
  );
}