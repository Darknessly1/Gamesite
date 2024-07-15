import { useState, useEffect } from 'react';

const CardSearch = ({ handleTypeClick, selectedType }) => {
    const [energyTypes, setEnergyTypes] = useState([]);

    useEffect(() => {
        fetch('https://api.pokemontcg.io/v2/types')
            .then(response => response.json())
            .then(data => setEnergyTypes(data.data))
            .catch(error => console.error('Error fetching energy types:', error));
    }, []);

    return (
        <div className="p-4">
            <div className="flex flex-wrap gap-4 mb-4">
                {energyTypes.map((type, index) => (
                    <button
                        key={index}
                        className={`px-4 py-2 rounded-full text-white font-bold ${selectedType === type ? 'bg-blue-700' : 'bg-blue-500'} hover:bg-blue-600`}
                        onClick={() => handleTypeClick(type)}
                    >
                        {type}
                    </button>
                ))}
            </div>
        </div>
    );
};


export default CardSearch;
