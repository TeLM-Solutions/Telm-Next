import {
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Image from "next/image";
import { useAuth } from "@/hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";
import LoginError from "@/components/Login/LoginError";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const Login = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const router = useRouter();

  const { login } = useAuth({
    middleware: "guest",
    redirectIfAuthenticated: "/admin/dashboard", // Redirect if already authenticated
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shouldRemember, setShouldRemember] = useState(true);
  const [errors, setErrors] = useState([]);
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (router.query.reset?.length > 0 && errors.length === 0) {
      setStatus(atob(router.query.reset));
    } else {
      setStatus(null);
    }
  }, [router.query.reset]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setIsLoading(true);
      login({
        email,
        password,
        remember: shouldRemember,
        setErrors,
        setStatus,
        setIsLoading,
      });
    },
    [email, password, shouldRemember, login]
  );

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <Box
        item="true"
        sx={{ position: "absolute", left: "1rem", top: "1rem" }}
      >
        <Image
          src={"/images/login-logo.png"}
          alt={"logo"}
          width={270}
          height={80}
        />
      </Box>
      {isMobile && (
        <Box
          item="true"
          sx={{
            position: "fixed",
            left: "-3rem",
            bottom: "-5rem",
            background: "url(/images/login-bg-mobile.png)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            width: "100vw",
            height: "18rem",
          }}
        />
      )}
      <Grid
        item
        xs={false}
        sm={4}
        md={8}
        sx={{
          backgroundImage: "url(/images/login-bg.png)",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#E7F9FF",
          backgroundSize: "130%",
        }}
      />
      <Grid
        item
        xs={12}
        sm={8}
        md={4}
        component={Paper}
        elevation={6}
        square
        sx={{
          boxShadow: "none",
          display: "flex",
          justifyContent: "center",
          background: isMobile ? "#e7f9ff" : "#fff",
        }}
      >
        <Box
          sx={{
            my: isMobile ? 0 : 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {status && <div className="auth-status">{status}</div>}
          <Typography component="h1" variant="h4">
            Login
          </Typography>
          <Typography component="p" variant="caption">
            Login to your account to get started!
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={(event) => setEmail(event.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              disabled={isLoading}
              variant="contained"
              color={"secondary"}
              sx={{ mt: 3, mb: 2 }}
              size={"large"}
            >
              {!isLoading && <span>Login</span>}
              {isLoading && <CircularProgress color="inherit" size="1.5rem" />}
            </Button>
            {errors && <LoginError messages={errors} />}
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
