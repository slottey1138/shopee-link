import withProtectedUser from "@/hoc/withProtectedUser";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/includes/Layout";

function HomePage() {
  const { user, logout } = useAuth();

  return <Layout></Layout>;
}

export default withProtectedUser(HomePage);
