import React, { useState, useRef } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import axios from 'axios'
import api from './api/axios'
import LandingScreen from './components/LandingScreen'
import StudentDashboard from './components/StudentDashboard'
import DriverDashboard from './components/DriverDashboard'

export default function App() {
  const [authCode, setAuthCode] = useState('')
  const [userData, setUserData] = useState(null)
  const [serverToken, setServerToken] = useState('')
  const [loading, setLoading] = useState(false)

  const authenticate = (afterSuccess) => {
    const myEnv = (typeof my !== 'undefined' ? my : null) || (window && window.my ? window.my : null)

    if (!myEnv) {
      console.error('Mini-program environment not detected.')

      alert('Mini-app environment (window.my) not found.')
      return
    }

    myEnv.getAuthCode({
      scopes: ['auth_base', 'USER_ID'],
      success: (res) => {
        console.log('getAuthCode success:', res)
        const code = res.authCode || ''
        setAuthCode(code)

        myEnv.showToast({ content: 'Auth Code Received', type: 'success' })

        if (typeof afterSuccess === 'function') afterSuccess(code)
      },
      fail: (res) => {
        console.error('getAuthCode failed', res)
        myEnv.alert({ content: 'Authentication failed: ' + JSON.stringify(res) })
      },
    })
  }



  const handlePaymentOnly = async (tokenOverride) => {
    const tokenToUse = tokenOverride || serverToken


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


  const authCodeRef = useRef('')
  const tokenRef = useRef('')
  const [scannedCode, setScannedCode] = useState('')
  const [garageName, setGarageName] = useState('')
  const [parkingTime, setParkingTime] = useState('')
  const [showGarageDetails, setShowGarageDetails] = useState(false)

  function authenticateDirect() {
    my.getAuthCode({
      scopes: ['auth_base', 'USER_ID'],
      success: (res) => {
        authCodeRef.current = res.authCode;
        setAuthCode(res.authCode);

        fetch('https://its.mouamle.space/api/auth-with-superQi', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            token: authCodeRef.current
          })
        }).then(res => res.json()).then(data => {
          tokenRef.current = data.token;
          setServerToken(data.token);
          my.alert({
            content: "Login successful",
          });
        }).catch(err => {
          let errorDetails = '';
          if (err && typeof err === 'object') {
            errorDetails = JSON.stringify(err, null, 2);
          } else {
            errorDetails = String(err);
          }
          my.alert({
            content: "Error: " + errorDetails,
          });
        });
      },
      fail: (res) => {
        console.log(res.authErrorScopes)
      },
    });
  }

  function payDirect() {
    fetch('https://its.mouamle.space/api/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': tokenRef.current
      },
    }).then(res => res.json()).then(data => {
      my.tradePay({
        paymentUrl: data.url,
        success: (res) => {
          my.alert({
            content: "Payment successful",
          });
        },
      });
    }).catch(err => {
      my.alert({
        content: "Payment failed",
      });
    });
  }

  function authenticatePromise() {
    return new Promise((resolve, reject) => {
      my.getAuthCode({
        scopes: ['auth_base', 'USER_ID'],
        success: (res) => {
          const authCode = res.authCode;
          authCodeRef.current = authCode;
          setAuthCode(authCode);
          my.alert({ content: 'Got auth code: ' + authCode });

          fetch('https://its.mouamle.space/api/auth-with-superQi', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: authCode })
          }).then(r => {
            if (!r.ok) throw new Error('Auth API error ' + r.status);
            return r.json();
          }).then(data => {
            tokenRef.current = data.token;
            setServerToken(data.token);
            my.alert({ content: 'Login successful' });
            resolve(tokenRef.current);
          }).catch(err => {
            my.alert({ content: 'Authentication failed: ' + (err && err.message ? err.message : JSON.stringify(err)) });
            reject(err);
          });
        },
        fail: (res) => {
          my.alert({ content: 'getAuthCode failed: ' + JSON.stringify(res) });
          reject(res);
        }
      });
    });
  }

  function scanDirect() {
    my.confirm({
      title: 'Authentication required',
      content: 'Allow authentication to proceed with scanning?',
      confirmButtonText: 'Allow',
      cancelButtonText: 'Cancel',
      success: (res) => {
        const allowed = res && (
          res.confirm === true ||
          res === true ||
          res.confirm === 'confirm' ||
          res.ok === true
        );
        if (!allowed) return;

        my.alert({ content: 'Proceeding to authenticate...' });
        authenticatePromise().then(() => {
          my.scan({
            type: 'qr',
            success: (res) => {
              const code = res.code;
              setScannedCode(code);

              fetch('https://its.mouamle.space/api/garage-info', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': tokenRef.current
                },
                body: JSON.stringify({ code: code })
              }).then(r => r.json()).then(data => {
                setGarageName(data.name || ('Garage ' + code));
                setParkingTime(data.parkingTime || '1 hour');
                setShowGarageDetails(true);
              }).catch(() => {
                setGarageName('Garage ' + code);
                setParkingTime('1 hour');
                setShowGarageDetails(true);
              });
            },
            fail: () => my.alert({ content: 'Scan failed' })
          });
        }).catch(() => my.alert({ content: 'Authentication required to scan' }));
      }
    });
  }

  const handleScan = scanDirect



  const [view, setView] = useState('landing')

  const handleLogin = (role) => {

    authenticate((code) => {

      if (!code) {
        console.warn('Authentication returned no code')
        return
      }

      setLoading(true)
      postToken(code).then((result) => {
        setLoading(false)
        if (result.ok) {
          let token = ''
          let userId = ''
          const payload = result.payload
          const record = payload.record || payload


          if (!payload) token = ''
          else if (typeof payload === 'string') token = payload
          else if (payload.token) token = payload.token
          else if (record && record.token) token = record.token


          if (record && record.id) userId = record.id
          else if (record && record.userId) userId = record.userId
          else if (payload.id) userId = payload.id

          setServerToken(token)
          setUserData(record)

          setView(role)


          const myEnv = (typeof my !== 'undefined' ? my : null) || (window && window.my ? window.my : null)
          if (myEnv && myEnv.showToast) {
            myEnv.showToast({ content: `Login Success!`, type: 'success' })
          }
        } else {
          const myEnv = (typeof my !== 'undefined' ? my : null) || (window && window.my ? window.my : null)
          const msg = result.payload && result.payload.message ? result.payload.message : 'Login failed from server'
          if (myEnv && myEnv.alert) myEnv.alert({ content: msg })
          else alert(msg)
        }
      })
    })
  }

  return (
    <>
      {view === 'landing' && (
        <LandingScreen
          onSelectRole={handleLogin}
          loading={loading}
        />
      )}

      {view === 'student' && (
        <StudentDashboard
          userData={userData}
          authCode={authCode}
          onPayment={() => handlePaymentOnly(serverToken)}
          onAuthenticate={authenticateDirect}
          onPay={payDirect}
          onScan={scanDirect}
        />
      )}

      {view === 'driver' && (
        <DriverDashboard
          onAuthenticate={authenticateDirect}
          onPay={payDirect}
          onScan={scanDirect}
          garageName={garageName}
          parkingTime={parkingTime}
          scannedCode={scannedCode}
          showGarageDetails={showGarageDetails}
          onCloseGarageDetails={() => setShowGarageDetails(false)}
        />
      )}


      {showGarageDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full text-center">
            <h2 className="text-xl font-bold mb-2">{garageName}</h2>
            <p className="mb-4">Parking time: <strong>{parkingTime}</strong></p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  payDirect();
                  setShowGarageDetails(false);
                }}
                className="border border-black bg-blue-900 px-6 py-2 text-white rounded"
              >
                Pay
              </button>
              <button
                onClick={() => setShowGarageDetails(false)}
                className="border border-black bg-gray-300 px-6 py-2 rounded"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}


      <div className="fixed bottom-4 left-4 text-[10px] text-slate-300 bg-slate-900/50 px-2 py-1 rounded backdrop-blur-sm pointer-events-none z-50 ltr" dir="ltr">
        Build: Dev | Auth: {authCode ? 'OK' : 'No'} | View: {view}
      </div>
    </>
  )
}

