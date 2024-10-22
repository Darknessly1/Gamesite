import { useEffect, useState } from 'react'
import axios from 'axios'
import WowNav from '../../Headers/WowNav'

export default function ProfessionPage() {
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

  const handleSkillTierClick = (professionId, tierId) => {
    if (tierId) {
      window.location.href = `/profession/${professionId}/skill-tiers/${tierId}`
    }
  }
  const [showModal, setShowModal] = useState(false) // For controlling the modal visibility

  const handleProfessionClick = async profession => {
    const token = await fetchToken()
    setSelectedProfession(profession) // Set the selected profession
    setSkillTiers([]) // Clear any existing skill tiers
    setShowModal(true) // Open the modal

    // Only fetch skill tiers if they exist
    const hasSkillTiers =
      profession.skill_tiers && profession.skill_tiers.length > 0

    if (hasSkillTiers) {
      await fetchSkillTiers(token, profession.id)
    }
  }

  // Function to handle closing the modal
  const closeModal = () => {
    setShowModal(false)
  }

  return (
    <>
      <WowNav />

      <div className=' mb-8'>
        <div className='flex justify-center bg-gray-800 text-white p-4 rounded-xl w-fit ml-5'>
          <h2 className='text-2xl font-bold'>Professions</h2>
        </div>
        {professions.length > 0 ? (
          <div className="overflow-x-auto m-3 rounded-2xl">
            <table className="min-w-full divide-y divide-gray-200 rounded-lg shadow-lg">
              <thead className="bg-gray-300">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Image</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Profession</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Type</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Description</th>
                </tr>
              </thead>
              <tbody className="rounded-2xl">
                {professions.map((profession, index) => (
                  <tr key={profession.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 ">
                      <img
                        src={professionMedia[profession.id] || '/placeholder-image.png'}
                        className=" w-18 h-12 rounded-full"
                      />
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 font-bold border cursor-pointer">
                      <span
                        className={`${profession.type?.name === 'Primary' ? 'text-blue-500' : 'text-green-500'}`}
                        onClick={() => handleProfessionClick(profession)}
                      >
                        {profession.name}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 border">
                      {profession.type?.name || 'Unknown'}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 border">
                      {profession.description || 'No description available'}
                    </td>
                  </tr>
                ))}

                {/* Modal for skill tiers */}
                {showModal && (
                  <div
                    className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"
                    onClick={closeModal}
                  >
                    <div
                      className="bg-white p-6 rounded-lg shadow-xl w-200 relative h-200"
                      onClick={e => e.stopPropagation()} // Prevent close on content click
                    >
                      <h3 className="text-xl font-bold mb-4 text-center m-4">
                        {selectedProfession?.name}
                      </h3>

                      {loadingTiers ? (
                        <p className="text-center py-4 m-4">Loading...</p>
                      ) : skillTiers.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4">
                          {skillTiers.map(tier => (
                            <div
                              key={tier.id}
                              className="hover:bg-gray-400 w-60 hover:text-black cursor-pointer border p-2 text-center"
                              onClick={() => handleSkillTierClick(selectedProfession.id, tier.id)}
                            >
                              {tier.name}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center">No skill tiers available</p>
                      )}

                      <button
                        className="absolute top-2 right-2 text-white bg-red-500 w-10 hover:text-gray-700 hover:bg-white border-2 border-black"
                        onClick={closeModal}
                      >
                        X
                      </button>
                    </div>
                  </div>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-green-500">Loading...</p>
        )}

      </div>
    </>
  )
}
