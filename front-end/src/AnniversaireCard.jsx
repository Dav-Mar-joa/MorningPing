import React from 'react';
import './styles/Home.css';
import { Link } from 'react-router-dom';

const AnniversaireCard = ({id, nom, date, frequence }) => {

  const calculerAge = () => {
    if (frequence !== "Anniv'" && frequence !== "Annuel") return null;
    const today = new Date();
    const dateParsed = date.split('/');
    const annee = parseInt(dateParsed[2]);
    const age = today.getFullYear() - annee;
    return age;
  };

  const age = calculerAge();

  return (
    <div className="postit-card">

      {/* Bulle âge en haut à gauche */}
      {age !== null && (
        <div style={{
          position: 'absolute',
          top: '-10px',
          left: '-15px',
          background: '#373333',
          color: 'white',
          borderRadius: '50px', // ← ovale
          padding: '0.15rem 0.8rem', // ← espace autour du texte
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.1rem',
          // fontWeight: 'bold',
          border: '1px solid #fcf8f8',
          boxShadow: '2px 2px 2px rgba(0,0,0,0.4)',
          zIndex: 2,
          whiteSpace: 'nowrap', // ← évite le retour à la ligne
          rotate: '-8deg' // ← légère rotation pour l'effet "post-it"
        }}>
          {age} ans
        </div>
      )}

      <h2 style={{ wordBreak: 'break-word', overflowWrap: 'break-word', lineHeight: '1', margin: '0 1 0.3rem 0',paddingTop: '0.4rem' , fontSize : '1.3rem'}}>{nom}</h2>
      <div className="editEvent">
        <div className="dateFrequence">
          <p style={{ marginTop: '0.3rem',fontSize: '0.8rem' }}>{date}</p>
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
            <img src="/edit.png" alt="Modifier" style={{ width: '1rem', height: '1rem' }} />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default AnniversaireCard;