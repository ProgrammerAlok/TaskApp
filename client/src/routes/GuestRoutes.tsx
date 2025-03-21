import { PropsWithChildren, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

type GuestRoutesProps = PropsWithChildren;

export default function GuestRoutes({ children }: GuestRoutesProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user !== null) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  return children;
}
