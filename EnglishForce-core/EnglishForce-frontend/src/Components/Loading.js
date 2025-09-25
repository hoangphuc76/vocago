import React from "react";
import { Box , CircularProgress } from "@mui/material";
const CircularLoading = () => {
    return <Box sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "80vh"
    }}>
        <CircularProgress size={50} thickness={5}/>
    </Box>
}

export default CircularLoading ;