import { CardMedia , Card } from "@mui/material";

const CourseVideoPlayer = ({ url }) => {
    if (!url) return null;
    const isYoutube = url.includes("youtube.com") || url.includes("youtu.be");
  
    return (
      <Card sx={{ maxWidth: 800, mx: "auto", mt: 2 }}>
        {isYoutube ? (
          <CardMedia
            component="iframe"
            src={`https://www.youtube.com/embed/${new URL(url).searchParams.get("v")}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            sx={{ width: "100%", height: 400 }}
          />
        ) : (
          <video width="100%" height="400" controls>
            <source src={url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </Card>
    );
  };

  export default CourseVideoPlayer ;