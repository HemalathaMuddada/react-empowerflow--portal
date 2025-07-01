import React, { useState, useEffect } from 'react';

const placeholderImages = [
  { id: 1, color: '#4CAF50', text: 'Empowering Your Workflow' },
  { id: 2, color: '#2196F3', text: 'Seamless HR Management' },
  { id: 3, color: '#FF9800', text: 'Productivity Unleashed' },
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % placeholderImages.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div style={styles.carouselContainer}>
      <div style={{ ...styles.carouselSlide, backgroundColor: placeholderImages[currentIndex].color }}>
        <h2 style={styles.carouselText}>{placeholderImages[currentIndex].text}</h2>
        <p style={styles.imageNotice}>Placeholder Image {currentIndex + 1}</p>
      </div>
      <div style={styles.dotsContainer}>
        {placeholderImages.map((_, index) => (
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
  },
  carouselSlide: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '300px', // Fixed height for slides
    transition: 'transform 0.5s ease-in-out', // Smooth slide transition
  },
  carouselText: {
    color: 'white',
    fontSize: '1.8em',
    textAlign: 'center',
    padding: '0 20px',
  },
  imageNotice: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '0.9em',
    marginTop: '10px',
  },
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
