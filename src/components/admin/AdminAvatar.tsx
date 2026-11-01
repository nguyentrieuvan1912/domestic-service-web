import { useEffect, useState } from 'react'
import AvatarPicker from '../common/AvatarPicker'
import { identityRequest } from '../../api/identity'

export default function AdminAvatar() {
  const [avatar, setAvatar] = useState('')
  useEffect(() => {
    let active = true
    void identityRequest<{ avatar: string }>('/auth/profile', {}, 'ADMIN').then(profile => { if (active) setAvatar(profile.avatar) }).catch(() => undefined)
    return () => { active = false }
  }, [])
  return <AvatarPicker compact value={avatar} onChange={async value => {
    const saved = await identityRequest<{ avatar: string }>('/auth/avatar', { method: 'PATCH', body: JSON.stringify({ avatar: value }) }, 'ADMIN')
    setAvatar(saved.avatar)
  }} />
}
