import React from "react";
import CourseImage from "./CourseImage";
import {
  CardContent,
  Typography,
  Button,
  Card,
  Rating,
  Box,
  CardActionArea,
  Chip,
  Tooltip,
} from "@mui/material";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  return (
    <Card
      elevation={6}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 4,
        background: "#ffffff",
        overflow: "hidden",
        position: "relative",
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "translateY(-6px) scale(1.01)",
          boxShadow: "0 15px 40px rgba(25, 118, 210, 0.15)",
        },
      }}
    >
      <CardActionArea
        component={Link}
        to={`/courses/overview/${course.public_id}`}
        sx={{ height: "100%", display: "flex", flexDirection: "column" }}
      >
        {/* Image */}
        <Box sx={{ width: "100%", height: 180, position: "relative" }}>
          <CourseImage course={course} />
          {course.is_purchased && (
            <Chip
              label="Purchased"
              color="success"
              size="small"
              sx={{
                position: "absolute",
                top: 12,
                right: 12,
                fontWeight: 600,
              }}
            />
          )}
        </Box>

        <CardContent
          sx={{
            flexGrow: 1,
            width: "100%",
            px: 2,
            py: 2.5,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Title */}
          <Tooltip title={course.name} arrow>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                mb: 0.5,
              }}
            >
              {course.name}
            </Typography>
          </Tooltip>

          {/* Instructor */}
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{ mb: 1 }}
          >
            by {course.instructor}
          </Typography>

          {/* Description */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              flexGrow: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              mb: 2,
            }}
          >
            {course.description}
          </Typography>

          {/* Rating & Price */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              mt: "auto",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Rating
                name="course-rating"
                value={course.average_rating || 0}
                precision={0.5}
                size="small"
                readOnly
              />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ ml: 0.5 }}
              >
                ({course.total_rating || 0})
              </Typography>
            </Box>
            <Typography
              variant="h6"
              fontWeight={700}
              color={course.price ? "primary" : "success.main"}
            >
              {course.price ? `$${course.price}` : "Free"}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CourseCard;
