import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <Box sx={{ background: "#f6f8fb", minHeight: "100vh" }}>

      {/* ================= HERO ================= */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1976d2, #1565c0)",
          color: "#fff",
          py: { xs: 9, md: 12 },
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "2.2rem", md: "2.8rem" },
            fontWeight: 600,
            letterSpacing: "-0.4px",
            lineHeight: 1.25,
            mb: 2.5,
          }}
        >
          Automate Workflows • Track Progress • Deliver Faster
        </Typography>

        <Typography
          sx={{
            maxWidth: 720,
            mx: "auto",
            opacity: 0.9,
            fontSize: "1.05rem",
            lineHeight: 1.7,
            fontWeight: 400,
          }}
          mb={4.5}
        >
          A role-based workflow automation system designed to keep teams aligned,
          enforce task sequence, and provide real-time visibility across projects.
        </Typography>

        <Box display="flex" justifyContent="center" gap={2.5} flexWrap="wrap">
          <Button
            size="large"
            variant="contained"
            onClick={() => navigate("/login")}
            sx={{
              bgcolor: "#fff",
              color: "#1976d2",
              fontWeight: 600,
              px: 4.5,
              py: 1.3,
              borderRadius: 2,
              boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
              transition: "all 0.25s ease",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 10px 26px rgba(0,0,0,0.28)",
                bgcolor: "#f5f5f5",
              },
            }}
          >
            Get Started
          </Button>

          <Button
            size="large"
            variant="outlined"
            onClick={() => navigate("/register")}
            sx={{
              borderColor: "#fff",
              color: "#fff",
              fontWeight: 600,
              px: 4.5,
              py: 1.3,
              borderRadius: 2,
              transition: "all 0.25s ease",
              "&:hover": {
                background: "rgba(255,255,255,0.14)",
              },
            }}
          >
            Create Account
          </Button>
        </Box>
      </Box>

      {/* ================= PROBLEM / SOLUTION ================= */}
      <Box sx={{ maxWidth: 1100, mx: "auto", py: 7, px: 2 }}>
        <Typography
          sx={{
            fontSize: "1.85rem",
            fontWeight: 600,
            textAlign: "center",
            mb: 4,
          }}
        >
          Why Workflow Automation?
        </Typography>

        <Box
          display="grid"
          gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
          gap={4}
        >
          {[
            {
              title: "❌ The Problem",
              desc:
                "Teams lose momentum due to unclear ownership, broken sequences, and manual coordination.",
            },
            {
              title: "✅ The Solution",
              desc:
                "Structured workflows with enforced order, accountability, and dynamic progress tracking.",
            },
          ].map((item, i) => (
            <Card
              key={i}
              sx={{
                borderRadius: 3,
                transition: "all 0.25s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
                },
              }}
            >
              <CardContent>
                <Typography fontWeight={600} mb={1}>
                  {item.title}
                </Typography>
                <Typography color="text.secondary" lineHeight={1.65}>
                  {item.desc}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* ================= FEATURES ================= */}
      <Box sx={{ background: "#fff", py: 7 }}>
        <Box sx={{ maxWidth: 1100, mx: "auto", px: 2 }}>
          <Typography
            sx={{
              fontSize: "1.85rem",
              fontWeight: 600,
              textAlign: "center",
              mb: 5,
            }}
          >
            Features That Scale With Your Team
          </Typography>

          <Box
            display="grid"
            gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" }}
            gap={4}
          >
            {[
              ["Sequential Tasks", "Work progresses only when prerequisites are complete."],
              ["Role-Based Access", "Clear separation of admin and user responsibilities."],
              ["Live Status Updates", "Instant visibility into workflow progress."],
              ["Enterprise Ready", "Designed for reliability, clarity, and growth."],
            ].map(([title, desc], i) => (
              <Card
                key={i}
                sx={{
                  borderRadius: 3,
                  transition: "all 0.25s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
                  },
                }}
              >
                <CardContent>
                  <Typography fontWeight={600} mb={1}>
                    {title}
                  </Typography>
                  <Typography color="text.secondary" lineHeight={1.65}>
                    {desc}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>

      {/* ================= CLEAN FOOTER ================= */}
      <Box
        sx={{
          background: "#0f2f57",
          color: "#fff",
          py: 3,
        }}
      >
        <Box
          sx={{
            maxWidth: 1100,
            mx: "auto",
            px: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography sx={{ fontSize: "0.85rem", opacity: 0.9 }}>
            © {new Date().getFullYear()} Workflow Automation
          </Typography>

          <Typography sx={{ fontSize: "0.85rem", opacity: 0.75 }}>
            Privacy • Terms • Security
          </Typography>
        </Box>
      </Box>

    </Box>
  );
}

