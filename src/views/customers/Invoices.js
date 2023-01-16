import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useQuery, useLazyQuery, gql } from '@apollo/client'
import { useNavigate } from 'react-router-dom'

const GET_INVOICES_BY_CUSTOMER_ID = gql`
  query GetInvoiceByCustomerId($id: ID) {
    getInvoiceByCustomerId(id: $id) {
      _id
      invoice_number
    }
  }
`

const Invoices = () => {
  const { state } = useLocation()
  const [invoiceList, setInvoiceList] = useState([])

  let navigate = useNavigate()

  const [getInvoices, { loading }] = useLazyQuery(GET_INVOICES_BY_CUSTOMER_ID, {
    onCompleted: (data) => {
      console.log(data.getInvoiceByCustomerId)
      setInvoiceList(data.getInvoiceByCustomerId)
    },
    onError(err) {
      console.log(err)
    },
    fetchPolicy: 'cache-and-network',
  })

  useEffect(() => {
    if (state === null) navigate('/404')
    else {
      getInvoices({
        variables: {
          id: state._id,
        },
      })
    }
  }, [])

  return <div>Invoices</div>
}

export default Invoices
