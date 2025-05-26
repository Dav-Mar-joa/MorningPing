import React from 'react';
import './styles/Home.css';
import { Link } from 'react-router-dom';

const AnniversaireCard = ({id, nom, date }) => {
  return (
    <div className="postit-card">
      <h2>{nom}</h2>
      <div className="editEvent">
       <p>{date}</p>
      <Link to={`/editEvent/${id}`}>
        <button className='btn'>
            <img src="/edit.png" alt="Modifier" style={{ width: '20px', height: '20px' }} />
        </button>
      </Link>
      {/* <Link to="/editEvent">
        <button className='btn'>
            <img src="/delete.png" alt="Modifier" style={{ width: '20px', height: '20px' }} />
        </button>
      </Link> */}
    </div> 
      </div>
      
  );
};

export default AnniversaireCard;
