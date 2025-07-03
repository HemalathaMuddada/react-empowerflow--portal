import React, { useState, useEffect } from 'react';

const carouselItems = [
  {
    id: 1,
    src: 'https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg',
    alt: 'Team collaborating in a modern office',
    caption: 'Drive Collaboration & Engagement'
  },
  {
    id: 2,
    src: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg',
    alt: 'Diverse team joining hands in unity',
    caption: 'Achieve Success Together'
  },
  {
    id: 3,
    src: 'https://images.pexels.com/photos/6476587/pexels-photo-6476587.jpeg',
    alt: 'Desktop computer showing business analytics',
    caption: 'Insightful HR Analytics at Your Fingertips'
  },
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div style={styles.carouselContainer}>
      <div style={styles.carouselSlide}>
        <img
          src={carouselItems[currentIndex].src}
          alt={carouselItems[currentIndex].alt}
          style={styles.carouselImage}
        />
        <div style={styles.captionOverlay}>
          <h2 style={styles.carouselText}>{carouselItems[currentIndex].caption}</h2>
        </div>
      </div>
      <div style={styles.dotsContainer}>
        {carouselItems.map((_, index) => (
          <span
            key={index}
            style={{
              ...styles.dot,
              backgroundColor: currentIndex === index ? '#333' : '#bbb',
            }}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

const styles = {
  carouselContainer: {
    width: '100%',
    maxWidth: '600px', // Max width of carousel
    margin: '20px auto',
    overflow: 'hidden',
    position: 'relative',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    position: 'relative', // For absolute positioning of caption overlay
  },
  carouselSlide: {
    width: '100%',
    height: '300px', // Fixed height for slides
    overflow: 'hidden', // Ensure image does not overflow its container
    position: 'relative', // For caption overlay
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover', // Cover the area, cropping if necessary
    display: 'block', // Remove extra space below image
  },
  captionOverlay: {
    position: 'absolute',
    bottom: '0',
    left: '0',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent black background
    padding: '15px',
    boxSizing: 'border-box',
  },
  carouselText: { // Style for the caption text
    color: 'white',
    fontSize: '1.5em', // Adjusted size for overlay
    textAlign: 'center',
    margin: '0', // Remove default margin
    padding: '0',
  },
  // imageNotice style is no longer needed as direct image notice is removed
  // imageNotice: {
  //   color: 'rgba(255, 255, 255, 0.8)',
  //   fontSize: '0.9em',
  //   marginTop: '10px',
  // },
  dotsContainer: {
    textAlign: 'center',
    padding: '10px 0',
  },
  dot: {
    height: '10px',
    width: '10px',
    margin: '0 5px',
    borderRadius: '50%',
    display: 'inline-block',
    cursor: 'pointer',
  },
};

export default Carousel;
