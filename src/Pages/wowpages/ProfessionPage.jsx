import { useEffect, useState } from 'react'
import axios from 'axios'
import WowNav from '../../Headers/WowNav'

export default function ProfessionPage () {
  const [professions, setProfessions] = useState([])
  const [professionMedia, setProfessionMedia] = useState([])
  const [selectedProfession, setSelectedProfession] = useState(null)
  const [skillTiers, setSkillTiers] = useState([])
  const [loadingTiers, setLoadingTiers] = useState(false) // Loading state for skill tiers

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

  const fetchProfessions = async token => {
    try {
      const response = await axios.get(
        'https://us.api.blizzard.com/data/wow/profession/index',
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
      const professionDetails = await Promise.all(
        response.data.professions.map(async profession => {
          const detailsResponse = await axios.get(
            `https://us.api.blizzard.com/data/wow/profession/${profession.id}`,
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
          return detailsResponse.data
        })
      )
      setProfessions(professionDetails)
    } catch (error) {
      console.error('Error fetching professions:', error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await fetchToken()
        await fetchProfessions(token)
        await fetchProfessionMedia(token, professions)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [professions])

  const fetchProfessionMedia = async (token, professions) => {
    try {
      const mediaPromises = professions.map(async profession => {
        const mediaResponse = await axios.get(
          `https://us.api.blizzard.com/data/wow/media/profession/${profession.id}`,
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
        return {
          id: profession.id,
          url: mediaResponse.data.assets[0]?.value || '/placeholder-image.png'
        }
      })

      const mediaData = await Promise.all(mediaPromises)
      const mediaMap = mediaData.reduce((acc, media) => {
        acc[media.id] = media.url
        return acc
      }, {})

      setProfessionMedia(mediaMap) // Set media URLs in state
    } catch (error) {
      console.error('Error fetching profession media:', error)
    }
  }

  const fetchSkillTiers = async (token, professionId) => {
    try {
      setLoadingTiers(true) // Start loading
      const response = await axios.get(
        `https://us.api.blizzard.com/data/wow/profession/${professionId}`,
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
      setSkillTiers(response.data.skill_tiers) // Set skill tiers
    } catch (error) {
      console.error('Error fetching skill tiers:', error)
    } finally {
      setLoadingTiers(false) // Stop loading
    }
  }

  const handleHover = async profession => {
    const token = await fetchToken()
    setSelectedProfession(profession) // Set selected profession immediately
    setSkillTiers([]) // Clear the current skill tiers

    await fetchSkillTiers(token, profession.id) // Fetch the new tiers for the hovered profession
  }

  const handleSkillTierClick = (professionId, tierId) => {
    window.location.href = `/profession/${professionId}/skill-tiers/${tierId}`
  }

  return (
    <>
      <div className='m-3'>
        <WowNav />
      </div>

      <div className='professions-section mb-8'>
        <div className='bg-gray-800 text-white p-4 rounded-xl w-fit m-4'>
          <h2 className='text-2xl font-bold'>Professions</h2>
        </div>

        {professions.length > 0 ? (
          <div className='rounded-3xl m-6'>
            <table className='table-auto bg-white rounded-lg border border-black'>
              <thead className='bg-gray-800  rounded-3xl'>
                <tr className='bg-gray-600 text-white '>
                  <th className='px-4 py-2 text-left border border-black'>
                    Image
                  </th>
                  <th className='px-4 py-2 text-left border border-black'>
                    Profession
                  </th>
                  <th className='px-4 py-2 text-left border border-black'>
                    Type
                  </th>
                  <th className='px-4 py-2 text-left border border-black'>
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {professions.map((profession, index) => (
                  <tr
                    key={profession.id}
                    className={`border-b ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-200'
                    }`}
                  >
                    <td className='border border-black'>
                      <img
                        src={
                          professionMedia[profession.id] ||
                          '/placeholder-image.png'
                        }
                        className='ml-3 w-12 h-12'
                      />
                    </td>
                    <td
                      className='px-4 py-2 border border-black font-bold relative'
                      onMouseEnter={() => handleHover(profession)}
                      onMouseLeave={() => {
                        setSelectedProfession(null)
                        setSkillTiers([])
                      }}
                    >
                      <div className='h-full w-full'>
                        <span
                          className={`${
                            profession.type?.name === 'Primary'
                              ? 'text-blue-500'
                              : 'text-green-500'
                          }`}
                        >
                          {profession.name}
                        </span>
                      </div>

                      {selectedProfession?.id === profession.id && (
                        <div className='absolute top-0 left-full border border-black bg-gray-200 shadow-lg rounded-lg w-60 z-10 min-h-[100px]'>
                          {loadingTiers ? (
                            <p className='text-center py-9'>Loading...</p>
                          ) : skillTiers?.length > 0 ? (
                            skillTiers.map(tier => (
                              <div
                                key={tier.id}
                                className='hover:bg-gray-400 cursor-pointer border'
                                onClick={() =>
                                  handleSkillTierClick(profession.id, tier.id)
                                }
                              >
                                {tier.name}
                              </div>
                            ))
                          ) : (
                            <p className='text-center'>
                              No skill tiers available
                            </p>
                          )}
                        </div>
                      )}
                    </td>

                    <td className='px-4 py-2 border border-black'>
                      {profession.type?.name || 'Unknown'}
                    </td>
                    <td className='px-4 py-2 border border-black'>
                      {profession.description || 'No description available'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className='text-center text-green-500'>Loading...</p>
        )}
      </div>
    </>
  )
}
