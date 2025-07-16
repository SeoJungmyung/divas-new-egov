import React, { useState, Suspense } from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';

import URL from 'context/url';

import EgovLogin from 'divas/com/EgovLogin';
import Main from 'divas/com/Main';

import './js/ui';

// import './css/base.css';
// import './css/layout.css';
// import './css/component.css';
// import './css/page.css';
import './css/login.css';
import './css/main.css';

function App() {
  const [loginVO, setLoginVO] = useState({});
  console.group("App");
  console.log("[Start] EgovApp ------------------------------");
  console.groupEnd("EgovApp");
  const history = useHistory();
  
  React.useEffect(() => {
    if(!loginVO){
      history.push('/login'); // 마운트 될 때 /login에 해당하는 페이지로 이동
    }
  }, [])
  
  console.log("------------------------------EgovApp [End]");
  console.groupEnd("App");

  return (
    <div className="App">
      <div className="content">
        <Suspense fallback={<div></div>}>
          <Switch>
            {/* Login routes */}
            <Route exact path="/">
              <EgovLogin
                loginUser={loginVO}
                onChangeLogin={(user) => setLoginVO(user)}
              />
            </Route>
            <Route exact path={URL.LOGIN}>
              <EgovLogin
                loginUser={loginVO}
                onChangeLogin={(user) => setLoginVO(user)}
              />
            </Route>
            
            <Route path="/">
              <Main />
            </Route>
          </Switch>
        </Suspense>
      </div>
    </div>
  );
}

console.log("process.env.NODE_ENV", process.env.NODE_ENV);
console.log("process.env.REACT_APP_EGOV_CONTEXT_URL", process.env.REACT_APP_EGOV_CONTEXT_URL);

export default App;