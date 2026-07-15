import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { api } from '@/services/api'
import { useToast } from '@/lib/toast'

const roleColors = {
  admin: '#EF4444',
  manager: '#818CF8',
  sales: '#10B981',
}

export default function Team() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)
  const [updating, setUpdating] = useState(null)
  const toast = useToast()

  useEffect(() => {
    api.auth.me().then(res => setCurrentUser(res.data)).catch(() => {})
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await api.auth.getUsers()
      setUsers(res.data || res)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const handleRoleChange = async (userId, newRole) => {
    setUpdating(userId)
    try {
      await api.auth.updateUserRole(userId, newRole)
      toast('Role updated successfully')
      fetchUsers()
    } catch (err) {
      toast(err.message)
    } finally {
      setUpdating(null)
    }
  }

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#6366F1' }} />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold" style={{
          fontFamily: 'Manrope, sans-serif',
          letterSpacing: '-0.04em', color: '#FFFFFF',
        }}>
          Sales Team
        </h1>
      </div>

      <div className="rounded-xl overflow-hidden glass">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                {['Name', 'Email', 'Role', 'Status', 'Joined'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-bold text-sm uppercase tracking-wider" style={{
                    fontFamily: 'Manrope, sans-serif', letterSpacing: '0.05em', color: '#94A3B8',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8" style={{ fontFamily: 'Manrope, sans-serif', color: '#94A3B8', fontSize: '14px' }}>
                    No team members found.
                  </td>
                </tr>
              ) : (
                users.map((user, i) => {
                  const isAdmin = currentUser?.role === 'admin'
                  const roleColor = roleColors[user.role] || roleColors.sales
                  return (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:opacity-80 transition-opacity"
                      style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}
                    >
                      <td className="px-4 py-3 font-semibold" style={{ fontFamily: 'Manrope, sans-serif', color: '#FFFFFF', fontSize: '14px' }}>{user.fullName}</td>
                      <td className="px-4 py-3" style={{ fontFamily: 'Manrope, sans-serif', color: '#CBD5E1', fontSize: '14px' }}>{user.email}</td>
                      <td className="px-4 py-3">
                        {isAdmin ? (
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                            disabled={updating === user._id}
                            style={{
                              background: `${roleColor}20`,
                              border: `2px solid ${roleColor}60`,
                              color: roleColor,
                              borderRadius: '6px',
                              fontFamily: 'Manrope, sans-serif',
                              fontSize: '13px',
                              fontWeight: 700,
                              padding: '5px 28px 5px 10px',
                              cursor: updating === user._id ? 'not-allowed' : 'pointer',
                              width: 'auto',
                              outline: 'none',
                              appearance: 'auto',
                            }}
                          >
                            <option value="sales" style={{ background: '#1A1A3E', color: '#E2E8F0' }}>Sales</option>
                            <option value="manager" style={{ background: '#1A1A3E', color: '#E2E8F0' }}>Manager</option>
                            <option value="admin" style={{ background: '#1A1A3E', color: '#E2E8F0' }}>Admin</option>
                          </select>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-xs capitalize font-semibold" style={{
                            background: `${roleColor}15`,
                            color: roleColor,
                            fontFamily: 'Manrope, sans-serif',
                            border: `1px solid ${roleColor}30`,
                          }}>
                            {user.role}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{
                          background: user.isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: user.isActive ? '#10B981' : '#EF4444',
                          fontFamily: 'Manrope, sans-serif',
                          border: `1px solid ${user.isActive ? '#10B981' : '#EF4444'}30`,
                        }}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3" style={{ fontFamily: 'Manrope, sans-serif', color: '#CBD5E1', fontSize: '14px' }}>
                        {formatDate(user.createdAt)}
                      </td>
                    </motion.tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
