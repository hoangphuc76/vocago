import React, { useEffect, useState } from "react";
import axiosInstance from "../../../Api/axiosInstance";
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination } from "@mui/material";
import CircularLoading from '../../../Components/Loading';
import GradientTitle from "../../../Components/GradientTitle";

const CommentAdmin = () => {
    const [comments, setComments] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    async function Fetch() {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/comments`, {
                params: { page } // pass the page number as a query param
            });

            setComments(response.data.comments);
            setTotalPages(response.data.totalPages);

            if (response.data.comments.length == 0 && page > 1) setPage(page - 1);
        } catch (error) {
            console.error("Error fetching comments:", error);
        } finally {
            setLoading(false);
        }
        
    }
    useEffect(() => {
        Fetch();
    }, [page]);

    const handleDelete = async (commentId) => {
        try {
            await axiosInstance.delete(`/comments/${commentId}`);
            Fetch();
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    if (loading) return <CircularLoading />;

    return (
        <Container sx={{ mt: 4 }}>
            <GradientTitle align='left'>Comments Management</GradientTitle>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Course</TableCell>
                            <TableCell>User Name</TableCell>
                            <TableCell>Content</TableCell>
                            <TableCell>Create at</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {comments.map((comment,index) => (
                            <TableRow key={comment.id}>
                                <TableCell>{(page - 1) * 6 + index + 1}</TableCell>
                                <TableCell>{comment.Course.name}</TableCell>
                                <TableCell>{comment.User.username}</TableCell>
                                <TableCell>{comment.content}</TableCell>
                                <TableCell>{new Date(comment.created_at).toLocaleString()}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleDelete(comment.id)} color="error">Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {comments.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center">No comments found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {comments.length != 0 && <Pagination
                count={totalPages}
                page={page}
                onChange={(event, value) => setPage(value)} // Update page state on page change
                color="primary"
                sx={{ display: "flex", justifyContent: "center", mt: 4 }}
            />}
        </Container>
    );
};

export default CommentAdmin;
