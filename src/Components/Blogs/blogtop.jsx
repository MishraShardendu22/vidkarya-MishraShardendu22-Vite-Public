import { useNavigate } from "react-router-dom";
import { Button, Grid } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
// import BlogImg from "../../Assets/Images/Blogs/blog.gif"; check krna pdega ye page
import { BLOG_ASSET } from "../../Assets/assetImages";
import "./blogs.css";
import { AppStates } from "../../Context/appContext.jsx";

const Blogtop = () => {
  const { user, setShowLoginPopup } = AppStates();
  const navigate = useNavigate();

  function handleCreateBlogBtn() {
    if (!user) {
      setShowLoginPopup(true);
      return;
    }
    navigate("/blogs/create");
  }

  return (
    <Grid container spacing={2}>
      <Grid item lg={7} md={12} xs={12}>
        <div className="topContent">
          <p className="heading">An Unparalleled Blog Reading Experience</p>
          <p className="description">
            Dive into a world of insightful and engaging content with our
            diverse collection of blogs, spanning a variety of domains and
            carefully curated to ensure the highest quality. Whether you're here
            to explore new ideas or share your own, our platform empowers you to
            contribute your unique perspectives and connect with our institute's
            vibrant community. Discover, contribute, and enjoy a blogging
            journey like no other!
          </p>
          <Grid className="blogs_buttons" container spacing={2}>
            <Grid item>
              <Button
                className="blogs_btn1"
                href="/blogs#display_blogs"
                variant="outlined"
                size="large"
                // endIcon={<ArrowForwardIcon />}
              >
                <span style={{ textTransform: "none" }}>
                  Start Reading <ArrowForwardIcon />
                </span>
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={handleCreateBlogBtn}
                className="blogs_btn1"
                href=""
                size="large"
              >
                <span style={{ textTransform: "none" }}>Create blog</span>
              </Button>
            </Grid>
          </Grid>
        </div>
      </Grid>

      <Grid item lg={4} md={9} xs={10}>
        <div className="blog_image">
          <img
            className="blog_img"
            src={BLOG_ASSET.whiteBlank}
            alt="Blog_image"
          />
        </div>
      </Grid>
    </Grid>
  );
};

export default Blogtop;
