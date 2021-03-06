import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { setUserAccessToken, setUserDetails } from '../store/user'
import { LOCAL_STORAGE_AUTH_STATE_CODE } from '../types/constants'
import { useAppDispatch, useAppSelector } from '../types/hook.type'
import { AuthUserDetails } from '../types/user.type'

export default function Auth () {
  const dispatch = useAppDispatch()
  let authState = useAppSelector((state) => state.user.authStateCode)
  const [error, setError] = useState<string| null>(null)
  // get authState from store or the localstorage
  const getAuthState = () => {
    if (!authState) {
      authState = localStorage.getItem(LOCAL_STORAGE_AUTH_STATE_CODE)
    }
    return authState
  }
  const navigate = useNavigate()

  const getAuthDetails = useCallback(() => {
    const state = window.location.hash
      ?.slice(1)
      ?.split('&')
      ?.reduce((prev, currentVal) => {
        const [key, value] = currentVal.split('=')
        prev[key] = value
        return prev
      }, {})
    return state as AuthUserDetails
  }, [window.location.hash])

  const checkAuthState = () => {
    return getAuthDetails().state !== getAuthState()
  }

  const setUser = (user: AuthUserDetails) => {
    // dispatch(setUserAccessToken(user))
    return dispatch(setUserDetails(user))
  }
  useEffect(() => {
    if (checkAuthState()) {
      // set error state does not match
      setError('The authorization state code does not match! please retry')
      return
    }
    setUser(getAuthDetails())
      .finally(() => navigate('/home'))
  }, [getAuthDetails()])
  return (
    error
      ? <div className='w-1/2 mx-auto mt-10 text-white'>
        <span>{error}</span>
        <Link to='/'>
          <span> try again</span>
        </Link>
      </div>
      : <></>
  )
}
