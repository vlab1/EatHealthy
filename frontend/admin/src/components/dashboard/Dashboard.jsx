import {
  Box,
  Card,
  CardActions,
  Button,
  CardContent,
  Container,
  Typography,
  Stack,
  Select,
  MenuItem,
} from "@mui/material";

import { useState, useEffect, useCallback } from "react";
import { useTranslate, useNotify } from "react-admin";

export default function Dashboard() {
  const apiUrl = process.env.REACT_APP_URL;

  const notify = useNotify();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const t = useTranslate();
  const fetchBackups = useCallback(async () => {
    try {
      await fetch(`${apiUrl}api/admin/get-backups`, {
        method: "GET",
        body: null,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
        .then(async (response) => {
          if (response.status < 200 || response.status >= 300) {
            throw new Error(response.statusText);
          }
          const json = await response.json();
          const data = json["data"];
          setSelectedItem(data[data.length - 1]);
          setData(data);
          setIsLoading(true);
        })
        .catch(() => {
          throw new Error("Error");
        });
    } catch (e) {
      setIsLoading(true);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchBackups();
  }, [fetchBackups]);

  const handleSelect = (event) => {
    setSelectedItem(event.target.value);
  };

  const handleBackup = async () => {
    try {
      await fetch(`${apiUrl}api/admin/create-backup`, {
        method: "POST",
        body: null,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }).then(async (response) => {
        if (response.status < 200 || response.status >= 300) {
          notify(t("error"), { type: "Error" });
          throw new Error(response.statusText);
        }
        notify(t("success"), { type: "Success" });
        fetchBackups();
      });
    } catch (e) {
      notify(t("error"), { type: "Error" });
    }
  };

  const handleRestore = async () => {
    try {
      await fetch(`${apiUrl}api/admin/restore-data`, {
        method: "POST",
        body: JSON.stringify({ backupDate: selectedItem }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }).then(async (response) => {
        if (response.status < 200 || response.status >= 300) {
          notify(t("error"), { type: "Error" });
          throw new Error(response.statusText);
        }
        notify(t("success"), { type: "Success" });
      });
    } catch (e) {
      notify(t("error"), { type: "Error" });
    }
  };

  return isLoading ? (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="85vh"
    >
      <Container maxWidth="xl">
        <Typography
          display="flex"
          justifyContent="center"
          alignItems="center"
          variant="h4"
          sx={{ mb: 5, mt: 5 }}
        >
          {t("dashboard.backup")}
        </Typography>
        <Stack direction="row" justifyContent="center">
          <Stack direction="column" justifyContent="center">
            <Card
              sx={{
                minWidth: 645,
                height: 300,

                p: 5,
                width: "60%",
                background: "transparent",
              }}
            >
              <CardContent ntent>
                <Typography
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  gutterBottom
                  variant="h5"
                  component="div"
                  marginTop="30px"
                  marginBottom="20px"
                >
                  {t("dashboard.createBackup")}
                </Typography>
              </CardContent>
              <CardActions sx={{ display: "flex", justifyContent: "center" }}>
                <Button size="big" onClick={handleBackup} variant="contained">
                  {t("dashboard.createBackup")}
                </Button>
              </CardActions>
              <CardContent ntent></CardContent>
            </Card>
            <Card
              sx={{
                minWidth: 645,

                mt: 10,
                height: 300,
                p: 5,
                width: "60%",
                background: "transparent",
              }}
            >
              <CardContent ntent>
                <Typography
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  gutterBottom
                  variant="h5"
                  component="div"
                  marginTop="30px"
                  marginBottom="20px"
                >
                  {t("dashboard.restoreDB")}
                </Typography>
              </CardContent>
              <CardActions
                sx={{ display: "flex", justifyContent: "space-around" }}
              >
                <Select
                  value={selectedItem}
                  onChange={handleSelect}
                  sx={{
                    height: "40px",
                    borderRadius: "8px",
                  }}
                >
                  {data.map((item, index) => (
                    <MenuItem key={index} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
                <Button size="big" onClick={handleRestore} variant="contained">
                  {t("dashboard.restore")}
                </Button>
              </CardActions>
            </Card>
          </Stack>
        </Stack>
      </Container>
    </Box>
  ) : (
    <></>
  );
}
