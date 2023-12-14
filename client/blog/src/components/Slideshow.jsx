import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import img1 from '../img/1.png';
import img2 from '../img/2.png';
import img3 from '../img/3.png';


const imageStyle = {
  width: 700,
  height: 400,
  position: 'relative', // Ensure relative positioning for the container
};

const carouselStyle = {
    margin: '0',    // Remove margins
    padding: '0', 
  };

const slideStyle = {
  backgroundColor: 'rgba(0, 0, 0, 1)', // Red background with 50% opacity
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%', // Make the slide take up the full width
};

const contentStyle = {
  position: 'absolute', // Absolute positioning for the content
  top: '50%', // Center vertically
  left: '50%', // Center horizontally
  transform: 'translate(-50%, -50%)', // Center both vertically and horizontally
  zIndex: 1, // Place the content above the image
};

const Slideshow = () => {
  return (
    <Carousel autoPlay={true} interval={2000} showStatus={false} showArrows={true} showThumbs={false} infiniteLoop={true} style={carouselStyle}>
      <div style={slideStyle}>
        <img src={img1} alt="Slide 1" style={imageStyle} />
        <div style={contentStyle}>
        </div>
      </div>
      <div style={slideStyle}>
        <img src={img2} alt="Slide 2" style={imageStyle} />
        <div style={contentStyle}>
        </div>
      </div>
      <div style={slideStyle}>
        <img src={img3} alt="Slide 1" style={imageStyle} />
        <div style={contentStyle}>
        </div>
      </div>
    </Carousel>
  );
};

export default Slideshow;
