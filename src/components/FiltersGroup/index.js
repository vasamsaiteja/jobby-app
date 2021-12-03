import {Component} from 'react'
import {BsSearch} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class FiltersGroup extends Component {
  state = {
    userProfile: {},
    activeEmploymentId: '',
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProfile()
  }

  renderProfileDetails = data => ({
    name: data.name,
    profileImageUrl: data.profile_image_url,
    shortBio: data.short_bio,
  })

  getProfile = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = this.renderProfileDetails(fetchedData.profile_details)
      this.setState({
        userProfile: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderSalaryFilters = () => {
    const {salaryRangesList} = this.props

    return salaryRangesList.map(salary => {
      const {changeSalaryType} = this.props
      const onChangeSalaryType = () => changeSalaryType(salary.salaryRangeId)

      return (
        <li key={salary.salaryRangeId} className="category-item">
          <input
            type="radio"
            id={salary.salaryRangeId}
            className="input-checkbox"
            onChange={onChangeSalaryType}
            value={salary.label}
            name="salary-type"
          />
          <label htmlFor={salary.salaryRangeId} className="label-heading">
            {salary.label}
          </label>
        </li>
      )
    })
  }

  renderSalaryRangesList = () => (
    <div>
      <h1 className="category-heading">Salary Range</h1>
      <ul className="categories-list">{this.renderSalaryFilters()}</ul>
    </div>
  )

  renderEmploymentList = () => {
    const {employmentTypesList} = this.props

    return employmentTypesList.map(employee => {
      const {changeEmploymentType} = this.props
      const {activeEmploymentId} = this.state

      const onClickCategoryItem = event => {
        console.log(event.target.id)
        if (event.target.checked === true) {
          changeEmploymentType(employee.employmentTypeId)
        } else {
          changeEmploymentType(activeEmploymentId)
        }
      }

      return (
        <li key={employee.employmentTypeId} className="category-item">
          <input
            type="checkbox"
            id={employee.employmentTypeId}
            className="input-checkbox"
            onChange={onClickCategoryItem}
          />
          <label htmlFor={employee.employmentTypeId} className="label-heading">
            {employee.label}
          </label>
        </li>
      )
    })
  }

  renderEmploymentCategories = () => (
    <>
      <h1 className="category-heading">Type of Employment</h1>
      <ul className="categories-list">{this.renderEmploymentList()}</ul>
      <hr className="horizontal-line horizontal-line-style " />
    </>
  )

  renderProfileLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onClickApiCall = () => {
    this.getProfile()
  }

  renderProfileFailureView = () => (
    <div className="profile-failure-container">
      <button
        type="button"
        onClick={this.onClickApiCall}
        className="retry-button"
      >
        Retry
      </button>
    </div>
  )

  renderUserProfile = () => {
    const {userProfile} = this.state
    const {name, profileImageUrl, shortBio} = userProfile
    return (
      <>
        <div className="profile-background-container">
          <div>
            <img
              src={profileImageUrl}
              alt="profile"
              className="profile-image"
            />
            <h1 className="profile-heading">{name}</h1>
            <p className="profile-description">{shortBio}</p>
          </div>
        </div>
        <hr className="horizontal-line horizontal-line-style " />
      </>
    )
  }

  renderAllUsers = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderUserProfile()
      case apiStatusConstants.failure:
        return this.renderProfileFailureView()
      case apiStatusConstants.inProgress:
        return this.renderProfileLoadingView()
      default:
        return null
    }
  }

  searchResults = () => {
    const {enterSearchInput} = this.props
    enterSearchInput()
  }

  onEnterSearchInput = event => {
    const {enterSearchInput} = this.props
    if (event.key === 'Enter') {
      enterSearchInput()
    }
  }

  onChangeSearchInput = event => {
    const {changeSearchInput} = this.props
    changeSearchInput(event.target.value)
  }

  renderSearchInput = () => {
    const {search} = this.props
    return (
      <div className="search-input-container">
        <input
          value={search}
          type="search"
          placeholder="Search"
          className="search-input"
          onChange={this.onChangeSearchInput}
          onKeyDown={this.onEnterSearchInput}
        />
        <button
          type="button"
          testid="searchButton"
          className="search-button"
          onClick={this.searchResults}
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  render() {
    return (
      <div className="filters-group-container">
        {this.renderSearchInput()}
        {/* {this.renderUserProfile()} */}
        {this.renderAllUsers()}
        {this.renderEmploymentCategories()}
        {this.renderSalaryRangesList()}
      </div>
    )
  }
}

export default FiltersGroup
