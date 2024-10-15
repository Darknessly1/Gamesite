import { useState, useEffect } from 'react';
import axios from 'axios';
import WowNav from '../../Headers/WowNav';
import { Link } from "react-router-dom"; 

export default function ClassesPage () {
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
        <table className='w-fit bg-white rounded-lg'>
          <thead>
            <tr className='bg-gray-800 text-white'>
              <th className='px-4 py-2'>Image</th>
              <th className='px-4 py-2'>Class Name</th>
              <th className='px-4 py-2'>Power Type</th>
              <th className='px-4 py-2'>Specializations</th>
              <th className='px-4 py-2'>Roles</th>
            </tr>
          </thead>
          <tbody>
            {classes
              .filter(
                cls =>
                  selectedRace === 'All' ||
                  cls.playable_races?.some(race => race.name === selectedRace)
              )
              .map(cls => (
                <tr key={cls.id}>
                  <td className='p-5 py-8 border-2 flex content-center justify-center'>
                    <img src={cls.image} alt={cls.name} className='w-12 h-12' />
                  </td>
                  <td className='border-2 px-4 py-2 font-bold'>
                    <Link to={`/class/${cls.id}`}>{cls.name}</Link>
                  </td>
                  <td className='border-2 px-4 py-2'>{cls.power_type?.name}</td>

                  <td className='border-2 px-4 py-2'>
                    <ul className='list-disc ml-4'>
                      {cls.specializations?.map(spec => (
                        <li key={spec.id}>{spec.name}</li>
                      ))}
                    </ul>
                  </td>

                  <td className='border-2 px-4 py-2'>
                    <ul className='list-disc ml-4'>
                      {getUniqueRoles(cls.specializations).map(
                        (role, index) => (
                          <p key={index}>{role}</p>
                        )
                      )}
                    </ul>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
