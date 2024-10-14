// In ClassPage.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ClassPage() {
    const { classId } = useParams(); 
    const [classDetails, setClassDetails] = useState(null);

    useEffect(() => {
        const fetchToken = async () => {
            const response = await axios.post(
                "https://oauth.battle.net/token",
                "grant_type=client_credentials",
                {
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    auth: {
                        username: "0b9ab91266f7473693771094a1dbbad4",
                        password: "eouiAwYmulo3RW7yP3E5ZTC9rKR1g7Ex",
                    },
                }
            );
            return response.data.access_token;
        };

        const fetchClassDetails = async (token) => {
            const response = await axios.get(
                `https://us.api.blizzard.com/data/wow/playable-class/${classId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { namespace: "static-us", locale: "en_US" },
                }
            );
            setClassDetails(response.data);
        };

        const fetchData = async () => {
            const token = await fetchToken();
            await fetchClassDetails(token);
        };

        fetchData();
    }, [classId]);

    if (!classDetails) return <div>Loading...</div>;

    return (
        <div className="class-details">
            <h1>{classDetails.name}</h1>
    
            <p>Power Type: {classDetails.power_type?.name}</p>
    
            <h3 className="font-bold">Specializations:</h3>
            <ul>
                {classDetails.specializations?.map(spec => (
                    <li key={spec.id}>{spec.name}</li>
                ))}
            </ul>
    
            <h3 className="font-bold" >Playable Races:</h3>
            <ul>
                {classDetails.playable_races?.map(race => (
                    <li key={race.id}>{race.name}</li>
                ))}
            </ul>
        </div>
    );
    
}
