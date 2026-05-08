import { Redirect } from "expo-router";
import { useSelector } from "react-redux";

export default function Index() {
  const { isAuthenticated, token } = useSelector((state) => state.auth);

  return isAuthenticated ? (
    <Redirect href="/screens/home/" />
  ) : (
    <Redirect href="/auth/login" />
  );
}
