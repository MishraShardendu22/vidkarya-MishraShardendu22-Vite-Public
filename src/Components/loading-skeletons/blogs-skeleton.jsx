import React from 'react';
import './loading-skeleton.css';
import { Grid } from '@mui/material';

export default function BlogsSkeleton() {
  return (
    <Grid
      container
      rowSpacing={5}
      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      justifyContent="center"
      alignItems="center"
    >
      <Grid item xs={4} style={{ display: 'flex', justifyContent: 'center' }}>
        <BlogsSkeletonBox />
      </Grid>
      <Grid item xs={4} style={{ display: 'flex', justifyContent: 'center' }}>
        <BlogsSkeletonBox />
      </Grid>
      <Grid item xs={4} style={{ display: 'flex', justifyContent: 'center' }}>
        <BlogsSkeletonBox />
      </Grid>
      <Grid item xs={4} style={{ display: 'flex', justifyContent: 'center' }}>
        <BlogsSkeletonBox />
      </Grid>
      <Grid item xs={4} style={{ display: 'flex', justifyContent: 'center' }}>
        <BlogsSkeletonBox />
      </Grid>
      <Grid item xs={4} style={{ display: 'flex', justifyContent: 'center' }}>
        <BlogsSkeletonBox />
      </Grid>
    </Grid>
  );
}

const BlogsSkeletonBox = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-img"></div>
      <div className="skeleton skeleton-line w-60"></div>
      <div className="skeleton skeleton-line w-50"></div>
      <div className="skeleton skeleton-line w-40"></div>
      <div className="skeleton skeleton-line w-30 align-right"></div>
    </div>
  );
};
