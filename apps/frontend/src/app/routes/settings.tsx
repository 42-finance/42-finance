import React from 'react'
import { StringParam, useQueryParams, withDefault } from 'use-query-params'

import { SettingsCategories } from '../components/category/settings-categories'
import { FilterSelect } from '../components/common/filter-select'
import { SearchInput } from '../components/common/search-input/search-input'
import { SettingsConnections } from '../components/connections/settings-connections'
import { SettingsMembers } from '../components/members/settings-members'
import { SettingsMerchants } from '../components/merchant/settings-merchants'
import { SettingsProfile } from '../components/profile/settings-profile'
import { SettingsRules } from '../components/rules/settings-rules'
import { SettingsSubscription } from '../components/subscription/settings-subscription'
import { TagSettings } from '../components/tags/tag-settings'
import { debounce } from '../utils/debounce/debounce.utils'

enum Setting {
  Categories = 'categories',
  Connections = 'connections',
  Members = 'members',
  Merchants = 'merchants',
  Profile = 'profile',
  Rules = 'rules',
  Subscription = 'subscription',
  Tags = 'tags'
}

export const Settings: React.FC = () => {
  const [query, setQuery] = useQueryParams({
    setting: withDefault(StringParam, 'profile'),
    search: StringParam
  })

  const { setting, search } = query

  const options = [
    { label: 'Categories', value: Setting.Categories },
    { label: 'Connections', value: Setting.Connections },
    { label: 'Members', value: Setting.Members },
    { label: 'Merchants', value: Setting.Merchants },
    { label: 'Profile', value: Setting.Profile },
    { label: 'Rules', value: Setting.Rules },
    { label: 'Subscription', value: Setting.Subscription },
    { label: 'Tags', value: Setting.Tags }
  ]

  const showSearch = () => {
    return (
      setting === Setting.Categories ||
      setting === Setting.Merchants ||
      setting === Setting.Rules ||
      setting === Setting.Tags
    )
  }

  const renderSettings = () => {
    if (setting === Setting.Categories) {
      return <SettingsCategories />
    }

    if (setting === Setting.Connections) {
      return <SettingsConnections />
    }

    if (setting === Setting.Members) {
      return <SettingsMembers />
    }

    if (setting === Setting.Merchants) {
      return <SettingsMerchants />
    }

    if (setting === Setting.Profile) {
      return <SettingsProfile />
    }

    if (setting === Setting.Rules) {
      return <SettingsRules />
    }

    if (setting === Setting.Subscription) {
      return <SettingsSubscription />
    }

    if (setting === Setting.Tags) {
      return <TagSettings />
    }

    return null
  }

  return (
    <div className="p-4">
      <div className="flex">
        <FilterSelect<string>
          data={options}
          name="Select Setting"
          onChange={(option) => {
            setQuery({
              setting: option,
              search: undefined
            })
          }}
          value={setting}
          placeholder={`Choose setting`}
          width={'min-w-[220px]'}
          allowClear={false}
        />
        {showSearch() && (
          <div className="ml-2">
            <SearchInput
              onChange={debounce((e: React.ChangeEvent<HTMLInputElement>) => {
                setQuery(
                  {
                    search: e.target.value.trim() || undefined
                  },
                  'replaceIn'
                )
              }, 500)}
              placeholder="Search"
              defaultValue={search}
            />
          </div>
        )}
      </div>
      {renderSettings()}
    </div>
  )
}
