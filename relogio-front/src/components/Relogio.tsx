import React, { useEffect, useState } from 'react';
import { secondsToHMS } from '../utils/timeUtils';
import '../styles/styles.css';

interface relogioProps{
    silverblack : boolean;

}




const Relogio: React.FC<relogioProps> = ({silverblack}) => {
  const [hora, setHora] = useState<string>('');
  const horaf = secondsToHMS(parseInt(hora))

    const fetchHora = () => {
        fetch('http://localhost:5000/horario')
          .then(response => {
            if (!response.ok) {
              throw new Error('Sem net');
            }
            return response.json();
          })
          .then(data => {
            setHora(data); 
          })
          .catch(error => {
            console.error("Erro ao buscar", error);
          });
      };
    
      useEffect(() => {
        const interval = setInterval(() => {
          fetchHora();
        }, 1000); 
    
        return () => clearInterval(interval);
      }, []);

      


    return(
        <div className={'center-container'}>

      
        <div>{horaf}</div>
        </div>

    );
}

export default Relogio;