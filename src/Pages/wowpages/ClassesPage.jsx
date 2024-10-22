import { useState, useEffect } from 'react';
import axios from 'axios';
import WowNav from '../../Headers/WowNav';
import { Link } from "react-router-dom";

export default function ClassesPage() {
  const [classes, setClasses] = useState([])
  const [selectedRace, setSelectedRace] = useState('All')

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.post(
          'https://oauth.battle.net/token',
          'grant_type=client_credentials',
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            auth: {
              username: '0b9ab91266f7473693771094a1dbbad4',
              password: 'eouiAwYmulo3RW7yP3E5ZTC9rKR1g7Ex'
            }
          }
        )
        return response.data.access_token
      } catch (error) {
        console.error('Error fetching token:', error)
        throw error
      }
    }

    const fetchClasses = async token => {
      try {
        const response = await axios.get(
          'https://us.api.blizzard.com/data/wow/playable-class/index',
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
            params: {
              namespace: 'static-us',
              locale: 'en_US'
            }
          }
        )

        const classDetails = await Promise.all(
          response.data.classes.map(async cls => {
            const detailsResponse = await axios.get(
              `https://us.api.blizzard.com/data/wow/playable-class/${cls.id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`
                },
                params: {
                  namespace: 'static-us',
                  locale: 'en_US'
                }
              }
            )

            // Fetch media for each class
            const mediaResponse = await axios.get(
              `https://us.api.blizzard.com/data/wow/media/playable-class/${cls.id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`
                },
                params: {
                  namespace: 'static-us',
                  locale: 'en_US'
                }
              }
            )

            const spellsResponse = await axios.get(
              `https://us.api.blizzard.com/data/wow/playable-class/${cls.id}/pvp-talent-slots`,
              {
                headers: {
                  Authorization: `Bearer ${token}`
                },
                params: {
                  namespace: 'static-us',
                  locale: 'en_US'
                }
              }
            )

            const abilities =
              spellsResponse.data.talents?.map(
                talent => talent.spell_tooltip.spell.name
              ) || []

            return {
              ...detailsResponse.data,
              abilities,
              image: mediaResponse.data.assets[0].value
            }
          })
        )

        setClasses(classDetails)
      } catch (error) {
        console.error('Error fetching classes:', error)
      }
    }

    const fetchData = async () => {
      try {
        const token = await fetchToken()
        await fetchClasses(token)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  const getRoleName = spec => {
    const roleMapping = {
      // Death Knight
      Blood: 'Tank',
      Frost: 'DPS',
      Unholy: 'DPS',
      // Druid
      Balance: 'DPS',
      Feral: 'DPS',
      Guardian: 'Tank',
      Restoration: 'Healer',
      // Hunter
      'Beast Mastery': 'DPS',
      Marksmanship: 'DPS',
      Survival: 'DPS',
      // Mage
      Arcane: 'DPS',
      Fire: 'DPS',
      'Frost (Mage)': 'DPS',
      // Monk
      Brewmaster: 'Tank',
      Mistweaver: 'Healer',
      Windwalker: 'DPS',
      // Paladin
      Holy: 'Healer',
      Protection: 'Tank',
      Retribution: 'DPS',
      // Priest
      Discipline: 'Healer',
      'Holy (Priest)': 'Healer',
      Shadow: 'DPS',
      // Rogue
      Assassination: 'DPS',
      Outlaw: 'DPS',
      Subtlety: 'DPS',
      // Shaman
      Elemental: 'DPS',
      Enhancement: 'DPS',
      'Restoration (Shaman)': 'Healer',
      // Warlock
      Affliction: 'DPS',
      Demonology: 'DPS',
      Destruction: 'DPS',
      // Warrior
      Arms: 'DPS',
      Fury: 'DPS',
      'Protection (Warrior)': 'Tank',
      // Demon Hunter
      Havoc: 'DPS',
      Vengeance: 'Tank',
      // Evoker
      Devastation: 'DPS',
      Preservation: 'Healer'
    }

    return roleMapping[spec.name]
  }

  const getUniqueRoles = specializations => {
    const roles = new Set() // Use a Set to avoid duplicate roles
    specializations.forEach(spec => {
      const role = getRoleName(spec)
      roles.add(role)
    })
    return Array.from(roles) // Convert Set back to an array
  }

  return (
    <div className='m-3'>
      <div className='m-3'>
        <WowNav />
      </div>

      <div className='playable-classes-section mb-8'>
        <div className='bg-gray-800 text-white p-4 rounded-xl w-fit m-3'>
          <h2 className='text-2xl font-bold'>Playable Classes</h2>
        </div>

        {/* Table of Playable Classes */}
        <div className="overflow-x-auto m-3 rounded-2xl">
          <table className="min-w-full divide-y divide-gray-200 rounded-lg shadow-lg">
            <thead className="bg-gray-300">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Image</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Class Name</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Power Type</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Specializations</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Roles</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {classes && classes.length > 0 ? (
                classes.map((cls, index) => (
                  <tr key={cls.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                      <img src={cls.image} alt={cls.name} className="w-12 h-12 rounded-full" />
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                      <Link to={`/class/${cls.id}`} className="text-blue-500 hover:underline">{cls.name}</Link>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{cls.power_type?.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                      <ul className="list-disc ml-4">
                        {cls.specializations?.map(spec => (
                          <li key={spec.id}>{spec.name}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                      <ul className="list-disc ml-4">
                        {getUniqueRoles(cls.specializations).map((role, index) => (
                          <li key={index}>{role}</li>
                         ))}
                      </ul>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-green-500 py-4">Loading...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>


      </div>
    </div>
  )
}
