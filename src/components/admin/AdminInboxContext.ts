import { createContext } from 'react'
import { emptyInbox } from '../../api/adminInbox'
export const AdminInboxContext = createContext(emptyInbox)
