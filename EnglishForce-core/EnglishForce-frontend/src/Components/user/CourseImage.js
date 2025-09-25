import React, { useState } from "react";
import { CardMedia } from "@mui/material";

const FALLBACK_IMAGE = "/Errores-Web-404.jpg";

export default function CourseImage({ course }) {
  const [imgSrc, setImgSrc] = useState(course.thumbnail || FALLBACK_IMAGE);

  return (
    <CardMedia
      component="img"
      height="200"
      image={imgSrc}
      alt={course?.name || "Course Image"}
      onError={() => setImgSrc(FALLBACK_IMAGE)}
    />
  );
}
