import { Redirect, Slot } from "expo-router";
import { useSelector } from "react-redux";

const AuthLayout = () => {
  const { isAuthenticated, token } = useSelector((state) => state.auth);

  if (isAuthenticated || token) {
    return <Redirect href="/screens/home" />;
  }

  return <Slot />;
};

export default AuthLayout;
