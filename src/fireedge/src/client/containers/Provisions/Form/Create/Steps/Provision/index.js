import React, { useCallback, useEffect } from 'react'
import { Redirect } from 'react-router-dom'

import useFetch from 'client/hooks/useFetch'
import useProvision from 'client/hooks/useProvision'
import useListForm from 'client/hooks/useListForm'

import ListCards from 'client/components/List/ListCards'
import { EmptyCard, ProvisionTemplateCard } from 'client/components/Cards'
import { PATH } from 'client/router/provision'

import { STEP_ID as INPUTS_ID } from 'client/containers/Provisions/Form/Create/Steps/Inputs'
import { STEP_FORM_SCHEMA } from './schema'

export const STEP_ID = 'provision'

const Provision = () => ({
  id: STEP_ID,
  label: 'Provision template',
  resolver: () => STEP_FORM_SCHEMA,
  content: useCallback(({ data, setFormData }) => {
    const { getProvisionsTemplates } = useProvision()
    const { data: templates, fetchRequest, loading, error } = useFetch(
      getProvisionsTemplates
    )

    const { handleSelect, handleUnselect } = useListForm({
      key: STEP_ID,
      setList: setFormData
    })

    useEffect(() => { fetchRequest() }, [])

    const handleClick = (nameTemplate, isSelected) => {
      setFormData(({ [INPUTS_ID]: undefined }))
      isSelected ? handleUnselect(nameTemplate) : handleSelect(nameTemplate)
    }

    if (error) {
      return <Redirect to={PATH.DASHBOARD} />
    }

    return (
      <ListCards
        list={templates}
        isLoading={!templates && loading}
        EmptyComponent={
          <EmptyCard title={'Your provisions templates list is empty'} />
        }
        CardComponent={ProvisionTemplateCard}
        cardsProps={({ value: { name } }) => {
          const isSelected = data?.some(selected => selected === name)

          return {
            isSelected,
            handleClick: () => handleClick(name, isSelected)
          }
        }}
      />
    )
  }, [])
})

export default Provision