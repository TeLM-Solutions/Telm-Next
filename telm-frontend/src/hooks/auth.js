import useSWR from "swr";
import axios from "@/lib/axios";
import { useEffect } from "react";
import { useRouter } from "next/router";

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
  const router = useRouter();

  const { data: user, error, mutate } = useSWR("/api/user", () =>
    axios
      .get("/api/user")
      .then((res) => res?.data)
      .catch((error) => {
        if (error.response?.status !== 409) throw error;
        router.push("/verify-email");
      })
  );

  const csrf = () => axios.get("/sanctum/csrf-cookie");

  const register = async ({ setErrors, ...props }) => {
    await csrf();
    setErrors([]);

    axios
      .post("/register", props)
      .then(() => mutate())
      .catch((error) => {
        if (error.response?.status === 422) {
          setErrors(error.response.data.errors);
        } else {
          // Handle other errors
          console.error(error);
        }
      });
  };

  const login = async ({ setErrors, setStatus, setIsLoading, ...props }) => {
    await csrf();
    setErrors([]);
    setStatus(null);
    setIsLoading(true);

    axios
      .post("/login", props)
      .then(() => {
        mutate(); // Refresh user state after login
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        if (error.response?.status === 422) {
          setErrors(error.response.data.errors);
        } else {
          // Handle other errors
          console.error(error);
        }
      });
  };

  const forgotPassword = async ({ setErrors, setStatus, email }) => {
    await csrf();
    setErrors([]);
    setStatus(null);

    axios
      .post("/forgot-password", { email })
      .then((response) => setStatus(response.data.status))
      .catch((error) => {
        if (error.response?.status === 422) {
          setErrors(error.response.data.errors);
        } else {
          // Handle other errors
          console.error(error);
        }
      });
  };

  const resetPassword = async ({ setErrors, setStatus, ...props }) => {
    await csrf();
    setErrors([]);
    setStatus(null);

    axios
      .post("/reset-password", { token: router.query.token, ...props })
      .then((response) =>
        router.push("/login?reset=" + btoa(response.data.status))
      )
      .catch((error) => {
        if (error.response?.status === 422) {
          setErrors(error.response.data.errors);
        } else {
          // Handle other errors
          console.error(error);
        }
      });
  };

  const resendEmailVerification = async ({ setStatus }) => {
    axios
      .post("/email/verification-notification")
      .then((response) => setStatus(response.data.status))
      .catch((error) => {
        console.error(error); // Handle any errors
      });
  };

  const logout = async () => {
    if (!error) {
        axios
            .post("/logout")
            .then(() => {
                mutate(null, false); // Set user to null and prevent revalidation
                router.push("/login");
            })
            .catch((err) => {
                console.error(err); // Handle any errors
            });
    } else {
        mutate(null, false); // Ensure user is null even if there is an error
        router.push("/login"); // Redirect to login on logout even if error
    }
};

useEffect(() => {
    // If the middleware is 'guest' and user is authenticated, redirect to their dashboard
    if (middleware === "guest" && redirectIfAuthenticated && user) {
        router.push(`${user.role}/dashboard`);
    }

    // If on verify-email page but email is verified, redirect to the appropriate page
    if (window.location.pathname === "/verify-email" && user?.email_verified_at) {
        router.push(redirectIfAuthenticated);
    }

    // If middleware is 'auth' and there's an error (like 401), log out and redirect
    if (middleware === "auth" && error) {
        logout();
    }
}, [user, error]);


  return {
    user,
    register,
    login,
    forgotPassword,
    resetPassword,
    resendEmailVerification,
    logout,
  };
};
