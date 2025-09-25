import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, List, Button, IconButton, Drawer, Tooltip, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import FlagIcon from '@mui/icons-material/Flag';
import { green, grey, orange } from '@mui/material/colors';


const ExamMenu = ({ parts, answers, duration, onSubmit }) => {
  const [open, setOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [start, setStart] = useState(null);
  const [flaggedQuestions, setFlaggedQuestions] = useState({});
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const intervalRef = useRef(null); // 🆕 ref lưu interval

  // Load flagged questions from localStorage on component mount
  useEffect(() => {
    const savedFlaggedQuestions = localStorage.getItem('flaggedQuestions');
    if (savedFlaggedQuestions) {
      try {
        setFlaggedQuestions(JSON.parse(savedFlaggedQuestions));
      } catch (e) {
        console.error('Failed to parse flagged questions from localStorage', e);
      }
    }
  }, []);

  // Save flagged questions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('flaggedQuestions', JSON.stringify(flaggedQuestions));
  }, [flaggedQuestions]);

  useEffect(() => {
    if (duration) {
      const startTime = new Date(); // Luôn tạo mới
      setStart(startTime);

      const endTime = new Date(startTime.getTime() + duration * 60000);

      const updateRemainingTime = () => {
        const now = new Date();
        const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
        setTimeLeft(remaining);

        if (remaining === 0) {
          clearInterval(intervalRef.current); // ❗ Stop timer khi hết giờ
          onSubmit(startTime?.toISOString(), new Date().toISOString());
        }
      };

      updateRemainingTime();
      intervalRef.current = setInterval(updateRemainingTime, 1000);
      // const interval = setInterval(updateRemainingTime, 1000);
      return () => clearInterval(intervalRef.current);
    }
  }, [duration]);


  const toggleDrawer = (state) => () => {
    setOpen(state);
  };

  const handleNavigateToQuestion = (questionId) => {
    const element = document.getElementById(`${questionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const formatTimeLeft = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleManualSubmit = () => {
    const now = new Date();
    clearInterval(intervalRef.current); // ❗ Stop timer khi submit
    onSubmit(start?.toISOString(), now.toISOString());
  };

  const toggleFlagQuestion = (questionId) => {
    setFlaggedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const handleContextMenu = (event, questionId) => {
    event.preventDefault();
    setSelectedQuestionId(questionId);
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
          }
        : null,
    );
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };


  // 🧠 Global index counter
  let globalQuestionIndex = 1;

  const renderPartsAndQuestions = (parts) => {
    return parts.map((part) => (
      <Box key={part.public_id} sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}>
          📚 {part.name}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {part.Questions?.map((question) => {
            const isAnswered = answers[question.public_id] !== undefined;
            const isFlagged = flaggedQuestions[question.public_id];
            const questionNumber = globalQuestionIndex++; // Tăng liên tục không reset

            return (
              <Tooltip key={question.public_id} title={`Question ${questionNumber}${isFlagged ? ' (Flagged)' : ''}`} arrow>
                <Box
                  onClick={(e) => {
                    if (e.ctrlKey || e.metaKey) {
                      // Ctrl+Click or Cmd+Click to toggle flag
                      toggleFlagQuestion(question.public_id);
                    } else {
                      handleNavigateToQuestion(question.public_id);
                      setOpen(false);
                    }
                  }}
                  onContextMenu={(e) => handleContextMenu(e, question.public_id)}
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    bgcolor: isFlagged ? orange[700] : (isAnswered ? green[700] : grey[300]),
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    caretColor: "transparent",
                    position: 'relative',
                    '&:hover': {
                      bgcolor: isFlagged ? orange[900] : (isAnswered ? green[900] : grey[400]),
                    }
                  }}
                >
                  {questionNumber}
                  {isFlagged && (
                    <FlagIcon 
                      sx={{ 
                        position: 'absolute', 
                        top: -8, 
                        right: -8, 
                        fontSize: 16,
                        color: orange[700],
                        bgcolor: 'white',
                        borderRadius: '50%',
                        padding: '1px'
                      }} 
                    />
                  )}
                </Box>
              </Tooltip>
            );
          })}
        </Box>

        {part.Children?.length > 0 && (
          <Box sx={{ pl: 2 }}>
            {renderPartsAndQuestions(part.Children)}
          </Box>
        )}
      </Box>
    ));
  };

  return (
    <>
      {!open && (
        <Box
          sx={{
            position: 'fixed',
            top: 64,
            right: 20,
            zIndex: 1300,
            bgcolor: '#ffffffcc',
            borderRadius: '32px',
            boxShadow: 3,
            px: 2,
            py: 1,
            display: 'flex',
            alignItems: 'center',
            backdropFilter: 'blur(6px)',
            caretColor: "transparent",
          }}
        >
          <IconButton onClick={toggleDrawer(true)}>
            <MenuIcon fontSize="large" />
          </IconButton>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, ml: 1 }}>
            {formatTimeLeft(timeLeft)}
          </Typography>
        </Box>
      )}

      <Menu
        open={contextMenu !== null}
        onClose={handleCloseContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem 
          onClick={() => {
            toggleFlagQuestion(selectedQuestionId);
            handleCloseContextMenu();
          }}
        >
          <FlagIcon sx={{ mr: 1 }} />
          {flaggedQuestions[selectedQuestionId] ? 'Unflag Question' : 'Flag as Difficult'}
        </MenuItem>
      </Menu>


      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)} PaperProps={{ sx: { zIndex: 10001, } }}
        ModalProps={{
          keepMounted: true,
          BackdropProps: {
            sx: {
              zIndex: 10001 // Quan trọng: backdrop nằm sau Paper
            }
          }
        }}>
        <Box
          sx={{
            width: 300,
            height: '100vh',
            bgcolor: grey[100],
            display: 'flex',
            flexDirection: 'column',
            p: 2,
            zIndex: 10001,
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>⏳ Time Remaining</Typography>
            <Typography
              variant="h3"
              color={timeLeft <= 60 ? 'error.main' : 'primary.main'}
              fontWeight={800}
              mb={2}
            >
              {formatTimeLeft(timeLeft)}
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
            <Typography variant="h6" fontWeight={700} mb={1}>
              📝 Questions
            </Typography>
            {flaggedQuestions && Object.keys(flaggedQuestions).length > 0 && (
              <Typography variant="body2" sx={{ mb: 1, color: orange[700] }}>
                <FlagIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                {Object.keys(flaggedQuestions).filter(id => flaggedQuestions[id]).length} flagged questions
              </Typography>
            )}
            {renderPartsAndQuestions(parts)}
          </Box>

          <Button
            variant="contained"
            color="error"
            size="large"
            fullWidth
            onClick={handleManualSubmit}
            sx={{ mt: 3, fontWeight: 700 }}
          >
            ✔ Submit Exam
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

export default ExamMenu;
