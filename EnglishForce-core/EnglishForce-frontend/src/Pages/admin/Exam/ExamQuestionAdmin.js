// Trang này chứa tất cả questions của 1 Exam Part

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Container,
    Typography,
    Paper,
    TextField,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
    Snackbar,
    Alert,
} from "@mui/material";
import { Delete, Edit, Visibility } from "@mui/icons-material";
import axiosInstance from "../../../Api/axiosInstance";

const questionTypes = [
    { value: "single_choice", label: "Single Choice" },
    { value: "multiple_choice", label: "Multiple Choice" },
    { value: "listening", label: "Listening" },
    { value: "reading", label: "Reading" },
    { value: "writing", label: "Writing" },
    { value: "speaking", label: "Speaking" },
];

const AdminExamQuestions = () => {
    const { publicId , partPublicId } = useParams(); // exam publicId
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [content, setContent] = useState("");
    const [type, setType] = useState("single_choice");
    const [thumbnail, setThumbnail] = useState("");
    const [record, setRecord] = useState("");
    const [orderIndex, setOrderIndex] = useState(0);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const fetchQuestions = async () => {
        try {
            const res = await axiosInstance.get(`/questions/exam-parts/${partPublicId}`);
            setQuestions(res.data);
        } catch (error) {
            console.error("Failed to fetch questions", error);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    const handleAdd = async () => {
        try {
            const res = await axiosInstance.post("/questions", {
                exam_public_id: publicId,
                exam_part_public_id: partPublicId,
                content,
                type,
                thumbnail,
                record,
                order_index: orderIndex,
            });
            setQuestions([...questions, res.data]);
            setSnackbar({ open: true, message: "Question added!", severity: "success" });
            setContent("");
            setType("single_choice");
            setThumbnail("");
            setRecord("");
        } catch (error) {
            console.error("Failed to add question", error);
            setSnackbar({ open: true, message: "Failed to add", severity: "error" });
        }
    };

    const handleDelete = async (questionPublicId) => {
        try {
            await axiosInstance.delete(`/questions/${questionPublicId}`);
            setQuestions(questions.filter((q) => q.public_id !== questionPublicId));
            setSnackbar({ open: true, message: "Deleted", severity: "success" });
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>Manage Exam Questions</Typography>
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6">Add New Question</Typography>
                <TextField
                    fullWidth
                    label="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    margin="normal"
                    required
                />
                <TextField
                    select
                    label="Type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    fullWidth
                    margin="normal"
                >
                    {questionTypes.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    fullWidth
                    label="Order Index"
                    value={orderIndex}
                    onChange={(e) => setOrderIndex(Number(e.target.value))}
                    margin="normal"
                    type="number"
                />
                <TextField
                    fullWidth
                    label="Thumbnail URL"
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Audio URL (Record)"
                    value={record}
                    onChange={(e) => setRecord(e.target.value)}
                    margin="normal"
                />
                <Button variant="contained" onClick={handleAdd} sx={{ mt: 2 }}>
                    Add Question
                </Button>
            </Paper>

            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Content</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Thumbnail</TableCell>
                            <TableCell>Audio</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {questions.map((q, i) => (
                            <TableRow key={q.public_id}>
                                <TableCell>{i + 1}</TableCell>
                                <TableCell>{q.content}</TableCell>
                                <TableCell>{q.type}</TableCell>
                                <TableCell>
                                    {q.thumbnail ? <a href={q.thumbnail} target="_blank">Image</a> : "-"}
                                </TableCell>
                                <TableCell>
                                    {q.record ? <a href={q.record} target="_blank">Audio</a> : "-"}
                                </TableCell>
                                <TableCell>
                                    <IconButton color="info" onClick={() => navigate(`/admin/exams/questions/${q.public_id}/answer`, { state: { questionType: q.type } })}>
                                        <Visibility />
                                    </IconButton>
                                    <IconButton color="primary" onClick={() => navigate(`/admin/exams/questions/${q.public_id}/edit`)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(q.public_id)}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={2500}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
            </Snackbar>
        </Container>
    );
};

export default AdminExamQuestions;
