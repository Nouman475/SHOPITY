import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './Home/Home'
import Menu from './Menu/Menu'

export default function Frontend() {
    return (
        <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/products' element={<Menu />} />
        </Routes>
    )
}
