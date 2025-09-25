import { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { Box, Typography, Grid, Paper } from "@mui/material";
import axiosInstance from "../../Api/axiosInstance";
import CircularLoading from "../Loading";
import GradientTitle from "../GradientTitle";

const RevenueChart = () => {
    const [dataPayment, setDataPayment] = useState([]);
    const [dataCustomer, setDataCustomer] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axiosInstance.get("/payments/stats");
                setDataPayment(response.data.revenueByDay.reverse());
                setDataCustomer(response.data.customersByDay.reverse());
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch revenue data:", error);
                setError("Failed to load data");
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) return <CircularLoading />;
    if (error) return null;

    return (
        <Box sx={{ mt: 4 }}>
            <GradientTitle align='left'>Stripe Revenue Overview</GradientTitle>

            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={6} sx={{ p: 3, borderRadius: 3, background: "#f0f4ff" }}>
                        <Typography
                            variant="h6"
                            sx={{
                                mb: 2,
                                fontWeight: 600,
                                textAlign: "center",
                                color: "#1a237e"
                            }}
                        >
                            📈 Daily Revenue
                        </Typography>
                        <LineChart
                            xAxis={[{ data: dataPayment.map(item => item.date), scaleType: "band" }]}
                            series={[{ data: dataPayment.map(item => item.revenue), label: "Revenue ($)", color: "#1e88e5" }]}
                            width={500}
                            height={300}
                        />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper elevation={6} sx={{ p: 3, borderRadius: 3, background: "#fdf5ff" }}>
                        <Typography
                            variant="h6"
                            sx={{
                                mb: 2,
                                fontWeight: 600,
                                textAlign: "center",
                                color: "#4a148c"
                            }}
                        >
                            📅 Daily New Customers
                        </Typography>
                        <LineChart
                            xAxis={[{ data: dataCustomer.map(item => item.date), scaleType: "band" }]}
                            series={[{ data: dataCustomer.map(item => item.count), label: "New Customers", color: "#ab47bc" }]}
                            width={500}
                            height={300}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default RevenueChart;
