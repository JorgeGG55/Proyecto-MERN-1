import React, { useState, useEffect } from 'react';

const NASA_URL = 'https://api.nasa.gov/';
const NASA_API_KEY = 'DB3uc3xzM04PjlUntJy7yt9mLq3jkaGeZf8hXdmf';

const App = () => {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedApi, setSelectedApi] = useState('apod');
  const [apodData, setApodData] = useState(null);
  const [roverData, setRoverData] = useState(null);

  const handleInput = (ev) => {
    setDate(ev.target.value);
  };

  const handleSelectChange = (ev) => {
    setSelectedApi(ev.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (selectedApi === 'apod') {
          response = await fetch(`${NASA_URL}planetary/apod?date=${date}&api_key=${NASA_API_KEY}`);
          const data = await response.json();
          setApodData(data);
          setRoverData(null);
        } else if (selectedApi === 'rovers') {
          response = await fetch(
            `${NASA_URL}mars-photos/api/v1/rovers/curiosity/photos?earth_date=${date}&api_key=${NASA_API_KEY}`
          );
          const data = await response.json();
          setRoverData(data);
          setApodData(null);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [date, selectedApi]);

  return (
    <div>
      <h1>Imagen astronómica del día</h1>
      <label>
        Seleccione la API:
        <select value={selectedApi} onChange={handleSelectChange}>
          <option value="apod">APOD</option>
          <option value="rovers">Mars Rovers</option>
        </select>
      </label>

      {selectedApi === 'apod' && (
        <>
          <p>Esta imagen corresponde con la fecha {date}</p>
          <input
            type="date"
            value={date}
            onChange={handleInput}
            max={new Date().toISOString().slice(0, 10)}
          />
          {apodData ? (
            <Figure
              title={apodData.title}
              imageUrl={apodData.url}
              date={apodData.date}
              explanation={apodData.explanation}
              copyright={apodData.copyright}
            />
          ) : (
            <p>No hay fotos disponibles para la fecha seleccionada.</p>
          )}
        </>
      )}

      {selectedApi === 'rovers' && (
        <>
          <p>Seleccione la fecha para Mars Rovers:</p>
          <input
            type="date"
            value={date}
            onChange={handleInput}
            max={new Date().toISOString().slice(0, 10)}
          />
          {roverData && roverData.photos.length > 0 ? (
            <Figure
              title={roverData.photos[0].rover.name}
              imageUrl={roverData.photos[0].img_src}
              date={roverData.photos[0].earth_date}
              roverStatus={roverData.photos[0].rover.status}
              landingDate={roverData.photos[0].rover.landing_date}
            />
          ) : (
            <p>No hay fotos disponibles para la fecha seleccionada.</p>
          )}
        </>
      )}
    </div>
  );
};

const Figure = ({ title, imageUrl, date, explanation, copyright, roverStatus, landingDate }) => (
  <div>
    <img src={imageUrl} alt={title} />
    <h2>{title}</h2>
    {roverStatus && <p>{`Rover Status: ${roverStatus}`}</p>}
    {landingDate && <p>{`Landing Date: ${landingDate}`}</p>}
    <p>{`Fecha: ${date}${copyright ? ` - ${copyright}` : ''}`}</p>
    {explanation && <p>{explanation}</p>}
  </div>
);

export default App;
