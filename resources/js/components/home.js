import React from 'react';
import Image1 from '../imagens/imagemUpa1.png';
import Image2 from '../imagens/imagemUpa2.png';

export default function Home(){
    return(
        <div>
            <h2 className="text-center"> Unidade de Pronto Atendimento de Teófilo Otoni - MG</h2>
            <div>
                <img className="img-fluid" alt="Responsive image" src={Image2}/>
            </div>
            <div>
                <img className="img-fluid" alt="Responsive image" src={Image1}/>
            </div>
        </div>
    );
}