import React, { useEffect, useState } from 'react';
import { secondsToHMS } from '../utils/timeUtils';
import '../styles/styles.css';

interface relogioProps{
    silverblack : boolean;

}




const Relogio: React.FC<relogioProps> = ({silverblack}) => {
  const [hora, setHora] = useState({'hora': '1', 'silver' : ''});
  const [relogios, setRelo] = useState({});
  const [silver, setSilver] = useState({});
  const [drift, setDrift] = useState('');



 

    const horaf = secondsToHMS(parseInt(hora['hora']))
  

    const fetchHora = () => {
        fetch('http://192.168.1.6:5010/horario')
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
        }, 500); 
    
        return () => clearInterval(interval);
      }, []);




     
    



      



      const [horad, setHorad] = useState('');


      const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setHorad(event.target.value);
      };

      const handleChangeDrift = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDrift(event.target.value);
      };
    
      const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Previne o comportamento padrão do formulário
    
        try {
          const response = await fetch('http://192.168.1.6:5010/sethora', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ horad }),
          });
    
          if (response.ok) {
            // Lida com a resposta do servidor
            console.log('Hora enviada com sucesso!');
          } else {
            console.error('Falha ao enviar a hora');
          }
        } catch (error) {
          console.error('Erro na requisição:', error);
        }
      };




      const driftSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Previne o comportamento padrão do formulário
    
        try {
          const response = await fetch('http://192.168.1.6:5010/setdrift', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ drift }),
          });
    
          if (response.ok) {
            // Lida com a resposta do servidor
            console.log('Hora enviada com sucesso!');
          } else {
            console.error('Falha ao enviar a hora');
          }
        } catch (error) {
          console.error('Erro na requisição:', error);
        }
      };


    return(
        <div className={'center-container'}>
          <div>

          <form onSubmit={driftSubmit}>
          <label htmlFor="drift">Digite o drift:</label>
          <input
            type="text"
            id="drift"
            name="drift"
            placeholder="1"
            value={drift}
            onChange={handleChangeDrift}
            required
            />
          <button type="submit">Enviar</button>
    </form>

    <form onSubmit={handleSubmit}>
      <label htmlFor="hora">Digite a horas:</label>
      <input
        type="text"
        id="horad"
        name="sethorad"
        placeholder="HH:MM:SS"
        value={horad}
        onChange={handleChange}
        required
      />
      <button type="submit">Enviar</button>
      </form>
        </div>
        <div>{JSON.stringify(hora['silver'])}  </div>
        <div>  {horaf}</div>
        </div>


    );
}

export default Relogio;