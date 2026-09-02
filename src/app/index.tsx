import { FullPageLoader } from "@/components/full-page-loader";
import { useAppContext } from "@/context/app-context";
import LoginScreen from "@/screens/login-screen";
import UsersScreen from "@/screens/users-screen";

export default function HomeScreen() {
  const { token, sessionReady, loginLoading } = useAppContext();

  if (!sessionReady || loginLoading) {
    return <FullPageLoader />;
  }

  return token ? <UsersScreen /> : <LoginScreen />;
}
