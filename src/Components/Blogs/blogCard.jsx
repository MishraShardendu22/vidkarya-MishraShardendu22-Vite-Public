import React from 'react';
import { Grid, Card } from '@mui/material';
import './blogs.css';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router';
import { truncateText } from '../../Helpers';

const BlogCard = ({ blog }) => {
  const navigate = useNavigate();
  const capitalizeWords = (str) => {
    return str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <Grid style={{ padding: '15px' }} item lg={4} md={6} sm={12} xs={12}>
      <Card className="blogcard" onClick={() => navigate(`/blogs/${blog._id}`)}>
        <div className="blogcard_img">
          <img src={blog.thumbnailUrl} alt="blog" />
        </div>

        <div className="blogcard_content">
          <div className="blogcard_title">
            {truncateText(blog.title, 8)}
            <MoreVertIcon fontSize="small" />
          </div>

          <div className="blogcard_tags">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <span key={index}>
                {tag.toUpperCase()}
                {index < blog.tags.slice(0, 3).length - 1 && ', '}
              </span>
            ))}
            &nbsp;-&nbsp;
            {Intl.DateTimeFormat('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
              .format(new Date(blog.updatedAt))
              .toUpperCase()}
          </div>

          <div className="blogcard_description">
            {truncateText(blog.description, 12)}
          </div>

          <div className="blog_author">
            🖋 {blog.user ? capitalizeWords(blog.user.name) : 'Anonymous'}
          </div>
        </div>
      </Card>
    </Grid>
  );
};

export default BlogCard;
