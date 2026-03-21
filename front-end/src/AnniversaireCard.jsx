import React from 'react';
import './styles/Home.css';
import { Link } from 'react-router-dom';

const AnniversaireCard = ({ id, nom, date, frequence }) => {

  const calculerAge = () => {
    if (frequence !== "Anniv'" && frequence !== "Annuel") return null;
    const today = new Date();
    const dateParsed = date.split('/');
    const annee = parseInt(dateParsed[2]);
    if (isNaN(annee)) return null;
    return today.getFullYear() - annee;
  };

  const age = calculerAge();

  const badgeClass =
    frequence === "Anniv'"    ? 'frequenceAnniv' :
    frequence === "Annuel"    ? 'frequenceAnnuel' :
    frequence === "Hebdo"     ? 'frequenceHebdo' :
    frequence === "Quotidien" ? 'frequenceQuotidien' : '';

  return (
    <div className="postit-card">

      {age !== null && (
        <div className="age-bubble">
          {age} ans
        </div>
      )}

      <h2 className="card-nom">{nom}</h2>

      <div className="card-footer">
        <div className="card-meta">
          <span className="card-date">{date}</span>
          <span className={badgeClass}>{frequence}</span>
        </div>

        <Link to={`/editEvent/${id}`}>
          <button className="btn-edit" title="Modifier">
            <img src="/edit.png" alt="Modifier" style={{ width: '1rem', height: '1rem', filter: 'invert(1)' }} />
          </button>
        </Link>
      </div>

    </div>
  );
};

export default AnniversaireCard;
