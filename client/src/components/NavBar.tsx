import { useAuth } from "../context/AuthProvider";

export default function NavBar() {
  const { user, signOut } = useAuth();
  return (
    <div className="flex justify-between items-center p-4">
      <h1>Todo App</h1>

      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
