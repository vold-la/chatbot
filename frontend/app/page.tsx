import { MessageContainer } from "./components/MessageContainer";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <MessageContainer />
    </main>
  );
}
