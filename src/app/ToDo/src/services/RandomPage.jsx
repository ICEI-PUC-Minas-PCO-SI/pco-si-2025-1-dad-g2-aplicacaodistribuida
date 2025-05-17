import React from 'react';
import { Link } from 'react-router-dom';

export default function RandomPage() {
  const messages = [
    'Você foi parar aqui por acidente? Aqui está uma pizza imaginária para consolar! 🍕',
    'Bem-vindo à Terra do Nunca. A aventura te espera! 🧚‍♀️',
    'Oops! Parece que você se perdeu. Mas não se preocupe, é só um desvio! 🗺️',
    'Parabéns! Você descobriu a página secreta! 🔒',
    'Hora do descanso: aproveite este panda fofinho! 🐼'
  ];

  const randomIndex = Math.floor(Math.random() * messages.length);
  const message = messages[randomIndex];

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-purple-400 to-blue-500 text-white p-4">  
      <h1 className="text-4xl font-bold mb-4">Página Aleatória</h1>
      <p className="text-xl mb-6 text-center">{message}</p>
      <img
        src={`https://source.unsplash.com/featured/300x200?fun,random&sig=${randomIndex}`}
        alt="Imagem aleatória"
        className="rounded-lg shadow-lg mb-6"
      />
      <Link
        to="/"
        className="px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg shadow hover:bg-gray-100 transition"
      >
        Voltar para Início
      </Link>
    </div>
  );
}
