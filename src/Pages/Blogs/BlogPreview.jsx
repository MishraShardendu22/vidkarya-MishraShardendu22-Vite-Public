import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { BLOGS, axios } from '../../api';
import { sendReqToServer } from '../../Hooks/useAxios';
import { useToasts } from '../../Components/UI/toast';
import { Navbar } from '../../Components';
import styles from './CSS/blogPreview.module.css';
import { convertToDate } from '../../Helpers';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Button, Grid } from '@mui/material';

function BlogPreview() {
  const { blogid } = useParams();
  const [notify] = useToasts();
  const [blog, setBlog] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [imgurl, setImgurl] = useState();

  const fetchBlog = useCallback(async () => {
    try {
      setIsLoading(true);
      const { response } = await sendReqToServer({
        axiosInstance: axios,
        url: BLOGS.get.replace(':blogid', blogid),
        method: 'GET',
      });
      console.log("Fetched Response:", response);

      if (response) {
        setBlog(response?.body?.blog);
        setImgurl(response?.body?.blog.thumbnailUrl);
      }
      setIsLoading(false);
    } catch {
      
      notify({
        type: 'ERROR',
        message: 'Failed to fetch this blog',
      });
      setIsLoading(false);
    }
  }, [blogid, notify]);

  useEffect(() => {
    fetchBlog();
  }, [blogid]);
  return (
    <>
      <Navbar />
      {!isLoading && (
        <div className={styles.wrapper}>
          <div className={styles.blogTop}>
            <div className={styles.blogBimg} style={{ backgroundImage: `url(${imgurl})` }}></div>
            <div className={styles.blogHead}>
              <span className={styles.blogTitle}>{blog?.title}</span>
              <div className={styles.blogDetails}>
                <span className={styles.blogDesc}>
                  {' '}
                  Posted on: {convertToDate(blog?.createdAt)}
                </span>
                <span className={styles.blogDesc}>
                  {' '}
                  Author: {blog?.user ? blog.user.name : 'Anonymous'}
                </span>
              </div>
              <div>
                <Grid className={styles.blogTags} container spacing={2}>
                  {blog?.tags?.map((tag, index) => (
                    <Grid item key={index}>
                      <Button className={styles.blogTag} key={index}>
                        {tag}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </div>
            </div>
          </div>
          <div className={styles.blogContent} dangerouslySetInnerHTML={{ __html: blog?.content }} />
        </div>
      )}

      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}

export default BlogPreview;
