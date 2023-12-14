import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const NavigationDropdown = ({ sessionId, alpha, onNavigate }) => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [path, setPath] = useState([]);
  const [directions, setDirections] = useState('');
  const [isNavigated, setIsNavigated] = useState(false); // State to track if navigation button is clicked
  const updateInterval = 1000; // Update interval in milliseconds, you can change this value

  useEffect(() => {
    axios.get(`${API_URL}/get_locations`)
      .then(response => {
        setLocations(response.data);
      })
      .catch(error => console.error('Error fetching locations:', error));

    const interval = setInterval(() => {
      if (isNavigated) {
        // Call the API to get updated path and directions
        axios.post(`${API_URL}/navigate`, {
          session_id: sessionId,
          end: selectedLocation,
          alpha: alpha
        })
        .then(response => {
          const { path, directions } = response.data;
          setPath(path);
          setDirections(directions);
        })
        .catch(error => console.error('Error during navigation:', error));
      }
    }, updateInterval);

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [isNavigated, selectedLocation, alpha]);

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  const handleNavigation = () => {
    if (selectedLocation) {
      setIsNavigated(true); // Set isNavigated to true when navigation button is clicked
      axios.post(`${API_URL}/navigate`, {
        session_id: sessionId,
        end: selectedLocation,
        alpha: alpha
      })
      .then(response => {
        const { path, directions } = response.data;
        setPath(path);
        setDirections(directions);
        onNavigate(path, directions);
      })
      .catch(error => console.error('Error during navigation:', error));
    }
  };


  return (
    <div>
      <select className="dropdown-menu" onChange={handleLocationChange} value={selectedLocation}>
        <option value="">Select a Location</option>
        {locations.map((location, index) => (
          <option key={index} value={location}>{location}</option>
        ))}
      </select>
      <button onClick={handleNavigation}>Navigate</button>
      <div className="path-display">
        <h3>Path:</h3>
        <ul>{path.map((step, index) => <li key={index}>{step}</li>)}</ul>
      </div>
      <div className="directions-display">
        <h3>Directions:</h3>
        <p>{directions}</p>
      </div>
    </div>
  );
};

export default NavigationDropdown;
