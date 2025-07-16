import React, { Suspense } from 'react';
import { Route, Switch, useLocation, Redirect } from 'react-router-dom';
import componentRegistry from 'context/componentRegistry';
import { getCookie } from 'divas/com/Cookie';
import URL from 'context/url';

function Routes(props) {
    const location = useLocation();
    
    const isAuthenticated = getCookie("is_login") === "1";
    const hasRequiredState = location.state && location.state.commonVO;
    
    if (!isAuthenticated || !hasRequiredState) {
        return <Redirect to={URL.LOGIN} />;
    }
    
    return (
        <Suspense fallback={<div></div>}>
            <Switch>
                <Route 
                    exact 
                    path="/main" 
                    render={(routeProps) => (
                        <Redirect 
                            to={{
                                pathname: "/main/dashboard",
                                state: location.state
                            }} 
                        />
                    )} 
                />
                
                {Object.entries(componentRegistry).map(([path, Component]) => (
                    <Route 
                        key={path}
                        path={path}
                        render={(routeProps) => (
                            <Component 
                                {...routeProps} 
                                count={props?.layoutCount || 0}
                                load_time={location.state?.commonVO?.load_time || 10}
                                reload={() => console.log('reload')}
                            />
                        )}
                    />
                ))}
            </Switch>
        </Suspense>
    );
}

export default Routes;
