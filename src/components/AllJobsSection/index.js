import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import JobCard from '../JobCard'
import FiltersGroup from '../FiltersGroup'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ALlJobsSection extends Component {
  state = {
    jobsList: [],
    activeEmploymentId: '',
    activeSalaryId: '',
    search: '',
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobs()
  }

  getJobs = async () => {
    const {activeEmploymentId, activeSalaryId, search} = this.state
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${activeEmploymentId}&minimum_package=${activeSalaryId}&search=${search}`
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
        apiStatus: apiStatusConstants.success,
      })
    } else {
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
    this.getJobs()
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

  renderJobsList = () => {
    const {jobsList} = this.state
    console.log(jobsList)
    const jobsListLength = jobsList.length > 0
    return jobsListLength ? (
      <div className="jobs-container">
        <ul className="jobs-container-list">
          {jobsList.map(eachJob => (
            <JobCard JobData={eachJob} key={eachJob.id} />
          ))}
        </ul>
      </div>
    ) : (
      <div className="no-jobs-view">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="no-jobs-img"
        />
        <h1 className="no-jobs-heading">No Jobs Found</h1>
        <p className="no-jobs-description">
          We could not find any jobs.Try other filters.
        </p>
      </div>
    )
  }

  renderAllJobs = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsList()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  changeEmploymentType = employmentId => {
    this.setState({activeEmploymentId: employmentId}, this.getJobs)
  }

  changeSalaryType = id => {
    this.setState({activeSalaryId: id}, this.getJobs)
  }

  enterSearchInput = () => {
    this.getJobs()
  }

  changeSearchInput = searchInput => {
    this.setState({search: searchInput})
  }

  render() {
    const {search} = this.state

    return (
      <div className="all-jobs-section">
        <FiltersGroup
          search={search}
          changeSearchInput={this.changeSearchInput}
          enterSearchInput={this.enterSearchInput}
          employmentTypesList={employmentTypesList}
          changeEmploymentType={this.changeEmploymentType}
          salaryRangesList={salaryRangesList}
          changeSalaryType={this.changeSalaryType}
        />
        {this.renderAllJobs()}
      </div>
    )
  }
}

export default ALlJobsSection
