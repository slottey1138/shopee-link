import withProtectedUser from "@/hoc/withProtectedUser";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/includes/Layout";

function HomePage() {
  const { user, logout } = useAuth();

  return (
    <Layout>
      dsad
      <h1 className="text-primary">Welcome {user?.name}</h1>
      <button className="text-primary" onClick={logout}>
        Logout
      </button>
    </Layout>
  );
}

export default withProtectedUser(HomePage);
