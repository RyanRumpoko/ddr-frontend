import React from 'react'
import { CCol, CRow, CForm, CFormSelect } from '@coreui/react'

const ItemsPerPageComponent = ({ perPage, setPerPage, setCurrentPage }) => {
  return (
    <CRow>
      <CCol lg="12">
        <CForm className="my-2 float-end">
          <CRow>
            <CCol lg="7">Items per page:</CCol>
            <CCol lg="5">
              <CFormSelect
                name="collection"
                value={perPage}
                onChange={(e) => {
                  setPerPage(parseInt(e.target.value))
                  setCurrentPage(1)
                }}
                options={[
                  // { label: '1', value: 1 },
                  { label: '25', value: 25 },
                  { label: '50', value: 50 },
                  { label: '100', value: 100 },
                ]}
              />
            </CCol>
          </CRow>
        </CForm>
      </CCol>
    </CRow>
  )
}

export default ItemsPerPageComponent
