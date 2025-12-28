import React, { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import axios from 'axios'
import api from './api/axios'
import Hero from './components/Hero'

export default function App() {
  const [authCode, setAuthCode] = useState('')
  const [userData, setUserData] = useState(null)
  const [serverToken, setServerToken] = useState('')
  const [loading, setLoading] = useState(false)

  const authenticate = (afterSuccess) => {
    if (typeof my === 'undefined') {
      console.error('Mini-program environment not detected.')
      alert('This function requires a mini-program environment.')
      if (typeof afterSuccess === 'function') afterSuccess('')
      return
    }

    my.getAuthCode({
      scopes: ['auth_base', 'USER_ID'],
      success: (res) => {
        const code = res.authCode || ''
        setAuthCode(code)
        my.showToast({ content: 'Authenticated successfully!', type: 'success' })
        if (typeof afterSuccess === 'function') afterSuccess(code)
      },
      fail: (res) => {
        console.error('getAuthCode failed', res)
        my.alert({ content: 'Authentication failed. Please try again.' })
      },
    })
  }

  // Legacy full flow function (optional, but keeping it if needed or removing if unused)
  const handleLoginAndPay = async () => {
    // ... implementation can remain or be simplified since we are breaking it apart
    // For now, I will leave it as is, or you can use the separate buttons.
    // Let's implement the separate functions properly.
    if (typeof my === 'undefined') {
      alert('Mini-program environment required')
      return
    }
    authenticate(async (code) => {
      if (!code) return
      setLoading(true)
      const res = await postToken(code)
      setLoading(false)
      if (res.ok) {
        // Extract token
        let token = ''
        const payload = res.payload
        if (!payload) token = ''
        else if (typeof payload === 'string') token = payload
        else if (payload.token) token = payload.token
        else if (payload.record && payload.record.token) token = payload.record.token

        setServerToken(token)
        setUserData(res.payload.record || res.payload)

        // Auto pay? or just stop here? The old function did auto pay.
        // Let's call the payment logic directly.
        await handlePaymentOnly(token)
      }
    })
  }

  const handlePaymentOnly = async (tokenOverride) => {
    const tokenToUse = tokenOverride || serverToken
    // if (!tokenToUse) {
    //     alert('Please login first to get a token.')
    //     return
    // }
    // The user might want to try payment even without token if the API allows or strict checking, 
    // but usually token is needed.

    try {
      const resp = await api.post('/payment', {}, {
        headers: {
          'Authorization': tokenToUse || ''
        }
      })
      const data = resp.data

      if (typeof my !== 'undefined' && typeof my.tradePay === 'function') {
        my.tradePay({
          paymentUrl: data.url,
          success: () => my.alert({ content: 'Payment started' }),
          fail: (e) => my.alert({ content: 'Payment failed' })
        })
      } else if (data && data.url) {
        window.location.href = data.url
      } else if (data && data.orderId) {
        window.location.href = `https://www.wallet.com/cashier?orderId=${data.orderId}`
      } else {
        const msg = typeof data === 'string' ? data : JSON.stringify(data)
        my && my.alert ? my.alert({ content: 'No payment URL: ' + msg }) : alert('No payment URL: ' + msg)
      }
    } catch (err) {
      console.error('payment error', err)
      const status = err.response ? err.response.status : 'Error'
      if (typeof my !== 'undefined' && my.alert) my.alert({ content: `Payment failed: ${status}` })
      else alert(`Payment failed: ${status}`)
    }
  }

  const sendTokenToApi = async () => {
    if (!authCode) {
      if (typeof my !== 'undefined' && my.alert) my.alert({ content: 'No authCode. Click Auth first.' })
      else alert('No authCode. Click Auth first.')
      return
    }

    setLoading(true)
    const result = await postToken(authCode)
    setLoading(false)

    if (result.ok) {
      // Extract and save token
      let token = ''
      const payload = result.payload
      if (!payload) token = ''
      else if (typeof payload === 'string') token = payload
      else if (payload.token) token = payload.token
      else if (payload.record && payload.record.token) token = payload.record.token

      setServerToken(token)
      setUserData(result.payload.record || result.payload)

      my.showToast({ content: 'Login Successful!', type: 'success' })
    }
  }

  const postToken = async (token) => {
    const cleanToken = (token || '').toString().replace(/\s+/g, '')

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

    try {
      const resp = await api.post('/auth-with-superQi',
        { token: cleanToken },
        { signal: controller.signal }
      )
      clearTimeout(timeout)

      const payload = resp.data
      return { ok: true, status: resp.status, payload }

    } catch (err) {
      clearTimeout(timeout)
      console.error('postToken error', err)

      let errorMsg = 'Network error.'
      let status = 0
      let payload = null

      if (axios.isCancel(err)) {
        errorMsg = 'Request timed out.'
      } else if (err.response) {
        status = err.response.status
        payload = err.response.data
        errorMsg = `Authentication error (${status}). Please re-authenticate.`
      }

      my.alert({ content: errorMsg })
      return { ok: false, status, payload, error: err }
    }
  }

  const handleScan = () => {
    if (typeof my === 'undefined') {
      alert('QR Scan requires mini-program environment')
      return
    }
    my.scan({
      type: 'qr',
      success: (res) => {
        console.log('QR code scanned:', res.code)
        my.alert({
          title: 'Scanned Code',
          content: res.code,
        })
      },
      fail: (err) => {
        console.error('Scan failed:', err)
        my.alert({
          title: 'Scan Failed',
          content: 'Failed to scan QR code',
        })
      },
    })
  }



  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-bold text-yellow-500 flex items-center gap-2">
            <span className="bg-yellow-500 text-gray-900 px-2 py-0.5 rounded text-sm">P</span>
            PARKNOW
          </div>
          <nav className="flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Home</Link>
            <button
              onClick={handleScan}
              className="text-gray-300 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700"
              title="Scan QR Code"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
              </svg>
            </button>
            <button
              onClick={handleLoginAndPay}
              className="text-sm font-bold text-gray-900 bg-yellow-500 hover:bg-yellow-400 px-4 py-2 rounded transition-colors"
            >
              Quick Pay
            </button>
          </nav>
        </div>
      </header>

      <Routes>
        <Route
          path="/"
          element={
            <Hero
              onAuthenticate={authenticate}
              onSendApi={sendTokenToApi}
              onPayment={() => handlePaymentOnly(serverToken)}
              isLoggedIn={!!userData}
              authCode={authCode}
            />
          }
        />
      </Routes>

      <div className="fixed bottom-4 right-4 text-xs text-gray-600 bg-gray-900/80 px-2 py-1 rounded border border-gray-800 pointer-events-none">
        Debug Auth: {authCode ? '••••' + authCode.slice(-4) : 'None'}
      </div>
    </div>
  )
}

