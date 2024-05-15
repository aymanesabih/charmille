import React from 'react';

const TextAndTable = () => {
  const data = [
    { id: 1, name: 'John Doe', age: 25 },
    { id: 2, name: 'Jane Smith', age: 30 },
    { id: 3, name: 'Alice Johnson', age: 35 }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Texte et Tableau</h2>
      <p>Voici un exemple de composant qui affiche un texte et un tableau :</p>
      <table className="border-collapse border border-gray-400 mt-4">
        <thead>
          <tr>
            <th className="border border-gray-400 px-4 py-2">ID</th>
            <th className="border border-gray-400 px-4 py-2">Nom</th>
            <th className="border border-gray-400 px-4 py-2">Âge</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td className="border border-gray-400 px-4 py-2">{item.id}</td>
              <td className="border border-gray-400 px-4 py-2">{item.name}</td>
              <td className="border border-gray-400 px-4 py-2">{item.age}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TextAndTable;
