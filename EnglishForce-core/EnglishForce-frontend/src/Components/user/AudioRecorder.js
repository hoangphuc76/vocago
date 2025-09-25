import React, { useState, useRef } from 'react';
import { Box, Button, Typography, LinearProgress, CircularProgress } from '@mui/material';
import { Mic, Stop, PlayArrow, Pause, Upload } from '@mui/icons-material';
import { uploadToCloudinary } from '../../Api/cloudinary';

const AudioRecorder = ({ onRecordingComplete }) => {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);
  const streamRef = useRef(null);
  const progressIntervalRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const audioChunks = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
        setAudioBlob(audioBlob);
        onRecordingComplete(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const playRecording = () => {
    if (audioUrl && !playing) {
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onplay = () => setPlaying(true);
      audio.onpause = () => setPlaying(false);
      audio.onended = () => {
        setPlaying(false);
        setProgress(0);
      };
      
      // Update progress
      progressIntervalRef.current = setInterval(() => {
        if (audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      }, 100);
      
      audio.play();
    }
  };

  const pauseRecording = () => {
    if (audioRef.current && playing) {
      audioRef.current.pause();
      setPlaying(false);
      clearInterval(progressIntervalRef.current);
    }
  };

  const resetRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    clearInterval(progressIntervalRef.current);
    setAudioUrl(null);
    setAudioBlob(null);
    setPlaying(false);
    setProgress(0);
    onRecordingComplete(null);
  };

  const uploadAudio = async () => {
    if (!audioBlob) return;
    
    setUploading(true);
    try {
      // Create a File object from the blob
      const audioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });
      
      // Upload directly to Cloudinary using the existing function
      const url = await uploadToCloudinary(audioFile, 'audio_recordings');
      
      // Return the URL of the uploaded file
      onRecordingComplete(audioBlob, url);
    } catch (error) {
      console.error('Error uploading audio:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      {!audioUrl ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {!recording ? (
            <Button
              variant="contained"
              color="primary"
              startIcon={<Mic />}
              onClick={startRecording}
            >
              Start Recording
            </Button>
          ) : (
            <Button
              variant="contained"
              color="error"
              startIcon={<Stop />}
              onClick={stopRecording}
            >
              Stop Recording
            </Button>
          )}
        </Box>
      ) : (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            {!playing ? (
              <Button
                variant="contained"
                color="primary"
                startIcon={<PlayArrow />}
                onClick={playRecording}
              >
                Play
              </Button>
            ) : (
              <Button
                variant="contained"
                color="secondary"
                startIcon={<Pause />}
                onClick={pauseRecording}
              >
                Pause
              </Button>
            )}
            <Button
              variant="outlined"
              color="error"
              onClick={resetRecording}
            >
              Record Again
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={uploading ? <CircularProgress size={20} /> : <Upload />}
              onClick={uploadAudio}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </Box>
          
          <Box sx={{ width: '100%', mb: 1 }}>
            <LinearProgress variant="determinate" value={progress} />
          </Box>
          <Typography variant="caption" display="block" align="center">
            {playing ? 'Playing...' : 'Ready to play'}
          </Typography>
        </Box>
      )}
      
      {recording && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="error">
            Recording in progress...
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default AudioRecorder;