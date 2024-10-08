import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ProtectedRoute = ({ isAdmin, children }) => {
    
    const { isAuthenticated, loading, user } = useSelector(state => state.auth)
  
    return (

        loading === false && (
                isAuthenticated === false ?
                    <Navigate to='/login' />
                :
                isAdmin === true && user.role !== 'admin' ? 
                    <Navigate to='/' />
                :
                    <> {children} </>
            )
    )
}

export default ProtectedRoute
