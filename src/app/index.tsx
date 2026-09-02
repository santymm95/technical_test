import { FullPageLoader } from "@/components/full-page-loader";
import { useAppContext } from "@/context/app-context";
import HomeScreen from "@/screens/home-screen";
import LoginScreen from "@/screens/login-screen";

export default function AppEntry() {
  const { token, sessionReady, loginLoading } = useAppContext();

  if (!sessionReady || loginLoading) {
    return <FullPageLoader />;
  }

  return token ? <HomeScreen /> : <LoginScreen />;
}
