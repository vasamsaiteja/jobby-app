import {BsStarFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import {FaBriefcase} from 'react-icons/fa'

import './index.css'

const JobCard = props => {
  const {JobData} = props
  const {
    title,
    rating,
    location,
    jobDescription,
    packagePerAnnum,
    employmentType,
    companyLogoUrl,
  } = JobData
  return (
    <li className="job-item">
      <div className="job-title-container">
        <img src={companyLogoUrl} alt="company logo" className="company-logo" />
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
      <p className="job-description">Description</p>
      <p className="job-paragraph">{jobDescription}</p>
    </li>
  )
}

export default JobCard
