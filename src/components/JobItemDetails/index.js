import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsStarFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import {FaBriefcase} from 'react-icons/fa'
import {IoCreateOutline} from 'react-icons/io5'

import Header from '../Header'
import SimilarJobItem from '../SimilarJobItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobData: {},
    companyLife: {},
    skills: [],
    similarJobsData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobData()
  }

  getFormattedData = data => ({
    companyLogoUrl: data.company_logo_url,
    companyWebsiteUrl: data.company_website_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    location: data.location,
    packagePerAnnum: data.package_per_annum,
    rating: data.rating,
    title: data.title,
  })

  getCompanyAndSkillsFormattedData = data => ({
    description: data.description,
    imageUrl: data.image_url,
    name: data.name,
  })

  getJobData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = this.getFormattedData(fetchedData.job_details)
      const updatedSimilarJobsData = fetchedData.similar_jobs.map(
        eachSimilarJob => this.getFormattedData(eachSimilarJob),
      )
      const updatedCompanyLifeData = this.getCompanyAndSkillsFormattedData(
        fetchedData.job_details.life_at_company,
      )
      const updatedSkillsData = fetchedData.job_details.skills.map(eachSkill =>
        this.getCompanyAndSkillsFormattedData(eachSkill),
      )
      this.setState({
        jobData: updatedData,
        similarJobsData: updatedSimilarJobsData,
        companyLife: updatedCompanyLifeData,
        skills: updatedSkillsData,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 404) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoaderView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onRefreshPage = () => {
    this.getJobData()
  }

  renderFailureView = () => (
    <div className="jobs-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="jobs-failure-img"
      />
      <h1 className="job-failure-heading-text">Oops! Something Went Wrong</h1>
      <p className="job-failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" onClick={this.onRefreshPage}>
        Retry
      </button>
    </div>
  )

  renderCompanyLife = () => {
    const {companyLife} = this.state
    const {description, imageUrl} = companyLife
    return (
      <>
        <h1 className="skills-heading">Life at Company</h1>
        <div className="company-life-container">
          <p className="job-paragraph paragraph">{description}</p>
          <img src={imageUrl} alt="life at company" />
        </div>
      </>
    )
  }

  renderSkills = () => {
    const {skills} = this.state
    // console.log(skills)
    return (
      <>
        <h1 className="skills-heading">Skills</h1>
        <ul className="skills-list-container">
          {skills.map(eachSkill => (
            <li className="skill-list-item" key={eachSkill.name}>
              <img
                src={eachSkill.imageUrl}
                alt={eachSkill.name}
                className="skill-image"
              />
              <p className="skill-name">{eachSkill.name}</p>
            </li>
          ))}
        </ul>
      </>
    )
  }

  renderJobsDetailView = () => {
    const {jobData, similarJobsData} = this.state
    console.log(similarJobsData)
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobData
    return (
      <>
        <div className="job-details-container">
          <div className="job-title-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo"
            />
            <div className="job-rating-container">
              <h1 className="job-title">{title}</h1>
              <div className="job-title-container">
                <BsStarFill className="star-container" />
                <p className="job-rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="location-role-salary-container">
            <div className="location-role-container">
              <div className="location-container">
                <MdLocationOn className="location-icon" />
                <p className="job-location">{location}</p>
              </div>
              <div className="location-container">
                <FaBriefcase className="location-icon employment-icon" />
                <p className="job-location">{employmentType}</p>
              </div>
            </div>
            <p className="job-salary">{packagePerAnnum}</p>
          </div>
          <hr className="horizontal-line" />
          <div className="job-description-container">
            <h1 className="job-description">Description</h1>
            <a
              href={companyWebsiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="anchor-item"
            >
              <div className="job-visit-container">
                <p className="job-detail-website-url">visit</p>
                <IoCreateOutline className="job-details-icon-size" />
              </div>
            </a>
          </div>
          <p className="job-paragraph paragraph">{jobDescription}</p>
          {this.renderSkills()}
          {this.renderCompanyLife()}
        </div>
        <div className="similar-job-container">
          <h1 className="similar-job-heading">Similar Jobs</h1>
        </div>
        <ul className="similar-jobs-list">
          {similarJobsData.map(eachSimilarJob => (
            <SimilarJobItem
              jobDetails={eachSimilarJob}
              key={eachSimilarJob.id}
            />
          ))}
        </ul>
      </>
    )
  }

  renderJobsDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsDetailView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="jobs-item-details-container">
          {this.renderJobsDetails()}
        </div>
      </>
    )
  }
}

export default JobItemDetails
