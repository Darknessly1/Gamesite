import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Link } from 'react-router-dom'
import WowNav from '../../Headers/WowNav'

export default function SkillTierPage () {
  const { professionId, tierId } = useParams()
  const [tierDetails, setTierDetails] = useState(null)
  const [recipeDetails, setRecipeDetails] = useState({})
  const [accessToken, setAccessToken] = useState('')
  const [expandedCategory, setExpandedCategory] = useState(null)

  const fetchToken = async () => {
    const response = await axios.post(
      'https://oauth.battle.net/token',
      'grant_type=client_credentials',
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        auth: {
          username: '0b9ab91266f7473693771094a1dbbad4',
          password: 'eouiAwYmulo3RW7yP3E5ZTC9rKR1g7Ex'
        }
      }
    )
    return response.data.access_token
  }

  const fetchSkillTierDetails = async token => {
    try {
      const response = await axios.get(
        `https://us.api.blizzard.com/data/wow/profession/${professionId}/skill-tier/${tierId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { namespace: 'static-us', locale: 'en_US' }
        }
      )
      setTierDetails(response.data)
      setAccessToken(token)
    } catch (error) {
      console.error('Error fetching skill tier details:', error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const token = await fetchToken()
      await fetchSkillTierDetails(token)
    }
    fetchData()
  }, [professionId, tierId])

  const fetchRecipeDetails = async category => {
    try {
      const token = accessToken
      let recipesWithDetails = {}

      // Fetch all recipe details in parallel
      const recipePromises = category.recipes.map(async recipe => {
        const recipeResponse = await axios.get(
          `https://us.api.blizzard.com/data/wow/recipe/${recipe.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { namespace: 'static-us', locale: 'en_US' }
          }
        )

        // Fetch recipe media (image) from the recipe media API
        const mediaResponse = await axios.get(
          `https://us.api.blizzard.com/data/wow/media/recipe/${recipe.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { namespace: 'static-us' }
          }
        )

        // Fetch all reagent media in parallel using Promise.all
        const reagentsWithMedia = await Promise.all(
          recipeResponse.data.reagents.map(async reagent => {
            const reagentId = reagent.reagent.id
            const itemResponse = await axios.get(
              `https://us.api.blizzard.com/data/wow/item/${reagentId}`,
              {
                headers: { Authorization: `Bearer ${token}` },
                params: { namespace: 'static-us', locale: 'en_US' }
              }
            )
            const reagentMediaResponse = await axios.get(
              `https://us.api.blizzard.com/data/wow/media/item/${reagentId}`,
              {
                headers: { Authorization: `Bearer ${token}` },
                params: { namespace: 'static-us' }
              }
            )

            return {
              name: itemResponse.data.name,
              quantity: reagent.quantity,
              mediaUrl: reagentMediaResponse.data.assets[0].value
            }
          })
        )

        // Store recipe with reagents, media, and recipe media (image)
        recipesWithDetails[recipe.id] = {
          ...recipeResponse.data,
          reagents: reagentsWithMedia,
          recipeMediaUrl: mediaResponse.data.assets[0].value // Store recipe image
        }
      })

      // Wait for all recipe details and reagents to be fetched
      await Promise.all(recipePromises)

      // Store the fetched details in state
      setRecipeDetails(prevDetails => ({
        ...prevDetails,
        [category.name]: recipesWithDetails
      }))
    } catch (error) {
      console.error('Error fetching recipe or reagent details:', error)
    }
  }

  const toggleCategory = category => {
    if (expandedCategory === category.name) {
      setExpandedCategory(null) // Collapse the category
    } else {
      setExpandedCategory(category.name) // Expand the category
      if (!recipeDetails[category.name]) {
        fetchRecipeDetails(category) // Fetch recipes if not already loaded
      }
    }
  }

  return (
    <>
    <div className='m-3'>
        <WowNav />
    </div>
      <div className='p-4'>
        <div className='mt-4'>
          <Link to={`/professionpage`}>
            <button className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
              Back to Profession
            </button>
          </Link>
        </div>
        {tierDetails ? (
          <div className='mt-4'>
            <h2 className='text-xl font-semibold mt-6'>Categories:</h2>
            <div className='flex flex-wrap gap-4'>
              {tierDetails.categories &&
                tierDetails.categories.map(category => (
                  <button
                    key={category.name}
                    className='text-lg font-semibold mb-2 cursor-pointer px-4 py-2 bg-gray-300 rounded hover:bg-gray-400'
                    onClick={() => toggleCategory(category)}
                  >
                    {category.name}{' '}
                    {expandedCategory === category.name ? '-' : '+'}
                  </button>
                ))}
            </div>

            {/* Display the expanded category's table below */}
            {expandedCategory && (
              <div className='mt-6'>
                {tierDetails.categories.map(
                  category =>
                    expandedCategory === category.name && (
                      <table
                        key={category.name}
                        className=' bg-white rounded-2xl'
                      >
                        <thead>
                          <tr className='bg-gray-500'>
                            <th className='  text-left'>
                              Recipe Name
                            </th>
                            <th className='text-left'>
                              Reagents
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {category.recipes.map(recipe => (
                            <tr key={recipe.id}>
                              <td className='px-6 py-4 flex items-center'>
                                {/* Display recipe image */}
                                {recipeDetails[category.name] &&
                                  recipeDetails[category.name][recipe.id] && (
                                    <img
                                      src={
                                        recipeDetails[category.name][recipe.id]
                                          .recipeMediaUrl
                                      }
                                      alt={recipe.name}
                                      className='w-10 h-10 mr-4 border border-gray-300 rounded'
                                    />
                                  )}
                                {recipe.name}
                              </td>
                              <td className='px-4 '>
                                {recipeDetails[category.name] &&
                                  recipeDetails[category.name][recipe.id] && (
                                    <ul className='list-none flex flex-wrap'>
                                      {recipeDetails[category.name][
                                        recipe.id
                                      ].reagents.map((reagent, index) => (
                                        <li
                                          key={index}
                                          className='flex items-center mr-4 mb-2'
                                        >
                                          <div className='relative inline-block group'>
                                            <img
                                              src={reagent.mediaUrl}
                                              alt={reagent.name}
                                              className='w-10 h-10 border border-gray-300 rounded'
                                            />
                                            <span className='absolute top-8 left-8 text-xs bg-gray-800 text-white px-1'>
                                              {reagent.quantity}
                                            </span>
                                            <div className='absolute top-0 right-0 transform translate-x-full -translate-y-full bg-gray-700 text-white text-xs rounded px-2 py-2 opacity-0 group-hover:opacity-100 transition-opacity  pointer-events-none'>
                                              {reagent.name}
                                            </div>
                                          </div>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )
                )}
              </div>
            )}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  )
}
