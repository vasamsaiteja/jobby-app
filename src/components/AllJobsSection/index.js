import {Component} from 'react'
import Cookies from 'js-cookie'

import JobCard from '../JobCard'

import './index.css'

class ALlJobsSection extends Component {
  state = {
    jobsList: [],
  }

  componentDidMount() {
    this.getJobs()
  }

  getJobs = async () => {
    const apiUrl = 'https://apis.ccbp.in/jobs'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.jobs.map(job => ({
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        id: job.id,
        jobDescription: job.job_description,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        rating: job.rating,
        title: job.title,
      }))
      this.setState({
        jobsList: updatedData,
      })
    }
  }

  renderJobsList = () => {
    const {jobsList} = this.state
    console.log(jobsList)
    return (
      <div className="jobs-container">
        <ul className="jobs-container-list">
          {jobsList.map(eachJob => (
            <JobCard JobData={eachJob} key={eachJob.id} />
          ))}
        </ul>
      </div>
    )
  }

  render() {
    return <>{this.renderJobsList()}</>
  }
}

export default ALlJobsSection
