import React, { useState, useRef, useEffect} from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { sendReqToServer } from "../../Hooks/useAxios";
import { BLOGS, axios } from "../../api";
import { useToasts } from "../../Components/UI/toast";
import { AppStates } from "../../Context/appContext.jsx";
import { useNavigate } from "react-router-dom";
import './CSS/UploadBlog.css';
import { Editor } from '@tinymce/tinymce-react';
import { uploadImageToCloud } from "../../Helpers";
import { Navbar } from "../../Components";
import DOMPurify from "dompurify";

import InputLabel from "@mui/material/InputLabel";
import { IoClose } from "react-icons/io5";
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from "@mui/material/Backdrop";


const UploadBlog = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [preview, setPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = AppStates();
  const [notify] = useToasts();
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const [content, setContent] = useState("");
  const [_hasStartedTyping, setHasStartedTyping] = useState(false);

  const handleEditorChange = (content, _editor) => {
    setContent(content);
    setHasStartedTyping(true);
  };

  
  const handleRemoveTag = (index) => {
    setTags(tags.filter((tag, i) => i !== index));
  };
  
  useEffect(() => {
    if (!preview && editorRef.current) {
      const editor = editorRef.current;
      if (editor.getContent() !== content) {
        editor.setContent(content);
      }
    }
  }, [preview, content]);


  const formattedTime = new Date().toLocaleString();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !content) {
      notify({
        type: "ERROR",
        message: "Please fill all the fields",
      });
      return;
    }

    try {
      setIsLoading(true);
      const thumbnailUrl = selectedThumbnail ? await uploadImageToCloud(selectedThumbnail, "BlogImages") : null;
      const { response, error } = await sendReqToServer({
        axiosInstance: axios,
        url: BLOGS.create,
        method: "POST",
        requestConfig: {
          data: {
            userId: user?._id,
            title,
            description,
            content,
            tags,
            thumbnailUrl
          }
        }
      })
      if (response?.status === "success") {
        
        navigate("/blogs")
      } else if (error) {
        throw new Error(error);
      }
    } catch (error) {
      console.error(error);
      notify({
        type: "ERROR",
        message: error.message || "An error occurred while uploading the blog",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value.toLowerCase();
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      if (!tags.includes(inputValue.trim())) {
        setTags([...tags, inputValue.trim()]);
      }
      e.target.value = '';
    }
  };

  return (
    <>
      <Navbar />
      <div className="uploadBlogBody">
        <div className="uploadBlogButtons">
          <button 
            className={`previewButton ${preview ? 'previewActive' : ''}`}
            onClick={() => setPreview(!preview)}
          >
            {preview ? <AiFillEyeInvisible /> : <AiFillEye />} Preview
          </button>
        </div>
        <div className="blogEditor">
          <div className="blogEditorColumn1">
            {!preview ? (
              <>
                <div className="titleAndDescription">
                  <input 
                    type="text" 
                    placeholder="Title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    className="title"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    className="description_blog"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="editor">
                  <form className="editorForm" onSubmit={handleSubmit}>
                    <Editor
                        key={preview ? 'preview' : 'edit'}
                      apiKey={import.meta.env.VITE_TINY_MCE_API_KEY}
                      onInit={(evt, editor) => editorRef.current = editor}

                      value={content}
                      init={{
                        height: 500,
                        branding: false,
                        menubar: true,
                            placeholder : 'Start writing your awesome blog here...',
                        plugins: [
                          "advlist", "autolink", "lists", "link", "image", "charmap", "preview",
                          "anchor", "searchreplace", "visualblocks", "code", "fullscreen",
                          "insertdatetime", "media", "table", "code", "help", "wordcount", "codesample"
                        ],
                        toolbar: "undo redo | blocks | bold italic forecolor | alignleft aligncenter " +
                          "alignright alignjustify | bullist numlist outdent indent | " +
                          "removeformat | help | link image media | codesample",
                        content_style: `
                          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&family=Merriweather:wght@300;400;700&display=swap');
                          body { font-family: 'Roboto', sans-serif; font-size: 16px; color: #374151; }
                          h1, h2, h3, h4, h5, h6 { font-family: 'Merriweather', serif; margin-top: 1.5em; margin-bottom: 0.5em; line-height: 1.2; }
                          h1 { font-size: 2.5em; }
                          h2 { font-size: 2em; }
                          h3 { font-size: 1.75em; }
                          h4 { font-size: 1.5em; }
                          h5 { font-size: 1.25em; }
                          h6 { font-size: 1em; }
                        `,
                        codesample_languages: [
                          { text: 'HTML/XML', value: 'markup' },
                          { text: 'JavaScript', value: 'javascript' },
                          { text: 'CSS', value: 'css' },
                          { text: 'PHP', value: 'php' },
                          { text: 'Ruby', value: 'ruby' },
                          { text: 'Python', value: 'python' },
                          { text: 'Java', value: 'java' },
                          { text: 'C', value: 'c' },
                          { text: 'C#', value: 'csharp' },
                          { text: 'C++', value: 'cpp' }
                        ],
                        file_picker_types: 'file image media',
                        file_picker_callback: (callback, _value, _meta) => {
                          const input = document.createElement('input');
                          input.setAttribute('type', 'file');
                          input.setAttribute('accept', 'image/*,video/*,audio/*');

                          input.onchange = async function () {
                            const file = this.files[0];
                            const reader = new FileReader();
                            reader.onload = async function () {
                              const id = 'blobid' + (new Date()).getTime();
                              const blobCache = editorRef.current.editorUpload.blobCache;
                              const base64 = reader.result.split(',')[1];
                              const blobInfo = blobCache.create(id, file, base64);
                              blobCache.add(blobInfo);
                              callback(blobInfo.blobUri(), { title: file.name });
                            };
                            reader.readAsDataURL(file);
                          };

                          input.click();
                        },
                        images_upload_handler: async (blobInfo, success, failure) => {
                          try {
                            const imageUrl = await uploadImageToCloud(blobInfo.blob(), "BlogImages");
                            success(imageUrl);
                          } catch {
                            failure('Image upload failed');
                          }
                        }
                      }}
                      onEditorChange={handleEditorChange}
                    />
                  </form>
                </div>
                <div className="submitButtonWrapper">
                      <button type="submit" className="submitButton">
                        Submit
                      </button>
                    </div>
              </>
            ) : (
              <div className="previewContainer">
                <div className="previewHeader">
                  <div className="previewHeaderDots">
                    <div className="previewHeaderDot red"></div>
                    <div className="previewHeaderDot yellow"></div>
                    <div className="previewHeaderDot green"></div>
                  </div>
                  <div className="previewHeaderTitle">Vidkarya/blog</div>
                </div>
                <div className="previewContent">
                  <h1 className="previewTitle">{title}</h1>
                  <div className="previewMeta">
                    <p className="previewAuthor">Posted by: You</p>
                    <p className="previewTime">{formattedTime}</p>
                  </div>
                  <div className="previewBody" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
                </div>
              </div>
            )}
          </div>
          <div className="blogEditorColumn2">
            <div className="blogDetailsWrapper">
              <h2 className="details">Details</h2>
              <div className="detailsOption">
                <div className="labelsContain">
                  <div className="diplayTags">
                    {tags.map((tag, index) => (
                      <span key={index} className="tag">
                        {tag}
                        <button onClick={() => handleRemoveTag(index)} className="removeTagButton">
                          <IoClose />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div id="labelOptions">
                    <input
                      type="text"
                      placeholder="Type Labels and press Enter to add tags"
                      className="labelOptionInput"
                      onKeyDown={handleInputChange}
                    />
                  </div>
                </div>
                <div className="publishedOn">
                  <p>Published On</p>
                  <p>{formattedTime}</p>
                </div>
                <div className="thumbnailUpload">
                  <InputLabel className="thumbnailLabel">
                    Add Thumbnail
                  </InputLabel>
                  <div className="thumbnailInputWrapper">
                    <input
                      type="file"
                      id="imageUpload"
                      accept="image/*"
                      onChange={(event) => setSelectedThumbnail(event.target.files[0])}
                      className="thumbnailInput"
                    />
                    <label htmlFor="imageUpload" className="thumbnailInputLabel">
                      Choose File
                    </label>
                  </div>
                  {selectedThumbnail && (
                    <div className="thumbnailInfo">
                      <p className="thumbnailName">{selectedThumbnail.name}</p>
                      <div className="thumbnailPreview">
                        <img src={URL.createObjectURL(selectedThumbnail)} alt="Selected" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default UploadBlog;

