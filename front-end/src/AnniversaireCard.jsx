import React from 'react';
import './styles/Home.css';
import { Link } from 'react-router-dom';

const AnniversaireCard = ({id, nom, date,frequence }) => {
  return (
    <div className="postit-card">
      <h2>{nom}</h2>
      <div className="editEvent">
        <div className="dateFrequence">
          <p>{date}</p>
          <p className={
            frequence === "Anniv'" ? 'frequenceAnniv' :
            frequence === "Annuel" ? 'frequenceAnnuel' :
            frequence === "Hebdo" ? 'frequenceHebdo' :
            frequence === "Quotidien" ? 'frequenceQuotidien' :
            ''
          }>
            {frequence}
          </p>

        </div>
      <Link to={`/editEvent/${id}`}>
        <button className='btn-edit'>
            <img src="/edit.png" alt="Modifier" style={{ width: '25px', height: '25px' }} />
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
