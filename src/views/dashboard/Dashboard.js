import React from 'react'

import { CRow, CCol, CWidgetStatsA } from '@coreui/react'

import WidgetsDropdown from '../widgets/WidgetsDropdown'

const Dashboard = () => {
  return (
    <>
      <WidgetsDropdown />
      <CRow className="justify-content-center">
        <CCol sm="6" lg="3">
          <CWidgetStatsA
          // style={{ height: '100px' }}
          // color="gradient-info"
          // text="Total Staff"
          // header={dataUser.getAllUser.length.toString()}
          // onClick={() => history.push('/staff/showallstaff/ACTIVE')}
          />
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
