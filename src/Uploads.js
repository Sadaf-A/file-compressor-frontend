import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Link,
  Paper,
  Box,
  Button
} from '@mui/material';
import './Uploads.css';

function Uploads() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get('https://file-compressor-backend.el.r.appspot.com/api/uploads', {
          params: { username: localStorage.getItem('username') }
        });
        setFiles(response.data);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
  }, []);

  const handleDecompress = async (fileKey) => {
    setLoading(true);
    try {
      const response = await axios.post('https://file-compressor-backend.el.r.appspot.com/api/decompress', {
        fileKey,
        username: localStorage.getItem('username'),
      });
      alert(`Decompressed file: ${response.data.decompressedFileName}`);
    } catch (error) {
      console.error('Error decompressing file:', error);
      alert('Failed to decompress the file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, backgroundColor: '#2c2c2c', color: '#fff', maxHeight: '60vh', overflowY: 'auto' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Uploaded Files
        </Typography>
        <List>
          {files.map((file) => (
            <ListItem key={file.key} sx={{ borderBottom: '1px solid #555' }}>
              <ListItemText
                primary={
                  <Link href={file.url} target="_blank" rel="noopener" color="inherit">
                    {file.key.split('/')[1]}
                  </Link>
                }
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="lightgray">
                      Last Modified: {new Date(file.lastModified).toLocaleString()}
                    </Typography>
                    <br />
                    <Typography component="span" variant="body2" color="lightgray">
                      Size: {(file.size / 1024).toFixed(2)} KB
                    </Typography>
                  </>
                }
              />
              <Box sx={{ ml: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => handleDecompress(file.key)}
                  disabled={loading}
                >
                  Decompress
                </Button>
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}

export default Uploads;
