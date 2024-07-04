import React from 'react';

const CardDetails = ({ card, onClose }) => (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg max-w-4xl w-full flex">
            <div className="w-1/2">
                <img src={card.images.large} alt={card.name} className="w-full h-auto rounded-md" />
            </div>
            <div className="w-1/2 pl-9 overflow-y-scroll h-96">
                <button className="mb-4 text-red-600" onClick={onClose}>Close</button>
                <h2 className="text-2xl font-bold mt-4">{card.name}</h2>
                <p className="text-gray-600">{card.supertype} - {card.subtypes?.join(', ') || 'None'}</p>
                <p className="mt-2"><span className="font-bold">Level: </span>{card.level || 'None'}</p>
                <p className="mt-2"><span className="font-bold">HP: </span>{card.hp || 'None'}</p>
                <p className="mt-2"><span className="font-bold">Types: </span>{card.types?.join(', ') || 'None'}</p>
                <p className="mt-2"><span className="font-bold">Evolves From: </span>{card.evolvesFrom || 'None'}</p>
                {card.abilities && card.abilities.length > 0 ? card.abilities.map((ability, index) => (
                    <div key={index} className="mt-2">
                        <p><span className="font-bold">Ability: </span>{ability.name}</p>
                        <p>{ability.text}</p>
                    </div>
                )) : <p className="mt-2"><span className="font-bold">Ability: </span>None</p>}
                {card.attacks && card.attacks.length > 0 ? card.attacks.map((attack, index) => (
                    <div key={index} className="mt-2">
                        <p><span className="font-bold">Attack: </span>{attack.name}</p>
                        <p>{attack.text}</p>
                        <p><span className="font-bold">Cost: </span>{attack.cost.join(', ')}</p>
                        <p><span className="font-bold">Damage: </span>{attack.damage}</p>
                    </div>
                )) : <p className="mt-2"><span className="font-bold">Attack: </span>None</p>}
                {card.weaknesses && card.weaknesses.length > 0 ? card.weaknesses.map((weakness, index) => (
                    <div key={index} className="mt-2">
                        <p><span className="font-bold">Weakness: </span>{weakness.type}</p>
                        <p>{weakness.value}</p>
                    </div>
                )) : <p className="mt-2"><span className="font-bold">Weakness: </span>None</p>}
                {card.resistances && card.resistances.length > 0 ? card.resistances.map((resistance, index) => (
                    <div key={index} className="mt-2">
                        <p><span className="font-bold">Resistance: </span>{resistance.type}</p>
                        <p>{resistance.value}</p>
                    </div>
                )) : <p className="mt-2"><span className="font-bold">Resistance: </span>None</p>}
                <p className="mt-2"><span className="font-bold">Retreat Cost: </span>{card.retreatCost?.join(', ') || 'None'}</p>
                <p className="mt-2"><span className="font-bold">Set: </span>{card.set?.name || 'None'} ({card.set?.series || 'None'})</p>
                <p className="mt-2"><span className="font-bold">Rarity: </span>{card.rarity || 'None'}</p>
                <p className="mt-2"><span className="font-bold">Artist: </span>{card.artist || 'None'}</p>
                <p className="mt-2"><span className="font-bold">Flavor Text: </span>{card.flavorText || 'None'}</p>
                <p className="mt-2"><span className="font-bold">National Pokedex Numbers: </span>{card.nationalPokedexNumbers?.join(', ') || 'None'}</p>
                <a className="mt-2 text-blue-500" href={card.tcgplayer?.url}>View on TCGPlayer</a>
                <a className="mt-2 text-blue-500" href={card.cardmarket?.url}>View on CardMarket</a>
            </div>
        </div>
    </div>
);

export default CardDetails;
