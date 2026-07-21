import Header from "../components/Header";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <Header />

      <main className="p-6">{children}</main>
    </div>
  );
}
