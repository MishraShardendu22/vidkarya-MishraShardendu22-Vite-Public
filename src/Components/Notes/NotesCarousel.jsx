import React, { useState, useEffect } from 'react';
import { IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from './../../lib/icons';
import { NOTES_ASSET } from '../../Assets/assetImages';
import './notes.css';

const NotesCarousel = ({ data }) => {
  const [slide, setSlide] = useState(0);
  const DELAY = 5000; 

  useEffect(() => {
    const timer = setTimeout(
      () => setSlide((prevIndex) => (prevIndex === data.length - 1 ? 0 : prevIndex + 1)),
      DELAY
    );

    return () => clearTimeout(timer);
  }, [slide, data.length]);

  const nextSlide = () => {
    setSlide((prevIndex) => (prevIndex === data.length - 1 ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setSlide((prevIndex) => (prevIndex === 0 ? data.length - 1 : prevIndex - 1));
  };

  const goToSlide = (index) => {
    setSlide(index);
  };

  return (
    <div className="notes-carousel-section">
      <button
        onClick={prevSlide}
        className="arrow arrow-left"
        aria-label="Previous slide"
      >
        <IoIosArrowDropleftCircle />
      </button>

      <div className="notes-carousel">
        <div
          className="carousel-slideshowSlider"
          style={{ transform: `translate3d(${-slide * 100}%, 0, 0)` }}
        >
          {data.map((item, idx) => (
            <div className="carousel" key={idx}>
              <div className="notes-carousel-data">
                <div className="notes-carousel-text-data">
                  <h2 className="notes-carasole-heading">{item.heading}</h2>
                  <p className="notes-carasole-paragraph">{item.para}</p>
                </div>
                <div className="carousel-img">
                  <img src={NOTES_ASSET.carousel} alt={item.alt} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="indicators">
          {data.map((_, idx) => (
            <button
              key={idx}
              className={`indicator ${slide === idx ? 'active' : ''}`}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              aria-current={slide === idx ? 'true' : 'false'}
            />
          ))}
        </div>
      </div>

      <button
        onClick={nextSlide}
        className="arrow arrow-right"
        aria-label="Next slide"
      >
        <IoIosArrowDroprightCircle />
      </button>
    </div>
  );
};

export default NotesCarousel;