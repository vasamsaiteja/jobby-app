import {BsStarFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import {FaBriefcase} from 'react-icons/fa'

import './index.css'

const SimilarJobItem = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = jobDetails
  return (
    <li className="job-item job-link">
      <div className="job-title-container">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
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
      <h1 className="job-description">Description</h1>
      <p className="job-paragraph">{jobDescription}</p>
      <div className="similar-job-address-container">
        <div className="location-container">
          <MdLocationOn className="location-icon" />
          <p className="job-location">{location}</p>
        </div>
        <div className="location-container">
          <FaBriefcase className="location-icon employment-icon" />
          <p className="job-location">{employmentType}</p>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobItem
