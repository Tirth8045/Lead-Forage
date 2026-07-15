const BASE = 'http://localhost:5000/api'

async function request(endpoint, options = {}) {
  let res
  try {
    res = await fetch(`${BASE}${endpoint}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    })
  } catch (err) {
    throw new Error('Network error: Unable to connect to server. Please check if the server is running.')
  }

  if (!res.ok) {
    let message = 'Request failed'
    try {
      const body = await res.json()
      message = body.message || message
    } catch {
      message = res.statusText || message
    }
    throw new Error(message)
  }

  const text = await res.text()
  return text ? JSON.parse(text) : null
}

export const api = {
  auth: {
    register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    logout: () => request('/auth/logout', { method: 'POST' }),
    me: () => request('/auth/me'),
    getUsers: () => request('/auth/users'),
    updateUserRole: (id, role) => request(`/auth/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),
  },
  leads: {
    list: (params) => request('/leads' + (params ? '?' + new URLSearchParams(params) : '')),
    get: (id) => request(`/leads/${id}`),
    create: (data) => request('/leads', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/leads/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id) => request(`/leads/${id}`, { method: 'DELETE' }),
    assign: (id, assignedTo) => request(`/leads/${id}/assign`, { method: 'PATCH', body: JSON.stringify({ assignedTo }) }),
    convert: (id) => request(`/leads/${id}/convert`, { method: 'POST' }),
  },
  contacts: {
    list: (params) => request('/contacts' + (params ? '?' + new URLSearchParams(params) : '')),
    get: (id) => request(`/contacts/${id}`),
    create: (data) => request('/contacts', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/contacts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id) => request(`/contacts/${id}`, { method: 'DELETE' }),
  },
  pipeline: {
    get: (params) => request('/pipeline' + (params ? '?' + new URLSearchParams(params) : '')),
    getDeals: (params) => request('/pipeline/deals' + (params ? '?' + new URLSearchParams(params) : '')),
    addStage: (data) => request('/pipeline/stages', { method: 'POST', body: JSON.stringify(data) }),
    updateStage: (id, data) => request(`/pipeline/stages/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteStage: (id) => request(`/pipeline/stages/${id}`, { method: 'DELETE' }),
    addDeal: (data) => request('/pipeline/deals', { method: 'POST', body: JSON.stringify(data) }),
    updateDeal: (id, data) => request(`/pipeline/deals/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    moveDeal: (id, data) => request(`/pipeline/deals/${id}/move`, { method: 'PUT', body: JSON.stringify({ targetStageId: data.stageId, order: data.order }) }),
    deleteDeal: (id) => request(`/pipeline/deals/${id}`, { method: 'DELETE' }),
    assignDeal: (id, assignedTo) => request(`/pipeline/deals/${id}/assign`, { method: 'PATCH', body: JSON.stringify({ assignedTo }) }),
  },
  followUps: {
    list: (params) => request('/follow-ups' + (params ? '?' + new URLSearchParams(params) : '')),
    create: (data) => request('/follow-ups', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/follow-ups/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    complete: (id) => request(`/follow-ups/${id}/complete`, { method: 'PUT' }),
    remove: (id) => request(`/follow-ups/${id}`, { method: 'DELETE' }),
  },
  notes: {
    list: (params) => request('/notes' + (params ? '?' + new URLSearchParams(params) : '')),
    create: (data) => request('/notes', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/notes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id) => request(`/notes/${id}`, { method: 'DELETE' }),
  },
  settings: {
    list: () => request('/settings'),
    get: (key) => request(`/settings/${key}`),
    upsert: (data) => request('/settings', { method: 'POST', body: JSON.stringify(data) }),
    remove: (key) => request(`/settings/${key}`, { method: 'DELETE' }),
  },
  dashboard: {
    stats: () => request('/dashboard/stats'),
  },
}
