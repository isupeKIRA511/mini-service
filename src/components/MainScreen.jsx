import React, { useRef, useState } from 'react';

const MainScreen = ({ go }) => {
  const authCodeRef = useRef('');
  const tokenRef = useRef('');
  const [authCodeDisplay, setAuthCodeDisplay] = useState('No auth code');
  const [view, setView] = useState('main');
  const [scannedCode, setScannedCode] = useState('');
  const [garageName, setGarageName] = useState('');
  const [parkingTime, setParkingTime] = useState('');

  function authenticate() {
    my.getAuthCode({
      scopes: ['auth_base', 'USER_ID'],
      success: (res) => {
        authCodeRef.current = res.authCode;
        setAuthCodeDisplay(authCodeRef.current);

        const authCodeElement = document.getElementById('authCode');
        if (authCodeElement) {
          authCodeElement.textContent = authCodeRef.current;
        }

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
        console.log(res.authErrorScopes);
      },
    });
  }

  function pay() {
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
          setAuthCodeDisplay(authCode);
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

  function scan() {
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
                setView('details');
              }).catch(() => {
                setGarageName('Garage ' + code);
                setParkingTime('1 hour');
                setView('details');
              });
            },
            fail: () => my.alert({ content: 'Scan failed' })
          });
        }).catch(() => my.alert({ content: 'Authentication required to scan' }));
      }
    });
  }

  function backToMain() {
    setView('main');
  }

  if (view === 'details') {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-500">
        <div className="p-6 bg-white rounded shadow text-center w-full max-w-md mx-4">
          <h2 className="text-xl font-bold mb-2">{garageName}</h2>
          <p className="mb-4">Parking time: <strong>{parkingTime}</strong></p>
          <div className="flex justify-center gap-4">
            <button
              onClick={pay}
              className="border border-black bg-blue-900 px-6 py-2 text-white rounded"
            >
              Pay
            </button>
            <button
              onClick={backToMain}
              className="border border-black bg-gray-300 px-6 py-2 rounded"
            >
              Back
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gray-500 px-4 py-16 pb-24">

      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome to the World of Natural Care
        </h1>
        <p className="mt-1 text-sm text-gray-100">
          Discover your ideal natural care collection—curated just for you.
        </p>
      </header>


      <div className="grid gap-4">

        {go && (
          <button
            onClick={() => go("products")}
            className="flex items-center justify-between rounded bg-white p-5 shadow-sm active:scale-95 transition"
          >
            <div className="flex flex-col items-start">
              <h2 className="text-lg font-semibold">🛒 Products</h2>
              <p className="text-sm text-gray-500">
                Browse all available products
              </p>
            </div>
            <span className="text-xl text-gray-400">›</span>
          </button>
        )}


        {go && (
          <button
            onClick={() => go("orders")}
            className="flex items-center justify-between rounded bg-white p-5 shadow-sm active:scale-95 transition"
          >
            <div className="flex flex-col items-start">
              <h2 className="text-lg font-semibold">📦 Orders</h2>
              <p className="text-sm text-gray-500">View your previous orders</p>
            </div>
            <span className="text-xl text-gray-400">›</span>
          </button>
        )}


        <button
          className="flex items-center justify-between rounded bg-white p-5 shadow-sm opacity-60"
          disabled
        >
          <div className="flex flex-col items-start">
            <h2 className="text-lg font-semibold">👤 Profile</h2>
            <p className="text-sm text-gray-500">
              Account settings (coming soon)
            </p>
          </div>
          <span className="text-xl text-gray-300">›</span>
        </button>


        <button
          onClick={scan}
          className="border border-amber-950 bg-blue-900 text-white py-4 rounded"
        >
          Scan
        </button>


        <button
          onClick={authenticate}
          className="border border-amber-950 bg-blue-900 text-white py-4 rounded"
        >
          Auth
        </button>
        <p id="authCode" className="text-sm text-gray-100 mt-2">
          {authCodeDisplay}
        </p>


        <button
          onClick={pay}
          className="border border-amber-950 bg-blue-900 text-white py-4 rounded"
        >
          Pay
        </button>
      </div>
    </div>
  );
};

export default MainScreen;

