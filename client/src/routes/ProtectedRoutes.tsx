import { PropsWithChildren, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

type ProtectedRoutesProps = PropsWithChildren;

export default function ProtectedRoutes({ children }: ProtectedRoutesProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null) {
      navigate("/signin", { replace: true });
    }
  }, [user, navigate]);

  return children;
}
