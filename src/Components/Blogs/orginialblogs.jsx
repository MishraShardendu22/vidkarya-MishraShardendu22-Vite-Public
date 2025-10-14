import { useEffect, useState, useRef } from 'react';
import { Grid } from '@mui/material';
import './blogs.css';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import { axios, BLOGS } from '../../api';
import { useToasts } from '../../Components/UI/toast';
import BlogCard from './blogCard';
import Pagination from '@mui/material/Pagination';
import { sendReqToServer } from '../../Hooks/useAxios';
import BlogsSkeleton from '../loading-skeletons/blogs-skeleton';

const Orginialblogs = ({ searchString }) => {
  const [notify] = useToasts();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noPages, setNopages] = useState();
  
  // ref to track if initial fetch has happened
  const hasFetchedRef = useRef(false);
  const previousSearchStringRef = useRef(searchString);

  const getBlogsFunc = async (index) => {
    try {
      const { response, error: _error } = await sendReqToServer({
        axiosInstance: axios,
        url: BLOGS.pagenation,
        method: 'POST',
        requestConfig: {
          num: index,
        },
      });
      if (response) return response;
      return null;
    } catch (error) {
      console.error('Error fetching blogs:', error);
      notify({
        type: 'ERROR',
        message: 'Fetching BLOGS failed!',
      });
      return null;
    }
  };

  const handlePagenation = async (event, pageNumber) => {
    setLoading(true);
    const data = await getBlogsFunc(pageNumber);
    if (data && data.body && data.body.currentBlogsPatch) {
      setBlogs(data.body.currentBlogsPatch);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Only fetch if searchString has changed
    if (previousSearchStringRef.current === searchString && hasFetchedRef.current) {
      return;
    }

    previousSearchStringRef.current = searchString;
    hasFetchedRef.current = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        
        //when all blogs have been fetched
        if (searchString === '' || searchString === null || searchString === '#') {
          const data = await getBlogsFunc(1);

          if (data && data.body) {
            setBlogs(data.body.currentBlogsPatch || []);
            console.log('Blogs fetched:', data.body.currentBlogsPatch.length, 'blogs');

            // for counting total page number
            var count = data.body.totalBlogs / 10;
            if (data.body.totalBlogs % 10 > 0) count++;
            setNopages(Math.round(count));
          } else {
            setBlogs([]);
          }
        }
        //when search is done for tag
        else if (searchString[searchString.length - 1] === '#') {
          const _searchString = searchString.slice(0, -1);
          const result = await axios.get(`${BLOGS.searchTag}/${_searchString}`);
          setBlogs(result.data.body.searchResults || []);
        }
        //normal text search
        else {
          const result = await axios.get(`${BLOGS.search}/${searchString}`);
          setBlogs(result.data.body.searchResults || []);
        }
      } catch (error) {
        console.error('Error in fetchData:', error);
        notify({
          type: 'ERROR',
          message: 'Some Blogs could not be fetched !',
        });
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchString]); 

  return loading ? (
    <BlogsSkeleton />
  ) : (
    <>
      <div className="blogPageWrapper">
        <Grid className="blogsGridContainer" container spacing={4}>
          {blogs && blogs.length > 0 ? (
            blogs.map((blog) => {
              return <BlogCard key={blog._id} blog={blog} />;
            })
          ) : (
            <div className="loadingContainer">
              <span className="loadingText">No Blogs found . . .</span>
            </div>
          )}
        </Grid>
        {blogs && blogs.length > 0 && noPages > 1 && (
          <div className="flex justify-center p-1 my-2">
            <Pagination count={noPages} color="primary" onChange={handlePagenation} />
          </div>
        )}
      </div>
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 5,
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default Orginialblogs;