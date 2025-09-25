import { Button , Stack } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';

let baseURL = "";
if (process.env.REACT_APP_BACKEND_URL == '/api') {
  baseURL = process.env.REACT_APP_BACKEND_URL;
} else {
  baseURL = process.env.REACT_APP_BACKEND_URL + '/api';
}

const GoogleLoginButton = () => {
  const handleLogin = () => {
    // Redirect user đến backend để login
    window.location.href = baseURL + '/auth_google/google';
    // window.location.href = 'http://localhost:5000/api/auth/google';

    console.log("Backend URL:", baseURL);
  };

  return (
    <Button
      variant="contained"
      startIcon={<GoogleIcon />}
      onClick={handleLogin}
            fullWidth
      sx={{
        minWidth: 200,
        fontWeight: 500,
        paddingY: 1.2,
        boxShadow: 2,
      }}
    >
      Continue with Google
    </Button>
  );
};

// const FacebookLoginButton = () => {
//   const handleLogin = () => {
//     // Redirect user đến backend để login
//     window.location.href = process.env.REACT_APP_BACKEND_URL+'/api/auth_facebook/facebook';
//     // window.location.href = 'http://localhost:5000/api/auth/google';
//   };

//   return (
//     <Button
//       variant="contained"
//       startIcon={<FacebookIcon />}
//       onClick={handleLogin}
//     >
//       Facebook
//     </Button>
//   );
// };


const OAuthLoginButtons = () => {


  return (
    <Stack direction="row" spacing={3} justifyContent="center">
      <GoogleLoginButton />
      {/* <FacebookLoginButton /> */}
    </Stack>
  );
};

export default OAuthLoginButtons;
