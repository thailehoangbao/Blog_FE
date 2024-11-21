import { Routes, Route } from 'react-router-dom'
import Main from './layouts/Main'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import PrivateRoutes from './layouts/PrivateRoutes'
import PublicRoutes from './layouts/PublicRoutes'
import Layout from './layouts/Layout'
import 'react-toastify/dist/ReactToastify.css';
import UserLists from './components/users/UserLists'
import UserAdd from './components/users/UserAdd'
import './css/styles.css'
import UserUpdate from './components/users/UserUpdate'
import PageNotFound from './components/PageNotFound'
import Profile from './components/Profile'
import PostList from './components/posts/PostLists'
import PostAdd from './components/posts/PostAdd'
import PostUpdate from './components/posts/PostUpdate'

function App() {

  return (
      <Routes>
        <Route element={<Layout />} >
          <Route element={<Main />} >
            <Route element={<PrivateRoutes />} >
              <Route path='/' element={<Dashboard />} />
              <Route path='/users' element={<UserLists  />} />
              <Route path='/user/add' element={<UserAdd />} />
              <Route path='/user/edit/:id' element={<UserUpdate />} />

              <Route path='/profile' element={<Profile />} />

              <Route path='/posts' element={<PostList  />} />
              <Route path='/posts/add' element={<PostAdd />} />
              <Route path='/posts/edit/:id' element={<PostUpdate />} />
            </Route>
          </Route>
          <Route element={<PublicRoutes />} >
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Route>
          <Route path='*' element={<PageNotFound />} />
        </Route>
      </Routes>
  )
}

export default App
