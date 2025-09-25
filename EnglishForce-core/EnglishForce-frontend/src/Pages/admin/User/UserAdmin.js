import {
    Table, TableBody, TableCell, TableContainer, Button,
    TableHead, TableRow, Paper, Container, Pagination
} from '@mui/material';
import { useState, useEffect } from 'react';
import axiosInstance from '../../../Api/axiosInstance';
import GradientTitle from '../../../Components/GradientTitle';
import CircularLoading from '../../../Components/Loading';

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 6;

    const fetchUsers = async (page) => {
        try {
            setLoading(true);
            const res = await axiosInstance.get(`/users?page=${page}&limit=${limit}`);
            setUsers(res.data.users);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(page);
    }, [page]);

    const handleEdit = async (user) => {
        const response = await axiosInstance.patch(`/users/${user.public_id}`, {
            role: user.role
        });
        setUsers(prevUsers => prevUsers.map(u => u.public_id === user.public_id ? response.data : u));
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    if (loading) return <CircularLoading />;

    return (
        <Container sx={{ mt: 4 }}>
            <GradientTitle align='left'>Users Management</GradientTitle>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user, index) => (
                            <TableRow key={user.id}>
                                <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleEdit(user)} color="primary">Change role</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
                color="primary"
            />
        </Container>
    );
};

export default UserTable;
