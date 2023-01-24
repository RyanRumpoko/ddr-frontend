import React from 'react'
import { CRow, CCol, CWidgetStatsA } from '@coreui/react'
import { useQuery, gql } from '@apollo/client'

const GET_TOTAL_TODAY_CUSTOMER = gql`
  query GetTotalInvoicesToday {
    getTotalInvoicesToday
  }
`

const Dashboard = () => {
  const { data, loading } = useQuery(GET_TOTAL_TODAY_CUSTOMER)
  return (
    <>
      <CRow className="justify-content-center">
        <CCol sm="6" lg="4">
          {!loading && (
            <CWidgetStatsA
              style={{ height: '100px' }}
              color="info"
              value={data.getTotalInvoicesToday}
              title="Total Mobil Hari Ini"
            />
          )}
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
