import {AiFillHome} from 'react-icons/ai'
import {FiLogOut} from 'react-icons/fi'
import {FaBriefcase} from 'react-icons/fa'
import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const {history} = props

  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="nav-header">
      <div className="nav-content">
        <Link to="/" className="website-logo">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo"
          />
        </Link>
        <ul className="nav-menu">
          <Link to="/" className="nav-link">
            <li>
              <AiFillHome className="nav-icon" />
            </li>
          </Link>
          <Link to="/jobs" className="nav-link">
            <li>
              <FaBriefcase className="nav-icon" />
            </li>
          </Link>
          <li className="nav-link" onClick={onClickLogout}>
            <FiLogOut className="nav-icon logout-btn" />
          </li>
        </ul>
        <ul className="nav-large-menu">
          <Link to="/" className="nav-link nav-heading">
            <li>Home</li>
          </Link>
          <Link to="/jobs" className="nav-link nav-heading">
            <li>Jobs</li>
          </Link>
        </ul>
        <button
          type="button"
          className="logout-desktop-btn"
          onClick={onClickLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default withRouter(Header)
