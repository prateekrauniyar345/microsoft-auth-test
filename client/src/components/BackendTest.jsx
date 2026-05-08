import { useState, useEffect } from "react";
import axiosClient from "../lib/axiosClient";
import { useAuth } from "../hooks/useAuth";

const BackendTest = () => {
    const { isAuthenticated, fetchMeFromBackend } = useAuth();
    const [defaultRouteResponse, setDefaultRouteResponse] = useState(null);
    const [apiGetInfoResponse, setApiGetInfoResponse] = useState(null);
    const [apiVersionResponse, setApiVersionResponse] = useState(null);
    const [apiMeResponse, setApiMeResponse] = useState(null);
    const [apiMeError, setApiMeError] = useState(null);

    useEffect(()=>{
        // get default route response
        async function getDefaultRoute(){
            const response = await axiosClient.get('/');
            setDefaultRouteResponse(response.data);
        }

        // get /api/info route response
        async function getApiInfoRoute(){
            const response = await axiosClient.get('/api/info');
            setApiGetInfoResponse(response.data);
        }

        // get /api/version route response
        async function getApiVersionRoute(){
            const response = await axiosClient.get('/api/version');
            setApiVersionResponse(response.data);
        }


        if(!defaultRouteResponse){
            getDefaultRoute();
        }
        if(!apiGetInfoResponse){
            getApiInfoRoute();
        }
        if(!apiVersionResponse){
            getApiVersionRoute();
        }


    }, [defaultRouteResponse, apiGetInfoResponse, apiVersionResponse]);


    useEffect(() => {
        async function getApiMeRoute() {
            try {
                const response = await fetchMeFromBackend();
                setApiMeResponse(response);
                setApiMeError(null);
            } catch (error) {
                console.error("Failed to load /api/me:", error);
                setApiMeError(error?.response?.data || error?.message || "Failed to load /api/me");
            }
        }

        if (isAuthenticated && !apiMeResponse && !apiMeError) {
            getApiMeRoute();
        }
    }, [isAuthenticated, apiMeResponse, apiMeError, fetchMeFromBackend]);



    return (
        <>
            <div className="container p-5">
                <h3>Backend Resposne : </h3>
                <hr />
                {defaultRouteResponse ? (
                    <div className="border border-primary mt-3 d-flex justify-content-start align-items-center p-3">
                        <p className="me-2">The route is : "/api/"</p>
                        <pre className="mb-0 ms-3 border border-secondary p-2">{JSON.stringify(defaultRouteResponse, null, 2)}</pre>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}

                {apiGetInfoResponse ? (
                    <div className="border border-success mt-3 d-flex justify-content-start align-items-center p-3">
                        <p className="me-2">The route is : "/api/info"</p>
                        <pre className="mb-0 ms-3 border border-secondary p-2">{JSON.stringify(apiGetInfoResponse, null, 2)}</pre>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}  

                {apiVersionResponse ? (
                    <div className="border border-warning mt-3 d-flex justify-content-start align-items-center p-3">
                        <p className="me-2">The route is : "/api/version"</p>
                        <pre className="mb-0 ms-3 border border-secondary p-2">{JSON.stringify(apiVersionResponse, null, 2)}</pre>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}

                {isAuthenticated && apiMeResponse ? (
                    <div className="border border-dark mt-3 d-flex justify-content-start align-items-center p-3">
                        <p className="me-2">The route is : "/api/me"</p>
                        <pre className="mb-0 ms-3 border border-secondary p-2">{JSON.stringify(apiMeResponse, null, 2)}</pre>
                    </div>
                ) : null}

                {isAuthenticated && apiMeError ? (
                    <div className="border border-danger mt-3 d-flex justify-content-start align-items-center p-3">
                        <p className="me-2">The route is : "/api/me"</p>
                        <pre className="mb-0 ms-3 border border-secondary p-2">{JSON.stringify(apiMeError, null, 2)}</pre>
                    </div>
                ) : null}

                {!isAuthenticated ? (
                    <div className="border border-secondary mt-3 p-3">
                        <p className="mb-0">Sign in to test the protected "/api/me" endpoint.</p>
                    </div>
                ) : null}
            </div>
        </>
    )
}

export default BackendTest;