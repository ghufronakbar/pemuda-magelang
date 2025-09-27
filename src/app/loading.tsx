export default function Loading() {
  return (
    <div className="flex min-h-[calc(100vh-100px)] flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Memuat...</h1>
        <p className="text-lg">Halaman sedang dimuat...</p>
        <p className="text-sm text-muted-foreground">
          Halaman ini mungkin membutuhkan beberapa detik untuk dimuat.
        </p>
      </div>
    </div>
  );
}
