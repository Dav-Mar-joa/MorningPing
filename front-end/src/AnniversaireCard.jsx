import React from 'react';
import './styles/Home.css';
import { Link } from 'react-router-dom';

const AnniversaireCard = ({id, nom, date,frequence }) => {

  const calculerAge = () => {
    if (frequence !== "Anniv'" && frequence !== "Annuel") return null;
    const today = new Date();
    const dateParsed = date.split('/'); // format dd/mm/yyyy
    const annee = parseInt(dateParsed[2]);
    const age = today.getFullYear() - annee;
    return age;
  };

  const age = calculerAge();

  return (
    <div className="postit-card">
      
      <h2>{nom}</h2>
      {age !== null  && <span style={{ marginLeft: '0.4rem', color: '#888',marginBottom: '0.3rem' }}>({age} ans)</span>}
      <div className="editEvent">
        <div className="dateFrequence">
          <p style={{ marginTop: '0.5rem' }}>{date}
          </p>
          
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
